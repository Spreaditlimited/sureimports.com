import assert from 'node:assert/strict';
import test from 'node:test';

import { getSavedOrderCountdown } from '../lib/procurement/savedOrderExpiry.ts';

const createdAt = '2026-09-01T12:00:00.000Z';

test('starts a saved order with 14 days left', () => {
  assert.equal(
    getSavedOrderCountdown(createdAt, Date.parse(createdAt))?.text,
    '14 days left to complete this order',
  );
});

test('warns when four days remain', () => {
  const countdown = getSavedOrderCountdown(
    createdAt,
    Date.parse('2026-09-11T12:00:00.000Z'),
  );

  assert.equal(countdown?.text, '4 days left to complete this order');
  assert.equal(countdown?.tone, 'warning');
});

test('switches to hours and minutes on the final day', () => {
  assert.equal(
    getSavedOrderCountdown(createdAt, Date.parse('2026-09-15T02:00:00.000Z'))
      ?.text,
    '10 hours left to complete this order',
  );
  assert.equal(
    getSavedOrderCountdown(createdAt, Date.parse('2026-09-15T11:30:00.000Z'))
      ?.text,
    '30 minutes left to complete this order',
  );
});

test('marks a saved order as expired after 14 days', () => {
  const countdown = getSavedOrderCountdown(
    createdAt,
    Date.parse('2026-09-15T12:00:00.000Z'),
  );

  assert.equal(countdown?.text, 'Expired — waiting to be removed');
  assert.equal(countdown?.tone, 'urgent');
});

test('does not show a misleading countdown for an invalid date', () => {
  assert.equal(getSavedOrderCountdown('not-a-date'), null);
});
