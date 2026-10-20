import 'server-only';
import { createHash, randomUUID } from 'node:crypto';
import { prisma } from '@/lib/prisma';
import {
  createPayPalOrder,
  getSureImportsPayPalEnvironment,
} from '@/lib/paypal';
import {
  getConfiguredIntelligencePlan,
  type IntelligencePlanKey,
} from './plans';
import { getIntelligenceUsdPricing } from './usdPricing';
import { intelligencePayPalRequest } from './paypalApi';
import { checkoutReturnUrl } from './reportCheckoutSecurity';

export type IntelligencePayPalCheckout = {
  id: string;
  pidUser: string;
  pidSubscription: string | null;
  kind: 'SUBSCRIPTION' | 'CREDITS';
  planKey: IntelligencePlanKey;
  providerReference: string | null;
  providerPlanId: string | null;
  environment: string;
  amountMinor: number;
  credits: number;
  status: string;
  approvalUrl: string | null;
  createdAt: Date;
};

async function ensurePayPalPlan(
  planKey: IntelligencePlanKey,
  amountMinor: number,
  credits: number,
  name: string,
) {
  const environment = getSureImportsPayPalEnvironment();
  const cacheKey = createHash('sha256')
    .update(JSON.stringify({ environment, planKey, amountMinor, credits }))
    .digest('hex');
  const rows = await prisma.$queryRaw<
    { providerPlanId: string }[]
  >`SELECT providerPlanId FROM intelligence_paypal_plans WHERE cacheKey=${cacheKey}`;
  if (rows[0]) return rows[0].providerPlanId;
  // Immutable prices: changing admin pricing creates a new plan for new subscriptions.
  const product = await intelligencePayPalRequest(
    '/v1/catalogs/products',
    { name: 'Sure Imports Supplier Intelligence', type: 'SERVICE' },
    `intel-product-${environment}`,
  );
  const plan = await intelligencePayPalRequest(
    '/v1/billing/plans',
    {
      product_id: product.id,
      name,
      status: 'ACTIVE',
      billing_cycles: [
        {
          frequency: { interval_unit: 'MONTH', interval_count: 1 },
          tenure_type: 'REGULAR',
          sequence: 1,
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: {
              value: (amountMinor / 100).toFixed(2),
              currency_code: 'USD',
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: false,
        payment_failure_threshold: 2,
      },
    },
    cacheKey.slice(0, 38),
  );
  if (!plan.id) throw Error('PayPal did not return a billing plan.');
  await prisma.$executeRaw`INSERT IGNORE INTO intelligence_paypal_plans (cacheKey, providerPlanId, environment) VALUES (${cacheKey}, ${String(plan.id)}, ${environment})`;
  const saved = await prisma.$queryRaw<
    { providerPlanId: string }[]
  >`SELECT providerPlanId FROM intelligence_paypal_plans WHERE cacheKey=${cacheKey}`;
  return saved[0].providerPlanId;
}

export async function startIntelligencePayPalCheckout(input: {
  request: Request;
  user: { pidUser: string; userEmail: string };
  planKey: IntelligencePlanKey;
  kind: 'SUBSCRIPTION' | 'CREDITS';
  quantity?: number;
}) {
  const pricing = (await getIntelligenceUsdPricing())[input.planKey];
  const plan = await getConfiguredIntelligencePlan(input.planKey);
  const quantity = input.quantity ?? 1;
  if (!Number.isInteger(quantity) || ![1, 3, 5, 10].includes(quantity))
    throw Error('Choose a valid credit quantity.');
  const amountMinor =
    input.kind === 'SUBSCRIPTION'
      ? pricing.priceUsdCents
      : pricing.extraCreditPriceUsdCents * quantity;
  if (!Number.isSafeInteger(amountMinor) || amountMinor < 100)
    throw Error(
      'USD pricing is not available yet. Please contact Sure Imports.',
    );
  const environment = getSureImportsPayPalEnvironment();
  let id = `INTPP${randomUUID().replaceAll('-', '')}`;
  let pidSubscription =
    input.kind === 'SUBSCRIPTION'
      ? `INTSUB${randomUUID().replaceAll('-', '')}`
      : null;
  const credits =
    input.kind === 'SUBSCRIPTION' ? plan.monthlySearchCredits : quantity;
  const existing = await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT pidUser FROM users WHERE pidUser=${input.user.pidUser} FOR UPDATE`;
    if (input.kind === 'SUBSCRIPTION') {
      const active = await tx.intelligence_subscriptions.findFirst({
        where: {
          pidUser: input.user.pidUser,
          status: { in: ['active', 'non_renewing'] },
          currentPeriodEnd: { gt: new Date() },
        },
      });
      if (active)
        throw Error(
          'You already have a paid plan. Manage its billing before starting another subscription.',
        );
      const pending = await tx.$queryRaw<
        IntelligencePayPalCheckout[]
      >`SELECT * FROM intelligence_paypal_checkouts WHERE pidUser=${input.user.pidUser} AND kind='SUBSCRIPTION' AND environment=${environment} AND status IN ('PENDING','APPROVAL_PENDING','ACTIVE','SUSPENDED') ORDER BY createdAt DESC LIMIT 1`;
      if (pending[0]) return pending[0];
      await tx.intelligence_subscriptions.create({
        data: {
          pidSubscription: pidSubscription!,
          pidUser: input.user.pidUser,
          email: input.user.userEmail,
          plan: input.planKey,
          status: 'pending',
          amountKobo: amountMinor,
          currency: 'USD',
        },
      });
    }
    await tx.$executeRaw`INSERT INTO intelligence_paypal_checkouts (id,pidUser,pidSubscription,kind,planKey,environment,amountMinor,credits) VALUES (${id},${input.user.pidUser},${pidSubscription},${input.kind},${input.planKey},${environment},${amountMinor},${credits})`;
    return null;
  });
  if (existing) {
    if (
      existing.approvalUrl &&
      existing.status === 'APPROVAL_PENDING' &&
      existing.planKey === input.planKey
    )
      return { authorizationUrl: existing.approvalUrl, reference: existing.id };
    if (
      existing.status !== 'PENDING' ||
      existing.planKey !== input.planKey ||
      existing.amountMinor !== amountMinor ||
      existing.credits !== credits ||
      Date.now() - existing.createdAt.getTime() > 48 * 60 * 60 * 1000
    )
      throw Error(
        'A subscription is already being set up or awaiting renewal. Open Manage billing to review it before starting another.',
      );
    id = existing.id;
    pidSubscription = existing.pidSubscription;
  }
  try {
    const returnUrl = checkoutReturnUrl(
      input.request,
      `/intelligence/paypal/verify?checkout=${id}`,
    );
    const cancelUrl = checkoutReturnUrl(
      input.request,
      '/dashboard/intelligence/manage',
    );
    let reference: string, approvalUrl: string;
    let providerPlanId: string | null = null;
    if (input.kind === 'SUBSCRIPTION') {
      providerPlanId = await ensurePayPalPlan(
        input.planKey,
        amountMinor,
        credits,
        plan.name,
      );
      await prisma.$executeRaw`UPDATE intelligence_paypal_checkouts SET providerPlanId=${providerPlanId},updatedAt=NOW(3) WHERE id=${id}`;
      const subscription = await intelligencePayPalRequest(
        '/v1/billing/subscriptions',
        {
          plan_id: providerPlanId,
          custom_id: id,
          application_context: {
            brand_name: 'Sure Imports',
            shipping_preference: 'NO_SHIPPING',
            user_action: 'SUBSCRIBE_NOW',
            return_url: returnUrl,
            cancel_url: cancelUrl,
          },
        },
        id,
      );
      reference = String(subscription.id || '');
      approvalUrl = String(
        subscription.links?.find(
          (link: { rel: string }) => link.rel === 'approve',
        )?.href || '',
      );
      const approval = new URL(approvalUrl);
      if (
        !reference ||
        approval.protocol !== 'https:' ||
        !['www.paypal.com', 'www.sandbox.paypal.com'].includes(
          approval.hostname,
        )
      )
        throw Error('PayPal did not return a valid approval link.');
    } else {
      const order = await createPayPalOrder({
        amount: (amountMinor / 100).toFixed(2),
        currency: 'USD',
        returnUrl,
        cancelUrl,
        customId: id,
        invoiceId: id,
        description: `${quantity} Supplier Intelligence search credits`,
      });
      reference = order.id;
      approvalUrl = order.approvalUrl;
    }
    await prisma.$executeRaw`UPDATE intelligence_paypal_checkouts SET providerReference=${reference},providerPlanId=${providerPlanId},approvalUrl=${approvalUrl},status=IF(status='PENDING','APPROVAL_PENDING',status),updatedAt=NOW(3) WHERE id=${id}`;
    return { authorizationUrl: approvalUrl, reference: id };
  } catch (error) {
    // Keep the intent for reconciliation: a provider timeout can still have created a subscription.
    throw error;
  }
}
