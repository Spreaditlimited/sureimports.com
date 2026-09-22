import { NextResponse } from 'next/server';

// Retired single-product checkout. All shop purchases use the authenticated,
// server-priced /api/shop/payment/wallet POST flow.
export async function GET() {
  return NextResponse.json({ statusx: 'FAILED', message: 'Please return to the shop and use the checkout to complete your purchase.' }, { status: 410 });
}
