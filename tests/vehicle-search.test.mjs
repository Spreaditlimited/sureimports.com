import test from 'node:test';
import assert from 'node:assert/strict';
import {
  emptyFilters,
  parseVehicleQuery,
  readVehicleFilters,
  searchVehicles,
} from '../lib/vehicles/search.ts';
const variant = (id, overrides = {}) => ({
  id,
  name: id,
  seats: 5,
  rangeKm: 400,
  rangeStandard: 'CLTC',
  batteryKwh: 60,
  lengthMm: 4455,
  cargoM3: null,
  price: null,
  indicativePrice: null,
  ...overrides,
});
const exact = (total) => ({
  totalNgn: total,
  vehicleNgn: total - 5000000,
  shippingNgn: 5000000,
});
const reference = (min, max) => ({ landedMinNgn: min, landedMaxNgn: max });
const model = (slug, name, category, variants) => ({
  slug,
  name,
  category,
  powertrain: 'Electric',
  description: '',
  images: [],
  youtubeUrls: [],
  variants,
});
const models = [
  model('byd-yuan-plus', 'BYD Yuan Plus (Atto 3)', 'SUVs', [
    variant('reference', { indicativePrice: reference(25000000, 35000000) }),
  ]),
  model('avatr-11', 'Avatr 11', 'SUVs', [
    variant('reference', {
      indicativePrice: reference(60000000, 80000000),
      rangeKm: 700,
    }),
  ]),
  model('ruichi-ec75', 'Ruichi EC75', 'Cargo vans', [
    variant('freight', {
      name: 'Freight',
      seats: 2,
      cargoM3: 7.7,
      price: exact(18000000),
      rangeKm: 340,
    }),
    variant('passenger', {
      name: 'Passenger · 9 seats',
      seats: 9,
      price: exact(35000000),
      rangeKm: 430,
    }),
    variant('refrigerated', {
      name: 'Refrigerated',
      seats: 2,
      price: exact(29000000),
      rangeKm: null,
      cargoM3: 6.3,
    }),
  ]),
  model('changan-lumin', 'Changan Lumin', 'City cars', [
    variant('base', {
      seats: 4,
      lengthMm: 3270,
      batteryKwh: null,
      rangeKm: 301,
    }),
  ]),
];
const search = (patch) => searchVehicles(models, { ...emptyFilters, ...patch });
test('recognises natural-language budget, seats, range and aliases', () => {
  assert.deepEqual(parseVehicleQuery('electric SUV under ₦30m'), {
    tokens: ['electric', 'suv'],
    maxPrice: 30000000,
    range: null,
    seats: null,
    strictRange: false,
  });
  assert.equal(parseVehicleQuery('below NGN 25,000,000').maxPrice, 25000000);
  assert.equal(parseVehicleQuery('under 25 million naira').maxPrice, 25000000);
  assert.equal(parseVehicleQuery('7-seater electric car over 400 km').seats, 7);
  assert.equal(
    parseVehicleQuery('7-seater electric car over 400 km').range,
    400,
  );
  assert.deepEqual(
    search({ q: 'BYD Atto 3' }).map((r) => r.model.slug),
    ['byd-yuan-plus'],
  );
  assert.deepEqual(
    search({ q: 'Avatar 11' }).map((r) => r.model.slug),
    ['avatr-11'],
  );
  assert.deepEqual(
    search({ q: 'Chagnan Lumin' }).map((r) => r.model.slug),
    ['changan-lumin'],
  );
});
test('budget includes shipping, excludes unpriced vehicles, and labels overlapping reference ranges', () => {
  const result = search({ q: 'electric SUV under ₦30m' });
  assert.equal(result.length, 1);
  assert.equal(result[0].budgetOverlap, true);
  assert.equal(search({ maxPrice: '24000000', category: 'SUVs' }).length, 0);
  assert.equal(
    search({ maxPrice: '100000000' }).some(
      (r) => r.model.slug === 'changan-lumin',
    ),
    false,
  );
  assert.equal(search({ q: 'under ₦40m', maxPrice: '20000000' }).length, 1);
});
test('criteria must match the same configuration', () => {
  assert.equal(search({ seats: '7', maxPrice: '25000000' }).length, 0);
  const result = search({ q: '9-seater electric vehicle' });
  assert.equal(result.length, 1);
  assert.deepEqual(
    result[0].variants.map((v) => v.id),
    ['passenger'],
  );
  assert.equal(search({ use: 'delivery', seats: '7' }).length, 0);
  assert.equal(search({ use: 'cold-chain', range: '300' }).length, 0);
  assert.deepEqual(
    search({ q: 'refrigerated van' })[0].variants.map((v) => v.id),
    ['refrigerated'],
  );
});
test('use, cargo, size, range and battery filters use available facts', () => {
  assert.equal(search({ q: 'delivery van' })[0].variants.length, 2);
  assert.deepEqual(
    search({ use: 'family' }).map((r) => r.model.slug),
    ['byd-yuan-plus', 'avatr-11'],
  );
  assert.deepEqual(
    search({ maxLength: '3500' }).map((r) => r.model.slug),
    ['changan-lumin'],
  );
  assert.equal(
    search({ battery: '30' }).some((r) => r.model.slug === 'changan-lumin'),
    false,
  );
  assert.deepEqual(
    search({ cargo: '7' }).flatMap((r) => r.variants.map((v) => v.id)),
    ['freight'],
  );
  assert.equal(
    search({ q: 'over 400 km' }).some((r) => r.model.slug === 'byd-yuan-plus'),
    false,
  );
  assert.equal(
    search({ range: '400' }).some((r) => r.model.slug === 'byd-yuan-plus'),
    true,
  );
  assert.equal(search({ powertrain: 'Diesel' }).length, 0);
});
test('sorting keeps unpriced models last and does not mutate the catalogue', () => {
  assert.deepEqual(
    search({ sort: 'price' }).map((r) => r.model.slug),
    ['ruichi-ec75', 'byd-yuan-plus', 'avatr-11', 'changan-lumin'],
  );
  assert.equal(search({ sort: 'range' })[0].model.slug, 'avatr-11');
  assert.equal(search({ sort: 'seats' })[0].model.slug, 'ruichi-ec75');
  assert.equal(search({ sort: 'newest' })[0].model.slug, 'changan-lumin');
  assert.equal(models[0].slug, 'byd-yuan-plus');
});
test('shareable filters normalise invalid numbers and preserve existing category links', () => {
  const filters = readVehicleFilters(
    new URLSearchParams(
      'category=All+vehicles&maxPrice=-1&range=oops&sort=bad&q=BYD',
    ),
  );
  assert.equal(filters.category, '');
  assert.equal(filters.maxPrice, '');
  assert.equal(filters.range, '');
  assert.equal(filters.sort, 'relevance');
  assert.equal(filters.q, 'BYD');
  assert.equal(search({ q: 'something nonexistent' }).length, 0);
  assert.equal(search(emptyFilters).length, models.length);
});
