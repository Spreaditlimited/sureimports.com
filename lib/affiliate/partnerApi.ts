import 'server-only';

import { createHash } from 'node:crypto';
import { prisma } from '@/lib/prisma';

export function apiKeyHash(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

export function stablePayloadHash(value: unknown): string {
  const normalize = (input: unknown): unknown => {
    if (Array.isArray(input)) return input.map(normalize);
    if (input && typeof input === 'object')
      return Object.fromEntries(
        Object.entries(input as Record<string, unknown>)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([key, entry]) => [key, normalize(entry)]),
      );
    return input;
  };
  return createHash('sha256')
    .update(JSON.stringify(normalize(value)))
    .digest('hex');
}

export async function authenticatePartnerApi(
  request: Request,
  requiredScope: 'shipping:write' | 'shipping:read',
) {
  const authorization = request.headers.get('authorization') || '';
  const match = authorization.match(/^Bearer\s+([^\s]+)$/i);
  if (!match) return { ok: false as const, error: 'UNAUTHORIZED' as const };
  let credential;
  try {
    credential = await prisma.affiliate_api_credentials.findUnique({
      where: { keyHash: apiKeyHash(match[1]!) },
      include: {
        affiliate: { select: { id: true, status: true, referralCode: true } },
      },
    });
  } catch (error) {
    console.error('Partner API authentication database error', error);
    return { ok: false as const, error: 'SERVICE_UNAVAILABLE' as const };
  }
  if (
    !credential ||
    !credential.active ||
    credential.revokedAt ||
    credential.affiliate.status !== 'ACTIVE' ||
    (credential.expiresAt && credential.expiresAt <= new Date())
  )
    return { ok: false as const, error: 'UNAUTHORIZED' as const };
  if (!credential.scopes.split(/\s+/).includes(requiredScope))
    return { ok: false as const, error: 'INSUFFICIENT_SCOPE' as const };
  await prisma.affiliate_api_credentials
    .update({ where: { id: credential.id }, data: { lastUsedAt: new Date() } })
    .catch(() => undefined);
  return { ok: true as const, credential };
}

export async function checkPartnerRateLimit(credentialId: number) {
  try {
    const count = await prisma.affiliate_api_idempotency.count({
      where: {
        credentialId,
        createdAt: { gte: new Date(Date.now() - 60_000) },
      },
    });
    return count < 60;
  } catch (error) {
    console.error('Partner API rate-limit database error', error);
    return null;
  }
}
