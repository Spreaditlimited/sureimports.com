const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
function load(file, deps = {}) {
  const m = { exports: {} };
  new Function('require', 'module', 'exports', ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(id => { if (id in deps) return deps[id]; throw new Error(id); }, m, m.exports);
  return m.exports;
}
const statuses = load('app/dashboard/procurement/constants/order-statuses.ts');
test('display labels retain every existing workflow value and route', () => {
  assert.deepEqual(statuses.PROCUREMENT_STATUS_ITEMS.map(s => s.value), ['saved','pending','approved','pay-for-shipping','in-transit','ready-for-pickup','completed','on-hold','bank-pending-saved-orders','bank-pending-shipping-orders','cancelled']);
  for (const s of statuses.PROCUREMENT_STATUS_ITEMS) assert.equal(s.href, `/dashboard/procurement/view-orders/${s.value}`);
  assert.equal(statuses.procurementStatusLabel('pending'), 'Awaiting approval');
  assert.equal(statuses.procurementStatusLabel('merged'), 'Merged');
});
test('counts require ownership and return zero for empty statuses in one query', async () => {
  let user = null, calls = 0;
  const route = load('app/api/get-data/procurement-count/[pidUser]/[statusx]/route.ts', {
    'next/server': { NextResponse: Response },
    '@/lib/procurement/assistance': { requireProcurementUser: async () => user },
    '@/app/dashboard/procurement/constants/order-statuses': statuses,
    '@/lib/prisma': { prisma: { orders: { groupBy: async args => { calls++; assert.equal(args.where.pidUser, 'owner'); return [{ status: 'saved', _count: { _all: 3 } }, { status: 'merged', _count: { _all: 1 } }]; } } } },
  });
  const context = pidUser => ({ params: Promise.resolve({ pidUser, statusx: 'saved' }) });
  assert.equal((await route.GET(null, context('owner'))).status, 401);
  user = { pidUser: 'owner' };
  assert.equal((await route.GET(null, context('someone-else'))).status, 403);
  assert.equal(calls, 0);
  const response = await route.GET(null, context('owner'));
  const counts = await response.json();
  assert.equal(calls, 1);
  assert.equal(counts.savedOrderCount, 3);
  assert.equal(counts.pendingOrderCount, 0);
  assert.equal(Object.keys(counts).length, 11);
  assert.equal(response.headers.get('cache-control'), 'private, no-store');
});
