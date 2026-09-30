import { prisma } from '@/lib/prisma';
import xMail from '@/lib/email/xMail';
import {
  bankSession,
  bankResponse,
  submittedBank,
} from '@/lib/banking/request';
import {
  bankFingerprint,
  challengeMatches,
  readChallenge,
  validateBank,
} from '@/lib/banking/verification';
export async function POST(request: Request) {
  const user = await bankSession(request);
  if (!user)
    return bankResponse('Sign in and refresh this page.', 'UNAUTHORIZED', 401);
  try {
    const form = await request.formData(),
      { bankCode, accountNumber } = submittedBank(form);
    const code = String(form.get('verificationCode') || '').trim();
    // Every attempt is committed under the user lock, including incorrect codes.
    const reserved = await prisma.$transaction(async (tx) => {
      const [row] = await tx.$queryRaw<
        { userExt2: string | null }[]
      >`SELECT userExt2 FROM users WHERE pidUser=${user.pidUser} FOR UPDATE`;
      const c = readChallenge(row?.userExt2 ?? null);
      if (!c || c.attempts >= 5 || c.expiresAt <= Date.now()) return null;
      const matches = challengeMatches(
        c,
        user.pidUser,
        code,
        bankCode,
        accountNumber,
      );
      const next = JSON.stringify({ ...c, attempts: c.attempts + 1 });
      await tx.users.update({
        where: { pidUser: user.pidUser },
        data: { userExt2: next },
      });
      return matches ? next : null;
    });
    if (!reserved)
      return bankResponse(
        'Invalid, expired or exhausted verification code. Request a new code if needed.',
        'INVALID_CODE',
      );
    // No profile write occurs unless both server-side Paystack calls succeed.
    const bank = await validateBank(bankCode, accountNumber);
    await prisma.$transaction(async (tx) => {
      const [row] = await tx.$queryRaw<
        { userExt2: string | null }[]
      >`SELECT userExt2 FROM users WHERE pidUser=${user.pidUser} FOR UPDATE`;
      if (
        row?.userExt2 !== reserved ||
        readChallenge(reserved)!.expiresAt <= Date.now()
      )
        throw new Error('Verification changed or expired. Please retry.');
      const pending = await tx.$queryRaw<
        { orderId: string }[]
      >`SELECT p.orderId FROM vehicle_payment_plans p JOIN vehicle_orders o ON o.id=p.orderId WHERE o.pidUser=${user.pidUser} AND p.status='REFUND_PENDING' LIMIT 1`;
      if (pending.length)
        throw new Error(
          'A vehicle refund is awaiting transfer to your verified account. Contact finance before changing bank details.',
        );
      const fingerprint = bankFingerprint(bank);
      await tx.users.update({
        where: { pidUser: user.pidUser },
        data: {
          ...bank,
          userExt2: JSON.stringify({
            ...readChallenge(reserved)!,
            attempts: 5,
          }),
          updatedAt: new Date(),
        },
      });
      await tx.$executeRaw`INSERT INTO bank_profile_verifications (pidUser,fingerprint,verifiedAt,method) VALUES (${user.pidUser},${fingerprint},NOW(3),'EMAIL_OTP_PAYSTACK') ON DUPLICATE KEY UPDATE fingerprint=VALUES(fingerprint),verifiedAt=VALUES(verifiedAt),method=VALUES(method)`;
    });
    try {
      await xMail({
        xEmail: user.userEmail,
        xTitle: 'Bank details updated',
        xBody1: `Your bank account ending ${accountNumber.slice(-4)} was validated with Paystack and saved after email verification.`,
        xBody2:
          'If you did not make this change, contact Sure Imports support immediately.',
      });
    } catch {
      console.error('Bank-change confirmation email failed.');
    }
    return bankResponse(
      'Bank details verified and updated successfully.',
      'ACTION_SUCCESSFUL',
      200,
    );
  } catch (error) {
    const message =
      error instanceof Error &&
      !('code' in error) &&
      !['TypeError', 'TimeoutError', 'AbortError'].includes(error.name)
        ? error.message
        : 'Unable to verify and save bank details. No changes were saved; please retry.';
    return bankResponse(message, 'UPDATE_FAILED', 400);
  }
}
