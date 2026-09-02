import { NextResponse } from 'next/server';
import { z } from 'zod';
import { checkAuth } from '@/lib/auth/checkAuth';
import { createPayPalOrder } from '@/lib/paypal';
import { prisma } from '@/lib/prisma';
import {
  checkoutOriginIsAllowed,
  checkoutReturnUrl,
} from '@/lib/intelligence/reportCheckoutSecurity';
import {
  SUPPLIER_PAYMENT_PURPOSES,
  getSupplierVerificationSettings,
  supplierVerificationId,
} from '@/lib/supplierVerification/service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  context: { params: Promise<{ requestId: string }> },
) {
  if (!checkoutOriginIsAllowed(request)) {
    return NextResponse.json(
      { message: 'This checkout request is not allowed.' },
      { status: 403 },
    );
  }
  const auth = await checkAuth();
  if (!auth)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const parsed = z
    .object({ provider: z.enum(['paystack', 'paypal']) })
    .safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { message: 'Choose Paystack or PayPal.' },
      { status: 400 },
    );
  const { requestId } = await context.params;
  const verification = await prisma.verify_supplier.findUnique({
    where: { pidVerifySupplier: requestId },
  });
  if (!verification || verification.pidUser !== auth.pidUser) {
    return NextResponse.json(
      { message: 'Verification request was not found.' },
      { status: 404 },
    );
  }
  const settings = await getSupplierVerificationSettings();
  const provider = parsed.data.provider;
  const billingCountry = verification.billingCountry?.trim();
  if (!billingCountry) {
    return NextResponse.json(
      { message: 'A billing country is required before payment.' },
      { status: 409 },
    );
  }
  const requiredProvider =
    billingCountry.toLowerCase() === 'nigeria' ? 'paystack' : 'paypal';
  if (provider !== requiredProvider) {
    return NextResponse.json(
      {
        message:
          requiredProvider === 'paystack'
            ? 'Customers in Nigeria pay in NGN with Paystack.'
            : 'Customers outside Nigeria pay in USD with PayPal.',
      },
      { status: 400 },
    );
  }
  const paidPayments = await prisma.supplier_verification_payments.findMany({
    where: { requestId, status: 'paid' },
    select: { paymentPurpose: true },
  });
  const basePaid = paidPayments.some(
    (payment) =>
      payment.paymentPurpose === SUPPLIER_PAYMENT_PURPOSES.VERIFICATION ||
      payment.paymentPurpose === SUPPLIER_PAYMENT_PURPOSES.LEGACY_COMBINED,
  );
  const physicalVisitPaid = paidPayments.some(
    (payment) =>
      payment.paymentPurpose === SUPPLIER_PAYMENT_PURPOSES.PHYSICAL_VISIT ||
      payment.paymentPurpose === SUPPLIER_PAYMENT_PURPOSES.LEGACY_COMBINED,
  );
  const physical = verification.verificationType === 'PHYSICAL';
  const paymentPurpose = !basePaid
    ? SUPPLIER_PAYMENT_PURPOSES.VERIFICATION
    : SUPPLIER_PAYMENT_PURPOSES.PHYSICAL_VISIT;

  if (
    paymentPurpose === SUPPLIER_PAYMENT_PURPOSES.VERIFICATION &&
    !['AWAITING_PAYMENT', 'PAYMENT_PENDING'].includes(verification.status || '')
  ) {
    return NextResponse.json(
      { message: 'This verification request is not open for payment.' },
      { status: 409 },
    );
  }

  if (basePaid && !physical) {
    return NextResponse.json(
      { message: 'The standard verification fee has already been paid.' },
      { status: 409 },
    );
  }
  if (basePaid && physicalVisitPaid) {
    return NextResponse.json(
      { message: 'The physical visit has already been paid.' },
      { status: 409 },
    );
  }
  if (
    paymentPurpose === SUPPLIER_PAYMENT_PURPOSES.PHYSICAL_VISIT &&
    verification.transportQuoteStatus !== 'READY'
  ) {
    return NextResponse.json(
      { message: 'The optional physical-visit quote is not ready.' },
      { status: 409 },
    );
  }
  if (
    paymentPurpose === SUPPLIER_PAYMENT_PURPOSES.PHYSICAL_VISIT &&
    verification.quoteExpiresAt &&
    verification.quoteExpiresAt < new Date()
  ) {
    return NextResponse.json(
      { message: 'This physical-visit quote has expired.' },
      { status: 409 },
    );
  }
  const activePayment = await prisma.supplier_verification_payments.findFirst({
    where: {
      requestId,
      paymentPurpose,
      paymentProvider: provider,
      status: 'pending',
      authorizationUrl: { not: null },
    },
    orderBy: { createdAt: 'desc' },
  });
  if (activePayment?.authorizationUrl) {
    return NextResponse.json({
      authorizationUrl: activePayment.authorizationUrl,
      pidPayment: activePayment.pidPayment,
    });
  }
  const currency = provider === 'paystack' ? 'NGN' : 'USD';
  const serviceFeeMinor =
    paymentPurpose === SUPPLIER_PAYMENT_PURPOSES.VERIFICATION
      ? provider === 'paystack'
        ? settings.feeNgnKobo
        : settings.feeUsdCents
      : 0;
  const transportFeeMinor =
    paymentPurpose === SUPPLIER_PAYMENT_PURPOSES.PHYSICAL_VISIT
      ? provider === 'paystack'
        ? verification.transportFeeNgnKobo
        : verification.transportFeeUsdCents
      : 0;
  if (transportFeeMinor == null || transportFeeMinor < 0) {
    return NextResponse.json(
      { message: 'The travel and lodging quote is incomplete.' },
      { status: 409 },
    );
  }
  const amountMinor = serviceFeeMinor + transportFeeMinor;
  const pidPayment = supplierVerificationId('SVP');
  const providerReference =
    provider === 'paystack' ? supplierVerificationId('SV_PAY_') : null;
  await prisma.supplier_verification_payments.create({
    data: {
      pidPayment,
      requestId,
      paymentProvider: provider,
      paymentPurpose,
      providerReference,
      amountMinor,
      currency,
      serviceFeeMinor,
      transportFeeMinor,
      status: 'pending',
    },
  });

  try {
    let authorizationUrl: string;
    if (provider === 'paystack') {
      const secret = process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY;
      if (!secret) throw new Error('Paystack is not configured.');
      const response = await fetch(
        'https://api.paystack.co/transaction/initialize',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${secret}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: verification.userEmail || auth.userEmail,
            amount: amountMinor,
            currency,
            reference: providerReference,
            callback_url: checkoutReturnUrl(
              request,
              `/supplier-verification/checkout/verify?provider=paystack&pidPayment=${pidPayment}`,
            ),
            metadata: {
              product: 'supplier_verification',
              paymentPurpose,
              pidPayment,
              requestId,
            },
          }),
        },
      );
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.status || !data?.data?.authorization_url) {
        throw new Error(
          data?.message || 'Unable to initialize Paystack checkout.',
        );
      }
      authorizationUrl = data.data.authorization_url;
    } else {
      const order = await createPayPalOrder({
        amount: (amountMinor / 100).toFixed(2),
        currency,
        returnUrl: checkoutReturnUrl(
          request,
          `/supplier-verification/checkout/verify?provider=paypal&pidPayment=${pidPayment}`,
        ),
        cancelUrl: checkoutReturnUrl(
          request,
          `/dashboard/verify-supplier?payment=cancelled`,
        ),
        customId: pidPayment,
        invoiceId: pidPayment,
        description:
          paymentPurpose === SUPPLIER_PAYMENT_PURPOSES.VERIFICATION
            ? `Supplier Verification ${requestId}`
            : `Supplier physical visit ${requestId}`,
      });
      if (!order.approvalUrl)
        throw new Error('PayPal approval URL was not returned.');
      authorizationUrl = order.approvalUrl;
      await prisma.supplier_verification_payments.update({
        where: { pidPayment },
        data: { providerReference: order.id },
      });
    }
    await prisma.supplier_verification_payments.update({
      where: { pidPayment },
      data: { authorizationUrl },
    });
    if (paymentPurpose === SUPPLIER_PAYMENT_PURPOSES.VERIFICATION) {
      await prisma.verify_supplier.update({
        where: { pidVerifySupplier: requestId },
        data: { status: 'PAYMENT_PENDING', updatedAt: new Date() },
      });
    }
    return NextResponse.json({ authorizationUrl, pidPayment, paymentPurpose });
  } catch (error) {
    await prisma.supplier_verification_payments.update({
      where: { pidPayment },
      data: { status: 'failed' },
    });
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : 'Unable to start checkout.',
      },
      { status: 502 },
    );
  }
}
