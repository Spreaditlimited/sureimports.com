const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const path = require('node:path');
function load(file, mocks = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
  vm.runInNewContext(code, { exports, require: name => {
    if (name in mocks) return mocks[name];
    if (name.startsWith('.')) return load(path.resolve(path.dirname(file), name) + '.ts', mocks);
    if (name.startsWith('@/')) return load(name.slice(2) + '.ts', mocks);
    return require(name);
  }, URL, Date, Number, String, JSON, process: { env: {} }, console }, { filename: file });
  return exports;
}
const draft = load('lib/procurement/publicDraft.ts');
const product = () => ({ ...draft.emptyProduct(), id: 'one', productName: 'Test item', productLink: 'https://detail.1688.com/offer/123.html', productPrice: '12.50', productWeight: '0.5', productQuantity: '2', currency: 'CNY' });
test('detects marketplace from full URLs and share text, never hostname lookalikes', () => {
  assert.equal(draft.inspectProductLink('See https://detail.1688.com/offer/123.html').shop.id, '1688');
  assert.equal(draft.inspectProductLink('https://www.alibaba.com/product-detail/123.html').shop.currency, 'USD');
  assert.equal(draft.inspectProductLink('https://1688.com.evil.example/product').shop, undefined);
  assert.equal(draft.inspectProductLink('https://1688.com@evil.example/product').url, null);
});
test('rejects mixed currencies even when manually confirmed', () => {
  assert.match(draft.productProblem({ ...product(), productLink: 'https://alibaba.com/product/1', linkConfirmed: true }, '1688', 'CNY'), /separate order/);
});
test('website changes block checkout until link and price are reviewed', () => {
  assert.match(draft.productProblem({ ...product(), review: true, linkConfirmed: true }, 'taobao', 'CNY'), /review and confirm/);
  assert.equal(draft.productProblem({ ...product(), linkConfirmed: true }, 'taobao', 'CNY'), null);
});
test('unknown and shortened links require explicit confirmation', () => {
  const p = { ...product(), productLink: 'https://short.example/123' };
  assert.match(draft.productProblem(p, '1688', 'CNY'), /confirm the website/);
  assert.equal(draft.productProblem({ ...p, linkConfirmed: true }, '1688', 'CNY'), null);
});
test('shipping changes need measurement review and optional notes can be empty', () => {
  assert.match(draft.productProblem({ ...product(), measurementReview: true }, '1688', 'CNY'), /measurement/);
  assert.equal(draft.productProblem(product(), '1688', 'CNY'), null);
  assert.match(draft.productProblem({ ...product(), productQuantity: '1.5' }, '1688', 'CNY'), /whole-number/);
});
test('draft schema round trips multiple products and unfinished input without losing review flags', () => {
  const value = { version: 1, draftId: 'draft-1234567890123456', shop: '1688', currency: 'CNY', destinationCountry: 'NG', shippingPlan: 'AIR', orderCategory: 'Other Goods', products: [product(), { ...product(), id: 'two', review: true }], current: { ...draft.emptyProduct(), productLink: 'unfinished' } };
  const restored = draft.publicDraftSchema.parse(JSON.parse(JSON.stringify(value)));
  assert.equal(JSON.stringify(restored), JSON.stringify(value));
  assert.equal(draft.publicDraftSchema.safeParse({ version: 7 }).success, false);
});
function apiSetup() {
  const orders = new Map(); let productCount = 0;
  const prisma = { orders: {
    findUnique: async ({ where }) => orders.get(where.pidOrder) || null,
    findFirst: async () => [...orders.values()][0] || null,
    create: async ({ data }) => { if (orders.has(data.pidOrder)) throw new Error('Unique constraint'); orders.set(data.pidOrder, data); return data; },
  }, products: { createMany: async ({ data }) => { productCount += data.length; } } };
  prisma.$transaction = async fn => fn(prisma);
  const route = load('app/api/public/procurement/bootstrap-order/route.ts', {
    '@/lib/prisma': { prisma }, '@/lib/jwt': { verifyToken: token => token === 'valid' ? { pidUser: 'customer' } : null, generateToken: () => 'test-token' },
    '@/lib/auth/resolvePublicAccount': { resolvePublicAccount: async () => ({ status: 'ready', user: { pidUser: 'customer', userEmail: 'test@example.invalid' }, createdNewAccount: false }) },
    '@/lib/facebookCapi': { sendFacebookLeadCapiEvent: async () => {} },
    '@/lib/procurement/shippingPricing': { resolveNewProcurementShippingPricing: async (country, plan) => { if (country !== 'NG' || plan !== 'AIR') throw new Error('Invalid shipping selection'); return { version: 2, measurementUnit: 'KG', rate: 10, rateCurrency: 'USD' }; } },
  });
  const payload = () => ({ draftId: 'draft-1234567890123456', shop: '1688', order: { destinationCountry: 'NG', shippingPlan: 'AIR', currencyType: 'CNY', orderCategory: 'Other Goods' }, products: [product(), { ...product(), id: 'two' }] });
  const send = (body, authenticated = true) => route.POST({ json: async () => body, cookies: { get: () => authenticated ? { value: 'valid' } : undefined }, headers: new Headers() });
  return { send, payload, orders, count: () => productCount };
}
test('guest cannot create an order', async () => { const a = apiSetup(); const r = await a.send(a.payload(), false); assert.equal(r.status, 401); assert.equal(a.orders.size, 0); });
test('sign-in creates all products once with generated name and deferred address', async () => {
  const a = apiSetup(); const body = a.payload();
  const responses = await Promise.all([a.send(body), a.send(body)]);
  for (const r of responses) assert.equal((await r.json()).statusx, 'SUCCESS');
  assert.equal(a.orders.size, 1); assert.equal(a.count(), 2);
  const order = [...a.orders.values()][0]; assert.match(order.orderName, /^China order/); assert.equal(order.shippingAddress, '');
  assert.equal((await (await a.send(body)).json()).statusx, 'SUCCESS'); assert.equal(a.count(), 2);
});
test('server rejects review flags, mixed currencies and invalid shipping', async () => {
  for (const mutate of [p => { p.products[0].review = true; }, p => { p.products[0].productLink = 'https://alibaba.com/product/1'; }, p => { p.order.shippingPlan = 'UNKNOWN'; }]) {
    const a = apiSetup(); const p = a.payload(); mutate(p); assert.equal((await a.send(p)).status, 400); assert.equal(a.orders.size, 0);
  }
});
test('existing order warning preserves a distinct draft until separate order is chosen', async () => {
  const a = apiSetup(); await a.send(a.payload()); const second = { ...a.payload(), draftId: 'draft-9876543210987654' };
  assert.equal((await (await a.send(second)).json()).statusx, 'EXISTING_SAVED_ORDERS'); assert.equal(a.count(), 2);
  assert.equal((await (await a.send({ ...second, allowSeparateOrder: true })).json()).statusx, 'SUCCESS'); assert.equal(a.orders.size, 2); assert.equal(a.count(), 4);
});

test('delivery update enforces ownership, saved status and optimistic concurrency', async () => {
  let captured;
  let changed = 1;
  const route = load('app/api/procurement/delivery/route.ts', {
    '@/lib/procurement/shippingPricing': { resolveNewProcurementShippingPricing: async () => ({ version: 2, measurementUnit: 'KG', rate: 10, rateCurrency: 'USD' }) },
    '@/lib/prisma': { prisma: { orders: { findFirst: async () => ({ destinationCountry: 'NG', shippingPlan: 'AIR', shippingPricingVersion: 2, shippingMeasurementUnit: 'KG' }), updateMany: async args => { captured = args; return { count: changed }; } } } },
    '@/lib/procurement/assistance': { requireProcurementUser: async () => ({ pidUser: 'owner' }) },
    '@/lib/refunds/request-auth': { sameOriginMutation: () => true },
  });
  const body = { pidOrder: 'order', orderName: 'My order', shippingAddress: '12 Test Street, Lagos, Nigeria', orderCategory: 'Other Goods', updatedAt: '2026-10-17T10:00:00.000Z' };
  assert.equal((await route.PATCH({ json: async () => body })).status, 200);
  assert.equal(captured.where.pidUser, 'owner'); assert.equal(captured.where.status, 'saved'); assert.equal(captured.where.mergedIntoOrderId, null);
  assert.equal(captured.where.updatedAt.toISOString(), body.updatedAt);
  changed = 0; assert.equal((await route.PATCH({ json: async () => body })).status, 409);
  assert.equal((await route.PATCH({ json: async () => ({ ...body, shippingAddress: '' }) })).status, 400);
});
test('saved order cannot be paid before its delivery address is supplied', async () => {
  const order = { pidOrder: 'order', status: 'saved', currencyType: 'CNY', destinationCountry: 'NG', shippingPlan: 'AIR', shippingPricingVersion: 2, shippingMeasurementUnit: 'KG', shippingRateSnapshot: 10, shippingRateCurrency: 'USD', shippingAddress: '' };
  const lifecycle = load('lib/procurement/orderLifecycle.ts', {
    '@/lib/prisma': { prisma: {
      orders: { findFirst: async () => order }, products: { findMany: async () => [{ productCategory: 'OTHER', productPrice: 100, productQuantity: 10, shippingMeasurePerUnit: 1 }] },
      country: { findUnique: async () => ({ countryName: 'Nigeria' }) }, shippingplan: { findUnique: async () => ({ shippingPlanName: 'AIR_SHIPPING', shippingPlanRate: 10, shippingPlanUnit: 'KG' }) },
      exchange_rate: { findUnique: async () => ({ exNairaToDollar: '1500', exYuanToDollar: '7', exNairaToYuan: '220', serviceCharge: '10', vat: '7.5' }) }, $queryRaw: async () => [],
    } },
  });
  assert.equal((await lifecycle.getProcurementOrderLifecycle('order')).payment.isPayable, false);
  order.shippingAddress = '12 Test Street, Lagos';
  assert.equal((await lifecycle.getProcurementOrderLifecycle('order')).payment.isPayable, true);
});

test('older browser drafts default goods category without losing products',()=>{const value={version:1,draftId:'old',shop:'1688',currency:'CNY',destinationCountry:'NG',shippingPlan:'AIR',products:[product()],current:draft.emptyProduct()};const restored=draft.publicDraftSchema.parse(value);assert.equal(restored.orderCategory,'Other Goods');assert.equal(restored.products[0].id,'one');});
test('saved-order category edits reject Normal shipping and accept a compatible replacement', async () => {
  let captured;
  const existing = { destinationCountry: 'UK', shippingPlan: 'normal', shippingPricingVersion: 2, shippingMeasurementUnit: 'KG' };
  const route = load('app/api/procurement/delivery/route.ts', {
    '@/lib/prisma': { prisma: {
      orders: { findFirst: async () => existing, updateMany: async args => { captured = args; return { count: 1 }; } },
      country: { findUnique: async ({ select }) => ({ countryName: 'United Kingdom', shippingPlans: [{ shippingPlanName: select.shippingPlans.where.pidShippingPlan === 'normal' ? 'NORMAL_SHIPPING' : 'SPECIAL_SHIPPING', shippingPlanRate: 12 }] }) },
    } },
    '@/lib/procurement/assistance': { requireProcurementUser: async () => ({ pidUser: 'owner' }) },
    '@/lib/refunds/request-auth': { sameOriginMutation: () => true },
  });
  const body = { pidOrder: 'order', orderName: 'Battery order', shippingAddress: '12 Test Street, London', orderCategory: 'Goods with Battery', updatedAt: '2026-10-17T10:00:00.000Z' };
  assert.equal((await route.PATCH({ json: async () => body })).status, 400);
  assert.equal(captured, undefined);
  assert.equal((await route.PATCH({ json: async () => ({ ...body, shippingPlan: 'special' }) })).status, 200);
  assert.equal(captured.data.shippingPlan, 'special');
  assert.equal(captured.data.shippingRateSnapshot, 12);
  assert.equal(captured.data.orderCategory, 'Goods with Battery');
});
test('Nigeria phones and laptops need no measurement; other destinations and accessories still do', () => {
  for (const productCategory of ['PHONE', 'LAPTOP']) {
    const item = { ...product(), productCategory, productWeight: '', measurementReview: true };
    assert.equal(draft.productProblem(item, '1688', 'CNY', 'Nigeria'), null);
    assert.match(draft.productProblem(item, '1688', 'CNY', 'United Kingdom'), /measurement/);
    assert.match(draft.productProblem({ ...item, productCategory: 'OTHER' }, '1688', 'CNY', 'Nigeria'), /measurement/);
  }
});
test('add-product API waives measurement only for Nigeria devices and stores zero', async () => {
  let country = 'Nigeria', saved;
  const db = {
    orders: { findFirst: async () => ({ destinationCountry: 'country', status: 'saved', shippingPricingVersion: 2 }) },
    country: { findUnique: async () => ({ countryName: country }) },
    products: { create: async ({ data }) => { saved = data; return data; } },
  };
  const route = load('app/api/crud/procurement-add-product/route.ts', {
    '@prisma/client': { PrismaClient: function () { return db; } },
    '@/lib/procurement/assistance': { requireProcurementUser: async () => ({ pidUser: 'owner' }) },
  });
  const body = { ...product(), pidProduct: 'product', pidOrder: 'order', productCategory: 'PHONE', productWeight: '' };
  let result = await route.POST({ json: async () => body });
  assert.equal((await result.json()).responsex.status, 'SUCCESS');
  assert.equal(saved.shippingMeasurePerUnit, 0);
  saved = undefined;
  country = 'United Kingdom';
  result = await route.POST({ json: async () => body });
  assert.equal(result.status, 400);
  assert.equal(saved, undefined);
  country = 'Nigeria';
  result = await route.POST({ json: async () => ({ ...body, productCategory: 'OTHER' }) });
  assert.equal(result.status, 400);
});
