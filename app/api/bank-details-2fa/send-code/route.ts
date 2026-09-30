import { randomInt, randomUUID } from 'node:crypto';
import { prisma } from '@/lib/prisma';
import xMail from '@/lib/email/xMail';
import {
  bankSession,
  bankResponse,
  submittedBank,
} from '@/lib/banking/request';
import {
  codeDigest,
  readChallenge,
  type BankChallenge,
} from '@/lib/banking/verification';
export async function POST(request: Request) {
  const user = await bankSession(request);
  if (!user)
    return bankResponse('Sign in and refresh this page.', 'UNAUTHORIZED', 401);
  let saved: string | undefined;
  try {
    const { bankCode, accountNumber } = submittedBank(await request.formData());
    const code = String(randomInt(100000, 1000000));
    const outcome = await prisma.$transaction(async (tx) => {
      const [row] = await tx.$queryRaw<
        { userExt2: string | null }[]
      >`SELECT userExt2 FROM users WHERE pidUser=${user.pidUser} FOR UPDATE`;
      if (!row) throw new Error('Profile not found.');
      const old = readChallenge(row.userExt2),
        now = Date.now();
      if (
        old &&
        (now - old.issuedAt < 60000 ||
          (now - old.windowAt < 3600000 && old.sends >= 5))
      )
        return false;
      const nonce = randomUUID();
      const c: BankChallenge = {
        purpose: 'bank_details_update',
        version: 2,
        nonce,
        hash: codeDigest(user.pidUser, nonce, code),
        issuedAt: now,
        expiresAt: now + 600000,
        attempts: 0,
        bankCode,
        accountNumber,
        windowAt: old && now - old.windowAt < 3600000 ? old.windowAt : now,
        sends: old && now - old.windowAt < 3600000 ? old.sends + 1 : 1,
      };
      saved = JSON.stringify(c);
      await tx.users.update({
        where: { pidUser: user.pidUser },
        data: { userExt2: saved },
      });
      return true;
    });
    if (!outcome)
      return bankResponse(
        'Please wait before requesting another code. At most five codes may be requested per hour.',
        'RATE_LIMITED',
        429,
      );
    try {
      await xMail({
        xEmail: user.userEmail,
        xTitle: 'Verify your bank details change',
        xBody1: `Your verification code is <strong>${code}</strong>. It expires in 10 minutes.`,
        xBody2: `This code authorises the account ending ${accountNumber.slice(-4)}. If you did not request this change, do not share this code.`,
      });
    } catch {
      // Invalidate only this challenge; retain resend limits and never erase a newer one.
      const failed = { ...readChallenge(saved!)!, attempts: 5 };
      await prisma.users.updateMany({
        where: { pidUser: user.pidUser, userExt2: saved },
        data: { userExt2: JSON.stringify(failed) },
      });
      return bankResponse(
        'We could not send the verification email. Please try again shortly.',
        'EMAIL_FAILED',
        503,
      );
    }
    return bankResponse(
      'Verification code sent to your profile email.',
      'CODE_SENT',
      200,
    );
  } catch {
    return bankResponse(
      'Unable to send a code. Check the bank details and try again.',
      'CODE_FAILED',
      400,
    );
  }
}
