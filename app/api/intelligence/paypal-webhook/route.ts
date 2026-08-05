import { NextResponse } from 'next/server';

import { fulfillReportOrder } from '@/lib/intelligence/reportOrders';
import { getPayPalOrder, verifyPayPalWebhookSignature } from '@/lib/paypal';
import { prisma } from '@/lib/prisma';

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
      'PAYMENT.CAPTURE.REFUNDED',
      'CHECKOUT.ORDER.APPROVED',
    ].includes(event)
  ) {
    return NextResponse.json({ received: true });
  }
  const resource = body?.resource || {};
  const orderId = String(
    resource?.supplementary_data?.related_ids?.order_id ||
      (event === 'CHECKOUT.ORDER.APPROVED' ? resource?.id : '') ||
      '',
  ).trim();
  if (!orderId) return NextResponse.json({ received: true });
  const reportOrder = await prisma.intelligence_report_orders.findFirst({
    where: { providerReference: orderId, paymentProvider: 'paypal' },
  });
  if (!reportOrder) return NextResponse.json({ received: true });
  if (
    event === 'PAYMENT.CAPTURE.REFUNDED' ||
    event === 'PAYMENT.CAPTURE.DENIED'
  ) {
    await prisma.intelligence_report_orders.update({
      where: { pidOrder: reportOrder.pidOrder },
      data: {
        status: event === 'PAYMENT.CAPTURE.REFUNDED' ? 'refunded' : 'failed',
        updatedAt: new Date(),
      },
    });
    return NextResponse.json({ received: true });
  }
  if (reportOrder.status === 'paid')
    return NextResponse.json({ received: true });

  const paypalOrder = await getPayPalOrder(orderId);
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
    await fulfillReportOrder(reportOrder.pidOrder);
  }
  return NextResponse.json({ received: true });
}
