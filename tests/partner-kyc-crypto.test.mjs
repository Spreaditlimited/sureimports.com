import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import test from 'node:test';
import { registerHooks } from 'node:module';
// Next aliases this marker during server builds; emulate only that marker here.
const hook = registerHooks({
  resolve(specifier, context, next) {
    if (specifier === 'server-only')
      return { url: 'data:text/javascript,export {};', shortCircuit: true };
    return next(specifier, context);
  },
});
const { encryptKyc, decryptKyc } = await import(
  '../lib/partners/kyc-crypto.ts'
);
hook.deregister();

test('KYC envelopes are randomized, authenticated and bound to their partner', () => {
  const previous = process.env.AFFILIATE_SECURITY_KEY;
  process.env.AFFILIATE_SECURITY_KEY = randomBytes(32).toString('base64');
  try {
    const data = Buffer.from('Synthetic test document');
    const first = encryptKyc(data, 'partner-a');
    assert.deepEqual(decryptKyc(first, 'partner-a'), data);
    assert.notDeepEqual(first, encryptKyc(data, 'partner-a'));
    assert.throws(() => decryptKyc(first, 'partner-b'));
    first[first.length - 1] ^= 1;
    assert.throws(() => decryptKyc(first, 'partner-a'));
    process.env.AFFILIATE_SECURITY_KEY = '';
    assert.throws(() => encryptKyc(data, 'partner-a'));
  } finally {
    if (previous === undefined) delete process.env.AFFILIATE_SECURITY_KEY;
    else process.env.AFFILIATE_SECURITY_KEY = previous;
  }
});
