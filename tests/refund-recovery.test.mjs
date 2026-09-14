import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import crypto from 'node:crypto';

function load(file, imports = {}) {
  const code = ts.transpileModule(fs.readFileSync(new URL('../lib/refunds/' + file, import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
  const exports = {};
  new Function('exports', 'require', code)(exports, name => {
    if (name === 'server-only') return {};
    if (name === 'node:crypto') return crypto;
    if (name in imports) return imports[name];
    throw Error('Unexpected dependency: ' + name);
  });
  return exports;
}
const money = load('money.ts');
const policy = load('paypal-policy.ts', { './money': money });

function engine({ provider, remaining = [], claim = 1, query } = {}) {
  const mutations = [], calls = [];
  const db = {
    payments: { findUnique: async () => ({ txRef: 'ORDER123', amount: '100.00' }) },
    refund_records: { update: async input => mutations.push(['refund', input]) },
    $executeRaw: async (sql, ...values) => {
      mutations.push([sql.join('?'), values]);
      return sql.join('').includes("firstAttemptAt IS NULL") ? claim : 1;
    },
    $queryRaw: async sql => query ? query(sql.join('')) : sql.join('').includes("status NOT IN ('SETTLED','SUPERSEDED')") ? remaining : [],
    $transaction: async fn => fn(db),
  };
  const api = load('paypal-settlement.ts', {
    '@/lib/prisma': { prisma: db }, './money': money, './paypal-policy': policy,
    './paypal-client': { paypalRefundRequest: async (...args) => { calls.push(args); return provider(...args); } },
  });
  return { ...api, mutations, calls };
}
const leg = { id: 'RFP123', refundId: 'RF123', paymentId: 'P123', captureId: 'CAP123', currency: 'USD', amount: '10.00', status: 'REQUESTED', providerReference: null, firstAttemptAt: null };
const completed = { id: 'PROVIDER123', status: 'COMPLETED', amount: { currency_code: 'USD', value: '10.00' }, invoice_id: 'RFP123' };
const capture = { id: 'CAP123', status: 'COMPLETED', amount: { currency_code: 'USD', value: '100.00' } };

test('manual lost-response recovery fetches the named refund without initiating a new one',async()=>{
  const run=engine({provider:()=>completed,query:sql=>sql.includes('SELECT method')?[{method:'PAYPAL'}]:sql.includes('SELECT * FROM refund_provider_legs')?[{...leg,status:'PROCESSING',firstAttemptAt:new Date()}]:sql.includes('SELECT status FROM refund_settlements')?[{status:'SETTLED'}]:[]});
  const result=await run.checkOriginalPayPalRefund('RF123','ADMIN',{legId:leg.id,providerReference:'PROVIDER123'});
  assert.equal(result.status,'SETTLED');
  assert.deepEqual(run.calls,[['/refunds/PROVIDER123']]);
});
test('status-only check cannot initiate an unattempted refund',async()=>{
  const run=engine({provider:()=>{throw Error('Unexpected provider request');},query:sql=>sql.includes('SELECT method')?[{method:'PAYPAL'}]:sql.includes('SELECT * FROM refund_provider_legs')?[leg]:sql.includes('SELECT status FROM refund_settlements')?[{status:'REQUESTED'}]:[]});
  assert.equal((await run.checkOriginalPayPalRefund('RF123','ADMIN')).status,'REQUESTED');
  assert.equal(run.calls.length,0);
});
test('recovery rejects a reference for an unattempted or different payment part',async()=>{
  const run=engine({query:sql=>sql.includes('SELECT method')?[{method:'PAYPAL'}]:sql.includes('SELECT * FROM refund_provider_legs')?[leg]:[]});
  await assert.rejects(run.checkOriginalPayPalRefund('RF123','ADMIN',{legId:leg.id,providerReference:'PROVIDER123'}),/matching PayPal refund reference/);
  assert.equal(run.calls.length,0);
});

test('unapproved refunds cannot initiate provider money movement', async () => {
  const run = engine({ provider: () => { throw Error('Must not call provider'); } });
  await run.reconcileRefundLeg(leg);
  assert.equal(run.calls.length, 0);
});
test('a lost initial response is recovered by invoice identity without another POST', async () => {
  const run = engine({ provider: path => path.startsWith('/orders/') ? { purchase_units: [{ payments: { refunds: [completed] } }] } : completed });
  await run.reconcileRefundLeg({ ...leg, status: 'PROCESSING', firstAttemptAt: new Date() });
  assert.deepEqual(run.calls.map(c => c[0]), ['/orders/ORDER123', '/refunds/PROVIDER123']);
  assert.ok(run.calls.every(c => c.length === 1));
  assert.equal(run.mutations.filter(m => m[0] === 'refund').length, 1);
});
test('missing or ambiguous recovery evidence never resends or settles', async () => {
  for (const refunds of [[], [completed, completed]]) {
    const run = engine({ provider: () => ({ purchase_units: [{ payments: { refunds } }] }) });
    await run.reconcileRefundLeg({ ...leg, status: 'PROCESSING', firstAttemptAt: new Date() }, true);
    assert.equal(run.calls.length, 1);
    assert.equal(run.mutations.filter(m => m[0] === 'refund').length, 0);
  }
});
test('concurrent approval losing its claim cannot POST a refund', async () => {
  const run = engine({ claim: 0, provider: () => capture });
  await run.reconcileRefundLeg(leg, true);
  assert.deepEqual(run.calls.map(c => c[0]), ['/captures/CAP123']);
});
test('completed legs do not complete the refund while another leg is pending', async () => {
  const run = engine({ remaining: [{ id: 'other' }], provider: () => completed });
  await run.reconcileRefundLeg({ ...leg, providerReference: completed.id });
  assert.equal(run.mutations.filter(m => m[0] === 'refund').length, 0);
});
test('timeout keeps the first-attempt marker and never marks the refund settled', async () => {
  const run = engine({ provider: path => { if (path.endsWith('/refund')) throw Error('Timeout'); return capture; } });
  await assert.rejects(run.reconcileRefundLeg(leg, true), /Timeout/);
  assert.ok(run.mutations.some(m => m[0].includes('firstAttemptAt=NOW')));
  assert.equal(run.mutations.filter(m => m[0] === 'refund').length, 0);
});
test('mismatched canonical provider response cannot change settlement', async () => {
  const run = engine({ provider: () => ({ ...completed, invoice_id: 'OTHER' }) });
  await assert.rejects(run.reconcileRefundLeg({ ...leg, providerReference: completed.id }));
  assert.equal(run.mutations.filter(m => m[0].includes("status='SETTLED'")).length, 0);
});
test('duplicate already-settled event does not make any provider or data call', async () => {
  const run = engine({ provider: () => completed });
  await run.reconcileRefundLeg({ ...leg, status: 'SETTLED' });
  assert.equal(run.calls.length, 0);
  assert.equal(run.mutations.length, 0);
});

test('minimal provider response saves its reference and fetches canonical details', async () => {
  const run = engine({ provider: path => path === '/captures/CAP123' ? capture : path.endsWith('/refund') ? { id: completed.id, status: 'COMPLETED' } : completed });
  await run.reconcileRefundLeg(leg, true);
  assert.deepEqual(run.calls.map(c => c[0]), ['/captures/CAP123', '/captures/CAP123/refund', '/refunds/PROVIDER123']);
  assert.ok(run.mutations.some(m => m[0].includes('providerReference IS NULL')));
  assert.equal(run.mutations.filter(m => m[0] === 'refund').length, 1);
});

test('notification failure schedules retry without changing financial settlement', async () => {
  const statements = [];
  const db = {
    $executeRaw: async (sql, ...values) => { statements.push([sql.join('?'), values]); return 1; },
    $queryRaw: async sql => sql.join('').includes('FROM refund_notifications') ? [{ refundId: 'REF1', eventType: 'SETTLED' }] : [{ pidUser: 'USER1', settlementCurrency: 'GBP', settlementAmount: '75', method: 'BANK', status: 'SETTLED' }],
    users: { findUnique: async () => ({ userEmail: 'nobody@example.invalid' }) },
  };
  const old = process.env.SMTP_EMAIL;
  process.env.SMTP_EMAIL = 'test@example.invalid';
  try {
    const api = load('notifications.ts', { '@/lib/prisma': { prisma: db }, '@/lib/email/config/nodemailerConfig': { sendMail: async () => { throw Error('Offline'); } }, '@/lib/email/temp/mailTemplate2': () => '<html></html>' });
    assert.deepEqual(await api.reconcileRefundNotifications(), { checked: 1, sent: 0 });
    assert.ok(statements.some(([sql]) => sql.includes('nextAttemptAt=DATE_ADD')));
    assert.ok(statements.every(([sql]) => !sql.includes('UPDATE refund_settlements') && !sql.includes('UPDATE refund_records')));
  } finally { if (old === undefined) delete process.env.SMTP_EMAIL; else process.env.SMTP_EMAIL = old; }
});

test('a settled refund supersedes a delayed requested email', async () => {
  const statements = [];
  const db = {
    $executeRaw: async sql => { statements.push(sql.join('')); return 1; },
    $queryRaw: async sql => sql.join('').includes('FROM refund_notifications') ? [{ refundId: 'REF1', eventType: 'REQUESTED' }] : [{ status: 'SETTLED' }],
  };
  const api = load('notifications.ts', { '@/lib/prisma': { prisma: db }, '@/lib/email/config/nodemailerConfig': { sendMail: async () => { throw Error('Must not send stale message'); } }, '@/lib/email/temp/mailTemplate2': () => '' });
  assert.deepEqual(await api.reconcileRefundNotifications(), { checked: 1, sent: 0 });
  assert.ok(statements.some(sql => sql.includes("status='SUPERSEDED'")));
});

test('bank settlement validates exact frozen currency/amount, ownership confirmation and source', async () => {
  const refund = { amount: '100', currency: 'USD', refundStatus: 'requested' };
  const settlement = { sourceAmount: '100', sourceCurrency: 'USD', settlementAmount: '75', settlementCurrency: 'GBP', status: 'REQUESTED', method: 'BANK' };
  const writes = [];
  const db = { $queryRaw: async sql => sql.join('').includes('FROM refund_records') ? [refund] : [settlement], $executeRaw: async (...a) => writes.push(a), refund_records: { update: async a => writes.push(a) } };
  const api = load('settle-bank.ts', { '@/lib/prisma': { prisma: { $transaction: fn => fn(db) } }, './money': money });
  const input = { refundId: 'RF1', reference: 'BANK123', adminId: 'ADMIN1', confirmedAmount: '75.00', confirmedCurrency: 'GBP', destinationVerified: true };
  for (const override of [{ confirmedAmount: '74.99' }, { confirmedCurrency: 'USD' }, { destinationVerified: false }, { reference: '' }]) await assert.rejects(api.confirmForeignBankRefund({ ...input, ...override }));
  assert.equal(writes.length, 0);
  assert.deepEqual(await api.confirmForeignBankRefund(input), { amount: '75', currency: 'GBP' });
  assert.equal(writes.length, 2);
  settlement.status = 'SETTLED';
  await assert.rejects(api.confirmForeignBankRefund(input));
  assert.equal(writes.length, 2);
});
