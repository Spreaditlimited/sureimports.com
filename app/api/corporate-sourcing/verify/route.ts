import { NextResponse } from 'next/server';

import { generateToken } from '@/lib/jwt';
import {
  confirmCorporateSourcingPayment,
  getCorporateSourcingPayment,
  hashCorporateSubmissionToken,
} from '@/lib/corporateSourcing/payments';
import {
  resolvePublicAccount,
  sendPublicAccountSetupEmail,
} from '@/lib/auth/resolvePublicAccount';
import { capturePayPalOrder, getPayPalOrder } from '@/lib/paypal';
import { prisma } from '@/lib/prisma';
import { checkoutOriginIsAllowed } from '@/lib/intelligence/reportCheckoutSecurity';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function paypalCapture(order: any) {
  return order?.purchase_units?.[0]?.payments?.captures?.[0] || null;
}

export async function POST(request: Request) {
  if (!checkoutOriginIsAllowed(request)) {
    return NextResponse.json({ message: 'This verification request is not allowed.' }, { status: 403 });
  }
  const body = await request.json().catch(() => ({}));
  const pidPayment = String(body.pidPayment || '').trim();
  const provider = String(body.provider || '').trim().toLowerCase();
  const reference = String(body.reference || '').trim();
  const submissionToken = String(body.submissionToken || '').trim();
  const payment = await getCorporateSourcingPayment(pidPayment);
  if (
    !payment ||
    payment.paymentProvider !== provider ||
    !submissionToken ||
    hashCorporateSubmissionToken(submissionToken) !== payment.submissionTokenHash
  ) {
    return NextResponse.json({ message: 'Payment verification details are invalid.' }, { status: 400 });
  }

  let paidAt: Date | null = null;
  let captureReference: string | null = null;
  if (provider === 'paystack') {
    const secret = process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY;
    if (!secret || !reference || reference !== payment.providerReference) {
      return NextResponse.json({ message: 'Invalid Paystack payment reference.' }, { status: 400 });
    }
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${secret}` }, cache: 'no-store' },
    );
    const data = await response.json();
    const result = data?.data;
    if (
      !response.ok || !data?.status || result?.status !== 'success' ||
      Number(result?.amount) !== payment.amountMinor ||
      String(result?.currency || '').toUpperCase() !== payment.currency ||
      result?.metadata?.product !== 'corporate_sourcing_research_fee' ||
      String(result?.metadata?.pidPayment || '') !== payment.pidPayment
    ) {
      return NextResponse.json({ message: 'Paystack could not confirm the expected payment.' }, { status: 400 });
    }
    paidAt = result?.paid_at ? new Date(result.paid_at) : null;
  } else if (provider === 'paypal') {
    const orderId = reference || payment.providerReference || '';
    if (!orderId || orderId !== payment.providerReference) {
      return NextResponse.json({ message: 'Invalid PayPal order reference.' }, { status: 400 });
    }
    let order = await getPayPalOrder(orderId);
    if (String(order?.status).toUpperCase() !== 'COMPLETED') order = await capturePayPalOrder(orderId);
    const capture = paypalCapture(order);
    const unit = order?.purchase_units?.[0];
    if (
      String(order?.status).toUpperCase() !== 'COMPLETED' ||
      String(capture?.status || '').toUpperCase() !== 'COMPLETED' ||
      String(unit?.custom_id || '') !== pidPayment ||
      Math.round(Number(capture?.amount?.value || 0) * 100) !== payment.amountMinor ||
      String(capture?.amount?.currency_code || '').toUpperCase() !== payment.currency
    ) {
      return NextResponse.json({ message: 'PayPal could not confirm the expected payment.' }, { status: 400 });
    }
    captureReference = String(capture?.id || '').trim() || null;
    paidAt = capture?.create_time ? new Date(capture.create_time) : null;
  } else {
    return NextResponse.json({ message: 'Unsupported payment provider.' }, { status: 400 });
  }

  let pidUser = payment.pidUser;
  let newUser = null;
  if (!pidUser) {
    const existing = await prisma.users.findUnique({ where: { userEmail: payment.email } });
    if (existing) {
      pidUser = existing.pidUser;
    } else {
      const account = await resolvePublicAccount({
        email: payment.email,
        firstName: payment.firstName || undefined,
        lastName: payment.lastName || undefined,
        country: payment.billingCountry || undefined,
        affiliateRef: 'corporate-sourcing',
        accountSetupKey: `corporate_sourcing:${pidPayment}`,
      });
      if (account.status === 'ready') {
        pidUser = account.user.pidUser;
        if (account.createdNewAccount) newUser = account.user;
      }
    }
  }
  await confirmCorporateSourcingPayment({ pidPayment, paidAt, providerCaptureReference: captureReference });
  if (pidUser) {
    await prisma.$executeRaw`
      UPDATE corporate_sourcing_research_payments
      SET pidUser = ${pidUser}, updatedAt = ${new Date()}
      WHERE pidPayment = ${pidPayment}
    `;
  }
  const response = NextResponse.json({ success: true, pidPayment, canSubmit: true });
  if (newUser) {
    await sendPublicAccountSetupEmail({
      user: newUser,
      context: 'your Corporate Sourcing request',
    }).catch((error) => {
      console.error('Corporate Sourcing account setup email failed:', error);
    });
    response.cookies.set(
      'token',
      generateToken({
        pidUser: newUser.pidUser,
        userEmail: newUser.userEmail,
        userFirstname: newUser.userFirstname,
        userImage: newUser.userImage,
      }),
      { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' },
    );
  }
  return response;
}
