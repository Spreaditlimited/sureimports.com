import { NextResponse } from 'next/server';

import {
  cancelZoomMeeting,
  clean,
  consultationCalendarInvite,
  slotLabel,
} from '@/lib/consultation';
import xMail from '@/lib/email/xMail';
import { prisma } from '@/lib/prisma';

type BookingRow = {
  pidBooking: string;
  fullName: string;
  email: string;
  status: string;
  slotStartUtc: Date;
  slotEndUtc: Date;
  zoomMeetingId: string | null;
  calendarSequence: number;
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const manageToken = clean(body.manageToken, 180);

  if (!manageToken) {
    return NextResponse.json({ message: 'Booking token is required.' }, { status: 400 });
  }

  const rows = await prisma.$queryRaw<BookingRow[]>`
    SELECT pidBooking, fullName, email, status, slotStartUtc, slotEndUtc, zoomMeetingId, calendarSequence
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

  const claimed = await prisma.$executeRaw`
    UPDATE consultation_bookings
    SET status = 'cancelling', updatedAt = ${new Date()}
    WHERE pidBooking = ${booking.pidBooking}
      AND status IN ('booked', 'rescheduled', 'follow_up', 'zoom_failed', 'payment_failed', 'pending_payment')
  `;
  if (!claimed) {
    return NextResponse.json(
      { message: 'This booking is currently being updated. Please try again.' },
      { status: 409 },
    );
  }

  try {
    if (booking.zoomMeetingId) {
      await cancelZoomMeeting(booking.zoomMeetingId);
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Could not cancel Zoom meeting.';
    await prisma.$executeRaw`
      UPDATE consultation_bookings
      SET status = ${booking.status},
          fulfillmentError = CONCAT_WS('\n', NULLIF(fulfillmentError, ''), ${`Zoom cancellation failed: ${message}`}),
          updatedAt = ${new Date()}
      WHERE pidBooking = ${booking.pidBooking}
        AND status = 'cancelling'
    `;
    return NextResponse.json({ message }, { status: 502 });
  }

  await prisma.$executeRaw`
    UPDATE consultation_bookings
    SET status = 'cancelled',
        calendarSequence = calendarSequence + 1,
        cancelReason = 'Cancelled by customer',
        cancelledAt = ${new Date()},
        updatedAt = ${new Date()}
    WHERE pidBooking = ${booking.pidBooking}
      AND status = 'cancelling'
  `;

  const notifications = await Promise.allSettled([
    xMail({
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
      attachments: [
        {
          filename: 'sure-imports-consultation-cancelled.ics',
          content: consultationCalendarInvite({
            pidBooking: booking.pidBooking,
            fullName: booking.fullName,
            email: booking.email,
            startDate: booking.slotStartUtc,
            endDate: booking.slotEndUtc,
            method: 'CANCEL',
            sequence: booking.calendarSequence + 1,
          }),
          contentType: 'text/calendar; charset=utf-8; method=CANCEL',
        },
      ],
    }),
    xMail({
      xEmail: process.env.SUREIMPORTS_ADMIN_EMAIL || 'support@sureimports.com',
      xTitle: `Consultation cancelled - ${booking.fullName}`,
      xBodyTitle: 'Customer cancelled consultation',
      xBody1: `${booking.fullName} cancelled their consultation.`,
      xBody2: `<b>Former time:</b> ${slotLabel(booking.slotStartUtc.toISOString())} (Africa/Lagos)`,
      xButtonTitle: 'Open Admin',
      xButtonLink: 'https://admin.sureimports.com/dashboard/consultations',
    }),
  ]);

  const notificationErrors = notifications
    .filter((result) => result.status === 'rejected')
    .map((result) =>
      result.status === 'rejected' && result.reason instanceof Error
        ? result.reason.message
        : 'Notification failed',
    );
  const notificationTime = new Date();
  await prisma.$executeRaw`
    UPDATE consultation_bookings
    SET customerEmailSentAt = ${notifications[0]?.status === 'fulfilled' ? notificationTime : null},
        adminEmailSentAt = ${notifications[1]?.status === 'fulfilled' ? notificationTime : null},
        fulfillmentError = ${notificationErrors.length ? `Cancellation notification failed: ${notificationErrors.join('; ')}` : null},
        updatedAt = ${notificationTime}
    WHERE pidBooking = ${booking.pidBooking}
  `;

  return NextResponse.json({ ok: true, status: 'cancelled' });
}
