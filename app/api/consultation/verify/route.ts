import { NextResponse } from 'next/server';

import { clean } from '@/lib/consultation';
import { verifyAndFulfillConsultation } from '@/lib/consultationFulfillment';

export async function POST(request: Request) {
  const { reference } = await request.json().catch(() => ({ reference: '' }));
  const cleanReference = clean(reference, 140);

  if (!cleanReference) {
    return NextResponse.json(
      { message: 'Payment reference is required.' },
      { status: 400 },
    );
  }

  try {
    const result = await verifyAndFulfillConsultation(cleanReference);
    if ('requiresReview' in result && result.requiresReview) {
      return NextResponse.json(
        {
          message:
            'Your payment was received, but this slot now requires manual review. Our team has been notified and will contact you.',
          paymentReceived: true,
        },
        { status: 409 },
      );
    }
    return NextResponse.json({
      ok: true,
      status: result.status,
      processing: Boolean('processing' in result && result.processing),
      customerEmailSent: Boolean(
        'customerEmailSent' in result && result.customerEmailSent,
      ),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Could not finish booking.';
    const paymentError =
      error instanceof Error &&
      error.name === 'ConsultationPaymentValidationError';

    return NextResponse.json(
      { message },
      { status: paymentError ? 400 : 502 },
    );
  }
}
