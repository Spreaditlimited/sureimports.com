import { NextResponse } from 'next/server';

import {
  clean,
  CONSULTATION_DURATION_MINUTES,
  isCandidateSlot,
  slotLabel,
  updateZoomMeeting,
} from '@/lib/consultation';
import xMail from '@/lib/email/xMail';
import { prisma } from '@/lib/prisma';

type BookingRow = {
  pidBooking: string;
  fullName: string;
  email: string;
  consultationGoal: string | null;
  status: string;
  zoomMeetingId: string | null;
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const manageToken = clean(body.manageToken, 180);
  const slotStartIso = clean(body.slotStartIso, 80);
  const slotStartDate = new Date(slotStartIso);

  if (!manageToken || !slotStartIso) {
    return NextResponse.json(
      { message: 'Booking token and new slot are required.' },
      { status: 400 },
    );
  }

  if (!Number.isFinite(slotStartDate.getTime()) || !isCandidateSlot(slotStartDate.toISOString())) {
    return NextResponse.json({ message: 'Invalid slot selected.' }, { status: 400 });
  }

  const rows = await prisma.$queryRaw<BookingRow[]>`
    SELECT pidBooking, fullName, email, consultationGoal, status, zoomMeetingId
    FROM consultation_bookings
    WHERE manageToken = ${manageToken}
    LIMIT 1
  `;
  const booking = rows[0];

  if (!booking) {
    return NextResponse.json({ message: 'Booking not found.' }, { status: 404 });
  }

  if (!['booked', 'rescheduled'].includes(booking.status)) {
    return NextResponse.json(
      { message: 'Only confirmed bookings can be rescheduled.' },
      { status: 400 },
    );
  }

  const existingActiveSlot = await prisma.$queryRaw<Array<{ pidBooking: string }>>`
    SELECT pidBooking
    FROM consultation_bookings
    WHERE slotStartUtc = ${slotStartDate}
      AND pidBooking <> ${booking.pidBooking}
      AND status IN ('paid', 'booked', 'rescheduled')
    LIMIT 1
  `;

  if (existingActiveSlot.length > 0) {
    return NextResponse.json(
      { message: 'That slot has just been taken. Please choose another.' },
      { status: 409 },
    );
  }

  const slotEndDate = new Date(
    slotStartDate.getTime() + CONSULTATION_DURATION_MINUTES * 60 * 1000,
  );

  if (booking.zoomMeetingId) {
    await updateZoomMeeting({
      meetingId: booking.zoomMeetingId,
      topic: `Sure Imports Consultation - ${booking.fullName}`,
      startTimeIso: slotStartDate.toISOString(),
      durationMinutes: CONSULTATION_DURATION_MINUTES,
      agenda: `Paid Sure Imports consultation with ${booking.fullName}. Goal: ${booking.consultationGoal || ''}`,
    });
  }

  await prisma.$executeRaw`
    UPDATE consultation_bookings
    SET status = 'rescheduled',
        slotStartUtc = ${slotStartDate},
        slotEndUtc = ${slotEndDate},
        updatedAt = ${new Date()}
    WHERE pidBooking = ${booking.pidBooking}
  `;

  await xMail({
    xEmail: booking.email,
    xTitle: 'Sure Imports consultation rescheduled',
    xBodyTitle: 'Consultation rescheduled',
    xBody1: `Hello ${booking.fullName},<br />Your Sure Imports consultation has been rescheduled.`,
    xBody2: `<b>New time:</b> ${slotLabel(slotStartDate.toISOString())} (Africa/Lagos)`,
    xButtonTitle: 'Manage Booking',
    xButtonLink: `https://www.sureimports.com/book-consultation?manage=${encodeURIComponent(
      manageToken,
    )}`,
  });

  return NextResponse.json({
    ok: true,
    status: 'rescheduled',
    slotStartIso: slotStartDate.toISOString(),
    label: slotLabel(slotStartDate.toISOString()),
  });
}
