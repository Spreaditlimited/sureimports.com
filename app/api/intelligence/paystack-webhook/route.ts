import crypto from 'crypto';
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import {
  grantIntelligenceCredits,
} from '@/lib/intelligence/credits';
import { getConfiguredIntelligencePlan } from '@/lib/intelligence/plans';

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

function signatureIsValid(body: string, signature: string | null) {
  if (!PAYSTACK_SECRET_KEY || !signature) return false;

  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(body)
    .digest('hex');

  const expected = Buffer.from(hash);
  const received = Buffer.from(signature);
  return expected.length === received.length && crypto.timingSafeEqual(expected, received);
}

export async function POST(request: Request) {
  const rawBody = await request.text();

  if (!signatureIsValid(rawBody, request.headers.get('x-paystack-signature'))) {
    return NextResponse.json({ message: 'Invalid signature.' }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  if (payload?.event !== 'charge.success' || payload?.data?.status !== 'success') {
    return NextResponse.json({ received: true });
  }

  const payment = payload.data;
  const subscriptionCode = getPaymentSubscriptionCode(payment);
  const customerCode = payment.customer?.customer_code || null;
  const email = payment.customer?.email || payment.email || null;

  const subscriptions = subscriptionCode
    ? await prisma.$queryRaw<IntelligenceSubscriptionRow[]>`
        SELECT pidSubscription, pidUser, email, plan, status
        FROM intelligence_subscriptions
        WHERE paystackSubscriptionCode = ${subscriptionCode}
          AND plan = 'pro'
        ORDER BY createdAt DESC
        LIMIT 1
      `
    : await prisma.$queryRaw<IntelligenceSubscriptionRow[]>`
        SELECT pidSubscription, pidUser, email, plan, status
        FROM intelligence_subscriptions
        WHERE plan = 'pro'
          AND status IN ('active', 'non_renewing')
          AND (
            paystackCustomerCode = ${customerCode}
            OR email = ${email}
          )
        ORDER BY createdAt DESC
        LIMIT 1
      `;

  const subscription = subscriptions[0];
  if (!subscription || subscription.plan !== 'pro') {
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

  const proPlan = await getConfiguredIntelligencePlan('pro');

  await grantIntelligenceCredits({
    pidUser: subscription.pidUser,
    amount: proPlan.monthlySearchCredits,
    reason: 'pro_monthly_search_credits',
    reference:
      payment.reference ||
      `${subscription.pidSubscription}:${periodEnd.toISOString().slice(0, 10)}`,
  });

  return NextResponse.json({ received: true });
}
