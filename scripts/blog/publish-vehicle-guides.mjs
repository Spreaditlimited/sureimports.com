import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL('../../', import.meta.url));
require('@next/env').loadEnvConfig(root, true, { info() {}, error() {} });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const entries = JSON.parse(readFileSync(resolve(root, 'content/vehicle-guides/manifest.json'), 'utf8'));
const slugs = new Set(entries.map((entry) => entry.slug));
if (slugs.size !== entries.length) throw new Error('Duplicate article slug');
const posts = entries.map((entry) => {
  const html = readFileSync(resolve(root, 'content/vehicle-guides', entry.file), 'utf8');
  const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  if (words < 600 || !html.includes('<h2>')) throw new Error(`Article needs more detail: ${entry.slug}`);
  if (/<script|javascript:|src=["']data:/i.test(html)) throw new Error('Unexpected active content');
  if (!entry.image.startsWith('https://res.cloudinary.com/')) throw new Error('Feature image must use Cloudinary');
  for (const link of html.matchAll(/href="\/blog\/([^"#?]+)[^"]*"/g)) {
    if (!slugs.has(link[1])) throw new Error(`Unresolved guide link: ${link[1]}`);
  }
  return { ...entry, html, words, pid: `BLOG_EV_GUIDE_${entry.slug.replaceAll('-', '_').toUpperCase()}` };
});
try {
  const publisher = await prisma.blog_publisher.findUnique({ where: { pidPublisher: 'PUB1767167254459' } });
  if (!publisher?.publisherImage || publisher.status !== 'active') throw new Error('The existing Tochukwu Nkwocha author profile must be active and have an image before publishing.');
  const existing = await prisma.blog.findMany({ where: { blogSlug: { in: [...slugs] } }, select: { pidBlog: true, blogSlug: true, blogPublished: true, xStaus: true, createdAt: true } });
  for (const row of existing) {
    const post = posts.find((post) => post.slug === row.blogSlug);
    if (row.pidBlog !== post.pid) throw new Error(`Existing article collision: ${row.blogSlug}`);
    if (!row.blogPublished || row.xStaus !== 'active' || (row.createdAt && row.createdAt > new Date())) throw new Error(`Existing guide is not public: ${row.blogSlug}`);
  }
  console.log(JSON.stringify({ mode: process.argv.includes('--publish') ? 'publish' : 'dry-run', existing: existing.length, articles: posts.map(({ slug, words }) => ({ slug, words })) }, null, 2));
  if (process.argv.includes('--publish')) {
    await prisma.$transaction(async (tx) => {
      const categoryId = 'CAT_EV_OWNERSHIP';
      await tx.blog_category.upsert({ where: { pidCategory: categoryId }, create: { pidCategory: categoryId, categoryName: 'Electric Vehicles', categorySlug: 'electric-vehicles', categoryDescription: 'Practical guides to importing, charging and owning electric vehicles in Nigeria.', status: 'active' }, update: {} });
      for (const post of posts) {
        if (existing.some((row) => row.pidBlog === post.pid)) continue;
        const collision = await tx.blog.findFirst({ where: { blogSlug: post.slug }, select: { id: true } });
        if (collision) throw new Error(`Concurrent slug collision: ${post.slug}`);
        await tx.blog.create({ data: { pidBlog: post.pid, blogTitle: post.title, blogSlug: post.slug, blogContent: post.html, blogImage: post.image, blogBy: publisher.publisherName, publisherId: publisher.pidPublisher, blogPublished: true, blogFeatured: post.slug === 'ev-vs-petrol-diesel-cost-nigeria', categoryId, xStaus: 'active', createdAt: new Date(), updatedAt: new Date(), blogExt2: JSON.stringify({ seoTitle: post.title, metaDescription: post.description, category: 'Electric Vehicles', tags: ['electric vehicles', 'Nigeria', 'EV ownership'], canonicalUrl: `https://www.sureimports.com/blog/${post.slug}` }) } });
      }
      // The same invariant enforced by admin publication: internal blog destinations must be public.
      const published = await tx.blog.findMany({ where: { blogSlug: { in: [...slugs] }, blogPublished: true, xStaus: 'active', createdAt: { lte: new Date() } }, select: { blogSlug: true } });
      if (new Set(published.map((post) => post.blogSlug)).size !== posts.length) throw new Error('Publication link validation failed');
    }, { timeout: 30000 });
    console.log(`Verified ${posts.length} public guides in the existing blog.`);
  }
} finally { await prisma.$disconnect(); }
