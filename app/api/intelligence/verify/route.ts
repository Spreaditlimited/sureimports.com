import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { generateToken } from '@/lib/jwt';
import {
  disablePaystackSubscription,
  fetchPaystackSubscription,
  findPaystackSubscription,
  getPaymentSubscriptionCode,
  verifyPaystackTransaction,
} from '@/lib/intelligence/paystack';
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
  paystackReference: string | null;
  paystackCustomerCode: string | null;
  paystackSubscriptionCode: string | null;
  paystackEmailToken: string | null;
  amountKobo: number;
  currency: string;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  cancelledAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

function addMonths(date: Date, months: number) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

export async function POST(request: Request) {
  const { reference } = await request.json().catch(() => ({ reference: '' }));

  if (!reference) {
    return NextResponse.json(
      { message: 'Payment reference is required.' },
      { status: 400 },
    );
  }

  if (!PAYSTACK_SECRET_KEY) {
    return NextResponse.json(
      { message: 'Paystack secret key is not configured.' },
      { status: 500 },
    );
  }

  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    },
  );

  const data = await response.json();

  if (!response.ok || !data?.status || data?.data?.status !== 'success') {
    await prisma.intelligence_subscriptions.updateMany({
      where: { paystackReference: reference },
      data: { status: 'failed', updatedAt: new Date() },
    });

    return NextResponse.json(
      { message: data?.message || 'Payment verification failed.' },
      { status: 400 },
    );
  }

  const payment = data.data;
  const paidAt = payment.paid_at ? new Date(payment.paid_at) : new Date();
  const periodEnd = addMonths(paidAt, 1);
  let paystackSubscriptionCode = getPaymentSubscriptionCode(payment);
  const paymentPlanCode =
    typeof payment?.plan === 'string' ? payment.plan : payment?.plan?.plan_code;

  if (!paystackSubscriptionCode) {
    const matchingSubscription = await findPaystackSubscription({
      customerCode: payment.customer?.customer_code,
      customerEmail: payment.customer?.email || payment.email,
      planCode: paymentPlanCode,
    });
    paystackSubscriptionCode = matchingSubscription?.subscription_code || null;
  }

  const paystackSubscription = paystackSubscriptionCode
    ? await fetchPaystackSubscription(paystackSubscriptionCode)
    : null;

  await prisma.$executeRaw`
    UPDATE intelligence_subscriptions
    SET
      status = 'active',
      paystackCustomerCode = ${payment.customer?.customer_code || null},
      paystackSubscriptionCode = ${paystackSubscriptionCode},
      paystackEmailToken = ${paystackSubscription?.email_token || null},
      currentPeriodStart = ${paidAt},
      currentPeriodEnd = ${periodEnd},
      updatedAt = ${new Date()}
    WHERE paystackReference = ${reference}
  `;

  const subscriptions = await prisma.$queryRaw<IntelligenceSubscriptionRow[]>`
    SELECT
      pidSubscription,
      pidUser,
      email,
      plan,
      status,
      paystackReference,
      paystackCustomerCode,
      paystackSubscriptionCode,
      paystackEmailToken,
      amountKobo,
      currency,
      currentPeriodStart,
      currentPeriodEnd,
      cancelledAt,
      createdAt,
      updatedAt
    FROM intelligence_subscriptions
    WHERE paystackReference = ${reference}
    LIMIT 1
  `;

  const subscription = subscriptions[0];

  if (!subscription) {
    return NextResponse.json(
      { message: 'Subscription record was not found after payment.' },
      { status: 404 },
    );
  }

  if (subscription.plan === 'starter' || subscription.plan === 'pro') {
    const paidPlan = await getConfiguredIntelligencePlan(subscription.plan);
    await grantIntelligenceCredits({
      pidUser: subscription.pidUser,
      amount: paidPlan.monthlySearchCredits,
      reason: `${subscription.plan}_monthly_search_credits`,
      reference:
        payment.reference ||
        `${subscription.pidSubscription}:${periodEnd.toISOString().slice(0, 10)}`,
    });
  }

  if (subscription.plan === 'pro') {
    const olderSubscriptions = await prisma.$queryRaw<
      Pick<
        IntelligenceSubscriptionRow,
        | 'pidSubscription'
        | 'paystackReference'
        | 'paystackSubscriptionCode'
        | 'paystackEmailToken'
        | 'paystackCustomerCode'
        | 'email'
        | 'plan'
      >[]
    >`
      SELECT
        pidSubscription,
        paystackReference,
        paystackSubscriptionCode,
        paystackEmailToken,
        paystackCustomerCode,
        email,
        plan
      FROM intelligence_subscriptions
      WHERE pidUser = ${subscription.pidUser}
        AND pidSubscription <> ${subscription.pidSubscription}
        AND status IN ('active', 'non_renewing')
    `;

    const olderSubscriptionsWithCodes = await Promise.all(
      olderSubscriptions.map(async (olderSubscription) => {
        if (
          olderSubscription.paystackSubscriptionCode &&
          olderSubscription.paystackEmailToken
        ) {
          return olderSubscription;
        }

        const olderPayment = olderSubscription.paystackReference
          ? await verifyPaystackTransaction(olderSubscription.paystackReference)
          : null;
        const olderPlanCode =
          typeof olderPayment?.plan === 'string'
            ? olderPayment.plan
            : olderPayment?.plan?.plan_code;
        const matchingSubscription = await findPaystackSubscription({
          customerCode:
            olderPayment?.customer?.customer_code ||
            olderSubscription.paystackCustomerCode,
          customerEmail: olderPayment?.customer?.email || olderSubscription.email,
          planCode: olderPlanCode,
        });
        const olderSubscriptionCode =
          olderSubscription.paystackSubscriptionCode ||
          matchingSubscription?.subscription_code ||
          null;

        if (!olderSubscriptionCode) return olderSubscription;

        const paystackSubscription =
          await fetchPaystackSubscription(olderSubscriptionCode);
        const emailToken =
          olderSubscription.paystackEmailToken ||
          paystackSubscription?.email_token ||
          matchingSubscription?.email_token ||
          null;

        await prisma.$executeRaw`
          UPDATE intelligence_subscriptions
          SET
            paystackSubscriptionCode = ${olderSubscriptionCode},
            paystackEmailToken = ${emailToken},
            paystackCustomerCode = ${olderPayment?.customer?.customer_code || olderSubscription.paystackCustomerCode || null},
            updatedAt = ${new Date()}
          WHERE pidSubscription = ${olderSubscription.pidSubscription}
        `;

        return {
          ...olderSubscription,
          paystackSubscriptionCode: olderSubscriptionCode,
          paystackEmailToken: emailToken,
        };
      }),
    );

    await Promise.allSettled(
      olderSubscriptionsWithCodes
        .filter(
          (olderSubscription) =>
            olderSubscription.paystackSubscriptionCode &&
            olderSubscription.paystackEmailToken,
        )
        .map((olderSubscription) =>
          disablePaystackSubscription({
            code: olderSubscription.paystackSubscriptionCode as string,
            token: olderSubscription.paystackEmailToken as string,
          }),
        ),
    );

    await prisma.$executeRaw`
      UPDATE intelligence_subscriptions
      SET
        status = 'upgraded',
        cancelledAt = ${new Date()},
        updatedAt = ${new Date()}
      WHERE pidUser = ${subscription.pidUser}
        AND pidSubscription <> ${subscription.pidSubscription}
        AND status IN ('active', 'non_renewing')
    `;
  }

  const user = await prisma.users.update({
    where: { pidUser: subscription.pidUser },
    data: {
      userCid: 'VERIFIED',
      updatedAt: new Date(),
    },
  });

  const token = generateToken({
    pidUser: user.pidUser,
    userEmail: user.userEmail,
    userFirstname: user.userFirstname,
    userImage: user.userImage,
  });

  const result = NextResponse.json({
    status: true,
    subscription,
  });

  result.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });

  return result;
}
