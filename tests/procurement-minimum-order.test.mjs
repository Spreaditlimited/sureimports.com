import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DEFAULT_PROCUREMENT_MINIMUM_ORDER_NGN,
  formatNairaAmount,
  normalizeProcurementMinimumOrderNgn,
  procurementMinimumOrderMessage,
} from '../lib/procurement/minimumOrder.ts';

test('uses ₦50,000 as the safe default procurement minimum', () => {
  assert.equal(DEFAULT_PROCUREMENT_MINIMUM_ORDER_NGN, 50_000);
  assert.equal(normalizeProcurementMinimumOrderNgn(undefined), 50_000);
  assert.equal(formatNairaAmount(50_000), '₦50,000');
});

test('accepts an admin-configured whole-number minimum, including zero', () => {
  assert.equal(normalizeProcurementMinimumOrderNgn(75_000), 75_000);
  assert.equal(normalizeProcurementMinimumOrderNgn(0), 0);
});

test('builds the payment validation message from the configured minimum', () => {
  assert.equal(
    procurementMinimumOrderMessage(65_000),
    'We cannot process Nigeria-bound procurement orders below ₦65,000. Please edit your order before paying.',
  );
});
