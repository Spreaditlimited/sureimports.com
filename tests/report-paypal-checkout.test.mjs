import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';
const require = createRequire(import.meta.url);
function load(file, modules) {
  const exports = {};
  vm.runInNewContext(
    ts.transpileModule(readFileSync(new URL(file, import.meta.url), 'utf8'), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
      },
    }).outputText,
    {
      exports,
      Date,
      Error,
      URL,
      Response,
      Buffer,
      Math,
      console,
      process: { env: {} },
      require: (id) => modules[id] ?? require(id),
    },
  );
  return exports;
}
const validation = load('../lib/paypalValidation.ts', {});
const next = {
  NextResponse: { json: (body, init) => Response.json(body, init) },
};
test('report checkout calculates USD server-side and routes to Expanded Checkout', async () => {
  const saved = [];
  const paypal = [];
  const route = load('../app/api/intelligence/reports/checkout/route.ts', {
    'next/server': next,
    '@/lib/helpers/randomGenerator': () => 'random',
    '@/lib/auth/checkAuth': { checkAuth: async () => null },
    '@/lib/intelligence/reportCheckoutSecurity': {
      checkoutOriginIsAllowed: () => true,
      enforceReportCheckoutRateLimit: async () => ({ allowed: true }),
      REPORT_EMAIL_PATTERN: /@/,
      checkoutReturnUrl: (_, path) => `https://www.sureimports.com${path}`,
    },
    '@/lib/intelligence/reports': {
      getPublishedReportBySlug: async () => ({
        report: {
          pidReport: 'REPORT',
          slug: 'medical-scrubs',
          priceUsdCents: 2000,
          priceNaira: 25000,
          title: 'Scrubs',
          editionLabel: '2026',
        },
        version: { pidVersion: 'V1' },
      }),
    },
    '@/lib/prisma': {
      prisma: {
        users: { findUnique: async () => null },
        intelligence_report_orders: {
          create: async (args) => saved.push(args.data),
          update: async () => {},
        },
      },
    },
    '@/lib/auth/loginRedirect': {
      getSupplierReportResumePath: () => '/report',
    },
    '@/lib/affiliate/attribution': { getAttributedReferral: async () => null },
    '@/lib/paypal': {
      createPayPalOrder: async (input) => {
        paypal.push(input);
        return {
          id: 'ORDER1',
          approvalUrl:
            'https://www.sureimports.com/checkout/paypal?session=signed',
        };
      },
    },
  });
  const response = await route.POST({
    json: async () => ({
      email: 'buyer@example.com',
      firstName: 'Buyer',
      billingCountry: 'United Kingdom',
      reportSlug: 'medical-scrubs',
      amountMinor: 1,
      currency: 'NGN',
    }),
  });
  assert.equal(response.status, 200);
  assert.equal(saved[0].amountMinor, 2000);
  assert.equal(saved[0].currency, 'USD');
  assert.equal(paypal[0].amount, '20.00');
  assert.equal(paypal[0].customId, saved[0].pidOrder);
  assert.match(
    (await response.json()).authorizationUrl,
    /\/checkout\/paypal\?session=/,
  );
});
function verifier({
  amount = '20.00',
  currency = 'USD',
  customId = 'REPORT_ORDER',
  status = 'APPROVED',
  environment = 'live',
} = {}) {
  let captures = 0;
  let confirmations = 0;
  let deliveries = 0;
  const payment = {
    status,
    sureImportsEnvironment: environment,
    purchase_units: [
      {
        custom_id: customId,
        amount: { value: amount, currency_code: currency },
        payments: {
          captures: [
            {
              id: 'CAPTURE',
              status: 'COMPLETED',
              amount: { value: amount, currency_code: currency },
            },
          ],
        },
      },
    ],
  };
  const order = {
    pidOrder: 'REPORT_ORDER',
    paymentProvider: 'paypal',
    providerReference: 'PAYPAL_ORDER',
    status: 'pending',
    amountMinor: 2000,
    currency: 'USD',
  };
  const route = load('../app/api/intelligence/reports/verify/route.ts', {
    'next/server': next,
    '@/lib/paypal': {
      getPayPalOrder: async () => payment,
      capturePayPalOrder: async () => {
        captures++;
        if (status !== 'APPROVED') throw Error('Not approved');
        return { ...payment, status: 'COMPLETED' };
      },
    },
    '@/lib/paypalValidation': validation,
    '@/lib/auth/checkAuth': { checkAuth: async () => null },
    '@/lib/jwt': {
      generateToken: () => {
        throw Error('Must not sign in existing buyer');
      },
    },
    '@/lib/intelligence/reportOrders': {
      confirmReportOrderPayment: async () => {
        confirmations++;
      },
      deliverReportOrder: async () => {
        deliveries++;
        return {
          order: { ...order, downloadToken: 'download' },
          report: { slug: 'medical-scrubs' },
        };
      },
    },
    '@/lib/prisma': {
      prisma: { intelligence_report_orders: { findUnique: async () => order } },
    },
    '@/lib/intelligence/reportCheckoutSecurity': {
      checkoutOriginIsAllowed: () => true,
    },
  });
  return {
    call: (reference) =>
      route.POST({
        json: async () => ({
          pidOrder: 'REPORT_ORDER',
          provider: 'paypal',
          reference: reference ?? 'PAYPAL_ORDER',
        }),
      }),
    counts: () => ({ captures, confirmations, deliveries }),
  };
}
test('approved report payment is captured before confirmation and delivery', async () => {
  const v = verifier();
  const res = await v.call();
  assert.equal(res.status, 200);
  assert.deepEqual(v.counts(), {
    captures: 1,
    confirmations: 1,
    deliveries: 1,
  });
  assert.equal((await res.json()).accountAccess, 'email_required');
});
test('another PayPal reference is rejected without capture', async () => {
  const v = verifier();
  assert.equal((await v.call('OTHER')).status, 400);
  assert.equal(v.counts().captures, 0);
});
test('wrong amount, currency or order identity cannot be captured', async () => {
  for (const change of [
    { amount: '0.01' },
    { currency: 'GBP' },
    { customId: 'OTHER' },
  ]) {
    const v = verifier(change);
    await assert.rejects(v.call(), /does not match/);
    assert.deepEqual(v.counts(), {
      captures: 0,
      confirmations: 0,
      deliveries: 0,
    });
  }
});
test('unapproved and sandbox payments never grant a report', async () => {
  for (const change of [{ status: 'CREATED' }, { environment: 'sandbox' }]) {
    const v = verifier(change);
    await assert.rejects(v.call());
    assert.equal(v.counts().confirmations, 0);
    assert.equal(v.counts().deliveries, 0);
  }
});
test('already captured payments are verified without another capture', async () => {
  const v = verifier({ status: 'COMPLETED' });
  assert.equal((await v.call()).status, 200);
  assert.equal(v.counts().captures, 0);
});
