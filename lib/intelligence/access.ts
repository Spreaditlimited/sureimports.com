import { prisma } from '@/lib/prisma';

const activeStatuses = new Set(['active', 'non_renewing']);
const planRank: Record<string, number> = {
  starter: 1,
  pro: 2,
};

export async function getActiveIntelligenceSubscription(pidUser?: string | null) {
  if (!pidUser) return null;

  const now = new Date();

  const subscriptions = await prisma.intelligence_subscriptions.findMany({
    where: {
      pidUser,
      status: { in: Array.from(activeStatuses) },
      OR: [{ currentPeriodEnd: null }, { currentPeriodEnd: { gt: now } }],
    },
    orderBy: [{ currentPeriodEnd: 'desc' }, { createdAt: 'desc' }],
  });

  return (
    subscriptions.sort((first, second) => {
      const rankDifference =
        (planRank[second.plan] || 0) - (planRank[first.plan] || 0);
      if (rankDifference !== 0) return rankDifference;

      const secondPeriodEnd = second.currentPeriodEnd?.getTime() || 0;
      const firstPeriodEnd = first.currentPeriodEnd?.getTime() || 0;
      if (secondPeriodEnd !== firstPeriodEnd) return secondPeriodEnd - firstPeriodEnd;

      return (
        (second.createdAt?.getTime() || 0) - (first.createdAt?.getTime() || 0)
      );
    })[0] || null
  );
}

export async function hasIntelligenceAccess(pidUser?: string | null) {
  const subscription = await getActiveIntelligenceSubscription(pidUser);
  return Boolean(subscription);
}
