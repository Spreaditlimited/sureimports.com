import { NextResponse } from 'next/server';

import {
  absoluteUrl,
  clean,
  consultationCalendarInvite,
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
  zoomJoinUrl: string | null;
  calendarSequence: number;
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
    SELECT pidBooking, fullName, email, consultationGoal, status, zoomMeetingId, zoomJoinUrl, calendarSequence
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

  const slotEndDate = new Date(
    slotStartDate.getTime() + CONSULTATION_DURATION_MINUTES * 60 * 1000,
  );

  try {
    await prisma.$transaction(async (transaction) => {
      const lockedBooking = await transaction.$queryRaw<
        Array<{ status: string }>
      >`
        SELECT status
        FROM consultation_bookings
        WHERE pidBooking = ${booking.pidBooking}
        LIMIT 1
        FOR UPDATE
      `;
      if (!['booked', 'rescheduled'].includes(lockedBooking[0]?.status || '')) {
        throw new Error('CONSULTATION_NOT_ACTIVE');
      }

      const existingActiveSlot = await transaction.$queryRaw<
        Array<{ pidBooking: string }>
      >`
        SELECT pidBooking
        FROM consultation_bookings
        WHERE slotStartUtc = ${slotStartDate}
          AND pidBooking <> ${booking.pidBooking}
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

      if (booking.zoomMeetingId) {
        await updateZoomMeeting({
          meetingId: booking.zoomMeetingId,
          topic: `Sure Imports Consultation - ${booking.fullName}`,
          startTimeIso: slotStartDate.toISOString(),
          durationMinutes: CONSULTATION_DURATION_MINUTES,
          agenda: `Paid Sure Imports consultation with ${booking.fullName}. Goal: ${booking.consultationGoal || ''}`,
        });
      }

      await transaction.$executeRaw`
        UPDATE consultation_bookings
        SET status = 'rescheduled',
            slotStartUtc = ${slotStartDate},
            slotEndUtc = ${slotEndDate},
            calendarSequence = calendarSequence + 1,
            customerEmailSentAt = NULL,
            adminEmailSentAt = NULL,
            fulfillmentError = NULL,
            updatedAt = ${new Date()}
        WHERE pidBooking = ${booking.pidBooking}
      `;
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : '';
    if (reason.includes('CONSULTATION_SLOT_TAKEN')) {
      return NextResponse.json(
        { message: 'That slot has just been taken. Please choose another.' },
        { status: 409 },
      );
    }
    if (reason.includes('CONSULTATION_NOT_ACTIVE')) {
      return NextResponse.json(
        { message: 'Only confirmed bookings can be rescheduled.' },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { message: reason || 'Could not update the Zoom meeting.' },
      { status: 502 },
    );
  }

  const notifications = await Promise.allSettled([xMail({
    xEmail: booking.email,
    xTitle: 'Sure Imports consultation rescheduled',
    xBodyTitle: 'Consultation rescheduled',
    xBody1: `Hello ${booking.fullName},<br />Your Sure Imports consultation has been rescheduled.`,
    xBody2: `<b>New time:</b> ${slotLabel(slotStartDate.toISOString())} (Africa/Lagos)`,
    xButtonTitle: 'Manage Booking',
    xButtonLink: absoluteUrl(
      `/book-consultation?manage=${encodeURIComponent(manageToken)}`,
    ),
    attachments: [
      {
        filename: 'sure-imports-consultation.ics',
        content: consultationCalendarInvite({
          pidBooking: booking.pidBooking,
          fullName: booking.fullName,
          email: booking.email,
          startDate: slotStartDate,
          endDate: slotEndDate,
          zoomJoinUrl: booking.zoomJoinUrl,
          sequence: booking.calendarSequence + 1,
        }),
        contentType: 'text/calendar; charset=utf-8; method=REQUEST',
      },
    ],
  }),

  xMail({
    xEmail: process.env.SUREIMPORTS_ADMIN_EMAIL || 'support@sureimports.com',
    xTitle: `Consultation rescheduled - ${booking.fullName}`,
    xBodyTitle: 'Consultation rescheduled',
    xBody1: `${booking.fullName} rescheduled a paid consultation.`,
    xBody2: `<b>New time:</b> ${slotLabel(slotStartDate.toISOString())} (Africa/Lagos)`,
    xButtonTitle: 'Open Admin',
    xButtonLink: 'https://admin.sureimports.com/dashboard/consultations',
  })]);

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
        fulfillmentError = ${notificationErrors.length ? `Reschedule notification failed: ${notificationErrors.join('; ')}` : null},
        updatedAt = ${notificationTime}
    WHERE pidBooking = ${booking.pidBooking}
  `;

  return NextResponse.json({
    ok: true,
    status: 'rescheduled',
    slotStartIso: slotStartDate.toISOString(),
    label: slotLabel(slotStartDate.toISOString()),
  });
}
