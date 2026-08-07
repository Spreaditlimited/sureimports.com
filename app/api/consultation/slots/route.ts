import { NextResponse } from 'next/server';

import { buildCandidateSlots, CONSULTATION_TIMEZONE } from '@/lib/consultation';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const candidates = buildCandidateSlots(21);
  const rows = await prisma.$queryRaw<Array<{ slotStartUtc: Date }>>`
    SELECT slotStartUtc
    FROM consultation_bookings
    WHERE (
        status IN ('cancelling', 'fulfilling', 'paid', 'booked', 'rescheduled')
        OR (status = 'pending_payment' AND createdAt > DATE_SUB(NOW(), INTERVAL 30 MINUTE))
      )
      AND slotStartUtc IS NOT NULL
      AND slotStartUtc > ${new Date()}
  `;
  const booked = new Set(rows.map((row) => row.slotStartUtc.toISOString()));
  const slots = candidates.filter((slot) => !booked.has(slot.startIso));

  return NextResponse.json({
    ok: true,
    timezone: CONSULTATION_TIMEZONE,
    durationMinutes: 30,
    slots: slots.slice(0, 60),
  });
}
