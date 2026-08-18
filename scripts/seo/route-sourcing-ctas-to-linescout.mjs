import crypto from 'node:crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const apply = process.argv.includes('--apply');

const ROUTES = {
  white_label:
    'https://linescout.sureimports.com/sourcing-project?route_type=white_label',
  machine_sourcing:
    'https://linescout.sureimports.com/sourcing-project?route_type=machine_sourcing',
  simple_sourcing:
    'https://linescout.sureimports.com/sourcing-project?route_type=simple_sourcing',
};

const INSTITUTIONAL_PATTERN =
  /\b(corporate sourcing|corporate gift|bank|government|ministry|institutional|enterprise procurement|large compan(?:y|ies)|ngo)\b/i;
const WHITE_LABEL_PATTERN =
  /\b(white[ -]?label|private[ -]?label|oem|odm|own brand)\b/i;
const MACHINE_PATTERN =
  /\b(machine|machinery|industrial equipment|production line|packaging equipment|manufacturing equipment)\b/i;
const BULK_PATTERN =
  /\b(bulk sourcing|wholesale sourcing|source products?|product sourcing|find (?:a )?supplier|supplier sourcing)\b/i;
const CORPORATE_LINK_PATTERN =
  /<a\b([^>]*?)href=(["'])(?:https?:\/\/(?:www\.)?sureimports\.com)?\/corporate-sourcing(?:#[^"']*)?\2([^>]*)>([\s\S]*?)<\/a>/gi;

function classify(post) {
  const subject = `${post.blogTitle || ''} ${post.blogSlug || ''}`;
  if (INSTITUTIONAL_PATTERN.test(subject)) return null;
  if (WHITE_LABEL_PATTERN.test(subject)) return 'white_label';
  if (MACHINE_PATTERN.test(subject)) return 'machine_sourcing';
  if (BULK_PATTERN.test(subject)) return 'simple_sourcing';
  return null;
}

function rewriteCorporateLinks(html, route) {
  const destination = ROUTES[route];
  return html.replace(
    CORPORATE_LINK_PATTERN,
    `<a$1href="${destination}"$3>$4</a>`,
  );
}

async function main() {
  const posts = await prisma.blog.findMany({
    where: {
      blogPublished: true,
      blogContent: { contains: 'corporate-sourcing' },
    },
    select: {
      pidBlog: true,
      blogSlug: true,
      blogTitle: true,
      blogContent: true,
    },
  });

  const planned = posts.flatMap((post) => {
    const route = classify(post);
    if (!route) return [];
    const after = rewriteCorporateLinks(post.blogContent || '', route);
    return after === post.blogContent ? [] : [{ post, route, after }];
  });

  console.log(
    JSON.stringify(
      {
        mode: apply ? 'apply' : 'dry-run',
        changes: planned.map(({ post, route }) => ({
          slug: post.blogSlug,
          route,
          destination: ROUTES[route],
        })),
      },
      null,
      2,
    ),
  );

  if (!apply) return;

  for (const { post, route, after } of planned) {
    const now = new Date();
    await prisma.$transaction([
      prisma.seo_content_change_logs.create({
        data: {
          pidChange: `seo_change_${crypto.randomUUID()}`,
          pidBlog: post.pidBlog,
          changeType: 'sourcing_funnel_cta_route',
          status: 'applied',
          beforeJson: JSON.stringify({
            blogTitle: post.blogTitle,
            blogSlug: post.blogSlug,
            blogContent: post.blogContent,
          }),
          afterJson: JSON.stringify({
            blogTitle: post.blogTitle,
            blogSlug: post.blogSlug,
            blogContent: after,
          }),
          validationJson: JSON.stringify({
            route,
            destination: ROUTES[route],
            corporateLinkRemoved:
              !/(?:https?:\/\/(?:www\.)?sureimports\.com)?\/corporate-sourcing(?:#|["'])/i.test(
                after,
              ),
          }),
          publishedAt: now,
          createdAt: now,
          updatedAt: now,
        },
      }),
      prisma.blog.update({
        where: { pidBlog: post.pidBlog },
        data: { blogContent: after, updatedAt: now },
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
