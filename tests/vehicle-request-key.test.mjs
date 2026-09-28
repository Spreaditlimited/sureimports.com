import test from 'node:test';
import assert from 'node:assert/strict';
import { createVehicleRequestKey } from '../lib/vehicles/requestKey.ts';

test('local HTTP fallback produces unique UUIDs compatible with saved request keys', () => {
  const source = { getRandomValues: globalThis.crypto.getRandomValues.bind(globalThis.crypto) };
  const keys = Array.from({ length: 100 }, () => createVehicleRequestKey(source));
  assert.equal(new Set(keys).size, keys.length);
  for (const key of keys) assert.match(key, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
});

test('secure contexts use the native UUID implementation', () => {
  assert.equal(createVehicleRequestKey({randomUUID: () => 'native-key', getRandomValues: () => { throw new Error('Fallback should not run'); }}), 'native-key');
});
