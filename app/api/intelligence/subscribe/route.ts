import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';

import randomGenerator from '@/lib/helpers/randomGenerator';
import { checkAuth } from '@/lib/auth/checkAuth';
import { prisma } from '@/lib/prisma';
import {
  getIntelligencePlan,
  getPaystackPlanCode,
  type IntelligencePlanKey,
} from '@/lib/intelligence/plans';

const PAYSTACK_SECRET_KEY = process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY;

function absoluteUrl(path: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    'https://www.sureimports.com';
  return `${baseUrl.replace(/\/$/, '')}${path}`;
}

async function createIntelligenceUser(input: {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}) {
  const tempPassword = randomGenerator(24);
  const sessionCode = randomGenerator(10);
  const baseData = {
    pidUser: `CUS${randomGenerator(10)}`,
    userFirstname: input.firstName || 'Subscriber',
    userLastname: input.lastName || '',
    userEmail: input.email,
    email: input.email,
    userPassword: bcrypt.hashSync(tempPassword, 8),
    userSession: bcrypt.hashSync(sessionCode, 8),
    userPhone: input.phone || null,
    phone: input.phone || null,
    userCid: 'PENDING_PAYMENT',
    loginStatus: 'RESET',
    userStatus: 'AL1',
    userAffiliateCode: randomGenerator(6),
    userAffiliateRef: 'supplier-intelligence',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await prisma.users.create({
        data: {
          ...baseData,
          pidUser: attempt === 0 ? baseData.pidUser : `CUS${randomGenerator(10)}`,
          userAffiliateCode: randomGenerator(6),
        },
      });
    } catch (error) {
      const existingUser = await prisma.users.findUnique({
        where: { userEmail: input.email },
      });
      if (existingUser) return existingUser;

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        continue;
      }

      throw error;
    }
  }

  throw new Error('Unable to create a unique Sure Imports account.');
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
  const plan = getIntelligencePlan(planKey);
  const paystackPlanCode = getPaystackPlanCode(plan.key);
  const authUser = await checkAuth();
  const email = String(body.email || authUser?.userEmail || '')
    .trim()
    .toLowerCase();
  const firstName = String(body.firstName || '').trim();
  const lastName = String(body.lastName || '').trim();
  const phone = String(body.phone || '').trim();

  if (!email || !email.includes('@')) {
    return NextResponse.json(
      { message: 'A valid email address is required.' },
      { status: 400 },
    );
  }

  let user = authUser
    ? await prisma.users.findUnique({ where: { pidUser: authUser.pidUser } })
    : await prisma.users.findUnique({ where: { userEmail: email } });

  if (!user) {
    user = await createIntelligenceUser({
      email,
      firstName,
      lastName,
      phone,
    });
  } else if (phone && !user.phone && !user.userPhone) {
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
  const reference = `SI_INTEL_${plan.key.toUpperCase()}_${Date.now()}_${randomGenerator(6)}`;
  const pidSubscription = `INTSUB${randomGenerator(12)}`;

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

  const response = await fetch('https://api.paystack.co/transaction/initialize', {
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
  });

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
