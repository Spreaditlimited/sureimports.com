import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { Prisma } from '@prisma/client';

import xMail2 from '@/lib/email/xMail2';
import { prisma } from '@/lib/prisma';

const OPT_IN_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const OPT_IN_RESEND_COOLDOWN_MS = 60 * 1000;
export const MARKETING_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function tokenHash(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

function publicRootUrl() {
  return (process.env.ROOT_URL || 'https://www.sureimports.com').replace(
    /\/$/,
    '',
  );
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[char] || char,
  );
}

export async function requestMarketingOptIn(input: {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  source: string;
  context?: Prisma.InputJsonValue;
}) {
  const email = input.email.trim().toLowerCase();
  const existing = await prisma.marketing_contacts.findUnique({
    where: { email },
  });
  if (existing?.consentStatus === 'OPTED_IN') {
    return {
      contact: existing,
      status: 'ALREADY_CONFIRMED' as const,
      confirmationSent: false,
    };
  }

  const token = randomBytes(32).toString('hex');
  const now = new Date();
  const expiresAt = new Date(now.getTime() + OPT_IN_TTL_MS);
  const contact = await prisma.marketing_contacts.upsert({
    where: { email },
    create: {
      pidContact: randomUUID(),
      email,
      firstName: input.firstName?.trim() || null,
      lastName: input.lastName?.trim() || null,
      status: 'ACTIVE',
      consentStatus: 'PENDING_CONFIRMATION',
      consentSource: input.source,
      consentContext: input.context,
      consentAt: null,
      optInTokenHash: tokenHash(token),
      optInRequestedAt: now,
      optInExpiresAt: expiresAt,
    },
    update: {
      firstName: input.firstName?.trim() || undefined,
      lastName: input.lastName?.trim() || undefined,
      status: 'ACTIVE',
      consentStatus: 'PENDING_CONFIRMATION',
      consentSource: input.source,
      consentContext: input.context,
      consentAt: null,
      optInTokenHash: tokenHash(token),
      optInRequestedAt: now,
      optInExpiresAt: expiresAt,
      unsubscribedAt: null,
    },
  });

  const confirmationUrl = `${publicRootUrl()}/api/marketing/confirm?token=${encodeURIComponent(token)}`;
  const greeting = input.firstName?.trim()
    ? `Hello ${escapeHtml(input.firstName.trim())},`
    : 'Hello,';
  await xMail2({
    xEmail: email,
    xTitle: 'Confirm your Sure Imports email updates',
    xBodyTitle: 'Would you like to receive our practical import emails?',
    xBody1:
      `${greeting}<br /><br />` +
      'You recently registered with Sure Imports or requested one of our resources. ' +
      'We would like to send you practical guidance about buying from China, supplier checks, shipping and import decisions.<br /><br />' +
      '<b>We will only send these emails if you confirm below.</b> If you do not want them, simply ignore this message and nothing further will be sent.',
    xBody2: 'This confirmation link expires in 7 days.',
    xButtonTitle: 'Confirm email updates',
    xButtonLink: confirmationUrl,
    throwOnError: true,
  });

  return {
    contact,
    status: 'PENDING_CONFIRMATION' as const,
    confirmationSent: true,
  };
}

export async function confirmMarketingOptIn(token: string) {
  if (!/^[a-f0-9]{64}$/i.test(token)) return 'INVALID' as const;
  const contact = await prisma.marketing_contacts.findUnique({
    where: { optInTokenHash: tokenHash(token) },
  });
  if (!contact) return 'INVALID' as const;
  if (contact.optInExpiresAt && contact.optInExpiresAt < new Date()) {
    await prisma.marketing_contacts.update({
      where: { id: contact.id },
      data: { consentStatus: 'CONFIRMATION_EXPIRED', optInTokenHash: null },
    });
    return 'EXPIRED' as const;
  }
  if (contact.consentStatus === 'OPTED_IN') return 'CONFIRMED' as const;

  await prisma.marketing_contacts.update({
    where: { id: contact.id },
    data: {
      status: 'ACTIVE',
      consentStatus: 'OPTED_IN',
      consentAt: new Date(),
      unsubscribedAt: null,
    },
  });
  return 'CONFIRMED' as const;
}

export async function resendMarketingOptInConfirmation(emailInput: string) {
  const email = emailInput.trim().toLowerCase();
  if (!MARKETING_EMAIL_PATTERN.test(email)) return 'INVALID_EMAIL' as const;

  const existing = await prisma.marketing_contacts.findUnique({
    where: { email },
  });

  if (existing?.consentStatus === 'OPTED_IN') {
    return 'NOT_REQUIRED' as const;
  }

  if (existing?.bouncedAt || existing?.complainedAt) {
    return 'NOT_ELIGIBLE' as const;
  }

  if (
    existing?.optInRequestedAt &&
    existing.optInRequestedAt.getTime() > Date.now() - OPT_IN_RESEND_COOLDOWN_MS
  ) {
    return 'TOO_SOON' as const;
  }

  await requestMarketingOptIn({
    email,
    firstName: existing?.firstName,
    lastName: existing?.lastName,
    source: 'confirmation_resubmission',
    context: {
      requestedFrom: 'email_preferences_confirmation_page',
      previousConsentStatus: existing?.consentStatus || null,
    },
  });

  return 'SENT' as const;
}
