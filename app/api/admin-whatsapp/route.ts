import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';

const fallbackContacts = [
  {
    id: 'general',
    label: 'General Enquiries',
    description: 'Sales, sourcing, shipping, and account support',
    messageId: 'CUR7YKW3K3RBA1',
    defaultMessage: null,
  },
];

export async function GET() {
  try {
    const contacts = await prisma.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
      SELECT
        pidContact,
        label,
        description,
        phone,
        messageId,
        defaultMessage
      FROM admin_whatsapp_contacts
      WHERE isActive = true
      ORDER BY displayOrder ASC, createdAt ASC
    `);

    const data = contacts
      .map((contact) => ({
        id: String(contact.pidContact || ''),
        label: String(contact.label || ''),
        description: contact.description ? String(contact.description) : undefined,
        phone: contact.phone ? String(contact.phone) : undefined,
        messageId: contact.messageId ? String(contact.messageId) : undefined,
        defaultMessage: contact.defaultMessage ? String(contact.defaultMessage) : undefined,
      }))
      .filter((contact) => contact.id && contact.label && (contact.phone || contact.messageId));

    return NextResponse.json({
      statusx: 'SUCCESS',
      data: data.length ? data : fallbackContacts,
    });
  } catch (error: any) {
    return NextResponse.json({
      statusx: 'SUCCESS',
      data: fallbackContacts,
      fallback: true,
      error: error?.message || 'WhatsApp contacts table unavailable',
    });
  }
}
