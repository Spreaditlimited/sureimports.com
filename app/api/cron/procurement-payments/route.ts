import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  verifyProcurementCheckout,
  completeProcurementPaymentEffects,
} from '@/lib/procurement/paystackCheckout';

export const maxDuration = 60;
export async function GET(request: Request) {
  if (
    !process.env.CRON_SECRET ||
    request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`
  )
    return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
  const rows = await prisma.$queryRaw<
    { reference: string }[]
  >`SELECT reference FROM procurement_paystack_checkouts WHERE (status='PENDING' OR (status='PAID' AND effectsStatus<>'DONE')) AND updatedAt < DATE_SUB(NOW(), INTERVAL 5 MINUTE) ORDER BY updatedAt ASC LIMIT 10`;
  const results = await Promise.allSettled(
    rows.map(async ({ reference }) => {
      await prisma.$executeRaw`UPDATE procurement_paystack_checkouts SET attempts=attempts+1,updatedAt=NOW(3) WHERE reference=${reference} AND status='PENDING'`;
      try {
        await completeProcurementPaymentEffects(reference);
        return await verifyProcurementCheckout(reference);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message.slice(0, 191)
            : 'Verification failed';
        await prisma.$executeRaw`UPDATE procurement_paystack_checkouts SET lastError=${message} WHERE reference=${reference} AND status='PENDING'`;
        throw error;
      }
    }),
  );
  return NextResponse.json({
    checked: rows.length,
    paid: results.filter(
      (r) =>
        r.status === 'fulfilled' && ['PAID', 'REVIEW'].includes(r.value.status),
    ).length,
    retrying: results.filter((r) => r.status === 'rejected').length,
  });
}
