import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CORPORATE_SOURCING_RESUME_PATH,
  DEFAULT_LOGIN_REDIRECT,
  getSafeLoginRedirect,
  PROCUREMENT_RESUME_CHECKOUT_PATH,
  SHIPPING_ONLY_RESUME_PATH,
} from '../lib/auth/loginRedirect.ts';

test('allows the exact public procurement checkout resume route', () => {
  assert.equal(
    getSafeLoginRedirect(PROCUREMENT_RESUME_CHECKOUT_PATH),
    PROCUREMENT_RESUME_CHECKOUT_PATH,
  );
});

test('allows the exact corporate sourcing resume route', () => {
  assert.equal(
    getSafeLoginRedirect(CORPORATE_SOURCING_RESUME_PATH),
    CORPORATE_SOURCING_RESUME_PATH,
  );
});

test('allows the exact shipping-only resume route', () => {
  assert.equal(
    getSafeLoginRedirect(SHIPPING_ONLY_RESUME_PATH),
    SHIPPING_ONLY_RESUME_PATH,
  );
});

test('does not allow an ordinary public page as a post-login redirect', () => {
  assert.equal(
    getSafeLoginRedirect('/buy-from-chinese-websites'),
    DEFAULT_LOGIN_REDIRECT,
  );
});

test('rejects external, protocol-relative, and auth-loop redirects', () => {
  for (const redirect of [
    'https://example.com/steal-session',
    '//example.com/steal-session',
    '/auth/login?next=/dashboard',
  ]) {
    assert.equal(getSafeLoginRedirect(redirect), DEFAULT_LOGIN_REDIRECT);
  }
});
