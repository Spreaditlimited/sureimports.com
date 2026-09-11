import { NextResponse } from 'next/server';
import { retryAwaitingLineScoutAttribution } from '@/lib/affiliate/paymentLedger';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  if (!process.env.CRON_SECRET || request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ ok: true, ...(await retryAwaitingLineScoutAttribution()) });
}
