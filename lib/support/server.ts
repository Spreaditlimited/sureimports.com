import 'server-only';
import { prisma } from '@/lib/prisma';
import { currentUser } from '@/lib/auth/current-user';
import { guestIdentity, guestContact } from './guest';
import { supportBrand } from './policy';
import { supportStore } from './store';
import { supportEndpoints } from './http';

export async function customerIdentity() {
  const identity = await currentUser();
  if (!identity) return null;
  const user = await prisma.users.findUnique({
    where: { pidUser: identity.pidUser },
    select: {
      country: true,
      userStatus: true,
      userCid: true,
      loginStatus: true,
    },
  });
  if (
    !user ||
    user.userCid !== 'VERIFIED' ||
    (user.userStatus && user.userStatus !== 'AL1') ||
    ['TEMP_PASSWORD_UNUSED', 'TEMP_PASSWORD_USED'].includes(
      user.loginStatus || '',
    )
  )
    return null;
  return {
    actor: {
      kind: 'CUSTOMER' as const,
      id: identity.pidUser,
      brand: supportBrand,
    },
    country: user.country,
  };
}
async function supportIdentity(edit: boolean) {
  const customer = await customerIdentity();
  if (customer) return customer;
  const guest = await guestIdentity();
  if (guest && (!edit || (await guestContact()))) return guest;
  return null;
}
export const customerSupport = supportEndpoints(supportStore(prisma), supportIdentity);

import { attachmentEndpoints } from './attachment-http';
export const customerAttachments = attachmentEndpoints(prisma, async () => supportIdentity(true));
