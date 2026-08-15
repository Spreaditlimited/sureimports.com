import { prisma } from '@/lib/prisma';
import { requestPublicAccountMarketingOptIn } from '@/lib/auth/resolvePublicAccount';
import { grantIntelligenceCredits } from '@/lib/intelligence/credits';
import {
  disablePaystackSubscription,
  fetchPaystackSubscription,
  findPaystackSubscription,
  getPaymentSubscriptionCode,
  verifyPaystackTransaction,
} from '@/lib/intelligence/paystack';
import {
  getConfiguredIntelligencePlan,
  getPaystackPlanCode,
  type IntelligencePlanKey,
} from '@/lib/intelligence/plans';
import {
  getIntelligenceSubscriptionPaymentError,
  getPaystackPaymentPlanCode,
} from '@/lib/intelligence/subscriptionPaymentPolicy';

export class IntelligenceSubscriptionNotFoundError extends Error {}
export class IntelligenceSubscriptionPaymentError extends Error {}

function addMonths(date: Date, months: number) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

async function retireOlderSubscriptions(pidUser: string, currentId: string) {
  const olderSubscriptions = await prisma.intelligence_subscriptions.findMany({
    where: {
      pidUser,
      pidSubscription: { not: currentId },
      status: { in: ['active', 'non_renewing'] },
    },
  });

  const subscriptionsWithCredentials = await Promise.all(
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
      const matchingSubscription = await findPaystackSubscription({
        customerCode:
          olderPayment?.customer?.customer_code ||
          olderSubscription.paystackCustomerCode,
        customerEmail: olderPayment?.customer?.email || olderSubscription.email,
        planCode: getPaystackPaymentPlanCode(olderPayment),
      });
      const subscriptionCode =
        olderSubscription.paystackSubscriptionCode ||
        matchingSubscription?.subscription_code ||
        null;
      if (!subscriptionCode) return olderSubscription;

      const paystackSubscription =
        await fetchPaystackSubscription(subscriptionCode);
      return prisma.intelligence_subscriptions.update({
        where: { pidSubscription: olderSubscription.pidSubscription },
        data: {
          paystackSubscriptionCode: subscriptionCode,
          paystackEmailToken:
            olderSubscription.paystackEmailToken ||
            paystackSubscription?.email_token ||
            matchingSubscription?.email_token ||
            null,
          paystackCustomerCode:
            olderPayment?.customer?.customer_code ||
            olderSubscription.paystackCustomerCode,
          updatedAt: new Date(),
        },
      });
    }),
  );

  await Promise.allSettled(
    subscriptionsWithCredentials
      .filter(
        (subscription) =>
          subscription.paystackSubscriptionCode &&
          subscription.paystackEmailToken,
      )
      .map((subscription) =>
        disablePaystackSubscription({
          code: subscription.paystackSubscriptionCode as string,
          token: subscription.paystackEmailToken as string,
        }),
      ),
  );

  await prisma.intelligence_subscriptions.updateMany({
    where: {
      pidUser,
      pidSubscription: { not: currentId },
      status: { in: ['active', 'non_renewing'] },
    },
    data: {
      status: 'upgraded',
      cancelledAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

export async function activateIntelligenceSubscriptionPayment(payment: any) {
  const reference = String(payment?.reference || '').trim();
  const subscription = reference
    ? await prisma.intelligence_subscriptions.findUnique({
        where: { paystackReference: reference },
      })
    : null;

  if (!subscription) {
    throw new IntelligenceSubscriptionNotFoundError(
      'Subscription record was not found for this payment.',
    );
  }
  if (subscription.plan !== 'starter' && subscription.plan !== 'pro') {
    throw new IntelligenceSubscriptionPaymentError(
      'The subscription plan is not supported.',
    );
  }
  if (!['pending', 'failed', 'active'].includes(subscription.status)) {
    throw new IntelligenceSubscriptionPaymentError(
      'This subscription can no longer be activated by this payment.',
    );
  }

  const planKey = subscription.plan as IntelligencePlanKey;
  const expectedPlanCode = await getPaystackPlanCode(planKey);
  const validationError = getIntelligenceSubscriptionPaymentError(payment, {
    ...subscription,
    paystackPlanCode: expectedPlanCode,
  });
  if (validationError) {
    throw new IntelligenceSubscriptionPaymentError(validationError);
  }

  const paidAt = payment.paid_at ? new Date(payment.paid_at) : new Date();
  const periodEnd = addMonths(paidAt, 1);
  const paymentPlanCode = getPaystackPaymentPlanCode(payment);
  let subscriptionCode = getPaymentSubscriptionCode(payment);
  let matchingSubscription = null;
  if (!subscriptionCode) {
    matchingSubscription = await findPaystackSubscription({
      customerCode: payment.customer?.customer_code,
      customerEmail: payment.customer?.email || payment.email,
      planCode: paymentPlanCode || expectedPlanCode,
    });
    subscriptionCode = matchingSubscription?.subscription_code || null;
  }
  const paystackSubscription = subscriptionCode
    ? await fetchPaystackSubscription(subscriptionCode)
    : null;

  const activatedSubscription = await prisma.intelligence_subscriptions.update({
    where: { pidSubscription: subscription.pidSubscription },
    data: {
      status: 'active',
      paystackCustomerCode:
        payment.customer?.customer_code || subscription.paystackCustomerCode,
      paystackSubscriptionCode:
        subscriptionCode || subscription.paystackSubscriptionCode,
      paystackEmailToken:
        paystackSubscription?.email_token ||
        matchingSubscription?.email_token ||
        subscription.paystackEmailToken,
      currentPeriodStart: paidAt,
      currentPeriodEnd: periodEnd,
      updatedAt: new Date(),
    },
  });

  const configuredPlan = await getConfiguredIntelligencePlan(planKey);
  await grantIntelligenceCredits({
    pidUser: activatedSubscription.pidUser,
    amount: configuredPlan.monthlySearchCredits,
    reason: `${planKey}_monthly_search_credits`,
    reference,
  });

  if (planKey === 'pro') {
    await retireOlderSubscriptions(
      activatedSubscription.pidUser,
      activatedSubscription.pidSubscription,
    );
  }

  const user = await prisma.users.update({
    where: { pidUser: activatedSubscription.pidUser },
    data: { userCid: 'VERIFIED', updatedAt: new Date() },
  });

  const isNewAccountForThisSubscription =
    subscription.status !== 'active' &&
    user.loginKey ===
      `supplier_intelligence_subscription:${subscription.pidSubscription}`;
  if (isNewAccountForThisSubscription) {
    await requestPublicAccountMarketingOptIn({
      user,
      source: 'paid_supplier_intelligence_account',
      context: {
        pidUser: user.pidUser,
        pidSubscription: subscription.pidSubscription,
        channelOwner: 'SES',
      },
    }).catch((error) => {
      console.error('Supplier Intelligence marketing opt-in email failed:', error);
    });
  }

  return { subscription: activatedSubscription, user };
}
