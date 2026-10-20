import { prisma } from '@/lib/prisma';
import type { IntelligencePlanKey } from './plans';
export type IntelligenceUsdPrice = {
  planKey: IntelligencePlanKey;
  priceUsdCents: number;
  extraCreditPriceUsdCents: number;
  revision: number;
};
export async function getIntelligenceUsdPricing() {
  const empty: Record<IntelligencePlanKey, IntelligenceUsdPrice> = {
    starter: {
      planKey: 'starter',
      priceUsdCents: 0,
      extraCreditPriceUsdCents: 0,
      revision: 0,
    },
    pro: {
      planKey: 'pro',
      priceUsdCents: 0,
      extraCreditPriceUsdCents: 0,
      revision: 0,
    },
  };
  try {
    const rows = await prisma.$queryRaw<
      IntelligenceUsdPrice[]
    >`SELECT planKey, priceUsdCents, extraCreditPriceUsdCents, revision FROM intelligence_usd_pricing`;
    for (const row of rows)
      if (row.planKey === 'starter' || row.planKey === 'pro')
        empty[row.planKey] = row;
    return empty;
  } catch (error) {
    if ((error as { meta?: { code?: string } }).meta?.code === '1146')
      return empty;
    throw error;
  }
}
