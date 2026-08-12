import { NextResponse } from 'next/server';

import { checkAuth } from '@/lib/auth/checkAuth';
import {
  corporateSubmissionToken,
  ensureCorporateSourcingPayments,
  hashCorporateSubmissionToken,
} from '@/lib/corporateSourcing/payments';
import { getCorporateSourcingPricing } from '@/lib/corporateSourcing/pricing';
import randomGenerator from '@/lib/helpers/randomGenerator';
import {
  checkoutOriginIsAllowed,
  checkoutReturnUrl,
  enforceReportCheckoutRateLimit,
  REPORT_EMAIL_PATTERN,
} from '@/lib/intelligence/reportCheckoutSecurity';
import { createPayPalOrder } from '@/lib/paypal';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function clean(value: unknown, max = 255) {
  return String(value || '').trim().slice(0, max);
}

export async function GET() {
  try {
    return NextResponse.json({ success: true, data: await getCorporateSourcingPricing() });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Research fee is temporarily unavailable.' },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  if (!checkoutOriginIsAllowed(request)) {
    return NextResponse.json({ message: 'This checkout request is not allowed.' }, { status: 403 });
  }
  const body = await request.json().catch(() => ({}));
  const email = clean(body.email).toLowerCase();
  const firstName = clean(body.firstName, 120);
  const lastName = clean(body.lastName, 120);
  const billingCountry = clean(body.billingCountry, 120);
  const honeypot = clean(body.companyWebsite, 180);
  if (!REPORT_EMAIL_PATTERN.test(email) || !firstName || !billingCountry || honeypot) {
    return NextResponse.json(
      { message: 'Name, email and billing country are required.' },
      { status: 400 },
    );
  }
  const rateLimit = await enforceReportCheckoutRateLimit({ request, email });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { message: 'Too many checkout attempts. Please try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } },
    );
  }

  const pricing = await getCorporateSourcingPricing();
  const provider = billingCountry.toLowerCase() === 'nigeria' ? 'paystack' : 'paypal';
  const amountMinor = provider === 'paystack' ? pricing.priceNaira * 100 : pricing.priceUsdCents;
  const currency = provider === 'paystack' ? 'NGN' : 'USD';
  const pidPayment = `CSRF${randomGenerator(18)}`;
  const submissionToken = corporateSubmissionToken();
  const providerReference =
    provider === 'paystack' ? `CS_RESEARCH_${Date.now()}_${randomGenerator(8)}` : null;
  const auth = await checkAuth();
  const authenticatedUser = auth?.pidUser
    ? await prisma.users.findUnique({ where: { pidUser: auth.pidUser } })
    : null;
  const existingUser = authenticatedUser
    ? null
    : await prisma.users.findUnique({ where: { userEmail: email } });

  await ensureCorporateSourcingPayments();
  await prisma.$executeRaw`
    INSERT INTO corporate_sourcing_research_payments (
      pidPayment, pidUser, email, firstName, lastName, billingCountry,
      paymentProvider, providerReference, status, amountMinor, currency,
      submissionTokenHash, createdAt, updatedAt
    ) VALUES (
      ${pidPayment}, ${authenticatedUser?.pidUser || existingUser?.pidUser || null},
      ${email}, ${firstName}, ${lastName || null}, ${billingCountry},
      ${provider}, ${providerReference}, 'pending', ${amountMinor}, ${currency},
      ${hashCorporateSubmissionToken(submissionToken)}, ${new Date()}, ${new Date()}
    )
  `;

  try {
    if (provider === 'paystack') {
      const secret = process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY;
      if (!secret) throw new Error('Paystack is not configured.');
      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          amount: amountMinor,
          currency,
          reference: providerReference,
          callback_url: checkoutReturnUrl(
            request,
            `/corporate-sourcing/checkout/verify?provider=paystack&pidPayment=${pidPayment}`,
          ),
          metadata: { product: 'corporate_sourcing_research_fee', pidPayment },
        }),
      });
      const data = await response.json();
      if (!response.ok || !data?.status || !data?.data?.authorization_url) {
        throw new Error(data?.message || 'Unable to initialize Paystack checkout.');
      }
      return NextResponse.json({
        authorizationUrl: data.data.authorization_url,
        pidPayment,
        submissionToken,
      });
    }

    const order = await createPayPalOrder({
      amount: (amountMinor / 100).toFixed(2),
      currency,
      returnUrl: checkoutReturnUrl(
        request,
        `/corporate-sourcing/checkout/verify?provider=paypal&pidPayment=${pidPayment}`,
      ),
      cancelUrl: checkoutReturnUrl(
        request,
        '/corporate-sourcing?payment=cancelled#corporate-sourcing-form',
      ),
      customId: pidPayment,
      invoiceId: pidPayment,
      description: 'Corporate Sourcing research fee',
    });
    if (!order.approvalUrl) throw new Error('PayPal approval URL was not returned.');
    await prisma.$executeRaw`
      UPDATE corporate_sourcing_research_payments
      SET providerReference = ${order.id}, updatedAt = ${new Date()}
      WHERE pidPayment = ${pidPayment}
    `;
    return NextResponse.json({ authorizationUrl: order.approvalUrl, pidPayment, submissionToken });
  } catch (error) {
    await prisma.$executeRaw`
      UPDATE corporate_sourcing_research_payments
      SET status = 'failed', updatedAt = ${new Date()}
      WHERE pidPayment = ${pidPayment}
    `;
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Unable to start checkout.' },
      { status: 502 },
    );
  }
}
