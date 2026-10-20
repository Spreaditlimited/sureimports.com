import 'server-only';
import {
  getPayPalAccessToken,
  getSureImportsPayPalEnvironment,
} from '@/lib/paypal';
export async function intelligencePayPalRequest(
  path: string,
  body?: unknown,
  requestId?: string,
) {
  if (!path.startsWith('/v1/')) throw Error('Invalid PayPal endpoint.');
  const base =
    getSureImportsPayPalEnvironment() === 'sandbox'
      ? 'https://api-m.sandbox.paypal.com'
      : 'https://api-m.paypal.com';
  const token = await getPayPalAccessToken();
  const response = await fetch(base + path, {
    method: body === undefined ? 'GET' : 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(requestId ? { 'PayPal-Request-Id': requestId } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    cache: 'no-store',
    signal: AbortSignal.timeout(20000),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok)
    throw Error('PayPal could not complete this request. Please try again.');
  return data;
}
