import 'server-only';

import { createHmac } from 'crypto';

export const LINESCOUT_ATTRIBUTION_COOKIE = 'sure_linescout_attribution';

function integrationSecret() {
  const secret = process.env.LINESCOUT_LEDGER_SECRET?.trim();
  if (!secret) {
    throw new Error('LINESCOUT_LEDGER_SECRET is not configured');
  }
  return secret;
}

export function createLineScoutAttributionValue(
  referralCode: string,
  expiresAt: number,
) {
  const payload = Buffer.from(
    JSON.stringify({
      code: referralCode.trim().toLowerCase(),
      expiresAt,
    }),
  ).toString('base64url');
  const signature = createHmac('sha256', integrationSecret())
    .update(`v1.${payload}`)
    .digest('base64url');

  return `v1.${payload}.${signature}`;
}
