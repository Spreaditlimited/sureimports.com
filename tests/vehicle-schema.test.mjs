import test from 'node:test';
import assert from 'node:assert/strict';
import { vehicleEntitySchema } from '../lib/vehicles/schema.ts';
const vehicle = {
  slug: 'ruichi-ec31s',
  name: 'Ruichi EC31S',
  description: 'Electric truck',
  images: ['https://example.com/truck.jpg'],
  category: 'Cargo trucks',
  powertrain: 'Electric',
  variants: [],
};
test('quotation-only vehicles use WebPage, including reference ranges', () => {
  const result = vehicleEntitySchema({
    ...vehicle,
    variants: [
      {
        id: 'a',
        price: null,
        indicativePrice: { minNgn: 1000000, maxNgn: 2000000 },
      },
    ],
  });
  assert.equal(result['@type'], 'WebPage');
  assert.equal(result.offers, undefined);
  assert.equal(
    result.url,
    'https://www.sureimports.com/cars/models/ruichi-ec31s',
  );
});
test('confirmed configurations use the displayed landed price and configuration URL', () => {
  const result = vehicleEntitySchema({
    ...vehicle,
    variants: [
      { id: 'a b', name: 'Standard', price: { totalNgn: 12345678.25 } },
      { id: 'b', name: 'Pending', price: null },
    ],
  });
  assert.equal(result['@type'], 'Vehicle');
  assert.equal(result.offers.length, 1);
  assert.equal(result.offers[0].price, 12345678.25);
  assert.equal(result.offers[0].priceCurrency, 'NGN');
  assert.equal(result.offers[0].eligibleRegion.name, 'Nigeria');
  assert.ok(result.offers[0].url.endsWith('?configuration=a%20b'));
  assert.equal(result.aggregateRating, undefined);
});
test('missing, zero, negative and nonfinite prices never emit Product subtypes', () => {
  for (const price of [undefined, 0, -1, NaN, Infinity]) {
    assert.equal(
      vehicleEntitySchema({
        ...vehicle,
        variants: [{ price: { totalNgn: price } }],
      })['@type'],
      'WebPage',
    );
  }
  assert.equal(vehicleEntitySchema(vehicle)['@type'], 'WebPage');
});
