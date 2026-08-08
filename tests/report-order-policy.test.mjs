import assert from 'node:assert/strict';
import test from 'node:test';

import {
  isTerminalReportOrderStatus,
  reportDownloadRequiresAccount,
  resolvePayPalAccessStatus,
  resolvePaystackAccessStatus,
} from '../lib/intelligence/reportOrderPolicy.ts';

test('terminal payment states cannot be treated as active', () => {
  for (const status of ['refunded', 'reversed', 'revoked', 'disputed']) {
    assert.equal(isTerminalReportOrderStatus(status), true);
  }
  assert.equal(isTerminalReportOrderStatus('paid'), false);
  assert.equal(isTerminalReportOrderStatus('pending'), false);
});

test('Paystack full refunds revoke permanently and partial refunds enter review', () => {
  assert.equal(
    resolvePaystackAccessStatus('refund.processed', 5000, 5000),
    'refunded',
  );
  assert.equal(
    resolvePaystackAccessStatus('refund.processed', 2500, 5000),
    'disputed',
  );
  assert.equal(
    resolvePaystackAccessStatus('charge.dispute.create', 0, 5000),
    'disputed',
  );
  assert.equal(resolvePaystackAccessStatus('charge.success', 5000, 5000), null);
});

test('PayPal reversals, refunds and disputes block access', () => {
  assert.equal(
    resolvePayPalAccessStatus('PAYMENT.CAPTURE.REFUNDED'),
    'refunded',
  );
  assert.equal(
    resolvePayPalAccessStatus('PAYMENT.CAPTURE.REVERSED'),
    'reversed',
  );
  assert.equal(
    resolvePayPalAccessStatus('CUSTOMER.DISPUTE.CREATED'),
    'disputed',
  );
  assert.equal(resolvePayPalAccessStatus('PAYMENT.CAPTURE.COMPLETED'), null);
});

test('email tokens expire while authenticated order routes always require ownership', () => {
  const now = new Date('2026-08-08T12:00:00.000Z');
  assert.equal(
    reportDownloadRequiresAccount({
      hasToken: true,
      expiresAt: new Date('2026-08-08T12:00:01.000Z'),
      now,
    }),
    false,
  );
  assert.equal(
    reportDownloadRequiresAccount({
      hasToken: true,
      expiresAt: new Date('2026-08-08T11:59:59.000Z'),
      now,
    }),
    true,
  );
  assert.equal(
    reportDownloadRequiresAccount({
      hasToken: false,
      expiresAt: new Date('2026-08-09T12:00:00.000Z'),
      now,
    }),
    true,
  );
});
