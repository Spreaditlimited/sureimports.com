import bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';
import { Prisma } from '@prisma/client';

import randomGenerator from '@/lib/helpers/randomGenerator';
import { sendMail } from '@/lib/mail';
import { requestMarketingOptIn } from '@/lib/marketing/contactLedger';
import { belongsToSesMarketing } from '@/lib/marketing/cutover';
import { prisma } from '@/lib/prisma';

type ResolvePublicAccountInput = {
  authenticatedPidUser?: string | null;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  country?: string;
  affiliateRef: string;
  defaultFirstName?: string;
  accountSetupKey?: string;
};

type PublicUser = NonNullable<
  Awaited<ReturnType<typeof prisma.users.findUnique>>
>;

export type PublicAccountResolution =
  | {
      status: 'ready';
      user: PublicUser;
      createdNewAccount: boolean;
    }
  | { status: 'login_required' };

function siteUrl(path: string) {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    'https://www.sureimports.com';
  return `${base.replace(/\/$/, '')}${path}`;
}

export async function sendPublicAccountSetupEmail(input: {
  user: PublicUser;
  context: string;
}) {
  const { user } = input;
  if (!user.cidStatus || !user.loginStamp || !user.loginKey) return;
  const setupUrl = siteUrl(
    `/auth/password-reset-link?pidUser=${encodeURIComponent(user.pidUser)}&resetCode=${encodeURIComponent(user.cidStatus)}`,
  );
  await sendMail({
    to: user.userEmail,
    name: user.userFirstname || 'Customer',
    subject: 'Set up your Sure Imports account',
    bodyTitle: 'Your Sure Imports account is ready',
    body: `<p>We created your Sure Imports account for ${input.context}.</p><p>Choose a secure password within 48 hours so you can return to your purchases and services at any time.</p>`,
    secondaryBody:
      '<p>Your checkout can continue independently while you complete your account setup.</p>',
    buttonTitle: 'Choose my password',
    buttonLink: setupUrl,
  });
}

export async function requestPublicAccountMarketingOptIn(input: {
  user: PublicUser;
  source: string;
  context: Prisma.InputJsonValue;
}) {
  if (!belongsToSesMarketing(input.user.createdAt)) {
    return { status: 'BEFORE_SES_CUTOVER' as const, confirmationSent: false };
  }

  return requestMarketingOptIn({
    email: input.user.userEmail,
    firstName: input.user.userFirstname,
    lastName: input.user.userLastname,
    source: input.source,
    context: input.context,
  });
}

/**
 * Resolves the customer account for every public Sure Imports entry flow.
 * Existing accounts are never claimed by an unauthenticated email submission.
 */
export async function resolvePublicAccount(
  input: ResolvePublicAccountInput,
): Promise<PublicAccountResolution> {
  if (input.authenticatedPidUser) {
    const authenticatedUser = await prisma.users.findUnique({
      where: { pidUser: input.authenticatedPidUser },
    });
    if (authenticatedUser) {
      return {
        status: 'ready',
        user: authenticatedUser,
        createdNewAccount: false,
      };
    }
  }

  const email = input.email.trim().toLowerCase();
  const existingUser = await prisma.users.findUnique({
    where: { userEmail: email },
  });
  if (existingUser) return { status: 'login_required' };

  const requiresSetup = Boolean(input.accountSetupKey);
  const setupToken = requiresSetup
    ? randomBytes(32).toString('base64url')
    : null;
  const setupExpiresAt = requiresSetup
    ? new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
    : null;

  const baseData = {
    pidUser: `CUS${randomGenerator(10)}`,
    userFirstname:
      input.firstName?.trim() || input.defaultFirstName || 'Customer',
    userLastname: input.lastName?.trim() || '',
    userEmail: email,
    email,
    userPassword: bcrypt.hashSync(randomBytes(24).toString('base64url'), 8),
    userSession: bcrypt.hashSync(randomBytes(16).toString('base64url'), 8),
    userPhone: input.phone?.trim() || null,
    phone: input.phone?.trim() || null,
    country: input.country?.trim() || null,
    userCountry: input.country?.trim() || null,
    userCid: requiresSetup ? 'PENDING' : 'VERIFIED',
    cidStatus: setupToken,
    loginStatus: requiresSetup ? 'RESET' : 'ACTIVE',
    loginKey: input.accountSetupKey || null,
    loginStamp: setupExpiresAt,
    userStatus: 'AL1',
    userAffiliateCode: randomGenerator(6),
    userAffiliateRef: input.affiliateRef,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const user = await prisma.users.create({
        data: {
          ...baseData,
          pidUser: attempt ? `CUS${randomGenerator(10)}` : baseData.pidUser,
          userAffiliateCode: randomGenerator(6),
        },
      });
      return { status: 'ready', user, createdNewAccount: true };
    } catch (error) {
      const concurrentUser = await prisma.users.findUnique({
        where: { userEmail: email },
      });
      if (concurrentUser) return { status: 'login_required' };
      if (
        !(error instanceof Prisma.PrismaClientKnownRequestError) ||
        error.code !== 'P2002'
      ) {
        throw error;
      }
    }
  }

  throw new Error('Unable to create a unique Sure Imports account.');
}
