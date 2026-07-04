import { prisma } from '@/lib/prisma';
import { fetchPaystackSubscription } from '@/lib/intelligence/paystack';

const activeStatuses = new Set(['active', 'non_renewing']);
const planRank: Record<string, number> = {
  starter: 1,
  pro: 2,
};

async function ensureSearchResultAccessColumns() {
  try {
    await prisma.$executeRawUnsafe(
      'ALTER TABLE intelligence_search_requests ADD COLUMN creditSource VARCHAR(40) NULL',
    );
  } catch {
    // Existing databases may already have this column.
  }
}

export async function getActiveIntelligenceSubscription(
  pidUser?: string | null,
) {
  if (!pidUser) return null;

  const now = new Date();

  const subscriptions = await prisma.intelligence_subscriptions.findMany({
    where: {
      pidUser,
      status: { in: Array.from(activeStatuses) },
      currentPeriodEnd: { gt: now },
    },
    orderBy: [{ currentPeriodEnd: 'desc' }, { createdAt: 'desc' }],
  });

  const subscription =
    subscriptions.sort((first, second) => {
      const rankDifference =
        (planRank[second.plan] || 0) - (planRank[first.plan] || 0);
      if (rankDifference !== 0) return rankDifference;

      const secondPeriodEnd = second.currentPeriodEnd?.getTime() || 0;
      const firstPeriodEnd = first.currentPeriodEnd?.getTime() || 0;
      if (secondPeriodEnd !== firstPeriodEnd)
        return secondPeriodEnd - firstPeriodEnd;

      return (
        (second.createdAt?.getTime() || 0) - (first.createdAt?.getTime() || 0)
      );
    })[0] || null;

  if (!subscription?.paystackSubscriptionCode) return subscription;

  const paystackSubscription = await fetchPaystackSubscription(
    subscription.paystackSubscriptionCode,
  );
  const paystackStatus = String(paystackSubscription?.status || '')
    .trim()
    .toLowerCase();

  if (
    paystackStatus === 'non-renewing' &&
    subscription.status !== 'non_renewing'
  ) {
    const updated = await prisma.intelligence_subscriptions.update({
      where: { pidSubscription: subscription.pidSubscription },
      data: {
        status: 'non_renewing',
        cancelledAt: subscription.cancelledAt || new Date(),
        currentPeriodEnd: paystackSubscription?.next_payment_date
          ? new Date(paystackSubscription.next_payment_date)
          : subscription.currentPeriodEnd,
        updatedAt: new Date(),
      },
    });

    return updated;
  }

  return subscription;
}

export async function hasIntelligenceAccess(pidUser?: string | null) {
  const subscription = await getActiveIntelligenceSubscription(pidUser);
  return Boolean(subscription);
}

export async function hasApprovedSearchResultAccess(
  pidUser?: string | null,
  resultSlug?: string | null,
) {
  const access = await getApprovedSearchResultAccess(pidUser, resultSlug);
  return Boolean(access);
}

export async function getApprovedSearchResultAccess(
  pidUser?: string | null,
  resultSlug?: string | null,
) {
  if (!pidUser || !resultSlug) return false;

  try {
    await ensureSearchResultAccessColumns();
    const rows = await prisma.$queryRaw<
      Array<{ creditSource: string | null }>
    >`
      SELECT creditSource
      FROM intelligence_search_requests
      WHERE pidUser = ${pidUser}
        AND status IN ('approved', 'fulfilled_existing')
        AND resultSlug = ${resultSlug}
      ORDER BY
        CASE
          WHEN creditSource IN ('paid', 'subscription') THEN 1
          WHEN creditSource = 'free' THEN 2
          ELSE 3
        END,
        createdAt DESC
      LIMIT 1
    `;

    const row = rows[0];
    if (!row) return false;

    return {
      creditSource: row.creditSource || 'free',
      unlocksAllSuppliers: ['paid', 'subscription'].includes(
        row.creditSource || '',
      ),
    };
  } catch {
    return false;
  }
}
