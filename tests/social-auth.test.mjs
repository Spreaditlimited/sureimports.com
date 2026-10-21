import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync, verify } from 'node:crypto';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import {
  socialCookiePolicy,
  googleConfig,
  config,
  clientSecret,
  safeNext,
  profile,
  readBody,
  digest,
} from '../lib/apple/policy.mjs';
const require = createRequire(import.meta.url);
const { privateKey, publicKey } = generateKeyPairSync('ec', {
  namedCurve: 'prime256v1',
});
const env = {
  NODE_ENV: 'production',
  SURE_IMPORTS_APPLE_AUTH_CLIENT_ID: 'com.example.web',
  SURE_IMPORTS_APPLE_AUTH_TEAM_ID: 'TESTTEAM01',
  SURE_IMPORTS_APPLE_AUTH_KEY_ID: 'TESTKEY001',
  SURE_IMPORTS_APPLE_AUTH_PRIVATE_KEY: privateKey.export({
    type: 'pkcs8',
    format: 'pem',
  }),
};
Object.assign(process.env, env, {
  GOOGLE_CLIENT_ID: 'google-test.apps.googleusercontent.com',
});
const origin = 'https://auth.example.com';
test('production keys cannot enable preview or development authentication', () => {
  assert.ok(config(origin, env));
  assert.equal(config(origin, { ...env, NODE_ENV: 'development' }), null);
  assert.equal(
    config(origin, { ...env, VERCEL: '1', VERCEL_ENV: 'preview' }),
    null,
  );
});
test('client assertions are fresh five-minute ES256 signatures', () => {
  const cfg = config(origin, env);
  const jwt = clientSecret(cfg, 1000);
  const [h, p, s] = jwt.split('.');
  assert.equal(JSON.parse(Buffer.from(p, 'base64url')).exp, 1300);
  assert.equal(JSON.parse(Buffer.from(h, 'base64url')).alg, 'ES256');
  assert.ok(
    verify(
      'sha256',
      Buffer.from(h + '.' + p),
      { key: publicKey, dsaEncoding: 'ieee-p1363' },
      Buffer.from(s, 'base64url'),
    ),
  );
  assert.notEqual(jwt, clientSecret(cfg, 1400));
});
test('unsafe destinations and unverified emails are rejected; relay addresses work', () => {
  for (const next of [
    '//evil.invalid',
    '/\\evil.invalid',
    'https://evil.invalid',
    '/api/auth/logout',
    '/auth/login',
    '/\n/evil',
  ])
    assert.equal(safeNext(next, '/dashboard'), '/dashboard');
  assert.equal(safeNext('/connect-social', '/dashboard'), '/connect-social');
  assert.throws(() =>
    profile({ sub: 'x', email: 'a@example.com', email_verified: false }),
  );
  for (const domain of ['private.icloud.com', 'privaterelay.appleid.com'])
    assert.equal(
      profile({ sub: 'x', email: 'a@' + domain, email_verified: true }).email,
      'a@' + domain,
    );
});
test('request size limits apply without a content-length header', async () => {
  await assert.rejects(
    readBody(new Request(origin, { method: 'POST', body: 'x'.repeat(17000) })),
  );
});

function harness() {
  const attempts = new Map(),
    identities = [],
    accounts = new Map(),
    jar = new Map();
  let owner = null,
    claims = {
      sub: 'subject-1',
      email: 'person@example.com',
      email_verified: true,
    },
    sessions = 0;
  const preferences = [];
  const store = {
    async rows(sql, v = []) {
      if (sql.includes('sure_apple_limits')) return [{ hits: 1 }];
      if (sql.includes('sure_apple_attempts'))
        return attempts.has(v[1]) ? [attempts.get(v[1])] : [];
      if (sql.includes('sure_apple_identities'))
        return identities.filter(
          (x) =>
            x.namespace === v[0] &&
            (sql.includes('subject=?')
              ? x.client_id === v[1] &&
                x.provider === v[2] &&
                x.subject === v[3]
              : x.account_id === v[1]),
        );
      return [];
    },
    async execute(sql, v = []) {
      if (sql.startsWith('INSERT INTO sure_apple_attempts')) {
        attempts.set(v[1], { binding_hash: v[2], kind: v[3], payload: v[4] });
        return 1;
      }
      if (
        sql.startsWith('DELETE FROM sure_apple_attempts') &&
        sql.includes('token_hash')
      )
        return attempts.delete(v[1]) ? 1 : 0;
      if (sql.startsWith('INSERT INTO sure_apple_identities')) {
        identities.push({
          namespace: v[0],
          client_id: v[1],
          provider: v[2],
          subject: v[3],
          account_id: v[4],
        });
        return 1;
      }
      return 1;
    },
    async find(email) {
      return [...accounts.values()].find((x) => x.email === email) || null;
    },
    async get(id) {
      return accounts.get(id) || null;
    },
    async create(email) {
      const u = { id: String(accounts.size + 1), email, active: true };
      accounts.set(u.id, u);
      return u;
    },
    async verify() {
      return false;
    },
  };
  const adapter = {
    ...store,
    namespace: 'test',
    origin,
    login: '/login',
    home: '/dashboard',
    brand: 'Test',
    terms: '/terms',
    transaction: (fn) => fn(store),
    current: async () => owner,
    session: async (_account, _req, _response, _next, rememberMe) => {
      sessions++;
      preferences.push(rememberMe);
    },
  };
  const cookies = {
    get: (k) => (jar.has(k) ? { value: jar.get(k) } : undefined),
    set: (k, v) => jar.set(k, v),
    delete: (k) => jar.delete(k),
  };
  const policy = require('../lib/apple/policy.mjs');
  const conversions = [];
  const module = { exports: {} };
  const ts = require('typescript');
  const code = ts.transpileModule(
    readFileSync(new URL('../lib/apple/engine.ts', import.meta.url), 'utf8'),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    },
  ).outputText;
  const mockRequire = (id) =>
    id === '@/lib/marketing/registrationConversion'
      ? {
          registrationAttribution: () => ({}),
          scheduleRegistrationConversion: (input) => {
            conversions.push(input);
            return {
              eventId: 'registration-' + input.accountId,
              method: input.method,
            };
          },
        }
      : id === 'server-only'
        ? {}
        : id === 'next/headers'
          ? { cookies: async () => cookies }
          : id === './adapter'
            ? { adapter }
            : id === './policy.mjs'
              ? policy
              : id === 'openid-client'
                ? {
                    discovery: async () => ({}),
                    enableNonRepudiationChecks() {},
                    authorizationCodeGrant: async () => ({
                      claims: () => claims,
                    }),
                  }
                : id === 'jose'
                  ? {
                      createRemoteJWKSet: () => ({}),
                      jwtVerify: async () => ({ payload: claims }),
                    }
                  : require(id);
  vm.runInNewContext('(function(require,module,exports){' + code + '\n})', {
    URL,
    URLSearchParams,
    Request,
    Response,
    Buffer,
    process,
    console,
    Date,
  })(mockRequire, module, module.exports);
  const api = module.exports;
  const request = (body) =>
    new Request(origin + '/api/auth/social/start', {
      method: 'POST',
      headers: { origin, 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
  async function start(
    mode = 'signin',
    provider = 'apple',
    rememberMe = false,
  ) {
    const r = await api.start(
      request({
        provider,
        mode,
        rememberMe,
        consent: mode === 'link' ? provider : undefined,
      }),
    );
    const body = await r.json();
    return {
      r,
      body,
      state: body.url
        ? new URL(body.url).searchParams.get('state')
        : body.state,
    };
  }
  async function callback(state) {
    return api.appleCallback(
      new Request(origin + '/api/auth/callback/apple', {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ state, code: 'synthetic' }),
      }),
    );
  }
  return {
    conversions,
    api,
    accounts,
    identities,
    attempts,
    jar,
    request,
    start,
    callback,
    preferences,
    setOwner: (v) => (owner = v),
    setClaims: (v) => (claims = v),
    get sessions() {
      return sessions;
    },
  };
}
test('same-email sign-in never silently links or issues a session', async () => {
  const h = harness();
  h.accounts.set('existing', {
    id: 'existing',
    email: 'person@example.com',
    active: true,
  });
  const { state } = await h.start();
  const r = await h.callback(state);
  assert.match(r.headers.get('location'), /account_not_linked/);
  assert.equal(h.sessions, 0);
  assert.equal(h.identities.length, 0);
});
test('explicit linking requires fresh ownership, then preserves the existing account', async () => {
  const h = harness();
  const account = { id: 'existing', email: 'person@example.com', active: true };
  h.accounts.set(account.id, account);
  assert.equal((await h.start('link')).r.status, 403);
  h.setOwner({
    account,
    sessionHash: 'session',
    createdAt: Date.now() - 700000,
  });
  assert.equal((await h.start('link')).r.status, 403);
  h.setOwner({ account, sessionHash: 'session', createdAt: Date.now() - 1000 });
  const { state } = await h.start('link');
  assert.match(
    (await h.callback(state)).headers.get('location'),
    /complete-social/,
  );
  const r = await h.api.complete(h.request({ consent: 'apple' }));
  assert.equal(r.status, 200);
  assert.equal((await r.json()).next, '/dashboard');
  assert.equal(h.accounts.size, 1);
  assert.equal(h.identities[0].account_id, account.id);
  const next = await h.start();
  await h.callback(next.state);
  assert.equal(h.sessions, 1);
});
test('different-email and changed-session linking cannot attach a provider', async () => {
  for (const changed of ['email', 'session']) {
    const h = harness();
    const account = {
      id: 'existing',
      email: 'person@example.com',
      active: true,
    };
    h.accounts.set(account.id, account);
    h.setOwner({ account, sessionHash: 'session', createdAt: Date.now() });
    const { state } = await h.start('link');
    if (changed === 'email')
      h.setClaims({
        sub: 'subject',
        email: 'relay@private.icloud.com',
        email_verified: true,
      });
    await h.callback(state);
    if (changed === 'session')
      h.setOwner({ account, sessionHash: 'other', createdAt: Date.now() });
    const r = await h.api.complete(h.request({ consent: 'apple' }));
    assert.ok(r.status >= 400);
    assert.equal(h.identities.length, 0);
    assert.equal(h.sessions, 0);
  }
});
test('callbacks reject missing browser binding and replay', async () => {
  const h = harness();
  const { state } = await h.start();
  const binding = h.jar.get('__Host-sure_social_flow');
  h.jar.delete('__Host-sure_social_flow');
  assert.match((await h.callback(state)).headers.get('location'), /expired/);
  h.jar.set('__Host-sure_social_flow', binding);
  await h.callback(state);
  h.jar.set('__Host-sure_social_flow', binding);
  assert.match((await h.callback(state)).headers.get('location'), /expired/);
});
test('new users require consent and a complete profile; setup tickets are single use', async () => {
  const h = harness();
  const { state } = await h.start();
  await h.callback(state);
  assert.equal(
    (await h.api.complete(h.request({ firstName: 'New', lastName: 'User' })))
      .status,
    400,
  );
  const r = await h.api.complete(
    h.request({ firstName: 'New', lastName: 'User', acceptedTerms: true }),
  );
  assert.equal(r.status, 200);
  assert.equal(h.accounts.size, 1);
  assert.equal(h.identities.length, 1);
  assert.equal(
    (
      await h.api.complete(
        h.request({ firstName: 'New', lastName: 'User', acceptedTerms: true }),
      )
    ).status,
    400,
  );
});
test('Google requires the browser-bound state and the nonce from that attempt', async () => {
  const h = harness();
  const { body, state } = await h.start('signin', 'google');
  h.setClaims({
    sub: 'g',
    email: 'person@example.com',
    email_verified: true,
    nonce: 'wrong',
  });
  assert.equal(
    (await h.api.googleCallback(h.request({ state, credential: 'synthetic' })))
      .status,
    400,
  );
  const retry = await h.start('signin', 'google');
  h.setClaims({
    sub: 'g',
    email: 'person@example.com',
    email_verified: true,
    nonce: retry.body.nonce,
  });
  const r = await h.api.googleCallback(
    h.request({ state: retry.state, credential: 'synthetic' }),
  );
  assert.equal(r.status, 200);
  assert.match((await r.json()).next, /complete-social/);
  assert.equal(h.sessions, 0);
});
test('cancelled consent and suspended accounts cannot issue sessions', async () => {
  const h = harness();
  const { state } = await h.start();
  const r = await h.api.appleCallback(
    new Request(origin, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ state, error: 'access_denied' }),
    }),
  );
  assert.match(r.headers.get('location'), /cancelled/);
  assert.equal(h.sessions, 0);
  const account = { id: '1', email: 'person@example.com', active: false };
  h.accounts.set('1', account);
  h.identities.push({
    namespace: 'test',
    client_id: env.SURE_IMPORTS_APPLE_AUTH_CLIENT_ID,
    provider: 'apple',
    subject: 'subject-1',
    account_id: '1',
  });
  const retry = await h.start();
  assert.match(
    (await h.callback(retry.state)).headers.get('location'),
    /unavailable/,
  );
  assert.equal(h.sessions, 0);
});

test('Google supports localhost independently of Apple and rejects unsafe origins', () => {
  const local = {
    NODE_ENV: 'development',
    GOOGLE_CLIENT_ID: 'google-test.apps.googleusercontent.com',
  };
  assert.deepEqual(googleConfig(origin, local), {
    clientId: local.GOOGLE_CLIENT_ID,
    origin: 'http://localhost:3000',
  });
  assert.equal(config(origin, { ...env, ...local }), null);
  for (const invalid of [
    'http://external.example',
    'https://user:pass@example.com',
    'https://example.com/path',
    'https://example.com?x=1',
  ])
    assert.equal(
      googleConfig(origin, {
        ...local,
        SURE_IMPORTS_GOOGLE_TEST_ORIGIN: invalid,
      }),
      null,
    );
  assert.equal(
    googleConfig(origin, { ...local, VERCEL: '1', VERCEL_ENV: 'preview' }),
    null,
  );
  assert.equal(
    googleConfig('http://localhost:3000', { ...local, NODE_ENV: 'production' }),
    null,
  );
  assert.equal(
    googleConfig(origin, { ...local, NODE_ENV: 'production' }).origin,
    origin,
  );
});

test('HTTP loopback development uses isolated cookies while production remains Secure', () => {
  assert.deepEqual(
    socialCookiePolicy('http://localhost:3000', { NODE_ENV: 'development' }),
    {
      secure: false,
      flow: 'sure_social_dev_flow',
      setup: 'sure_social_dev_setup',
    },
  );
  for (const [url, e] of [
    ['http://localhost:3000', { NODE_ENV: 'production' }],
    ['http://localhost:3000', { NODE_ENV: 'development', VERCEL: '1' }],
    ['http://example.com', { NODE_ENV: 'development' }],
    ['https://localhost:3000', { NODE_ENV: 'development' }],
  ]) {
    const policy = socialCookiePolicy(url, e);
    assert.equal(policy.secure, true);
    assert.match(policy.flow, /^__Host-/);
    assert.match(policy.setup, /^__Host-/);
  }
});
test('localhost Google flow preserves the setup session through completion', async () => {
  const previous = process.env.NODE_ENV;
  process.env.NODE_ENV = 'development';
  try {
    const h = harness();
    const request = (body) =>
      new Request('http://localhost:3000/api/auth/social/start', {
        method: 'POST',
        headers: {
          origin: 'http://localhost:3000',
          'content-type': 'application/json',
        },
        body: JSON.stringify(body),
      });
    const started = await h.api.start(request({ provider: 'google' }));
    assert.equal(started.status, 200);
    const { state, nonce } = await started.json();
    assert.ok(h.jar.get('sure_social_dev_flow'));
    assert.equal(h.jar.has('__Host-sure_social_flow'), false);
    h.setClaims({
      sub: 'local-subject',
      email: 'local@example.com',
      email_verified: true,
      nonce,
    });
    const callback = await h.api.googleCallback(
      request({ state, credential: 'mock' }),
    );
    assert.equal(callback.status, 200);
    assert.ok(h.jar.get('sure_social_dev_setup'));
    assert.equal((await (await h.api.status()).json()).ready, true);
    const completed = await h.api.complete(
      request({ firstName: 'Local', lastName: 'Tester', acceptedTerms: true }),
    );
    assert.equal(completed.status, 200);
    assert.equal(h.sessions, 1);
  } finally {
    process.env.NODE_ENV = previous;
  }
});

test('remember me persists only with explicit boolean consent', async () => {
  const { sessionCookieLifetime } = await import(
    '../lib/auth/session-policy.mjs'
  );
  assert.deepEqual(sessionCookieLifetime(true), { maxAge: 2592000 });
  for (const value of [false, undefined, null, 'true', 'false', 1])
    assert.deepEqual(sessionCookieLifetime(value), {});
});
test('Apple and Google preserve remember me through provider redirects', async () => {
  for (const provider of ['apple', 'google'])
    for (const remember of [true, false]) {
      const h = harness();
      h.accounts.set('1', {
        id: '1',
        email: 'person@example.com',
        active: true,
      });
      h.identities.push({
        namespace: 'test',
        client_id:
          provider === 'apple'
            ? env.SURE_IMPORTS_APPLE_AUTH_CLIENT_ID
            : process.env.GOOGLE_CLIENT_ID,
        provider,
        subject: 'subject-1',
        account_id: '1',
      });
      const { state, body } = await h.start('signin', provider, remember);
      h.setClaims({
        sub: 'subject-1',
        email: 'person@example.com',
        email_verified: true,
        nonce: body.nonce,
      });
      if (provider === 'apple') await h.callback(state);
      else
        await h.api.googleCallback(
          h.request({ state, credential: 'synthetic' }),
        );
      assert.deepEqual(h.preferences, [remember]);
    }
});

test('only new social accounts emit registration, never linking, login or replay', async () => {
  const h = harness();
  const { state } = await h.start();
  await h.callback(state);
  const r = await h.api.complete(
    h.request({ firstName: 'New', lastName: 'User', acceptedTerms: true }),
  );
  const data = await r.json();
  assert.equal(data.registrationConversion.method, 'apple');
  assert.equal(h.conversions.length, 1);
  await h.api.complete(
    h.request({ firstName: 'New', lastName: 'User', acceptedTerms: true }),
  );
  assert.equal(h.conversions.length, 1);
  const login = await h.start();
  await h.callback(login.state);
  assert.equal(h.conversions.length, 1);
  const linked = harness();
  const account = { id: 'existing', email: 'person@example.com', active: true };
  linked.accounts.set(account.id, account);
  linked.setOwner({ account, sessionHash: 'session', createdAt: Date.now() });
  const flow = await linked.start('link');
  await linked.callback(flow.state);
  const result = await linked.api.complete(
    linked.request({ consent: 'apple' }),
  );
  assert.equal(result.status, 200);
  assert.equal(linked.conversions.length, 0);
});
