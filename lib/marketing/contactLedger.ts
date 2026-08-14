import { randomUUID } from 'node:crypto';
import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';

export async function recordMarketingOptIn(input: {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  source: string;
  context?: Prisma.InputJsonValue;
}) {
  const email = input.email.trim().toLowerCase();
  const now = new Date();
  return prisma.marketing_contacts.upsert({
    where: { email },
    create: {
      pidContact: randomUUID(),
      email,
      firstName: input.firstName?.trim() || null,
      lastName: input.lastName?.trim() || null,
      status: 'ACTIVE',
      consentStatus: 'OPTED_IN',
      consentSource: input.source,
      consentContext: input.context,
      consentAt: now,
    },
    update: {
      firstName: input.firstName?.trim() || undefined,
      lastName: input.lastName?.trim() || undefined,
      status: 'ACTIVE',
      consentStatus: 'OPTED_IN',
      consentSource: input.source,
      consentContext: input.context,
      consentAt: now,
      unsubscribedAt: null,
    },
  });
}
