import assert from 'node:assert/strict';
import test from 'node:test';
import {
  articleRepetition,
  findArticleQualityIssues,
} from '../lib/blogPublicationQuality.ts';
import { blogListingHref, parseBlogListingParams } from '../lib/blogListing.ts';
import { resolveBlogMediaUrl } from '../lib/blogMedia.ts';

test('pagination retains filters and has a distinct canonical destination', () => {
  assert.equal(
    blogListingHref(parseBlogListingParams({ page: '2' })),
    '/blog?page=2',
  );
  assert.equal(
    blogListingHref(
      parseBlogListingParams({ page: '2', tag: 'China Sourcing' }),
    ),
    '/blog?tag=China+Sourcing&page=2',
  );
  assert.equal(
    blogListingHref(parseBlogListingParams({ page: '1', category: 'All' })),
    '/blog',
  );
  assert.equal(parseBlogListingParams({ page: '2garbage' }).page, 1);
  assert.equal(parseBlogListingParams({ page: '-3' }).page, 1);
});

test('Cloudinary public IDs do not become malformed site hostnames', () => {
  const before = process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL;
  process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL =
    'https://res.cloudinary.com/example/image/upload/';
  try {
    const expected =
      'https://res.cloudinary.com/example/image/upload/admin-sureimports/blog/BLOG_AFF_example';
    assert.equal(
      resolveBlogMediaUrl('admin-sureimports/blog/BLOG_AFF_example'),
      expected,
    );
    assert.equal(resolveBlogMediaUrl('BLOG_AFF_example'), expected);
    assert.equal(
      resolveBlogMediaUrl(
        'https://www.sureimports.comadmin-sureimports/blog/BLOG_AFF_example',
      ),
      expected,
    );
    assert.equal(
      resolveBlogMediaUrl('/images/test.png'),
      'https://www.sureimports.com/images/test.png',
    );
    assert.equal(
      resolveBlogMediaUrl('javascript:alert(1)', 'fallback'),
      'fallback',
    );
  } finally {
    if (before === undefined)
      delete process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL;
    else process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL = before;
  }
});

test('publication gate catches recycled body paragraphs, not ordinary short labels', () => {
  const repeated = `<p>${'Repeated purchase instructions '.repeat(80)}</p>`;
  const html = `${repeated}<h2>Costs</h2><p>Different topic.</p>`;
  const peers = ['one', 'two', 'three'].map((slug) => ({
    slug,
    html: repeated,
  }));
  assert.ok(articleRepetition(html, peers).sharedRatio > 0.9);
  assert.ok(
    findArticleQualityIssues({
      html,
      peers,
      image: 'valid',
      newPublication: false,
    }).some((s) => /repeat long paragraphs/.test(s)),
  );
  assert.deepEqual(
    findArticleQualityIssues({
      html: '<h2>Costs</h2><p>Different topic.</p>',
      peers,
      image: 'valid',
      newPublication: false,
    }),
    [],
  );
});

test('draft gate enforces new-publication completeness without imposing a Google word-count rule on existing repairs', () => {
  const html = '<p>A concise, original explanation.</p>';
  assert.equal(
    findArticleQualityIssues({
      html,
      peers: [],
      image: 'valid',
      newPublication: false,
    }).length,
    0,
  );
  const issues = findArticleQualityIssues({
    html: html + '<a href="/blog/undefined">broken</a>',
    peers: [],
    image: '',
    newPublication: true,
  });
  assert.ok(issues.some((s) => /2,000/.test(s)));
  assert.ok(issues.some((s) => /feature image/.test(s)));
  assert.ok(issues.some((s) => /Invalid internal/.test(s)));
});
