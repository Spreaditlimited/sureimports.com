import { createHmac, timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { ingestLineScoutLedgerEvent, type ExternalLedgerEvent } from '@/lib/affiliate/paymentLedger';

export const runtime = 'nodejs';

function validSignature(raw: string, timestamp: string, signature: string) {
  const secret = process.env.LINESCOUT_LEDGER_SECRET?.trim();
  const seconds = Number(timestamp);
  if (!secret || !Number.isInteger(seconds) || Math.abs(Math.floor(Date.now() / 1000) - seconds) > 300) return false;
  const expected = createHmac('sha256', secret).update(`${timestamp}.${raw}`).digest('hex');
  const supplied = Buffer.from(signature, 'hex');
  const calculated = Buffer.from(expected, 'hex');
  return supplied.length === calculated.length && timingSafeEqual(supplied, calculated);
}

export async function POST(request: NextRequest) {
  const raw = await request.text();
  const timestamp = request.headers.get('x-sureimports-timestamp') || '';
  const signature = request.headers.get('x-sureimports-signature') || '';
  if (!validSignature(raw, timestamp, signature)) {
    return NextResponse.json({ error: 'Invalid event signature.' }, { status: 401 });
  }
  try {
    const result = await ingestLineScoutLedgerEvent(JSON.parse(raw) as ExternalLedgerEvent, raw);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to process payment event.';
    const status = /invalid|required|unsupported|reused/i.test(message) ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
