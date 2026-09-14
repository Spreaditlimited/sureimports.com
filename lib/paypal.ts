import { signPayPalCheckoutSession } from './paypalCheckoutSession';

type PayPalEnvironment = 'live' | 'sandbox';
type PayPalApp = 'sureimports' | 'legacy';

function getPayPalEnvironment(
  app: PayPalApp = 'sureimports',
): PayPalEnvironment {
  return String(
    (app === 'sureimports'
      ? process.env.SUREIMPORTS_PAYPAL_ENV ||
        (process.env.NODE_ENV === 'production' ? 'live' : 'sandbox')
      : process.env.PAYPAL_ENV) || 'live',
  )
    .trim()
    .toLowerCase() === 'sandbox'
    ? 'sandbox'
    : 'live';
}

function getPayPalBaseUrl(app: PayPalApp = 'sureimports') {
  return getPayPalEnvironment(app) === 'sandbox'
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';
}

function getPayPalAuthHeader(app: PayPalApp) {
  const sandbox =
    app === 'sureimports' && getPayPalEnvironment(app) === 'sandbox';
  const clientId = (
    app === 'sureimports'
      ? sandbox
        ? process.env.SUREIMPORTS_PAYPAL_SANDBOX_CLIENT_ID
        : process.env.SUREIMPORTS_PAYPAL_CLIENT_ID
      : process.env.PAYPAL_CLIENT_ID
  )?.trim();
  const clientSecret = (
    app === 'sureimports'
      ? sandbox
        ? process.env.SUREIMPORTS_PAYPAL_SANDBOX_SECRET
        : process.env.SUREIMPORTS_PAYPAL_SECRET
      : process.env.PAYPAL_CLIENT_SECRET
  )?.trim();

  if (!clientId || !clientSecret) return null;

  return `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`;
}

export function getSureImportsPayPalClientId() {
  return (
    (getPayPalEnvironment() === 'sandbox'
      ? process.env.SUREIMPORTS_PAYPAL_SANDBOX_CLIENT_ID
      : process.env.SUREIMPORTS_PAYPAL_CLIENT_ID
    )?.trim() || ''
  );
}

export function getSureImportsPayPalEnvironment() {
  return getPayPalEnvironment();
}

export async function getPayPalAccessToken(app: PayPalApp = 'sureimports') {
  const authorization = getPayPalAuthHeader(app);
  if (!authorization) {
    throw new Error(`PayPal ${app} credentials are not configured.`);
  }

  const response = await fetch(`${getPayPalBaseUrl(app)}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
    signal: AbortSignal.timeout(15000),
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
  const returnUrl = new URL(input.returnUrl);
  const cancelUrl = new URL(input.cancelUrl);
  if (returnUrl.origin !== cancelUrl.origin)
    throw new Error('Checkout destinations must share an origin.');
  if (
    !/^[A-Z]{3}$/.test(input.currency.toUpperCase()) ||
    input.currency.toUpperCase() === 'NGN' ||
    !/^\d+\.\d{2}$/.test(input.amount) ||
    Number(input.amount) <= 0
  ) {
    throw new Error('Invalid PayPal checkout amount or currency.');
  }
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
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        return_url: input.returnUrl,
        cancel_url: input.cancelUrl,
      },
    }),
    cache: 'no-store',
    signal: AbortSignal.timeout(20000),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data?.id) {
    throw new Error(data?.message || 'PayPal order creation failed.');
  }

  const checkoutUrl = new URL('/checkout/paypal', returnUrl.origin);
  checkoutUrl.searchParams.set(
    'session',
    signPayPalCheckoutSession({
      orderId: String(data.id),
      amount: input.amount,
      currency: input.currency.toUpperCase(),
      description: input.description,
      returnPath: returnUrl.pathname + returnUrl.search,
      cancelPath: cancelUrl.pathname + cancelUrl.search,
      expiresAt: Date.now() + 2 * 60 * 60 * 1000,
    }),
  );

  return {
    id: String(data.id),
    approvalUrl: checkoutUrl.toString(),
    raw: data,
  };
}

async function lookupPayPalOrder(orderId: string, app: PayPalApp) {
  const accessToken = await getPayPalAccessToken(app);
  const response = await fetch(
    `${getPayPalBaseUrl(app)}/v2/checkout/orders/${encodeURIComponent(orderId)}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(15000),
    },
  );
  const data = await response.json().catch(() => ({}));

  if (response.status === 404) return null;
  if (!response.ok || !data?.id) {
    throw new Error(data?.message || 'PayPal order lookup failed.');
  }

  return { ...data, sureImportsEnvironment: getPayPalEnvironment(app) };
}

async function findPayPalOrder(orderId: string) {
  for (const app of ['sureimports', 'legacy'] as const) {
    if (!getPayPalAuthHeader(app)) continue;
    const order = await lookupPayPalOrder(orderId, app);
    if (order) return { order, app };
  }
  throw new Error('PayPal order was not found.');
}

export async function getPayPalOrder(orderId: string) {
  return (await findPayPalOrder(orderId)).order;
}

export async function capturePayPalOrder(orderId: string) {
  const { order, app } = await findPayPalOrder(orderId);
  if (order.status === 'COMPLETED') return order;
  if (order.status !== 'APPROVED')
    throw new Error('Approve this payment before it can be captured.');
  const accessToken = await getPayPalAccessToken(app);
  const response = await fetch(
    `${getPayPalBaseUrl(app)}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': `capture-${orderId}`,
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(20000),
    },
  ).catch(async () => {
    // A disconnected response does not mean the capture failed. Read the same
    // provider order; never initialize a replacement payment after a timeout.
    const recovered = await lookupPayPalOrder(orderId, app).catch(() => null);
    if (recovered?.status === 'COMPLETED')
      return new Response(JSON.stringify(recovered));
    throw new Error('Payment confirmation is pending. Check your order before trying again.');
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (
      response.status >= 500 ||
      data?.details?.some(
        (detail: { issue?: string }) =>
          detail.issue === 'ORDER_ALREADY_CAPTURED',
      )
    ) {
      const completed = await lookupPayPalOrder(orderId, app);
      if (completed?.status === 'COMPLETED') return completed;
    }
    throw new Error(data?.message || 'PayPal payment capture failed.');
  }

  // Capture responses can omit purchase-unit amount/custom_id. Retrieve the
  // canonical order so service verifiers validate the complete saved contract.
  const confirmed = await lookupPayPalOrder(orderId, app);
  if (!confirmed) throw new Error('Payment confirmation is pending. Check your order before retrying.');
  return confirmed;
}

async function verifySignatureForApp(
  input: {
    body: unknown;
    headers: Record<string, string | null>;
  },
  app: PayPalApp,
  webhookId: string,
) {
  const accessToken = await getPayPalAccessToken(app);
  const response = await fetch(
    `${getPayPalBaseUrl(app)}/v1/notifications/verify-webhook-signature`,
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
      signal: AbortSignal.timeout(15000),
    },
  );
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || 'PayPal webhook verification failed.');
  }

  return data;
}

export async function verifyPayPalWebhookSignature(input: {
  body: unknown;
  headers: Record<string, string | null>;
}) {
  for (const app of ['legacy', 'sureimports'] as const) {
    const webhookId = (
      app === 'sureimports'
        ? getPayPalEnvironment(app) === 'sandbox'
          ? process.env.SUREIMPORTS_PAYPAL_SANDBOX_WEBHOOK_ID
          : process.env.SUREIMPORTS_PAYPAL_WEBHOOK_ID
        : process.env.PAYPAL_WEBHOOK_ID
    )?.trim();
    if (!webhookId || !getPayPalAuthHeader(app)) continue;
    // A legacy-app configuration problem must not reject a valid new-app event.
    const result = await verifySignatureForApp(input, app, webhookId).catch(
      () => null,
    );
    if (result?.verification_status === 'SUCCESS') return result;
  }
  return { verification_status: 'FAILURE' };
}
