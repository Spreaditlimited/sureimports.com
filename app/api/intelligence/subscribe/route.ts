import { NextResponse } from 'next/server';

import randomGenerator from '@/lib/helpers/randomGenerator';
import { checkAuth } from '@/lib/auth/checkAuth';
import {
  resolvePublicAccount,
  sendPublicAccountSetupEmail,
} from '@/lib/auth/resolvePublicAccount';
import { prisma } from '@/lib/prisma';
import {
  getPaystackPlanCode,
  getConfiguredIntelligencePlan,
  type IntelligencePlanKey,
} from '@/lib/intelligence/plans';
import { getIntelligenceSubscriptionResumePath } from '@/lib/auth/loginRedirect';

const PAYSTACK_SECRET_KEY = process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY;

function absoluteUrl(path: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    'https://www.sureimports.com';
  return `${baseUrl.replace(/\/$/, '')}${path}`;
}

export async function POST(request: Request) {
  if (!PAYSTACK_SECRET_KEY) {
    return NextResponse.json(
      { message: 'Paystack secret key is not configured.' },
      { status: 500 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const planKey = body.plan === 'pro' ? 'pro' : 'starter';
  const plan = await getConfiguredIntelligencePlan(planKey);
  const paystackPlanCode = await getPaystackPlanCode(plan.key);
  const authUser = await checkAuth();
  const email = String(body.email || authUser?.userEmail || '')
    .trim()
    .toLowerCase();
  const firstName = String(body.firstName || '').trim();
  const lastName = String(body.lastName || '').trim();
  const phone = String(body.phone || '').trim();
  const reference = `SI_INTEL_${plan.key.toUpperCase()}_${Date.now()}_${randomGenerator(6)}`;
  const pidSubscription = `INTSUB${randomGenerator(12)}`;

  if (!email || !email.includes('@')) {
    return NextResponse.json(
      { message: 'A valid email address is required.' },
      { status: 400 },
    );
  }

  const account = await resolvePublicAccount({
    authenticatedPidUser: authUser?.pidUser,
    email,
    firstName,
    lastName,
    phone,
    affiliateRef: 'supplier-intelligence',
    defaultFirstName: 'Subscriber',
    accountSetupKey: `supplier_intelligence_subscription:${pidSubscription}`,
  });
  if (account.status === 'login_required') {
    return NextResponse.json(
      {
        statusx: 'ACCOUNT_EXISTS_LOGIN_REQUIRED',
        message:
          'An account with this email already exists. Please sign in to subscribe.',
        loginPath: `/auth/login?next=${encodeURIComponent(getIntelligenceSubscriptionResumePath(plan.key))}`,
      },
      { status: 409 },
    );
  }

  let user = account.user;
  if (account.createdNewAccount) {
    try {
      await sendPublicAccountSetupEmail({
        user,
        context: 'your Supplier Intelligence subscription',
      });
    } catch (error) {
      console.error('subscription account setup email failed:', error);
    }
  }
  if (phone && !user.phone && !user.userPhone) {
    user = await prisma.users.update({
      where: { pidUser: user.pidUser },
      data: {
        phone,
        userPhone: phone,
        updatedAt: new Date(),
      },
    });
  }

  if (!paystackPlanCode) {
    return NextResponse.json(
      {
        message: `${plan.name} Paystack plan code is not configured. Set ${plan.envPlanCode}.`,
      },
      { status: 500 },
    );
  }

  const amountKobo = plan.priceNaira * 100;
  await prisma.intelligence_subscriptions.create({
    data: {
      pidSubscription,
      pidUser: user.pidUser,
      email: user.userEmail,
      plan: plan.key,
      status: 'pending',
      paystackReference: reference,
      amountKobo,
      currency: 'NGN',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const response = await fetch(
    'https://api.paystack.co/transaction/initialize',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.userEmail,
        amount: amountKobo,
        currency: 'NGN',
        reference,
        plan: paystackPlanCode,
        callback_url: absoluteUrl('/intelligence/checkout/verify'),
        metadata: {
          product: 'supplier_intelligence',
          plan: plan.key,
          pidUser: user.pidUser,
          pidSubscription,
        },
      }),
    },
  );

  const data = await response.json();

  if (!response.ok || !data?.status || !data?.data?.authorization_url) {
    await prisma.intelligence_subscriptions.update({
      where: { pidSubscription },
      data: {
        status: 'failed',
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: data?.message || 'Unable to initialize Paystack checkout.' },
      { status: 502 },
    );
  }

  return NextResponse.json({
    authorizationUrl: data.data.authorization_url,
    reference,
  });
}
