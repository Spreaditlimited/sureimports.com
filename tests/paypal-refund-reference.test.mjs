import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import ts from 'typescript';
const api={};new Function('exports',ts.transpileModule(fs.readFileSync(new URL('../lib/refunds/paypal-reference.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(api);
test('refund ID is never treated as its capture ID',()=>assert.equal(api.paypalCaptureReference('PAYMENT.CAPTURE.REFUNDED',{id:'REFUND123'}),''));
test('refund up link identifies the original capture',()=>assert.equal(api.paypalCaptureReference('PAYMENT.CAPTURE.REFUNDED',{id:'REFUND123',links:[{rel:'up',href:'https://api-m.paypal.com/v2/payments/captures/CAPTURE123'}]}),'CAPTURE123'));
test('untrusted and malformed links cannot supply capture linkage',()=>{
 for(const href of ['https://api-m.paypal.com.evil.test/v2/payments/captures/CAPTURE123','http://api-m.paypal.com/v2/payments/captures/CAPTURE123','https://api-m.paypal.com/v2/payments/refunds/REFUND123','not a URL'])assert.equal(api.paypalCaptureReference('PAYMENT.CAPTURE.REFUNDED',{links:[{rel:'up',href}]}),'');
});
test('capture and dispute events retain direct transaction linkage',()=>{
 assert.equal(api.paypalCaptureReference('PAYMENT.CAPTURE.COMPLETED',{id:'CAPTURE123'}),'CAPTURE123');
 assert.equal(api.paypalCaptureReference('CUSTOMER.DISPUTE.CREATED',{disputed_transactions:[{seller_transaction_id:'CAPTURE123'}]}),'CAPTURE123');
});
