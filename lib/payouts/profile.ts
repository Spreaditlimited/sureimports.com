import { z } from 'zod';
const common = { accountName: z.string().trim().min(2).max(120), confirmedOwnAccount: z.literal(true) };
export const payoutProfileSchema = z.discriminatedUnion('method', [
  z.object({ ...common, method: z.literal('PAYPAL_MANUAL'), paypalEmail: z.string().trim().email().max(254).transform(v => v.toLowerCase()) }).strict(),
  z.object({ ...common, method: z.literal('UK_BANK'), bankName: z.string().trim().min(2).max(120), accountNumber: z.string().regex(/^\d{8}$/), bankCode: z.string().transform(v => v.replace(/[- ]/g, '')).pipe(z.string().regex(/^\d{6}$/)) }).strict(),
]);
export type PayoutProfile = z.infer<typeof payoutProfileSchema>;
export function validatePayoutCountry(profile: PayoutProfile, country: string | null) {
  if (!country || country === 'Nigeria') throw Error('International payout details are not available for this profile.');
  if (profile.method === 'UK_BANK' && country !== 'United Kingdom') throw Error('UK bank details are available for UK customers.');
}
export function maskedPayout(profile: PayoutProfile) {
  return profile.method === 'PAYPAL_MANUAL'
    ? `PayPal · ${profile.paypalEmail[0]}•••@${profile.paypalEmail.split('@')[1]}`
    : `${profile.bankName} · account ending ${profile.accountNumber.slice(-4)}`;
}
