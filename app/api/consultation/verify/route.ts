import { NextResponse } from 'next/server';

import {
  absoluteUrl,
  clean,
  CONSULTATION_DURATION_MINUTES,
  CONSULTATION_TIMEZONE,
  createZoomMeeting,
  slotLabel,
} from '@/lib/consultation';
import xMail from '@/lib/email/xMail';
import { prisma } from '@/lib/prisma';

type BookingRow = {
  pidBooking: string;
  manageToken: string;
  fullName: string;
  email: string;
  phone: string | null;
  businessName: string | null;
  consultationGoal: string | null;
  slotStartUtc: Date;
  slotEndUtc: Date;
  status: string;
  paystackReference: string | null;
};

export async function POST(request: Request) {
  const paystackSecretKey = process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY;
  const { reference } = await request.json().catch(() => ({ reference: '' }));
  const cleanReference = clean(reference, 140);

  if (!cleanReference) {
    return NextResponse.json({ message: 'Payment reference is required.' }, { status: 400 });
  }

  if (!paystackSecretKey) {
    return NextResponse.json(
      { message: 'Sure Imports Paystack secret key is not configured.' },
      { status: 500 },
    );
  }

  const existing = await prisma.$queryRaw<BookingRow[]>`
    SELECT pidBooking, manageToken, fullName, email, phone, businessName, consultationGoal,
           slotStartUtc, slotEndUtc, status, paystackReference
    FROM consultation_bookings
    WHERE paystackReference = ${cleanReference}
    LIMIT 1
  `;
  const booking = existing[0];
  if (!booking) {
    return NextResponse.json({ message: 'Booking not found.' }, { status: 404 });
  }

  if (['booked', 'rescheduled'].includes(booking.status)) {
    return NextResponse.json({ ok: true, booking });
  }

  const verifyResponse = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(cleanReference)}`,
    {
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
      },
    },
  );
  const data = await verifyResponse.json();

  if (!verifyResponse.ok || !data?.status || data?.data?.status !== 'success') {
    await prisma.$executeRaw`
      UPDATE consultation_bookings
      SET status = 'payment_failed', updatedAt = ${new Date()}
      WHERE paystackReference = ${cleanReference}
    `;
    return NextResponse.json(
      { message: data?.message || 'Payment verification failed.' },
      { status: 400 },
    );
  }

  let zoomMeeting;
  try {
    zoomMeeting = await createZoomMeeting({
      topic: `Sure Imports Consultation - ${booking.fullName}`,
      startTimeIso: booking.slotStartUtc.toISOString(),
      durationMinutes: CONSULTATION_DURATION_MINUTES,
      agenda: `Paid Sure Imports consultation with ${booking.fullName}. Goal: ${booking.consultationGoal || ''}`,
    });
  } catch (error) {
    await prisma.$executeRaw`
      UPDATE consultation_bookings
      SET status = 'zoom_failed',
          paystackCustomerCode = ${data.data?.customer?.customer_code || null},
          paidAt = ${data.data?.paid_at ? new Date(data.data.paid_at) : new Date()},
          updatedAt = ${new Date()}
      WHERE paystackReference = ${cleanReference}
    `;
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Could not create Zoom meeting.' },
      { status: 502 },
    );
  }

  await prisma.$executeRaw`
    UPDATE consultation_bookings
    SET status = 'booked',
        paystackCustomerCode = ${data.data?.customer?.customer_code || null},
        paidAt = ${data.data?.paid_at ? new Date(data.data.paid_at) : new Date()},
        zoomMeetingId = ${String(zoomMeeting.id || '')},
        zoomJoinUrl = ${zoomMeeting.join_url || null},
        zoomStartUrl = ${zoomMeeting.start_url || null},
        updatedAt = ${new Date()}
    WHERE paystackReference = ${cleanReference}
  `;

  const timeText = `${slotLabel(booking.slotStartUtc.toISOString())} (${CONSULTATION_TIMEZONE})`;
  const manageUrl = absoluteUrl(
    `/book-consultation?manage=${encodeURIComponent(booking.manageToken)}`,
  );

  await Promise.allSettled([
    xMail({
      xEmail: booking.email,
      xTitle: 'Your Sure Imports consultation is booked',
      xBodyTitle: 'Consultation booked',
      xBody1: `Hello ${booking.fullName},<br />Your paid Sure Imports consultation has been booked.`,
      xBody2: `<b>Time:</b> ${timeText}<br /><b>Zoom link:</b> ${zoomMeeting.join_url || ''}<br /><br />You can manage your booking with the button below.`,
      xButtonTitle: 'Manage Booking',
      xButtonLink: manageUrl,
    }),
    xMail({
      xEmail: process.env.SUREIMPORTS_ADMIN_EMAIL || 'support@sureimports.com',
      xTitle: `Consultation booked - ${booking.fullName}`,
      xBodyTitle: 'New paid consultation booking',
      xBody1: `<b>Name:</b> ${booking.fullName}<br /><b>Email:</b> ${booking.email}<br /><b>Phone:</b> ${booking.phone || ''}<br /><b>Business:</b> ${booking.businessName || ''}`,
      xBody2: `<b>Time:</b> ${timeText}<br /><b>Goal:</b> ${booking.consultationGoal || ''}<br /><b>Zoom start URL:</b> ${zoomMeeting.start_url || ''}`,
      xButtonTitle: 'Open Admin',
      xButtonLink: 'https://admin.sureimports.com/dashboard/consultations',
    }),
  ]);

  return NextResponse.json({ ok: true, booking: { ...booking, status: 'booked' } });
}
