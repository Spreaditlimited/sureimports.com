import assert from 'node:assert/strict';
import test from 'node:test';
import { destinationVatPercent, bankMatchesDestination } from '../lib/procurement/destinationPolicy.ts';

test('VAT follows destination, including configured zero rates', () => {
  assert.equal(destinationVatPercent('Nigeria', '7.5', '20'), 7.5);
  assert.equal(destinationVatPercent('United Kingdom', '7.5', '20'), 20);
  assert.equal(destinationVatPercent('Canada', '7.5', '18'), 18);
  assert.equal(destinationVatPercent('Nigeria', '0', '20'), 0);
  assert.throws(() => destinationVatPercent('', 7.5, 20));
  assert.throws(() => destinationVatPercent('Mexico', 7.5, -1));
});

test('destination limits collection banks, not merely display currency', () => {
  const ng = { country: 'Nigeria', currency: 'NGN' };
  const uk = { country: 'United Kingdom', currency: 'GBP' };
  assert.equal(bankMatchesDestination(ng, 'Nigeria'), true);
  assert.equal(bankMatchesDestination(uk, 'Nigeria'), false);
  assert.equal(bankMatchesDestination(uk, 'Canada'), true);
  assert.equal(bankMatchesDestination(ng, 'Canada'), false);
  assert.equal(bankMatchesDestination(uk, ''), false);
});
