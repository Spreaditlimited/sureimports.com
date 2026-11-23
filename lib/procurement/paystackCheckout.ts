import { createHash, randomUUID } from 'node:crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import {
  recordAffiliateConversion,
  AFFILIATE_SERVICE_KEYS,
} from '@/lib/affiliate/commissions';
import xMail from '@/lib/email/xMail';
import { getProcurementOrderLifecycle } from '@/lib/procurement/orderLifecycle';

type Checkout = {
  reference: string;
  pidOrder: string;
  pidUser: string;
  amountMinor: bigint;
  currency: string;
  snapshotJson: string;
  status: string;
};
type Lifecycle = Awaited<ReturnType<typeof getProcurementOrderLifecycle>>;
type Snapshot = {
  order: Lifecycle['order'];
  products: Lifecycle['products'];
  pricing: Lifecycle['snapshot'];
  originalStatus: string;
  nextStatus: string;
  productsTotalUsd: number;
  ngnPerUsd: number;
};
const digest = (value: unknown) =>
  createHash('sha256').update(JSON.stringify(value)).digest('hex');
const checkoutId = (reference: string) =>
  `PAYPS${createHash('sha256').update(reference).digest('hex').slice(0, 40)}`;

export async function findProcurementCheckout(reference: string) {
  const rows = await prisma.$queryRaw<
    Checkout[]
  >`SELECT * FROM procurement_paystack_checkouts WHERE reference=${reference}`;
  return rows[0] || null;
}

export async function createProcurementCheckout(
  pidOrder: string,
  pidUser: string,
) {
  const lifecycle = await getProcurementOrderLifecycle(pidOrder, pidUser);
  const { order, payment } = lifecycle;
  if (!payment.isPayable || payment.currency !== 'NGN')
    throw new Error('This order is not available for Paystack payment.');
  if (order.status === 'saved' && payment.due < payment.minimumOrderNgn)
    throw new Error(
      `The minimum order amount is NGN ${payment.minimumOrderNgn.toLocaleString()}.`,
    );
  const reference = `PROCPAY_${randomUUID()}`;
  const amountMinor = Math.round(payment.due * 100);
  const snapshot: Snapshot = {
    order,
    products: lifecycle.products,
    pricing: lifecycle.snapshot,
    originalStatus: String(order.status),
    nextStatus: payment.nextStatus,
    productsTotalUsd: lifecycle.productsTotalUsd,
    ngnPerUsd: lifecycle.rates.ngnPerUsd,
  };
  await prisma.$transaction(
    async (tx) => {
      await tx.$queryRaw`SELECT pidOrder FROM orders WHERE pidOrder=${pidOrder} FOR UPDATE`;
      const current = await tx.orders.findUnique({ where: { pidOrder } });
      const products = await tx.products.findMany({
        where: { pidOrder },
        orderBy: { id: 'asc' },
      });
      if (
        digest(current) !== digest(order) ||
        digest(products) !== digest(snapshot.products)
      )
        throw new Error('Your order changed. Refresh it before paying.');
      const pending = await tx.$queryRaw<
        Checkout[]
      >`SELECT * FROM procurement_paystack_checkouts WHERE pidOrder=${pidOrder} AND status IN ('PENDING','REVIEW') ORDER BY createdAt DESC LIMIT 1`;
      if (pending.length)
        throw new Error(
          'A payment is already awaiting confirmation for this order. Please check its payment status before trying again.',
        );
      await tx.$executeRaw`INSERT INTO procurement_paystack_checkouts (reference,pidOrder,pidUser,amountMinor,currency,snapshotJson) VALUES (${reference},${pidOrder},${pidUser},${amountMinor},${payment.currency},${JSON.stringify(snapshot)})`;
    },
    { timeout: 15000 },
  );
  return { reference, amount: payment.due, currency: payment.currency };
}

/** Validates provider evidence before entering the transaction. No browser totals are trusted. */
export function validateProcurementPayment(checkout: Checkout, payment: any) {
  if (
    payment?.status !== 'success' ||
    payment.reference !== checkout.reference ||
    String(payment.currency).toUpperCase() !== checkout.currency ||
    Number(payment.amount) !== Number(checkout.amountMinor) ||
    payment.metadata?.service_id !== checkout.pidOrder ||
    payment.metadata?.consumer_id !== checkout.pidUser ||
    payment.metadata?.service_name !== 'PROCUREMENT'
  )
    throw new Error('Paystack payment does not match the saved checkout.');
}

export async function settleProcurementCheckout(
  reference: string,
  payment: any,
) {
  const initial = await findProcurementCheckout(reference);
  if (!initial) throw new Error('Procurement checkout not found.');
  validateProcurementPayment(initial, payment);
  const snapshot: Snapshot = JSON.parse(initial.snapshotJson);
  const result = await prisma.$transaction(
    async (tx) => {
      await tx.$queryRaw`SELECT pidOrder FROM orders WHERE pidOrder=${initial.pidOrder} FOR UPDATE`;
      const rows = await tx.$queryRaw<
        Checkout[]
      >`SELECT * FROM procurement_paystack_checkouts WHERE reference=${reference} FOR UPDATE`;
      const checkout = rows[0];
      if (checkout.status === 'PAID' || checkout.status === 'REVIEW')
        return {
          status: checkout.status,
          nextStatus:
            checkout.status === 'REVIEW' ? 'pending' : snapshot.nextStatus,
          duplicate: true,
        };
      const existing = await tx.payments.findUnique({
        where: { pidPayment: checkoutId(reference) },
      });
      if (existing)
        throw new Error('Checkout payment requires reconciliation.');
      const order = await tx.orders.findUnique({
        where: { pidOrder: checkout.pidOrder },
      });
      const products = await tx.products.findMany({
        where: { pidOrder: checkout.pidOrder },
        orderBy: { id: 'asc' },
      });
      // Keep the immutable snapshot and paid record even if an older deletion path removed the order.
      const review =
        !order ||
        order.pidUser !== checkout.pidUser ||
        ![snapshot.originalStatus, 'expired-saved'].includes(
          String(order.status),
        ) ||
        digest(products) !== digest(snapshot.products) ||
        (order &&
          digest({
            ...order,
            status: snapshot.order.status,
            updatedAt: snapshot.order.updatedAt,
          }) !== digest(snapshot.order));
      const user = await tx.users.findUnique({
        where: { pidUser: checkout.pidUser },
      });
      await tx.payments.create({
        data: {
          pidPayment: checkoutId(reference),
          pidUser: checkout.pidUser,
          payerName:
            `${user?.userFirstname || ''} ${user?.userLastname || ''}`.trim() ||
            'Customer',
          payerEmail: user?.userEmail,
          txID: String(payment.id),
          txRef: reference,
          paymentStatus: 'PAID',
          paymentType: payment.channel || 'PAYSTACK',
          currency: checkout.currency,
          amount: Number(checkout.amountMinor) / 100,
          serviceID: checkout.pidOrder,
          serviceName: 'PROCUREMENT',
          serviceDescription: review
            ? 'Paid; order changed during checkout, manual review required'
            : 'General procurement payment',
          txDateProcesser: payment.paid_at,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      if (order && order.pidUser === checkout.pidUser) {
        const pricing =
          snapshot.originalStatus === 'pay-for-shipping'
            ? {}
            : snapshot.pricing;
        // Modified orders remain visible but cannot be charged again: pending has no payment due.
        await tx.orders.update({
          where: { pidOrder: checkout.pidOrder },
          data: {
            ...(review ? {} : pricing),
            ...(snapshot.originalStatus === 'on-hold' && !review
              ? {
                  orderTotalCostOld: order.orderTotalCost,
                  orderWeightOld: order.orderWeight,
                  orderShippingCostOld: order.orderShippingCost,
                }
              : {}),
            status: review ? 'pending' : snapshot.nextStatus,
            ...(review
              ? {
                  orderNote: `${order.orderNote || ''}\nPAYMENT REVIEW REQUIRED: ${reference} paid. Original checkout details retained; compare before procurement. Do not collect this payment again.`,
                }
              : {}),
            updatedAt: new Date(),
          },
        });
      }
      if (!order) {
        const { id: _id, ...originalOrder } = snapshot.order;
        await tx.orders.create({
          data: {
            ...originalOrder,
            ...snapshot.pricing,
            status: 'pending',
            orderNote: `${snapshot.order.orderNote || ''}\nPAYMENT REVIEW REQUIRED: order recovered from checkout ${reference}. Confirm before procurement.`,
            updatedAt: new Date(),
          },
        });
        const existingProductIds = new Set(products.map((p) => p.pidProduct));
        const missingProducts = snapshot.products
          .filter((p) => !existingProductIds.has(p.pidProduct))
          .map(({ id: _id, ...product }) => product);
        if (missingProducts.length)
          await tx.products.createMany({ data: missingProducts });
      }
      const status = review ? 'REVIEW' : 'PAID';
      await tx.$executeRaw`UPDATE procurement_paystack_checkouts SET status=${status},lastError=${review ? 'Paid; original order changed or missing. Manual review required.' : null},updatedAt=NOW(3) WHERE reference=${reference}`;
      return {
        status,
        nextStatus: review ? 'pending' : snapshot.nextStatus,
        duplicate: false,
      };
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      timeout: 15000,
    },
  );
  await completeProcurementPaymentEffects(reference);
  return result;
}

export async function verifyProcurementCheckout(reference: string) {
  const secret = process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY;
  if (!secret) throw new Error('Paystack is not configured.');
  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: { Authorization: `Bearer ${secret}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(15000),
    },
  );
  const result = await response.json();
  if (!response.ok || !result.status) {
    // An iframe which was never opened has no provider transaction. Release it only
    // after a grace period; all evidence remains and late success still settles.
    if (
      response.status === 404 ||
      result.message === 'Transaction reference not found'
    )
      await prisma.$executeRaw`UPDATE procurement_paystack_checkouts SET status='FAILED',updatedAt=NOW(3) WHERE reference=${reference} AND status='PENDING' AND createdAt < DATE_SUB(NOW(), INTERVAL 30 MINUTE)`;
    throw new Error('Paystack verification is currently unavailable.');
  }
  if (['failed', 'abandoned', 'reversed'].includes(result.data.status)) {
    await prisma.$executeRaw`UPDATE procurement_paystack_checkouts SET status='FAILED',updatedAt=NOW(3) WHERE reference=${reference} AND status='PENDING'`;
    return { status: 'FAILED', nextStatus: '' };
  }
  if (result.data.status !== 'success')
    return { status: 'PENDING', nextStatus: '' };
  return settleProcurementCheckout(reference, result.data);
}

export async function completeProcurementPaymentEffects(reference: string) {
  const claimed =
    await prisma.$executeRaw`UPDATE procurement_paystack_checkouts SET effectsStatus='PROCESSING',updatedAt=NOW(3) WHERE reference=${reference} AND status='PAID' AND (effectsStatus='PENDING' OR (effectsStatus='PROCESSING' AND updatedAt < DATE_SUB(NOW(), INTERVAL 30 MINUTE)))`;
  if (!claimed) return;
  const checkout = await findProcurementCheckout(reference);
  if (!checkout) return;
  const snapshot: Snapshot = JSON.parse(checkout.snapshotJson);
  try {
    if (snapshot.originalStatus !== 'pay-for-shipping')
      await recordAffiliateConversion({
        customerReference: checkout.pidUser,
        serviceKey: AFFILIATE_SERVICE_KEYS.BUY_FROM_CHINESE_WEBSITES,
        externalOrderReference: `procurement:${checkout.pidOrder}`,
        externalPaymentReference: `paystack:${reference}`,
        paymentCurrency: checkout.currency,
        grossAmount: Number(checkout.amountMinor) / 100,
        eligibleAmount: snapshot.productsTotalUsd * snapshot.ngnPerUsd,
      });
    const user = await prisma.users.findUnique({
      where: { pidUser: checkout.pidUser },
    });
    for (const email of [user?.userEmail, 'hello@sureimports.com'].filter(
      Boolean,
    ))
      await xMail({
        xEmail: email!,
        xTitle: 'Procurement payment received',
        xBodyTitle: 'Payment received',
        xBody1: `Order ${checkout.pidOrder}: ${checkout.currency} ${(Number(checkout.amountMinor) / 100).toLocaleString('en-NG', { minimumFractionDigits: 2 })} has been received. Your order is being processed.`,
        xButtonTitle: 'View orders',
        xButtonLink:
          'https://www.sureimports.com/dashboard/procurement/view-orders/pending',
      });
    await prisma.$executeRaw`UPDATE procurement_paystack_checkouts SET effectsStatus='DONE',updatedAt=NOW(3) WHERE reference=${reference}`;
  } catch (error) {
    await prisma.$executeRaw`UPDATE procurement_paystack_checkouts SET effectsStatus='PENDING',updatedAt=NOW(3) WHERE reference=${reference}`;
    console.error(
      'Procurement payment effects require retry',
      reference,
      error,
    );
  }
}
