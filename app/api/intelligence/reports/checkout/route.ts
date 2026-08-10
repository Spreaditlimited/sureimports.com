import { NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';

import randomGenerator from '@/lib/helpers/randomGenerator';
import { checkAuth } from '@/lib/auth/checkAuth';
import { createPayPalOrder } from '@/lib/paypal';
import {
  checkoutOriginIsAllowed,
  enforceReportCheckoutRateLimit,
  REPORT_EMAIL_PATTERN,
} from '@/lib/intelligence/reportCheckoutSecurity';
import { getPublishedReportBySlug } from '@/lib/intelligence/reports';
import { prisma } from '@/lib/prisma';
import { getSupplierReportResumePath } from '@/lib/auth/loginRedirect';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function clean(value: unknown, max = 255) {
  return String(value || '')
    .trim()
    .slice(0, max);
}

function absoluteUrl(path: string) {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    'https://www.sureimports.com';
  return `${base.replace(/\/$/, '')}${path}`;
}

export async function POST(request: Request) {
  if (!checkoutOriginIsAllowed(request)) {
    return NextResponse.json(
      { message: 'This checkout request is not allowed.' },
      { status: 403 },
    );
  }
  const body = await request.json().catch(() => ({}));
  const email = clean(body.email).toLowerCase();
  const firstName = clean(body.firstName, 120);
  const lastName = clean(body.lastName, 120);
  const billingCountry = clean(body.billingCountry, 120);
  const reportSlug = clean(body.reportSlug, 180);
  const honeypot = clean(body.companyWebsite, 180);

  if (
    !REPORT_EMAIL_PATTERN.test(email) ||
    !firstName ||
    !billingCountry ||
    !reportSlug ||
    honeypot
  ) {
    return NextResponse.json(
      { message: 'Name, email, billing country and report are required.' },
      { status: 400 },
    );
  }

  const rateLimit = await enforceReportCheckoutRateLimit({ request, email });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { message: 'Too many checkout attempts. Please try again shortly.' },
      {
        status: 429,
        headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  let result;
  try {
    result = await getPublishedReportBySlug(reportSlug);
  } catch (error) {
    console.error('Report checkout database unavailable:', error);
    return NextResponse.json(
      {
        message:
          'Report checkout is temporarily unavailable. Please try again shortly.',
      },
      { status: 503 },
    );
  }
  if (!result)
    return NextResponse.json(
      { message: 'This report is not available for purchase.' },
      { status: 404 },
    );
  const { report, version } = result;
  const pidOrder = `SIRO${randomGenerator(18)}`;
  const provider =
    billingCountry.toLowerCase() === 'nigeria' ? 'paystack' : 'paypal';
  const authUser = await checkAuth();
  const authenticatedBuyer = authUser?.pidUser
    ? await prisma.users.findUnique({ where: { pidUser: authUser.pidUser } })
    : null;
  const existingBuyer = !authenticatedBuyer
    ? await prisma.users.findUnique({ where: { userEmail: email } })
    : null;
  if (existingBuyer) {
    return NextResponse.json(
      {
        statusx: 'ACCOUNT_EXISTS_LOGIN_REQUIRED',
        message:
          'An account with this email already exists. Please sign in to complete your purchase.',
        loginPath: `/auth/login?next=${encodeURIComponent(getSupplierReportResumePath(report.slug))}`,
      },
      { status: 409 },
    );
  }
  const buyerEmail =
    authenticatedBuyer?.userEmail.trim().toLowerCase() || email;

  const downloadToken = randomBytes(48).toString('base64url');
  const amountMinor =
    provider === 'paystack' ? report.priceNaira * 100 : report.priceUsdCents;
  const currency = provider === 'paystack' ? 'NGN' : 'USD';
  const paystackReference =
    provider === 'paystack'
      ? `SI_REPORT_${Date.now()}_${randomGenerator(8)}`
      : null;

  await prisma.intelligence_report_orders.create({
    data: {
      pidOrder,
      reportId: report.pidReport,
      versionId: version.pidVersion,
      pidUser: authenticatedBuyer?.pidUser || null,
      email: buyerEmail,
      firstName,
      lastName: lastName || null,
      billingCountry,
      paymentProvider: provider,
      providerReference: paystackReference,
      status: 'pending',
      amountMinor,
      currency,
      downloadToken,
      downloadTokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  try {
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
            email: buyerEmail,
            amount: amountMinor,
            currency,
            reference: paystackReference,
            callback_url: absoluteUrl(
              `/supplier-intelligence/reports/checkout/verify?provider=paystack&pidOrder=${pidOrder}`,
            ),
            metadata: {
              product: 'supplier_intelligence_report',
              pidOrder,
              pidReport: report.pidReport,
              pidVersion: version.pidVersion,
            },
          }),
        },
      );
      const data = await response.json();
      if (!response.ok || !data?.status || !data?.data?.authorization_url)
        throw new Error(
          data?.message || 'Unable to initialize Paystack checkout.',
        );
      return NextResponse.json({
        authorizationUrl: data.data.authorization_url,
        pidOrder,
      });
    }

    const order = await createPayPalOrder({
      amount: (amountMinor / 100).toFixed(2),
      currency,
      returnUrl: absoluteUrl(
        `/supplier-intelligence/reports/checkout/verify?provider=paypal&pidOrder=${pidOrder}`,
      ),
      cancelUrl: absoluteUrl(
        `/supplier-intelligence/reports/${report.slug}?payment=cancelled`,
      ),
      customId: pidOrder,
      invoiceId: pidOrder,
      description: `${report.title} — ${report.editionLabel}`,
    });
    if (!order.approvalUrl)
      throw new Error('PayPal approval URL was not returned.');
    await prisma.intelligence_report_orders.update({
      where: { pidOrder },
      data: { providerReference: order.id, updatedAt: new Date() },
    });
    return NextResponse.json({ authorizationUrl: order.approvalUrl, pidOrder });
  } catch (error) {
    await prisma.intelligence_report_orders.update({
      where: { pidOrder },
      data: { status: 'failed', updatedAt: new Date() },
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
