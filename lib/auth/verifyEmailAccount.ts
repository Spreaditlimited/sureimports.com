import { after, NextRequest, NextResponse } from 'next/server';

import { getEmailVerificationLinkStatus } from '@/lib/auth/emailVerificationPolicy';
import { prisma } from '@/lib/prisma';
import { requestMarketingOptIn } from '@/lib/marketing/contactLedger';
import { belongsToSesMarketing } from '@/lib/marketing/cutover';

function authRedirect(
  request: NextRequest,
  pathname: string,
  params?: Record<string, string>,
) {
  const url = new URL(pathname, request.url);
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });
  return NextResponse.redirect(url);
}

export async function verifyEmailAccount(
  request: NextRequest,
  flodeskSegmentId: string,
) {
  const pidUser = request.nextUrl.searchParams.get('pidUser')?.trim() || '';
  const cid = request.nextUrl.searchParams.get('cid')?.trim() || '';

  if (!pidUser || !cid) {
    return authRedirect(request, '/auth/account-not-activated');
  }

  const user = await prisma.users.findUnique({ where: { pidUser } });
  if (!user) {
    return authRedirect(request, '/auth/account-not-activated');
  }

  const linkStatus = getEmailVerificationLinkStatus(user.userCid, cid);

  // Verification links are idempotent: reopening a link for an account that is
  // already verified must remain a success, even though its original CID has
  // been replaced with the VERIFIED marker.
  if (linkStatus === 'already_verified') {
    return authRedirect(request, '/auth/account-verification-success');
  }

  if (linkStatus === 'invalid') {
    return authRedirect(request, '/auth/account-not-activated', {
      email: user.userEmail,
    });
  }

  const verification = await prisma.users.updateMany({
    where: { pidUser, userCid: cid },
    data: { userCid: 'VERIFIED' },
  });

  if (verification.count === 0) {
    const latestUser = await prisma.users.findUnique({
      where: { pidUser },
      select: { userCid: true },
    });
    if (latestUser?.userCid === 'VERIFIED') {
      return authRedirect(request, '/auth/account-verification-success');
    }
    return authRedirect(request, '/auth/account-not-activated', {
      email: user.userEmail,
    });
  }

  after(async () => {
    if (belongsToSesMarketing(user.createdAt)) {
      try {
        await requestMarketingOptIn({
          email: user.userEmail,
          firstName: user.userFirstname,
          lastName: user.userLastname,
          source: 'verified_account_after_ses_cutover',
          context: { pidUser: user.pidUser, channelOwner: 'SES' },
        });
      } catch (error) {
        console.error(
          'Unable to add verified user to the SES marketing ledger:',
          error,
        );
      }
      return;
    }

    try {
      await fetch('https://api.flodesk.com/v1/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(`${process.env.FLODESK_API_KEY}:`).toString('base64')}`,
          'User-Agent': 'Sure Imports (www.sureimports.com)',
        },
        body: JSON.stringify({
          email: user.userEmail,
          first_name: user.userFirstname,
          last_name: user.userLastname,
          segment_ids: [flodeskSegmentId],
        }),
      });
    } catch (error) {
      console.error('Unable to add verified user to Flodesk:', error);
    }
  });

  return authRedirect(request, '/auth/account-verification-success');
}
