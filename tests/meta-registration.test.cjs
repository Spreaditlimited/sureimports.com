const test = require('node:test'),
  assert = require('node:assert/strict'),
  fs = require('node:fs'),
  vm = require('node:vm'),
  ts = require('typescript');
function load(file, deps = {}, globals = {}) {
  const m = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText;
  vm.runInNewContext(`(function(require,module,exports){${code}\n})`, {
    URL,
    AbortSignal,
    Date,
    console,
    process,
    Request,
    setTimeout,
    ...globals,
  })((id) => (id in deps ? deps[id] : require(id)), m, m.exports);
  return m.exports;
}
function registration(send) {
  const tasks = [];
  const logs = [];
  const api = load(
    'lib/marketing/registrationConversion.ts',
    {
      'next/server': { after: (fn) => tasks.push(fn) },
      '@/lib/facebookCapi': { sendFacebookLeadCapiEvent: send },
    },
    {
      process: {
        env: {
          NEXT_PUBLIC_FACEBOOK_PIXEL_ID: 'pixel',
          FACEBOOK_CAPI_ACCESS_TOKEN: 'token',
        },
      },
      setTimeout: (fn) => fn(),
      console: {
        info: (...x) => logs.push(x),
        warn: (...x) => logs.push(x),
        error: (...x) => logs.push(x),
      },
    },
  );
  return { api, tasks, logs };
}
const request = () =>
  new Request('https://www.sureimports.com/api/auth/register', {
    headers: {
      'user-agent': 'test',
      cookie: '_fbp=fb.1.123.456; _fbc=fb.1.123.click',
      'x-forwarded-for': '192.0.2.1',
    },
  });
test('registration uses server-derived ID, safe URL, after-response delivery and stable retry identity', async () => {
  const calls = [];
  const h = registration(async (x) => {
    calls.push(x);
    if (calls.length < 3) throw Error('network');
  });
  const result = h.api.scheduleRegistrationConversion({
    request: request(),
    accountId: 'new-account',
    email: 'test@example.com',
    method: 'email',
    attribution: {
      pageUrl: 'https://www.sureimports.com/auth/signup?email=private',
      fbEventId: 'attacker',
    },
  });
  assert.equal(calls.length, 0);
  await h.tasks[0]();
  assert.equal(calls.length, 3);
  assert.equal(new Set(calls.map((x) => x.eventId)).size, 1);
  assert.equal(calls[0].eventId, result.eventId);
  assert.equal(
    calls[0].eventSourceUrl,
    'https://www.sureimports.com/auth/signup',
  );
  assert.equal(calls[0].userData.fbc, 'fb.1.123.click');
  assert.equal(calls[0].eventName, 'CompleteRegistration');
  assert.equal(calls[0].eventTime, calls[2].eventTime);
  assert.notEqual(h.api.registrationEventId('different'), result.eventId);
});
test('non-retryable Meta errors are logged without account data and do not escape', async () => {
  const h = registration(async () => {
    throw Object.assign(Error('secret'), { status: 400 });
  });
  h.api.scheduleRegistrationConversion({
    request: request(),
    accountId: 'id',
    email: 'private@example.com',
    method: 'google',
  });
  await h.tasks[0]();
  assert.equal(h.logs.length, 1);
  assert.ok(!JSON.stringify(h.logs).includes('private@example.com'));
  assert.ok(!JSON.stringify(h.logs).includes('secret'));
});
test('explicit cookie opt-out prevents scheduling registration', () => {
  const h = registration(async () => {});
  assert.equal(
    h.api.scheduleRegistrationConversion({
      request: new Request('https://www.sureimports.com/auth/signup', {
        headers: { cookie: 'consent=false' },
      }),
      accountId: 'id',
      email: 'e',
      method: 'email',
    }),
    null,
  );
  assert.equal(h.tasks.length, 0);
});
test('browser queue survives navigation, waits for Pixel and deduplicates replay', () => {
  const storage = new Map();
  const sessionStorage = {
    getItem: (k) => storage.get(k) || null,
    setItem: (k, v) => storage.set(k, v),
  };
  const calls = [];
  const window = {};
  const document = { cookie: '' };
  const globals = { window, document, sessionStorage };
  let browser = load('lib/marketing/facebookEvents.ts', {}, globals);
  browser.trackRegistrationConversion({
    eventId: 'registration1',
    method: 'apple',
  });
  assert.equal(calls.length, 0);
  browser = load('lib/marketing/facebookEvents.ts', {}, globals);
  window.fbq = (...args) => calls.push(args);
  window.__siPixelReady = true;
  browser.flushFacebookEvents();
  browser.trackRegistrationConversion({
    eventId: 'registration1',
    method: 'apple',
  });
  browser.flushFacebookEvents();
  assert.equal(calls.length, 1);
  assert.equal(calls[0][1], 'CompleteRegistration');
  assert.equal(calls[0][3].eventID, 'registration1');
  document.cookie = 'consent=false';
  browser.trackRegistrationConversion({
    eventId: 'registration2',
    method: 'email',
  });
  assert.equal(calls.length, 1);
});
test('CAPI hashes email and sends deduplication ID without token in URL', async () => {
  let url, options;
  const api = load(
    'lib/facebookCapi.ts',
    {},
    {
      fetch: async (u, o) => {
        url = u;
        options = o;
        return { ok: true, json: async () => ({ events_received: 1 }) };
      },
    },
  );
  await api.sendFacebookLeadCapiEvent({
    pixelId: 'pixel',
    accessToken: 'private-token',
    eventName: 'CompleteRegistration',
    eventId: 'id',
    userData: { email: ' TEST@example.com ' },
  });
  const event = JSON.parse(options.body).data[0];
  assert.ok(!url.includes('private-token'));
  assert.equal(options.headers.Authorization, 'Bearer private-token');
  assert.match(event.user_data.em, /^[a-f0-9]{64}$/);
  assert.equal(event.event_name, 'CompleteRegistration');
  assert.equal(event.event_id, 'id');
});


test('email signup emits only after successful account creation, never for invalid or duplicate submissions', async () => {
  for (const scenario of ['success', 'captcha', 'duplicate', 'mismatch', 'database']) {
    const conversions = [], sequence = [];
    const route = load('app/api/auth/register/route.ts', {
      'next/server': { after: () => {}, NextResponse: { json: (body) => body } },
      '@/lib/prisma': { prisma: { users: {
        findFirst: async () => scenario === 'duplicate' ? { pidUser: 'existing' } : null,
        create: async () => { if (scenario === 'database') throw Error('db'); sequence.push('create'); return { pidUser: 'new' }; },
      } } },
      '@/lib/marketing/registrationConversion': { scheduleRegistrationConversion: (input) => { sequence.push('conversion'); conversions.push(input); return { eventId: 'server-id', method: 'email' }; } },
      '@/lib/helpers/validateEmail': () => ({ isValid: true }),
      '@/lib/helpers/validatePassword': () => true,
      '@/lib/helpers/validateInput': () => true,
      '@/lib/helpers/randomGenerator': () => 'random',
      'bcryptjs': { hashSync: () => 'hash' },
      '@/lib/email/xMail2': async () => {},
      'next/cache': {}, 'next/navigation': {}, 'nodemailer': {},
      '@/lib/security/recaptcha': { verifyRecaptchaToken: async () => scenario !== 'captcha' },
      '@/lib/affiliate/attribution': { resolveAffiliateReference: async () => null, claimAffiliateAttribution: async () => {} },
    });
    const req = new Request('https://www.sureimports.com/api/auth/register', { method: 'POST', body: JSON.stringify({ userFirstname: 'Test', email: 'test@example.com', password: 'password', confirmPassword: scenario === 'mismatch' ? 'different' : 'password', facebookAttribution: { fbc: 'fb.1.123.click' } }) });
    if (scenario === 'database') await assert.rejects(route.POST(req), /db/);
    else {
      const result = await route.POST(req);
      assert.equal(result.successx, scenario === 'success');
      if (scenario === 'success') assert.equal(result.registrationConversion.eventId, 'server-id');
    }
    assert.equal(conversions.length, scenario === 'success' ? 1 : 0, scenario);
    if (scenario === 'success') assert.deepEqual(sequence, ['create', 'conversion']);
  }
});

test('newsletter Lead respects opt-out and skips already confirmed SES subscribers', async () => {
  for (const scenario of [
    { cookie: 'consent=false', status: 'PENDING', events: 0 },
    { cookie: 'consent=true', status: 'ALREADY_CONFIRMED', events: 0 },
    { cookie: 'consent=true', status: 'PENDING', events: 1 },
  ]) {
    const calls = [];
    const api = load('app/api/subscribe/route.ts', {
      'next/server': { NextResponse: { json: (data, init) => Response.json(data, init) } },
      '@prisma/client': { Prisma: { sql: () => ({}) } },
      '@/lib/facebookCapi': { sendFacebookLeadCapiEvent: async (data) => calls.push(data) },
      '@/lib/email/xMail2': { default: async () => {} },
      '@/lib/prisma': { prisma: { $executeRaw: async () => 1 } },
      '@/lib/marketing/contactLedger': { requestMarketingOptIn: async () => ({ status: scenario.status }) },
      '@/lib/marketing/cutover': { belongsToSesMarketing: () => true },
    }, {
      process: { env: { NEXT_PUBLIC_FACEBOOK_PIXEL_ID: 'pixel', FACEBOOK_CAPI_ACCESS_TOKEN: 'token' } },
    });
    const response = await api.POST(new Request('https://www.sureimports.com/api/subscribe', {
      method: 'POST', headers: { cookie: scenario.cookie, 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', first_name: 'Test', fbEventId: 'lead-test' }),
    }));
    assert.equal(response.status, 200);
    assert.equal(calls.length, scenario.events);
    assert.equal((await response.json()).alreadySubscribed, scenario.status === 'ALREADY_CONFIRMED');
  }
});
