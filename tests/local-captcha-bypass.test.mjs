import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

function load(path, env, imports = {}) {
  const exports = {};
  const code = ts.transpileModule(readFileSync(new URL(path, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  vm.runInNewContext(code, {
    exports, process: { env }, URL, URLSearchParams, console,
    require: (name) => imports[name],
    fetch: () => { throw new Error('CAPTCHA network request must not run locally'); },
  });
  return exports;
}

const hosts = ['localhost', 'LOCALHOST.', 'preview.localhost', '127.0.0.1', '::1', '[::1]',
  '0.0.0.0', '192.168.1.173', '10.0.0.2', '172.16.0.1', '172.31.255.254'];

test('development bypass covers loopback, bind address and private LAN hosts', () => {
  const { shouldBypassLocalCaptcha } = load('../lib/security/localCaptchaBypass.ts', { NODE_ENV: 'development' });
  for (const host of hosts) assert.equal(shouldBypassLocalCaptcha(host), true, host);
  for (const host of ['sureimports.com', 'localhost.evil.com', '192.168.999.1', '172.32.0.1', '8.8.8.8']) {
    assert.equal(shouldBypassLocalCaptcha(host), false, host);
  }
});

test('production, test and hosted deployments never allow a host-based bypass', () => {
  for (const env of [{ NODE_ENV: 'production' }, { NODE_ENV: 'test' }, { NODE_ENV: 'development', VERCEL: '1' }]) {
    const { shouldBypassLocalCaptcha } = load('../lib/security/localCaptchaBypass.ts', env);
    for (const host of hosts) assert.equal(shouldBypassLocalCaptcha(host), false, host);
  }
});

test('local token verification succeeds without a token or a Google request', async () => {
  const env = { NODE_ENV: 'development', GOOGLE_CAPTCHA_SECRET_KEY: 'configured-test-secret' };
  const bypass = load('../lib/security/localCaptchaBypass.ts', env);
  const { verifyRecaptchaToken } = load('../lib/security/recaptcha.ts', env, { './localCaptchaBypass': bypass });
  for (const host of ['localhost', '0.0.0.0', '192.168.1.173']) {
    assert.equal(await verifyRecaptchaToken(undefined, new Request(`http://${host}:3001/api/auth/login`), 'login'), true);
  }
});

test('production still rejects missing CAPTCHA tokens with a configured secret', async () => {
  const env = { NODE_ENV: 'production', GOOGLE_CAPTCHA_SECRET_KEY: 'configured-test-secret' };
  const bypass = load('../lib/security/localCaptchaBypass.ts', env);
  const { verifyRecaptchaToken } = load('../lib/security/recaptcha.ts', env, { './localCaptchaBypass': bypass });
  assert.equal(await verifyRecaptchaToken(undefined, new Request('http://localhost:3001/api/auth/login'), 'login'), false);
});
