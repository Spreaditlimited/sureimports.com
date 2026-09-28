import test from 'node:test';
import assert from 'node:assert/strict';
import { getAdminInvoicingBaseUrl } from '../lib/invoicing/upstream.ts';
test('invoice proxy rejects self-routing including loopback aliases', () => {
 for (const base of ['http://localhost:3000','http://127.0.0.1:3000','http://[::1]:3000']) assert.throws(()=>getAdminInvoicingBaseUrl('http://localhost:3000/api/invoice',base), /configuration/);
 assert.throws(()=>getAdminInvoicingBaseUrl('https://www.sureimports.com/invoice','https://www.sureimports.com'), /configuration/);
 assert.equal(getAdminInvoicingBaseUrl('http://localhost:3000','http://localhost:3001/'),'http://localhost:3001');
 assert.equal(getAdminInvoicingBaseUrl('https://www.sureimports.com','https://admin.sureimports.com'),'https://admin.sureimports.com');
});
