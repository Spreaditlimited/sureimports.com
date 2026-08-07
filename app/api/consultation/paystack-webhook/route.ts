import crypto from 'crypto';
import { NextResponse } from 'next/server';

import { fulfillConsultationPayment } from '@/lib/consultationFulfillment';

function signatureIsValid(body: string, signature: string | null) {
  const secret = process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY;
  if (!secret || !signature) return false;

  const expected = Buffer.from(
    crypto.createHmac('sha512', secret).update(body).digest('hex'),
  );
  const received = Buffer.from(signature);
  return (
    expected.length === received.length &&
    crypto.timingSafeEqual(expected, received)
  );
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  if (!signatureIsValid(rawBody, request.headers.get('x-paystack-signature'))) {
    return NextResponse.json({ message: 'Invalid signature.' }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  if (
    payload?.event !== 'charge.success' ||
    payload?.data?.status !== 'success' ||
    payload?.data?.metadata?.product !== 'sureimports_consultation'
  ) {
    return NextResponse.json({ received: true });
  }

  try {
    const result = await fulfillConsultationPayment(payload.data);
    return NextResponse.json({ received: true, status: result.status });
  } catch (error) {
    console.error('Consultation webhook fulfillment failed:', error);
    return NextResponse.json(
      { message: 'Consultation fulfillment failed.' },
      { status: 500 },
    );
  }
}
