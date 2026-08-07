import { NextResponse } from 'next/server';

import {
  absoluteUrl,
  bookingTokens,
  clean,
  consultationAmountKobo,
  isCandidateSlot,
} from '@/lib/consultation';
import { prisma } from '@/lib/prisma';

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  const paystackSecretKey = process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY;

  if (!paystackSecretKey) {
    return NextResponse.json(
      { message: 'Sure Imports Paystack secret key is not configured.' },
      { status: 500 },
    );
  }

  const amountKobo = consultationAmountKobo();
  if (!amountKobo || amountKobo < 100) {
    return NextResponse.json(
      { message: 'Set SUREIMPORTS_CONSULTATION_AMOUNT_KOBO before accepting bookings.' },
      { status: 500 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const fullName = clean(body.fullName, 180);
  const email = clean(body.email, 255).toLowerCase();
  const phone = clean(body.phone, 80);
  const businessName = clean(body.businessName, 180);
  const consultationGoal = clean(body.consultationGoal, 4000);
  const slotStartIso = clean(body.slotStartIso, 80);
  const slotStartDate = new Date(slotStartIso);

  if (!fullName || !validEmail(email) || !phone || !consultationGoal || !slotStartIso) {
    return NextResponse.json(
      { message: 'Please complete all required fields.' },
      { status: 400 },
    );
  }

  if (!Number.isFinite(slotStartDate.getTime()) || !isCandidateSlot(slotStartDate.toISOString())) {
    return NextResponse.json({ message: 'Invalid slot selected.' }, { status: 400 });
  }

  const slotEndDate = new Date(slotStartDate.getTime() + 30 * 60 * 1000);
  const { pidBooking, manageToken } = bookingTokens();
  const reference = `SI_CONSULT_${Date.now()}_${pidBooking.slice(-6)}`;

  try {
    await prisma.$transaction(async (transaction) => {
      const existingActiveSlot = await transaction.$queryRaw<
        Array<{ pidBooking: string }>
      >`
        SELECT pidBooking
        FROM consultation_bookings
        WHERE slotStartUtc = ${slotStartDate}
          AND (
            status IN ('cancelling', 'fulfilling', 'paid', 'booked', 'rescheduled')
            OR (status = 'pending_payment' AND createdAt > DATE_SUB(NOW(), INTERVAL 30 MINUTE))
          )
        LIMIT 1
        FOR UPDATE
      `;

      if (existingActiveSlot.length > 0) {
        throw new Error('CONSULTATION_SLOT_TAKEN');
      }

      await transaction.$executeRaw`
        INSERT INTO consultation_bookings (
          pidBooking,
          manageToken,
          fullName,
          email,
          phone,
          businessName,
          consultationGoal,
          slotStartUtc,
          slotEndUtc,
          status,
          amountKobo,
          currency,
          paystackReference,
          createdAt,
          updatedAt
        ) VALUES (
          ${pidBooking},
          ${manageToken},
          ${fullName},
          ${email},
          ${phone},
          ${businessName || null},
          ${consultationGoal},
          ${slotStartDate},
          ${slotEndDate},
          'pending_payment',
          ${amountKobo},
          'NGN',
          ${reference},
          ${new Date()},
          ${new Date()}
        )
      `;
    });
  } catch (error: any) {
    const reason = String(error?.code || error?.message || '');
    if (reason.includes('Duplicate') || reason.includes('CONSULTATION_SLOT_TAKEN')) {
      return NextResponse.json(
        { message: 'That slot has just been taken. Please choose another.' },
        { status: 409 },
      );
    }
    throw error;
  }

  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${paystackSecretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      amount: amountKobo,
      currency: 'NGN',
      reference,
      callback_url: absoluteUrl('/book-consultation/verify'),
      metadata: {
        product: 'sureimports_consultation',
        pidBooking,
      },
    }),
  });
  const data = await response.json();

  if (!response.ok || !data?.status || !data?.data?.authorization_url) {
    await prisma.$executeRaw`
      UPDATE consultation_bookings
      SET status = 'payment_failed', updatedAt = ${new Date()}
      WHERE pidBooking = ${pidBooking}
    `;
    return NextResponse.json(
      { message: data?.message || 'Unable to initialize payment.' },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    authorizationUrl: data.data.authorization_url,
    reference,
  });
}
