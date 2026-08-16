import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const [token, route, page] = await Promise.all([
  readFile(new URL('../lib/marketing/unsubscribeToken.ts', import.meta.url), 'utf8'),
  readFile(new URL('../app/api/marketing/unsubscribe/route.ts', import.meta.url), 'utf8'),
  readFile(new URL('../app/email-preferences/unsubscribed/page.tsx', import.meta.url), 'utf8'),
]);

test('unsubscribe tokens are authenticated before contact changes', () => {
  assert.match(token, /createHmac\('sha256'/);
  assert.match(token, /timingSafeEqual/);
  assert.match(route, /readMarketingUnsubscribeToken/);
});

test('one-click unsubscribe suppresses the contact and cancels active enrollment', () => {
  assert.match(route, /export async function POST/);
  assert.match(route, /consentStatus: 'OPTED_OUT'/);
  assert.match(route, /status: 'UNSUBSCRIBED'/);
  assert.match(route, /status: 'CANCELLED'/);
  assert.match(page, /Essential account and order emails are not affected/);
});
