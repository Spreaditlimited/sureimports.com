import test from 'node:test';
import assert from 'node:assert/strict';
import { shopSearchPatterns } from '../lib/shop/search.ts';

const matches = (query, name) => shopSearchPatterns(query).every(pattern => new RegExp(pattern, 'i').test(name));

test('all words must match, regardless of order or whitespace', () => {
  assert.ok(matches('  PRO\t15 iphone  ', 'iPhone 15 Pro 256GB'));
  assert.ok(!matches('iphone 15 pro', 'iPhone 18 Pro 256GB'));
});
test('model numbers do not match storage numbers or warranty descriptions', () => {
  assert.ok(matches('iphone 12', 'iPhone 12 Pro 512GB'));
  assert.ok(!matches('iphone 12', 'iPhone 18 Pro 512GB'));
  assert.ok(!matches('iphone 12', 'iPhone 15 128GB'));
});
test('brand, capacity and partial text are searchable', () => {
  assert.ok(matches('sams 256', 'Samsung Galaxy S24 256GB'));
  assert.ok(matches('256GB iphone', 'iPhone 12 256GB'));
});
test('regex punctuation is literal and empty search has no restrictions', () => {
  assert.ok(!matches('.*', 'iPhone 12'));
  assert.ok(matches('S24+', 'Samsung S24+'));
  assert.deepEqual(shopSearchPatterns(' \t '), []);
});
