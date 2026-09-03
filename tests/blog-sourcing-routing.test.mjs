import assert from 'node:assert/strict';
import test from 'node:test';

import { routeBlogSourcingLinks } from '../lib/blogSourcingRouting.ts';

test('product articles route corporate CTAs through their exact LineScout guide', () => {
  const html = routeBlogSourcingLinks({
    slug: 'building-a-high-profit-white-label-brand-with-luggage-straps-in-nigeria',
    title: 'Building a High-Profit White Label Brand With Luggage Straps',
    html: '<p><a class="cta" href="/corporate-sourcing">Start sourcing</a></p>',
  });

  assert.match(
    html,
    /linescout\.sureimports\.com\/white-label\/luggage-strap-with-buckle/,
  );
  assert.doesNotMatch(html, /href="\/corporate-sourcing/);
});

test('generic white-label articles route to the LineScout white-label flow', () => {
  const html = routeBlogSourcingLinks({
    slug: 'white-label-products-in-nigeria',
    title: 'White Label Products in Nigeria',
    html: '<a href="https://www.sureimports.com/corporate-sourcing">Get help</a>',
  });

  assert.match(html, /route_type=white_label/);
});

test('machine articles preserve links explicitly intended for corporate organisations', () => {
  const html = routeBlogSourcingLinks({
    slug: 'rice-milling-production-line-nigeria',
    title: 'Rice Milling Production Line in Nigeria',
    html: `
      <p><a href="/corporate-sourcing">Get machine sourcing help</a></p>
      <p>Established organisations can use
        <a data-sourcing-audience="corporate" href="/corporate-sourcing">Sure Imports Corporate Sourcing</a>.
      </p>
    `,
  });

  assert.match(html, /route_type=machine_sourcing/);
  assert.match(
    html,
    /data-sourcing-audience="corporate" href="\/corporate-sourcing"/,
  );
  assert.match(html, />Sure Imports Corporate Sourcing<\/a>/);
});

test('corporate sourcing anchor text is not silently rerouted to LineScout', () => {
  const html = routeBlogSourcingLinks({
    slug: 'industrial-machinery-guide',
    title: 'Industrial Machinery Guide',
    html: '<a href="/corporate-sourcing">Corporate Sourcing</a>',
  });

  assert.equal(html, '<a href="/corporate-sourcing">Corporate Sourcing</a>');
});

test('the corporate pillar keeps corporate sourcing and declares its audience', () => {
  const html = routeBlogSourcingLinks({
    slug: 'corporate-sourcing-from-china-to-nigeria-pillar-guide-for-business-buyers',
    title: 'Corporate Sourcing From China to Nigeria',
    html: '<a href="/corporate-sourcing">Corporate sourcing</a>',
  });

  assert.match(html, /data-sourcing-audience="corporate"/);
  assert.match(html, /href="\/corporate-sourcing"/);
  assert.match(html, /route_type=simple_sourcing/);
});

test('unrelated articles are not modified', () => {
  const original = '<p>A guide to shipping from China to Nigeria.</p>';
  const html = routeBlogSourcingLinks({
    slug: 'shipping-from-china-to-nigeria',
    title: 'Shipping From China to Nigeria',
    html: original,
  });

  assert.equal(html, original);
});

test('embedded data-image payloads are removed before article rendering', () => {
  const html = routeBlogSourcingLinks({
    slug: 'shipping-from-china-to-nigeria',
    title: 'Shipping From China to Nigeria',
    html: '<p>Before</p><img alt="pasted" src="data:image/png;base64,AAAA"><p>After</p>',
  });

  assert.equal(html, '<p>Before</p><p>After</p>');
});
