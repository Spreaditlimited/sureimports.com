import { randomInt, randomUUID } from 'node:crypto';
import { prisma } from '@/lib/prisma';
import { currentUser } from '@/lib/auth/current-user';
import { normalizeAccountCountry } from '@/lib/features/country';
import { payoutProfileSchema, validatePayoutCountry, maskedPayout } from '@/lib/payouts/profile';
import { protectRefundDestination, readRefundDestination } from '@/lib/refunds/destination';
import { codeDigest } from '@/lib/banking/verification';
import xMail from '@/lib/email/xMail';
type Row = { destinationCiphertext: string | null; country: string | null; revision: number; challengeJson: string | null };
type Challenge = { nonce: string; hash: string; ciphertext: string; country: string; expiresAt: number; issuedAt: number; attempts: number; windowAt: number; sends: number };
const noStore = { 'Cache-Control': 'no-store' };
export async function GET() {
  const user = await currentUser();
  if (!user) return Response.json({ message: 'Please sign in.' }, { status: 401 });
  try {
    const [row] = await prisma.$queryRaw<Row[]>`SELECT destinationCiphertext,country,revision,challengeJson FROM customer_payout_profiles WHERE pidUser=${user.pidUser}`;
    const owner = await prisma.users.findUnique({ where: { pidUser: user.pidUser }, select: { country: true } });
    const country = normalizeAccountCountry(owner?.country);
    if (!row?.destinationCiphertext) return Response.json({ profile: null }, { headers: noStore });
    const profile = payoutProfileSchema.parse(readRefundDestination(row.destinationCiphertext, `payout-profile:${user.pidUser}`));
    return Response.json({ profile: { method: profile.method, summary: maskedPayout(profile), country: row.country, needsUpdate: row.country !== country }, revision: row.revision }, { headers: noStore });
  } catch { return Response.json({ message: 'Payout details are temporarily unavailable. Please try again later.' }, { status: 503, headers: noStore }); }
}
export async function POST(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin || request.headers.get('sec-fetch-site') === 'cross-site') return Response.json({ message: 'Invalid origin.' }, { status: 403 });
  const user = await currentUser();
  if (!user) return Response.json({ message: 'Please sign in.' }, { status: 401 });
  let nonce: string | undefined;
  try {
    const text = await request.text();
    if (text.length > 4000) return Response.json({ message: 'Details are too long.' }, { status: 413 });
    const body = JSON.parse(text);
    if (body.action === 'confirm') {
      if (!/^\d{6}$/.test(body.code || '')) return Response.json({ message: 'Enter the six-digit code.' }, { status: 400 });
      const result = await prisma.$transaction(async tx => {
        const [owner] = await tx.$queryRaw<{ country: string | null }[]>`SELECT country FROM users WHERE pidUser=${user.pidUser} FOR UPDATE`;
        const [row] = await tx.$queryRaw<Row[]>`SELECT destinationCiphertext,country,revision,challengeJson FROM customer_payout_profiles WHERE pidUser=${user.pidUser} FOR UPDATE`;
        const c: Challenge | null = row?.challengeJson ? JSON.parse(row.challengeJson) : null;
        if (!c || c.attempts >= 5 || c.expiresAt < Date.now() || c.country !== normalizeAccountCountry(owner?.country)) return false;
        c.attempts++;
        if (codeDigest(user.pidUser, c.nonce, body.code) !== c.hash) {
          await tx.$executeRaw`UPDATE customer_payout_profiles SET challengeJson=${JSON.stringify(c)} WHERE pidUser=${user.pidUser}`;
          return false;
        }
        // Keep resend limits, consume the challenge, and never alter Nigerian bank records.
        c.attempts = 5;
        await tx.$executeRaw`UPDATE customer_payout_profiles SET destinationCiphertext=${c.ciphertext},country=${c.country},revision=revision+1,challengeJson=${JSON.stringify(c)},updatedAt=NOW(3) WHERE pidUser=${user.pidUser}`;
        return true;
      });
      return Response.json({ message: result ? 'Payout details saved. Your team will review them before payment.' : 'Code is invalid or expired. Check the code or request a new one.' }, { status: result ? 200 : 400 });
    }
    if (body.action !== 'request-code') return Response.json({ message: 'Invalid action.' }, { status: 400 });
    const profile = payoutProfileSchema.parse(body.profile);
    const owner = await prisma.users.findUnique({ where: { pidUser: user.pidUser }, select: { country: true } });
    const country = normalizeAccountCountry(owner?.country);
    validatePayoutCountry(profile, country);
    const ciphertext = protectRefundDestination(profile, `payout-profile:${user.pidUser}`);
    const code = String(randomInt(100000,1000000));
    nonce = randomUUID();
    const issuedNonce = nonce;
    const allowed = await prisma.$transaction(async tx => {
      await tx.$executeRaw`INSERT IGNORE INTO customer_payout_profiles (pidUser) VALUES (${user.pidUser})`;
      const [row] = await tx.$queryRaw<Row[]>`SELECT destinationCiphertext,country,revision,challengeJson FROM customer_payout_profiles WHERE pidUser=${user.pidUser} FOR UPDATE`;
      const old: Challenge | null = row.challengeJson ? JSON.parse(row.challengeJson) : null;
      const now = Date.now();
      if (old && (now - old.issuedAt < 60000 || (now - old.windowAt < 3600000 && old.sends >= 5))) return false;
      const c: Challenge = { nonce: issuedNonce, hash: codeDigest(user.pidUser, issuedNonce, code), ciphertext, country: country!, issuedAt: now, expiresAt: now+600000, attempts: 0, windowAt: old && now-old.windowAt<3600000 ? old.windowAt : now, sends: old && now-old.windowAt<3600000 ? old.sends+1 : 1 };
      await tx.$executeRaw`UPDATE customer_payout_profiles SET challengeJson=${JSON.stringify(c)} WHERE pidUser=${user.pidUser}`;
      return true;
    });
    if (!allowed) return Response.json({ message: 'Please wait before requesting another code. Maximum five codes per hour.' }, { status: 429 });
    await xMail({ xEmail: user.userEmail, xTitle: 'Confirm your payout details', xBody1: `Your confirmation code is <strong>${code}</strong>. It expires in 10 minutes.`, xBody2: 'This confirms a change to your saved refund and payout destination. If you did not request this change, do not share this code.' });
    return Response.json({ message: 'Code sent to your account email.' });
  } catch {
    if (nonce) {
      await prisma.$transaction(async tx => {
        const [row] = await tx.$queryRaw<Row[]>`SELECT destinationCiphertext,country,revision,challengeJson FROM customer_payout_profiles WHERE pidUser=${user.pidUser} FOR UPDATE`;
        const c: Challenge | null = row?.challengeJson ? JSON.parse(row.challengeJson) : null;
        if (c && c.nonce === nonce) { c.attempts=5; await tx.$executeRaw`UPDATE customer_payout_profiles SET challengeJson=${JSON.stringify(c)} WHERE pidUser=${user.pidUser}`; }
      }).catch(() => undefined);
    }
    return Response.json({ message: 'Unable to save payout details. Check your details and try again later.' }, { status: 400 });
  }
}
