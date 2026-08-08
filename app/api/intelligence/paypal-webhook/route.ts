import { NextResponse } from 'next/server';

import {
  confirmReportOrderPayment,
  transitionReportOrderAccess,
} from '@/lib/intelligence/reportOrders';
import { getPayPalOrder, verifyPayPalWebhookSignature } from '@/lib/paypal';
import { prisma } from '@/lib/prisma';
import { resolvePayPalAccessStatus } from '@/lib/intelligence/reportOrderPolicy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const verification = await verifyPayPalWebhookSignature({
    body,
    headers: {
      'paypal-transmission-id': request.headers.get('paypal-transmission-id'),
      'paypal-transmission-time': request.headers.get(
        'paypal-transmission-time',
      ),
      'paypal-cert-url': request.headers.get('paypal-cert-url'),
      'paypal-auth-algo': request.headers.get('paypal-auth-algo'),
      'paypal-transmission-sig': request.headers.get('paypal-transmission-sig'),
    },
  });
  if (
    String(verification?.verification_status || '').toUpperCase() !== 'SUCCESS'
  ) {
    return NextResponse.json(
      { message: 'Invalid PayPal signature.' },
      { status: 401 },
    );
  }

  const event = String(body?.event_type || '').toUpperCase();
  if (
    ![
      'PAYMENT.CAPTURE.COMPLETED',
      'PAYMENT.CAPTURE.DENIED',
      'PAYMENT.CAPTURE.DECLINED',
      'PAYMENT.CAPTURE.REFUNDED',
      'PAYMENT.CAPTURE.REVERSED',
      'CHECKOUT.ORDER.APPROVED',
      'CUSTOMER.DISPUTE.CREATED',
      'CUSTOMER.DISPUTE.UPDATED',
      'CUSTOMER.DISPUTE.RESOLVED',
    ].includes(event)
  ) {
    return NextResponse.json({ received: true });
  }
  const resource = body?.resource || {};
  const captureReference = String(
    resource?.disputed_transactions?.[0]?.seller_transaction_id ||
      (event.startsWith('PAYMENT.CAPTURE.') ? resource?.id : '') ||
      '',
  ).trim();
  const orderId = String(
    resource?.supplementary_data?.related_ids?.order_id ||
      (event === 'CHECKOUT.ORDER.APPROVED' ? resource?.id : '') ||
      '',
  ).trim();
  if (!orderId && !captureReference)
    return NextResponse.json({ received: true });
  const reportOrder = await prisma.intelligence_report_orders.findFirst({
    where: {
      paymentProvider: 'paypal',
      OR: [
        ...(orderId ? [{ providerReference: orderId }] : []),
        ...(captureReference
          ? [{ providerCaptureReference: captureReference }]
          : []),
      ],
    },
  });
  if (!reportOrder) return NextResponse.json({ received: true });
  if (
    event === 'PAYMENT.CAPTURE.REFUNDED' ||
    event === 'PAYMENT.CAPTURE.REVERSED' ||
    event === 'PAYMENT.CAPTURE.DENIED' ||
    event === 'PAYMENT.CAPTURE.DECLINED' ||
    event.startsWith('CUSTOMER.DISPUTE.')
  ) {
    const status = resolvePayPalAccessStatus(event) || 'revoked';
    await transitionReportOrderAccess({
      pidOrder: reportOrder.pidOrder,
      status,
      source: 'paypal',
      eventType: event.toLowerCase(),
      providerEventId: String(body?.id || '') || null,
      reason: `PayPal reported ${event}.`,
    });
    return NextResponse.json({ received: true });
  }
  const paypalOrder = await getPayPalOrder(
    orderId || reportOrder.providerReference || '',
  );
  const unit = paypalOrder?.purchase_units?.[0];
  const capture = unit?.payments?.captures?.[0];
  if (
    String(paypalOrder?.status || '').toUpperCase() === 'COMPLETED' &&
    String(capture?.status || '').toUpperCase() === 'COMPLETED' &&
    String(unit?.custom_id || '') === reportOrder.pidOrder &&
    Math.round(Number(capture?.amount?.value || 0) * 100) ===
      reportOrder.amountMinor &&
    String(capture?.amount?.currency_code || '').toUpperCase() ===
      reportOrder.currency
  ) {
    await confirmReportOrderPayment({
      pidOrder: reportOrder.pidOrder,
      source: 'paypal',
      paidAt: capture?.create_time ? new Date(capture.create_time) : null,
      providerEventId: String(body?.id || '') || null,
      providerCaptureReference: String(capture?.id || '').trim() || null,
    });
  }
  return NextResponse.json({ received: true });
}
