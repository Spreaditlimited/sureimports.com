import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';

const require = createRequire(import.meta.url);
function load(file, overrides = {}) {
  const source = ts.transpileModule(
    readFileSync(new URL(file, import.meta.url), 'utf8'),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    },
  ).outputText;
  const exports = {};
  const env = {
    SUREIMPORTS_PAYPAL_CLIENT_ID: 'new-client',
    SUREIMPORTS_PAYPAL_SECRET: 'new-secret',
    SUREIMPORTS_PAYPAL_SANDBOX_CLIENT_ID: 'new-client',
    SUREIMPORTS_PAYPAL_SANDBOX_SECRET: 'new-secret',
    PAYPAL_CLIENT_ID: 'old-client',
    PAYPAL_CLIENT_SECRET: 'old-secret',
    SUREIMPORTS_PAYPAL_ENV: 'sandbox',
    PAYPAL_ENV: 'live',
    ...overrides.env,
  };
  vm.runInNewContext(source, {
    exports,
    Buffer,
    URL,
    Date,
    AbortSignal,
    Response,
    process: { env },
    fetch: overrides.fetch,
    require: (id) =>
      overrides.modules?.[id] ??
      (id === './paypalCheckoutSession' ? sessions : require(id)),
  });
  return exports;
}
const sessions = load('../lib/paypalCheckoutSession.ts');
const validation = load('../lib/paypalValidation.ts');
const session = {
  orderId: 'ORDER1',
  amount: '20.00',
  currency: 'USD',
  description: 'Report',
  returnPath: '/verified',
  cancelPath: '/cancel',
  expiresAt: Date.now() + 60000,
};

test('sandbox payment cannot fulfil the shared production database', () => {
  assert.throws(() => validation.assertPayPalLiveFulfillment({ sureImportsEnvironment: 'sandbox' }), /No live order/);
  validation.assertPayPalLiveFulfillment({ sureImportsEnvironment: 'live' });
});

test('signed checkout session round-trips without exposing credentials', () => {
  const token = sessions.signPayPalCheckoutSession(session);
  assert.equal(sessions.readPayPalCheckoutSession(token).orderId, 'ORDER1');
  assert.ok(!token.includes('new-secret'));
});
test('tampered, expired and redirect sessions are rejected', () => {
  const token = sessions.signPayPalCheckoutSession(session);
  assert.throws(() => sessions.readPayPalCheckoutSession(token + 'x'));
  assert.throws(() =>
    sessions.readPayPalCheckoutSession(
      sessions.signPayPalCheckoutSession({ ...session, expiresAt: 1 }),
    ),
  );
  for (const returnPath of [
    'https://evil.test',
    '//evil.test',
    '/\\evil.test',
  ]) {
    assert.throws(() =>
      sessions.readPayPalCheckoutSession(
        sessions.signPayPalCheckoutSession({ ...session, returnPath }),
      ),
    );
  }
});
test('amount, currency, reference and multiple purchase units fail closed', () => {
  const unit = {
    custom_id: 'ID',
    amount: { value: '20.00', currency_code: 'USD' },
  };
  const expected = { customId: 'ID', amountMinor: 2000, currency: 'USD' };
  validation.assertPayPalOrderMatches({ purchase_units: [unit] }, expected);
  for (const change of [
    { customId: 'OTHER' },
    { amountMinor: 2001 },
    { currency: 'GBP' },
  ]) {
    assert.throws(() =>
      validation.assertPayPalOrderMatches(
        { purchase_units: [unit] },
        { ...expected, ...change },
      ),
    );
  }
  assert.throws(() =>
    validation.assertPayPalOrderMatches(
      { purchase_units: [unit, unit] },
      expected,
    ),
  );
});
test('new checkout uses only the Sure Imports app and returns local expanded checkout', async () => {
  const calls = [];
  const paypal = load('../lib/paypal.ts', {
    fetch: async (url, options) => {
      calls.push({ url, options });
      return new Response(
        JSON.stringify(
          url.endsWith('/token')
            ? { access_token: 'mock-token' }
            : { id: 'ORDER1' },
        ),
      );
    },
  });
  const result = await paypal.createPayPalOrder({
    amount: '20.00',
    currency: 'USD',
    returnUrl: 'https://www.sureimports.com/verified',
    cancelUrl: 'https://www.sureimports.com/cancel',
    customId: 'ID',
    invoiceId: 'INV',
    description: 'Report',
  });
  assert.equal(
    calls[0].options.headers.Authorization,
    `Basic ${Buffer.from('new-client:new-secret').toString('base64')}`,
  );
  assert.ok(
    calls.every((call) =>
      call.url.startsWith('https://api-m.sandbox.paypal.com/'),
    ),
  );
  assert.equal(new URL(result.approvalUrl).pathname, '/checkout/paypal');
  assert.equal(
    JSON.parse(calls[1].options.body).purchase_units[0].amount.value,
    '20.00',
  );
});
test('NGN and invalid amounts never contact PayPal', async () => {
  const paypal = load('../lib/paypal.ts', {
    fetch: () => {
      throw Error('Must not call API');
    },
  });
  for (const [currency, amount] of [
    ['NGN', '20.00'],
    ['USD', '-1.00'],
    ['USD', 'NaN'],
  ]) {
    await assert.rejects(
      paypal.createPayPalOrder({
        currency,
        amount,
        returnUrl: 'https://www.sureimports.com/verified',
        cancelUrl: 'https://www.sureimports.com/cancel',
      }),
      /Invalid PayPal/,
    );
  }
});
test('legacy order lookup falls back only on not-found and captures with the owning app', async () => {
  const calls = [];
  let captured = false;
  const paypal = load('../lib/paypal.ts', {
    fetch: async (url, options) => {
      calls.push({ url, options });
      if (url.endsWith('/token'))
        return new Response(
          JSON.stringify({
            access_token: url.includes('sandbox') ? 'new-token' : 'old-token',
          }),
        );
      if (url.includes('sandbox')) return new Response('{}', { status: 404 });
      if (url.endsWith('/capture')) captured = true;
      return new Response(
        JSON.stringify({
          id: 'OLDORDER',
          status: captured ? 'COMPLETED' : 'APPROVED',
        }),
      );
    },
  });
  assert.equal(
    (await paypal.capturePayPalOrder('OLDORDER')).status,
    'COMPLETED',
  );
  const capture = calls.find((call) => call.url.endsWith('/capture'));
  assert.equal(capture.options.headers.Authorization, 'Bearer old-token');
  assert.equal(
    capture.options.headers['PayPal-Request-Id'],
    'capture-OLDORDER',
  );
});
test('provider outage is not mistaken for a legacy order', async () => {
  let legacyCalls = 0;
  const paypal = load('../lib/paypal.ts', {
    fetch: async (url) => {
      if (!url.includes('sandbox')) legacyCalls++;
      return url.endsWith('/token')
        ? new Response(JSON.stringify({ access_token: 'token' }))
        : new Response('{}', { status: 503 });
    },
  });
  await assert.rejects(paypal.getPayPalOrder('ORDER1'));
  assert.equal(legacyCalls, 0);
});

test('capture timeout recovers the completed order without another charge', async () => {
  let captures = 0;
  const paypal = load('../lib/paypal.ts', {
    fetch: async (url) => {
      if (url.endsWith('/token')) return Response.json({ access_token: 'token' });
      if (url.endsWith('/capture')) {
        captures++;
        throw new Error('Connection lost after provider captured payment');
      }
      return Response.json({ id: 'ORDER1', status: captures ? 'COMPLETED' : 'APPROVED' });
    },
  });
  assert.equal((await paypal.capturePayPalOrder('ORDER1')).status, 'COMPLETED');
  assert.equal(captures, 1);
});

test('unapproved and unresolved payments never trigger a replacement charge', async () => {
  for (const status of ['CREATED', 'APPROVED']) {
    let captures = 0;
    const paypal = load('../lib/paypal.ts', {
      fetch: async (url) => {
        if (url.endsWith('/token')) return Response.json({ access_token: 'token' });
        if (url.endsWith('/capture')) {
          captures++;
          throw new Error('Connection lost');
        }
        return Response.json({ id: 'ORDER1', status });
      },
    });
    await assert.rejects(paypal.capturePayPalOrder('ORDER1'), /Approve|pending/);
    assert.equal(captures, status === 'CREATED' ? 0 : 1);
  }
});

test('expired checkout is renewed without creating another provider order', () => {
  const token = sessions.signPayPalCheckoutSession({
    ...session,
    expiresAt: 1,
  });
  const url = sessions.refreshPayPalCheckoutUrl(
    `https://www.sureimports.com/checkout/paypal?session=${token}`,
  );
  assert.equal(
    sessions.readPayPalCheckoutSession(new URL(url).searchParams.get('session'))
      .orderId,
    session.orderId,
  );
});

function procurementHarness({
  paid = false,
  changed = false,
  wrongAmount = false,
  orderUpdateCount = 1,
} = {}) {
  const context = {
    status: 'saved',
    nextStatus: 'pending',
    orderUpdatedAt: null,
    productsTotalUsd: 200,
    snapshot: {},
    oldTotal: null,
    oldWeight: null,
    oldShipping: null,
  };
  const row = {
    id: 'PPROC_test',
    pidOrder: 'PROC1',
    pidUser: 'USER1',
    providerReference: 'ORDER1',
    amountMinor: 25000,
    status: 'PENDING',
    context,
  };
  const calls = { captures: 0, payments: 0, conversions: 0 };
  const capture = {
    id: 'CAPTURE1',
    status: 'COMPLETED',
    amount: { value: '250.00', currency_code: 'USD' },
  };
  const order = {
    id: 'ORDER1',
    status: paid ? 'COMPLETED' : 'APPROVED',
    purchase_units: [
      {
        custom_id: row.id,
        amount: {
          value: wrongAmount ? '249.00' : '250.00',
          currency_code: 'USD',
        },
        payments: paid ? { captures: [capture] } : {},
      },
    ],
  };
  const tx = {
    $queryRaw: async () => [row],
    users: {
      findUnique: async () => ({
        userFirstname: 'Buyer',
        userEmail: 'buyer@example.test',
      }),
    },
    payments: {
      upsert: async () => {
        calls.payments++;
      },
    },
    orders: { updateMany: async () => ({ count: orderUpdateCount }) },
    $executeRaw: async (_sql, status) => {
      row.status = status;
      return 1;
    },
  };
  const procurement = load('../lib/procurement/paypalCheckout.ts', {
    modules: {
      './paypalNotifications': { notifyProcurementPayPalPayment: async () => undefined },
      '@/lib/prisma': {
        prisma: {
          $queryRaw: async () => [row],
          $transaction: async (callback) => callback(tx),
        },
      },
      './orderLifecycle': {
        getProcurementOrderLifecycle: async () => ({
          order: { status: changed ? 'cancelled' : 'saved', updatedAt: null },
          payment: { currency: 'USD', due: 250 },
        }),
      },
      '@/lib/paypal': {
        getPayPalOrder: async () => order,
        capturePayPalOrder: async () => {
          calls.captures++;
          return {
            ...order,
            status: 'COMPLETED',
            purchase_units: [
              { ...order.purchase_units[0], payments: { captures: [capture] } },
            ],
          };
        },
      },
      '@/lib/paypalValidation': validation,
      '@/lib/paypalCheckoutSession': sessions,
      '@/lib/affiliate/commissions': {
        AFFILIATE_SERVICE_KEYS: { BUY_FROM_CHINESE_WEBSITES: 'procurement' },
        recordAffiliateConversion: async () => {
          calls.conversions++;
        },
      },
    },
  });
  return { procurement, calls, row };
}
test('procurement rejects another customer before contacting capture', async () => {
  const { procurement, calls } = procurementHarness();
  await assert.rejects(
    procurement.confirmProcurementPayPalCheckout('ORDER1', 'OTHER', true),
  );
  assert.equal(calls.captures, 0);
});
test('changed procurement orders and wrong amounts cannot be captured', async () => {
  for (const options of [{ changed: true }, { wrongAmount: true }]) {
    const { procurement, calls } = procurementHarness(options);
    await assert.rejects(
      procurement.confirmProcurementPayPalCheckout('ORDER1', 'USER1', true),
    );
    assert.equal(calls.captures, 0);
    assert.equal(calls.payments, 0);
  }
});
test('repeated completed procurement callbacks create only one payment', async () => {
  const { procurement, calls } = procurementHarness({ paid: true });
  await procurement.confirmProcurementPayPalCheckout('ORDER1', 'USER1', true);
  await procurement.confirmProcurementPayPalCheckout('ORDER1', 'USER1', true);
  assert.equal(calls.captures, 0);
  assert.equal(calls.payments, 1);
});
test('captured money remains recorded when order state changes during payment', async () => {
  const { procurement, calls, row } = procurementHarness({
    paid: true,
    orderUpdateCount: 0,
  });
  await assert.rejects(
    procurement.confirmProcurementPayPalCheckout('ORDER1', 'USER1', true),
    /Payment received/,
  );
  assert.equal(calls.payments, 1);
  assert.equal(row.status, 'REVIEW');
  assert.equal(calls.conversions, 0);
});

test('receipt delivery markers prevent repeated customer and admin emails', async () => {
  const sent = new Set();
  let deliveries = 0;
  const notices = load('../lib/procurement/paypalNotifications.ts', { modules: {
    '@/lib/prisma': { prisma: {
      $queryRaw: async () => [{ id: 'PPROC_1', pidOrder: 'ORDER1', pidUser: 'USER1', status: 'PAID', amountMinor: 25000 }],
      users: { findUnique: async () => ({ userEmail: 'buyer@example.test' }) },
      $executeRaw: async (sql, ...args) => {
        if (sql.join('').includes('UNIX_TIMESTAMP() - 300')) return sent.has(args[2]) ? 0 : 1;
        if (sql.join('').includes('true)')) sent.add(args[0]);
        return 1;
      },
    } },
    '@/lib/email/xMail': { default: async () => { deliveries++; } },
  } });
  await notices.notifyProcurementPayPalPayment('PPROC_1');
  await notices.notifyProcurementPayPalPayment('PPROC_1');
  assert.equal(deliveries, 2);
});
