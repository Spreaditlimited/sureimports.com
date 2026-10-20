import { getAccountCountry } from '@/lib/features/server';
import { getIntelligenceUsdPricing } from './usdPricing';
import type { IntelligencePlanKey } from './plans';
export async function getIntelligenceBilling(pidUser?: string) {
  const country = pidUser ? await getAccountCountry(pidUser) : null;
  const currency = country === 'Nigeria' ? ('NGN' as const) : ('USD' as const);
  const prices = await getIntelligenceUsdPricing();
  return {
    currency,
    country,
    planPrice: (key: IntelligencePlanKey, naira: number) =>
      currency === 'NGN' ? naira : prices[key].priceUsdCents / 100,
    creditPrice: (key: IntelligencePlanKey, naira: number) =>
      currency === 'NGN' ? naira : prices[key].extraCreditPriceUsdCents / 100,
  };
}
