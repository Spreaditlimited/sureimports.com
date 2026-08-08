import crypto from 'crypto';
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { grantIntelligenceCredits } from '@/lib/intelligence/credits';
import { getConfiguredIntelligencePlan } from '@/lib/intelligence/plans';
import {
  confirmReportOrderPayment,
  transitionReportOrderAccess,
} from '@/lib/intelligence/reportOrders';
import { fulfillConsultationPayment } from '@/lib/consultationFulfillment';
import { resolvePaystackAccessStatus } from '@/lib/intelligence/reportOrderPolicy';

const PAYSTACK_SECRET_KEY = process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY;

type IntelligenceSubscriptionRow = {
  pidSubscription: string;
  pidUser: string;
  email: string;
  plan: string;
  status: string;
};

function addMonths(date: Date, months: number) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

function getPaymentSubscriptionCode(payment: any) {
  if (typeof payment?.subscription === 'string') return payment.subscription;
  return (
    payment?.subscription?.subscription_code ||
    payment?.subscription_code ||
    payment?.metadata?.subscription_code ||
    null
  );
}

function getSubscriptionCodeFromEvent(data: any) {
  return (
    data?.subscription_code ||
    data?.subscription?.subscription_code ||
    data?.data?.subscription_code ||
    null
  );
}

function signatureIsValid(body: string, signature: string | null) {
  if (!PAYSTACK_SECRET_KEY || !signature) return false;

  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(body)
    .digest('hex');

  const expected = Buffer.from(hash);
  const received = Buffer.from(signature);
  return (
    expected.length === received.length &&
    crypto.timingSafeEqual(expected, received)
  );
}

export async function POST(request: Request) {
  const rawBody = await request.text();

  if (!signatureIsValid(rawBody, request.headers.get('x-paystack-signature'))) {
    return NextResponse.json(
      { message: 'Invalid signature.' },
      { status: 401 },
    );
  }

  const payload = JSON.parse(rawBody);
  const event = String(payload?.event || '').trim();

  if (event.startsWith('refund.') || event.startsWith('charge.dispute.')) {
    const data = payload?.data || {};
    const reference = String(
      data.transaction_reference ||
        data.transaction?.reference ||
        data.reference ||
        '',
    ).trim();
    const order = reference
      ? await prisma.intelligence_report_orders.findFirst({
          where: { providerReference: reference, paymentProvider: 'paystack' },
        })
      : null;
    if (!order) return NextResponse.json({ received: true });

    const providerEventId = `paystack:${event}:${String(
      data.refund_reference || data.id || reference,
    )}`;
    if (event === 'refund.processed') {
      const refundedAmount = Number(data.amount || 0);
      const accessStatus = resolvePaystackAccessStatus(
        event,
        refundedAmount,
        order.amountMinor,
      );
      await transitionReportOrderAccess({
        pidOrder: order.pidOrder,
        status: accessStatus || 'disputed',
        source: 'paystack',
        eventType:
          accessStatus === 'refunded'
            ? 'refund_processed'
            : 'partial_refund_review',
        providerEventId,
        reason:
          accessStatus === 'refunded'
            ? 'Paystack confirmed a full refund.'
            : 'Paystack confirmed a partial refund; manual review required.',
      });
    } else if (
      event === 'charge.dispute.create' ||
      event === 'charge.dispute.remind'
    ) {
      await transitionReportOrderAccess({
        pidOrder: order.pidOrder,
        status: 'disputed',
        source: 'paystack',
        eventType: event,
        providerEventId,
        reason: 'Paystack reported an open payment dispute.',
      });
    } else if (event === 'charge.dispute.resolve') {
      const accessStatus = resolvePaystackAccessStatus(
        event,
        Number(data.refund_amount || 0),
        order.amountMinor,
      );
      await transitionReportOrderAccess({
        pidOrder: order.pidOrder,
        status: accessStatus || 'disputed',
        source: 'paystack',
        eventType: event,
        providerEventId,
        reason:
          'Paystack reported a resolved dispute; access remains blocked pending review.',
      });
    }
    return NextResponse.json({ received: true });
  }

  if (
    event === 'charge.success' &&
    payload?.data?.status === 'success' &&
    payload?.data?.metadata?.product === 'sureimports_consultation'
  ) {
    try {
      const result = await fulfillConsultationPayment(payload.data);
      return NextResponse.json({ received: true, status: result.status });
    } catch (error) {
      console.error('Consultation webhook fulfillment failed:', error);
      return NextResponse.json(
        { message: 'Consultation fulfillment failed.' },
        { status: 500 },
      );
    }
  }

  if (event.startsWith('subscription.')) {
    const subscriptionCode = getSubscriptionCodeFromEvent(payload.data);
    if (!subscriptionCode) {
      return NextResponse.json({ received: true });
    }

    const eventStatus = String(payload.data?.status || '')
      .trim()
      .toLowerCase();

    if (
      event === 'subscription.disable' ||
      event === 'subscription.not_renew' ||
      eventStatus === 'non-renewing'
    ) {
      await prisma.$executeRaw`
        UPDATE intelligence_subscriptions
        SET
          status = 'non_renewing',
          cancelledAt = COALESCE(cancelledAt, ${new Date()}),
          updatedAt = ${new Date()}
        WHERE paystackSubscriptionCode = ${subscriptionCode}
          AND status IN ('active', 'non_renewing')
      `;
    }

    return NextResponse.json({ received: true });
  }

  if (
    payload?.event !== 'charge.success' ||
    payload?.data?.status !== 'success'
  ) {
    return NextResponse.json({ received: true });
  }

  const payment = payload.data;
  if (payment?.metadata?.product === 'supplier_intelligence_report') {
    const pidOrder = String(payment.metadata?.pidOrder || '').trim();
    const order = pidOrder
      ? await prisma.intelligence_report_orders.findUnique({
          where: { pidOrder },
        })
      : null;
    if (
      order &&
      order.paymentProvider === 'paystack' &&
      order.providerReference === payment.reference &&
      Number(payment.amount) === order.amountMinor &&
      String(payment.currency || '').toUpperCase() === order.currency &&
      String(payment.metadata?.pidReport || '') === order.reportId &&
      String(payment.metadata?.pidVersion || '') === order.versionId
    ) {
      await confirmReportOrderPayment({
        pidOrder: order.pidOrder,
        source: 'paystack',
        paidAt: payment.paid_at ? new Date(payment.paid_at) : null,
        providerEventId: `paystack:charge.success:${String(payment.id || payment.reference)}`,
      });
    }
    return NextResponse.json({ received: true });
  }
  const subscriptionCode = getPaymentSubscriptionCode(payment);
  const customerCode = payment.customer?.customer_code || null;
  const email = payment.customer?.email || payment.email || null;

  const subscriptions = subscriptionCode
    ? await prisma.$queryRaw<IntelligenceSubscriptionRow[]>`
        SELECT pidSubscription, pidUser, email, plan, status
        FROM intelligence_subscriptions
        WHERE paystackSubscriptionCode = ${subscriptionCode}
          AND plan IN ('starter', 'pro')
        ORDER BY createdAt DESC
        LIMIT 1
      `
    : await prisma.$queryRaw<IntelligenceSubscriptionRow[]>`
        SELECT pidSubscription, pidUser, email, plan, status
        FROM intelligence_subscriptions
        WHERE plan IN ('starter', 'pro')
          AND status IN ('active', 'non_renewing')
          AND (
            paystackCustomerCode = ${customerCode}
            OR email = ${email}
          )
        ORDER BY createdAt DESC
        LIMIT 1
      `;

  const subscription = subscriptions[0];
  if (
    !subscription ||
    (subscription.plan !== 'starter' && subscription.plan !== 'pro')
  ) {
    return NextResponse.json({ received: true });
  }

  const paidAt = payment.paid_at ? new Date(payment.paid_at) : new Date();
  const periodEnd = addMonths(paidAt, 1);

  await prisma.$executeRaw`
    UPDATE intelligence_subscriptions
    SET
      status = 'active',
      currentPeriodStart = ${paidAt},
      currentPeriodEnd = ${periodEnd},
      updatedAt = ${new Date()}
    WHERE pidSubscription = ${subscription.pidSubscription}
  `;

  const paidPlan = await getConfiguredIntelligencePlan(subscription.plan);

  await grantIntelligenceCredits({
    pidUser: subscription.pidUser,
    amount: paidPlan.monthlySearchCredits,
    reason: `${subscription.plan}_monthly_search_credits`,
    reference:
      payment.reference ||
      `${subscription.pidSubscription}:${periodEnd.toISOString().slice(0, 10)}`,
  });

  return NextResponse.json({ received: true });
}
