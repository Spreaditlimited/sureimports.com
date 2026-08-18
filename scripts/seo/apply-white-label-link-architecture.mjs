import crypto from 'node:crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const apply = process.argv.includes('--apply');

const WINNER_SLUG =
  'how-to-build-your-own-white-label-products-in-china-for-the-nigerian-market';
const REDIRECTED_SLUG =
  'build-your-empire-the-ultimate-guide-to-white-labeling-products-from-china-for-the-nigerian-market';

const PRODUCT_ARTICLES = [
  {
    slug: 'beyond-the-old-t-shirt-why-microfiber-cloths-are-nigeria-s-next-big-white-label-essential',
    productUrl:
      'https://linescout.sureimports.com/white-label/reusable-microfiber-cleaning-cloths',
    productLabel: 'private-label microfiber cleaning cloth sourcing guide',
  },
  {
    slug: 'building-a-high-profit-white-label-brand-with-luggage-straps-in-nigeria',
    productUrl:
      'https://linescout.sureimports.com/white-label/luggage-strap-with-buckle',
    productLabel: 'private-label luggage strap sourcing guide',
  },
  {
    slug: 'the-invisible-goldmine-why-foldable-laundry-bags-are-nigeria-s-most-underrated-white-label-opportunity',
    productUrl:
      'https://linescout.sureimports.com/white-label/foldable-laundry-basket',
    productLabel: 'private-label foldable laundry basket sourcing guide',
  },
];

const PRODUCT_IDEAS_MODULE = `
<section data-seo-module="white-label-product-ideas">
  <h2>Explore White Label Product Ideas and Sourcing Guides</h2>
  <p>When you are ready to move from a general private-label plan to a product specification, explore the <a href="https://linescout.sureimports.com/white-label">LineScout white-label product catalogue by Sure Imports</a>. Each expanded guide helps you define the product, customization choices, supplier questions, quality checks and sourcing risks before requesting a quote.</p>
  <ul>
    <li><a href="https://linescout.sureimports.com/white-label/ultra-slim-power-bank">Private-label power bank sourcing guide</a></li>
    <li><a href="https://linescout.sureimports.com/white-label/reusable-microfiber-cleaning-cloths">Private-label microfiber cleaning cloth sourcing guide</a></li>
    <li><a href="https://linescout.sureimports.com/white-label/luggage-strap-with-buckle">Private-label luggage strap sourcing guide</a></li>
    <li><a href="https://linescout.sureimports.com/white-label/dual-compartment-insulated-lunch-bag">Private-label insulated lunch bag sourcing guide</a></li>
    <li><a href="https://linescout.sureimports.com/white-label/foldable-laundry-basket">Private-label foldable laundry basket sourcing guide</a></li>
  </ul>
  <p>If you already know what you want to produce, <a href="https://linescout.sureimports.com/sourcing-project?route_type=white_label">start a LineScout white-label sourcing project</a>. Your project stays in LineScout through supplier research, quotes, payments and the project conversation.</p>
</section>`;

function pid() {
  return `seo_change_${crypto.randomUUID()}`;
}

function appendBeforeClosingBody(html, module) {
  if (/<\/body>/i.test(html)) return html.replace(/<\/body>/i, `${module}\n</body>`);
  return `${html.trim()}\n${module}`;
}

function ensureProductArticleLinks(html, item) {
  let next = html;
  if (!next.includes(item.productUrl)) {
    next = appendBeforeClosingBody(
      next,
      `<p data-seo-module="product-sourcing-guide">Continue with the <a href="${item.productUrl}">${item.productLabel}</a> for supplier questions, specifications and quality checks.</p>`,
    );
  }
  return next;
}

function routeWhiteLabelCtasToLineScout(html, destination = 'https://linescout.sureimports.com/sourcing-project?route_type=white_label') {
  return html.replace(
    /<a\b[^>]*href=(["'])\/corporate-sourcing\1[^>]*>[\s\S]*?<\/a>/gi,
    `<a href="${destination}">continue with this product in LineScout</a>`,
  );
}

async function logAndUpdate(post, after, changeType) {
  const before = post.blogContent || '';
  if (before === after) return false;
  const now = new Date();
  await prisma.$transaction([
    prisma.seo_content_change_logs.create({
      data: {
        pidChange: pid(),
        pidBlog: post.pidBlog,
        changeType,
        status: 'applied',
        beforeJson: JSON.stringify({
          blogTitle: post.blogTitle,
          blogSlug: post.blogSlug,
          blogContent: before,
        }),
        afterJson: JSON.stringify({
          blogTitle: post.blogTitle,
          blogSlug: post.blogSlug,
          blogContent: after,
        }),
        validationJson: JSON.stringify({
          containsLineScoutHub: after.includes('https://linescout.sureimports.com/white-label'),
          containsLineScoutSourcing: after.includes('/sourcing-project?route_type=white_label'),
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
  return true;
}

async function main() {
  const slugs = [WINNER_SLUG, REDIRECTED_SLUG, ...PRODUCT_ARTICLES.map((item) => item.slug)];
  const posts = await prisma.blog.findMany({
    where: { blogSlug: { in: slugs } },
    select: {
      pidBlog: true,
      blogSlug: true,
      blogTitle: true,
      blogContent: true,
      blogPublished: true,
      xStaus: true,
    },
  });
  const bySlug = new Map(posts.map((post) => [post.blogSlug, post]));
  const winner = bySlug.get(WINNER_SLUG);
  const redirected = bySlug.get(REDIRECTED_SLUG);
  if (!winner || !redirected) throw new Error('The white-label pillar posts were not found.');

  const planned = [];
  const winnerBase = routeWhiteLabelCtasToLineScout(winner.blogContent || '');
  const winnerAfter = winnerBase.includes('data-seo-module="white-label-product-ideas"')
    ? winnerBase
    : appendBeforeClosingBody(winnerBase, PRODUCT_IDEAS_MODULE);
  if (winnerAfter !== winner.blogContent) planned.push({ slug: WINNER_SLUG, action: 'add_product_hub' });

  for (const item of PRODUCT_ARTICLES) {
    const post = bySlug.get(item.slug);
    if (!post) continue;
    const after = ensureProductArticleLinks(
      routeWhiteLabelCtasToLineScout(post.blogContent || '', item.productUrl),
      item,
    );
    if (after !== post.blogContent) planned.push({ slug: item.slug, action: 'repair_product_and_cta_links' });
  }

  if (redirected.blogPublished || redirected.xStaus !== 'redirected') {
    planned.push({ slug: REDIRECTED_SLUG, action: 'retire_for_permanent_redirect' });
  }

  console.log(JSON.stringify({ mode: apply ? 'apply' : 'dry-run', planned }, null, 2));
  if (!apply) return;

  await logAndUpdate(winner, winnerAfter, 'white_label_pillar_internal_links');
  for (const item of PRODUCT_ARTICLES) {
    const post = bySlug.get(item.slug);
    if (!post) continue;
    await logAndUpdate(
      post,
      ensureProductArticleLinks(
        routeWhiteLabelCtasToLineScout(post.blogContent || '', item.productUrl),
        item,
      ),
      'white_label_product_internal_links',
    );
  }

  if (redirected.blogPublished || redirected.xStaus !== 'redirected') {
    const now = new Date();
    await prisma.$transaction([
      prisma.seo_content_change_logs.create({
        data: {
          pidChange: pid(),
          pidBlog: redirected.pidBlog,
          changeType: 'white_label_pillar_consolidation_redirect',
          status: 'applied',
          beforeJson: JSON.stringify(redirected),
          afterJson: JSON.stringify({
            ...redirected,
            blogPublished: false,
            xStaus: 'redirected',
            redirectTarget: `/blog/${WINNER_SLUG}`,
          }),
          validationJson: JSON.stringify({ permanentRedirectImplementedInCode: true }),
          publishedAt: now,
          createdAt: now,
          updatedAt: now,
        },
      }),
      prisma.blog.update({
        where: { pidBlog: redirected.pidBlog },
        data: { blogPublished: false, xStaus: 'redirected', updatedAt: now },
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
