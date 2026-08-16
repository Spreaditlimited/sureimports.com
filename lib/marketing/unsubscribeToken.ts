import { createHmac, timingSafeEqual } from 'node:crypto';

function signingSecret() {
  const secret =
    process.env.MARKETING_UNSUBSCRIBE_SECRET || process.env.JWT_SECRET;
  if (!secret)
    throw new Error(
      'A marketing unsubscribe signing secret is not configured.',
    );
  return secret;
}

function signature(payload: string) {
  return createHmac('sha256', signingSecret()).update(payload).digest();
}

export function readMarketingUnsubscribeToken(token: string) {
  const [payload, suppliedSignature, extra] = token.split('.');
  if (!payload || !suppliedSignature || extra) return null;

  let supplied: Buffer;
  try {
    supplied = Buffer.from(suppliedSignature, 'base64url');
  } catch {
    return null;
  }
  const expected = signature(payload);
  if (
    supplied.length !== expected.length ||
    !timingSafeEqual(supplied, expected)
  )
    return null;

  try {
    const decoded = JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf8'),
    ) as {
      v?: number;
      e?: string;
      p?: string;
    };
    if (decoded.v !== 1 || !decoded.e || !decoded.p) return null;
    return { email: decoded.e.trim().toLowerCase(), pidContact: decoded.p };
  } catch {
    return null;
  }
}
