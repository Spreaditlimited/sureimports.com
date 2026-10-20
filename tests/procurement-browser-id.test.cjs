const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const { webcrypto } = require('node:crypto');
const code = ts.transpileModule(fs.readFileSync('lib/procurement/browserDraftId.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
function generator(crypto) {
  const exports = {};
  vm.runInNewContext(code, { exports, crypto });
  return exports.createBrowserDraftId;
}
test('uses native randomUUID when available', () => {
  const uuid = '57d0a2d2-e666-47d7-9bb9-b1666fa9fd81';
  assert.equal(generator({ randomUUID: () => uuid })(), uuid);
});
test('HTTP mobile previews without randomUUID can create draft and product IDs', () => {
  const createId = generator({ getRandomValues: values => webcrypto.getRandomValues(values) });
  const ids = Array.from({ length: 100 }, () => createId());
  assert.equal(new Set(ids).size, 100);
  for (const id of ids) assert.match(id, /^[a-zA-Z0-9-]{16,80}$/);
});
test('browsers without Web Crypto can still initialize and add products', () => {
  const createId = generator(undefined);
  const ids = Array.from({ length: 100 }, () => createId());
  assert.equal(new Set(ids).size, 100);
  for (const id of ids) assert.match(id, /^[a-zA-Z0-9-]{16,80}$/);
});
