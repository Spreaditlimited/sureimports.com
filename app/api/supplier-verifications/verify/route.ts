import { NextResponse } from 'next/server';
import { z } from 'zod';
import { checkAuth } from '@/lib/auth/checkAuth';
import { capturePayPalOrder, getPayPalOrder } from '@/lib/paypal';
import { prisma } from '@/lib/prisma';
import { confirmSupplierVerificationPayment } from '@/lib/supplierVerification/service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const auth = await checkAuth();
  if (!auth)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const parsed = z
    .object({
      pidPayment: z.string().min(5),
      provider: z.enum(['paystack', 'paypal']),
      reference: z.string().min(1),
    })
    .safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { message: 'Payment details are incomplete.' },
      { status: 400 },
    );
  const payment = await prisma.supplier_verification_payments.findUnique({
    where: { pidPayment: parsed.data.pidPayment },
    include: { request: true },
  });
  if (
    !payment ||
    payment.request.pidUser !== auth.pidUser ||
    payment.paymentProvider !== parsed.data.provider
  ) {
    return NextResponse.json(
      { message: 'Payment was not found.' },
      { status: 404 },
    );
  }
  if (payment.status === 'paid')
    return NextResponse.json({
      success: true,
      requestId: payment.requestId,
      paymentPurpose: payment.paymentPurpose,
    });
  if (parsed.data.reference !== payment.providerReference) {
    return NextResponse.json(
      { message: 'Payment reference does not match.' },
      { status: 400 },
    );
  }

  let captureReference: string | null = null;
  let paidAt: Date | null = null;
  if (payment.paymentProvider === 'paystack') {
    const secret = process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY;
    if (!secret)
      return NextResponse.json(
        { message: 'Paystack is not configured.' },
        { status: 503 },
      );
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(parsed.data.reference)}`,
      { headers: { Authorization: `Bearer ${secret}` }, cache: 'no-store' },
    );
    const body = await response.json().catch(() => null);
    const data = body?.data;
    if (
      !response.ok ||
      data?.status !== 'success' ||
      Number(data?.amount) !== payment.amountMinor ||
      String(data?.currency || '').toUpperCase() !== payment.currency ||
      data?.metadata?.product !== 'supplier_verification' ||
      String(data?.metadata?.pidPayment || '') !== payment.pidPayment
    ) {
      return NextResponse.json(
        { message: 'Paystack could not confirm the expected payment.' },
        { status: 400 },
      );
    }
    paidAt = data?.paid_at ? new Date(data.paid_at) : null;
  } else {
    let order = await getPayPalOrder(parsed.data.reference);
    if (String(order?.status).toUpperCase() !== 'COMPLETED')
      order = await capturePayPalOrder(parsed.data.reference);
    const unit = order?.purchase_units?.[0];
    const capture = unit?.payments?.captures?.[0];
    if (
      String(order?.status).toUpperCase() !== 'COMPLETED' ||
      String(capture?.status).toUpperCase() !== 'COMPLETED' ||
      String(unit?.custom_id || '') !== payment.pidPayment ||
      Math.round(Number(capture?.amount?.value || 0) * 100) !==
        payment.amountMinor ||
      String(capture?.amount?.currency_code || '').toUpperCase() !==
        payment.currency
    ) {
      return NextResponse.json(
        { message: 'PayPal could not confirm the expected payment.' },
        { status: 400 },
      );
    }
    captureReference = String(capture?.id || '') || null;
    paidAt = capture?.create_time ? new Date(capture.create_time) : null;
  }
  await confirmSupplierVerificationPayment({
    pidPayment: payment.pidPayment,
    providerCaptureReference: captureReference,
    paidAt,
  });
  return NextResponse.json({
    success: true,
    requestId: payment.requestId,
    paymentPurpose: payment.paymentPurpose,
  });
}
