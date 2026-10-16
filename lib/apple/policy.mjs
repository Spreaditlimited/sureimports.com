import { createHash, randomBytes, createPrivateKey, sign } from 'node:crypto';
export const digest = (value) =>
  createHash('sha256').update(value).digest('hex');
export const token = () => randomBytes(32).toString('hex');
export function safeNext(value, fallback) {
  if (
    typeof value !== 'string' ||
    value.length > 1024 ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    /[\\\x00-\x20]/.test(value)
  )
    return fallback;
  const url = new URL(value, 'https://sureimports.invalid');
  if (
    url.origin !== 'https://sureimports.invalid' ||
    /^\/(api|auth|sign-in|sign-up|login|logout)(\/|$)/.test(url.pathname)
  )
    return fallback;
  return url.pathname + url.search + url.hash;
}
export function config(origin, env = process.env) {
  if (env.VERCEL && env.VERCEL_ENV !== 'production') return null;
  const local = env.NODE_ENV !== 'production';
  const prefix = local
    ? 'SURE_IMPORTS_APPLE_AUTH_TEST_'
    : 'SURE_IMPORTS_APPLE_AUTH_';
  const clientId = env[prefix + 'CLIENT_ID']?.trim();
  const teamId = env[prefix + 'TEAM_ID']?.trim();
  const keyId = env[prefix + 'KEY_ID']?.trim();
  const privateKey = env[prefix + 'PRIVATE_KEY']?.replace(/\\n/g, '\n').trim();
  if (!clientId || !teamId || !keyId || !privateKey) return null;
  try {
    const url = new URL(
      local ? env.SURE_IMPORTS_APPLE_AUTH_TEST_ORIGIN : origin,
    );
    if (
      url.protocol !== 'https:' ||
      url.username ||
      url.password ||
      url.pathname !== '/' ||
      url.search ||
      url.hash ||
      !url.hostname.includes('.') ||
      /^[\d.]+$/.test(url.hostname) ||
      url.hostname.endsWith('.localhost')
    )
      return null;
    return {
      clientId,
      teamId,
      keyId,
      privateKey,
      origin: url.origin,
      redirectUri: url.origin + '/api/auth/callback/apple',
    };
  } catch {
    return null;
  }
}
export function clientSecret(settings, now = Math.floor(Date.now() / 1000)) {
  const key = createPrivateKey(settings.privateKey);
  if (
    key.asymmetricKeyType !== 'ec' ||
    key.asymmetricKeyDetails?.namedCurve !== 'prime256v1'
  )
    throw Error('Invalid Apple signing key');
  const encode = (value) =>
    Buffer.from(JSON.stringify(value)).toString('base64url');
  const input = `${encode({ alg: 'ES256', kid: settings.keyId })}.${encode({ iss: settings.teamId, iat: now, exp: now + 300, aud: 'https://appleid.apple.com', sub: settings.clientId })}`;
  return (
    input +
    '.' +
    sign('sha256', Buffer.from(input), {
      key,
      dsaEncoding: 'ieee-p1363',
    }).toString('base64url')
  );
}
export function subject(claims) {
  if (
    !claims ||
    typeof claims.sub !== 'string' ||
    !/^[A-Za-z0-9._-]{1,255}$/.test(claims.sub)
  )
    throw Error('Invalid Apple identity');
  return claims.sub;
}
export function profile(claims) {
  const sub = subject(claims);
  if (
    ![true, 'true'].includes(claims.email_verified) ||
    typeof claims.email !== 'string' ||
    claims.email.length > 200 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(claims.email)
  )
    throw Error(
      'Apple did not provide a verified email. Please sign in with email.',
    );
  return { subject: sub, email: claims.email.toLowerCase() };
}
export async function readBody(request, limit = 16384) {
  const reader = request.body?.getReader();
  if (!reader) throw Error('Missing request');
  let size = 0;
  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) {
      await reader.cancel();
      throw Error('Request too large');
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks).toString('utf8');
}

export function googleConfig(origin, env = process.env) {
  if (env.VERCEL && env.VERCEL_ENV !== 'production') return null;
  const production = env.NODE_ENV === 'production';
  const clientId = (production ? undefined : env.SURE_IMPORTS_GOOGLE_TEST_CLIENT_ID)
    || env.GOOGLE_CLIENT_ID || env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const configuredOrigin = production ? origin
    : env.SURE_IMPORTS_GOOGLE_TEST_ORIGIN || 'http://localhost:3000';
  if (!clientId) return null;
  try {
    const url = new URL(configuredOrigin);
    const localHttp = !production && url.protocol === 'http:'
      && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
    if ((!localHttp && url.protocol !== 'https:') || url.username || url.password
      || url.pathname !== '/' || url.search || url.hash) return null;
    return { clientId, origin: url.origin };
  } catch { return null; }
}

// HTTP loopback development needs ordinary host-only cookies in Safari.
// Production and every non-loopback origin retain Secure __Host- cookies.
export function socialCookiePolicy(origin, env = process.env) {
  let localHttp = false;
  try {
    const url = new URL(origin);
    localHttp = env.NODE_ENV === 'development' && !env.VERCEL
      && url.protocol === 'http:'
      && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  } catch {}
  return {
    secure: !localHttp,
    flow: localHttp ? 'sure_social_dev_flow' : '__Host-sure_social_flow',
    setup: localHttp ? 'sure_social_dev_setup' : '__Host-sure_social_setup',
  };
}
