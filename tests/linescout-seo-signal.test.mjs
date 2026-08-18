import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = await readFile(
  new URL('../app/api/internal/seo/linescout-products/route.ts', import.meta.url),
  'utf8',
);

test('LineScout product signals are protected and read only from Search Console data', () => {
  assert.match(source, /SEO_INTERNAL_API_SECRET/);
  assert.match(source, /authorization/);
  assert.match(source, /search_console_query_stats/);
  assert.match(source, /linescout\.sureimports\.com\/white-label/);
  assert.doesNotMatch(source, /INSERT|UPDATE|DELETE FROM search_console_query_stats/i);
  assert.doesNotMatch(source, /openai|responses\.create|chat\.completions/i);
});
