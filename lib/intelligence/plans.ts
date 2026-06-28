export type IntelligencePlanKey = 'starter' | 'pro';

export type IntelligencePlan = {
  key: IntelligencePlanKey;
  name: string;
  priceNaira: number;
  interval: 'monthly';
  envPlanCode: string;
  features: string[];
};

export const intelligencePlans: Record<IntelligencePlanKey, IntelligencePlan> = {
  starter: {
    key: 'starter',
    name: 'Starter',
    priceNaira: 10000,
    interval: 'monthly',
    envPlanCode: 'PAYSTACK_INTELLIGENCE_STARTER_PLAN_CODE',
    features: [
      'Supplier leads checked across 10 data points',
      'Company profiles, contact details and Sure Imports notes',
      'Buyer risks and Nigeria-specific notes',
      'Monthly supplier updates',
    ],
  },
  pro: {
    key: 'pro',
    name: 'Pro Importer',
    priceNaira: 25000,
    interval: 'monthly',
    envPlanCode: 'PAYSTACK_INTELLIGENCE_PRO_PLAN_CODE',
    features: [
      'Everything in Starter',
      'Priority product category requests',
      'Saved supplier watchlist',
      'Quote comparison and enquiry templates',
      'Monthly new supplier research from Sure Imports',
    ],
  },
};

export function getIntelligencePlan(planKey: string | null | undefined) {
  if (planKey === 'pro') return intelligencePlans.pro;
  return intelligencePlans.starter;
}

export function getPaystackPlanCode(planKey: IntelligencePlanKey) {
  const plan = intelligencePlans[planKey];
  return process.env[plan.envPlanCode] || '';
}
