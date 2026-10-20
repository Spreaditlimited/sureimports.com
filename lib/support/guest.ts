import 'server-only';
import { createHash, randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { SupportError, supportBrand } from './policy';

const cookieName =
  process.env.NODE_ENV === 'production' ? '__Host-si-support' : 'si-support';
const digest = (token: string) =>
  createHash('sha256').update(token).digest('hex');
export async function guestIdentity() {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const [guest] = await prisma.$queryRaw<
    Array<{ id: string }>
  >`SELECT id FROM support_guests WHERE tokenHash=${digest(token)} AND expiresAt>NOW(3) AND claimedBy IS NULL`;
  return guest
    ? { actor: { kind: 'GUEST' as const, id: guest.id, brand: supportBrand } }
    : null;
}
export async function createGuest() {
  const existing = await guestIdentity();
  if (existing) return;
  const token = randomBytes(32).toString('hex');
  const id = randomBytes(16).toString('hex');
  // Global allocation ceiling also bounds abuse from visitors rotating cookies.
  await prisma.$transaction(async (db) => {
    const key = digest('support-guest-session-allocation');
    await db.$executeRaw`INSERT INTO support_rate_limits (actorKey, windowStart, messageCount) VALUES (${key}, NOW(3), 0) ON DUPLICATE KEY UPDATE actorKey=${key}`;
    const [rate] = await db.$queryRaw<
      Array<{ messageCount: number; elapsed: number }>
    >`SELECT messageCount, TIMESTAMPDIFF(SECOND, windowStart, NOW(3)) AS elapsed FROM support_rate_limits WHERE actorKey=${key} FOR UPDATE`;
    if (rate.elapsed < 60 && rate.messageCount >= 60)
      throw new SupportError(
        429,
        'Chat is busy. Please try again shortly or use WhatsApp.',
      );
    await db.$executeRaw`UPDATE support_rate_limits SET messageCount=IF(TIMESTAMPDIFF(SECOND, windowStart, NOW(3))>=60,1,messageCount+1), windowStart=IF(TIMESTAMPDIFF(SECOND, windowStart, NOW(3))>=60,NOW(3),windowStart) WHERE actorKey=${key}`;
    await db.$executeRaw`INSERT INTO support_guests (id, tokenHash, expiresAt) VALUES (${id}, ${digest(token)}, DATE_ADD(NOW(3), INTERVAL 30 DAY))`;
  });
  (await cookies()).set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 86400,
  });
}
export async function claimGuest(customerId: string) {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return;
  await prisma.$transaction(async (db) => {
    const [guest] = await db.$queryRaw<
      Array<{ id: string; claimedBy: string | null }>
    >`SELECT id, claimedBy FROM support_guests WHERE tokenHash=${digest(token)} AND expiresAt>NOW(3) FOR UPDATE`;
    if (!guest || guest.claimedBy) return;
    await db.$executeRaw`UPDATE support_conversations SET customerId=${customerId}, ownerKind='CUSTOMER' WHERE customerId=${guest.id} AND ownerKind='GUEST' AND brand=${supportBrand}`;
    await db.$executeRaw`UPDATE support_guests SET claimedBy=${customerId} WHERE id=${guest.id}`;
  });
  (await cookies()).delete(cookieName);
}
