import fs from 'node:fs';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
require('@next/env').loadEnvConfig(process.cwd(), false, {
  info() {},
  error() {},
});
const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient({ log: [] });
const root = 'deliverables/adsense-seo-repairs-2026-10-27';
const raw = fs.readFileSync(`${root}/drafts/publication-changes.json`, 'utf8');
const changes = JSON.parse(raw);
const validation = JSON.parse(
  fs.readFileSync(`${root}/validation/content-publication.json`, 'utf8'),
);
const before = JSON.parse(fs.readFileSync(`${root}/before/blogs.json`, 'utf8'));
const digest = crypto.createHash('sha256').update(raw).digest('hex');
const log = `${root}/validation/content-applied.json`;
try {
  if (!validation.passed || validation.changesHash !== digest)
    throw new Error('The exact content changes must pass validation first.');
  if (Date.now() - Date.parse(validation.validatedAt) > 24 * 60 * 60 * 1000)
    throw new Error('Publication validation is more than 24 hours old.');
  if (fs.existsSync(log)) throw new Error('Publication was already applied.');
  const current = await db.blog.findMany({
    where: { pidBlog: { in: changes.map((c) => c.pidBlog) } },
    include: { publisher: true, category: true },
  });
  for (const change of changes) {
    const original = before.find((b) => b.pidBlog === change.pidBlog);
    const b = current.find((b) => b.pidBlog === change.pidBlog);
    if (!b) throw new Error(`Missing article ${change.slug}`);
    for (const key of [
      'blogTitle',
      'blogContent',
      'blogSlug',
      'blogPublished',
      'blogImage',
      'blogBy',
      'publisherId',
      'categoryId',
      'blogExt2',
      'xStaus',
    ]) {
      if (b[key] !== original[key])
        throw new Error(`Concurrent change: ${change.slug} (${key})`);
    }
    if (
      b.updatedAt?.toISOString() !== original.updatedAt ||
      b.createdAt?.toISOString() !== original.createdAt
    )
      throw new Error(`Concurrent timestamp change: ${change.slug}`);
    if (
      b.publisher?.publisherName !== 'Tochukwu Nkwocha' ||
      !b.publisher?.publisherImage ||
      b.category?.status !== 'active'
    )
      throw new Error(`Author/category is no longer eligible: ${change.slug}`);
  }
  if (!process.argv.includes('--apply')) {
    console.log(
      JSON.stringify({
        mode: 'preview',
        validatedRecords: changes.length,
        concurrentEdits: 0,
        changesHash: digest,
      }),
    );
  } else {
    const at = new Date();
    await db.$transaction(
      async (tx) => {
        for (const change of changes) {
          const original = before.find((b) => b.pidBlog === change.pidBlog);
          const where = {
            pidBlog: change.pidBlog,
            updatedAt: original.updatedAt ? new Date(original.updatedAt) : null,
            blogPublished: true,
            blogContent: original.blogContent,
            blogImage: original.blogImage,
            blogExt2: original.blogExt2,
            blogTitle: original.blogTitle,
            blogSlug: original.blogSlug,
            publisherId: original.publisherId,
            categoryId: original.categoryId,
            xStaus: 'active',
          };
          const result = await tx.blog.updateMany({
            where,
            data: { ...change.after, updatedAt: at },
          });
          if (result.count !== 1)
            throw new Error(
              `Concurrent change during apply: ${change.slug}; all changes rolled back.`,
            );
        }
      },
      { timeout: 120000 },
    );
    const after = await db.blog.findMany({
      where: { pidBlog: { in: changes.map((c) => c.pidBlog) } },
    });
    for (const change of changes) {
      const row = after.find((b) => b.pidBlog === change.pidBlog);
      for (const [key, value] of Object.entries(change.after))
        if (row[key] !== value)
          throw new Error(
            `Post-write verification failed: ${change.slug} (${key})`,
          );
    }
    fs.writeFileSync(
      log,
      JSON.stringify(
        {
          appliedAt: at,
          changesHash: digest,
          records: changes.length,
          verified: true,
          after,
        },
        null,
        2,
      ),
      { flag: 'wx', mode: 0o600 },
    );
    console.log(
      `Applied and verified ${changes.length} article repairs; all original slugs, IDs and publication dates preserved.`,
    );
  }
} catch (error) {
  console.error(error.code || error.message);
  process.exitCode = 1;
} finally {
  await db.$disconnect();
}
