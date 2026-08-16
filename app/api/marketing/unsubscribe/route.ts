import { NextRequest, NextResponse } from 'next/server';

import { readMarketingUnsubscribeToken } from '@/lib/marketing/unsubscribeToken';
import { prisma } from '@/lib/prisma';

async function unsubscribe(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')?.trim() || '';
  const identity = readMarketingUnsubscribeToken(token);
  if (!identity) return false;

  const contact = await prisma.marketing_contacts.findUnique({
    where: { pidContact: identity.pidContact },
    select: { id: true, email: true },
  });
  if (!contact || contact.email.trim().toLowerCase() !== identity.email) return false;

  const now = new Date();
  await prisma.$transaction([
    prisma.marketing_contacts.update({
      where: { id: contact.id },
      data: {
        status: 'UNSUBSCRIBED',
        consentStatus: 'OPTED_OUT',
        unsubscribedAt: now,
        optInTokenHash: null,
        optInExpiresAt: null,
      },
    }),
    prisma.marketing_enrollments.updateMany({
      where: { contactId: contact.id, status: { in: ['ACTIVE', 'SENDING'] } },
      data: { status: 'CANCELLED', nextSendAt: null },
    }),
  ]);
  return true;
}

export async function GET(request: NextRequest) {
  const success = await unsubscribe(request);
  const destination = new URL('/email-preferences/unsubscribed', request.url);
  destination.searchParams.set('status', success ? 'success' : 'invalid');
  return NextResponse.redirect(destination);
}

export async function POST(request: NextRequest) {
  const success = await unsubscribe(request);
  return NextResponse.json(
    { status: success ? 'unsubscribed' : 'invalid' },
    { status: success ? 200 : 400 },
  );
}
