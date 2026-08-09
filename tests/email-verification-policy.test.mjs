import assert from 'node:assert/strict';
import test from 'node:test';

import { getEmailVerificationLinkStatus } from '../lib/auth/emailVerificationPolicy.ts';

test('an already verified account remains successful when its link is reopened', () => {
  assert.equal(
    getEmailVerificationLinkStatus('VERIFIED', 'the-original-code'),
    'already_verified',
  );
});

test('the current verification code is accepted for an unverified account', () => {
  assert.equal(
    getEmailVerificationLinkStatus('current-code', 'current-code'),
    'valid',
  );
});

test('an outdated or missing verification code is rejected', () => {
  assert.equal(
    getEmailVerificationLinkStatus('new-code', 'old-code'),
    'invalid',
  );
  assert.equal(getEmailVerificationLinkStatus(null, 'code'), 'invalid');
  assert.equal(getEmailVerificationLinkStatus('code', ''), 'invalid');
});
