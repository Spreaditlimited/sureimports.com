import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseShopQuery,
  shopListingHref,
  shopProductSchema,
  productAvailability,
} from '../lib/shop/discovery.ts';

const product = {
  pidProduct: 'PHONE_1',
  productName: 'Samsung S25 256GB - Refurbished',
  productBrand: 'Samsung',
  productPrice: 991700,
  productCondition: 'PRE_OWNED',
  productStatus: 'available',
  productMOQ: 1,
  productCategory: 'phone',
  productDescription: 'An accurately described phone.',
};
test('category, query and page survive crawlable pagination without tracking parameters', () => {
  const q = parseShopQuery({ q: ' S25 ', page: '2', openCart: '1' }, 'phone');
  assert.equal(shopListingHref(q), '/shop/category/phones?q=S25&page=2');
  assert.equal(
    shopListingHref({ ...q, page: 1 }),
    '/shop/category/phones?q=S25',
  );
  assert.equal(shopListingHref({ q: '', category: '', page: 1 }), '/shop');
  for (const page of ['0', '-3', 'oops', 'Infinity', '99999999999999999'])
    assert.equal(parseShopQuery({ page }).page, 1);
});
test('public product schema matches Nigerian price and avoids claiming on-order stock', () => {
  const schema = shopProductSchema(product, 'https://example.com/phone.jpg');
  assert.equal(schema['@type'], 'Product');
  assert.equal(schema.offers.price, 991700);
  assert.equal(schema.offers.priceCurrency, 'NGN');
  assert.equal(schema.offers.availability, undefined);
  assert.equal(schema.offers.eligibleRegion.name, 'Nigeria');
  assert.equal(schema.itemCondition, 'https://schema.org/RefurbishedCondition');
  assert.equal(schema.sku, 'PHONE_1');
  assert.equal(schema.gtin, undefined);
  assert.equal(schema.aggregateRating, undefined);
});
test('unknown stock and condition are not fabricated', () => {
  const schema = shopProductSchema(
    {
      ...product,
      productStatus: null,
      productCondition: null,
      productName: 'Phone',
    },
    'https://example.com/phone.jpg',
  );
  assert.equal(schema.offers.availability, undefined);
  assert.equal(schema.itemCondition, undefined);
  assert.equal(
    productAvailability('unavailable'),
    'https://schema.org/OutOfStock',
  );
  assert.equal(
    shopProductSchema(
      { ...product, productName: 'New Phone', productCondition: 'BRAND_NEW' },
      'https://example.com/phone.jpg',
    ).itemCondition,
    'https://schema.org/NewCondition',
  );
});
test('missing images or invalid prices do not generate invalid or free Product offers', () => {
  for (const price of [null, 0, -10, NaN, Infinity])
    assert.equal(
      shopProductSchema(
        { ...product, productPrice: price },
        'https://example.com/phone.jpg',
      )['@type'],
      'WebPage',
    );
  assert.equal(shopProductSchema(product)['@type'], 'WebPage');
});
test('minimum quantities are carried into offers without changing the unit price', () => {
  const schema = shopProductSchema(
    { ...product, productMOQ: 5 },
    'https://example.com/phone.jpg',
  );
  assert.equal(schema.offers.eligibleQuantity.minValue, 5);
  assert.equal(schema.offers.price, product.productPrice);
});
