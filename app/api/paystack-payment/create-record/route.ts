import { NextResponse } from 'next/server';

// Obsolete shop route: the current public and dashboard checkout share /api/shop.
export async function POST() {
  return NextResponse.json({ success: false, message: 'Please return to the shop checkout. If you have already paid, check My Orders or contact support with your reference.' }, { status: 410 });
}
