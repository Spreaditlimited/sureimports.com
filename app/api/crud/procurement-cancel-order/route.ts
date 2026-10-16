import { NextResponse } from 'next/server';
import { refundUser, sameOriginMutation } from '@/lib/refunds/request-auth';
import { cancelProcurement, getCancellationQuote, CancellationError } from '@/lib/procurement/cancellation';
import { voidAffiliateConversions } from '@/lib/affiliate/commissions';

/** GET only previews. Cancellation always requires an authenticated, confirmed POST. */
export async function GET(request: Request) {
  const pidUser = await refundUser();
  if (!pidUser) return NextResponse.json({ message: 'Please sign in.' }, { status: 401 });
  try { return NextResponse.json(await getCancellationQuote(new URL(request.url).searchParams.get('pidOrder') || '', { kind: 'customer', pidUser }, true)); }
  catch (error) { return NextResponse.json({ message: error instanceof CancellationError ? error.message : 'Unable to prepare cancellation. Please try again.' }, { status: 409 }); }
}
export async function POST(request: Request) {
  const pidUser = await refundUser();
  if (!pidUser) return NextResponse.json({ message: 'Please sign in.' }, { status: 401 });
  if (!sameOriginMutation(request)) return NextResponse.json({ message: 'Refresh and try again.' }, { status: 403 });
  try {
    const body = await request.json();
    if (body.confirmed !== true) return NextResponse.json({ message: 'Confirm the cancellation fee and refund first.' }, { status: 400 });
    const pidOrder = String(body.pidOrder || '');
    const result = await cancelProcurement(pidOrder, { kind: 'customer', pidUser }, true, String(body.token || ''));
    try { await voidAffiliateConversions({ externalOrderReference: `procurement:${pidOrder}`, reason: 'Order cancelled and refund balance credited.', reversalReference: `cancellation:${pidOrder}` }); } catch { console.error('Cancellation commission reversal requires retry', pidOrder); }
    return NextResponse.json({ ...result, message: 'Order cancelled. Your refund is available on the Refunds page.' });
  } catch (error) { return NextResponse.json({ message: error instanceof CancellationError ? error.message : 'Unable to confirm cancellation. Refresh your order and refund balance before retrying.' }, { status: 409 }); }
}
