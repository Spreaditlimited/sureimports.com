const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
function load(file, mocks = {}) {
  if (file === 'lib/shop/checkout.ts') mocks = {
    '@/lib/auth/resolvePublicAccount': {}, '@/lib/affiliate/attribution': {},
    './auth': { shopGuestHash: token => require('node:crypto').createHash('sha256').update(token).digest('hex') }, ...mocks,
  };
  const exports = {};
  const code = ts.transpileModule(
    fs.readFileSync(path.join(root, file), 'utf8'),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
      },
    },
  ).outputText;
  vm.runInNewContext(code, {
    exports,
    require: (id) => (id in mocks ? mocks[id] : require(id)),
    console: { log() {}, error() {} },
    process: { env: { NEXT_SECRET_PAYSTACK_SECRET_KEY: 'MOCK_ONLY' } },
    fetch:
      mocks.fetch ||
      (() => {
        throw Error('Network is forbidden in these tests');
      }),
    AbortSignal,
    URL,
    Buffer,
    setTimeout,
    clearTimeout,
  });
  return exports;
}
const policy = load('lib/shop/policy.ts');
const product = {
  pidProduct: 'P1',
  productName: 'Phone',
  productPrice: 1000,
  productVisibility: true,
  productStatus: 'available',
  productMOQ: 1,
  productImage: '',
  productCategory: 'phone',
};
const cart = [{ pidProduct: 'P1', quantity: 2 }];
test('legacy visible products without an explicit availability status remain purchasable', () => {
  assert.equal(policy.priceCart(cart, [{ ...product, productStatus: null }]).amountMinor, 200000);
});
test('quotes use catalogue price, not browser price or title', () => {
  const parsed = policy.cartInput.parse([
    { ...cart[0], productPrice: 1, productName: 'fake' },
  ]);
  const quote = policy.priceCart(parsed, [product]);
  assert.equal(quote.amountMinor, 200000);
  assert.equal(quote.cart[0].productName, 'Phone');
});
for (const quantity of [0, -1, 1.5, 1000, NaN, Infinity, '2'])
  test(`rejects invalid quantity ${quantity}`, () =>
    assert.throws(() =>
      policy.cartInput.parse([{ pidProduct: 'P1', quantity }]),
    ));
test('rejects empty and duplicate product lists', () => {
  assert.throws(() => policy.cartInput.parse([]));
  assert.throws(() => policy.cartInput.parse([...cart, ...cart]));
});
test('rejects hidden, unavailable, missing and zero-price products', () => {
  for (const products of [
    [],
    [{ ...product, productVisibility: false }],
    [{ ...product, productStatus: 'unavailable' }],
    [{ ...product, productPrice: 0 }],
  ])
    assert.throws(() => policy.priceCart(cart, products));
});
test('enforces MOQ and integer minor units', () => {
  assert.throws(() => policy.priceCart(cart, [{ ...product, productMOQ: 3 }]));
  assert.equal(
    policy.priceCart(cart, [{ ...product, productPrice: 14.82 }]).amountMinor,
    2964,
  );
});
const expected = {
  reference: 'SHOP2_test',
  pidUser: 'U1',
  email: 'audit@example.invalid',
  amountMinor: 200000,
  provider: 'PAYSTACK',
};
const payment = {
  reference: expected.reference,
  status: 'success',
  amount: expected.amountMinor,
  currency: 'NGN',
  customer: { email: expected.email },
  metadata: {
    source: 'shop_v2',
    checkoutReference: expected.reference,
    pidUser: expected.pidUser,
  },
};
test('requires matching provider amount, currency, owner, reference and metadata', () => {
  policy.validateShopPayment(expected, payment);
  for (const override of [
    { amount: 1 },
    { currency: 'USD' },
    { status: 'failed' },
    { reference: 'different' },
    { customer: { email: 'different@example.invalid' } },
    { metadata: {} },
  ])
    assert.throws(() =>
      policy.validateShopPayment(expected, { ...payment, ...override }),
    );
});

function serviceFixture({
  provider = 'PAYSTACK',
  balance = 3000,
  affiliateFails = false,
  guest = false,
  existingAccount = false,
} = {}) {
  const quote = policy.priceCart(cart, [product]);
  const row = {
    ...expected,
    customerName: 'Audit User',
    shippingAddress: 'Mock delivery address',
    items: quote.cart,
    provider,
    status: 'PENDING',
    requestKey: 'e0e1b003-caf9-43b8-bc36-e13a895d5127',
  };
  const rows = new Map([[row.reference, row]]);
  if (guest) { row.guestTokenHash = 'a'.repeat(64); row.pidUser = `GUEST_${row.guestTokenHash}`; }
  let account = existingAccount ? { pidUser: 'EXISTING', userEmail: row.email } : null;
  let wallet = { id: 'W1', pidUser: 'U1', currency: 'NGN', balance };
  const records = {
    payments: [],
    orders: [],
    debits: [],
    emails: [],
    effects: 0,
    accounts: 0,
    setups: 0,
  };
  let chain = Promise.resolve();
  const tx = {
    $queryRaw: async () => [],
    shop_checkouts: {
      findUnique: async ({ where }) => rows.get(where.reference),
      update: async ({ where, data }) => {
        Object.assign(rows.get(where.reference), data);
        return rows.get(where.reference);
      },
    },
    wallet: {
      findUnique: async () => ({ ...wallet }),
      findUniqueOrThrow: async () => ({ ...wallet }),
    },
    payments: {
      create: async ({ data }) => {
        records.payments.push(data);
        return data;
      },
    },
    store_sales: {
      create: async ({ data }) => {
        records.orders.push(data);
        return data;
      },
    },
    debits: {
      create: async ({ data }) => {
        records.debits.push(data);
        return data;
      },
    },
  };
  const db = {
    ...tx,
    users: { findUnique: async () => account, findUniqueOrThrow: async () => account },
    shop_checkouts: {
      ...tx.shop_checkouts,
      findUniqueOrThrow: async ({ where }) => rows.get(where.reference),
      updateMany: async ({ where, data }) => {
        const current = rows.get(where.reference);
        if (
          !current ||
          (current.effectsLeaseUntil && current.effectsLeaseUntil > new Date())
        )
          return { count: 0 };
        Object.assign(current, data);
        return { count: 1 };
      },
    },
    $transaction: (fn) => {
      const result = chain.then(() => fn(tx));
      chain = result.catch(() => {});
      return result;
    },
  };
  const service = load('lib/shop/checkout.ts', {
    '@/lib/auth/resolvePublicAccount': {
      resolvePublicAccount: async ({ accountSetupKey }) => {
        if (account) return { status: 'login_required' };
        records.accounts++;
        account = { pidUser: 'NEW_CUSTOMER', userEmail: row.email, loginKey: accountSetupKey, cidStatus: 'MOCK_SETUP' };
        return { status: 'ready', user: account, createdNewAccount: true };
      },
      sendPublicAccountSetupEmail: async () => { records.setups++; },
    },
    '@/lib/prisma': { prisma: db },
    './policy': policy,
    '@/lib/walletLedger': {
      recordWalletDebit: async (_tx, _user, { amount }) => {
        wallet.balance -= amount;
      },
    },
    '@/lib/affiliate/commissions': {
      AFFILIATE_SERVICE_KEYS: { PHONES_AND_LAPTOPS: 'PHONE' },
      recordAffiliateConversion: async () => {
        records.effects++;
        if (affiliateFails) throw Error('Mock affiliate failure');
      },
    },
    '@/lib/email/config/sendEmail': {
      __esModule: true,
      default: async (to) => {
        records.emails.push(to);
      },
    },
  });
  return { service, row, rows, records, wallet: () => wallet, db };
}
test('concurrent callback/webhook fulfillment writes one payment and one set of lines', async () => {
  const f = serviceFixture();
  await Promise.all([
    f.service.finalizeShopCheckout(f.row.reference, payment),
    f.service.finalizeShopCheckout(f.row.reference, payment),
  ]);
  assert.equal(f.records.payments.length, 1);
  assert.equal(f.records.orders.length, 1);
});

test('verified guest payment creates one account and one order, retries remain idempotent', async () => {
  const f = serviceFixture({ guest: true });
  const paid = { ...payment, metadata: { ...payment.metadata, pidUser: f.row.pidUser } };
  await Promise.all([f.service.finalizeShopCheckout(f.row.reference, paid), f.service.finalizeShopCheckout(f.row.reference, paid)]);
  await f.service.finalizeShopCheckout(f.row.reference, paid);
  assert.equal(f.records.accounts, 1);
  assert.equal(f.records.payments.length, 1);
  assert.equal(f.records.orders[0].pidUser, 'NEW_CUSTOMER');
  assert.equal(f.row.accountSetupRequired, true);
  await f.service.processShopEffects(f.row.reference);
  await f.service.processShopEffects(f.row.reference);
  assert.equal(f.records.setups, 1);
});

test('guest purchase attaches to an existing account without creating or changing credentials', async () => {
  const f = serviceFixture({ guest: true, existingAccount: true });
  await f.service.finalizeShopCheckout(f.row.reference, { ...payment, metadata: { ...payment.metadata, pidUser: f.row.pidUser } });
  assert.equal(f.records.accounts, 0);
  assert.equal(f.records.orders[0].pidUser, 'EXISTING');
  assert.equal(f.row.accountSetupRequired, false);
});

test('failed or mismatched guest payment never creates an account or order', async () => {
  const f = serviceFixture({ guest: true });
  await assert.rejects(f.service.finalizeShopCheckout(f.row.reference, { ...payment, status: 'failed' }));
  assert.equal(f.records.accounts, 0);
  assert.equal(f.records.orders.length, 0);
});
test('same wallet attempt retried deducts once', async () => {
  const f = serviceFixture({ provider: 'WALLET' });
  await Promise.all([
    f.service.finalizeShopCheckout(f.row.reference),
    f.service.finalizeShopCheckout(f.row.reference),
  ]);
  assert.equal(f.records.debits.length, 1);
  assert.equal(f.wallet().balance, 1000);
});
test('a Paystack event cannot debit a wallet checkout', async () => {
  const f = serviceFixture({ provider: 'WALLET' });
  await assert.rejects(f.service.finalizeShopCheckout(f.row.reference, payment));
  assert.equal(f.records.debits.length, 0);
});
test('competing wallet orders cannot overdraw balance after lock', async () => {
  const f = serviceFixture({ provider: 'WALLET' });
  f.rows.set('SECOND', { ...f.row, reference: 'SECOND' });
  const result = await Promise.allSettled([
    f.service.finalizeShopCheckout(f.row.reference),
    f.service.finalizeShopCheckout('SECOND'),
  ]);
  assert.equal(result.filter((r) => r.status === 'fulfilled').length, 1);
  assert.equal(f.wallet().balance, 1000);
  assert.equal(f.records.payments.length, 1);
});
test('mismatched payment creates no orders', async () => {
  const f = serviceFixture();
  await assert.rejects(
    f.service.finalizeShopCheckout(f.row.reference, { ...payment, amount: 1 }),
  );
  assert.equal(f.records.payments.length, 0);
});
test('affiliate failure cannot undo payment or prevent customer receipt; it remains retryable', async () => {
  const f = serviceFixture({ affiliateFails: true });
  await f.service.finalizeShopCheckout(f.row.reference, payment);
  await f.service.processShopEffects(f.row.reference);
  assert.equal(f.row.status, 'PAID');
  assert.equal(f.row.affiliateDoneAt, undefined);
  assert.equal(f.records.emails.length, 2);
  assert.ok(f.row.customerEmailSentAt);
});
test('completed post-payment work is not repeated', async () => {
  const f = serviceFixture();
  await f.service.finalizeShopCheckout(f.row.reference, payment);
  await f.service.processShopEffects(f.row.reference);
  await f.service.processShopEffects(f.row.reference);
  assert.equal(f.records.effects, 1);
  assert.equal(f.records.emails.length, 2);
});
test('checkout requires a signed-in session and same-origin mutations', async () => {
  const auth = load('lib/shop/auth.ts', {
    '@/lib/auth/current-user': { currentUser: async () => null },
    './policy': policy,
    'next/server': {
      NextResponse: { json: (body, init) => ({ body, ...init }) },
    },
  });
  await assert.rejects(
    auth.shopUser(
      { url: 'https://example.invalid/api', headers: new Headers() },
      false,
    ),
    (e) => e.status === 401,
  );
  await assert.rejects(
    auth.shopUser(
      {
        url: 'https://example.invalid/api',
        headers: new Headers({ origin: 'https://attacker.invalid' }),
      },
      true,
    ),
    (e) => e.status === 403,
  );
});
test('old unchecked shop wallet endpoint is retired', () =>
  assert.match(
    fs.readFileSync(
      path.join(root, 'app/api/pay-from-wallet/route.ts'),
      'utf8',
    ),
    /status: 410/,
  ));

test('checkout rejects a tampered total, snapshots authoritative fields and reuses a request key', async () => {
  const rows = new Map();
  const db = {
    users: { findUniqueOrThrow: async () => ({ userEmail: expected.email, userFirstname: 'Audit', userLastname: 'Only' }) },
    store: { findMany: async () => [product] },
    shop_checkouts: {
      findUnique: async ({ where }) => rows.get(where.pidUser_requestKey.requestKey),
      create: async ({ data }) => { rows.set(data.requestKey, data); return data; },
    },
  };
  const service = load('lib/shop/checkout.ts', {
    '@/lib/prisma': { prisma: db }, './policy': policy,
    '@/lib/walletLedger': {}, '@/lib/affiliate/commissions': {}, '@/lib/email/config/sendEmail': {},
  });
  const body = { cartItems: cart, shippingAddress: 'Mock delivery address', requestKey: 'e0e1b003-caf9-43b8-bc36-e13a895d5127', totalAmount: 1 };
  await assert.rejects(service.createShopCheckout('U1', body, 'PAYSTACK'), error => error.status === 409);
  assert.equal(rows.size, 0);
  body.totalAmount = 2000;
  const first = await service.createShopCheckout('U1', body, 'PAYSTACK');
  const second = await service.createShopCheckout('U1', body, 'PAYSTACK');
  assert.equal(first.reference, second.reference); assert.equal(rows.size, 1); assert.equal(first.amountMinor, 200000);
  await assert.rejects(service.createShopCheckout('U1', { ...body, shippingAddress: 'Different delivery address' }, 'PAYSTACK'));
  await assert.rejects(service.createShopCheckout('U1', body, 'WALLET'));
  await assert.rejects(service.createShopCheckout('U1', { ...body, totalAmount: -1 }, 'PAYSTACK'));
});

test('Paystack initialization uses the saved total and reuses the same authorization URL', async () => {
  const row = { ...expected, status: 'PENDING', authorizationUrl: null, initializationStartedAt: null };
  const calls = [];
  const service = load('lib/shop/checkout.ts', {
    '@/lib/prisma': { prisma: { shop_checkouts: {
      findUniqueOrThrow: async () => row,
      updateMany: async ({ data }) => { Object.assign(row, data); return { count: 1 }; },
      update: async ({ data }) => { Object.assign(row, data); return row; },
    } } }, './policy': policy,
    '@/lib/walletLedger': {}, '@/lib/affiliate/commissions': {}, '@/lib/email/config/sendEmail': {},
    fetch: async (_url, options) => { calls.push(JSON.parse(options.body)); return { ok: true, json: async () => ({ status: true, data: { reference: row.reference, authorization_url: 'https://checkout.paystack.com/mock-only', access_code: 'MOCK_ONLY' } }) }; },
  });
  await service.initializeShopPaystack(row.reference, 'https://shop.example.invalid', false);
  await service.initializeShopPaystack(row.reference, 'https://shop.example.invalid', false);
  assert.equal(calls.length, 1); assert.equal(calls[0].amount, row.amountMinor);
  assert.equal(calls[0].metadata.source, 'shop_v2');
  assert.match(calls[0].callback_url, /shop\/order-success\?ref=/);
});

test('guest initialization creates only a checkout snapshot, not a customer, and retries after attachment reuse it', async () => {
  let row;
  const service = load('lib/shop/checkout.ts', {
    '@/lib/prisma': { prisma: {
      store: { findMany: async () => [product] },
      users: { findUniqueOrThrow: async () => { throw Error('Must not access accounts before payment'); } },
      shop_checkouts: {
        findUnique: async () => row,
        create: async ({ data }) => (row = data),
      },
    } }, './policy': policy, '@/lib/walletLedger': {}, '@/lib/affiliate/commissions': {}, '@/lib/email/config/sendEmail': {},
  });
  const body = { cartItems: cart, shippingAddress: 'Mock delivery address', requestKey: 'e0e1b003-caf9-43b8-bc36-e13a895d5127', totalAmount: 2000, contactName: 'Guest Person', contactEmail: 'guest@example.invalid', guestToken: 'a'.repeat(64) };
  const first = await service.createShopCheckout('', body, 'PAYSTACK', true);
  assert.match(first.pidUser, /^GUEST_/);
  assert.equal(first.email, body.contactEmail);
  first.pidUser = 'ATTACHED_AFTER_PAYMENT'; first.status = 'PAID';
  const retry = await service.createShopCheckout('', body, 'PAYSTACK', true);
  assert.equal(retry.reference, first.reference);
  await assert.rejects(service.createShopCheckout('', body, 'WALLET', true));
});

test('guest order access requires the secret token, not just a reference or email', () => {
  const auth = load('lib/shop/auth.ts', { '@/lib/auth/current-user': { currentUser: async () => null }, './policy': policy });
  const token = 'b'.repeat(64), hash = auth.shopGuestHash(token);
  assert.equal(auth.hasShopGuestAccess(hash, token), true);
  assert.equal(auth.hasShopGuestAccess(hash, 'c'.repeat(64)), false);
  assert.equal(auth.hasShopGuestAccess(hash, null), false);
  assert.equal(auth.hasShopGuestAccess(hash, 'guest@example.invalid'), false);
  assert.equal(auth.hasShopGuestAccess(null, token), false);
});

test('guest confirmation API authorizes before contacting provider and returns only the paid order', async () => {
  const auth = load('lib/shop/auth.ts', { '@/lib/auth/current-user': { currentUser: async () => null }, './policy': policy });
  const token = 'd'.repeat(64);
  const row = { ...expected, guestTokenHash: auth.shopGuestHash(token), status: 'PAID', items: [], shippingAddress: 'Guest-provided address' };
  let verified = 0;
  const route = load('app/api/shop/payment/verify/route.ts', {
    'next/server': { ...require('next/server'), after: () => {} },
    '@/lib/auth/current-user': { currentUser: async () => null },
    '@/lib/prisma': { prisma: { shop_checkouts: { findUnique: async () => row } } },
    '@/lib/shop/auth': auth, '@/lib/shop/policy': policy,
    '@/lib/shop/checkout': { verifyShopCheckout: async () => { verified++; return row; }, processShopEffects: async () => {} },
  });
  const url = `https://sureimports.test/api/shop/payment/verify?reference=${row.reference}`;
  for (const headers of [{}, { 'x-shop-checkout-token': 'e'.repeat(64) }]) {
    const response = await route.GET(new Request(url, { headers }));
    assert.equal(response.status, 401);
  }
  assert.equal(verified, 0);
  const response = await route.GET(new Request(url, { headers: { 'x-shop-checkout-token': token } }));
  assert.equal(response.status, 200);
  assert.equal(verified, 1);
  const body = await response.json();
  assert.equal(body.statusx, 'SUCCESS');
  assert.equal(body.data.pidUser, undefined);
  assert.equal(body.data.email, undefined);
  assert.equal(body.data.guestTokenHash, undefined);
});
