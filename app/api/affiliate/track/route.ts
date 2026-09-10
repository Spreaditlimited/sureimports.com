import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import {
  ATTRIBUTION_COOKIE,
  affiliateEmailFingerprint,
  createAttributionValue,
  customerEmailFromToken,
  newReferralId,
  normalizeLandingPath,
  normalizeReferralCode,
  normalizeReferralSource,
  parseAttributionValue,
  visitorFingerprint,
} from '@/lib/affiliate/attribution';

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

function responseWithAttribution(
  request: NextRequest,
  pidReferral: string,
  expiresAt?: number,
) {
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
  return response;
}

export async function POST(request: NextRequest) {
  if (!requestIsSameOrigin(request)) {
    return NextResponse.json(
      { attributed: false },
      { status: 403, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const existingPayload = parseAttributionValue(
    request.cookies.get(ATTRIBUTION_COOKIE)?.value,
  );
  if (existingPayload) {
    const existing = await prisma.affiliate_referrals.findFirst({
      where: {
        pidReferral: existingPayload.referral,
        affiliate: { status: 'ACTIVE' },
      },
      select: { pidReferral: true },
    });
    if (existing) {
      await prisma.affiliate_referrals.update({
        where: { pidReferral: existing.pidReferral },
        data: { lastTouchAt: new Date() },
      });
      return responseWithAttribution(
        request,
        existing.pidReferral,
        existingPayload.expiresAt,
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
    select: { id: true, emailHash: true },
  });
  if (!affiliate) {
    return NextResponse.json(
      { attributed: false },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const customerEmail = customerEmailFromToken(request);
  if (
    customerEmail &&
    affiliateEmailFingerprint(customerEmail) === affiliate.emailHash
  ) {
    return NextResponse.json(
      { attributed: false },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const visitorHash = visitorFingerprint(request);
  const attributionWindowStart = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000,
  );
  const repeatVisit = await prisma.affiliate_referrals.findFirst({
    where: {
      affiliateId: affiliate.id,
      visitorHash,
      firstTouchAt: { gte: attributionWindowStart },
    },
    orderBy: { firstTouchAt: 'asc' },
    select: { pidReferral: true, firstTouchAt: true },
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
      expiresAt,
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

  return responseWithAttribution(request, referral.pidReferral);
}
