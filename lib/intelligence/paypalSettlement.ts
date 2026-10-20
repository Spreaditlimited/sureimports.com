import 'server-only';
import {
  AFFILIATE_SERVICE_KEYS,
  recordAffiliateConversion,
  voidAffiliateConversions,
} from '@/lib/affiliate/commissions';
import { randomUUID } from 'node:crypto';
import { prisma } from '@/lib/prisma';
import {
  capturePayPalOrder,
  getPayPalOrder,
  getSureImportsPayPalEnvironment,
} from '@/lib/paypal';
import { assertPayPalOrderMatches } from '@/lib/paypalValidation';
import { getOrCreateIntelligenceCreditAccount } from './credits';
import { intelligencePayPalRequest } from './paypalApi';
import {
  paidMonthEnd,
  validatePaypalSubscriptionPayment,
} from './paypalPolicy';
import type { IntelligencePayPalCheckout } from './paypalCheckout';

export async function getIntelligencePayPalCheckout(
  id: string,
  pidUser?: string,
) {
  const rows = await prisma.$queryRaw<
    IntelligencePayPalCheckout[]
  >`SELECT * FROM intelligence_paypal_checkouts WHERE id=${id} LIMIT 1`;
  const row = rows[0];
  if (
    !row ||
    (pidUser && row.pidUser !== pidUser) ||
    row.environment !== getSureImportsPayPalEnvironment()
  )
    throw Error('Payment was not found for this account.');
  return row;
}

async function recordPayment(
  checkout: IntelligencePayPalCheckout,
  paymentId: string,
  paidAt: Date,
  revoked = false,
  nextBillingTime?: string,
) {
  if (
    !paymentId ||
    !Number.isFinite(paidAt.getTime()) ||
    paidAt.getTime() > Date.now() + 300000
  )
    throw Error('Invalid PayPal payment.');
  // Sandbox callbacks must never grant production access or credits in the shared database.
  if (checkout.environment !== 'live')
    throw Error(
      'Sandbox payment verified. Live account access has not been changed.',
    );
  await getOrCreateIntelligenceCreditAccount(checkout.pidUser);
  const reference = `paypal:${checkout.environment}:${paymentId}`;
  const nextBilling = nextBillingTime ? new Date(nextBillingTime) : null;
  const periodEnd =
    checkout.kind === 'SUBSCRIPTION'
      ? nextBilling &&
        Number.isFinite(nextBilling.getTime()) &&
        nextBilling > paidAt &&
        nextBilling.getTime() - paidAt.getTime() <= 35 * 86400000
        ? nextBilling
        : paidMonthEnd(paidAt)
      : null;
  await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM intelligence_paypal_checkouts WHERE id=${checkout.id} FOR UPDATE`;
    const payments = await tx.$queryRaw<
      { status: string; checkoutId: string; credits: number }[]
    >`SELECT status,checkoutId,credits FROM intelligence_paypal_payments WHERE paymentReference=${reference} FOR UPDATE`;
    const prior = payments[0];
    if (prior && prior.checkoutId !== checkout.id)
      throw Error('Payment has already been assigned.');
    if (
      prior?.status === 'REVERSED' ||
      (!revoked && prior?.status === 'COMPLETED')
    )
      return;
    await tx.$queryRaw`SELECT pidAccount FROM intelligence_credit_accounts WHERE pidUser=${checkout.pidUser} FOR UPDATE`;
    if (!prior)
      await tx.$executeRaw`INSERT INTO intelligence_paypal_payments (paymentReference,checkoutId,amountMinor,credits,status,paidAt,periodEnd) VALUES (${reference},${checkout.id},${checkout.amountMinor},${checkout.credits},${revoked ? 'REVERSED' : 'COMPLETED'},${paidAt},${periodEnd})`;
    else
      await tx.$executeRaw`UPDATE intelligence_paypal_payments SET status='REVERSED' WHERE paymentReference=${reference}`;
    const creditDelta = revoked
      ? prior
        ? -prior.credits
        : 0
      : checkout.credits;
    if (creditDelta) {
      await tx.$executeRaw`UPDATE intelligence_credit_accounts SET balance=balance+${creditDelta},lifetimeGranted=lifetimeGranted+${creditDelta},updatedAt=NOW(3) WHERE pidUser=${checkout.pidUser}`;
      await tx.$executeRaw`INSERT INTO intelligence_credit_transactions (pidTransaction,pidUser,amount,reason,reference,createdAt) VALUES (${`INTCTX${randomUUID().replaceAll('-', '')}`},${checkout.pidUser},${creditDelta},${revoked ? 'paypal_payment_reversed' : checkout.kind === 'SUBSCRIPTION' ? 'paypal_monthly_search_credits' : 'paypal_purchased_search_credits'},${reference},NOW(3))`;
    }
    if (checkout.pidSubscription) {
      // Recompute from paid cycles so an old refund cannot revoke a later paid renewal.
      const latest = await tx.$queryRaw<
        { paidAt: Date; periodEnd: Date }[]
      >`SELECT paidAt,periodEnd FROM intelligence_paypal_payments WHERE checkoutId=${checkout.id} AND status='COMPLETED' ORDER BY periodEnd DESC LIMIT 1`;
      await tx.intelligence_subscriptions.update({
        where: { pidSubscription: checkout.pidSubscription },
        data: {
          status: latest[0] ? 'active' : revoked ? 'revoked' : 'pending',
          currentPeriodStart: latest[0]?.paidAt ?? null,
          currentPeriodEnd: latest[0]?.periodEnd ?? null,
          updatedAt: new Date(),
        },
      });
    } else
      await tx.$executeRaw`UPDATE intelligence_paypal_checkouts SET status=${revoked ? 'REVERSED' : 'COMPLETED'},updatedAt=NOW(3) WHERE id=${checkout.id}`;
  });
  if (checkout.kind === 'SUBSCRIPTION') {
    if (revoked)
      await voidAffiliateConversions({
        externalPaymentReferences: [`paypal:${paymentId}`],
        reason: 'PayPal subscription payment reversed.',
        reversalReference: `paypal-reversal:${paymentId}`,
      });
    else {
      const paid = await prisma.$queryRaw<
        { status: string }[]
      >`SELECT status FROM intelligence_paypal_payments WHERE paymentReference=${reference}`;
      if (paid[0]?.status === 'COMPLETED')
        await recordAffiliateConversion({
          customerReference: checkout.pidUser,
          serviceKey: AFFILIATE_SERVICE_KEYS.SUPPLIER_INTELLIGENCE,
          externalOrderReference: `supplier-intelligence:${checkout.pidSubscription}:${paymentId}`,
          externalPaymentReference: `paypal:${paymentId}`,
          paymentCurrency: 'USD',
          grossAmount: checkout.amountMinor / 100,
          eligibleAmount: checkout.amountMinor / 100,
        });
    }
  }
}

export async function syncIntelligencePayPalSubscription(
  checkout: IntelligencePayPalCheckout,
  paymentDate?: Date,
) {
  if (!checkout.providerReference || checkout.kind !== 'SUBSCRIPTION')
    throw Error('Subscription is not ready yet.');
  const path = `/v1/billing/subscriptions/${encodeURIComponent(checkout.providerReference)}`;
  const subscription = await intelligencePayPalRequest(path);
  if (
    subscription.custom_id !== checkout.id ||
    subscription.plan_id !== checkout.providerPlanId
  )
    throw Error('PayPal subscription does not match this account.');
  const end = paymentDate
    ? new Date(Math.min(Date.now(), paymentDate.getTime() + 86400000))
    : new Date();
  const start = new Date(end.getTime() - 35 * 86400000);
  const transactions = await intelligencePayPalRequest(
    `${path}/transactions?start_time=${encodeURIComponent(start.toISOString())}&end_time=${encodeURIComponent(end.toISOString())}`,
  );
  let paid = false;
  for (const payment of transactions.transactions || []) {
    const money = payment.amount_with_breakdown?.gross_amount;
    if (
      !['COMPLETED', 'REFUNDED', 'PARTIALLY_REFUNDED'].includes(payment.status)
    )
      continue;
    validatePaypalSubscriptionPayment({
      actualAmount: money?.value,
      currency: money?.currency_code,
      expectedMinor: checkout.amountMinor,
      status: 'COMPLETED',
    });
    await recordPayment(
      checkout,
      String(payment.id || ''),
      new Date(payment.time),
      payment.status !== 'COMPLETED',
      subscription.billing_info?.last_payment?.time === payment.time
        ? subscription.billing_info?.next_billing_time
        : undefined,
    );
    const recorded = await prisma.$queryRaw<
      { status: string }[]
    >`SELECT status FROM intelligence_paypal_payments WHERE paymentReference=${`paypal:${checkout.environment}:${payment.id}`}`;
    paid ||= recorded[0]?.status === 'COMPLETED';
  }
  if (checkout.environment === 'live') {
    const status = String(subscription.status);
    await prisma.$executeRaw`UPDATE intelligence_paypal_checkouts SET status=${status},updatedAt=NOW(3) WHERE id=${checkout.id}`;
    if (['CANCELLED', 'EXPIRED', 'SUSPENDED'].includes(status))
      await prisma.intelligence_subscriptions.updateMany({
        where: { pidSubscription: checkout.pidSubscription!, status: 'active' },
        data: {
          status: 'non_renewing',
          cancelledAt: new Date(),
          updatedAt: new Date(),
        },
      });
  }
  return { paid, status: String(subscription.status) };
}

export async function confirmIntelligencePayPalCredits(
  checkout: IntelligencePayPalCheckout,
  capture: boolean,
) {
  if (!checkout.providerReference || checkout.kind !== 'CREDITS')
    throw Error('Credit payment is not ready yet.');
  let order = await getPayPalOrder(checkout.providerReference);
  if (order.sureImportsEnvironment !== checkout.environment)
    throw Error('PayPal environment mismatch.');
  assertPayPalOrderMatches(order, {
    customId: checkout.id,
    amountMinor: checkout.amountMinor,
    currency: 'USD',
  });
  if (order.status === 'APPROVED' && capture)
    order = await capturePayPalOrder(checkout.providerReference);
  const payment = order.purchase_units?.[0]?.payments?.captures?.[0];
  if (order.status !== 'COMPLETED' || payment?.status !== 'COMPLETED')
    return { paid: false };
  validatePaypalSubscriptionPayment({
    actualAmount: payment.amount?.value,
    currency: payment.amount?.currency_code,
    expectedMinor: checkout.amountMinor,
    status: payment.status,
  });
  await recordPayment(
    checkout,
    String(payment.id || ''),
    new Date(payment.create_time),
  );
  const recorded = await prisma.$queryRaw<
    { status: string }[]
  >`SELECT status FROM intelligence_paypal_payments WHERE paymentReference=${`paypal:${checkout.environment}:${payment.id}`}`;
  return { paid: recorded[0]?.status === 'COMPLETED' };
}

export async function handleIntelligencePayPalEvent(body: any) {
  const event = String(body.event_type || '');
  if (
    !event.startsWith('BILLING.SUBSCRIPTION.') &&
    !event.startsWith('PAYMENT.SALE.')
  )
    return false;
  let resource = body.resource || {};
  if (
    event.startsWith('PAYMENT.SALE.') &&
    resource.sale_id &&
    !resource.billing_agreement_id
  )
    resource = await intelligencePayPalRequest(
      `/v1/payments/sale/${encodeURIComponent(resource.sale_id)}`,
    );
  const reference = event.startsWith('BILLING.')
    ? resource.id
    : resource.billing_agreement_id;
  if (!reference) return false;
  const rows = await prisma.$queryRaw<
    IntelligencePayPalCheckout[]
  >`SELECT * FROM intelligence_paypal_checkouts WHERE providerReference=${String(reference)} AND environment=${getSureImportsPayPalEnvironment()} LIMIT 1`;
  if (
    !rows[0] &&
    resource.custom_id &&
    event.startsWith('BILLING.SUBSCRIPTION.')
  ) {
    const intent = await getIntelligencePayPalCheckout(
      String(resource.custom_id),
    ).catch(() => null);
    if (
      intent &&
      intent.kind === 'SUBSCRIPTION' &&
      intent.providerPlanId === resource.plan_id &&
      !intent.providerReference
    ) {
      await prisma.$executeRaw`UPDATE intelligence_paypal_checkouts SET providerReference=${String(reference)},updatedAt=NOW(3) WHERE id=${intent.id} AND providerReference IS NULL`;
      rows.push({ ...intent, providerReference: String(reference) });
    }
  }
  if (!rows[0]) return false;
  if (rows[0].environment !== 'live') return true;
  if (['PAYMENT.SALE.REFUNDED', 'PAYMENT.SALE.REVERSED'].includes(event)) {
    const saleId = String(body.resource?.sale_id || resource.id || '');
    const original = await intelligencePayPalRequest(
      `/v1/payments/sale/${encodeURIComponent(saleId)}`,
    );
    if (original.billing_agreement_id !== reference)
      throw Error('Subscription reversal does not match.');
    validatePaypalSubscriptionPayment({
      actualAmount: original.amount?.total,
      currency: original.amount?.currency,
      expectedMinor: rows[0].amountMinor,
      status: 'COMPLETED',
    });
    await recordPayment(rows[0], saleId, new Date(original.create_time), true);
  }
  await syncIntelligencePayPalSubscription(
    rows[0],
    resource.create_time ? new Date(resource.create_time) : undefined,
  );
  return true;
}

export async function handleIntelligencePayPalCreditEvent(
  body: any,
  captureReference: string,
) {
  const event = String(body.event_type || '');
  const orderId = String(
    body.resource?.supplementary_data?.related_ids?.order_id ||
      (event === 'CHECKOUT.ORDER.APPROVED' ? body.resource?.id : '') ||
      '',
  );
  const environment = getSureImportsPayPalEnvironment();
  const rows = await prisma.$queryRaw<
    IntelligencePayPalCheckout[]
  >`SELECT c.* FROM intelligence_paypal_checkouts c WHERE c.kind='CREDITS' AND c.environment=${environment} AND (c.providerReference=${orderId || '__none__'} OR c.id IN (SELECT checkoutId FROM intelligence_paypal_payments WHERE paymentReference=${`paypal:${environment}:${captureReference}`})) LIMIT 1`;
  const checkout = rows[0];
  if (!checkout) return false;
  if (environment !== 'live') return true;
  if (
    [
      'PAYMENT.CAPTURE.REFUNDED',
      'PAYMENT.CAPTURE.REVERSED',
      'CUSTOMER.DISPUTE.CREATED',
      'CUSTOMER.DISPUTE.UPDATED',
    ].includes(event)
  ) {
    const order = await getPayPalOrder(checkout.providerReference!);
    assertPayPalOrderMatches(order, {
      customId: checkout.id,
      amountMinor: checkout.amountMinor,
      currency: 'USD',
    });
    const payment = order.purchase_units?.[0]?.payments?.captures?.[0];
    if (!payment?.id) throw Error('Original credit payment was not found.');
    await recordPayment(
      checkout,
      String(payment.id),
      new Date(payment.create_time),
      true,
    );
  } else if (
    ['CHECKOUT.ORDER.APPROVED', 'PAYMENT.CAPTURE.COMPLETED'].includes(event)
  )
    await confirmIntelligencePayPalCredits(
      checkout,
      event === 'CHECKOUT.ORDER.APPROVED',
    );
  return true;
}
