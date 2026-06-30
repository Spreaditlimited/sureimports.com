import { NextResponse } from 'next/server';

import { checkAuth } from '@/lib/auth/checkAuth';
import { getActiveIntelligenceSubscription } from '@/lib/intelligence/access';
import { prisma } from '@/lib/prisma';
import {
  fetchPaystackSubscription,
  generatePaystackManageLink,
  getPaymentSubscriptionCode,
  verifyPaystackTransaction,
} from '@/lib/intelligence/paystack';

export async function POST() {
  const user = await checkAuth();

  if (!user?.pidUser) {
    return NextResponse.json({ message: 'Login required.' }, { status: 401 });
  }

  const subscription = await getActiveIntelligenceSubscription(user.pidUser);

  if (!subscription) {
    return NextResponse.json(
      { message: 'No active Supplier Intelligence subscription found.' },
      { status: 404 },
    );
  }

  let subscriptionCode = subscription.paystackSubscriptionCode;

  if (!subscriptionCode && subscription.paystackReference) {
    const payment = await verifyPaystackTransaction(subscription.paystackReference);
    subscriptionCode = getPaymentSubscriptionCode(payment);

    if (subscriptionCode) {
      const paystackSubscription =
        await fetchPaystackSubscription(subscriptionCode);

      await prisma.$executeRaw`
        UPDATE intelligence_subscriptions
        SET
          paystackSubscriptionCode = ${subscriptionCode},
          paystackEmailToken = ${paystackSubscription?.email_token || subscription.paystackEmailToken || null},
          paystackCustomerCode = ${payment?.customer?.customer_code || subscription.paystackCustomerCode || null},
          updatedAt = ${new Date()}
        WHERE pidSubscription = ${subscription.pidSubscription}
      `;
    }
  }

  if (!subscriptionCode) {
    return NextResponse.json(
      {
        message:
          'This subscription is active, but Paystack has not returned a recurring subscription link for it yet.',
      },
      { status: 400 },
    );
  }

  const manageLink = await generatePaystackManageLink(subscriptionCode);

  if (!manageLink) {
    return NextResponse.json(
      { message: 'Unable to generate Paystack management link.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ manageLink });
}
