type PayPalEnvironment = 'live' | 'sandbox';

function getPayPalEnvironment(): PayPalEnvironment {
  return String(process.env.PAYPAL_ENV || 'live')
    .trim()
    .toLowerCase() === 'sandbox'
    ? 'sandbox'
    : 'live';
}

function getPayPalBaseUrl() {
  return getPayPalEnvironment() === 'sandbox'
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';
}

function getPayPalAuthHeader() {
  const clientId = process.env.PAYPAL_CLIENT_ID?.trim();
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET?.trim();

  if (!clientId || !clientSecret) return null;

  return `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`;
}

export async function getPayPalAccessToken() {
  const authorization = getPayPalAuthHeader();
  if (!authorization) {
    throw new Error('Missing PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET.');
  }

  const response = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data?.access_token) {
    throw new Error(
      data?.error_description ||
        data?.message ||
        'PayPal authentication failed.',
    );
  }

  return String(data.access_token);
}

export async function createPayPalOrder(input: {
  amount: string;
  currency: string;
  returnUrl: string;
  cancelUrl: string;
  customId: string;
  invoiceId: string;
  description: string;
}) {
  const accessToken = await getPayPalAccessToken();
  const response = await fetch(`${getPayPalBaseUrl()}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': input.invoiceId,
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          custom_id: input.customId,
          invoice_id: input.invoiceId,
          description: input.description,
          amount: {
            currency_code: input.currency.toUpperCase(),
            value: input.amount,
          },
        },
      ],
      application_context: {
        brand_name: 'Sure Imports',
        landing_page: 'LOGIN',
        user_action: 'PAY_NOW',
        return_url: input.returnUrl,
        cancel_url: input.cancelUrl,
      },
    }),
    cache: 'no-store',
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data?.id) {
    throw new Error(data?.message || 'PayPal order creation failed.');
  }

  const approvalUrl = Array.isArray(data.links)
    ? data.links.find((link: { rel?: string }) => link?.rel === 'approve')?.href
    : null;

  return {
    id: String(data.id),
    approvalUrl: approvalUrl ? String(approvalUrl) : null,
    raw: data,
  };
}

export async function getPayPalOrder(orderId: string) {
  const accessToken = await getPayPalAccessToken();
  const response = await fetch(
    `${getPayPalBaseUrl()}/v2/checkout/orders/${encodeURIComponent(orderId)}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    },
  );
  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data?.id) {
    throw new Error(data?.message || 'PayPal order lookup failed.');
  }

  return data;
}

export async function capturePayPalOrder(orderId: string) {
  const accessToken = await getPayPalAccessToken();
  const response = await fetch(
    `${getPayPalBaseUrl()}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    },
  );
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || 'PayPal payment capture failed.');
  }

  return data;
}

export async function verifyPayPalWebhookSignature(input: {
  body: unknown;
  headers: Record<string, string | null>;
}) {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID?.trim();
  if (!webhookId) throw new Error('Missing PAYPAL_WEBHOOK_ID.');

  const accessToken = await getPayPalAccessToken();
  const response = await fetch(
    `${getPayPalBaseUrl()}/v1/notifications/verify-webhook-signature`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        webhook_id: webhookId,
        transmission_id: input.headers['paypal-transmission-id'],
        transmission_time: input.headers['paypal-transmission-time'],
        cert_url: input.headers['paypal-cert-url'],
        auth_algo: input.headers['paypal-auth-algo'],
        transmission_sig: input.headers['paypal-transmission-sig'],
        webhook_event: input.body,
      }),
      cache: 'no-store',
    },
  );
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || 'PayPal webhook verification failed.');
  }

  return data;
}
