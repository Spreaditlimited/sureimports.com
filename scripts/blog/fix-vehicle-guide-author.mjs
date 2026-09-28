import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL('../../', import.meta.url));
require('@next/env').loadEnvConfig(root, true, { info() {}, error() {} });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const pidPublisher = 'PUB1767167254459';
const entries = JSON.parse(readFileSync(`${root}content/vehicle-guides/manifest.json`, 'utf8'));
const ids = entries.map(({slug}) => `BLOG_EV_GUIDE_${slug.replaceAll('-', '_').toUpperCase()}`);
try {
  const result = await prisma.$transaction(async (tx) => {
    const publisher = await tx.blog_publisher.findUnique({ where: { pidPublisher } });
    if (publisher?.publisherName !== 'Tochukwu Nkwocha' || !publisher.publisherImage || publisher.status !== 'active') throw new Error('Expected active Tochukwu Nkwocha profile with image');
    const updated = await tx.blog.updateMany({ where: { pidBlog: { in: ids } }, data: { publisherId: pidPublisher, blogBy: publisher.publisherName } });
    const verified = await tx.blog.count({ where: { pidBlog: { in: ids }, publisherId: pidPublisher, blogBy: publisher.publisherName } });
    if (verified !== entries.length) throw new Error('Not all vehicle guides matched the author profile');
    return { updated: updated.count, verified, author: publisher.publisherName, image: publisher.publisherImage };
  });
  console.log(JSON.stringify(result));
} finally { await prisma.$disconnect(); }
