import { createHash, randomUUID } from 'node:crypto';
import { prisma } from '@/lib/prisma';
import { getProcurementOrderLifecycle } from './orderLifecycle';
import {
  createPayPalOrder,
  getPayPalOrder,
  capturePayPalOrder,
  getSureImportsPayPalEnvironment,
} from '@/lib/paypal';
import {
  assertPayPalOrderMatches,
  assertPayPalLiveFulfillment,
} from '@/lib/paypalValidation';
import { signPayPalCheckoutSession } from '@/lib/paypalCheckoutSession';
import { notifyProcurementPayPalPayment } from './paypalNotifications';
import {
  recordAffiliateConversion,
  AFFILIATE_SERVICE_KEYS,
} from '@/lib/affiliate/commissions';

type Context = {
  environment?: 'live' | 'sandbox';
  status: string;
  nextStatus: string;
  productsTotalUsd: number;
  orderUpdatedAt: string | null;
  snapshot: Awaited<
    ReturnType<typeof getProcurementOrderLifecycle>
  >['snapshot'];
  oldTotal: string | null;
  oldWeight: string | null;
  oldShipping: string | null;
};
type Checkout = {
  id: string;
  pidOrder: string;
  pidUser: string;
  providerReference: string | null;
  status: string;
  amountMinor: number;
  context: Context | string;
};
const contextOf = (row: Checkout): Context =>
  typeof row.context === 'string' ? JSON.parse(row.context) : row.context;

export async function startProcurementPayPalCheckout(
  pidOrder: string,
  pidUser: string,
  origin: string,
) {
  const lifecycle = await getProcurementOrderLifecycle(pidOrder, pidUser);
  if (lifecycle.payment.currency !== 'USD' || !lifecycle.payment.isPayable)
    throw new Error('There is no USD payment due on this order.');
  if (
    lifecycle.order.status === 'saved' &&
    (lifecycle.payment.due < 200 || lifecycle.totalMeasurement < 10)
  ) {
    throw new Error(
      'International procurement orders must be at least USD 200 and 10kg.',
    );
  }
  const amountMinor = Math.round(lifecycle.payment.due * 100);
  if (!Number.isSafeInteger(amountMinor) || amountMinor <= 0)
    throw new Error('Invalid payment amount.');
  const context: Context = {
    environment: getSureImportsPayPalEnvironment(),
    status: lifecycle.order.status || '',
    nextStatus: lifecycle.payment.nextStatus,
    productsTotalUsd: lifecycle.productsTotalUsd,
    orderUpdatedAt: lifecycle.order.updatedAt?.toISOString() || null,
    snapshot: lifecycle.snapshot,
    oldTotal: lifecycle.order.orderTotalCost,
    oldWeight: lifecycle.order.orderWeight,
    oldShipping: lifecycle.order.orderShippingCost,
  };
  const stageKey = createHash('sha256')
    .update(
      JSON.stringify([
        getSureImportsPayPalEnvironment(),
        pidOrder,
        context.status,
        context.orderUpdatedAt,
      ]),
    )
    .digest('hex');
  const id = `PPROC_${randomUUID()}`;
  await prisma.$executeRaw`
    INSERT IGNORE INTO paypal_procurement_checkouts (id, stageKey, pidOrder, pidUser, amountMinor, context)
    VALUES (${id}, ${stageKey}, ${pidOrder}, ${pidUser}, ${amountMinor}, ${JSON.stringify(context)})
  `;
  const [checkout] = await prisma.$queryRaw<
    Checkout[]
  >`SELECT * FROM paypal_procurement_checkouts WHERE stageKey = ${stageKey}`;
  if (!checkout || checkout.status !== 'PENDING')
    throw new Error(
      'This payment is already being processed. Refresh your order before paying again.',
    );
  const savedSnapshot = contextOf(checkout).snapshot;
  if (
    checkout.amountMinor !== amountMinor ||
    Object.entries(context.snapshot).some(
      ([key, value]) =>
        savedSnapshot[key as keyof typeof savedSnapshot] !== value,
    )
  ) {
    throw new Error(
      'The quotation changed after checkout started. Contact support before making payment.',
    );
  }
  const returnPath = `/checkout/paypal/procurement?checkout=${encodeURIComponent(checkout.id)}`;
  const cancelPath = `/dashboard/procurement/view-orders/${context.status}`;
  let orderId = checkout.providerReference;
  if (!orderId) {
    const order = await createPayPalOrder({
      amount: (amountMinor / 100).toFixed(2),
      currency: 'USD',
      customId: checkout.id,
      invoiceId: checkout.id,
      description: `Procurement ${pidOrder}`,
      returnUrl: new URL(returnPath, origin).toString(),
      cancelUrl: new URL(cancelPath, origin).toString(),
    });
    orderId = order.id;
    await prisma.$executeRaw`UPDATE paypal_procurement_checkouts SET providerReference = ${orderId}, updatedAt = NOW(3) WHERE id = ${checkout.id}`;
  }
  const url = new URL('/checkout/paypal', origin);
  url.searchParams.set(
    'session',
    signPayPalCheckoutSession({
      orderId,
      amount: (amountMinor / 100).toFixed(2),
      currency: 'USD',
      description: `Procurement ${pidOrder}`,
      returnPath,
      cancelPath,
      expiresAt: Date.now() + 2 * 60 * 60 * 1000,
    }),
  );
  return url.toString();
}

export async function confirmProcurementPayPalCheckout(
  reference: string,
  pidUser?: string,
  allowCapture = false,
) {
  const [checkout] = await prisma.$queryRaw<
    Checkout[]
  >`SELECT * FROM paypal_procurement_checkouts WHERE providerReference = ${reference} LIMIT 1`;
  if (!checkout) return null;
  if (pidUser && checkout.pidUser !== pidUser)
    throw new Error('Payment not found.');
  const context = contextOf(checkout);
  if (['REVERSED', 'REVIEW'].includes(checkout.status))
    throw new Error('This payment requires support review. Do not pay again.');
  let order = await getPayPalOrder(reference);
  assertPayPalOrderMatches(order, {
    customId: checkout.id,
    amountMinor: checkout.amountMinor,
    currency: 'USD',
  });
  if (order.status === 'APPROVED' && allowCapture) {
    const lifecycle = await getProcurementOrderLifecycle(
      checkout.pidOrder,
      checkout.pidUser,
    );
    if (
      lifecycle.order.status !== context.status ||
      lifecycle.payment.currency !== 'USD' ||
      Math.round(lifecycle.payment.due * 100) !== checkout.amountMinor ||
      (lifecycle.order.updatedAt?.toISOString() || null) !==
        context.orderUpdatedAt
    ) {
      throw new Error(
        'The order changed. Payment was not captured; return to your order or contact support.',
      );
    }
    order = await capturePayPalOrder(reference);
  }
  assertPayPalOrderMatches(order, {
    customId: checkout.id,
    amountMinor: checkout.amountMinor,
    currency: 'USD',
  });
  const capture = order.purchase_units?.[0]?.payments?.captures?.[0];
  assertPayPalLiveFulfillment(order);
  if (
    order.status !== 'COMPLETED' ||
    order.purchase_units[0].payments?.captures?.length !== 1 ||
    typeof capture?.id !== 'string' ||
    !capture.id ||
    capture?.status !== 'COMPLETED' ||
    capture.amount?.currency_code !== 'USD' ||
    Math.round(Number(capture.amount?.value) * 100) !== checkout.amountMinor
  ) {
    throw new Error(
      'Payment has not been confirmed. Check your order before retrying.',
    );
  }
  const result = await prisma.$transaction(async (tx) => {
    const [locked] = await tx.$queryRaw<
      Checkout[]
    >`SELECT * FROM paypal_procurement_checkouts WHERE id = ${checkout.id} FOR UPDATE`;
    if (locked.status === 'PAID') return 'PAID';
    if (locked.status !== 'PENDING') return locked.status;
    const user = await tx.users.findUnique({
      where: { pidUser: checkout.pidUser },
    });
    // Record captured money even if the order changed while the bank was authorising it.
    await tx.payments.upsert({
      where: { pidPayment: checkout.id },
      update: {},
      create: {
        pidPayment: checkout.id,
        pidUser: checkout.pidUser,
        payerName:
          `${user?.userFirstname || ''} ${user?.userLastname || ''}`.trim() ||
          'Customer',
        payerEmail: user?.userEmail,
        txID: String(capture.id),
        txRef: reference,
        paymentStatus: 'PAID',
        paymentType: 'PAYPAL',
        currency: 'USD',
        amount: checkout.amountMinor / 100,
        serviceID: checkout.pidOrder,
        serviceName: 'PROCUREMENT',
        serviceDescription: 'Procurement card / PayPal payment',
        updatedAt: new Date(),
      },
    });
    const updated = await tx.orders.updateMany({
      where: {
        pidOrder: checkout.pidOrder,
        pidUser: checkout.pidUser,
        status: context.status,
        updatedAt: context.orderUpdatedAt
          ? new Date(context.orderUpdatedAt)
          : null,
      },
      data: {
        status: context.nextStatus,
        updatedAt: new Date(),
        ...(context.status !== 'pay-for-shipping' ? context.snapshot : {}),
        ...(context.status === 'on-hold'
          ? {
              orderTotalCostOld: context.oldTotal,
              orderWeightOld: context.oldWeight,
              orderShippingCostOld: context.oldShipping,
            }
          : {}),
      },
    });
    const status = updated.count === 1 ? 'PAID' : 'REVIEW';
    await tx.$executeRaw`UPDATE paypal_procurement_checkouts SET status = ${status}, captureReference = ${String(capture.id)}, updatedAt = NOW(3) WHERE id = ${checkout.id}`;
    return status;
  });
  if (result !== 'PAID') {
    await notifyProcurementPayPalPayment(checkout.id).catch(() => undefined);
    throw new Error(
      'Payment received, but your order needs review. Contact support; do not pay again.',
    );
  }
  if (context.status !== 'pay-for-shipping') {
    await recordAffiliateConversion({
      customerReference: checkout.pidUser,
      serviceKey: AFFILIATE_SERVICE_KEYS.BUY_FROM_CHINESE_WEBSITES,
      externalOrderReference: `procurement:${checkout.pidOrder}`,
      externalPaymentReference: `paypal:${reference}`,
      paymentCurrency: 'USD',
      grossAmount: checkout.amountMinor / 100,
      eligibleAmount: context.productsTotalUsd,
    });
  }
  await notifyProcurementPayPalPayment(checkout.id).catch(() => undefined);
  return { nextStatus: context.nextStatus };
}

export async function reconcileProcurementPayPalPayments() {
  const environment = getSureImportsPayPalEnvironment();
  const rows = await prisma.$queryRaw<Checkout[]>`
    SELECT * FROM paypal_procurement_checkouts
    WHERE providerReference IS NOT NULL
      AND COALESCE(JSON_UNQUOTE(JSON_EXTRACT(context, '$.environment')), 'live') = ${environment}
      AND (status = 'PENDING' OR (status IN ('PAID', 'REVIEW') AND
        (COALESCE(JSON_EXTRACT(context, '$.customerReceiptSent'), false) = false OR
         COALESCE(JSON_EXTRACT(context, '$.adminReceiptSent'), false) = false)))
      AND createdAt > DATE_SUB(NOW(), INTERVAL 30 DAY)
    ORDER BY COALESCE(JSON_EXTRACT(context, '$.lastReconciledAt'), 0), createdAt
    LIMIT 10
  `;
  const outcomes = await Promise.allSettled(
    rows.map(async (row) => {
      await prisma.$executeRaw`UPDATE paypal_procurement_checkouts SET context = JSON_SET(context, '$.lastReconciledAt', UNIX_TIMESTAMP()) WHERE id = ${row.id}`;
      if (row.status === 'REVIEW')
        return notifyProcurementPayPalPayment(row.id);
      return confirmProcurementPayPalCheckout(
        row.providerReference!,
        undefined,
        true,
      );
    }),
  );
  return {
    checked: rows.length,
    recovered: outcomes.filter((result) => result.status === 'fulfilled')
      .length,
  };
}
