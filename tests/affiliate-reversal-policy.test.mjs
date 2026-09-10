import assert from 'node:assert/strict';
import test from 'node:test';

import {
  affiliateOrderReferenceForRefund,
  isCancelableAffiliatePayout,
  paypalEventReversesCommission,
  paystackEventReversesCommission,
} from '../lib/affiliate/reversalPolicy.ts';

test('Paystack refunds and unresolved disputes reverse commissions', () => {
  assert.equal(paystackEventReversesCommission('refund.processed'), true);
  assert.equal(paystackEventReversesCommission('charge.dispute.create'), true);
  assert.equal(paystackEventReversesCommission('charge.dispute.remind'), true);
  assert.equal(paystackEventReversesCommission('charge.dispute.resolve', { refund_amount: 5000 }), true);
  assert.equal(paystackEventReversesCommission('charge.dispute.resolve', { refund_amount: 0 }), false);
  assert.equal(paystackEventReversesCommission('charge.success'), false);
});

test('PayPal refunds, reversals, denials and disputes reverse commissions', () => {
  for (const event of [
    'PAYMENT.CAPTURE.REFUNDED',
    'PAYMENT.CAPTURE.REVERSED',
    'PAYMENT.CAPTURE.DENIED',
    'PAYMENT.CAPTURE.DECLINED',
    'CUSTOMER.DISPUTE.CREATED',
    'CUSTOMER.DISPUTE.RESOLVED',
  ]) assert.equal(paypalEventReversesCommission(event), true);
  assert.equal(paypalEventReversesCommission('PAYMENT.CAPTURE.COMPLETED'), false);
});

test('refund records resolve to the exact commission order namespace', () => {
  assert.equal(affiliateOrderReferenceForRefund('PROCUREMENT', 'ORD-1'), 'procurement:ORD-1');
  assert.equal(affiliateOrderReferenceForRefund('pay-small-small', 'PSS-1'), 'pay-small-small:PSS-1');
  assert.equal(affiliateOrderReferenceForRefund('SHOP', 'SHOP-1'), 'shop:SHOP-1');
  assert.equal(affiliateOrderReferenceForRefund('SUPPLIER_REPORTS', 'REP-1'), 'supplier-report:REP-1');
  assert.equal(affiliateOrderReferenceForRefund('SUPPLIER_VERIFICATION', 'VER-1'), 'supplier-verification:VER-1');
  assert.equal(affiliateOrderReferenceForRefund('SHIPPING_ONLY', 'SHIP-1'), null);
  assert.equal(affiliateOrderReferenceForRefund('PROCUREMENT', null), null);
});

test('only unstarted or failed payouts can be cancelled automatically', () => {
  assert.equal(isCancelableAffiliatePayout('REQUESTED'), true);
  assert.equal(isCancelableAffiliatePayout('FAILED'), true);
  assert.equal(isCancelableAffiliatePayout('PROCESSING'), false);
  assert.equal(isCancelableAffiliatePayout('OTP_REQUIRED'), false);
  assert.equal(isCancelableAffiliatePayout('PAID'), false);
});
