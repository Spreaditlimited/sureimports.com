import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import {
  ATTRIBUTION_COOKIE,
  affiliateEmailFingerprint,
  createAttributionValue,
  customerFromAttributionSession,
  claimAffiliateReferralByReference,
  newReferralId,
  normalizeLandingPath,
  normalizeReferralCode,
  normalizeReferralSource,
  parseAttributionValue,
  visitorFingerprint,
} from '@/lib/affiliate/attribution';
import {
  createLineScoutAttributionValue,
  LINESCOUT_ATTRIBUTION_COOKIE,
} from '@/lib/affiliate/linescoutAttribution';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const requestSchema = z.object({
  code: z.unknown(),
  landingPath: z.unknown().optional(),
  source: z.unknown().optional(),
});

function requestIsSameOrigin(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  try {
    return new URL(origin).host === request.nextUrl.host;
  } catch {
    return false;
  }
}

async function responseWithAttribution(
  request: NextRequest,
  pidReferral: string,
  referralCode: string,
  expiresAt?: number,
  customer?: { pidUser: string; userEmail: string } | null,
) {
  if (customer) {
    const claim = await claimAffiliateReferralByReference(pidReferral, customer.pidUser, customer.userEmail);
    if (!claim) return responseWithoutAttribution(request);
    // A simultaneous request may have won ownership; return that exact owner.
    pidReferral = claim.pidReferral;
    referralCode = claim.referralCode;
    await prisma.users.updateMany({
      where: { pidUser: customer.pidUser, OR: [{ userAffiliateRef: null }, { userAffiliateRef: { not: referralCode } }] },
      data: { userAffiliateRef: referralCode },
    });
  }
  const expiry = expiresAt ?? Date.now() + 30 * 24 * 60 * 60 * 1000;
  const response = NextResponse.json(
    { attributed: true },
    { headers: { 'Cache-Control': 'no-store' } },
  );
  const productionHost = request.nextUrl.hostname.endsWith('sureimports.com');
  response.cookies.set({
    name: ATTRIBUTION_COOKIE,
    value: createAttributionValue(pidReferral, expiry),
    httpOnly: true,
    secure: productionHost,
    sameSite: 'lax',
    path: '/',
    expires: new Date(expiry),
    ...(productionHost ? { domain: '.sureimports.com' } : {}),
  });
  response.cookies.set({
    name: LINESCOUT_ATTRIBUTION_COOKIE,
    value: createLineScoutAttributionValue(referralCode, expiry),
    httpOnly: true,
    secure: productionHost,
    sameSite: 'lax',
    path: '/',
    expires: new Date(expiry),
    ...(productionHost ? { domain: '.sureimports.com' } : {}),
  });
  return response;
}

function responseWithoutAttribution(request: NextRequest) {
  const response = NextResponse.json({ attributed: false }, { headers: { 'Cache-Control': 'no-store' } });
  const productionHost = request.nextUrl.hostname.endsWith('sureimports.com');
  for (const name of [ATTRIBUTION_COOKIE, LINESCOUT_ATTRIBUTION_COOKIE]) {
    response.cookies.set({ name, value: '', maxAge: 0, httpOnly: true, secure: productionHost, sameSite: 'lax', path: '/', ...(productionHost ? { domain: '.sureimports.com' } : {}) });
  }
  return response;
}

export async function POST(request: NextRequest) {
  if (!requestIsSameOrigin(request)) {
    return NextResponse.json(
      { attributed: false },
      { status: 403, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const customer = await customerFromAttributionSession(request);
  if (customer) {
    const owner = await prisma.affiliate_referrals.findUnique({
      where: { customerReference: customer.pidUser },
      select: { pidReferral: true, affiliate: { select: { referralCode: true, status: true } } },
    });
    // A new link or a stale cookie must never change permanent ownership.
    if (owner) return owner.affiliate.status === 'ACTIVE'
      ? responseWithAttribution(request, owner.pidReferral, owner.affiliate.referralCode, undefined, customer)
      : responseWithoutAttribution(request);
  }

  const existingPayload = parseAttributionValue(
    request.cookies.get(ATTRIBUTION_COOKIE)?.value,
  );
  if (existingPayload) {
    const existing = await prisma.affiliate_referrals.findFirst({
      where: {
        pidReferral: existingPayload.referral,
        ...(customer ? { customerReference: null, NOT: { affiliate: { emailHash: affiliateEmailFingerprint(customer.userEmail) } } } : {}),
        affiliate: { status: 'ACTIVE' },
      },
      select: {
        pidReferral: true,
        affiliate: { select: { referralCode: true } },
      },
    });
    if (existing) {
      await prisma.affiliate_referrals.update({
        where: { pidReferral: existing.pidReferral },
        data: { lastTouchAt: new Date() },
      });
      return responseWithAttribution(
        request,
        existing.pidReferral,
        existing.affiliate.referralCode,
        existingPayload.expiresAt,
        customer,
      );
    }
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = null;
  }
  const parsed = requestSchema.safeParse(body);
  const code = parsed.success ? normalizeReferralCode(parsed.data.code) : null;
  if (!parsed.success || !code) {
    return NextResponse.json(
      { attributed: false },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const affiliate = await prisma.affiliate_accounts.findFirst({
    where: { referralCode: code, status: 'ACTIVE' },
    select: { id: true, emailHash: true, referralCode: true },
  });
  if (!affiliate) {
    return NextResponse.json(
      { attributed: false },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const customerEmail = customer?.userEmail;
  if (
    customerEmail &&
    affiliateEmailFingerprint(customerEmail) === affiliate.emailHash
  ) {
    return responseWithoutAttribution(request);
  }

  const visitorHash = visitorFingerprint(request);
  const attributionWindowStart = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000,
  );
  const repeatVisit = await prisma.affiliate_referrals.findFirst({
    where: {
      affiliateId: affiliate.id,
      visitorHash,
      ...(customer ? { customerReference: null } : {}),
      firstTouchAt: { gte: attributionWindowStart },
    },
    orderBy: { firstTouchAt: 'asc' },
    select: {
      pidReferral: true,
      firstTouchAt: true,
      affiliate: { select: { referralCode: true } },
    },
  });
  if (repeatVisit) {
    await prisma.affiliate_referrals.update({
      where: { pidReferral: repeatVisit.pidReferral },
      data: { lastTouchAt: new Date() },
    });
    const expiresAt =
      repeatVisit.firstTouchAt.getTime() + 30 * 24 * 60 * 60 * 1000;
    return responseWithAttribution(
      request,
      repeatVisit.pidReferral,
      repeatVisit.affiliate.referralCode,
      expiresAt,
      customer,
    );
  }

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentAttributions = await prisma.affiliate_referrals.count({
    where: { visitorHash, firstTouchAt: { gte: oneHourAgo } },
  });
  if (recentAttributions >= 12) {
    return NextResponse.json(
      { attributed: false },
      { status: 429, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const referral = await prisma.affiliate_referrals.create({
    data: {
      pidReferral: newReferralId(),
      affiliateId: affiliate.id,
      visitorHash,
      landingPath: normalizeLandingPath(parsed.data.landingPath),
      source: normalizeReferralSource(parsed.data.source),
    },
    select: { pidReferral: true },
  });

  return responseWithAttribution(
    request,
    referral.pidReferral,
    affiliate.referralCode,
    undefined,
    customer,
  );
}
