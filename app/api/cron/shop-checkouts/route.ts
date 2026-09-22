import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { processShopEffects, verifyShopCheckout } from '@/lib/shop/checkout';

export const maxDuration = 300;
export async function GET(request: Request) {
  if (
    !process.env.CRON_SECRET ||
    request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`
  )
    return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
  const rows = await prisma.shop_checkouts.findMany({
    where: {
      OR: [
        {
          status: 'PAID',
          OR: [
            { affiliateDoneAt: null },
            { customerEmailSentAt: null },
            { adminEmailSentAt: null },
            { accountSetupRequired: true, accountSetupEmailSentAt: null },
          ],
        },
        {
          status: 'PENDING',
          provider: 'PAYSTACK',
          initializationStartedAt: { not: null },
          createdAt: { gt: new Date(Date.now() - 7 * 86400000) },
          OR: [
            { lastCheckedAt: null },
            { lastCheckedAt: { lt: new Date(Date.now() - 3600000) } },
          ],
        },
      ],
    },
    orderBy: [{ lastCheckedAt: 'asc' }, { createdAt: 'asc' }],
    take: 12,
  });
  const results = await Promise.allSettled(
    rows.map(async (row) => {
      await prisma.shop_checkouts.update({
        where: { reference: row.reference },
        data: { lastCheckedAt: new Date() },
      });
      const checked = await verifyShopCheckout(row.reference);
      if (checked.status === 'PAID') await processShopEffects(row.reference);
    }),
  );
  return NextResponse.json({
    checked: results.length,
    retryRequired: results.filter((result) => result.status === 'rejected')
      .length,
  });
}
