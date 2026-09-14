import { checkoutOriginIsAllowed } from '@/lib/intelligence/reportCheckoutSecurity';
import { signPayPalCheckoutSession } from '@/lib/paypalCheckoutSession';
import { getSureImportsPayPalEnvironment } from '@/lib/paypal';

export async function POST(request: Request, context: { params: Promise<{ accessToken: string }> }) {
  if (!checkoutOriginIsAllowed(request)) return Response.json({ message: 'Invalid origin.' }, { status: 403 });
  const { accessToken } = await context.params;
  const body = await request.json().catch(() => null);
  if (!body || !['create', 'verify'].includes(body.action)) return Response.json({ message: 'Invalid checkout action.' }, { status: 400 });
  try {
    const upstream = await fetch(`${process.env.ADMIN_INVOICING_API_BASE_URL || 'https://admin.sureimports.com'}/api/invoicing/public/invoice/${encodeURIComponent(accessToken)}/paypal`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), cache: 'no-store', signal: AbortSignal.timeout(55000),
    });
    const data = await upstream.json();
    if (!upstream.ok) return Response.json({ message: data.message || 'Invoice payment is unavailable.' }, { status: upstream.status });
    if (body.action === 'create') {
      if (data.environment !== getSureImportsPayPalEnvironment()) throw new Error('Invoice checkout environment mismatch.');
      const invoicePath = `/invoice/${encodeURIComponent(accessToken)}`;
      data.checkoutUrl = `/checkout/paypal?session=${encodeURIComponent(signPayPalCheckoutSession({
        orderId: data.orderId, amount: data.amount, currency: data.currency, description: data.description,
        returnPath: `${invoicePath}?paypalCheckout=${encodeURIComponent(data.checkoutId)}`,
        cancelPath: invoicePath, expiresAt: Date.now() + 2 * 60 * 60 * 1000,
      }))}`;
    }
    return Response.json(data, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch {
    return Response.json({ message: 'Invoice payment service is unavailable. Refresh to check payment status before trying again.' }, { status: 503 });
  }
}
