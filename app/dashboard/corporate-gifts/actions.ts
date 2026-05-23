'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { checkAuth } from '@/lib/auth/checkAuth';
import {
  CORPORATE_GIFT_STATUSES,
  notifyCustomerCorporateGiftStatus,
  type CorporateGiftStatus,
} from '@/lib/notifications/corporateGifts';

const STATUS_SET = new Set<string>(CORPORATE_GIFT_STATUSES);

export async function updateCorporateGiftRequestAction(formData: FormData) {
  const pidRequest = String(formData.get('pidRequest') || '');
  const status = String(formData.get('status') || '');

  if (!pidRequest || !STATUS_SET.has(status)) {
    throw new Error('Invalid request payload');
  }

  const currentUser = await checkAuth();
  if (!currentUser) {
    throw new Error('Unauthorized');
  }

  const existing = await prisma.corporate_gift_request.findUnique({
    where: { pidRequest },
  });

  if (!existing) {
    throw new Error('Request not found');
  }

  const updated = await prisma.corporate_gift_request.update({
    where: { pidRequest },
    data: {
      status,
      handledByPidUser: currentUser.pidUser,
      handledByEmail: currentUser.userEmail,
      handledByName: currentUser.userEmail,
    },
  });

  if (existing.status !== status) {
    await notifyCustomerCorporateGiftStatus({
      requestId: updated.pidRequest,
      businessName: updated.businessName,
      contactPersonFullName: updated.contactPersonFullName,
      contactEmail: updated.contactEmail,
      whatsappNumber: updated.whatsappNumber,
      status: status as CorporateGiftStatus,
      handledByName: updated.handledByName,
    });
  }

  revalidatePath('/dashboard/corporate-gifts');
}

export async function assignCorporateGiftRequestAction(formData: FormData) {
  const pidRequest = String(formData.get('pidRequest') || '');
  if (!pidRequest) throw new Error('Invalid request id');

  const currentUser = await checkAuth();
  if (!currentUser) throw new Error('Unauthorized');

  await prisma.corporate_gift_request.update({
    where: { pidRequest },
    data: {
      handledByPidUser: currentUser.pidUser,
      handledByEmail: currentUser.userEmail,
      handledByName: currentUser.userEmail,
    },
  });

  revalidatePath('/dashboard/corporate-gifts');
}
