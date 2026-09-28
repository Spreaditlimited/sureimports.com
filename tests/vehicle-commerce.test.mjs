import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { cbm, priceVehicle, canQuote, canAdvance, youtubeId } from '../lib/vehicles/policy.ts';
import { getSafeLoginRedirect, DEFAULT_LOGIN_REDIRECT } from '../lib/auth/loginRedirect.ts';

const variant = { id: 'ec75', name: 'Freight', manufacturerRmb: 100000, lengthMm: 5130, widthMm: 1860, heightMm: 2020, cargoM3: 7.7, batteryKwh: 61.94, rangeKm: 420, rangeStandard: '', seats: 2, source: '', priceConfirmed: true, specificationsConfirmed: true };
const rates = { ngnPerRmb: 220, ngnPerCbm: 500000 };
test('login returns to the selected vehicle configuration without permitting external redirects', () => {
  const path = '/cars/models/ruichi-ec75?configuration=passenger-9&quantity=3#enquire';
  assert.equal(getSafeLoginRedirect(path), path);
  for (const bad of ['https://evil.test/cars/models/ruichi-ec75', '//evil.test/cars/models/ruichi-ec75', '/cars/models/../auth/login']) assert.equal(getSafeLoginRedirect(bad), DEFAULT_LOGIN_REDIRECT);
});
test('uses manufacturer markup and exterior CBM; clearing and taxes are not added twice', () => {
  const quote = priceVehicle(variant, rates);
  assert.equal(cbm(variant), 19.274436);
  assert.equal(quote.vehicleNgn, 26400000);
  assert.equal(quote.shippingNgn, 9637218);
  assert.equal(quote.totalNgn, 36037218);
});
test('fleet quantities multiply the vehicle and shipping totals exactly once', () => {
  const single = priceVehicle(variant, rates); const fleet = priceVehicle(variant, rates, 3);
  assert.equal(fleet.totalNgn, single.totalNgn * 3);
  assert.equal(fleet.shippingNgn, single.shippingNgn * 3);
});
test('missing or invalid manufacturer prices, dimensions and rates cannot create prices', () => {
  for (const manufacturerRmb of [null, 0, -1, NaN, Infinity]) assert.equal(priceVehicle({ ...variant, manufacturerRmb }, rates), null);
  for (const heightMm of [null, 0, -1, NaN, Infinity]) assert.equal(priceVehicle({ ...variant, heightMm }, rates), null);
  for (const ngnPerRmb of [0, -1, NaN, Infinity]) assert.equal(priceVehicle(variant, { ...rates, ngnPerRmb }), null);
  for (const ngnPerCbm of [0, -1, NaN, Infinity]) assert.equal(priceVehicle(variant, { ...rates, ngnPerCbm }), null);
});
test('unconfirmed source data remains enquiry-only even when a brochure has a price', () => {
  assert.equal(canQuote({ ...variant, priceConfirmed: false }, rates), false);
  assert.equal(canQuote({ ...variant, specificationsConfirmed: false }, rates), false);
  assert.equal(canQuote(variant, rates), true);
});
test('invalid fleet quantities and unsafe amounts are rejected', () => {
  for (const n of [0, -1, 1.5, 101, NaN]) assert.throws(() => priceVehicle(variant, rates, n));
  assert.throws(() => priceVehicle({ ...variant, manufacturerRmb: 1e20 }, rates));
});
test('quote calculations return snapshots unaffected by later rate edits', () => {
  const workingRates = { ...rates }; const first = priceVehicle(variant, workingRates);
  workingRates.ngnPerRmb = 250;
  assert.equal(first.vehicleNgn, 26400000);
  assert.equal(priceVehicle(variant, workingRates).vehicleNgn, 30000000);
});
test('fulfilment cannot skip stages, reverse, or proceed from unpaid quotation', () => {
  assert.equal(canAdvance('ORDER_CONFIRMED', 'SUPPLIER_ORDERED'), true);
  assert.equal(canAdvance('QUOTED', 'SHIPPED'), false);
  assert.equal(canAdvance('ORDER_CONFIRMED', 'DELIVERED'), false);
  assert.equal(canAdvance('SHIPPED', 'INSPECTED'), false);
  assert.equal(canAdvance('DELIVERED', 'ORDER_CONFIRMED'), false);
});
test('YouTube embeds accept only known hosts and valid video IDs', () => {
  assert.equal(youtubeId('https://youtu.be/abcdefghijk'), 'abcdefghijk');
  assert.equal(youtubeId('https://www.youtube.com/watch?v=abcdefghijk'), 'abcdefghijk');
  assert.equal(youtubeId('https://youtube.com/shorts/abcdefghijk'), 'abcdefghijk');
  for (const s of ['javascript:alert(1)', 'https://youtube.com.evil.test/watch?v=abcdefghijk', 'https://example.com/abcdefghijk', 'https://youtu.be/no']) assert.equal(youtubeId(s), null);
});
test('supplied catalogue prices known configurations and preserves unknown prices', () => {
  const models = JSON.parse(readFileSync(new URL('../lib/vehicles/catalogue.json', import.meta.url), 'utf8'));
  assert.equal(models.length, 10);
  assert.equal(new Set(models.map(m => m.slug)).size, models.length);
  for (const model of models) {
    assert.ok(model.variants.length);
    assert.equal(new Set(model.variants.map(v => v.id)).size, model.variants.length);
    for (const v of model.variants) { assert.ok(cbm(v) > 0); assert.equal(canQuote(v, rates), v.manufacturerRmb !== null); }
  }
  for (const slug of ['ruichi-ec75','ruichi-r5','ruichi-c9','ruichi-c5l']) assert.ok(models.find(m => m.slug === slug).variants.every(v => v.manufacturerRmb === null));
});


test('vehicle submission resumes after authentication without allowing external redirects', () => {
  assert.equal(getSafeLoginRedirect('/checkout/resume-vehicle'), '/checkout/resume-vehicle');
  assert.equal(getSafeLoginRedirect('//example.com/checkout/resume-vehicle'), DEFAULT_LOGIN_REDIRECT);
});

test('vehicle draft preserves the original idempotency key and consent; invalid drafts cannot resume', async () => {
  const { readVehicleDraft } = await import('../lib/vehicles/requestDraft.ts');
  const draft = { modelSlug: 'ruichi-ec75', variantId: 'passenger-9', quantity: 3, requestKey: 'same-request-key', customerName: 'Test Customer', phone: '+2348000000000', destination: 'Lagos', notes: 'Blue', whatsappConsent: false };
  assert.deepEqual(readVehicleDraft(JSON.stringify(draft)), draft);
  for (const raw of [null, '{', 'null', JSON.stringify({...draft, quantity: 0}), JSON.stringify({...draft, modelSlug: '//example.com'}), JSON.stringify({...draft, whatsappConsent: 'yes'})]) assert.equal(readVehicleDraft(raw), null);
});
