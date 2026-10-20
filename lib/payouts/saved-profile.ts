import 'server-only';
import { prisma } from '@/lib/prisma';
import { readRefundDestination } from '@/lib/refunds/destination';
import { normalizeAccountCountry } from '@/lib/features/country';
import { payoutProfileSchema, validatePayoutCountry } from './profile';
export async function savedPayoutProfile(pidUser: string) {
  try {
    const [row] = await prisma.$queryRaw<{ destinationCiphertext: string | null; revision: number; country: string }[]>`SELECT destinationCiphertext,revision,country FROM customer_payout_profiles WHERE pidUser=${pidUser}`;
    if (!row?.destinationCiphertext) return null;
    const user = await prisma.users.findUnique({ where: { pidUser }, select: { country: true } });
    const country = normalizeAccountCountry(user?.country);
    if (row.country !== country) return null;
    const profile = payoutProfileSchema.parse(readRefundDestination(row.destinationCiphertext, `payout-profile:${pidUser}`));
    validatePayoutCountry(profile,country);
    return { profile, revision: row.revision, country };
  } catch (error) {
    if ((error as { meta?: { code?: string } }).meta?.code === '1146') return null;
    throw error;
  }
}
