import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CORPORATE_SOURCING_RESUME_PATH,
  DEFAULT_LOGIN_REDIRECT,
  getSafeLoginRedirect,
  getIntelligenceSubscriptionResumePath,
  getSupplierReportResumePath,
  PROCUREMENT_RESUME_CHECKOUT_PATH,
  SHIPPING_ONLY_RESUME_PATH,
} from '../lib/auth/loginRedirect.ts';

test('allows the exact public procurement checkout resume route', () => {
  assert.equal(
    getSafeLoginRedirect(PROCUREMENT_RESUME_CHECKOUT_PATH),
    PROCUREMENT_RESUME_CHECKOUT_PATH,
  );
});

test('allows the exact Supplier Intelligence report checkout resume route', () => {
  const path = getSupplierReportResumePath('solar-inverter-suppliers');
  assert.equal(getSafeLoginRedirect(path), path);
});

test('allows the exact Supplier Intelligence subscription resume routes', () => {
  for (const plan of ['starter', 'pro']) {
    const path = getIntelligenceSubscriptionResumePath(plan);
    assert.equal(getSafeLoginRedirect(path), path);
  }
});

test('rejects ordinary Supplier Intelligence public pages as login redirects', () => {
  for (const path of [
    '/supplier-intelligence',
    '/supplier-intelligence/reports/solar-inverter-suppliers',
    '/supplier-intelligence?resumeSubscription=free',
  ]) {
    assert.equal(getSafeLoginRedirect(path), DEFAULT_LOGIN_REDIRECT);
  }
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
