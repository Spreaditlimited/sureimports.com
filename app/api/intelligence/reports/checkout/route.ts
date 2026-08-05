import { NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';

import randomGenerator from '@/lib/helpers/randomGenerator';
import { checkAuth } from '@/lib/auth/checkAuth';
import { createPayPalOrder } from '@/lib/paypal';
import { getOrCreateReportBuyer } from '@/lib/intelligence/reportOrders';
import { getPublishedReportBySlug } from '@/lib/intelligence/reports';
import { prisma } from '@/lib/prisma';

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
  const body = await request.json().catch(() => ({}));
  const email = clean(body.email).toLowerCase();
  const firstName = clean(body.firstName, 120);
  const lastName = clean(body.lastName, 120);
  const billingCountry = clean(body.billingCountry, 120);
  const reportSlug = clean(body.reportSlug, 180);

  if (!email.includes('@') || !firstName || !billingCountry || !reportSlug) {
    return NextResponse.json(
      { message: 'Name, email, billing country and report are required.' },
      { status: 400 },
    );
  }

  const result = await getPublishedReportBySlug(reportSlug);
  if (!result)
    return NextResponse.json(
      { message: 'This report is not available for purchase.' },
      { status: 404 },
    );
  const { report, version } = result;
  const provider =
    billingCountry.toLowerCase() === 'nigeria' ? 'paystack' : 'paypal';
  const authUser = await checkAuth();
  const buyer = authUser
    ? await prisma.users.findUnique({ where: { pidUser: authUser.pidUser } })
    : await getOrCreateReportBuyer({
        email,
        firstName,
        lastName,
        country: billingCountry,
      });
  if (!buyer)
    return NextResponse.json(
      { message: 'Unable to connect your Sure Imports account.' },
      { status: 500 },
    );

  const pidOrder = `SIRO${randomGenerator(18)}`;
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
      pidUser: buyer.pidUser,
      email,
      firstName,
      lastName: lastName || null,
      billingCountry,
      paymentProvider: provider,
      providerReference: paystackReference,
      status: 'pending',
      amountMinor,
      currency,
      downloadToken,
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
            email,
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
