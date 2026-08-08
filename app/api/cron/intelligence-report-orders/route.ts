import { NextResponse } from 'next/server';

import { capturePayPalOrder, getPayPalOrder } from '@/lib/paypal';
import {
  confirmReportOrderPayment,
  deliverReportOrder,
} from '@/lib/intelligence/reportOrders';
import { pruneReportCheckoutRateLimits } from '@/lib/intelligence/reportCheckoutSecurity';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function reconcilePendingOrder(order: {
  pidOrder: string;
  paymentProvider: string;
  providerReference: string | null;
  amountMinor: number;
  currency: string;
  reportId: string;
  versionId: string;
}) {
  if (!order.providerReference) return false;
  if (order.paymentProvider === 'paystack') {
    const secret = process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY;
    if (!secret) return false;
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(order.providerReference)}`,
      {
        headers: { Authorization: `Bearer ${secret}` },
        cache: 'no-store',
      },
    );
    const body = await response.json().catch(() => ({}));
    const payment = body?.data;
    if (
      !response.ok ||
      !body?.status ||
      payment?.status !== 'success' ||
      Number(payment?.amount) !== order.amountMinor ||
      String(payment?.currency || '').toUpperCase() !== order.currency ||
      payment?.metadata?.product !== 'supplier_intelligence_report' ||
      String(payment?.metadata?.pidOrder || '') !== order.pidOrder ||
      String(payment?.metadata?.pidReport || '') !== order.reportId ||
      String(payment?.metadata?.pidVersion || '') !== order.versionId
    ) {
      return false;
    }
    await confirmReportOrderPayment({
      pidOrder: order.pidOrder,
      source: 'reconciliation',
      paidAt: payment.paid_at ? new Date(payment.paid_at) : null,
      providerEventId: `reconcile:paystack:${payment.id || payment.reference}`,
    });
    return true;
  }

  if (order.paymentProvider === 'paypal') {
    let payment = await getPayPalOrder(order.providerReference);
    if (String(payment?.status || '').toUpperCase() === 'APPROVED') {
      payment = await capturePayPalOrder(order.providerReference);
    }
    const unit = payment?.purchase_units?.[0];
    const capture = unit?.payments?.captures?.[0];
    if (
      String(payment?.status || '').toUpperCase() !== 'COMPLETED' ||
      String(capture?.status || '').toUpperCase() !== 'COMPLETED' ||
      String(unit?.custom_id || '') !== order.pidOrder ||
      Math.round(Number(capture?.amount?.value || 0) * 100) !==
        order.amountMinor ||
      String(capture?.amount?.currency_code || '').toUpperCase() !==
        order.currency
    ) {
      return false;
    }
    await confirmReportOrderPayment({
      pidOrder: order.pidOrder,
      source: 'reconciliation',
      paidAt: capture?.create_time ? new Date(capture.create_time) : null,
      providerEventId: `reconcile:paypal:${capture?.id || order.providerReference}`,
      providerCaptureReference: String(capture?.id || '').trim() || null,
    });
    return true;
  }
  return false;
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
  }

  const pending = await prisma.intelligence_report_orders.findMany({
    where: {
      status: 'pending',
      providerReference: { not: null },
      createdAt: {
        lt: new Date(Date.now() - 20 * 60 * 1000),
        gt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    },
    orderBy: { createdAt: 'asc' },
    take: 10,
    select: {
      pidOrder: true,
      paymentProvider: true,
      providerReference: true,
      amountMinor: true,
      currency: true,
      reportId: true,
      versionId: true,
    },
  });
  const reconciled = await Promise.allSettled(
    pending.map(reconcilePendingOrder),
  );

  const deliveries = await prisma.intelligence_report_orders.findMany({
    where: {
      status: 'paid',
      fulfilledAt: null,
      fulfillmentAttempts: { lt: 8 },
      OR: [
        { lastFulfillmentAttemptAt: null },
        {
          lastFulfillmentAttemptAt: {
            lt: new Date(Date.now() - 15 * 60 * 1000),
          },
        },
      ],
    },
    orderBy: { paidAt: 'asc' },
    take: 25,
    select: { pidOrder: true },
  });
  const delivered = await Promise.allSettled(
    deliveries.map(({ pidOrder }) => deliverReportOrder(pidOrder)),
  );

  await Promise.all([
    pruneReportCheckoutRateLimits(),
    prisma.intelligence_report_orders.updateMany({
      where: {
        status: { in: ['pending', 'failed'] },
        createdAt: { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
      data: { status: 'expired', updatedAt: new Date() },
    }),
  ]);

  return NextResponse.json({
    ok: true,
    pendingChecked: reconciled.length,
    paymentsRecovered: reconciled.filter(
      (result) => result.status === 'fulfilled' && result.value,
    ).length,
    deliveriesChecked: delivered.length,
    deliveriesCompleted: delivered.filter(
      (result) => result.status === 'fulfilled',
    ).length,
  });
}
