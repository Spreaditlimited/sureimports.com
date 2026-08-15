import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path) => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('paid automatic accounts use the shared double-opt-in helper', () => {
  const accountResolver = read('lib/auth/resolvePublicAccount.ts');
  assert.match(accountResolver, /requestPublicAccountMarketingOptIn/);
  assert.match(accountResolver, /belongsToSesMarketing\(input\.user\.createdAt\)/);
  assert.match(accountResolver, /requestMarketingOptIn\(/);
});

test('a newly created Supplier Report buyer receives the marketing confirmation', () => {
  const reportOrders = read('lib/intelligence/reportOrders.ts');
  assert.match(reportOrders, /if \(createdNewAccount\)/);
  assert.match(reportOrders, /source: 'paid_supplier_report_account'/);
  assert.match(reportOrders, /requestPublicAccountMarketingOptIn\(/);
});

test('a newly activated Supplier Intelligence account receives the marketing confirmation', () => {
  const subscriptionActivation = read('lib/intelligence/subscriptionActivation.ts');
  assert.match(subscriptionActivation, /subscription\.status !== 'active'/);
  assert.match(subscriptionActivation, /source: 'paid_supplier_intelligence_account'/);
  assert.match(subscriptionActivation, /requestPublicAccountMarketingOptIn\(/);
});

test('a newly created paid Corporate Sourcing account receives the marketing confirmation', () => {
  const paymentVerification = read('app/api/corporate-sourcing/verify/route.ts');
  const requestSubmission = read('app/api/corporate-gifts/route.ts');
  for (const source of [paymentVerification, requestSubmission]) {
    assert.match(source, /source: 'paid_corporate_sourcing_account'/);
    assert.match(source, /requestPublicAccountMarketingOptIn\(/);
  }
});
