import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const money = ts.transpileModule(
  fs.readFileSync(new URL('../lib/refunds/money.ts', import.meta.url), 'utf8'),
  {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  },
).outputText;
const moneyExports = {};
new Function('exports', money)(moneyExports);
const code = ts.transpileModule(
  fs.readFileSync(
    new URL('../lib/refunds/paypal-policy.ts', import.meta.url),
    'utf8',
  ),
  {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  },
).outputText;
const exports = {};
new Function('exports', 'require', code)(exports, () => moneyExports);
const { allocateRefund, validatedRefundStatus } = exports;
const c = (id, total, reserved = '0') => ({
  paymentId: id,
  captureId: id,
  currency: 'USD',
  capturedAmount: total,
  reservedAmount: reserved,
});
test('a refund can span initial and additional payments without exceeding either', () => {
  assert.deepEqual(
    allocateRefund('25', 'USD', [c('a', '100', '90'), c('b', '20')]).map(
      (x) => x.amount,
    ),
    ['10.00', '15.00'],
  );
});
test('over-refund, duplicate captures and currency conversion require review', () => {
  assert.throws(() => allocateRefund('101', 'USD', [c('a', '100')]));
  assert.throws(() => allocateRefund('1', 'GBP', [c('a', '100')]));
  assert.throws(() =>
    allocateRefund('1', 'USD', [c('a', '100'), c('a', '100')]),
  );
});
test('pending is not settled; provider amount, currency and request must match', () => {
  const expected = {
    captureId: 'capture',
    currency: 'USD',
    amount: '10.00',
    requestId: 'r1',
  };
  const response = {
    id: 'provider',
    amount: { currency_code: 'USD', value: '10.00' },
    invoice_id: 'r1',
    status: 'PENDING',
  };
  assert.equal(validatedRefundStatus(response, expected), 'PROCESSING');
  assert.equal(
    validatedRefundStatus({ ...response, status: 'COMPLETED' }, expected),
    'SETTLED',
  );
  assert.throws(() =>
    validatedRefundStatus({ ...response, invoice_id: 'r2' }, expected),
  );
  assert.throws(() =>
    validatedRefundStatus(
      { ...response, amount: { currency_code: 'GBP', value: '10.00' } },
      expected,
    ),
  );
});
