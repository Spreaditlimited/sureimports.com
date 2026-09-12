import assert from 'node:assert/strict';
import test from 'node:test';
import {
  normalizePartnerHostname,
  partnerCollectionBlockReason,
} from '../lib/partners/policy.ts';

test('canonicalizes real domains and rejects URLs, ports and spoofed host strings', () => {
  assert.equal(
    normalizePartnerHostname(' Shop.Example.com. '),
    'shop.example.com',
  );
  for (const value of [
    'https://example.com',
    'example.com:3001',
    'example.com/path',
    'example.com@evil.com',
    '*.example.com',
    '127.0.0.1',
    'a..com',
    '-a.com',
    'localhost',
  ]) {
    assert.equal(normalizePartnerHostname(value), null, value);
  }
});

const partner = {
  status: 'ACTIVE',
  country: 'NG',
  settlementCurrency: 'NGN',
  approvedAt: new Date(),
  bankVerifiedAt: new Date(),
  paystackSubaccountCode: 'ACCT_example',
  liveCollectionEnabled: false,
  settlementPolicy: 'UNCONFIRMED',
};

test('standard split collection is permitted only after all business and bank gates pass', () => {
  assert.equal(partnerCollectionBlockReason({ ...partner, liveCollectionEnabled: true, settlementPolicy: 'PAYSTACK_AUTO_SPLIT' }), null);
});

test('production collection stays blocked, even if toggled on prematurely', () => {
  assert.equal(partnerCollectionBlockReason(partner), 'COLLECTION_DISABLED');
  assert.equal(
    partnerCollectionBlockReason({ ...partner, liveCollectionEnabled: true }),
    'SETTLEMENT_POLICY_UNCONFIRMED',
  );
  assert.equal(
    partnerCollectionBlockReason({
      ...partner,
      liveCollectionEnabled: true,
      settlementPolicy: 'AUTO',
    }),
    'SETTLEMENT_POLICY_UNCONFIRMED',
  );
});

test('country, approval and bank checks fail closed', () => {
  assert.equal(
    partnerCollectionBlockReason({ ...partner, country: 'GH' }),
    'NIGERIA_ONLY',
  );
  assert.equal(
    partnerCollectionBlockReason({ ...partner, settlementCurrency: 'USD' }),
    'NIGERIA_ONLY',
  );
  assert.equal(
    partnerCollectionBlockReason({ ...partner, status: 'SUSPENDED' }),
    'PARTNER_NOT_APPROVED',
  );
  assert.equal(
    partnerCollectionBlockReason({ ...partner, approvedAt: null }),
    'PARTNER_NOT_APPROVED',
  );
  assert.equal(
    partnerCollectionBlockReason({ ...partner, bankVerifiedAt: null }),
    'BANK_NOT_VERIFIED',
  );
});
