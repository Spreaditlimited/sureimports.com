const PAYSTACK_SECRET_KEY = process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY;

type PaystackResponse<T> = {
  status?: boolean;
  message?: string;
  data?: T;
};

type PaystackSubscription = {
  subscription_code?: string;
  email_token?: string;
};

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
