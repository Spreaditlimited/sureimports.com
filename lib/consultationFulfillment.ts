import {
  absoluteUrl,
  clean,
  consultationCalendarInvite,
  CONSULTATION_DURATION_MINUTES,
  CONSULTATION_TIMEZONE,
  createZoomMeeting,
  getZoomMeeting,
  slotLabel,
} from '@/lib/consultation';
import xMail from '@/lib/email/xMail';
import { prisma } from '@/lib/prisma';

type ConsultationBookingRow = {
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
  amountKobo: number;
  currency: string;
  paystackReference: string;
  zoomMeetingId: string | null;
  zoomJoinUrl: string | null;
  zoomStartUrl: string | null;
  customerEmailSentAt: Date | null;
  adminEmailSentAt: Date | null;
  calendarSequence: number;
};

export type PaystackConsultationPayment = {
  reference?: string;
  status?: string;
  amount?: number | string;
  currency?: string;
  paid_at?: string;
  customer?: { customer_code?: string };
  metadata?: { product?: string; pidBooking?: string };
};

function paymentError(message: string) {
  const error = new Error(message);
  error.name = 'ConsultationPaymentValidationError';
  return error;
}

async function getBooking(reference: string) {
  const rows = await prisma.$queryRaw<ConsultationBookingRow[]>`
    SELECT pidBooking, manageToken, fullName, email, phone, businessName,
           consultationGoal, slotStartUtc, slotEndUtc, status, amountKobo,
           currency, paystackReference, zoomMeetingId, zoomJoinUrl, zoomStartUrl,
           customerEmailSentAt, adminEmailSentAt, calendarSequence
    FROM consultation_bookings
    WHERE paystackReference = ${reference}
    LIMIT 1
  `;
  return rows[0] || null;
}

function validatePayment(
  booking: ConsultationBookingRow,
  payment: PaystackConsultationPayment,
) {
  if (payment.status !== 'success') {
    throw paymentError('Payment has not completed successfully.');
  }
  if (clean(payment.reference, 140) !== booking.paystackReference) {
    throw paymentError('Payment reference does not match this booking.');
  }
  if (Number(payment.amount) !== booking.amountKobo) {
    throw paymentError('Payment amount does not match this booking.');
  }
  if (clean(payment.currency, 10).toUpperCase() !== booking.currency.toUpperCase()) {
    throw paymentError('Payment currency does not match this booking.');
  }
  if (
    payment.metadata?.product !== 'sureimports_consultation' ||
    clean(payment.metadata?.pidBooking, 80) !== booking.pidBooking
  ) {
    throw paymentError('Payment metadata does not match this booking.');
  }
}

async function recordFulfillmentError(reference: string, message: string) {
  await prisma.$executeRaw`
    UPDATE consultation_bookings
    SET fulfillmentError = CONCAT_WS('\n', NULLIF(fulfillmentError, ''), ${clean(message, 4000)}),
        updatedAt = ${new Date()}
    WHERE paystackReference = ${reference}
  `;
}

async function deliverConfirmationEmails(booking: ConsultationBookingRow) {
  const timeText = `${slotLabel(booking.slotStartUtc.toISOString())} (${CONSULTATION_TIMEZONE})`;
  const manageUrl = absoluteUrl(
    `/book-consultation?manage=${encodeURIComponent(booking.manageToken)}`,
  );
  const calendarAttachment = {
    filename: 'sure-imports-consultation.ics',
    content: consultationCalendarInvite({
      pidBooking: booking.pidBooking,
      fullName: booking.fullName,
      email: booking.email,
      startDate: booking.slotStartUtc,
      endDate: booking.slotEndUtc,
      zoomJoinUrl: booking.zoomJoinUrl,
      sequence: booking.calendarSequence,
    }),
    contentType: 'text/calendar; charset=utf-8; method=REQUEST',
  };

  let customerEmailSent = Boolean(booking.customerEmailSentAt);
  let adminEmailSent = Boolean(booking.adminEmailSentAt);
  let attemptedDelivery = false;

  if (!customerEmailSent) {
    attemptedDelivery = true;
    try {
      await xMail({
        xEmail: booking.email,
        xTitle: 'Your Sure Imports consultation is booked',
        xBodyTitle: 'Consultation booked',
        xBody1: `Hello ${booking.fullName},<br />Your paid Sure Imports consultation has been booked. A calendar invitation is attached.`,
        xBody2: `<b>Time:</b> ${timeText}<br /><b>Zoom link:</b> ${booking.zoomJoinUrl || ''}<br /><br />You can manage your booking with the button below.`,
        xButtonTitle: 'Manage Booking',
        xButtonLink: manageUrl,
        attachments: [calendarAttachment],
      });
      customerEmailSent = true;
      await prisma.$executeRaw`
        UPDATE consultation_bookings
        SET customerEmailSentAt = ${new Date()}, updatedAt = ${new Date()}
        WHERE pidBooking = ${booking.pidBooking}
      `;
    } catch (error) {
      await recordFulfillmentError(
        booking.paystackReference,
        `Customer confirmation email failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  if (!adminEmailSent) {
    attemptedDelivery = true;
    try {
      await xMail({
        xEmail: process.env.SUREIMPORTS_ADMIN_EMAIL || 'support@sureimports.com',
        xTitle: `Consultation booked - ${booking.fullName}`,
        xBodyTitle: 'New paid consultation booking',
        xBody1: `<b>Name:</b> ${booking.fullName}<br /><b>Email:</b> ${booking.email}<br /><b>Phone:</b> ${booking.phone || ''}<br /><b>Business:</b> ${booking.businessName || ''}`,
        xBody2: `<b>Time:</b> ${timeText}<br /><b>Goal:</b> ${booking.consultationGoal || ''}<br /><b>Zoom start URL:</b> ${booking.zoomStartUrl || ''}`,
        xButtonTitle: 'Open Admin',
        xButtonLink: 'https://admin.sureimports.com/dashboard/consultations',
      });
      adminEmailSent = true;
      await prisma.$executeRaw`
        UPDATE consultation_bookings
        SET adminEmailSentAt = ${new Date()}, updatedAt = ${new Date()}
        WHERE pidBooking = ${booking.pidBooking}
      `;
    } catch (error) {
      await recordFulfillmentError(
        booking.paystackReference,
        `Admin notification email failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  if (attemptedDelivery && customerEmailSent && adminEmailSent) {
    await prisma.$executeRaw`
      UPDATE consultation_bookings
      SET fulfillmentError = NULL, updatedAt = ${new Date()}
      WHERE pidBooking = ${booking.pidBooking}
        AND status IN ('booked', 'rescheduled', 'completed', 'follow_up', 'no_show')
    `;
  }

  return { customerEmailSent, adminEmailSent };
}

export async function fulfillConsultationPayment(
  payment: PaystackConsultationPayment,
) {
  const reference = clean(payment.reference, 140);
  if (!reference) throw paymentError('Payment reference is required.');

  let booking = await getBooking(reference);
  if (!booking) throw paymentError('Booking not found.');
  validatePayment(booking, payment);

  const paidAt = payment.paid_at ? new Date(payment.paid_at) : new Date();
  if (booking.status === 'cancelled') {
    await prisma.$executeRaw`
      UPDATE consultation_bookings
      SET paidAt = ${paidAt}, paymentVerifiedAt = ${new Date()},
          fulfillmentError = 'Payment succeeded after cancellation; manual review or refund required.',
          updatedAt = ${new Date()}
      WHERE paystackReference = ${reference}
    `;
    return { status: 'cancelled', customerEmailSent: false, requiresReview: true };
  }

  const needsZoomRepair =
    ['booked', 'rescheduled'].includes(booking.status) &&
    (!booking.zoomMeetingId || !booking.zoomJoinUrl || !booking.zoomStartUrl);
  if (
    ['booked', 'rescheduled', 'completed', 'follow_up', 'no_show'].includes(
      booking.status,
    ) &&
    !needsZoomRepair
  ) {
    const emails = await deliverConfirmationEmails(booking);
    return { status: booking.status, ...emails };
  }

  const claimResult = await prisma.$transaction(async (transaction) => {
    const lockedRows = await transaction.$queryRaw<
      Array<{
        pidBooking: string;
        status: string;
        slotStartUtc: Date;
        zoomMeetingId: string | null;
        zoomJoinUrl: string | null;
        zoomStartUrl: string | null;
      }>
    >`
      SELECT pidBooking, status, slotStartUtc, zoomMeetingId, zoomJoinUrl, zoomStartUrl
      FROM consultation_bookings
      WHERE paystackReference = ${reference}
      LIMIT 1
      FOR UPDATE
    `;
    const lockedBooking = lockedRows[0];
    if (!lockedBooking) return 'missing';
    const canClaim =
      ['pending_payment', 'payment_failed', 'zoom_failed'].includes(
        lockedBooking.status,
      ) ||
      lockedBooking.status === 'fulfilling' ||
      (['booked', 'rescheduled'].includes(lockedBooking.status) &&
        (!lockedBooking.zoomMeetingId ||
          !lockedBooking.zoomJoinUrl ||
          !lockedBooking.zoomStartUrl));
    if (!canClaim) return 'not_claimed';

    const conflicts = await transaction.$queryRaw<
      Array<{ pidBooking: string }>
    >`
      SELECT pidBooking
      FROM consultation_bookings
      WHERE slotStartUtc = ${lockedBooking.slotStartUtc}
        AND pidBooking <> ${lockedBooking.pidBooking}
        AND (
          status IN ('cancelling', 'fulfilling', 'paid', 'booked', 'rescheduled')
          OR (status = 'pending_payment' AND createdAt > DATE_SUB(NOW(), INTERVAL 30 MINUTE))
        )
      LIMIT 1
      FOR UPDATE
    `;
    if (conflicts.length) {
      await transaction.$executeRaw`
        UPDATE consultation_bookings
        SET status = 'payment_conflict',
            paidAt = ${paidAt},
            paymentVerifiedAt = ${new Date()},
            paystackCustomerCode = ${payment.customer?.customer_code || null},
            fulfillmentError = 'Payment succeeded after the slot was reassigned; manual review or refund required.',
            lastReconciledAt = ${new Date()},
            updatedAt = ${new Date()}
        WHERE paystackReference = ${reference}
      `;
      return 'conflict';
    }

    const claimed = await transaction.$executeRaw`
      UPDATE consultation_bookings
      SET status = 'fulfilling',
          paidAt = ${paidAt},
          paymentVerifiedAt = ${new Date()},
          paystackCustomerCode = ${payment.customer?.customer_code || null},
          fulfillmentError = NULL,
          lastReconciledAt = ${new Date()},
          updatedAt = ${new Date()}
      WHERE paystackReference = ${reference}
        AND (
          status IN ('pending_payment', 'payment_failed', 'zoom_failed')
          OR (status IN ('booked', 'rescheduled') AND (zoomMeetingId IS NULL OR zoomJoinUrl IS NULL OR zoomStartUrl IS NULL))
          OR (status = 'fulfilling' AND updatedAt < DATE_SUB(NOW(), INTERVAL 10 MINUTE))
        )
    `;
    return claimed ? 'claimed' : 'not_claimed';
  });

  if (claimResult === 'conflict') {
    const notifications = await Promise.allSettled([
      xMail({
        xEmail: booking.email,
        xTitle: 'Your Sure Imports consultation payment needs review',
        xBodyTitle: 'Payment received — scheduling review needed',
        xBody1: `Hello ${booking.fullName},<br />We received your consultation payment, but the selected time is no longer available.`,
        xBody2:
          'Our team will contact you to arrange another time or resolve the payment. You do not need to pay again.',
        xButtonTitle: 'View Booking',
        xButtonLink: absoluteUrl(
          `/book-consultation?manage=${encodeURIComponent(booking.manageToken)}`,
        ),
      }),
      xMail({
        xEmail: process.env.SUREIMPORTS_ADMIN_EMAIL || 'support@sureimports.com',
        xTitle: `Urgent: paid consultation slot conflict - ${booking.fullName}`,
        xBodyTitle: 'Paid consultation requires manual review',
        xBody1: `<b>Name:</b> ${booking.fullName}<br /><b>Email:</b> ${booking.email}<br /><b>Reference:</b> ${booking.paystackReference}`,
        xBody2: `<b>Requested time:</b> ${slotLabel(booking.slotStartUtc.toISOString())}<br />The slot was reassigned before this payment completed. Arrange a replacement time or refund.`,
        xButtonTitle: 'Open Admin',
        xButtonLink: 'https://admin.sureimports.com/dashboard/consultations?view=issues',
      }),
    ]);
    const failedNotifications = notifications.filter(
      (notification) => notification.status === 'rejected',
    );
    if (failedNotifications.length) {
      await recordFulfillmentError(
        reference,
        `${failedNotifications.length} payment-conflict notification(s) failed.`,
      );
    }
    return {
      status: 'payment_conflict',
      customerEmailSent: false,
      requiresReview: true,
    };
  }
  if (claimResult !== 'claimed') {
    booking = await getBooking(reference);
    if (!booking) throw paymentError('Booking not found.');
    return { status: booking.status, processing: booking.status === 'fulfilling' };
  }

  try {
    let zoomMeeting;
    try {
      zoomMeeting = booking.zoomMeetingId
        ? await getZoomMeeting(booking.zoomMeetingId)
        : null;
    } catch {
      zoomMeeting = null;
    }
    zoomMeeting ||= await createZoomMeeting({
        topic: `Sure Imports Consultation - ${booking.fullName}`,
        startTimeIso: booking.slotStartUtc.toISOString(),
        durationMinutes: CONSULTATION_DURATION_MINUTES,
        agenda: `Paid Sure Imports consultation with ${booking.fullName}. Goal: ${booking.consultationGoal || ''}`,
      });

    await prisma.$executeRaw`
      UPDATE consultation_bookings
      SET status = ${booking.status === 'rescheduled' ? 'rescheduled' : 'booked'},
          zoomMeetingId = ${String(zoomMeeting.id || '')},
          zoomJoinUrl = ${zoomMeeting.join_url || null},
          zoomStartUrl = ${zoomMeeting.start_url || null},
          fulfillmentError = NULL,
          updatedAt = ${new Date()}
      WHERE paystackReference = ${reference}
        AND status = 'fulfilling'
    `;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not create Zoom meeting.';
    await prisma.$executeRaw`
      UPDATE consultation_bookings
      SET status = 'zoom_failed', fulfillmentError = ${clean(message, 4000)},
          updatedAt = ${new Date()}
      WHERE paystackReference = ${reference}
    `;
    throw error;
  }

  booking = await getBooking(reference);
  if (!booking) throw new Error('Booking disappeared during fulfillment.');
  const emails = await deliverConfirmationEmails(booking);
  return { status: booking.status, ...emails };
}

export async function verifyAndFulfillConsultation(referenceInput: unknown) {
  const reference = clean(referenceInput, 140);
  const paystackSecretKey = process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY;
  if (!reference) throw paymentError('Payment reference is required.');
  if (!paystackSecretKey) throw new Error('Paystack secret key is not configured.');

  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${paystackSecretKey}` }, cache: 'no-store' },
  );
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.status || payload?.data?.status !== 'success') {
    await prisma.$executeRaw`
      UPDATE consultation_bookings
      SET status = CASE
            WHEN status = 'pending_payment' THEN 'payment_failed'
            ELSE status
          END,
          lastReconciledAt = ${new Date()},
          fulfillmentError = ${clean(payload?.message || 'Payment verification failed.', 4000)},
          updatedAt = ${new Date()}
      WHERE paystackReference = ${reference}
        AND status NOT IN ('booked', 'rescheduled', 'completed', 'cancelled')
    `;
    throw paymentError(payload?.message || 'Payment verification failed.');
  }
  return fulfillConsultationPayment(payload.data);
}
