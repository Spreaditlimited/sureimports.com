import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import crypto from 'node:crypto';
import ts from 'typescript';

function load(path, imports = {}, extra = {}) {
  const exports = {};
  const code = ts.transpileModule(
    readFileSync(new URL(path, import.meta.url), 'utf8'),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    },
  ).outputText;
  vm.runInNewContext(code, {
    exports,
    require: (name) => imports[name],
    Buffer,
    Response,
    Request,
    URL,
    URLSearchParams,
    AbortSignal,
    console,
    process: {
      env: { NODE_ENV: 'production', GOOGLE_CAPTCHA_SECRET_KEY: 'test-secret' },
    },
    ...extra,
  });
  return exports;
}
const policy = load('../lib/security/publicFormPolicy.ts');
const body = {
  userFirstname: 'Chinwe',
  userLastname: 'O’Connor',
  email: 'test@example.invalid',
  password: 'test-password',
  confirmPassword: 'test-password',
  recaptchaToken: 'test-token',
};
const req = (data = body, headers = {}) =>
  new Request('https://www.sureimports.com/api/auth/register', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'https://www.sureimports.com',
      'x-forwarded-for': '192.0.2.9',
      ...headers,
    },
    body: JSON.stringify(data),
  });
function guardFixture({ captcha = true, databaseFails = false } = {}) {
  const counts = new Map();
  let captchaCalls = 0;
  const prisma = {
    async $executeRaw(_sql, key) {
      if (databaseFails) throw new Error('DB unavailable');
      counts.set(key, (counts.get(key) || 0) + 1);
    },
    async $queryRaw(_sql, key) {
      return [{ attempts: counts.get(key) }];
    },
  };
  const { guardPublicForm } = load('../lib/security/publicFormGuard.ts', {
    'node:crypto': crypto,
    '@/lib/prisma': { prisma },
    './publicFormPolicy': policy,
    './recaptcha': {
      verifyRecaptchaToken: async () => {
        captchaCalls++;
        return captcha;
      },
    },
  });
  return { guard: guardPublicForm, counts, calls: () => captchaCalls };
}
const options = {
  scope: 'signup',
  action: 'register',
  signup: true,
  ipMax: 8,
  identityMax: 3,
};

test('names accept international names but reject the spam pattern, markup, controls and overlong values', () => {
  for (const name of [
    '李明',
    'Chinwe Nkwocha',
    'O’Connor',
    'Jean-Luc',
    'María José',
  ])
    assert.equal(policy.validPublicName(name, true), true);
  for (const name of [
    'Mein Ehepartner https://is.gd/6h6Pig',
    '<a href=x>hi</a>',
    'spam.example.com',
    'x'.repeat(81),
    'Name\nBcc: victim',
    {},
  ])
    assert.equal(policy.validPublicName(name, true), false);
  assert.ok(policy.publicFormError({ ...body, password: null }, true));
  assert.ok(policy.publicFormError({ ...body, email: 'bad' }, true));
});
test('a legitimate form passes, preserving the body for the route handler', async () => {
  const f = guardFixture();
  const request = req();
  assert.equal(await f.guard(request, options), null);
  assert.deepEqual(await request.json(), body);
  assert.equal(f.calls(), 1);
});
test('CAPTCHA failure and provider/database outages fail closed', async () => {
  assert.equal(
    (await guardFixture({ captcha: false }).guard(req(), options)).status,
    400,
  );
  assert.equal(
    (await guardFixture({ databaseFails: true }).guard(req(), options)).status,
    503,
  );
});
test('malformed, oversized, honeypot and cross-origin requests never reach CAPTCHA or DB', async () => {
  const f = guardFixture();
  assert.equal(
    (await f.guard(req({ ...body, extra: 'x'.repeat(17000) }), options)).status,
    413,
  );
  assert.equal(
    (await f.guard(req({ ...body, website: 'spam' }), options)).status,
    400,
  );
  assert.equal(
    (await f.guard(req(body, { origin: 'https://attacker.invalid' }), options))
      .status,
    403,
  );
  assert.equal(
    (
      await f.guard(
        new Request('https://www.sureimports.com/api/test', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: '{',
        }),
        options,
      )
    ).status,
    400,
  );
  assert.equal(f.counts.size, 0);
  assert.equal(f.calls(), 0);
});
test('identity limits span alternative endpoints and return Retry-After', async () => {
  const f = guardFixture();
  for (let i = 0; i < 3; i++) assert.equal(await f.guard(req(), options), null);
  const denied = await f.guard(req(), options);
  assert.equal(denied.status, 429);
  assert.equal(denied.headers.get('retry-after'), '900');
});
test('parallel requests cannot exceed the IP limit', async () => {
  const f = guardFixture();
  const results = await Promise.all(
    Array.from({ length: 40 }, (_, i) =>
      f.guard(req({ ...body, email: `test${i}@example.invalid` }), options),
    ),
  );
  assert.ok(results.filter((result) => result === null).length <= 8);
  assert.ok(results.some((result) => result?.status === 429));
});
test('CAPTCHA validates configuration, host, action, score and provider failures', async () => {
  let result = {
    success: true,
    score: 0.9,
    action: 'register',
    hostname: 'www.sureimports.com',
  };
  let responseOk = true;
  const verify = (
    env = { NODE_ENV: 'production', GOOGLE_CAPTCHA_SECRET_KEY: 'test-secret' },
  ) =>
    load(
      '../lib/security/recaptcha.ts',
      {
        './localCaptchaBypass': { shouldBypassLocalCaptcha: () => false },
      },
      {
        process: { env },
        fetch: async () => ({ ok: responseOk, json: async () => result }),
      },
    ).verifyRecaptchaToken;
  assert.equal(await verify()('token', req(), 'register'), true);
  assert.equal(
    await verify({ NODE_ENV: 'production' })('token', req(), 'register'),
    false,
  );
  for (const patch of [
    { hostname: 'attacker.invalid' },
    { hostname: undefined },
    { action: 'login' },
    { score: 0.1 },
    { score: NaN },
    { score: 2 },
    { success: false },
  ]) {
    const original = result;
    result = { ...result, ...patch };
    assert.equal(await verify()('token', req(), 'register'), false);
    result = original;
  }
  responseOk = false;
  assert.equal(await verify()('token', req(), 'register'), false);
});
