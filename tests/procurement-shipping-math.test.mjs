import assert from 'node:assert/strict';
import test from 'node:test';

import {
  finiteNumber,
  lineShippingMeasurement,
  measurementUnitForNewOrder,
  paymentDueInUsd,
  perItemMeasurementForOrder,
  procurementEstimateInUsd,
  refundAmountInNgn,
  shippingCostInUsd,
} from '../lib/procurement/shippingMath.ts';

test('missing legacy snapshots use their configured fallback', () => {
  assert.equal(finiteNumber(null, 1500), 1500);
  assert.equal(finiteNumber(undefined, 7), 7);
  assert.equal(finiteNumber('', 15), 15);
  assert.equal(finiteNumber('   ', 7.5), 7.5);
  assert.equal(finiteNumber('0', 15), 0);
  assert.equal(finiteNumber('12.5', 0), 12.5);
});

test('Nigeria sea shipping uses per-item CBM while every other route uses KG', () => {
  assert.equal(measurementUnitForNewOrder('Nigeria', 'SEA_SHIPPING'), 'CBM');
  assert.equal(measurementUnitForNewOrder('Nigeria', 'NORMAL_SHIPPING'), 'KG');
  assert.equal(measurementUnitForNewOrder('Ghana', 'SEA_SHIPPING'), 'KG');
});

test('a per-item measurement is multiplied by product quantity', () => {
  assert.equal(lineShippingMeasurement(100, 0.1), 10);
  assert.equal(lineShippingMeasurement(25, 0.5), 12.5);
});

test('legacy orders keep productWeight while version 2 orders use the new measurement', () => {
  assert.equal(perItemMeasurementForOrder(null, 2.5, null), 2.5);
  assert.equal(perItemMeasurementForOrder(2, 2.5, 0.1), 0.1);
});

test('NGN CBM rates convert to USD while USD KG rates remain unchanged', () => {
  assert.equal(shippingCostInUsd(10, 500000, 'NGN', 1500), 5000000 / 1500);
  assert.equal(shippingCostInUsd(50, 12, 'USD', 1500), 600);
});

test('NGN pricing rejects an invalid exchange rate', () => {
  assert.throws(() => shippingCostInUsd(1, 500000, 'NGN', 0));
});

test('VAT is applied to the service charge and included once in the grand total', () => {
  assert.deepEqual(procurementEstimateInUsd(100, 20, 15, 7.5), {
    serviceChargeValueUsd: 15,
    vatValueUsd: 1.125,
    grandTotalUsd: 136.125,
  });
});

test('payment due follows the saved, on-hold, and shipping lifecycle snapshots', () => {
  assert.equal(paymentDueInUsd('saved', 500, 0, 0, 0), 500);
  assert.equal(paymentDueInUsd('on-hold', 550, 500, 0, 0), 50);
  assert.equal(paymentDueInUsd('on-hold', 450, 500, 0, 0), 0);
  assert.equal(paymentDueInUsd('pay-for-shipping', 0, 0, 120, 100), 20);
  assert.equal(paymentDueInUsd('pending', 500, 0, 120, 100), 0);
});

test('refunds are converted from the USD calculation base into Naira', () => {
  assert.equal(refundAmountInNgn(100, 1500), 150000);
  assert.equal(refundAmountInNgn(100, 1500, 2.5), 146250);
  assert.throws(() => refundAmountInNgn(100, 0));
});
