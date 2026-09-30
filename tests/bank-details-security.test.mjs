import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';
import * as banking from '../lib/banking/verification.ts';
import { refundAmounts, refundDeadline } from '../lib/vehicles/refunds.ts';
const require = createRequire(import.meta.url);
process.env.JWT_SECRET = 'test-only-bank-challenge-secret';
function load(path, mocks = {}) {
  const module = { exports: {} };
  vm.runInNewContext(
    ts.transpileModule(readFileSync(new URL(path, import.meta.url), 'utf8'), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
    }).outputText,
    {
      module,
      exports: module.exports,
      require: (id) => mocks[id] || require(id),
      URL,
      Response,
      Date,
      console,
      Buffer,
    },
  );
  return module.exports;
}
function fixture({
  auth = true,
  valid = true,
  pending = false,
  paystackFails = false,
  sendFails = false,
} = {}) {
  const now = Date.now(),
    code = '123456';
  const challenge = {
    purpose: 'bank_details_update',
    version: 2,
    nonce: 'nonce',
    hash: banking.codeDigest('owner', 'nonce', code),
    issuedAt: now - 61000,
    expiresAt: now + 600000,
    attempts: 0,
    windowAt: now - 61000,
    sends: 1,
    bankCode: '058',
    accountNumber: '0123456789',
  };
  let stored = JSON.stringify(challenge),
    writes = [],
    calls = 0,
    emails = [];
  const bank = {
    bank_name: 'Verified bank',
    bank_code: '058',
    bank_account_number: '0123456789',
    bank_account_name: 'ACTUAL ACCOUNT NAME',
    bank_transfer_code: 'RCP_verified',
  };
  const tx = {
    $queryRaw: async (strings) =>
      strings.join('').includes('vehicle_payment_plans')
        ? pending
          ? [{ orderId: 'order' }]
          : []
        : [{ userExt2: stored }],
    $executeRaw: async (strings, ...values) => {
      writes.push({ sql: strings.join('?'), values });
      return 1;
    },
    users: {
      update: async ({ where, data }) => {
        assert.equal(where.pidUser, 'owner');
        stored = data.userExt2;
        if (data.bank_account_number) writes.push(data);
      },
      updateMany: async ({ where, data }) => {
        if (where.userExt2 === stored) stored = data.userExt2;
        return { count: 1 };
      },
    },
  };
  const mocks = {
    '@/lib/prisma': {
      prisma: { $transaction: async (fn) => fn(tx), users: tx.users },
    },
    '@/lib/banking/request': {
      bankSession: async () =>
        auth ? { pidUser: 'owner', userEmail: 'owner@example.com' } : null,
      bankResponse: (message, status, code = 400) =>
        Response.json(
          { responsex: { message, status }, successx: code === 200 },
          { status: code },
        ),
      submittedBank: (form) => ({
        bankCode: String(form.get('bank_code')),
        accountNumber: String(form.get('bank_account_number')),
      }),
    },
    '@/lib/banking/verification': {
      ...banking,
      validateBank: async () => {
        calls++;
        if (paystackFails) throw new Error('Paystack unavailable');
        return bank;
      },
    },
    '@/lib/email/xMail': {
      default: async (value) => {
        emails.push(value);
        if (sendFails) throw new Error('mail unavailable');
      },
    },
  };
  const route = load(
    '../app/api/bank-details-2fa/verify-and-update/route.ts',
    mocks,
  );
  const sender = load('../app/api/bank-details-2fa/send-code/route.ts', mocks);
  function request(extra = {}) {
    const f = new FormData();
    for (const [k, v] of Object.entries({
      pidUser: 'attacker-target',
      email: 'attacker@example.com',
      bank_code: '058',
      bank_account_number: '0123456789',
      bank_account_name: 'FAKE NAME',
      verificationCode: valid ? code : '999999',
      ...extra,
    }))
      f.set(k, v);
    return new Request(
      'https://sureimports.com/api/bank-details-2fa/verify-and-update',
      { method: 'POST', body: f },
    );
  }
  return {
    post: (extra) => route.POST(request(extra)),
    send: () => sender.POST(request()),
    writes,
    emails,
    stored: () => JSON.parse(stored),
    calls: () => calls,
  };
}
test('legacy bank-update endpoint cannot write bank details', async () => {
  const { POST } = load('../app/api/bank-details-update/route.ts');
  assert.equal((await POST()).status, 410);
});
test('bank verification requires authenticated session', async () => {
  const c = fixture({ auth: false });
  assert.equal((await c.post()).status, 401);
  assert.equal(c.calls(), 0);
  assert.equal(c.writes.length, 0);
});
test('incorrect codes are counted and blocked before Paystack', async () => {
  const c = fixture({ valid: false });
  for (let i = 0; i < 6; i++) assert.equal((await c.post()).status, 400);
  assert.equal(c.stored().attempts, 5);
  assert.equal(c.calls(), 0);
  assert.equal(c.writes.length, 0);
});
test('code is bound to bank and account, not just customer', async () => {
  const c = fixture();
  assert.equal(
    (await c.post({ bank_account_number: '9999999999' })).status,
    400,
  );
  assert.equal(c.calls(), 0);
});
test('Paystack failure never saves bank fields or verification stamp', async () => {
  const c = fixture({ paystackFails: true });
  assert.equal((await c.post()).status, 400);
  assert.equal(c.writes.length, 0);
});
test('valid code saves only server-validated bank data for session owner and cannot replay', async () => {
  const c = fixture();
  assert.equal((await c.post()).status, 200);
  assert.equal(c.writes[0].bank_account_name, 'ACTUAL ACCOUNT NAME');
  assert.ok(
    c.writes.some((w) => w.sql?.includes('bank_profile_verifications')),
  );
  assert.equal((await c.post()).status, 400);
  assert.equal(c.calls(), 1);
});
test('pending vehicle refund blocks bank account changes', async () => {
  const c = fixture({ pending: true });
  assert.equal((await c.post()).status, 400);
  assert.equal(c.writes.length, 0);
});
test('verification email goes only to session email, hash is stored and resend throttled', async () => {
  const c = fixture();
  assert.equal((await c.send()).status, 200);
  assert.equal(c.emails[0].xEmail, 'owner@example.com');
  assert.equal(c.stored().code, undefined);
  assert.equal((await c.send()).status, 429);
});
test('failed email delivery invalidates code and is not reported as sent', async () => {
  const c = fixture({ sendFails: true });
  assert.equal((await c.send()).status, 503);
  assert.equal(c.stored().attempts, 5);
});
test('expired or malformed legacy challenges cannot be used', () => {
  assert.equal(
    banking.readChallenge(
      JSON.stringify({ code: '123456', purpose: 'bank_details_update' }),
    ),
    null,
  );
  const c = fixture().stored();
  assert.equal(
    banking.challengeMatches(
      { ...c, expiresAt: 0 },
      'owner',
      '123456',
      '058',
      '0123456789',
    ),
    false,
  );
});
test('0.5% deduction uses approved payments and rounds to kobo', () => {
  assert.deepEqual(refundAmounts(1200000000), {
    grossMinor: 1200000000,
    feeMinor: 6000000,
    netMinor: 1194000000,
  });
  assert.equal(refundAmounts(100).feeMinor, 1);
  assert.equal(refundAmounts(0).netMinor, 0);
  assert.throws(() => refundAmounts(-1));
});
test('refund deadline starts at request and skips Lagos weekends and configured holidays', () => {
  assert.equal(
    refundDeadline(new Date('2026-09-25T12:00:00Z'), 7, [
      '2026-10-01',
    ]).toISOString(),
    '2026-10-07T22:59:59.999Z',
  );
  assert.equal(
    refundDeadline(new Date('2026-09-25T23:30:00Z'), 1).toISOString(),
    '2026-09-28T22:59:59.999Z',
  );
});
test('server Paystack validation rejects failed resolution, failed recipients and mismatched bank details', async () => {
  const original = globalThis.fetch;
  process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY = 'test-only-key';
  try {
    for (const mode of [
      'resolve-failed',
      'recipient-failed',
      'wrong-account',
      'wrong-bank',
      'inactive',
    ]) {
      globalThis.fetch = async (url) =>
        String(url).includes('/bank/resolve')
          ? Response.json(
              mode === 'resolve-failed'
                ? { status: false }
                : {
                    status: true,
                    data: {
                      account_number: '0123456789',
                      account_name: 'REAL NAME',
                    },
                  },
            )
          : Response.json({
              status: mode !== 'recipient-failed',
              data: {
                recipient_code: 'RCP_test',
                type: 'nuban',
                currency: 'NGN',
                active: mode !== 'inactive',
                details: {
                  account_number:
                    mode === 'wrong-account' ? '9999999999' : '0123456789',
                  bank_code: mode === 'wrong-bank' ? '044' : '058',
                  bank_name: 'Bank',
                },
              },
            });
      await assert.rejects(banking.validateBank('058', '0123456789'));
    }
    globalThis.fetch = async (url) =>
      String(url).includes('/bank/resolve')
        ? Response.json({
            status: true,
            data: { account_number: '0123456789', account_name: 'REAL NAME' },
          })
        : Response.json({
            status: true,
            data: {
              recipient_code: 'RCP_test',
              type: 'nuban',
              currency: 'NGN',
              active: true,
              details: {
                account_number: '0123456789',
                bank_code: '058',
                bank_name: 'Bank',
              },
            },
          });
    assert.equal(
      (await banking.validateBank('058', '0123456789')).bank_account_name,
      'REAL NAME',
    );
  } finally {
    globalThis.fetch = original;
  }
});
test('bank fingerprint cannot validate a different account, name or recipient', () => {
  const base = {
    bank_code: '058',
    bank_account_number: '0123456789',
    bank_account_name: 'REAL NAME',
    bank_transfer_code: 'RCP_test',
  };
  for (const change of [
    { bank_account_number: '9999999999' },
    { bank_code: '044' },
    { bank_account_name: 'CHANGED' },
    { bank_transfer_code: 'RCP_other' },
  ])
    assert.notEqual(
      banking.bankFingerprint(base),
      banking.bankFingerprint({ ...base, ...change }),
    );
});
test('bank session rejects cross-origin requests and resolves owner from session', async () => {
  let calls=0;
  const {bankSession}=load('../lib/banking/request.ts',{'@/lib/auth/current-user':{currentUser:async()=>{calls++;return {pidUser:'session-owner',userEmail:'owner@example.com'};}}});
  for (const headers of [{},{origin:'https://attacker.example'},{origin:'https://sureimports.com','sec-fetch-site':'cross-site'}]) assert.equal(await bankSession(new Request('https://sureimports.com/api/bank-details-2fa/send-code',{method:'POST',headers})),null);
  assert.equal(calls,0);
  assert.equal((await bankSession(new Request('https://sureimports.com/api/bank-details-2fa/send-code',{method:'POST',headers:{origin:'https://sureimports.com'}}))).pidUser,'session-owner');
});
