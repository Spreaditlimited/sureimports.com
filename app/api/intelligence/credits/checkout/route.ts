import { NextResponse } from 'next/server';

import randomGenerator from '@/lib/helpers/randomGenerator';
import { checkAuth } from '@/lib/auth/checkAuth';
import { getActiveIntelligenceSubscription } from '@/lib/intelligence/access';
import { getConfiguredIntelligencePlan } from '@/lib/intelligence/plans';

const PAYSTACK_SECRET_KEY = process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY;
const CREDIT_QUANTITIES = new Set([1, 3, 5, 10]);

function absoluteUrl(path: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    'https://www.sureimports.com';
  return `${baseUrl.replace(/\/$/, '')}${path}`;
}

export async function POST(request: Request) {
  const user = await checkAuth();
  if (!user?.pidUser || !user.userEmail) {
    return NextResponse.json({ message: 'Login required.' }, { status: 401 });
  }

  if (!PAYSTACK_SECRET_KEY) {
    return NextResponse.json(
      { message: 'Paystack secret key is not configured.' },
      { status: 500 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const quantity = Math.round(Number(body.quantity || 1));
  if (!CREDIT_QUANTITIES.has(quantity)) {
    return NextResponse.json(
      { message: 'Choose a valid credit quantity.' },
      { status: 400 },
    );
  }

  const subscription = await getActiveIntelligenceSubscription(user.pidUser);
  const plan = await getConfiguredIntelligencePlan(subscription?.plan || 'pro');
  const unitPriceNaira = Math.max(1, Math.round(plan.extraCreditPriceNaira));
  const amountKobo = unitPriceNaira * quantity * 100;
  const reference = `SI_INTEL_CREDITS_${quantity}_${Date.now()}_${randomGenerator(6)}`;

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
        callback_url: absoluteUrl('/intelligence/credits/verify'),
        metadata: {
          product: 'supplier_intelligence_search_credits',
          pidUser: user.pidUser,
          quantity,
          unitPriceNaira,
        },
      }),
    },
  );

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.status || !data?.data?.authorization_url) {
    return NextResponse.json(
      { message: data?.message || 'Unable to initialize credit checkout.' },
      { status: 502 },
    );
  }

  return NextResponse.json({
    authorizationUrl: data.data.authorization_url,
    reference,
  });
}
