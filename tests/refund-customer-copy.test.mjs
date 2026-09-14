import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

const read = (path) => fs.readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const exports = {};
new Function('exports', ts.transpileModule(read('lib/refunds/customer-copy.ts'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText)(exports);

test('refund progress explains customer outcomes without exposing internal states', () => {
  for (const status of ['REQUESTED', 'PROCESSING', 'SETTLED', 'FAILED', 'PROVIDER_UNKNOWN']) {
    const message = exports.refundProgressMessage(status, 'PAYPAL');
    assert.ok(message.length > 30);
    assert.ok(!message.includes(status));
  }
  assert.match(exports.refundProgressMessage('SETTLED', 'WALLET'), /added to your Sure Imports wallet/);
  assert.match(exports.refundProgressMessage('PROCESSING', 'PAYPAL'), /being processed/);
  assert.doesNotMatch(exports.refundProgressMessage('PROCESSING', 'PAYPAL'), /has been processed|has been added/);
});

test('refund form does not surface raw browser exceptions', () => {
  const source = read('components/InternationalRefundRequest.tsx');
  assert.doesNotMatch(source, /error\.message|throw new Error\(data\.message\)/);
  assert.match(source, /Refresh to check its status before trying again/);
});

test('wallet activation never forwards a provider error to the customer', () => {
  const source = read('lib/wallet/paystackProvisioning.ts');
  assert.doesNotMatch(source, /message:\s*String\(accountBody/);
  assert.match(source, /We could not activate your wallet right now/);
});

test('public refund records explicitly select fields instead of exposing internal metadata', () => {
  const source = read('app/api/refunds/get-refunds/route.ts');
  assert.match(source, /select:/);
  assert.doesNotMatch(source, /ext1:\s*true|ext2:\s*true|destinationCiphertext:\s*true/);
});
