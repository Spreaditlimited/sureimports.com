import 'server-only';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import * as oidc from 'openid-client';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import {
  config,
  googleConfig,
  socialCookiePolicy,
  clientSecret,
  digest,
  token,
  safeNext,
  subject,
  profile,
  readBody,
} from './policy.mjs';
import { adapter } from './adapter';
import type { Accounts, Owner } from './types';

type Provider = 'apple' | 'google';
type Payload = {
  rememberMe?: boolean;
  origin: string;
  provider: Provider;
  clientId: string;
  nonce: string;
  next: string;
  mode: 'signin' | 'link';
  ownerId?: string;
  sessionHash?: string;
  subject?: string;
  email?: string;
};
type Attempt = {
  payload: Payload | string;
  binding_hash: string;
  kind: string;
};
const a = adapter;
const cookiePolicy = socialCookiePolicy(googleConfig(a.origin)?.origin || a.origin);
const flowCookie = cookiePolicy.flow;
const setupCookie = cookiePolicy.setup;
const options = {
  httpOnly: true,
  secure: cookiePolicy.secure,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 600,
};
const googleKeys = createRemoteJWKSet(
  new URL('https://www.googleapis.com/oauth2/v3/certs'),
);
const settings = () => config(a.origin);
const googleSettings = () => googleConfig(a.origin);

function providerConfig(provider: Provider) {
  return provider === 'apple' ? settings() : googleSettings();
}
const json = (value: object, status = 200) =>
  NextResponse.json(value, {
    status,
    headers: { 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' },
  });
const destination = (path: string) => {
  const r = NextResponse.redirect(
    new URL(path, settings()?.origin || googleSettings()?.origin || a.origin),
    303,
  );
  r.headers.set('Cache-Control', 'no-store');
  r.headers.set('Referrer-Policy', 'no-referrer');
  return r;
};
const fail = (reason = 'failed') => destination(a.login + '?social=' + reason);
function fresh(owner: Owner | null) {
  return (
    !!owner &&
    owner.account.active &&
    owner.createdAt <= Date.now() &&
    Date.now() - owner.createdAt < 600000
  );
}
function trusted(req: Request) {
  const origin = settings()?.origin || googleSettings()?.origin;
  return !!origin && req.headers.get('origin') === origin;
}
async function limit(req: Request, scope: string, max = 30) {
  const ip = (
    req.headers.get('x-forwarded-for')?.split(',')[0] ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
    .trim()
    .slice(0, 64);
  const key = digest(
    a.namespace +
      ':' +
      scope +
      ':' +
      ip +
      ':' +
      Math.floor(Date.now() / 900000),
  );
  await a.execute(
    'INSERT INTO sure_apple_limits (bucket_key,hits,expires_at) VALUES (?,1,DATE_ADD(NOW(), INTERVAL 30 MINUTE)) ON DUPLICATE KEY UPDATE hits=hits+1',
    [key],
  );
  const rows = await a.rows<{ hits: number }>(
    'SELECT hits FROM sure_apple_limits WHERE bucket_key=?',
    [key],
  );
  if (Number(rows[0]?.hits) > max)
    throw Error('Please wait a few minutes before trying again.');
}
async function save(kind: string, payload: Payload, binding: string) {
  const value = token();
  await a.execute(
    'INSERT INTO sure_apple_attempts (namespace,token_hash,binding_hash,kind,payload,expires_at) VALUES (?,?,?,?,?,DATE_ADD(NOW(), INTERVAL 10 MINUTE))',
    [
      a.namespace,
      digest(value),
      digest(binding),
      kind,
      JSON.stringify(payload),
    ],
  );
  return value;
}
async function attempt(
  value: string,
  binding: string,
  kind: string,
  store: Accounts = a,
  lock = false,
) {
  if (!/^[a-f0-9]{64}$/.test(value) || !/^[a-f0-9]{64}$/.test(binding))
    return null;
  const rows = await store.rows<Attempt>(
    'SELECT payload,binding_hash,kind FROM sure_apple_attempts WHERE namespace=? AND token_hash=? AND expires_at>NOW()' +
      (lock ? ' FOR UPDATE' : ''),
    [a.namespace, digest(value)],
  );
  const row = rows[0];
  if (!row || row.kind !== kind || row.binding_hash !== digest(binding))
    return null;
  const p: Payload =
    typeof row.payload === 'string' ? JSON.parse(row.payload) : row.payload;
  const cfg = providerConfig(p.provider);
  if (!cfg || p.origin !== cfg.origin || p.clientId !== cfg.clientId)
    return null;
  return p;
}
async function consume(value: string, store: Accounts = a) {
  const count = await store.execute(
    'DELETE FROM sure_apple_attempts WHERE namespace=? AND token_hash=? AND expires_at>NOW()',
    [a.namespace, digest(value)],
  );
  if (count !== 1)
    throw Error('Your sign-in session expired. Please start again.');
}
async function identity(p: Payload, store: Accounts = a) {
  const rows = await store.rows<{ account_id: string }>(
    'SELECT account_id FROM sure_apple_identities WHERE namespace=? AND client_id=? AND provider=? AND subject=?',
    [a.namespace, p.clientId, p.provider, p.subject],
  );
  return rows[0];
}
async function finishVerified(
  p: Payload,
  claims: Record<string, unknown>,
  req: Request,
) {
  p.subject = subject(claims);
  const found = await identity(p);
  if (found && p.mode === 'signin') {
    const account = await a.get(found.account_id);
    if (!account?.active) return fail('unavailable');
    const response = destination(safeNext(p.next, a.home));
    await a.session(account, req, response, p.next, p.rememberMe === true);
    return response;
  }
  if (found && found.account_id !== p.ownerId) return fail('linked');
  p.email = profile(claims).email;
  // Never merge a matching email during sign-in. Ownership is proved in a separate, explicit linking flow.
  if (p.mode === 'signin' && (await a.find(p.email!)))
    return fail('account_not_linked');
  const binding = token();
  const ticket = await save('SETUP', p, binding);
  const jar = await cookies();
  jar.set(setupCookie, ticket + '.' + binding, options);
  return destination('/complete-social');
}
async function setup() {
  const pair = (await cookies()).get(setupCookie)?.value.split('.') || [];
  if (pair.length !== 2) return null;
  const payload = await attempt(pair[0], pair[1], 'SETUP');
  return payload ? { value: pair[0], binding: pair[1], payload } : null;
}
export async function status() {
  const p = await setup();
  return json(
    p
      ? {
          ready: true,
          email: p.payload.email,
          provider: p.payload.provider,
          mode: p.payload.mode,
          brand: a.brand,
          terms: a.terms,
          affiliate: a.namespace === 'affiliate',
        }
      : { ready: false, login: a.login },
  );
}
export async function configuration(req: Request) {
  const owner = await a.current(req);
  const connected = owner
    ? await a.rows<{ provider: string }>(
        'SELECT provider FROM sure_apple_identities WHERE namespace=? AND account_id=?',
        [a.namespace, owner.account.id],
      )
    : [];
  return json({
    apple: !!settings(),
    googleClientId: googleSettings()?.clientId || '',
    login: a.login,
    home: a.home,
    brand: a.brand,
    owner: owner ? { email: owner.account.email, fresh: fresh(owner) } : null,
    connected: connected.map((x) => x.provider),
  });
}
export async function start(req: Request) {
  try {
    if (!trusted(req))
      return json({ message: 'Reload this page and try again.' }, 403);
    const body = JSON.parse(await readBody(req, 4096));
    if (!['apple', 'google'].includes(body.provider))
      return json({ message: 'Choose a sign-in provider.' }, 400);
    const provider: Provider = body.provider;
    const cfg = providerConfig(provider);
    if (!cfg)
      return json({ message: 'This sign-in method is not configured.' }, 503);
    await limit(req, 'start', 60);
    await a.execute(
      'DELETE FROM sure_apple_attempts WHERE expires_at<NOW() LIMIT 100',
    );
    await a.execute(
      'DELETE FROM sure_apple_limits WHERE expires_at<NOW() LIMIT 100',
    );
    const mode = body.mode === 'link' ? 'link' : 'signin';
    const owner = mode === 'link' ? await a.current(req) : null;
    if (mode === 'link' && (!fresh(owner) || body.consent !== provider))
      return json(
        {
          message:
            'Sign in again with your existing method, then confirm that you want to connect this provider.',
        },
        403,
      );
    const binding = token();
    const nonce = token();
    const p: Payload = {
      rememberMe: body.rememberMe === true,
      origin: cfg.origin,
      provider,
      clientId: cfg.clientId,
      nonce,
      next: safeNext(body.next, a.home),
      mode,
      ...(owner
        ? { ownerId: owner.account.id, sessionHash: owner.sessionHash }
        : {}),
    };
    const state = await save('FLOW', p, binding);
    (await cookies()).set(flowCookie, binding, {
      ...options,
      sameSite: cookiePolicy.secure ? 'none' : 'lax',
    });
    if (provider === 'google') return json({ state, nonce });
    const url = new URL('https://appleid.apple.com/auth/authorize');
    url.search = new URLSearchParams({
      client_id: cfg.clientId,
      redirect_uri: settings()!.redirectUri,
      response_type: 'code',
      response_mode: 'form_post',
      scope: 'name email',
      state,
      nonce,
    }).toString();
    return json({ url: url.toString() });
  } catch {
    return json(
      { message: 'Unable to start sign-in. Please try again shortly.' },
      400,
    );
  }
}
export async function appleCallback(req: Request) {
  try {
    if (
      req.headers.get('content-type')?.split(';')[0].trim() !==
      'application/x-www-form-urlencoded'
    )
      return fail();
    const form = new URLSearchParams(await readBody(req));
    if (['state', 'code', 'error'].some((k) => form.getAll(k).length > 1))
      return fail();
    const jar = await cookies();
    const state = form.get('state') || '';
    const p = await attempt(state, jar.get(flowCookie)?.value || '', 'FLOW');
    if (!p || p.provider !== 'apple') return fail('expired');
    await consume(state);
    jar.set(flowCookie, '', { ...options, sameSite: cookiePolicy.secure ? 'none' : 'lax', maxAge: 0 });
    if (form.get('error')) return fail('cancelled');
    const cfg = settings()!;
    const client = await oidc.discovery(
      new URL('https://appleid.apple.com'),
      cfg.clientId,
      clientSecret(cfg),
      undefined,
      { timeout: 10, execute: [oidc.enableNonRepudiationChecks] },
    );
    const callback = new Request(cfg.redirectUri, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ state, code: form.get('code') || '' }),
    });
    const tokens = await oidc.authorizationCodeGrant(client, callback, {
      expectedState: state,
      expectedNonce: p.nonce,
      idTokenExpected: true,
    });
    return await finishVerified(p, tokens.claims()!, req);
  } catch {
    return fail();
  }
}
export async function googleCallback(req: Request) {
  try {
    if (!trusted(req)) return json({ message: 'Invalid origin.' }, 403);
    const body = JSON.parse(await readBody(req));
    const jar = await cookies();
    const p = await attempt(
      body.state || '',
      jar.get(flowCookie)?.value || '',
      'FLOW',
    );
    if (!p || p.provider !== 'google')
      return json(
        { message: 'Your sign-in session expired. Please try again.' },
        400,
      );
    await consume(body.state);
    jar.set(flowCookie, '', { ...options, sameSite: cookiePolicy.secure ? 'none' : 'lax', maxAge: 0 });
    const { payload } = await jwtVerify(body.credential, googleKeys, {
      issuer: ['https://accounts.google.com', 'accounts.google.com'],
      audience: p.clientId,
      algorithms: ['RS256'],
    });
    if (payload.nonce !== p.nonce) throw Error('Invalid nonce');
    const response = await finishVerified(p, payload, req);
    const result = json({ next: response.headers.get('location') });
    for (const cookie of response.cookies.getAll()) result.cookies.set(cookie);
    return result;
  } catch {
    return json(
      { message: 'Google sign-in could not be verified. Please try again.' },
      400,
    );
  }
}
export async function complete(req: Request) {
  try {
    if (!trusted(req))
      return json({ message: 'Reload this page and try again.' }, 403);
    await limit(req, 'complete', 15);
    const body = JSON.parse(await readBody(req, 8192));
    const ticket = await setup();
    if (!ticket)
      return json(
        { message: 'Your sign-in session expired. Please start again.' },
        400,
      );
    const owner = ticket.payload.mode === 'link' ? await a.current(req) : null;
    if (
      ticket.payload.mode === 'link' &&
      (!fresh(owner) ||
        owner?.account.id !== ticket.payload.ownerId ||
        owner?.sessionHash !== ticket.payload.sessionHash ||
        body.consent !== ticket.payload.provider)
    )
      return json(
        {
          message:
            'Sign in again with your existing method before connecting this provider.',
        },
        403,
      );
    if (owner && owner.account.email.toLowerCase() !== ticket.payload.email)
      return json(
        {
          message:
            'The provider email does not match your account email. For Apple, choose Share My Email using the same email as this account.',
        },
        409,
      );
    const account = await a.transaction(async (tx) => {
      const p = await attempt(ticket.value, ticket.binding, 'SETUP', tx, true);
      if (!p || !p.subject || !p.email)
        throw Error('This session has expired. Start again.');
      if (p.mode === 'link' && !owner) throw Error('Sign in again.');
      let account = owner ? await tx.get(owner.account.id) : null;
      if (
        owner &&
        (!account?.active || account.email.toLowerCase() !== p.email)
      )
        throw Error('This account is not available.');
      if (!owner) {
        if (await tx.find(p.email))
          throw Error(
            'An account already uses this email. Sign in with your existing method, then connect this provider.',
          );
        const firstName = String(body.firstName || '').trim();
        const lastName = String(body.lastName || '').trim();
        if (
          firstName.length < 2 ||
          firstName.length > 60 ||
          lastName.length < 2 ||
          lastName.length > 60 ||
          body.acceptedTerms !== true
        )
          throw Error('Enter your name and accept the terms to continue.');
        account = await tx.create(p.email, {
          firstName,
          lastName,
          phone: String(body.phone || '').trim(),
          country: String(body.country || '').trim(),
          acceptedTerms: true,
        });
      }
      if (!account) throw Error('Account unavailable.');
      const existing = await identity(p, tx);
      if (existing && existing.account_id !== account.id)
        throw Error('This provider is already connected to another account.');
      if (!existing)
        await tx.execute(
          'INSERT INTO sure_apple_identities (namespace,client_id,provider,subject,account_id,terms_version) VALUES (?,?,?,?,?,?)',
          [
            a.namespace,
            p.clientId,
            p.provider,
            p.subject,
            account.id,
            'social-consent-2026-10-15',
          ],
        );
      await consume(ticket.value, tx);
      return account;
    });
    (await cookies()).set(setupCookie, '', { ...options, maxAge: 0 });
    const next =
      ticket.payload.mode === 'link'
        ? a.home
        : safeNext(ticket.payload.next, a.home);
    const response = json({ next });
    // Linking must preserve the current session and its persistence choice.
    const target = ticket.payload.mode === 'link' ? undefined : await a.session(account, req, response, next, ticket.payload.rememberMe === true);
    if (target && target !== next) {
      const updated = json({ next: target });
      for (const cookie of response.cookies.getAll())
        updated.cookies.set(cookie);
      return updated;
    }
    return response;
  } catch (error) {
    const message =
      error instanceof Error &&
      /^(Enter your|An account already|This session|This provider|This account|Select a valid|Enter a valid|This account is reserved)/.test(
        error.message,
      )
        ? error.message
        : 'Unable to complete this request. Please try again.';
    return json({ message }, 400);
  }
}
