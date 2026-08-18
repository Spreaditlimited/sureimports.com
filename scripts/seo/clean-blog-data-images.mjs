import crypto from 'node:crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const apply = process.argv.includes('--apply');

function removeEmbeddedDataImages(html) {
  return String(html || '').replace(
    /<img\b[^>]*\bsrc\s*=\s*(["'])data:[\s\S]*?\1[^>]*>/gi,
    '',
  );
}

function pid() {
  return `seo_change_${crypto.randomUUID()}`;
}

async function main() {
  const posts = await prisma.blog.findMany({
    where: { blogContent: { contains: 'data:' } },
    select: {
      pidBlog: true,
      blogSlug: true,
      blogTitle: true,
      blogContent: true,
    },
  });

  const changes = posts.flatMap((post) => {
    const before = post.blogContent || '';
    const after = removeEmbeddedDataImages(before);
    if (after === before) return [];
    return [{ post, before, after, removedCharacters: before.length - after.length }];
  });

  console.log(
    JSON.stringify(
      {
        mode: apply ? 'apply' : 'dry-run',
        postsScanned: posts.length,
        postsChanged: changes.length,
        removedCharacters: changes.reduce((sum, change) => sum + change.removedCharacters, 0),
        changes: changes.map(({ post, before, after, removedCharacters }) => ({
          slug: post.blogSlug,
          beforeCharacters: before.length,
          afterCharacters: after.length,
          removedCharacters,
        })),
      },
      null,
      2,
    ),
  );

  if (!apply) return;

  for (const change of changes) {
    const now = new Date();
    await prisma.$transaction([
      prisma.seo_content_change_logs.create({
        data: {
          pidChange: pid(),
          pidBlog: change.post.pidBlog,
          changeType: 'cleanup_embedded_data_image',
          status: 'applied',
          beforeJson: JSON.stringify({
            blogTitle: change.post.blogTitle,
            blogSlug: change.post.blogSlug,
            blogContent: change.before,
          }),
          afterJson: JSON.stringify({
            blogTitle: change.post.blogTitle,
            blogSlug: change.post.blogSlug,
            blogContent: change.after,
          }),
          validationJson: JSON.stringify({
            removedCharacters: change.removedCharacters,
            remainingDataImages: (change.after.match(/<img\b[^>]*\bsrc\s*=\s*(["'])data:/gi) || []).length,
          }),
          publishedAt: now,
          createdAt: now,
          updatedAt: now,
        },
      }),
      prisma.blog.update({
        where: { pidBlog: change.post.pidBlog },
        data: { blogContent: change.after, updatedAt: now },
      }),
    ]);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
