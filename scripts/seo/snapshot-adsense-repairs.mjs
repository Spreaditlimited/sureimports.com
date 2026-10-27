import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
require('@next/env').loadEnvConfig(process.cwd(), false, {
  info() {},
  error() {},
});
const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient({ log: [] });
const out = path.resolve('deliverables/adsense-seo-repairs-2026-10-27/before');
fs.mkdirSync(out, { recursive: true });
try {
  const target = path.join(out, 'blogs.json');
  if (fs.existsSync(target))
    throw new Error('Snapshot already exists; refusing to overwrite.');
  const blogs = await db.blog.findMany({
    include: { category: true, publisher: true },
    orderBy: { id: 'asc' },
  });
  fs.writeFileSync(target, JSON.stringify(blogs, null, 2), {
    flag: 'wx',
    mode: 0o600,
  });
  const now = new Date();
  const scheduled = blogs.filter((b) => b.blogPublished && b.createdAt > now);
  console.log(
    JSON.stringify(
      {
        total: blogs.length,
        scheduled: scheduled.map((b) => ({
          id: b.pidBlog,
          slug: b.blogSlug,
          date: b.createdAt,
        })),
        drafts: blogs
          .filter((b) => !b.blogPublished)
          .map((b) => ({ id: b.pidBlog, slug: b.blogSlug })),
      },
      null,
      2,
    ),
  );
} finally {
  await db.$disconnect();
}
