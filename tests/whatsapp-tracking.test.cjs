const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const crypto = require('node:crypto');
function load(file, mocks = {}) {
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext('(function(require,module,exports){' + source + '})', {
    console,
    process,
    URL,
    URLSearchParams,
    Date,
    Response,
    Request,
    setTimeout,
  })((name) => mocks[name] || require(name), module, module.exports);
  return module.exports;
}
const policy = load('lib/marketing/whatsappPolicy.ts');
const reportRetry = load('/Users/tochukwunkwocha/projects/admin.sureimports.com/lib/marketing/whatsappReadRetry.ts');
test('report read retries one transient connection failure', async () => {
  let attempts = 0;
  const result = await reportRetry.retryReportRead(async () => {
    if (++attempts === 1) throw Object.assign(new Error('Connection interrupted'), { code: 'P1001' });
    return 'loaded';
  });
  assert.equal(result, 'loaded');
  assert.equal(attempts, 2);
});
test('report retry is bounded and does not retry query errors', async () => {
  for (const [code, expected] of [['P1001', 2], ['P2010', 1]]) {
    let attempts = 0;
    await assert.rejects(() => reportRetry.retryReportRead(async () => {
      attempts++;
      throw Object.assign(new Error('failure'), { code });
    }));
    assert.equal(attempts, expected);
  }
});
test('accepts only explicit ecosystem HTTPS origins', () => {
  assert.equal(
    policy.siteForOrigin('https://linescout.sureimports.com'),
    'linescout',
  );
  for (const origin of [
    'https://evil.com',
    'https://sureimports.com.evil.com',
    'http://localhost:3001',
    'https://sureimports.com:3001',
    null,
  ])
    assert.equal(policy.siteForOrigin(origin), null);
});
test('validates events and refuses URLs containing query secrets', () => {
  const event = {
    id: crypto.randomUUID(),
    path: '/shop/iphone',
    destination: '447881194138',
    placement: 'page',
    device: 'mobile',
  };
  assert.equal(policy.clickSchema.safeParse(event).success, true);
  for (const change of [
    { path: '/shop?token=secret' },
    { source: 'name@example.com' },
    { destination: 'evil' },
    { id: 'x' },
    { session: 'bad' },
    { email: 'x' },
  ])
    assert.equal(
      policy.clickSchema.safeParse({ ...event, ...change }).success,
      false,
    );
});
test('phone normalization requires international format', () => {
  assert.equal(policy.phoneIdentity('+44 7881 194138'), '+447881194138');
  assert.throws(() => policy.phoneIdentity('07881194138'));
});
function browser({
  host = 'www.sureimports.com',
  consent = false,
  destination = '447881194138',
} = {}) {
  const handlers = {},
    sent = [],
    store = new Map();
  class Element {
    closest(selector) {
      if (selector === 'a[href]') return this;
      if (selector === 'footer') return {};
      return null;
    }
    hasAttribute() {
      return false;
    }
  }
  const anchor = new Element();
  anchor.href = 'https://wa.me/' + destination + '?text=Hello';
  const context = {
    window: {},
    location: {
      hostname: host,
      pathname: '/shop',
      search: '?utm_source=google&utm_campaign=phones',
    },
    document: {
      referrer: '',
      cookie: consent ? 'consent=true' : '',
      addEventListener: (name, cb) => (handlers[name] = cb),
    },
    navigator: {
      sendBeacon: (url, body) => {
        sent.push({ url, body });
        return true;
      },
    },
    crypto,
    Element,
    URL,
    URLSearchParams,
    Blob,
    Map,
    Date,
    matchMedia: () => ({ matches: true }),
    localStorage: { getItem: () => null },
    sessionStorage: {
      getItem: (k) => store.get(k) || null,
      setItem: (k, v) => store.set(k, v),
    },
  };
  vm.runInNewContext(
    fs.readFileSync('public/whatsapp-tracking.js', 'utf8'),
    context,
  );
  return {
    sent,
    store,
    anchor,
    click: () =>
      handlers.click?.({ isTrusted: true, target: anchor, type: 'click' }),
  };
}
test('records actual link click, ignores repeat double tap, appends one reference', async () => {
  const b = browser();
  b.click();
  b.click();
  assert.equal(b.sent.length, 1);
  const body = JSON.parse(await b.sent[0].body.text());
  assert.equal(body.session, null);
  assert.equal(body.source, '');
  assert.equal(b.store.size, 0);
  assert.match(
    new URL(b.anchor.href).searchParams.get('text'),
    /Reference: WA-/,
  );
});
test('consented clicks include a session and campaign', async () => {
  const b = browser({ consent: true });
  b.click();
  const body = JSON.parse(await b.sent[0].body.text());
  assert.match(body.session, /^[a-f0-9-]{36}$/);
  assert.equal(body.source, 'google');
  assert.equal(body.campaign, 'phones');
});
test('local, custom partner domains and supplier contacts are ignored', () => {
  for (const options of [
    { host: 'localhost' },
    { host: 'business.example' },
    { destination: '8613800138000' },
  ]) {
    const b = browser(options);
    b.click();
    assert.equal(b.sent.length, 0);
    assert.equal(new URL(b.anchor.href).searchParams.get('text'), 'Hello');
  }
});
const admin = load(
  '/Users/tochukwunkwocha/projects/admin.sureimports.com/lib/marketing/whatsapp.ts',
  { '@/lib/prisma': { prisma: {} } },
);
test('Lagos calendar boundaries are timezone-independent', () => {
  const now = new Date('2026-09-23T08:00:00Z');
  assert.equal(
    admin.periodStart('today', now).toISOString(),
    '2026-09-22T23:00:00.000Z',
  );
  assert.equal(
    admin.periodStart('week', now).toISOString(),
    '2026-09-20T23:00:00.000Z',
  );
  assert.equal(
    admin.periodStart('month', now).toISOString(),
    '2026-08-31T23:00:00.000Z',
  );
  assert.equal(
    admin.periodStart('year', now).toISOString(),
    '2025-12-31T23:00:00.000Z',
  );
});
test('custom ranges reject reversed or excessively long ranges', () => {
  for (const params of [
    'period=custom',
    'period=custom&from=2026-10-01&to=2026-09-01',
    'period=custom&from=2020-01-01&to=2026-09-01',
  ])
    assert.throws(() => admin.reportRange(new URLSearchParams(params)));
  const range = admin.reportRange(
    new URLSearchParams('period=custom&from=2026-09-01&to=2026-09-01'),
  );
  assert.equal(+range.end - +range.start, 86400000);
});
test('manual lead schema rejects anonymous or malformed records', () => {
  const lead = {
    name: 'Test Person',
    phone: '+44 7881 194138',
    site: 'sureimports',
    status: 'NEW',
    clickId: '',
    notes: 'Received an enquiry',
    receivedAt: '2026-09-23T08:00:00.000Z',
  };
  assert.equal(admin.leadSchema.parse(lead).phone, '+447881194138');
  for (const change of [
    { phone: '07881194138' },
    { status: 'CLICK' },
    { name: '' },
    { site: 'invalid-site' },
  ])
    assert.equal(
      admin.leadSchema.safeParse({ ...lead, ...change }).success,
      false,
    );
});
test('tracking endpoint rejects foreign origins and validates production events', async () => {
  const oldEnv = process.env.VERCEL_ENV,
    oldSecret = process.env.CRON_SECRET;
  process.env.VERCEL_ENV = 'production';
  process.env.CRON_SECRET = 'unit-test-only';
  const writes = [];
  const prisma = {
    $queryRaw: async (strings) =>
      String(strings).includes('admin_whatsapp') ? [] : [{ attempts: 1 }],
    $executeRaw: async (...args) => {
      writes.push(args);
      return 1;
    },
  };
  const route = load('app/api/marketing/whatsapp-click/route.ts', {
    '@/lib/prisma': { prisma },
    '@/lib/marketing/whatsappPolicy': policy,
  });
  const event = {
    id: crypto.randomUUID(),
    path: '/white-label',
    destination: '447881194138',
    placement: 'page',
    device: 'mobile',
  };
  function req(origin, body = event) {
    return new Request(
      'https://www.sureimports.com/api/marketing/whatsapp-click',
      {
        method: 'POST',
        headers: { origin, 'user-agent': 'Mozilla/5.0' },
        body: JSON.stringify(body),
      },
    );
  }
  try {
    assert.equal((await route.POST(req('https://evil.com'))).status, 403);
    assert.equal(writes.length, 0);
    assert.equal(
      (
        await route.POST(
          req('https://linescout.sureimports.com', {
            ...event,
            path: '/secret?token=foo',
          }),
        )
      ).status,
      400,
    );
    const result = await route.POST(req('https://linescout.sureimports.com'));
    assert.equal(result.status, 204);
    assert.equal(
      result.headers.get('access-control-allow-origin'),
      'https://linescout.sureimports.com',
    );
    assert.ok(writes.some((args) => args.includes('linescout')));
    process.env.VERCEL_ENV = 'preview';
    writes.length = 0;
    assert.equal(
      (await route.POST(req('https://linescout.sureimports.com'))).status,
      204,
    );
    assert.equal(writes.length, 0);
  } finally {
    if (oldEnv === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = oldEnv;
    if (oldSecret === undefined) delete process.env.CRON_SECRET;
    else process.env.CRON_SECRET = oldSecret;
  }
});
test('admin report and lead mutations enforce permissions and same-origin requests', async () => {
  let allowed = false,
    saved = 0;
  const route = load(
    '/Users/tochukwunkwocha/projects/admin.sureimports.com/app/api/marketing/whatsapp/route.ts',
    {
      '@/app/api/_lib/adminAccess': {
        requireAdminServiceAccess: async () =>
          allowed
            ? { ok: true, admin: { pidUser: 'test' } }
            : { ok: false, response: Response.json({}, { status: 403 }) },
      },
      '@/lib/marketing/whatsappReadRetry': reportRetry,
      '@/lib/marketing/whatsapp': {
        report: async () => ({ cards: [] }),
        saveLead: async () => {
          saved++;
          return 'test';
        },
      },
    },
  );
  assert.equal(
    (
      await route.GET(
        new Request('https://admin.sureimports.com/api/marketing/whatsapp'),
      )
    ).status,
    403,
  );
  const post = (origin) =>
    new Request('https://admin.sureimports.com/api/marketing/whatsapp', {
      method: 'POST',
      headers: { origin },
      body: '{}',
    });
  assert.equal(
    (await route.POST(post('https://admin.sureimports.com'))).status,
    403,
  );
  assert.equal(saved, 0);
  allowed = true;
  assert.equal((await route.POST(post('https://evil.com'))).status, 403);
  assert.equal(saved, 0);
  assert.equal(
    (await route.POST(post('https://admin.sureimports.com'))).status,
    200,
  );
  assert.equal(saved, 1);
});
