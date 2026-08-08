import { NextResponse } from 'next/server';

import { capturePayPalOrder, getPayPalOrder } from '@/lib/paypal';
import { checkAuth } from '@/lib/auth/checkAuth';
import { generateToken } from '@/lib/jwt';
import {
  confirmReportOrderPayment,
  deliverReportOrder,
} from '@/lib/intelligence/reportOrders';
import { prisma } from '@/lib/prisma';
import { checkoutOriginIsAllowed } from '@/lib/intelligence/reportCheckoutSecurity';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function paypalCapture(order: any) {
  return order?.purchase_units?.[0]?.payments?.captures?.[0] || null;
}

export async function POST(request: Request) {
  if (!checkoutOriginIsAllowed(request)) {
    return NextResponse.json(
      { message: 'This verification request is not allowed.' },
      { status: 403 },
    );
  }
  const body = await request.json().catch(() => ({}));
  const pidOrder = String(body.pidOrder || '').trim();
  const provider = String(body.provider || '')
    .trim()
    .toLowerCase();
  const reference = String(body.reference || '').trim();
  if (!pidOrder || !['paystack', 'paypal'].includes(provider)) {
    return NextResponse.json(
      { message: 'Payment verification details are incomplete.' },
      { status: 400 },
    );
  }

  const order = await prisma.intelligence_report_orders.findUnique({
    where: { pidOrder },
  });
  if (!order || order.paymentProvider !== provider) {
    return NextResponse.json(
      { message: 'Report order was not found.' },
      { status: 404 },
    );
  }

  if (['refunded', 'reversed', 'revoked', 'disputed'].includes(order.status)) {
    return NextResponse.json(
      { message: 'This order is not available for delivery.' },
      { status: 409 },
    );
  }

  let paidAt: Date | null = null;
  let providerCaptureReference: string | null = null;
  if (provider === 'paystack') {
    const secret = process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY;
    if (!secret || !reference || reference !== order.providerReference) {
      return NextResponse.json(
        { message: 'Invalid Paystack payment reference.' },
        { status: 400 },
      );
    }
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: `Bearer ${secret}` },
        cache: 'no-store',
      },
    );
    const data = await response.json();
    const payment = data?.data;
    if (
      !response.ok ||
      !data?.status ||
      payment?.status !== 'success' ||
      Number(payment?.amount) !== order.amountMinor ||
      String(payment?.currency || '').toUpperCase() !== order.currency ||
      payment?.metadata?.product !== 'supplier_intelligence_report' ||
      String(payment?.metadata?.pidOrder || '') !== order.pidOrder ||
      String(payment?.metadata?.pidReport || '') !== order.reportId ||
      String(payment?.metadata?.pidVersion || '') !== order.versionId
    ) {
      return NextResponse.json(
        { message: 'Paystack could not confirm the expected payment.' },
        { status: 400 },
      );
    }
    paidAt = payment?.paid_at ? new Date(payment.paid_at) : null;
  } else {
    const paypalOrderId = reference || order.providerReference || '';
    if (!paypalOrderId || paypalOrderId !== order.providerReference) {
      return NextResponse.json(
        { message: 'Invalid PayPal order reference.' },
        { status: 400 },
      );
    }
    let payment = await getPayPalOrder(paypalOrderId);
    if (String(payment?.status).toUpperCase() !== 'COMPLETED')
      payment = await capturePayPalOrder(paypalOrderId);
    const capture = paypalCapture(payment);
    const unit = payment?.purchase_units?.[0];
    const paidAmount = capture?.amount || unit?.amount;
    if (
      String(payment?.status).toUpperCase() !== 'COMPLETED' ||
      String(capture?.status || '').toUpperCase() !== 'COMPLETED' ||
      String(unit?.custom_id || '') !== pidOrder ||
      Math.round(Number(paidAmount?.value || 0) * 100) !== order.amountMinor ||
      String(paidAmount?.currency_code || '').toUpperCase() !== order.currency
    ) {
      return NextResponse.json(
        { message: 'PayPal could not confirm the expected payment.' },
        { status: 400 },
      );
    }
    providerCaptureReference = String(capture?.id || '').trim() || null;
    paidAt = capture?.create_time ? new Date(capture.create_time) : null;
  }

  await confirmReportOrderPayment({
    pidOrder,
    source: 'callback',
    paidAt,
    providerCaptureReference,
  });
  let deliveryPending = false;
  let fulfilled;
  try {
    fulfilled = await deliverReportOrder(pidOrder);
  } catch (error) {
    deliveryPending = true;
    console.error(
      'Report callback delivery deferred to reconciliation:',
      error,
    );
    const [paidOrder, report, version] = await Promise.all([
      prisma.intelligence_report_orders.findUnique({ where: { pidOrder } }),
      prisma.intelligence_report_products.findUnique({
        where: { pidReport: order.reportId },
      }),
      prisma.intelligence_report_versions.findUnique({
        where: { pidVersion: order.versionId },
      }),
    ]);
    if (!paidOrder || !report || !version) throw error;
    fulfilled = { order: paidOrder, report, version };
  }
  const authUser = await checkAuth();
  const fulfilledPidUser = fulfilled.order.pidUser;
  const alreadyOwnsSession = Boolean(
    authUser?.pidUser && authUser.pidUser === fulfilledPidUser,
  );
  const buyer = fulfilledPidUser
    ? await prisma.users.findUnique({ where: { pidUser: fulfilledPidUser } })
    : null;
  const isNewAccountForThisOrder = Boolean(
    buyer?.loginKey === `supplier_intelligence_report:${pidOrder}`,
  );
  const canOpenLibrary = alreadyOwnsSession || isNewAccountForThisOrder;
  const result = NextResponse.json({
    success: true,
    reportSlug: fulfilled.report.slug,
    downloadUrl: `/api/intelligence/reports/download?token=${encodeURIComponent(fulfilled.order.downloadToken)}`,
    canOpenLibrary,
    deliveryPending,
    accountAccess: alreadyOwnsSession
      ? 'signed_in'
      : isNewAccountForThisOrder
        ? 'account_created'
        : 'email_required',
  });

  if (isNewAccountForThisOrder && buyer) {
    const token = generateToken({
      pidUser: buyer.pidUser,
      userEmail: buyer.userEmail,
      userFirstname: buyer.userFirstname,
      userImage: buyer.userImage,
    });
    result.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
  }

  return result;
}
