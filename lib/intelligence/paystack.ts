const PAYSTACK_SECRET_KEY = process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY;

type PaystackResponse<T> = {
  status?: boolean;
  message?: string;
  data?: T;
};

type PaystackSubscription = {
  subscription_code?: string;
  email_token?: string;
  status?: string;
  next_payment_date?: string | null;
  customer?: {
    email?: string;
    customer_code?: string;
  };
  plan?: {
    plan_code?: string;
  };
};

export function getPaymentSubscriptionCode(payment: any) {
  if (typeof payment?.subscription === 'string') return payment.subscription;
  return (
    payment?.subscription?.subscription_code ||
    payment?.subscription_code ||
    payment?.metadata?.subscription_code ||
    null
  );
}

export async function fetchPaystackSubscription(subscriptionCode: string) {
  if (!PAYSTACK_SECRET_KEY) return null;

  const response = await fetch(
    `https://api.paystack.co/subscription/${encodeURIComponent(subscriptionCode)}`,
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
      cache: 'no-store',
    },
  );

  const data = (await response
    .json()
    .catch(() => null)) as PaystackResponse<PaystackSubscription> | null;

  if (!response.ok || !data?.status || !data.data) return null;
  return data.data;
}

export async function verifyPaystackTransaction(reference: string) {
  if (!PAYSTACK_SECRET_KEY || !reference) return null;

  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
      cache: 'no-store',
    },
  );

  const data = (await response
    .json()
    .catch(() => null)) as PaystackResponse<any> | null;

  if (!response.ok || !data?.status || !data.data) return null;
  return data.data;
}

export async function findPaystackSubscription(input: {
  customerCode?: string | null;
  customerEmail?: string | null;
  planCode?: string | null;
}) {
  if (!PAYSTACK_SECRET_KEY) return null;

  const response = await fetch('https://api.paystack.co/subscription?perPage=100', {
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    },
    cache: 'no-store',
  });

  const data = (await response
    .json()
    .catch(() => null)) as PaystackResponse<PaystackSubscription[]> | null;

  if (!response.ok || !data?.status || !Array.isArray(data.data)) return null;

  const customerCode = String(input.customerCode || '').trim();
  const customerEmail = String(input.customerEmail || '').trim().toLowerCase();
  const planCode = String(input.planCode || '').trim();

  const matches = data.data.filter((subscription) => {
    const subscriptionCustomerCode = String(
      subscription.customer?.customer_code || '',
    ).trim();
    const subscriptionCustomerEmail = String(
      subscription.customer?.email || '',
    )
      .trim()
      .toLowerCase();
    const subscriptionPlanCode = String(subscription.plan?.plan_code || '').trim();

    const customerMatches =
      Boolean(customerCode && subscriptionCustomerCode === customerCode) ||
      Boolean(customerEmail && subscriptionCustomerEmail === customerEmail);
    const planMatches = Boolean(planCode && subscriptionPlanCode === planCode);

    return customerMatches && planMatches && subscription.subscription_code;
  });

  return (
    matches.find((subscription) => subscription.status === 'active') ||
    matches[0] ||
    null
  );
}

export async function disablePaystackSubscription(input: {
  code: string;
  token: string;
}) {
  if (!PAYSTACK_SECRET_KEY) return false;

  const response = await fetch('https://api.paystack.co/subscription/disable', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  const data = (await response
    .json()
    .catch(() => null)) as PaystackResponse<unknown> | null;

  return response.ok && Boolean(data?.status);
}

export async function generatePaystackManageLink(subscriptionCode: string) {
  if (!PAYSTACK_SECRET_KEY) return null;

  const response = await fetch(
    `https://api.paystack.co/subscription/${encodeURIComponent(
      subscriptionCode,
    )}/manage/link`,
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
      cache: 'no-store',
    },
  );

  const data = (await response.json().catch(() => null)) as PaystackResponse<{
    link?: string;
  }> | null;

  if (!response.ok || !data?.status || !data.data?.link) return null;
  return data.data.link;
}
