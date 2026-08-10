import assert from 'node:assert/strict';
import test from 'node:test';

import { getIntelligenceSubscriptionPaymentError } from '../lib/intelligence/subscriptionPaymentPolicy.ts';

const expected = {
  pidSubscription: 'INTSUB123',
  pidUser: 'CUS123',
  email: 'buyer@example.com',
  plan: 'starter',
  paystackReference: 'SI_INTEL_STARTER_123',
  amountKobo: 2_500_000,
  currency: 'NGN',
  paystackPlanCode: 'PLN_STARTER',
};

function validPayment() {
  return {
    status: 'success',
    reference: expected.paystackReference,
    amount: expected.amountKobo,
    currency: expected.currency,
    email: expected.email,
    plan: { plan_code: expected.paystackPlanCode },
    metadata: {
      product: 'supplier_intelligence',
      pidSubscription: expected.pidSubscription,
      pidUser: expected.pidUser,
      plan: expected.plan,
    },
  };
}

test('accepts the expected Supplier Intelligence subscription payment', () => {
  assert.equal(
    getIntelligenceSubscriptionPaymentError(validPayment(), expected),
    null,
  );
});

test('rejects mismatched subscription payment details', () => {
  const mismatches = [
    ['amount', { amount: 1 }],
    ['currency', { currency: 'USD' }],
    ['reference', { reference: 'WRONG' }],
    ['email', { email: 'other@example.com' }],
    ['plan code', { plan: { plan_code: 'PLN_OTHER' } }],
  ];

  for (const [label, override] of mismatches) {
    assert.ok(
      getIntelligenceSubscriptionPaymentError(
        { ...validPayment(), ...override },
        expected,
      ),
      `${label} mismatch should be rejected`,
    );
  }
});

test('rejects mismatched Supplier Intelligence metadata', () => {
  for (const [field, value] of [
    ['product', 'other_product'],
    ['pidSubscription', 'INTSUB_OTHER'],
    ['pidUser', 'CUS_OTHER'],
    ['plan', 'pro'],
  ]) {
    const payment = validPayment();
    payment.metadata[field] = value;
    assert.ok(getIntelligenceSubscriptionPaymentError(payment, expected));
  }
});
