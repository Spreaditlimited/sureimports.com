import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
require('@next/env').loadEnvConfig(process.cwd(), false, {
  info() {},
  error() {},
});
const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient({ log: [] });
const root = 'deliverables/adsense-seo-repairs-2026-10-27';
const before = JSON.parse(fs.readFileSync(`${root}/before/blogs.json`, 'utf8'));
const text = (html) =>
  String(html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[\w#]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
const scheduled = before.filter(
  (b) => b.blogPublished && new Date(b.createdAt) > new Date(),
);
const changes = scheduled.flatMap((b) => {
  const reasons = [];
  const words = text(b.blogContent).split(' ').length;
  if (words < 2000)
    reasons.push(
      `Below the site's 2,000-useful-word standard for new publication (${words} words).`,
    );
  if (!b.blogImage) reasons.push('Missing article-specific feature image.');
  if (/content cluster|Sure Imports cluster/i.test(text(b.blogContent)))
    reasons.push('Unreviewed editorial-process language in body.');
  return reasons.length
    ? [
        {
          pidBlog: b.pidBlog,
          slug: b.blogSlug,
          scheduledAt: b.createdAt,
          reasons,
          before: { blogPublished: true },
          after: { blogPublished: false },
        },
      ]
    : [];
});
fs.writeFileSync(
  `${root}/drafts/queue-holds.json`,
  JSON.stringify(changes, null, 2),
);
try {
  if (!process.argv.includes('--apply')) {
    console.log(
      JSON.stringify({
        mode: 'preview',
        scheduled: scheduled.length,
        holds: changes.length,
        unchanged: scheduled
          .filter((b) => !changes.some((c) => c.pidBlog === b.pidBlog))
          .map((b) => b.blogSlug),
      }),
    );
  } else {
    const log = `${root}/validation/queue-holds-applied.json`;
    if (fs.existsSync(log))
      throw new Error('Queue holds were already applied.');
    await db.$transaction(
      async (tx) => {
        for (const change of changes) {
          const b = before.find((b) => b.pidBlog === change.pidBlog);
          const result = await tx.blog.updateMany({
            where: {
              pidBlog: b.pidBlog,
              blogPublished: true,
              createdAt: new Date(b.createdAt),
              updatedAt: b.updatedAt ? new Date(b.updatedAt) : null,
              blogContent: b.blogContent,
              blogImage: b.blogImage,
            },
            data: { blogPublished: false, updatedAt: new Date() },
          });
          if (result.count !== 1)
            throw new Error(
              `Concurrent change detected for ${b.blogSlug}; queue transaction rolled back.`,
            );
        }
      },
      { timeout: 60000 },
    );
    fs.writeFileSync(
      log,
      JSON.stringify({ appliedAt: new Date(), changes }, null, 2),
      { flag: 'wx' },
    );
    console.log(
      `Held ${changes.length} future posts as drafts. Existing published articles and original scheduled dates preserved.`,
    );
  }
} catch (error) {
  console.error(error.code || error.message);
  process.exitCode = 1;
} finally {
  await db.$disconnect();
}
