import test from 'node:test';
import assert from 'node:assert/strict';

import { belongsToSesMarketing, SES_MARKETING_CUTOVER_AT } from '../lib/marketing/cutover.ts';

test('the SES marketing cutover is fixed at midnight London time on 14 August 2026', () => {
  assert.equal(SES_MARKETING_CUTOVER_AT.toISOString(), '2026-08-13T23:00:00.000Z');
});

test('pre-cutover records remain Flodesk-owned', () => {
  assert.equal(belongsToSesMarketing('2026-08-13T22:59:59.999Z'), false);
});

test('records at and after cutover are SES-owned', () => {
  assert.equal(belongsToSesMarketing('2026-08-13T23:00:00.000Z'), true);
  assert.equal(belongsToSesMarketing('2026-08-14T09:00:00.000Z'), true);
});

test('missing or invalid dates cannot cross the cutover', () => {
  assert.equal(belongsToSesMarketing(null), false);
  assert.equal(belongsToSesMarketing('not-a-date'), false);
});
