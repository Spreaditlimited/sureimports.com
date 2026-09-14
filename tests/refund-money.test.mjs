import test from 'node:test';
import assert from 'node:assert/strict';
import {
  procurementRefund,
  refundSettlementQuote,
  decimalUnits,
  convertMinor,
} from '../lib/refunds/money.ts';

test('non-Nigeria procurement refunds are recorded in USD, including UK orders', () => {
  assert.deepEqual(procurementRefund(100, 'United Kingdom', 1500), {
    currency: 'USD',
    amount: '100.00',
  });
  assert.deepEqual(procurementRefund(100, 'Canada', 1500), {
    currency: 'USD',
    amount: '100.00',
  });
});
test('Naira refunds preserve conversion and existing deduction policy', () => {
  assert.deepEqual(procurementRefund(1.234, 'Nigeria', 1500), {
    currency: 'NGN',
    amount: '1851.00',
  });
  assert.deepEqual(procurementRefund(100, 'Nigeria', 1500), {
    currency: 'NGN',
    amount: '150000.00',
  });
  assert.deepEqual(procurementRefund(100, 'Nigeria', 1500, 2.5), {
    currency: 'NGN',
    amount: '146250.00',
  });
});
test('UK settlement keeps both USD entitlement and GBP amount', () => {
  assert.deepEqual(
    refundSettlementQuote({
      amount: '100.00',
      currency: 'USD',
      customerCountry: 'GB',
      gbpPerUsd: '0.75',
    }),
    {
      sourceCurrency: 'USD',
      sourceAmount: '100.00',
      settlementCurrency: 'GBP',
      settlementAmount: '75.00',
      exchangeRate: '0.75',
    },
  );
});
test('other international refunds stay USD and NGN never becomes GBP', () => {
  assert.equal(
    refundSettlementQuote({
      amount: '20',
      currency: 'USD',
      customerCountry: 'Canada',
    }).settlementCurrency,
    'USD',
  );
  assert.equal(
    refundSettlementQuote({
      amount: '20',
      currency: 'NGN',
      customerCountry: 'GB',
    }).settlementCurrency,
    'NGN',
  );
});
test('decimal conversion rounds to the nearest minor unit without floats', () => {
  assert.equal(decimalUnits('1.005', 2), 101n);
  assert.equal(convertMinor(101n, '0.75'), 76n);
});
test('missing rates and invalid amounts fail closed', () => {
  for (const rate of [undefined, '0', '-1', 'NaN'])
    assert.throws(() =>
      refundSettlementQuote({
        amount: '100',
        currency: 'USD',
        customerCountry: 'UK',
        gbpPerUsd: rate,
      }),
    );
  for (const amount of ['-10', 'NaN', '1e5', '0'])
    assert.throws(() =>
      refundSettlementQuote({
        amount,
        currency: 'USD',
        customerCountry: 'GB',
        gbpPerUsd: '0.75',
      }),
    );
  assert.throws(() => procurementRefund(10, 'Nigeria', 0));
});
