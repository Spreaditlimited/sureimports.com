export type ExpectedIntelligenceSubscriptionPayment = {
  pidSubscription: string;
  pidUser: string;
  email: string;
  plan: string;
  paystackReference: string | null;
  amountKobo: number;
  currency: string;
  paystackPlanCode?: string | null;
};

function normalized(value: unknown) {
  return String(value || '').trim();
}

function normalizedEmail(value: unknown) {
  return normalized(value).toLowerCase();
}

export function getPaystackPaymentPlanCode(payment: any) {
  return normalized(
    typeof payment?.plan === 'string' ? payment.plan : payment?.plan?.plan_code,
  );
}

export function getIntelligenceSubscriptionPaymentError(
  payment: any,
  expected: ExpectedIntelligenceSubscriptionPayment,
) {
  const metadata = payment?.metadata || {};
  const paymentEmail =
    payment?.customer?.email || payment?.email || metadata?.email;
  const paymentPlanCode = getPaystackPaymentPlanCode(payment);
  const expectedPlanCode = normalized(expected.paystackPlanCode);

  if (normalized(payment?.status).toLowerCase() !== 'success') {
    return 'Paystack has not confirmed a successful payment.';
  }
  if (
    !expected.paystackReference ||
    normalized(payment?.reference) !== expected.paystackReference
  ) {
    return 'The Paystack reference does not match this subscription.';
  }
  if (Number(payment?.amount) !== Number(expected.amountKobo)) {
    return 'The paid amount does not match this subscription.';
  }
  if (
    normalized(payment?.currency).toUpperCase() !==
    normalized(expected.currency).toUpperCase()
  ) {
    return 'The payment currency does not match this subscription.';
  }
  if (normalized(metadata?.product) !== 'supplier_intelligence') {
    return 'The payment product metadata is invalid.';
  }
  if (normalized(metadata?.pidSubscription) !== expected.pidSubscription) {
    return 'The payment subscription metadata is invalid.';
  }
  if (normalized(metadata?.pidUser) !== expected.pidUser) {
    return 'The payment customer metadata is invalid.';
  }
  if (normalized(metadata?.plan) !== expected.plan) {
    return 'The payment plan metadata is invalid.';
  }
  if (
    paymentEmail &&
    normalizedEmail(paymentEmail) !== normalizedEmail(expected.email)
  ) {
    return 'The payment email does not match this subscription.';
  }
  if (
    expectedPlanCode &&
    paymentPlanCode &&
    paymentPlanCode !== expectedPlanCode
  ) {
    return 'The Paystack plan does not match this subscription.';
  }

  return null;
}
