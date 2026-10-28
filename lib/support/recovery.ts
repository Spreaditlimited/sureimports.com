import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';

const secret = () => process.env.SUPPORT_RECOVERY_SECRET || process.env.CRON_SECRET;
export function createSupportRecoveryToken(guestId: string, conversationId: string) {
  const key = secret();
  if (!key) throw new Error('Support recovery signing secret is not configured');
  const payload = Buffer.from(JSON.stringify({ guestId, conversationId, expires: Date.now() + 30 * 86400_000 })).toString('base64url');
  const signature = createHmac('sha256', key).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}
export function verifySupportRecoveryToken(token: string) {
  const key = secret();
  if (!key || token.length > 500) return null;
  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra) return null;
  const expected = createHmac('sha256', key).update(payload).digest();
  let actual: Buffer;
  try { actual = Buffer.from(signature, 'base64url'); } catch { return null; }
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  try {
    const value = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!/^[a-f0-9]{32}$/.test(value.guestId) || !/^[a-f0-9]{32}$/.test(value.conversationId) ||
      !Number.isSafeInteger(value.expires) || value.expires < Date.now()) return null;
    return value as { guestId: string; conversationId: string; expires: number };
  } catch { return null; }
}
