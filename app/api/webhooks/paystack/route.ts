import { walletTransferWebhook, WalletError } from '@/lib/partners/wallet';
import { NextResponse } from 'next/server';
import { POST as handleSureImportsPaystackEvent } from '../../intelligence/paystack-webhook/route';
import { handlePartnerPaystackEvent } from '@/lib/partners/paystack-order-events';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isLineScoutEvent(payload: any) {
  const reference = String(payload?.data?.reference || payload?.data?.transaction?.reference || payload?.data?.metadata?.reference || '').trim().toUpperCase();
  const source = String(payload?.data?.metadata?.source || payload?.data?.metadata?.application || '').trim().toUpperCase();
  return source === 'LINESCOUT' || /^LS(?:SQ|Q)?_/.test(reference);
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  let payload: unknown;
  try { payload = JSON.parse(rawBody); } catch { return NextResponse.json({ message: 'Invalid webhook payload.' }, { status: 400 }); }
  const signature = request.headers.get('x-paystack-signature') || '';
  const partnerPayload = payload as { data?: { reference?: string; transaction?: { reference?: string } } };
  const partnerReference = String(partnerPayload.data?.transaction?.reference || partnerPayload.data?.reference || '');
  if (partnerReference.startsWith('pww_')) {
    try { return NextResponse.json(await walletTransferWebhook(rawBody, signature)); }
    catch (error) { return NextResponse.json({ message: 'Partner transfer reconciliation required.' }, { status: error instanceof WalletError ? error.status : 503 }); }
  }
  if (partnerReference.startsWith('PCO_')) {
    try { return await handlePartnerPaystackEvent(rawBody, signature); }
    catch { return NextResponse.json({ message: 'Partner payment requires retry or reconciliation.' }, { status: 503 }); }
  }
  if (isLineScoutEvent(payload)) {
    const url = (process.env.LINESCOUT_PAYSTACK_WEBHOOK_URL || 'https://linescout.sureimports.com/api/webhooks/paystack').trim();
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-paystack-signature': signature },
      body: rawBody,
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) return NextResponse.json({ message: 'LineScout webhook delivery failed.' }, { status: 502 });
    return NextResponse.json({ received: true, routedTo: 'LINESCOUT' });
  }
  return handleSureImportsPaystackEvent(new Request(request.url, { method: 'POST', headers: request.headers, body: rawBody }));
}
