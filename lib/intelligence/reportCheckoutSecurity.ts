import { createHmac } from 'node:crypto';

import { prisma } from '@/lib/prisma';

export const REPORT_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function rateLimitSecret() {
  return (
    process.env.REPORT_CHECKOUT_HASH_SECRET ||
    process.env.CRON_SECRET ||
    process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY ||
    'sureimports-report-checkout'
  );
}

function hashScope(scope: string) {
  return createHmac('sha256', rateLimitSecret()).update(scope).digest('hex');
}

function bucketStart(windowMinutes: number) {
  const windowMs = windowMinutes * 60 * 1000;
  return new Date(Math.floor(Date.now() / windowMs) * windowMs);
}

async function incrementScope(scope: string, windowMinutes: number) {
  const scopeHash = hashScope(scope);
  const start = bucketStart(windowMinutes);
  const row = await prisma.intelligence_report_checkout_rate_limits.upsert({
    where: {
      scopeHash_bucketStart: { scopeHash, bucketStart: start },
    },
    create: { scopeHash, bucketStart: start, attempts: 1 },
    update: { attempts: { increment: 1 }, updatedAt: new Date() },
    select: { attempts: true },
  });
  return row.attempts;
}

export function checkoutRequestIp(request: Request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip')?.trim() ||
    'unknown'
  );
}

export function checkoutOriginIsAllowed(request: Request) {
  if (process.env.NODE_ENV !== 'production') return true;
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export function checkoutReturnUrl(request: Request, path: string) {
  const base =
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.NEXT_PUBLIC_BASE_URL ||
        'https://www.sureimports.com'
      : new URL(request.url).origin;
  return `${base.replace(/\/$/, '')}${path}`;
}

export async function enforceReportCheckoutRateLimit(input: {
  request: Request;
  email: string;
}) {
  const ip = checkoutRequestIp(input.request);
  const [ipAttempts, emailAttempts] = await Promise.all([
    incrementScope(`ip:${ip}`, 15),
    incrementScope(`email:${input.email}`, 30),
  ]);
  return {
    allowed: ipAttempts <= 12 && emailAttempts <= 8,
    retryAfterSeconds: ipAttempts > 12 ? 15 * 60 : 30 * 60,
  };
}

export async function pruneReportCheckoutRateLimits() {
  return prisma.intelligence_report_checkout_rate_limits.deleteMany({
    where: {
      updatedAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
  });
}
