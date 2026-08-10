import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { checkAuth } from '@/lib/auth/checkAuth';
import { generateToken } from '@/lib/jwt';
import {
  activateIntelligenceSubscriptionPayment,
  IntelligenceSubscriptionNotFoundError,
  IntelligenceSubscriptionPaymentError,
} from '@/lib/intelligence/subscriptionActivation';

const PAYSTACK_SECRET_KEY = process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY;

export async function POST(request: Request) {
  const { reference } = await request.json().catch(() => ({ reference: '' }));

  if (!reference) {
    return NextResponse.json(
      { message: 'Payment reference is required.' },
      { status: 400 },
    );
  }

  if (!PAYSTACK_SECRET_KEY) {
    return NextResponse.json(
      { message: 'Paystack secret key is not configured.' },
      { status: 500 },
    );
  }

  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    },
  );

  const data = await response.json();

  if (!response.ok || !data?.status || data?.data?.status !== 'success') {
    await prisma.intelligence_subscriptions.updateMany({
      where: { paystackReference: reference },
      data: { status: 'failed', updatedAt: new Date() },
    });

    return NextResponse.json(
      { message: data?.message || 'Payment verification failed.' },
      { status: 400 },
    );
  }

  let subscription;
  let user;
  try {
    ({ subscription, user } =
      await activateIntelligenceSubscriptionPayment(data.data));
  } catch (error) {
    if (error instanceof IntelligenceSubscriptionNotFoundError) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }
    if (error instanceof IntelligenceSubscriptionPaymentError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    throw error;
  }

  const authUser = await checkAuth();
  const alreadyOwnsSession = authUser?.pidUser === user.pidUser;
  const isNewAccountForThisSubscription =
    user.loginKey ===
    `supplier_intelligence_subscription:${subscription.pidSubscription}`;

  const token = generateToken({
    pidUser: user.pidUser,
    userEmail: user.userEmail,
    userFirstname: user.userFirstname,
    userImage: user.userImage,
  });

  const result = NextResponse.json({
    status: true,
    subscription,
    canOpenDashboard: alreadyOwnsSession || isNewAccountForThisSubscription,
    accountAccess: alreadyOwnsSession
      ? 'signed_in'
      : isNewAccountForThisSubscription
        ? 'account_created'
        : 'login_required',
  });

  if (alreadyOwnsSession || isNewAccountForThisSubscription) {
    result.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
  }

  return result;
}
