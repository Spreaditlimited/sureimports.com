import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizeNigerianPhone } from '../lib/wallet/phone.ts';

test('normalizes common Nigerian mobile number formats', () => {
  assert.equal(normalizeNigerianPhone('0803 123 4567'), '+2348031234567');
  assert.equal(normalizeNigerianPhone('+234-803-123-4567'), '+2348031234567');
  assert.equal(normalizeNigerianPhone('8031234567'), '+2348031234567');
});

test('rejects missing, foreign, and malformed phone numbers', () => {
  assert.equal(normalizeNigerianPhone(null), null);
  assert.equal(normalizeNigerianPhone('+44 7700 900123'), null);
  assert.equal(normalizeNigerianPhone('12345'), null);
});
