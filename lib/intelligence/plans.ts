export type IntelligencePlanKey = 'starter' | 'pro';

export type IntelligencePlan = {
  key: IntelligencePlanKey;
  name: string;
  priceNaira: number;
  interval: 'monthly';
  envPlanCode: string;
  envPriceNaira: string;
  paystackPlanCode?: string;
  monthlySearchCredits: number;
  extraCreditPriceNaira: number;
  features: string[];
};

export const intelligencePlans: Record<IntelligencePlanKey, IntelligencePlan> =
  {
    starter: {
      key: 'starter',
      name: 'Starter Database',
      priceNaira: 10000,
      interval: 'monthly',
      envPlanCode: 'PAYSTACK_INTELLIGENCE_STARTER_PLAN_CODE',
      envPriceNaira: 'PAYSTACK_INTELLIGENCE_STARTER_PRICE_NAIRA',
      monthlySearchCredits: 1,
      extraCreditPriceNaira: 5000,
      features: [
        'Access the supplier intelligence database',
        'Monthly supplier search credits',
        'Browse all approved supplier categories and supplier leads',
        'Supplier leads checked across 10 data points',
        'Company profiles, contact details and Sure Imports notes',
        'Buyer risks and Nigeria-specific notes for each category',
      ],
    },
    pro: {
      key: 'pro',
      name: 'Pro Review Support',
      priceNaira: 25000,
      interval: 'monthly',
      envPlanCode: 'PAYSTACK_INTELLIGENCE_PRO_PLAN_CODE',
      envPriceNaira: 'PAYSTACK_INTELLIGENCE_PRO_PRICE_NAIRA',
      monthlySearchCredits: 3,
      extraCreditPriceNaira: 5000,
      features: [
        'Everything in Starter Database',
        'Monthly supplier search credits',
        'Submit supplier details for review before paying',
        'Submit quotes for price, MOQ, lead time and hidden cost review',
        'Submit invoice and payment details for pre-payment checks',
        'Priority product category requests',
      ],
    },
  };

type PlanSettingsRow = {
  planKey: IntelligencePlanKey;
  name: string;
  priceNaira: number;
  paystackPlanCode: string | null;
  monthlySearchCredits: number;
  extraCreditPriceNaira: number;
};

function isLocalPlanConfigMode() {
  const siteUrl = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_BASE_URL,
    process.env.VERCEL_URL,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return (
    process.env.NODE_ENV !== 'production' ||
    siteUrl.includes('localhost') ||
    siteUrl.includes('127.0.0.1')
  );
}

function envPrice(value: string | undefined, fallback: number) {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 ? Math.round(amount) : fallback;
}

function applyEnvOverrides(
  plans: Record<IntelligencePlanKey, IntelligencePlan>,
) {
  for (const key of Object.keys(plans) as IntelligencePlanKey[]) {
    const plan = plans[key];
    plans[key] = {
      ...plan,
      priceNaira: envPrice(process.env[plan.envPriceNaira], plan.priceNaira),
      paystackPlanCode: process.env[plan.envPlanCode] || plan.paystackPlanCode,
      monthlySearchCredits: envPrice(
        process.env[`INTELLIGENCE_${key.toUpperCase()}_MONTHLY_SEARCH_CREDITS`],
        plan.monthlySearchCredits,
      ),
      extraCreditPriceNaira: envPrice(
        process.env[
          `INTELLIGENCE_${key.toUpperCase()}_EXTRA_CREDIT_PRICE_NAIRA`
        ],
        plan.extraCreditPriceNaira,
      ),
    };
  }

  return plans;
}

function applyCreditFeatureText(
  plans: Record<IntelligencePlanKey, IntelligencePlan>,
) {
  for (const key of Object.keys(plans) as IntelligencePlanKey[]) {
    plans[key] = {
      ...plans[key],
      features: plans[key].features.map((feature) =>
        feature === 'Monthly supplier search credits'
          ? `${plans[key].monthlySearchCredits} monthly supplier search ${
              plans[key].monthlySearchCredits === 1 ? 'credit' : 'credits'
            }`
          : feature,
      ),
    };
  }

  return plans;
}

async function getPlanSettingsRows(): Promise<PlanSettingsRow[]> {
  try {
    const { prisma } = await import('@/lib/prisma');

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS intelligence_plan_settings (
        id INT NOT NULL AUTO_INCREMENT,
        pidSetting VARCHAR(80) NOT NULL,
        planKey VARCHAR(40) NOT NULL,
        name VARCHAR(120) NOT NULL,
        priceNaira INT NOT NULL,
        paystackPlanCode VARCHAR(160) NULL,
        monthlySearchCredits INT NOT NULL DEFAULT 0,
        extraCreditPriceNaira INT NOT NULL DEFAULT 5000,
        status VARCHAR(40) NOT NULL DEFAULT 'ACTIVE',
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        UNIQUE KEY intelligence_plan_settings_pid_key (pidSetting),
        UNIQUE KEY intelligence_plan_settings_plan_key (planKey),
        KEY intelligence_plan_settings_status_idx (status),
        PRIMARY KEY (id)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);

    for (const statement of [
      'ALTER TABLE intelligence_plan_settings ADD COLUMN monthlySearchCredits INT NOT NULL DEFAULT 0',
      'ALTER TABLE intelligence_plan_settings ADD COLUMN extraCreditPriceNaira INT NOT NULL DEFAULT 5000',
    ]) {
      try {
        await prisma.$executeRawUnsafe(statement);
      } catch {
        // Existing databases may already have these columns.
      }
    }

    return prisma.$queryRaw<PlanSettingsRow[]>`
      SELECT
        planKey,
        name,
        priceNaira,
        paystackPlanCode,
        monthlySearchCredits,
        extraCreditPriceNaira
      FROM intelligence_plan_settings
      WHERE status = 'ACTIVE'
        AND planKey IN ('starter', 'pro')
    `;
  } catch {
    return [];
  }
}

export async function getIntelligencePlans() {
  const plans = structuredClone(intelligencePlans);

  if (isLocalPlanConfigMode()) {
    return applyCreditFeatureText(applyEnvOverrides(plans));
  }

  const rows = await getPlanSettingsRows();

  for (const row of rows) {
    if (row.planKey !== 'starter' && row.planKey !== 'pro') continue;

    plans[row.planKey] = {
      ...plans[row.planKey],
      name: row.name || plans[row.planKey].name,
      priceNaira: Number(row.priceNaira || plans[row.planKey].priceNaira),
      paystackPlanCode: row.paystackPlanCode || undefined,
      monthlySearchCredits: Number(
        row.monthlySearchCredits || plans[row.planKey].monthlySearchCredits,
      ),
      extraCreditPriceNaira: Number(
        row.extraCreditPriceNaira || plans[row.planKey].extraCreditPriceNaira,
      ),
    };
  }

  return applyCreditFeatureText(applyEnvOverrides(plans));
}

export function getIntelligencePlan(planKey: string | null | undefined) {
  if (planKey === 'pro') return intelligencePlans.pro;
  return intelligencePlans.starter;
}

export async function getConfiguredIntelligencePlan(
  planKey: string | null | undefined,
) {
  const plans = await getIntelligencePlans();
  if (planKey === 'pro') return plans.pro;
  return plans.starter;
}

export async function getPaystackPlanCode(planKey: IntelligencePlanKey) {
  const plans = await getIntelligencePlans();
  const plan = plans[planKey];
  return plan.paystackPlanCode || process.env[plan.envPlanCode] || '';
}
