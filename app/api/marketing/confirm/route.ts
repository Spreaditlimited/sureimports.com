import { NextRequest, NextResponse } from 'next/server';

import { confirmMarketingOptIn } from '@/lib/marketing/contactLedger';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')?.trim() || '';
  const result = await confirmMarketingOptIn(token);
  const destination = new URL('/email-preferences/confirmed', request.url);
  destination.searchParams.set('status', result.toLowerCase());
  return NextResponse.redirect(destination);
}
