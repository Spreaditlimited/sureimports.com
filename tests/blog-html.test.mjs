import assert from 'node:assert/strict';
import test from 'node:test';

import { enhanceBlogTables } from '../lib/blogHtml.ts';

test('wraps every blog table in an accessible responsive scroll region', () => {
  const html = enhanceBlogTables(`
    <p>Before</p>
    <table><tbody><tr><td>First</td></tr></tbody></table>
    <p>Between</p>
    <table class="comparison"><tbody><tr><td>Second</td></tr></tbody></table>
  `);

  assert.equal((html.match(/class="blog-table-scroll"/g) || []).length, 2);
  assert.equal((html.match(/role="region"/g) || []).length, 2);
  assert.equal((html.match(/tabindex="0"/g) || []).length, 2);
  assert.match(html, /<table class="comparison">/);
});

test('leaves table-free blog content unchanged', () => {
  const html = '<p>No tabular data here.</p>';
  assert.equal(enhanceBlogTables(html), html);
});
