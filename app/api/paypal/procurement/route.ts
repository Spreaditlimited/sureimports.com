import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth/checkAuth';
import {
  checkoutOriginIsAllowed,
  checkoutReturnUrl,
} from '@/lib/intelligence/reportCheckoutSecurity';
import {
  startProcurementPayPalCheckout,
  confirmProcurementPayPalCheckout,
} from '@/lib/procurement/paypalCheckout';

export async function POST(request: Request) {
  if (!checkoutOriginIsAllowed(request))
    return NextResponse.json({ message: 'Invalid origin.' }, { status: 403 });
  const auth = await checkAuth();
  if (!auth)
    return NextResponse.json(
      { message: 'Please sign in again.' },
      { status: 401 },
    );
  const body = await request.json().catch(() => null);
  try {
    if (body?.action === 'verify' && typeof body.reference === 'string') {
      const result = await confirmProcurementPayPalCheckout(
        body.reference,
        auth.pidUser,
        true,
      );
      if (!result)
        return NextResponse.json(
          { message: 'Payment not found.' },
          { status: 404 },
        );
      return NextResponse.json(result);
    }
    if (
      typeof body?.pidOrder !== 'string' ||
      !body.pidOrder ||
      body.pidOrder.length > 191
    ) {
      return NextResponse.json(
        { message: 'Order reference is required.' },
        { status: 400 },
      );
    }
    const authorizationUrl = await startProcurementPayPalCheckout(
      body.pidOrder,
      auth.pidUser,
      new URL(checkoutReturnUrl(request, '/')).origin,
    );
    return NextResponse.json({ authorizationUrl });
  } catch (error) {
    console.error(
      'Procurement PayPal checkout failed:',
      error instanceof Error ? error.name : 'Unknown error',
    );
    return NextResponse.json(
      {
        message:
          error instanceof Error && error.name === 'Error'
            ? error.message
            : 'Checkout is temporarily unavailable. Please try again shortly.',
      },
      { status: 409 },
    );
  }
}
