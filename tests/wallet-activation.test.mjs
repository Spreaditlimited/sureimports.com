import test from 'node:test';
import assert from 'node:assert/strict';
import { fixture } from './helpers/wallet-activation-fixture.mjs';

test('new customer: authenticated POST creates customer and funding account using normalized saved profile', async () => {
  const { route, state } = fixture({ missing: true });
  const response = await route.POST(
    new Request('http://test/api/wallet/activate?pidUser=attacker', {
      method: 'POST',
      body: JSON.stringify({ customer: 'CUS_attacker' }),
    }),
  );
  assert.equal(response.status, 200);
  assert.equal((await response.json()).status, 'READY');
  assert.equal(state.selectedUser, 'owner');
  assert.equal(
    state.calls.find((c) => c.method === 'PUT').body.phone,
    '+2348031234567',
  );
  assert.equal(state.calls.at(-1).body.customer, 'CUS_owner');
});
test('existing customer is refreshed before creating account; repeat activation makes no further writes', async () => {
  const { route, state } = fixture();
  assert.equal((await route.POST()).status, 200);
  assert.deepEqual(
    state.calls.map((c) => c.method),
    ['GET', 'PUT', 'POST'],
  );
  state.calls.length = 0;
  assert.equal((await route.POST()).status, 200);
  assert.deepEqual(
    state.calls.map((c) => c.method),
    ['GET'],
  );
});
for (const [name, options, status] of [
  ['signed out', { unauthorized: true }, 401],
  ['deleted user', { deleted: true }, 404],
  ['missing phone', { user: { phone: null } }, 422],
  ['invalid phone', { user: { phone: '12345' } }, 422],
  ['missing name', { user: { userFirstname: '' } }, 422],
  ['missing configuration', { noKey: true }, 502],
  ['database unavailable', { dbError: true }, 503],
  ['provider lookup failure', { lookupError: true }, 502],
  ['provider network failure', { networkError: true }, 502],
  ['profile update rejected', { updateError: true }, 502],
  ['account creation declined', { decline: true }, 502],
  ['incomplete success response', { malformed: true }, 502],
])
  test(name + ' returns a visible error without false success', async () => {
    const { route, state } = fixture(options);
    const response = await route.POST();
    assert.equal(response.status, status);
    const data = await response.json();
    assert.ok(data.message);
    assert.doesNotMatch(data.message, /Private provider detail/);
    if (status === 401 || status === 422 || options.noKey)
      assert.equal(state.calls.length, 0);
    if (options.lookupError || options.updateError)
      assert.equal(
        state.calls.filter((c) => c.url.endsWith('/dedicated_account')).length,
        0,
      );
  });
test('concurrent account creation is recovered by rechecking the customer', async () => {
  const { route } = fixture({ concurrent: true });
  assert.equal((await route.POST()).status, 200);
});
test('provider rejection can be retried successfully', async () => {
  const { route, state } = fixture({ decline: true });
  assert.equal((await route.POST()).status, 502);
  state.decline = false;
  assert.equal((await route.POST()).status, 200);
});
test('valid legacy phone is used if primary phone is malformed', async () => {
  const { route } = fixture({
    user: { phone: 'invalid', userPhone: '08031234567' },
  });
  assert.equal((await route.POST()).status, 200);
});

for (const [name, env, response, rejects] of [
  ['missing key', {}, null, true],
  [
    'Paystack unavailable',
    { PAYSTACK_SECRET_KEY: 'test' },
    Response.json({ status: false }, { status: 503 }),
    true,
  ],
  [
    'customer absent',
    { PAYSTACK_SECRET_KEY: 'test' },
    Response.json({ status: false }, { status: 404 }),
    false,
  ],
  [
    'customer without funding account',
    { PAYSTACK_SECRET_KEY: 'test' },
    Response.json({ status: true, data: { dedicated_accounts: [] } }),
    false,
  ],
])
  test('wallet lookup distinguishes ' + name, async () => {
    const { load } = await import('./helpers/wallet-activation-fixture.mjs');
    const ledger = load(
      'lib/walletLedger.ts',
      { '@/lib/prisma': { prisma: {} } },
      {
        process: { env },
        fetch: async () => response,
      },
    );
    const lookup = ledger.syncPaystackDedicatedNubanCredits({
      pidUser: 'owner',
      userEmail: 'wallet@example.test',
    });
    if (rejects) await assert.rejects(lookup, /unavailable|Unable to check/);
    else assert.equal((await lookup).statusx, 'NO_ACCOUNT');
  });
