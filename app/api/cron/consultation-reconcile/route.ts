import { NextResponse } from 'next/server';

import { verifyAndFulfillConsultation } from '@/lib/consultationFulfillment';
import { prisma } from '@/lib/prisma';

type ReconciliationRow = { paystackReference: string };

export async function GET(request: Request) {
  const configuredSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get('authorization');
  if (!configuredSecret || authorization !== `Bearer ${configuredSecret}`) {
    return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
  }

  const bookings = await prisma.$queryRaw<ReconciliationRow[]>`
    SELECT paystackReference
    FROM consultation_bookings
    WHERE paystackReference IS NOT NULL
      AND (
        status IN ('zoom_failed', 'payment_failed')
        OR (status = 'pending_payment' AND createdAt < DATE_SUB(NOW(), INTERVAL 30 MINUTE))
        OR (status = 'fulfilling' AND updatedAt < DATE_SUB(NOW(), INTERVAL 10 MINUTE))
      )
      AND createdAt > DATE_SUB(NOW(), INTERVAL 7 DAY)
      AND (
        lastReconciledAt IS NULL
        OR lastReconciledAt < DATE_SUB(NOW(), INTERVAL 1 HOUR)
      )
    ORDER BY createdAt ASC
    LIMIT 30
  `;

  const results = await Promise.allSettled(
    bookings.map((booking) =>
      verifyAndFulfillConsultation(booking.paystackReference),
    ),
  );

  return NextResponse.json({
    ok: true,
    checked: results.length,
    fulfilled: results.filter((result) => result.status === 'fulfilled').length,
    unresolved: results.filter((result) => result.status === 'rejected').length,
  });
}
