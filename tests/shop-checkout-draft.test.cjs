const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function setup() {
  const data = new Map();
  const storage = { getItem: key => data.get(key) || null, setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key) };
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync('lib/shop/checkoutDraft.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  vm.runInNewContext(code, { exports, window: { localStorage: storage }, Date, JSON, Number });
  return { api: exports, storage };
}
test('guest details survive the authentication round trip', () => {
  const { api } = setup();
  const draft = { name: 'Ada Jane Obi', email: 'ada@example.invalid', address: '12 Example Street, Lagos' };
  assert.equal(api.saveShopCheckoutDraft(draft), true);
  assert.equal(JSON.stringify(api.readShopCheckoutDraft()), JSON.stringify(draft));
  assert.equal(api.splitShopContactName(draft.name).firstName, 'Ada');
  assert.equal(api.splitShopContactName(draft.name).lastName, 'Jane Obi');
  assert.equal(api.SHOP_CHECKOUT_RESUME, '/shop/checkout?resumeCheckout=1');
});
test('expired or malformed drafts are ignored and removed', () => {
  const { api, storage } = setup();
  for (const value of [{ version: 1, expiresAt: 1 }, { version: 2, expiresAt: Date.now() + 10000 }, { version: 1, expiresAt: Date.now() + 10000, name: 23 }]) {
    storage.setItem(api.SHOP_CHECKOUT_DRAFT_KEY, JSON.stringify(value));
    assert.equal(api.readShopCheckoutDraft(), null);
    assert.equal(storage.getItem(api.SHOP_CHECKOUT_DRAFT_KEY), null);
  }
});
test('successful checkout clears saved guest details', () => {
  const { api } = setup();
  api.saveShopCheckoutDraft({ name: 'Ada', email: 'ada@example.invalid', address: 'Lagos' });
  api.clearShopCheckoutDraft();
  assert.equal(api.readShopCheckoutDraft(), null);
});
test('blocked browser storage fails safely', () => {
  const { api, storage } = setup();
  storage.setItem = () => { throw new Error('Blocked'); };
  storage.getItem = () => { throw new Error('Blocked'); };
  assert.equal(api.readShopCheckoutDraft(), null);
  assert.equal(api.saveShopCheckoutDraft({}), false);
});
