import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const ts = require('typescript');
const jwt = require('jsonwebtoken');
const { NextRequest, NextResponse } = require('next/server');
process.env.JWT_SECRET = 'isolated-attribution-unit-test-secret';
process.env.AFFILIATE_SECURITY_KEY = Buffer.alloc(32, 7).toString('base64');

function harness({ race = false } = {}) {
  const customers = new Map([['C1', { pidUser: 'C1', userEmail: 'customer@example.invalid', userAffiliateRef: null }], ['SELF', { pidUser: 'SELF', userEmail: 'owner@example.invalid', userAffiliateRef: null }]]);
  const refs = [];
  const writes = [];
  let raced = false;
  let auth;
  const affiliates = [
    { id: 1, referralCode: 'ALPHA', status: 'ACTIVE', get emailHash() { return auth.affiliateEmailFingerprint('owner@example.invalid'); } },
    { id: 2, referralCode: 'BRAVO', status: 'ACTIVE', get emailHash() { return auth.affiliateEmailFingerprint('other@example.invalid'); } },
  ];
  const ownerRow = row => row ? { ...row, affiliate: affiliates.find(item => item.id === row.affiliateId) } : null;
  const db = {
    users: {
      findUnique: async ({ where }) => customers.get(where.pidUser) || null,
      updateMany: async ({ where, data }) => { const user = customers.get(where.pidUser); if (!user) return { count: 0 }; Object.assign(user, data); writes.push('mirror'); return { count: 1 }; },
    },
    affiliate_accounts: { findFirst: async ({ where }) => affiliates.find(item => item.referralCode === where.referralCode && item.status === where.status) || null },
    affiliate_referrals: {
      findUnique: async ({ where }) => ownerRow(refs.find(row => row.customerReference === where.customerReference)),
      findFirst: async ({ where }) => ownerRow(refs.find(row => {
        const affiliate = affiliates.find(item => item.id === row.affiliateId);
        return (!where.pidReferral || row.pidReferral === where.pidReferral)
          && (!where.affiliateId || row.affiliateId === where.affiliateId)
          && (!Object.hasOwn(where, 'customerReference') || row.customerReference === where.customerReference)
          && (!where.visitorHash || row.visitorHash === where.visitorHash)
          && (!where.firstTouchAt || row.firstTouchAt >= where.firstTouchAt.gte)
          && (!where.affiliate?.status || affiliate.status === where.affiliate.status)
          && (!where.NOT?.affiliate?.emailHash || affiliate.emailHash !== where.NOT.affiliate.emailHash);
      })),
      count: async () => 0,
      create: async ({ data }) => { const row = { id: refs.length + 1, customerReference: null, claimedAt: null, firstTouchAt: new Date(), ...data }; refs.push(row); writes.push('visit'); return row; },
      update: async ({ where, data }) => { const row = refs.find(item => item.pidReferral === where.pidReferral); Object.assign(row, data); return row; },
      updateMany: async ({ where, data }) => {
        if (race && !raced) { raced = true; refs.push({ id: 99, pidReferral: 'aref_racewinner', affiliateId: 2, customerReference: data.customerReference }); throw Object.assign(Error('Unique constraint'), { code: 'P2002' }); }
        if (refs.some(row => row.customerReference === data.customerReference)) throw Object.assign(Error('Unique constraint'), { code: 'P2002' });
        const row = refs.find(item => item.id === where.id && item.customerReference === null);
        if (!row) return { count: 0 };
        Object.assign(row, data); writes.push('claim'); return { count: 1 };
      },
    },
  };
  function load(file) {
    const exports = {};
    const code = ts.transpileModule(fs.readFileSync(new URL('../' + file, import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
    new Function('exports', 'require', code)(exports, name => {
      if (name === 'server-only') return {};
      if (name === '@/lib/prisma') return { prisma: db };
      if (name === '@/lib/affiliate/attribution') return auth;
      if (name === '@/lib/affiliate/linescoutAttribution') return { LINESCOUT_ATTRIBUTION_COOKIE: 'sure_linescout_attribution', createLineScoutAttributionValue: code => 'LS:' + code };
      if (name === 'next/server') return { NextRequest, NextResponse };
      return require(name);
    });
    return exports;
  }
  auth = load('lib/affiliate/attribution.ts');
  const route = load('app/api/affiliate/track/route.ts');
  const token = (pidUser = 'C1', overrides = {}, sign = {}) => jwt.sign({ pidUser, userEmail: customers.get(pidUser)?.userEmail, ...overrides }, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h', ...sign });
  function request({ session, cookie, code = 'ALPHA', origin = 'https://www.sureimports.com' } = {}) {
    const cookies = [session ? 'token=' + session : '', cookie ? auth.ATTRIBUTION_COOKIE + '=' + cookie : ''].filter(Boolean).join('; ');
    return new NextRequest('https://www.sureimports.com/api/affiliate/track', { method: 'POST', headers: { 'content-type': 'application/json', origin, cookie: cookies, 'x-forwarded-for': '192.0.2.1', 'user-agent': 'isolated-test' }, body: JSON.stringify({ code, landingPath: '/', source: 'test', customerReference: 'FORGED' }) });
  }
  function seed(affiliateId = 1, customerReference = null) {
    const row = { id: refs.length + 1, pidReferral: 'aref_seed' + refs.length, affiliateId, customerReference, claimedAt: customerReference ? new Date() : null, firstTouchAt: new Date(), visitorHash: auth.visitorFingerprint(request()) };
    refs.push(row); return row;
  }
  return { auth, route, request, token, refs, customers, affiliates, writes, seed };
}

test('anonymous clicks remain visits, even if the body supplies a customer ID', async () => {
  const h = harness(); await h.route.POST(h.request());
  assert.equal(h.refs.length, 1); assert.equal(h.refs[0].customerReference, null); assert.ok(!h.writes.includes('claim'));
});
test('signed-in customer is claimed immediately and mirrored to the legacy field', async () => {
  const h = harness(); const response = await h.route.POST(h.request({ session: h.token() }));
  assert.equal(h.refs[0].customerReference, 'C1'); assert.ok(h.refs[0].claimedAt);
  assert.equal(h.customers.get('C1').userAffiliateRef, 'ALPHA');
  assert.equal(response.cookies.get('sure_linescout_attribution').value, 'LS:ALPHA');
});
test('existing anonymous cookie is claimed, retaining first-touch ownership', async () => {
  const h = harness(); const ref = h.seed();
  await h.route.POST(h.request({ session: h.token(), cookie: h.auth.createAttributionValue(ref.pidReferral), code: 'BRAVO' }));
  assert.equal(ref.customerReference, 'C1'); assert.equal(ref.affiliateId, 1); assert.equal(h.refs.length, 1);
});
test('repeat visit without a cookie is claimed', async () => {
  const h = harness(); const ref = h.seed();
  await h.route.POST(h.request({ session: h.token() }));
  assert.equal(ref.customerReference, 'C1'); assert.equal(h.refs.length, 1);
});
test('permanent ownership wins over another affiliate link and cookie', async () => {
  const h = harness(); const owner = h.seed(1, 'C1'); const other = h.seed(2);
  const response = await h.route.POST(h.request({ session: h.token(), code: 'BRAVO', cookie: h.auth.createAttributionValue(other.pidReferral) }));
  assert.equal(h.auth.parseAttributionValue(response.cookies.get(h.auth.ATTRIBUTION_COOKIE).value).referral, owner.pidReferral);
  assert.equal(response.cookies.get('sure_linescout_attribution').value, 'LS:ALPHA'); assert.equal(other.customerReference, null);
});
test('inactive permanent owner is never replaced', async () => {
  const h = harness(); h.seed(1, 'C1'); h.affiliates[0].status = 'SUSPENDED';
  const response = await h.route.POST(h.request({ session: h.token(), code: 'BRAVO' }));
  assert.deepEqual(await response.json(), { attributed: false }); assert.equal(h.refs.length, 1); assert.equal(h.refs[0].affiliateId, 1);
});
test('self-referrals are not claimed, including a pre-existing anonymous cookie', async () => {
  const h = harness(); const ref = h.seed();
  const response = await h.route.POST(h.request({ session: h.token('SELF'), cookie: h.auth.createAttributionValue(ref.pidReferral) }));
  assert.deepEqual(await response.json(), { attributed: false }); assert.equal(ref.customerReference, null);
});
test('a cookie already claimed by another customer is not reused', async () => {
  const h = harness(); const ref = h.seed(1, 'OTHER');
  await h.route.POST(h.request({ session: h.token(), cookie: h.auth.createAttributionValue(ref.pidReferral) }));
  assert.equal(ref.customerReference, 'OTHER'); assert.equal(h.refs.filter(row => row.customerReference === 'C1').length, 1);
});
test('concurrent claims converge on the unique permanent owner', async () => {
  const h = harness({ race: true }); const response = await h.route.POST(h.request({ session: h.token() }));
  assert.equal(h.refs.filter(row => row.customerReference === 'C1').length, 1);
  assert.equal(response.cookies.get('sure_linescout_attribution').value, 'LS:BRAVO');
  assert.equal(h.customers.get('C1').userAffiliateRef, 'BRAVO');
});
test('signup/login claiming uses the same race-safe ownership rule', async () => {
  const h = harness({ race: true }); const ref = h.seed();
  const result = await h.auth.claimAffiliateAttribution(h.request({ cookie: h.auth.createAttributionValue(ref.pidReferral) }), 'C1', 'customer@example.invalid');
  assert.equal(result.referralCode, 'BRAVO');
});
test('expired, altered, wrong-algorithm and mismatched sessions cannot claim visits', async () => {
  for (const make of [h => h.token('C1', {}, { expiresIn: -1 }), h => h.token() + 'bad', h => h.token('C1', {}, { algorithm: 'HS384' }), h => h.token('C1', { userEmail: 'forged@example.invalid' }), h => h.token('MISSING')]) {
    const h = harness(); await h.route.POST(h.request({ session: make(h) }));
    assert.ok(h.refs.every(row => row.customerReference === null));
  }
});
test('cross-origin tracking is denied before any writes', async () => {
  const h = harness(); const response = await h.route.POST(h.request({ session: h.token(), origin: 'https://unrelated.invalid' }));
  assert.equal(response.status, 403); assert.equal(h.writes.length, 0);
});
