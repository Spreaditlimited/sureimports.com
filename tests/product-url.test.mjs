import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizeProductUrl } from '../lib/productUrl.ts';

test('extracts an Alibaba URL from marketplace share text', () => {
  assert.equal(
    normalizeProductUrl(
      '🛒 Found exactly what I needed on Alibaba — check out this product! 👉 https://www.alibaba.com/x/1lB5Wze?ck=pdp',
    ),
    'https://www.alibaba.com/x/1lB5Wze?ck=pdp',
  );
});

test('normalizes a bare product domain to HTTPS', () => {
  assert.equal(
    normalizeProductUrl('www.1688.com/offer/123.html'),
    'https://www.1688.com/offer/123.html',
  );
});

test('rejects text without a web URL', () => {
  assert.equal(normalizeProductUrl('please find this product'), null);
});
