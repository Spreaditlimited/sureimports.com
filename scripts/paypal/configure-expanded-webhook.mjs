// Run with: node --env-file=.env.local scripts/paypal/configure-expanded-webhook.mjs [--apply]
// This only configures notifications. It never creates a payment or changes the legacy app.
const client = process.env.SUREIMPORTS_PAYPAL_CLIENT_ID?.trim();
const secret = process.env.SUREIMPORTS_PAYPAL_SECRET?.trim();
const base =
  process.env.SUREIMPORTS_PAYPAL_ENV === 'sandbox'
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';
const target = 'https://www.sureimports.com/api/intelligence/paypal-webhook';
const events = [
  'CHECKOUT.ORDER.APPROVED',
  'PAYMENT.CAPTURE.COMPLETED',
  'PAYMENT.CAPTURE.DENIED',
  'PAYMENT.CAPTURE.REFUNDED',
  'PAYMENT.CAPTURE.REVERSED',
  'CUSTOMER.DISPUTE.CREATED',
  'CUSTOMER.DISPUTE.UPDATED',
  'CUSTOMER.DISPUTE.RESOLVED',
];
try {
  if (!client || !secret)
    throw new Error('New Sure Imports PayPal credentials are missing.');
  const auth = await fetch(`${base}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${client}:${secret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const token = await auth.json();
  if (!auth.ok || !token.access_token)
    throw new Error(`PayPal authentication failed (${auth.status}).`);
  const headers = {
    Authorization: `Bearer ${token.access_token}`,
    'Content-Type': 'application/json',
  };
  const response = await fetch(`${base}/v1/notifications/webhooks`, {
    headers,
  });
  if (!response.ok)
    throw new Error(`Webhook lookup failed (${response.status}).`);
  const data = await response.json();
  let webhook = data.webhooks?.find((item) => item.url === target);
  if (!webhook && process.argv.includes('--apply')) {
    const created = await fetch(`${base}/v1/notifications/webhooks`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        url: target,
        event_types: events.map((name) => ({ name })),
      }),
    });
    if (!created.ok)
      throw new Error(`Webhook creation failed (${created.status}).`);
    webhook = await created.json();
  }
  console.log(
    JSON.stringify({
      target,
      configured: Boolean(webhook?.id),
      webhookId: webhook?.id || null,
      missingEvents: webhook
        ? events.filter(
            (name) =>
              !webhook.event_types?.some(
                (event) => event.name === name || event.name === '*',
              ),
          )
        : events,
    }),
  );
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
