import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';

const state = {
  order: null,
  products: [],
  checkouts: [],
  payments: [],
  mails: [],
  conversions: [],
  failUpdate: false,
};
let lock = Promise.resolve();
const copy = (value) => structuredClone(value);
const db = {
  orders: {
    findUnique: async () => copy(state.order),
    update: async ({ data }) => {
      if (state.failUpdate) throw Error('simulated write failure');
      Object.assign(state.order, data);
      return copy(state.order);
    },
    create: async ({ data }) => {
      state.order = copy(data);
      return copy(data);
    },
  },
  products: {
    findMany: async () => copy(state.products),
    createMany: async ({ data }) => {
      state.products.push(...copy(data));
    },
  },
  users: {
    findUnique: async () => ({
      userEmail: 'test@example.test',
      userFirstname: 'Test',
    }),
  },
  payments: {
    findUnique: async ({ where }) =>
      state.payments.find((p) => p.pidPayment === where.pidPayment),
    create: async ({ data }) => {
      assert(!state.payments.some((p) => p.pidPayment === data.pidPayment));
      state.payments.push(copy(data));
    },
  },
  $queryRaw: async (parts, ...values) => {
    const sql = parts.join('?');
    if (sql.includes('FROM orders'))
      return state.order ? [{ pidOrder: state.order.pidOrder }] : [];
    if (sql.includes('WHERE pidOrder='))
      return copy(
        state.checkouts.filter(
          (c) =>
            c.pidOrder === values[0] &&
            ['PENDING', 'REVIEW'].includes(c.status),
        ),
      );
    return copy(state.checkouts.filter((c) => c.reference === values[0]));
  },
  $executeRaw: async (parts, ...v) => {
    const sql = parts.join('?');
    if (sql.startsWith('INSERT')) {
      const [
        reference,
        pidOrder,
        pidUser,
        amountMinor,
        currency,
        snapshotJson,
      ] = v;
      state.checkouts.push({
        reference,
        pidOrder,
        pidUser,
        amountMinor,
        currency,
        snapshotJson,
        status: 'PENDING',
        effectsStatus: 'PENDING',
      });
      return 1;
    }
    if (sql.includes("effectsStatus='PROCESSING'")) {
      const c = state.checkouts.find(
        (c) =>
          c.reference === v[0] &&
          c.status === 'PAID' &&
          c.effectsStatus === 'PENDING',
      );
      if (!c) return 0;
      c.effectsStatus = 'PROCESSING';
      return 1;
    }
    if (sql.includes('SET status=?')) {
      Object.assign(
        state.checkouts.find((c) => c.reference === v.at(-1)),
        { status: v[0], lastError: v[1] },
      );
      return 1;
    }
    if (sql.includes("effectsStatus='DONE'")) {
      state.checkouts.find((c) => c.reference === v[0]).effectsStatus = 'DONE';
      return 1;
    }
    if (sql.includes("effectsStatus='PENDING'")) {
      state.checkouts.find((c) => c.reference === v[0]).effectsStatus =
        'PENDING';
      return 1;
    }
    return 1;
  },
  $transaction: async (fn) => {
    const previous = lock;
    let release;
    lock = new Promise((r) => (release = r));
    await previous;
    const before = copy(state);
    try {
      return await fn(db);
    } catch (e) {
      Object.assign(state, before);
      throw e;
    } finally {
      release();
    }
  },
};
const lifecycle = () => ({
  order: copy(state.order),
  products: copy(state.products),
  productsTotalUsd: 500,
  rates: { ngnPerUsd: 1500 },
  payment: {
    isPayable: true,
    due: 1234.56,
    currency: 'NGN',
    minimumOrderNgn: 100,
    nextStatus: 'pending',
  },
  snapshot: {
    orderTotalCost: '0.82304',
    orderWeight: '1',
    orderShippingCost: '0.1',
    exchangeRate1: '1500',
    exchangeRate2: '7',
    exchangeRate3: '220',
    productPricingVersion: 2,
  },
});
globalThis.__recovery = { state, db, lifecycle };
const inline = (s) => ({
  url: 'data:text/javascript,' + encodeURIComponent(s),
  shortCircuit: true,
});
const hook = registerHooks({
  resolve(s, c, n) {
    if (s === '@/lib/prisma')
      return inline('export const prisma=globalThis.__recovery.db');
    if (s === '@/lib/procurement/orderLifecycle')
      return inline(
        'export const getProcurementOrderLifecycle=async()=>globalThis.__recovery.lifecycle()',
      );
    if (s === '@/lib/affiliate/commissions')
      return inline(
        'export const AFFILIATE_SERVICE_KEYS={BUY_FROM_CHINESE_WEBSITES:"PROCUREMENT"};export const recordAffiliateConversion=async v=>globalThis.__recovery.state.conversions.push(v)',
      );
    if (s === '@/lib/email/xMail')
      return inline(
        'export default async v=>globalThis.__recovery.state.mails.push(v)',
      );
    return n(s, c);
  },
});
const api = await import('../lib/procurement/paystackCheckout.ts');
hook.deregister();
function reset() {
  Object.assign(state, {
    order: {
      id: 1,
      pidOrder: 'order',
      pidUser: 'user',
      status: 'saved',
      orderNote: null,
      updatedAt: null,
    },
    products: [
      {
        id: 1,
        pidProduct: 'product',
        pidOrder: 'order',
        productPrice: 10,
        productQuantity: 1,
      },
    ],
    checkouts: [],
    payments: [],
    mails: [],
    conversions: [],
    failUpdate: false,
  });
}
const payment = (c) => ({
  id: 123,
  reference: c.reference,
  status: 'success',
  currency: 'NGN',
  amount: 123456,
  channel: 'card',
  paid_at: '2026-11-23T10:00:00Z',
  metadata: {
    service_id: 'order',
    consumer_id: 'user',
    service_name: 'PROCUREMENT',
  },
});

test('closed browser: durable checkout settles independently, concurrent webhook/callback writes one payment and sends one receipt', async () => {
  reset();
  const c = await api.createProcurementCheckout('order', 'user');
  assert.equal(state.checkouts.length, 1);
  assert.equal(state.payments.length, 0);
  const frozen = JSON.parse(state.checkouts[0].snapshotJson);
  assert.equal(frozen.products.length, 1);
  const outcomes = await Promise.all([
    api.settleProcurementCheckout(c.reference, payment(c)),
    api.settleProcurementCheckout(c.reference, payment(c)),
  ]);
  assert.equal(state.order.status, 'pending');
  assert.equal(state.payments.length, 1);
  assert.equal(state.payments[0].amount, 1234.56);
  assert.equal(state.order.exchangeRate1, '1500');
  assert.equal(outcomes.filter((o) => o.duplicate).length, 1);
  assert.equal(state.mails.length, 2);
  assert.equal(state.conversions.length, 1);
});
test('wrong amount, currency, order, owner and reference never write a payment', async () => {
  for (const override of [
    { amount: 1 },
    { currency: 'USD' },
    { reference: 'different' },
    { metadata: { service_id: 'other', consumer_id: 'user' } },
    { metadata: { service_id: 'order', consumer_id: 'other' } },
  ]) {
    reset();
    const c = await api.createProcurementCheckout('order', 'user');
    await assert.rejects(
      api.settleProcurementCheckout(c.reference, {
        ...payment(c),
        ...override,
      }),
    );
    assert.equal(state.payments.length, 0);
    assert.equal(state.order.status, 'saved');
  }
});
test('an expired draft settles at its frozen price; later rate changes cannot reject paid money', async () => {
  reset();
  const c = await api.createProcurementCheckout('order', 'user');
  state.order.status = 'expired-saved';
  state.order.updatedAt = new Date();
  assert.equal(
    (await api.settleProcurementCheckout(c.reference, payment(c))).status,
    'PAID',
  );
  assert.equal(state.order.status, 'pending');
  assert.equal(state.order.orderTotalCost, '0.82304');
});
test('an order edited during checkout retains the payment, blocks another charge and flags manual review', async () => {
  reset();
  const c = await api.createProcurementCheckout('order', 'user');
  state.products[0].productPrice = 20;
  assert.equal(
    (await api.settleProcurementCheckout(c.reference, payment(c))).status,
    'REVIEW',
  );
  assert.equal(state.payments[0].paymentStatus, 'PAID');
  assert.match(state.order.orderNote, /PAYMENT REVIEW REQUIRED/);
  assert.equal(state.order.status, 'pending');
  assert.equal(state.products[0].productPrice, 20);
});
test('a missing order and products are recoverable from the permanent checkout snapshot', async () => {
  reset();
  const c = await api.createProcurementCheckout('order', 'user');
  state.order = null;
  state.products = [];
  assert.equal(
    (await api.settleProcurementCheckout(c.reference, payment(c))).status,
    'REVIEW',
  );
  assert.equal(state.order.pidOrder, 'order');
  assert.equal(state.products[0].pidProduct, 'product');
  assert.equal(state.payments.length, 1);
});
test('write failure rolls back payment and status; the same success can be retried safely', async () => {
  reset();
  const c = await api.createProcurementCheckout('order', 'user');
  state.failUpdate = true;
  await assert.rejects(api.settleProcurementCheckout(c.reference, payment(c)));
  assert.equal(state.payments.length, 0);
  assert.equal(state.checkouts[0].status, 'PENDING');
  state.failUpdate = false;
  await api.settleProcurementCheckout(c.reference, payment(c));
  assert.equal(state.payments.length, 1);
});
test('unresolved checkout blocks a second payment attempt', async () => {
  reset();
  await api.createProcurementCheckout('order', 'user');
  await assert.rejects(
    api.createProcurementCheckout('order', 'user'),
    /already awaiting/,
  );
  assert.equal(state.checkouts.length, 1);
});
