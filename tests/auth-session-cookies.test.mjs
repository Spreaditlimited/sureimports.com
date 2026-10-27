import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
const name = 'sureimports.com';
const root = fileURLToPath(new URL('..', import.meta.url)),
  requireRoot = createRequire(root + '/package.json');
const ts = requireRoot('typescript'),
  { NextResponse } = requireRoot('next/server');
const policy = requireRoot(root + '/lib/auth/session-policy.mjs');
function load(file, mocks) {
  const mod = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(root + '/' + file, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText;
  vm.runInNewContext('(function(require,module,exports){' + code + '\n})', {
    process,
    Date,
    console,
    Buffer,
    URL,
    URLSearchParams,
    Request,
    Response,
  })(
    (id) =>
      id in mocks ? mocks[id] : id === 'server-only' ? {} : requireRoot(id),
    mod,
    mod.exports,
  );
  return mod.exports;
}
for (const remember of [false, true])
  test(
    remember
      ? 'remembered session has 30-day cookie'
      : 'unchecked session has no persistent expiry',
    async () => {
      let cookie;
      if (name === 'affiliate.sureimports.com') {
        const mod = load('lib/auth/session.ts', {
          'next/headers': {
            cookies: async () => ({
              set: (key, value, options) => {
                const r = NextResponse.json({});
                r.cookies.set(key, value, options);
                cookie = r.headers.get('set-cookie');
              },
            }),
          },
          react: { cache: (x) => x },
          '@/lib/prisma': {
            prisma: { affiliate_sessions: { create: async () => {} } },
          },
          '@/lib/security/crypto': {
            randomToken: () => 'test',
            secureFingerprint: () => 'hash',
          },
          './config': { SESSION_COOKIE: 'session', SESSION_DAYS: 30 },
          './session-policy.mjs': policy,
        });
        await mod.createSession(1, undefined, undefined, remember);
      } else if (name === 'linescout') {
        const mod = load('lib/customer-auth.ts', {
          '@/lib/auth/session-policy.mjs': policy,
          '@/lib/db': { db: {} },
          '@/lib/password-security': {
            newToken: () => 'test',
            hashToken: () => 'hash',
          },
        });
        const r = await mod.issueSession(
          { execute: async () => {} },
          new Request('https://linescout.sureimports.com'),
          '1',
          '/dashboard',
          remember,
        );
        cookie = r.headers.get('set-cookie');
      } else {
        const mod = load('app/api/auth/login/route.ts', {
          // Security rejection paths are covered in public-form-security.test.mjs.
          '@/lib/security/publicFormGuard': {
            guardPublicForm: async () => null,
          },
          '@/lib/auth/session-policy.mjs': policy,
          bcryptjs: { compare: async () => true, compareSync: () => true },
          '@/lib/jwt': { generateToken: () => 'test' },
          '@/lib/helpers/randomGenerator': () => 'test',
          '@/lib/security/recaptcha': {
            verifyRecaptchaToken: async () => true,
          },
          '@/lib/prisma': {
            prisma: {
              users: {
                findUnique: async () => ({
                  pidUser: 'test',
                  userEmail: 'test@example.com',
                  userPassword: 'hash',
                  loginStatus: 'ACTIVE',
                }),
                findFirst: async () => ({
                  pidUser: 'test',
                  userEmail: 'test@example.com',
                  userPassword: 'hash',
                  userStatus: 'ACTIVE',
                  loginStatus: 'ACTIVE',
                }),
              },
            },
          },
          '@/lib/affiliate/attribution': {
            claimAffiliateAttribution: async () => null,
          },
        });
        const r = await mod.POST(
          new Request('https://www.sureimports.com/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({
              userEmail: 'test@example.com',
              userPassword: 'test',
              rememberMe: remember,
            }),
          }),
        );
        cookie = r.headers.get('set-cookie');
      }
      if (
        !cookie ||
        cookie.includes('Max-Age=2592000') !== remember ||
        (!remember && /Expires=|Max-Age=/i.test(cookie))
      )
        throw Error(name + ' invalid persistence ' + remember);
      if (!/HttpOnly/i.test(cookie) || !/SameSite=lax/i.test(cookie))
        throw Error('Cookie protection missing');
    },
  );
