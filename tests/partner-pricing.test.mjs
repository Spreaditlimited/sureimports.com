import assert from 'node:assert/strict';
import test from 'node:test';
import {
  calculatePartnerPricing,
  planPartnerCollection,
} from '../lib/partners/pricing.ts';

const input = {
  currency: 'NGN',
  productCostMinor: 10_000_000,
  shippingMinor: 3_000_000,
  taxMinor: 0,
  otherChargesMinor: 0,
  serviceChargeBps: 1500,
  partnerShareBps: 500,
};

test('15% charge divides into 5% partner and 10% Sure Imports', () => {
  const result = calculatePartnerPricing(input);
  assert.equal(result.serviceChargeMinor, 1_500_000);
  assert.equal(result.partnerEarningsMinor, 500_000);
  assert.equal(result.sureImportsServiceMinor, 1_000_000);
  assert.equal(result.orderTotalMinor, 14_500_000);
  assert.equal(result.sureImportsAllocationMinor, 14_000_000);
});

test('configurable 10% partner share does not change customer service charge', () => {
  const result = calculatePartnerPricing({ ...input, partnerShareBps: 1000 });
  assert.equal(result.partnerEarningsMinor, 1_000_000);
  assert.equal(result.sureImportsServiceMinor, 500_000);
  assert.equal(result.orderTotalMinor, 14_500_000);
});

test('shipping, taxes, other fees and processor fee earn no commission', () => {
  const result = calculatePartnerPricing({
    ...input,
    taxMinor: 50000,
    otherChargesMinor: 70000,
  });
  const plan = planPartnerCollection(result, 200000);
  assert.equal(plan.partnerAllocationMinor, 500000);
  assert.equal(
    plan.customerTotalMinor,
    plan.partnerAllocationMinor +
      plan.sureImportsAllocationMinor +
      plan.processingFeeMinor,
  );
});

test('rounding conserves money down to one kobo', () => {
  for (let amount = 1; amount < 10000; amount++) {
    const r = calculatePartnerPricing({
      ...input,
      productCostMinor: amount,
      partnerShareBps: 1000,
    });
    assert.equal(
      r.partnerEarningsMinor + r.sureImportsServiceMinor,
      r.serviceChargeMinor,
    );
    assert.equal(
      r.partnerEarningsMinor + r.sureImportsAllocationMinor,
      r.orderTotalMinor,
    );
  }
});

test('rejects unsupported currency, invalid rates, fractional/negative/unsafe money', () => {
  for (const change of [
    { currency: 'USD' },
    { partnerShareBps: 1501 },
    { serviceChargeBps: -1 },
    { partnerShareBps: 2.5 },
    { productCostMinor: 0 },
    { shippingMinor: -1 },
    { taxMinor: 1.1 },
    { otherChargesMinor: NaN },
    { productCostMinor: Infinity },
    { productCostMinor: Number.MAX_SAFE_INTEGER },
  ])
    assert.throws(() => calculatePartnerPricing({ ...input, ...change }));
  assert.throws(() =>
    planPartnerCollection(calculatePartnerPricing(input), -1),
  );
});

test('collection planner does not trust modified derived earnings', () => {
  const result = calculatePartnerPricing(input);
  assert.equal(
    planPartnerCollection({ ...result, partnerEarningsMinor: 9999999 }, 0)
      .partnerAllocationMinor,
    500000,
  );
});
