import { NextResponse } from 'next/server';

import { cancelZoomMeeting, clean, slotLabel } from '@/lib/consultation';
import xMail from '@/lib/email/xMail';
import { prisma } from '@/lib/prisma';

type BookingRow = {
  pidBooking: string;
  fullName: string;
  email: string;
  status: string;
  slotStartUtc: Date;
  zoomMeetingId: string | null;
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const manageToken = clean(body.manageToken, 180);

  if (!manageToken) {
    return NextResponse.json({ message: 'Booking token is required.' }, { status: 400 });
  }

  const rows = await prisma.$queryRaw<BookingRow[]>`
    SELECT pidBooking, fullName, email, status, slotStartUtc, zoomMeetingId
    FROM consultation_bookings
    WHERE manageToken = ${manageToken}
    LIMIT 1
  `;
  const booking = rows[0];

  if (!booking) {
    return NextResponse.json({ message: 'Booking not found.' }, { status: 404 });
  }

  if (['cancelled', 'completed'].includes(booking.status)) {
    return NextResponse.json(
      { message: 'This booking can no longer be cancelled.' },
      { status: 400 },
    );
  }

  if (booking.zoomMeetingId) {
    await cancelZoomMeeting(booking.zoomMeetingId);
  }

  await prisma.$executeRaw`
    UPDATE consultation_bookings
    SET status = 'cancelled',
        cancelReason = 'Cancelled by customer',
        cancelledAt = ${new Date()},
        updatedAt = ${new Date()}
    WHERE pidBooking = ${booking.pidBooking}
  `;

  await xMail({
    xEmail: booking.email,
    xTitle: 'Sure Imports consultation cancelled',
    xBodyTitle: 'Consultation cancelled',
    xBody1: `Hello ${booking.fullName},<br />Your Sure Imports consultation for ${slotLabel(
      booking.slotStartUtc.toISOString(),
    )} has been cancelled.`,
    xBody2:
      'If you need a new consultation, you can return to the booking page and choose another time.',
    xButtonTitle: 'Book Again',
    xButtonLink: 'https://www.sureimports.com/book-consultation',
  });

  return NextResponse.json({ ok: true, status: 'cancelled' });
}
