// Run with ESBUILD_MODULE and PLAYWRIGHT_MODULE pointing to installed module entrypoints.
// Real wallet UI + activation route + provisioning; session, database and Paystack are fixtures.
import { createServer } from 'node:http';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fixture, load } from './helpers/wallet-activation-fixture.mjs';
const require = createRequire(import.meta.url);
const { build } = require(process.env.ESBUILD_MODULE || 'esbuild');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const bundle = await build({
  stdin: {
    contents: `import React from 'react'; import {createRoot} from 'react-dom/client'; import Wallet from './app/dashboard/wallet/components/Wallet'; createRoot(document.getElementById('root')).render(<Wallet/>);`,
    resolveDir: process.cwd(),
    loader: 'tsx',
  },
  bundle: true,
  write: false,
  platform: 'browser',
  jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"development"' },
  plugins: [
    {
      name: 'fixture-boundaries',
      setup(build) {
        build.onResolve(
          {
            filter:
              /^(@\/app\/context\/AuthContext|next\/navigation|\.\/PayoutRequestDialog|\.\.\/\.\.\/loading)$/,
          },
          (args) => ({ path: args.path, namespace: 'fixture' }),
        );
        build.onLoad({ filter: /.*/, namespace: 'fixture' }, (args) => ({
          contents: args.path.includes('AuthContext')
            ? `export const useAuth=()=>({user:{pidUser:'owner',userEmail:'wallet@example.test'}});`
            : args.path.includes('navigation')
              ? `export const useRouter=()=>({push:()=>{}});`
              : `export default function Stub(){return null;}`,
        }));
      },
    },
  ],
});
let current = fixture(),
  activationRequests = 0,
  refreshFailure = false;
function walletRoute() {
  return load('app/api/paystack/get-customer/[email]/route.ts', {
    'next/server': { NextResponse: Response },
    '@/lib/auth/current-user': {
      currentUser: async () => ({
        pidUser: 'owner',
        userEmail: current.user.userEmail,
      }),
    },
    '@/lib/prisma': {
      prisma: { users: { findFirst: async () => current.user } },
    },
    '@/lib/walletLedger': {
      syncPaystackDedicatedNubanCredits: async () => {
        if (refreshFailure && current.state.account)
          throw new Error('Temporary account lookup failure');
        return {
          statusx: current.state.account ? 'WALLET_READY' : 'NO_ACCOUNT',
          customerDetails: {
            bankName: 'Test Bank',
            bankAccountName: 'Test User',
            bankAccountNumber: current.account.account_number,
          },
        };
      },
      syncLegacyWalletDebits: async () => {},
      dedupeWalletLedger: async () => {},
      getWalletLedger: async () => ({
        transactions: [],
        wallet: { currency: 'NGN' },
        balance: 0,
        credits: 0,
        debits: 0,
      }),
    },
  });
}
const server = createServer(async (req, res) => {
  try {
    if (req.url === '/bundle.js') {
      res.setHeader('Content-Type', 'application/javascript');
      return res.end(bundle.outputFiles[0].text);
    }
    let result;
    if (req.url === '/api/wallet/activate') {
      activationRequests++;
      result = await current.route.POST();
    } else if (req.url.startsWith('/api/paystack/get-customer/'))
      result = await walletRoute().GET(new Request('http://test' + req.url), {
        params: Promise.resolve({ email: current.user.userEmail }),
      });
    else if (req.url.startsWith('/api/'))
      result = Response.json({
        statusx: 'SUCCESS',
        data: req.url.includes('get-pending') ? null : { debits: [] },
        hasBankDetails: true,
      });
    else {
      res.setHeader('Content-Type', 'text/html');
      return res.end(
        '<html><body><div id="root"></div><script src="/bundle.js"></script></body></html>',
      );
    }
    res.writeHead(result.status, Object.fromEntries(result.headers));
    res.end(await result.text());
  } catch (error) {
    res.writeHead(500);
    res.end(String(error));
  }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch({
    headless: true,
    executablePath:
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (error) => {
    errors.push(error.message);
    console.error('Browser error:', error.message);
  });
  const visit = async (options = {}) => {
    current = fixture(options);
    activationRequests = 0;
    refreshFailure = false;
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    await page
      .getByRole('button', { name: 'Activate Now', exact: true })
      .waitFor();
  };
  await visit({ missing: true, delay: 150 });
  await page.getByRole('button', { name: 'Activate Now', exact: true }).click();
  const pending = page.getByRole('button', { name: 'Activating…' });
  await pending.waitFor();
  assert.equal(await pending.isDisabled(), true);
  await pending.dispatchEvent('click');
  await page.getByRole('heading', { name: 'My Wallet', exact: true }).waitFor();
  assert.equal(activationRequests, 1);
  await page.getByRole('button', { name: 'Top Up Fund your account' }).click();
  await page.getByText('0123456789', { exact: true }).waitFor();
  console.log(
    'PASS browser: new customer → click → authenticated route → provisioning → refreshed wallet → funding details; duplicate click prevented',
  );

  await visit({ decline: true });
  await page.getByRole('button', { name: 'Activate Now', exact: true }).click();
  await page.getByRole('alert').waitFor();
  assert.match(
    await page.getByRole('alert').textContent(),
    /could not activate/,
  );
  current.state.decline = false;
  await page.getByRole('button', { name: 'Activate Now', exact: true }).click();
  await page.getByRole('heading', { name: 'My Wallet', exact: true }).waitFor();
  console.log(
    'PASS browser: provider rejection → visible error → successful retry',
  );

  for (const [options, message] of [
    [{ unauthorized: true }, /sign in/],
    [{ user: { phone: '' } }, /Nigerian phone/],
  ]) {
    await visit(options);
    await page
      .getByRole('button', { name: 'Activate Now', exact: true })
      .click();
    await page.getByRole('alert').waitFor();
    assert.match(await page.getByRole('alert').textContent(), message);
    assert.equal(current.state.calls.length, 0);
  }
  console.log(
    'PASS browser: missing session and invalid profile show errors without provider writes',
  );

  await visit();
  refreshFailure = true;
  await page.getByRole('button', { name: 'Activate Now', exact: true }).click();
  await page.getByRole('button', { name: 'Retry loading wallet' }).waitFor();
  const writes = current.state.calls.filter((c) => c.method === 'POST').length;
  refreshFailure = false;
  await page.getByRole('button', { name: 'Retry loading wallet' }).click();
  await page.getByRole('heading', { name: 'My Wallet', exact: true }).waitFor();
  assert.equal(
    current.state.calls.filter((c) => c.method === 'POST').length,
    writes,
  );
  console.log(
    'PASS browser: failed post-activation refresh → retry loads wallet without duplicate creation',
  );
  assert.deepEqual(errors, []);
  console.log('PASS browser: no uncaught browser errors');
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
