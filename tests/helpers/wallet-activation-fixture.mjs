import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';
const require = createRequire(import.meta.url);
export function load(path, mocks = {}, globals = {}) {
  const module = { exports: {} };
  vm.runInNewContext(
    ts.transpileModule(
      readFileSync(new URL('../../' + path, import.meta.url), 'utf8'),
      {
        compilerOptions: {
          module: ts.ModuleKind.CommonJS,
          target: ts.ScriptTarget.ES2020,
        },
      },
    ).outputText,
    {
      module,
      exports: module.exports,
      require: (id) => mocks[id] || require(id),
      Response,
      Request,
      URL,
      AbortSignal,
      console,
      ...globals,
    },
  );
  return module.exports;
}
export function fixture(options = {}) {
  const state = { account: !!options.ready, calls: [], ...options };
  const user = {
    pidUser: 'owner',
    userEmail: 'wallet@example.test',
    userFirstname: 'Test',
    userLastname: 'User',
    phone: '0803 123 4567',
    ...options.user,
  };
  const account = {
    account_number: '0123456789',
    account_name: 'Test User',
    currency: 'NGN',
    bank: { name: 'Test Bank' },
  };
  const fetch = async (url, init = {}) => {
    const method = init.method || 'GET';
    const body = init.body ? JSON.parse(init.body) : null;
    state.calls.push({ url, method, body });
    if (state.networkError) throw new Error('Provider offline');
    if (state.delay)
      await new Promise((resolve) => setTimeout(resolve, state.delay));
    if (method === 'GET') {
      if (state.lookupError)
        return Response.json({ status: false }, { status: 503 });
      if (state.missing)
        return Response.json({ status: false }, { status: 404 });
      return Response.json({
        status: true,
        data: {
          customer_code: 'CUS_owner',
          dedicated_accounts: state.account ? [account] : [],
        },
      });
    }
    if (url.endsWith('/customer') && method === 'POST') {
      state.missing = false;
      return Response.json({
        status: true,
        data: { customer_code: 'CUS_owner' },
      });
    }
    if (method === 'PUT') return Response.json({ status: !state.updateError });
    if (url.endsWith('/dedicated_account')) {
      if (state.concurrent) state.account = true;
      if (state.decline || state.concurrent)
        return Response.json(
          { status: false, message: 'Private provider detail' },
          { status: 400 },
        );
      if (state.malformed) return Response.json({ status: true });
      state.account = true;
      return Response.json({ status: true, data: account });
    }
    throw new Error('Unexpected provider request ' + url);
  };
  const phone = load('lib/wallet/phone.ts');
  const provisioning = load(
    'lib/wallet/paystackProvisioning.ts',
    { '@/lib/wallet/phone': phone },
    {
      fetch,
      process: {
        env: options.noKey ? {} : { PAYSTACK_SECRET_KEY: 'sk_test_fixture' },
      },
    },
  );
  const db = {
    users: {
      findUnique: async ({ where }) => {
        state.selectedUser = where.pidUser;
        if (state.dbError) throw new Error('Database unavailable');
        return state.deleted ? null : user;
      },
    },
  };
  const route = load('app/api/wallet/activate/route.ts', {
    '@/lib/auth/current-user': {
      currentUser: async () =>
        state.unauthorized ? null : { pidUser: 'owner' },
    },
    '@/lib/prisma': { prisma: db },
    '@/lib/wallet/paystackProvisioning': provisioning,
    'next/server': { NextResponse: Response },
  });
  return { state, user, route, provisioning, fetch, account };
}
