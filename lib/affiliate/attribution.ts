import 'server-only';

import { createHmac, hkdfSync, randomBytes, timingSafeEqual } from 'crypto';
import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export const ATTRIBUTION_COOKIE = 'sure_affiliate_attribution';
export const ATTRIBUTION_DAYS = 30;

type AttributionPayload = {
  referral: string;
  expiresAt: number;
};

type CustomerToken = {
  pidUser?: string;
  userEmail?: string;
};

function masterKey() {
  const encoded = process.env.AFFILIATE_SECURITY_KEY;
  if (!encoded) throw new Error('AFFILIATE_SECURITY_KEY is not configured');

  const key = Buffer.from(encoded, 'base64');
  if (key.length !== 32) {
    throw new Error('AFFILIATE_SECURITY_KEY must be a 32-byte base64 value');
  }
  return key;
}

function keyFor(purpose: string) {
  return Buffer.from(
    hkdfSync('sha256', masterKey(), Buffer.alloc(0), purpose, 32),
  );
}

function signature(value: string) {
  return createHmac('sha256', keyFor('affiliate-attribution-cookie-v1'))
    .update(value)
    .digest('base64url');
}

export function createAttributionValue(
  referral: string,
  expiresAt = Date.now() + ATTRIBUTION_DAYS * 24 * 60 * 60 * 1000,
) {
  const payload = Buffer.from(
    JSON.stringify({ referral, expiresAt } satisfies AttributionPayload),
  ).toString('base64url');
  return `v1.${payload}.${signature(payload)}`;
}

export function parseAttributionValue(
  value: string | undefined,
  now = Date.now(),
): AttributionPayload | null {
  if (!value) return null;
  const [version, encoded, suppliedSignature] = value.split('.');
  if (version !== 'v1' || !encoded || !suppliedSignature) return null;

  const expectedSignature = signature(encoded);
  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(expectedSignature);
  if (
    supplied.length !== expected.length ||
    !timingSafeEqual(supplied, expected)
  ) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(encoded, 'base64url').toString('utf8'),
    ) as AttributionPayload;
    if (
      typeof parsed.referral !== 'string' ||
      !parsed.referral.startsWith('aref_') ||
      typeof parsed.expiresAt !== 'number' ||
      parsed.expiresAt <= now
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function secureAffiliateFingerprint(value: string, purpose: string) {
  return createHmac('sha256', keyFor(purpose)).update(value).digest('hex');
}

export function affiliateEmailFingerprint(email: string) {
  return secureAffiliateFingerprint(
    email.trim().toLowerCase(),
    'affiliate-email-v1',
  );
}

export function visitorFingerprint(request: NextRequest) {
  const forwarded = request.headers
    .get('x-forwarded-for')
    ?.split(',')[0]
    ?.trim();
  const ip = forwarded || request.headers.get('x-real-ip') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  return secureAffiliateFingerprint(
    `${ip}\n${userAgent}`,
    'affiliate-attribution-visitor-v1',
  );
}

export function normalizeReferralCode(value: unknown) {
  if (typeof value !== 'string') return null;
  const code = value.trim().toUpperCase();
  return /^[A-Z0-9]{4,24}$/.test(code) ? code : null;
}

export function normalizeLandingPath(value: unknown) {
  if (typeof value !== 'string') return '/';
  const path = value.trim();
  if (!path.startsWith('/') || path.startsWith('//') || path.length > 500) {
    return '/';
  }
  return path.split('?')[0].split('#')[0] || '/';
}

export function normalizeReferralSource(value: unknown) {
  if (typeof value !== 'string') return null;
  const source = value.trim().replace(/[\u0000-\u001f\u007f]/g, '');
  return source ? source.slice(0, 255) : null;
}

export function customerEmailFromToken(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const secret = process.env.JWT_SECRET;
  if (!token || !secret) return null;

  try {
    const payload = jwt.verify(token, secret, {
      algorithms: ['HS256'],
      ignoreExpiration: false,
    }) as CustomerToken;
    return typeof payload.userEmail === 'string'
      ? payload.userEmail.trim().toLowerCase()
      : null;
  } catch {
    return null;
  }
}

/** Resolve a real customer from the signed session, never from tracking input. */
export async function customerFromAttributionSession(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const secret = process.env.JWT_SECRET;
  if (!token || !secret) return null;
  let payload: CustomerToken;
  try {
    payload = jwt.verify(token, secret, { algorithms: ['HS256'], ignoreExpiration: false }) as CustomerToken;
  } catch { return null; }
  if (!payload || typeof payload.pidUser !== 'string' || typeof payload.userEmail !== 'string') return null;
  const customer = await prisma.users.findUnique({
    where: { pidUser: payload.pidUser }, select: { pidUser: true, userEmail: true },
  });
  return customer && customer.userEmail.trim().toLowerCase() === payload.userEmail.trim().toLowerCase()
    ? customer : null;
}

export async function getAttributedReferral(request: NextRequest) {
  const payload = parseAttributionValue(
    request.cookies.get(ATTRIBUTION_COOKIE)?.value,
  );
  if (!payload) return null;

  const referral = await prisma.affiliate_referrals.findFirst({
    where: {
      pidReferral: payload.referral,
      affiliate: { status: 'ACTIVE' },
    },
    select: {
      id: true,
      pidReferral: true,
      affiliateId: true,
      affiliate: { select: { referralCode: true, emailHash: true } },
    },
  });
  return referral;
}

export async function resolveAffiliateReference(
  request: NextRequest,
  customerEmail?: string,
) {
  const referral = await getAttributedReferral(request);
  if (!referral) return 'NO_REF';

  const normalizedCustomerEmail = customerEmail?.trim().toLowerCase();
  if (
    normalizedCustomerEmail &&
    affiliateEmailFingerprint(normalizedCustomerEmail) ===
      referral.affiliate.emailHash
  ) {
    return 'NO_REF';
  }

  return referral.affiliate.referralCode;
}

export async function claimAffiliateAttribution(
  request: NextRequest,
  customerReference: string,
  customerEmail: string,
) {
  const payload = parseAttributionValue(request.cookies.get(ATTRIBUTION_COOKIE)?.value);
  return claimAffiliateReferralByReference(payload?.referral, customerReference, customerEmail);
}

export async function claimAffiliateReferralByReference(
  referralReference: string | null | undefined,
  customerReference: string,
  customerEmail: string,
) {
  const existingClaim = await prisma.affiliate_referrals.findUnique({
    where: { customerReference },
    select: {
      pidReferral: true,
      affiliateId: true,
      affiliate: { select: { referralCode: true } },
    },
  });
  if (existingClaim) {
    return {
      pidReferral: existingClaim.pidReferral,
      affiliateId: existingClaim.affiliateId,
      referralCode: existingClaim.affiliate.referralCode,
    };
  }

  if (!referralReference) return null;
  const referral = await prisma.affiliate_referrals.findFirst({
    where: {
      pidReferral: referralReference,
      customerReference: null,
      affiliate: { status: 'ACTIVE' },
    },
    select: {
      id: true,
      pidReferral: true,
      affiliateId: true,
      affiliate: {
        select: { referralCode: true, emailHash: true },
      },
    },
  });
  if (
    !referral ||
    affiliateEmailFingerprint(customerEmail) === referral.affiliate.emailHash
  ) {
    return null;
  }

  let claimed = { count: 0 };
  try {
    claimed = await prisma.affiliate_referrals.updateMany({
      where: { id: referral.id, customerReference: null },
      data: { customerReference, claimedAt: new Date() },
    });
  } catch (error) {
    // Another browser/tab may have established this customer's permanent owner.
    // The unique customerReference constraint is the final authority.
    if (!error || typeof error !== 'object' || !('code' in error) || error.code !== 'P2002') throw error;
  }
  if (claimed.count === 1) {
    return {
      pidReferral: referral.pidReferral,
      affiliateId: referral.affiliateId,
      referralCode: referral.affiliate.referralCode,
    };
  }

  const concurrentClaim = await prisma.affiliate_referrals.findUnique({
    where: { customerReference },
    select: {
      pidReferral: true,
      affiliateId: true,
      affiliate: { select: { referralCode: true } },
    },
  });
  return concurrentClaim
    ? {
        pidReferral: concurrentClaim.pidReferral,
        affiliateId: concurrentClaim.affiliateId,
        referralCode: concurrentClaim.affiliate.referralCode,
      }
    : null;
}

export function newReferralId() {
  return `aref_${randomBytes(18).toString('base64url')}`;
}
