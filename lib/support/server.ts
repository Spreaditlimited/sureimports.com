import 'server-only';
import { prisma } from '@/lib/prisma';
import { currentUser } from '@/lib/auth/current-user';
import { guestIdentity } from './guest';
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
export const customerSupport = supportEndpoints(
  supportStore(prisma),
  async () => (await customerIdentity()) || (await guestIdentity()),
);

import { attachmentEndpoints } from './attachment-http';
export const customerAttachments = attachmentEndpoints(prisma, async () => (await customerIdentity()) || (await guestIdentity()));
