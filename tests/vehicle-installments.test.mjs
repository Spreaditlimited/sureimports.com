import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_PLAN_SETTINGS,
  validPlanSettings,
  planTerms,
  moneyMinor,
  moneyDecimal,
  planSchedule,
  activationDate,
  planAllowsPayment,
  planAllowsFulfilment,
} from '../lib/vehicles/installments.ts';
import { readVehicleDraft } from '../lib/vehicles/requestDraft.ts';
const settings = { ...DEFAULT_PLAN_SETTINGS, enabled: true, durationDays: 90 };
test('agreed 30% deposit excludes the 5% fee; landed cost includes shipping', () => {
  const t = planTerms('30000000.00', settings);
  assert.equal(t.depositMinor, 900000000);
  assert.equal(t.feeMinor, 150000000);
  assert.equal(t.totalMinor, 3150000000);
  const schedule = planSchedule(t, '2026-09-30T12:00:00.000Z', t.depositMinor);
  assert.deepEqual(
    schedule.map((r) => r.amountMinor),
    [900000000, 750000000, 750000000, 750000000],
  );
  assert.equal(schedule.at(-1).dueAt, '2026-12-29T12:00:00.000Z');
});
test('money uses exact kobo and enforces safe limits', () => {
  assert.equal(moneyMinor('0.29'), 29);
  assert.equal(moneyDecimal(29), '0.29');
  for (const x of ['-1', '1.001', '1e8', 'Infinity', '90071992547410.00'])
    assert.throws(() => moneyMinor(x));
  assert.throws(() => planTerms('0', settings));
  assert.throws(() => planTerms('90071992547409.91', settings));
});
test('configuration bounds and percentage precision are enforced', () => {
  assert.equal(validPlanSettings(settings), true);
  for (const patch of [
    { depositPercent: 0 },
    { depositPercent: 101 },
    { feePercent: -1 },
    { feePercent: 1.001 },
    { durationDays: 0 },
    { durationDays: 366 },
    { durationDays: 1.5 },
    { revision: 0 },
    { enabled: 'true' },
  ])
    assert.equal(validPlanSettings({ ...settings, ...patch }), false);
});
test('accepted snapshots do not follow later changes to configuration', () => {
  const mutable = { ...settings },
    t = planTerms(1000, mutable);
  mutable.feePercent = 20;
  mutable.durationDays = 30;
  assert.equal(t.feeMinor, 5000);
  assert.equal(t.durationDays, 90);
  assert.equal(t.procurement, 'FULL_PAYMENT');
});
test('split deposits activate on the verified threshold credit date, independent of review order', () => {
  const t = planTerms(1000, settings);
  assert.equal(
    activationDate(t, [
      { amountMinor: 10000, creditedAt: '2026-09-01T10:00:00.000Z' },
    ]),
    null,
  );
  assert.equal(
    activationDate(t, [
      { amountMinor: 20000, creditedAt: '2026-09-03T10:00:00.000Z' },
      { amountMinor: 10000, creditedAt: '2026-09-01T10:00:00.000Z' },
    ]),
    '2026-09-03T10:00:00.000Z',
  );
});
test('odd durations and rounding always sum to the accepted total without extending the term', () => {
  for (const days of [1, 29, 30, 31, 59, 90, 91, 365])
    for (const landed of ['0.01', '10.01', '999999.99']) {
      const t = planTerms(landed, { ...settings, durationDays: days });
      const start = '2026-01-01T00:00:00.000Z';
      const rows = planSchedule(t, start, 0);
      assert.equal(
        rows.reduce((s, r) => s + r.amountMinor, 0),
        t.totalMinor,
      );
      assert.ok(
        rows.every(
          (r) =>
            !r.dueAt || new Date(r.dueAt) - new Date(start) <= days * 86400000,
        ),
      );
    }
  const t = planTerms(100, { ...settings, depositPercent: 100, feePercent: 0 });
  assert.equal(planSchedule(t, null, 0).length, 1);
});
test('extra payments satisfy earliest instalments and early completion closes all obligations', () => {
  const t = planTerms(1000, settings);
  assert.deepEqual(
    planSchedule(t, '2026-01-01T00:00:00.000Z', 55000).map((r) => r.paid),
    [true, true, false, false],
  );
  assert.ok(
    planSchedule(t, '2026-01-01T00:00:00.000Z', t.totalMinor).every(
      (r) => r.paid,
    ),
  );
});
test('only accepted or active plans accept money; only fully paid completed plans allow fulfilment', () => {
  assert.equal(planAllowsPayment(null), true);
  assert.equal(planAllowsFulfilment(null, '0.00'), true);
  for (const status of [
    'REQUESTED',
    'OFFERED',
    'ACCEPTED',
    'ACTIVE',
    'COMPLETED',
    'CANCELLATION_REQUESTED',
    'REFUND_PENDING',
    'REFUNDED',
    'CANCELLED',
  ]) {
    const p = { status };
    assert.equal(planAllowsPayment(p), ['ACCEPTED', 'ACTIVE'].includes(status));
    assert.equal(planAllowsFulfilment(p, '0.00'), status === 'COMPLETED');
    assert.equal(planAllowsFulfilment(p, '0.01'), false);
  }
});
test('public draft retains payment choice through authentication and rejects invented modes', () => {
  const draft = {
    modelSlug: 'ruichi-ec75',
    variantId: 'freight-50',
    quantity: 1,
    requestKey: 'abc',
    customerName: 'Customer',
    phone: '+2348012345678',
    notes: '',
    whatsappConsent: true,
    paymentOption: 'PAY_SMALL_SMALL',
  };
  assert.equal(
    readVehicleDraft(JSON.stringify(draft)).paymentOption,
    'PAY_SMALL_SMALL',
  );
  assert.equal(
    readVehicleDraft(JSON.stringify({ ...draft, paymentOption: 'FREE' })),
    null,
  );
});

test('current default supports six monthly instalments over 180 days', () => {
  const terms = planTerms(1000, { ...DEFAULT_PLAN_SETTINGS, enabled: true });
  assert.equal(terms.durationDays, 180);
  const rows = planSchedule(terms, '2026-01-01T00:00:00.000Z', 0);
  assert.equal(rows.length, 7);
  assert.equal(
    rows.reduce((n, r) => n + r.amountMinor, 0),
    terms.totalMinor,
  );
  assert.equal(
    new Date(rows.at(-1).dueAt) - new Date('2026-01-01T00:00:00.000Z'),
    180 * 86400000,
  );
});
