import assert from 'node:assert/strict';
import test from 'node:test';
import { formatBlogDate } from '../lib/blogDate.ts';
import { hasOptionalCookieConsent } from '../lib/marketing/optionalConsent.ts';

test('publication dates render identically before and after hydration across time zones', () => {
  const previous = process.env.TZ;
  try {
    for (const zone of ['UTC', 'America/Los_Angeles', 'Asia/Shanghai']) {
      process.env.TZ = zone;
      assert.equal(formatBlogDate('2025-12-28'), 'December 28, 2025');
    }
  } finally {
    if (previous === undefined) delete process.env.TZ;
    else process.env.TZ = previous;
  }
});

test('optional tracking needs an affirmative current cookie, including after withdrawal', () => {
  for (const value of [
    '',
    'session=abc',
    'consent=false',
    'consent=trueish',
    'oldconsent=true',
  ]) {
    assert.equal(hasOptionalCookieConsent(value), false);
  }
  assert.equal(
    hasOptionalCookieConsent('session=abc; consent=true; theme=light'),
    true,
  );
  assert.equal(hasOptionalCookieConsent('session=abc; consent=false'), false);
});
