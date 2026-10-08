import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';

// Explicit manual release only. Prepare preserves exact before/after records;
// apply rejects intervening editorial changes and records rollback data atomically.
const prisma = new PrismaClient();
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const output = path.join(root, 'deliverables/seo-implementation-2026-10-08');
const contentDir = path.join(root, 'scripts/seo/content/nigeria-recovery-2026-10');
const batch = 'nigeria-recovery-2026-10-first-three';
const plans = [
  { slug: '25-best-products-to-import-from-china-to-nigeria-in-2026-high-demand-opportunities', file: 'products-selection.html', mode: 'insert', title: '25 Best Products to Import from China to Nigeria in 2026', description: 'Compare 25 product opportunities for Nigerian buyers, with demand checks, sourcing risks and landed-cost factors to assess before importing.', keyword: 'best products to import from china to nigeria' },
  { slug: 'how-to-import-laptops-from-china-to-nigeria-safely', file: 'laptops.html', mode: 'replace', title: 'Laptop Prices in Nigeria: Buying and Importing Guide', description: 'Compare laptop prices, specifications, used-device checks and the full cost of importing from China before buying for your Nigerian business.', keyword: 'laptop price in nigeria' },
  { slug: 'machine-sourcing-from-china-for-nigeria-how-to-do-it-without-guessing', file: 'machines.html', mode: 'replace', title: 'Sourcing Machines from China to Nigeria: Buyer’s Guide', description: 'Plan a machine purchase with clear specifications, factory checks, test-run evidence and installation requirements for use in Nigeria.', keyword: 'machine sourcing from china' },
];
const words = html => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<[^>]*>/g, ' ').replace(/&\w+;/g, ' ').trim().split(/\s+/).length;
const hash = value => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
const snapshot = post => ({ pidBlog: post.pidBlog, blogSlug: post.blogSlug, blogTitle: post.blogTitle, blogContent: post.blogContent, blogExt2: post.blogExt2, blogPublished: post.blogPublished, xStaus: post.xStaus, updatedAt: post.updatedAt?.toISOString() ?? null, createdAt: post.createdAt?.toISOString() ?? null });
async function main() {
  await fs.mkdir(output, { recursive: true });
  const manifestPath = path.join(output, 'first-three-release.json');
  if (!process.argv.includes('--apply')) {
    const changes = [];
    for (const plan of plans) {
      const found = await prisma.blog.findMany({ where: { blogSlug: plan.slug } });
      assert.equal(found.length, 1, `Expected unique existing article: ${plan.slug}`);
      const post = found[0];
      assert(post.blogPublished && post.xStaus === 'active' && (!post.createdAt || post.createdAt <= new Date()));
      assert(!post.blogContent.includes('data-seo-module="nigeria-recovery-2026-10-products"'), 'Batch already applied');
      const before = snapshot(post);
      let body = await fs.readFile(path.join(contentDir, plan.file), 'utf8');
      if (plan.mode === 'insert') {
        assert(/<h2\b/i.test(post.blogContent));
        body = post.blogContent.replace(/<h2\b/i, `${body}\n<h2`);
        body = body.replace(/<a\b([^>]*?)href=(["'])(?:https?:\/\/(?:www\.)?sureimports\.com)?\/corporate-sourcing\2([^>]*)>Corporate Sourcing<\/a>/gi, '<a$1href="https://linescout.sureimports.com/white-label"$3>LineScout white-label sourcing</a>');
      }
      body = body.replace(/href=(["'])(?:https?:\/\/(?:www\.)?sureimports\.com)?\/linescout\1/gi, 'href="https://linescout.sureimports.com/sourcing-project?route_type=machine_sourcing"');
      assert(words(body) >= 2000, `${plan.slug} below minimum`);
      assert(!/<h1\b|<script\b|javascript:/i.test(body), 'Unexpected article markup');
      const seo = JSON.parse(post.blogExt2 || '{}');
      assert(seo && !Array.isArray(seo) && typeof seo === 'object');
      const after = { blogTitle: plan.title, blogContent: body, blogExt2: JSON.stringify({ ...seo, focusKeyword: plan.keyword, metaTitle: plan.title, seoTitle: plan.title, metaDescription: plan.description, ogTitle: plan.title, ogDescription: plan.description, twitterTitle: plan.title, twitterDescription: plan.description, canonicalUrl: `https://www.sureimports.com/blog/${plan.slug}` }) };
      const validation = { beforeHash: hash(before), beforeWords: words(post.blogContent), afterWords: words(body), retainedSlug: plan.slug, minimumWords: 2000, metadataDescriptionLength: plan.description.length };
      changes.push({ before, after, validation });
      await fs.writeFile(path.join(output, `${plan.slug}.html`), `<!doctype html><meta charset="utf-8"><title>${plan.title}</title><main><h1>${plan.title}</h1>${body}</main>`);
    }
    await fs.writeFile(manifestPath, JSON.stringify({ batch, preparedAt: new Date().toISOString(), changes }, null, 2));
    console.log(JSON.stringify({ mode: 'prepared', batch, changes: changes.map(x => ({ slug: x.before.blogSlug, ...x.validation })) }, null, 2));
    return;
  }
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  assert.equal(manifest.batch, batch);
  assert.equal(manifest.changes.length, plans.length);
  const receipts = [];
  await prisma.$transaction(async tx => {
    for (const change of manifest.changes) {
      const current = await tx.blog.findUnique({ where: { pidBlog: change.before.pidBlog } });
      assert.deepEqual(snapshot(current), change.before, 'Article changed after preparation; aborting');
      assert.equal(hash(change.before), change.validation.beforeHash);
      assert(words(change.after.blogContent) >= 2000);
      const now = new Date();
      const result = await tx.blog.updateMany({ where: { pidBlog: current.pidBlog, updatedAt: current.updatedAt, blogContent: current.blogContent, blogExt2: current.blogExt2 }, data: { ...change.after, updatedAt: now } });
      assert.equal(result.count, 1, 'Concurrent editorial update');
      const pidChange = `seo_change_${crypto.randomUUID()}`;
      await tx.seo_content_change_logs.create({ data: { pidChange, pidBlog: current.pidBlog, changeType: batch, status: 'applied', beforeJson: JSON.stringify(change.before), afterJson: JSON.stringify(change.after), validationJson: JSON.stringify(change.validation), publishedAt: now, updatedAt: now } });
      receipts.push({ pidChange, slug: current.blogSlug, words: words(change.after.blogContent), publishedAt: now.toISOString() });
    }
  }, { timeout: 30000 });
  await fs.writeFile(path.join(output, 'first-three-receipt.json'), JSON.stringify(receipts, null, 2));
  console.log(JSON.stringify({ mode: 'applied', receipts }, null, 2));
}
main().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => prisma.$disconnect());
