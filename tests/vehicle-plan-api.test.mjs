import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';
import * as refunds from '../lib/vehicles/refunds.ts';
const require = createRequire(import.meta.url);
const source = readFileSync(
  new URL('../app/api/vehicles/orders/[id]/plan/route.ts', import.meta.url),
  'utf8',
);
function setup({
  owner = 'customer',
  auth = 'customer',
  status = 'OFFERED',
  expires = '2099-01-01',
  orderStatus = 'QUOTED',
  total = 3150000000,
} = {}) {
  const writes = [],
    events = [];
  const plan = {
    orderId: 'order',
    status,
    expiresAt: expires,
    terms: { revision: 1, totalMinor: total, version: 1 },
  };
  const tx = {
    $queryRaw: async () => [],
    $executeRaw: async (strings, ...values) => {
      writes.push({ sql: strings.join('?'), values });
      return 1;
    },
    vehicle_orders: {
      findFirst: async ({ where }) =>
        where.pidUser === owner ? { id: 'order', status: orderStatus } : null,
    },
  };
  const mocks = {
    '@/lib/prisma': { prisma: { $transaction: async (fn) => fn(tx) } },
    '@/lib/auth/checkAuth': {
      checkAuth: async () => (auth ? { pidUser: auth } : null),
    },
    '@/lib/vehicles/http': {
      sameOrigin: () => {},
      inputText: (v) => {
        if (!v) throw new Error('Required');
        return String(v);
      },
    },
    '@/lib/vehicles/plans': {
      getVehiclePlan: async () => plan,
      getPlanSettings: async () => ({
        refundBusinessDays: 7,
        refundHolidays: [],
      }),
    },
    '@/lib/vehicles/refunds': refunds,
    '@/lib/vehicles/events': {
      vehicleEvent: async (...args) => events.push(args),
    },
  };
  const module = { exports: {} };
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  vm.runInNewContext(compiled, {
    exports: module.exports,
    module,
    require: (id) => mocks[id] || require(id),
    Response,
    Date,
  });
  return {
    writes,
    events,
    post: (body) =>
      module.exports.POST(
        new Request('https://sureimports.com/api/vehicles/orders/order/plan', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(body),
        }),
        { params: Promise.resolve({ id: 'order' }) },
      ),
  };
}
const acceptance = {
  action: 'accept',
  consent: true,
  revision: 1,
  totalMinor: 3150000000,
};
test('acceptance requires authenticated order owner', async () => {
  for (const options of [{ auth: null }, { owner: 'another' }]) {
    const c = setup(options);
    const r = await c.post(acceptance);
    assert.ok(r.status >= 400);
    assert.equal(c.writes.length, 0);
  }
});
test('current unexpired terms and explicit consent are required', async () => {
  for (const [options, body] of [
    [{ expires: '2020-01-01' }, acceptance],
    [{}, { ...acceptance, consent: false }],
    [{}, { ...acceptance, totalMinor: 1 }],
    [{}, { ...acceptance, revision: 9 }],
    [{ status: 'REQUESTED' }, acceptance],
  ]) {
    const c = setup(options);
    assert.equal((await c.post(body)).status, 400);
    assert.equal(c.writes.length, 0);
  }
});
test('acceptance records terms event atomically and replay is harmless', async () => {
  const c = setup();
  assert.equal((await c.post(acceptance)).status, 200);
  assert.equal(c.writes.length, 1);
  assert.equal(c.events.length, 1);
  const replay = setup({ status: 'ACCEPTED' });
  assert.equal((await replay.post(acceptance)).status, 200);
  assert.equal(replay.writes.length, 0);
});
test('cancellation freezes the plan before procurement and cannot bypass supplier-order stage', async () => {
  const c = setup({ status: 'ACTIVE' });
  assert.equal(
    (
      await c.post({
        action: 'cancel_request',
        reason: 'Changed requirements',
        cancellationConsent: true,
      })
    ).status,
    200,
  );
  assert.match(c.writes[0].sql, /CANCELLATION_REQUESTED/);
  const started = setup({
    status: 'COMPLETED',
    orderStatus: 'SUPPLIER_ORDERED',
  });
  assert.equal(
    (await started.post({ action: 'cancel_request', reason: 'Changed' }))
      .status,
    400,
  );
  assert.equal(started.writes.length, 0);
});
