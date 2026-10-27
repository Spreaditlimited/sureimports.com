import fs from 'node:fs';
import crypto from 'node:crypto';
import {
  articleRepetition,
  findArticleQualityIssues,
} from '../../lib/blogPublicationQuality.ts';

const root = 'deliverables/adsense-seo-repairs-2026-10-27';
const raw = fs.readFileSync(`${root}/drafts/publication-changes.json`, 'utf8');
const changes = JSON.parse(raw);
const before = JSON.parse(fs.readFileSync(`${root}/before/blogs.json`, 'utf8'));
const proposed = before.map((b) => ({
  ...b,
  ...(changes.find((c) => c.pidBlog === b.pidBlog)?.after || {}),
}));
const live = proposed.filter(
  (b) =>
    b.blogPublished &&
    b.xStaus === 'active' &&
    (!b.createdAt || new Date(b.createdAt) <= new Date()),
);
const urls = new Map();
const issues = [];
const articles = [];
for (const change of changes) {
  const b = live.find((b) => b.pidBlog === change.pidBlog);
  if (!b) {
    issues.push(`${change.slug}: not eligible for existing-publication repair`);
    continue;
  }
  const peers = live
    .filter((p) => p.pidBlog !== b.pidBlog)
    .map((p) => ({ slug: p.blogSlug, html: p.blogContent }));
  const quality = findArticleQualityIssues({
    html: b.blogContent,
    newPublication: false,
    image: b.blogImage,
    peers,
  });
  const seo = JSON.parse(b.blogExt2 || '{}');
  if (b.blogSlug !== change.slug) quality.push('Slug changed');
  if (
    b.publisherId !== 'PUB1767167254459' ||
    b.blogBy !== 'Tochukwu Nkwocha' ||
    b.publisher?.publisherName !== 'Tochukwu Nkwocha' ||
    !b.publisher?.publisherImage
  )
    quality.push('Author profile invalid');
  if (
    b.category?.status !== 'active' ||
    seo.category !== b.category?.categoryName
  )
    quality.push('Category mismatch');
  if (
    seo.canonicalUrl !== `https://www.sureimports.com/blog/${b.blogSlug}` ||
    seo.noIndex ||
    seo.noFollow
  )
    quality.push('Canonical or indexing mismatch');
  for (const key of ['ogImage', 'twitterImage']) {
    if (!/^https:\/\//.test(seo[key] || ''))
      quality.push(`${key} must be an absolute HTTPS URL`);
    else urls.set(seo[key], 'image');
  }
  if (
    'blogTitle' in change.after &&
    ((seo.seoTitle || '').length >= 65 ||
      (seo.metaDescription || '').length < 120 ||
      (seo.metaDescription || '').length > 160)
  )
    quality.push('Edited title/description length');
  if (/<script\b|\son\w+\s*=|javascript:/i.test(b.blogContent))
    quality.push('Unsafe article HTML');
  for (const m of b.blogContent.matchAll(/href\s*=\s*(["'])(.*?)\1/g)) {
    const value = m[2].replaceAll('&amp;', '&');
    if (/^(?:mailto:|tel:|#)/.test(value)) continue;
    const url = new URL(value, 'https://www.sureimports.com');
    if (['sureimports.com', 'www.sureimports.com'].includes(url.hostname)) {
      if (/^\/blog\/[^/]+\/?$/.test(url.pathname)) {
        const slug = decodeURIComponent(
          url.pathname.replace(/^\/blog\//, '').replace(/\/$/, ''),
        );
        if (!live.some((p) => p.blogSlug === slug))
          quality.push(`Blog destination unavailable: ${slug}`);
      }
      if (!/^\/(?:auth|dashboard)\//.test(url.pathname))
        urls.set(url.href, 'internal');
    }
  }
  for (const issue of quality) issues.push(`${b.blogSlug}: ${issue}`);
  articles.push({
    slug: b.blogSlug,
    ...articleRepetition(b.blogContent, peers),
    issues: quality,
  });
}
const queue = [...urls].map(([url, type]) => ({ url, type }));
const results = [];
await Promise.all(
  Array.from({ length: 6 }, async () => {
    while (queue.length) {
      const item = queue.shift();
      try {
        let response = await fetch(item.url, {
          method: 'HEAD',
          redirect: 'follow',
          signal: AbortSignal.timeout(30000),
        });
        if (response.status === 405)
          response = await fetch(item.url, {
            signal: AbortSignal.timeout(30000),
          });
        const contentType = response.headers.get('content-type') || '';
        const ok =
          response.ok &&
          (item.type !== 'image' || contentType.startsWith('image/'));
        results.push({
          ...item,
          status: response.status,
          finalUrl: response.url,
          contentType,
          ok,
        });
        if (!ok)
          issues.push(
            `${item.type} URL failed: ${item.url} (${response.status})`,
          );
      } catch (error) {
        results.push({
          ...item,
          ok: false,
          error: error.cause?.code || error.message,
        });
        issues.push(`URL request failed: ${item.url}`);
      }
    }
  }),
);
const report = {
  validatedAt: new Date().toISOString(),
  changesHash: crypto.createHash('sha256').update(raw).digest('hex'),
  changedRecords: changes.length,
  articles,
  urls: results,
  issues,
  passed: issues.length === 0,
};
fs.writeFileSync(
  `${root}/validation/content-publication.json`,
  JSON.stringify(report, null, 2),
);
console.log(
  JSON.stringify(
    {
      changedRecords: changes.length,
      urls: results.length,
      highestSharedRatio: Math.max(...articles.map((a) => a.sharedRatio)),
      issues,
      passed: report.passed,
    },
    null,
    2,
  ),
);
if (!report.passed) process.exitCode = 1;
