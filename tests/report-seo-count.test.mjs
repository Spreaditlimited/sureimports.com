import assert from 'node:assert/strict';
import test from 'node:test';

import { getReportSeo, REPORT_SEO } from '../lib/intelligence/reportSeo.ts';

test('resolves the published manufacturer count in visible and metadata copy', () => {
  const seo = getReportSeo('body-cameras', 12);
  assert.ok(seo);
  assert.match(seo.metaDescription, /12 reviewed body camera manufacturers/);
  assert.match(seo.introduction, /12 reviewed body camera manufacturers/);
  assert.doesNotMatch(seo.metaDescription, /10 reviewed/);
  assert.doesNotMatch(seo.introduction, /10 reviewed/);
});

test('removes the stale phone-accessories count', () => {
  const seo = getReportSeo('phone-accessories', 10);
  assert.ok(seo);
  assert.match(
    seo.metaDescription,
    /10 reviewed phone accessories manufacturers/,
  );
  assert.match(seo.introduction, /10 reviewed phone accessories manufacturers/);
  assert.doesNotMatch(seo.metaDescription, /14 reviewed/);
  assert.doesNotMatch(seo.introduction, /14 reviewed/);
});

test('SEO source profiles contain placeholders rather than literal reviewed counts', () => {
  for (const [slug, profile] of Object.entries(REPORT_SEO)) {
    assert.doesNotMatch(
      `${profile.metaDescription} ${profile.introduction}`,
      /\b\d+ reviewed\b/,
      `${slug} contains a hardcoded reviewed-manufacturer count`,
    );
  }
});

test('unknown report slugs remain unsupported', () => {
  assert.equal(getReportSeo('not-a-report', 12), null);
});
