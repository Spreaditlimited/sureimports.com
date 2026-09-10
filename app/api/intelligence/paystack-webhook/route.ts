import crypto from 'crypto';
import { after, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { grantIntelligenceCredits } from '@/lib/intelligence/credits';
import { getConfiguredIntelligencePlan } from '@/lib/intelligence/plans';
import {
  confirmReportOrderPayment,
  transitionReportOrderAccess,
} from '@/lib/intelligence/reportOrders';
import { fulfillConsultationPayment } from '@/lib/consultationFulfillment';
import { resolvePaystackAccessStatus } from '@/lib/intelligence/reportOrderPolicy';
import {
  confirmCorporateSourcingPayment,
  getCorporateSourcingPayment,
} from '@/lib/corporateSourcing/payments';
import {
  activateIntelligenceSubscriptionPayment,
  IntelligenceSubscriptionNotFoundError,
  IntelligenceSubscriptionPaymentError,
} from '@/lib/intelligence/subscriptionActivation';
import { confirmSupplierVerificationPayment } from '@/lib/supplierVerification/service';
import {
  AFFILIATE_SERVICE_KEYS,
  recordAffiliateConversion,
  voidAffiliateConversions,
} from '@/lib/affiliate/commissions';
import { paystackEventReversesCommission } from '@/lib/affiliate/reversalPolicy';
import { sendAffiliateAccountNotification } from '@/lib/affiliate/emailNotifications';

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

type AffiliatePayoutNotice = { id: number; pidPayout: string; affiliateId: number; provider: string; currency: string; amount: unknown };

function notifyAffiliatePayout(payout: AffiliatePayoutNotice, status: 'PAID' | 'FAILED' | 'REVERSED') {
  const reversed = status === 'REVERSED';
  const paid = status === 'PAID';
  after(() => sendAffiliateAccountNotification({
    affiliateId: payout.affiliateId,
    eventKey: `payout:${status.toLowerCase()}:${payout.pidPayout}`,
    eventType: paid ? 'PAYOUT_PAID' : reversed ? 'PAYOUT_REVERSED' : 'PAYOUT_FAILED',
    subject: paid ? 'Your Sure Imports affiliate payout has been paid' : reversed ? 'Your Sure Imports affiliate payout was reversed' : 'Your Sure Imports affiliate payout failed',
    title: paid ? 'Payout completed' : reversed ? 'Payout reversed' : 'Payout was not completed',
    message: paid
      ? 'Your affiliate payout was completed successfully. Provider processing times may affect when the funds appear at your destination.'
      : reversed
        ? 'Paystack reported that this payout was reversed. Review the payout page or contact support if you need assistance.'
        : 'Paystack could not complete this payout. Review the payout page for the latest status.',
    facts: [
      { label: 'Reference', value: payout.pidPayout },
      { label: 'Provider', value: payout.provider },
      { label: 'Amount', value: new Intl.NumberFormat(payout.currency === 'NGN' ? 'en-NG' : 'en-US', { style: 'currency', currency: payout.currency }).format(Number(payout.amount)) },
      { label: 'Status', value: status },
    ],
    actionLabel: 'Track payout',
    actionPath: '/dashboard/payouts',
  }));
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

  if (event.startsWith('transfer.')) {
    const data = payload?.data || {};
    const payoutReference = String(data.reference || '').trim();
    const transferCode = String(data.transfer_code || '').trim();
    const transferReference = transferCode || null;
    const payouts = await prisma.$queryRaw<Array<AffiliatePayoutNotice>>`
      SELECT id, pidPayout, affiliateId, provider, currency, amount FROM affiliate_payouts
      WHERE pidPayout = ${payoutReference}
         OR externalReference = ${transferCode}
      LIMIT 1
    `;
    const payout = payouts[0];
    if (payout) {
      const providerStatus = event.replace('transfer.', '').toUpperCase();
      if (event === 'transfer.success') {
        await prisma.$transaction([
          prisma.$executeRaw`
            UPDATE affiliate_payouts
            SET status = 'PAID', providerStatus = ${providerStatus},
                externalReference = COALESCE(${transferReference}, externalReference),
                processedAt = ${new Date()}, lastCheckedAt = ${new Date()}, updatedAt = ${new Date()}
            WHERE id = ${payout.id}
          `,
          prisma.$executeRaw`
            UPDATE affiliate_conversions c
            INNER JOIN affiliate_payout_items i ON i.conversionId = c.id
            SET c.status = 'PAID', c.updatedAt = ${new Date()}
            WHERE i.payoutId = ${payout.id} AND c.status = 'RESERVED'
          `,
        ]);
        notifyAffiliatePayout(payout, 'PAID');
      } else if (event === 'transfer.failed' || event === 'transfer.reversed') {
        await prisma.$transaction([
          prisma.$executeRaw`
            UPDATE affiliate_payouts
            SET status = 'FAILED', providerStatus = ${providerStatus},
                externalReference = COALESCE(${transferReference}, externalReference),
                failedAt = ${new Date()}, processedAt = NULL,
                lastCheckedAt = ${new Date()}, updatedAt = ${new Date()}
            WHERE id = ${payout.id}
          `,
          prisma.$executeRaw`
            UPDATE affiliate_conversions c
            INNER JOIN affiliate_payout_items i ON i.conversionId = c.id
            SET c.status = 'RESERVED', c.updatedAt = ${new Date()}
            WHERE i.payoutId = ${payout.id} AND c.status <> 'VOIDED'
          `,
        ]);
        notifyAffiliatePayout(payout, event === 'transfer.reversed' ? 'REVERSED' : 'FAILED');
      }
    }
    return NextResponse.json({ received: true });
  }

  if (event.startsWith('refund.') || event.startsWith('charge.dispute.')) {
    const data = payload?.data || {};
    const reference = String(
      data.transaction_reference ||
        data.transaction?.reference ||
        data.reference ||
        '',
    ).trim();
    const shouldVoidCommission = paystackEventReversesCommission(event, data);
    if (reference && shouldVoidCommission) {
      await voidAffiliateConversions({
        externalPaymentReferences: [`paystack:${reference}`],
        reason: `Paystack reported ${event} for ${reference}.`,
        reversalReference: `paystack:${event}:${String(data.refund_reference || data.id || reference)}`,
      });
    }
    const order = reference
      ? await prisma.intelligence_report_orders.findFirst({
          where: { providerReference: reference, paymentProvider: 'paystack' },
        })
      : null;
    if (!order && reference) {
      const supplierPayment = await prisma.supplier_verification_payments.findFirst({
        where: { providerReference: reference, paymentProvider: 'paystack' },
      }).catch(() => null);
      if (supplierPayment) {
        const nextStatus = event === 'refund.processed'
          ? Number(data.amount || 0) >= supplierPayment.amountMinor
            ? 'refunded'
            : 'disputed'
          : 'disputed';
        const requestUpdate =
          supplierPayment.paymentPurpose === 'PHYSICAL_VISIT'
            ? {
                transportQuoteStatus: nextStatus.toUpperCase(),
                updatedAt: new Date(),
              }
            : supplierPayment.paymentPurpose === 'LEGACY_COMBINED'
              ? {
                  status: nextStatus.toUpperCase(),
                  transportQuoteStatus: nextStatus.toUpperCase(),
                  updatedAt: new Date(),
                }
              : { status: nextStatus.toUpperCase(), updatedAt: new Date() };
        await prisma.$transaction([
          prisma.supplier_verification_payments.update({
            where: { pidPayment: supplierPayment.pidPayment },
            data: { status: nextStatus },
          }),
          prisma.verify_supplier.update({
            where: { pidVerifySupplier: supplierPayment.requestId },
            data: requestUpdate,
          }),
        ]);
        return NextResponse.json({ received: true });
      }
      const corporateRows = await prisma.$queryRaw<Array<{
        pidPayment: string;
        amountMinor: number;
      }>>`
        SELECT pidPayment, amountMinor
        FROM corporate_sourcing_research_payments
        WHERE providerReference = ${reference}
          AND paymentProvider = 'paystack'
        LIMIT 1
      `.catch(() => []);
      const corporatePayment = corporateRows[0];
      if (corporatePayment) {
        const status = event === 'refund.processed'
          ? Number(data.amount || 0) >= corporatePayment.amountMinor
            ? 'refunded'
            : 'disputed'
          : 'disputed';
        await prisma.$executeRaw`
          UPDATE corporate_sourcing_research_payments
          SET status = ${status}, updatedAt = ${new Date()}
          WHERE pidPayment = ${corporatePayment.pidPayment}
        `;
        return NextResponse.json({ received: true });
      }
    }
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
  if (payment?.metadata?.product === 'supplier_verification') {
    const pidPayment = String(payment.metadata?.pidPayment || '').trim();
    const supplierPayment = pidPayment
      ? await prisma.supplier_verification_payments.findUnique({ where: { pidPayment } })
      : null;
    if (
      supplierPayment &&
      supplierPayment.paymentProvider === 'paystack' &&
      supplierPayment.providerReference === payment.reference &&
      Number(payment.amount) === supplierPayment.amountMinor &&
      String(payment.currency || '').toUpperCase() === supplierPayment.currency
    ) {
      await confirmSupplierVerificationPayment({
        pidPayment,
        paidAt: payment.paid_at ? new Date(payment.paid_at) : null,
        providerEventId: `paystack:charge.success:${String(payment.id || payment.reference)}`,
      });
    }
    return NextResponse.json({ received: true });
  }
  if (payment?.metadata?.product === 'corporate_sourcing_research_fee') {
    const pidPayment = String(payment.metadata?.pidPayment || '').trim();
    const corporatePayment = pidPayment
      ? await getCorporateSourcingPayment(pidPayment)
      : null;
    if (
      corporatePayment &&
      corporatePayment.paymentProvider === 'paystack' &&
      corporatePayment.providerReference === payment.reference &&
      Number(payment.amount) === corporatePayment.amountMinor &&
      String(payment.currency || '').toUpperCase() === corporatePayment.currency
    ) {
      await confirmCorporateSourcingPayment({
        pidPayment,
        paidAt: payment.paid_at ? new Date(payment.paid_at) : null,
      });
    }
    return NextResponse.json({ received: true });
  }
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
  if (payment?.metadata?.product === 'supplier_intelligence') {
    try {
      const { subscription } =
        await activateIntelligenceSubscriptionPayment(payment);
      return NextResponse.json({
        received: true,
        status: subscription.status,
      });
    } catch (error) {
      // Paystack can retain the original metadata on recurring charges. A new
      // renewal reference will not match the initial checkout record, so let
      // that event continue into the recurring-subscription handler below.
      if (error instanceof IntelligenceSubscriptionNotFoundError) {
        // Continue below.
      } else if (error instanceof IntelligenceSubscriptionPaymentError) {
        console.error('Subscription webhook payment rejected:', error.message);
        return NextResponse.json({ received: true, status: 'ignored' });
      } else {
        console.error('Subscription webhook activation failed:', error);
        return NextResponse.json(
          { message: 'Subscription activation failed.' },
          { status: 500 },
        );
      }
    }
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

  const paymentReference = String(payment.reference || '').trim();
  await recordAffiliateConversion({
    customerReference: subscription.pidUser,
    serviceKey: AFFILIATE_SERVICE_KEYS.SUPPLIER_INTELLIGENCE,
    externalOrderReference: `supplier-intelligence:${subscription.pidSubscription}:${paymentReference}`,
    externalPaymentReference: `paystack:${paymentReference}`,
    paymentCurrency: String(payment.currency || 'NGN'),
    grossAmount: Number(payment.amount) / 100,
    eligibleAmount: Number(payment.amount) / 100,
  });

  return NextResponse.json({ received: true });
}
