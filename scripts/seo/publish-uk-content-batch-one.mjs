import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { PrismaClient } from '@prisma/client';

// Manual editorial batch approved by the owner. Does not enable auto-publishing.
const prisma = new PrismaClient();
const apply = process.argv.includes('--apply');
const batchTwo = process.argv.includes('--batch-two');
const batchThree = process.argv.includes('--batch-three');
const batchFour = process.argv.includes('--batch-four');
assert(
  [batchTwo, batchThree, batchFour].filter(Boolean).length <= 1,
  'Select only one batch',
);
const marker = batchFour
  ? 'uk-content-batch-four'
  : batchThree
    ? 'uk-content-batch-three'
    : batchTwo
      ? 'uk-content-batch-two'
      : 'uk-content-batch-one';
const hub = 'https://www.sureimports.com/import-from-china-to-uk';
const catalogue = 'https://linescout.sureimports.com/white-label';
const legacy =
  'https://linescout.sureimports.com/sourcing-project?route_type=white_label';
const plans = batchFour
  ? (await import('./uk-content-batch-four.mjs')).plans
  : batchThree
    ? (await import('./uk-content-batch-three.mjs')).plans
    : batchTwo
      ? (await import('./uk-content-batch-two.mjs')).plans
      : [
          {
            slug: 'how-to-build-your-own-white-label-products-in-china-for-the-nigerian-market',
            anchor:
              '<h2><strong>What Is White Label Manufacturing?</strong></h2>',
            html: `<section data-seo-module="${marker}">
<h2>Sourcing white label products from China for the UK?</h2>
<p>This guide focuses on Nigeria. The supplier comparison, sample approval and branding process is useful for UK buyers too, but the delivery budget and product requirements must match the market where you will sell. Start with our <a href="${hub}">guide to importing from China to the UK</a> for the UK buying and shipping routes.</p>
<p>Before asking a manufacturer for a quote, prepare a UK-specific brief:</p>
<ul><li><strong>Buyer and sales channel:</strong> say who the product is for and whether you plan to sell through your own shop, Amazon or TikTok Shop. A popular product idea is not proof of demand for your brand.</li>
<li><strong>Product and branding:</strong> specify materials, size, colour, logo placement, packaging and order quantity. Request a sample of the version you intend to sell, not just a generic factory sample.</li>
<li><strong>Delivery destination:</strong> include the UK postcode, carton dimensions and weight when available. Do not reuse a Nigeria freight estimate for a UK order.</li>
<li><strong>Selling costs:</strong> compare the full delivered cost with your expected GBP selling price, allowing for fulfilment, platform fees, advertising and returns.</li>
<li><strong>Checks before production:</strong> confirm the requirements for your product and destination before approving packaging or paying for a bulk order. Use the <a href="https://www.gov.uk/import-goods-into-uk">official UK import checklist</a> rather than assuming Nigerian requirements apply.</li></ul>
<p>To explore products, open the <a href="${catalogue}">LineScout white-label catalogue</a> and select the United Kingdom. Treat the product ideas and estimated landed costs as a starting point for research, not a guaranteed margin or final supplier quote.</p>
</section>`,
          },
          {
            slug: 'how-to-build-a-china-import-budget-before-you-contact-any-supplier',
            anchor: '<h2>Start with total cash available</h2>',
            html: `<section data-seo-module="${marker}">
<h2>Building a China-to-UK import budget in GBP</h2>
<p>The examples and linked reading below focus on Nigeria. If your goods are going to the UK, keep the budgeting method but replace the destination assumptions. Our <a href="${hub}">China-to-UK importing guide</a> helps you choose the route that fits whether you already have product links, need sourcing support or only need shipping.</p>
<p>Create a worksheet with one line for each cost: samples, goods, branding and packaging, delivery within China, sourcing support, international freight, destination charges and delivery to your UK postcode. Record the quote currency, exchange rate used, what is included and when payment is due. This helps prevent counting an included charge twice or mistaking an unquoted charge for zero.</p>
<p>Keep your purchasing budget separate from your selling budget. Selling costs can include storage, fulfilment, marketplace fees, advertising and returns. Also set aside a reserve instead of committing every pound to inventory. Use confirmed quotes for the final buying decision; an early estimate is not a price commitment.</p>
<h3>A simple budget check before you request quotes</h3>
<ul><li>How much cash can you commit without using the money needed to launch and sell the product?</li><li>What quantity can you test before committing to a larger order?</li><li>Which costs have written quotes, and which are still estimates?</li><li>Can the budget absorb a higher freight quote or slower sales?</li><li>Does the supplier know your delivery destination and your exact product and packaging requirements?</li></ul>
<p>If you are budgeting for your own brand, explore the <a href="${catalogue}">white-label product ideas on LineScout</a> with the United Kingdom selected. Shortlist products first, then confirm the specification and actual costs before deciding how many units to buy.</p>
</section>`,
          },
        ];

const hash = (value) => crypto.createHash('sha256').update(value).digest('hex');
const snapshot = ({ blogContent, blogTitle, blogSlug, blogExt2 }) => ({
  blogContent,
  blogTitle,
  blogSlug,
  blogExt2,
});

async function main() {
  const evidence = await prisma.search_console_query_stats.findMany({
    where: {
      country: 'gbr',
      query: {
        in: [
          'white label products china',
          'china concierge service private label process',
        ],
      },
    },
    select: {
      query: true,
      pageUrl: true,
      date: true,
      impressions: true,
      clicks: true,
    },
  });
  // User explicitly approved the new UK hub and catalogue destinations in this project.
  const addedLinks = [
    ...new Set(
      plans.flatMap((plan) =>
        [...plan.html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]),
      ),
    ),
  ];
  for (const url of addedLinks) {
    assert(url.startsWith('https://'), 'Added links must use HTTPS');
    const response = await fetch(url, { signal: AbortSignal.timeout(45000) });
    assert.equal(response.status, 200, `Link unavailable: ${url}`);
    assert.equal(
      new URL(response.url).pathname.replace(/\/$/, ''),
      new URL(url).pathname,
      `Unexpected redirect: ${url}`,
    );
    await response.body?.cancel();
  }
  const changes = [];
  for (const plan of plans) {
    const matches = await prisma.blog.findMany({
      where: { blogSlug: plan.slug },
    });
    assert.equal(matches.length, 1, `Ambiguous article: ${plan.slug}`);
    const post = matches[0];
    assert(
      post.blogPublished &&
        post.xStaus === 'active' &&
        (!post.createdAt || post.createdAt <= new Date()),
      'Only currently published articles are eligible',
    );
    if (post.blogContent.includes(`data-seo-module="${marker}"`)) {
      console.log(
        JSON.stringify({ slug: plan.slug, status: 'already-applied' }),
      );
      continue;
    }
    assert.equal(
      post.blogContent.split(plan.anchor).length,
      2,
      'Insertion anchor must be unique',
    );
    assert(!/<script|<style|\son\w+=/i.test(plan.html), 'Unsafe added HTML');
    const stack = [];
    for (const tag of plan.html.matchAll(/<(\/?)([a-z0-9]+)\b([^>]*)>/gi)) {
      assert(
        ['section', 'h2', 'h3', 'p', 'ul', 'ol', 'li', 'strong', 'a'].includes(
          tag[2],
        ),
        'Unapproved HTML tag',
      );
      if (tag[1]) assert.equal(stack.pop(), tag[2], 'Unbalanced HTML');
      else {
        const attrs = tag[3]
          .replace(/\s+(?:href|data-seo-module)="[^"]*"/g, '')
          .trim();
        assert.equal(attrs, '', 'Unapproved HTML attribute');
        stack.push(tag[2]);
      }
    }
    assert.equal(stack.length, 0, 'Unclosed HTML tag');
    let normalized = post.blogContent.replaceAll(legacy, catalogue);
    for (const [from, to] of plan.corrections || []) {
      assert.equal(
        normalized.split(from).length,
        2,
        `Correction must match exactly once: ${from}`,
      );
      normalized = normalized.replace(from, to);
    }
    const content = normalized.replace(
      plan.anchor,
      `${plan.html}\n${plan.anchor}`,
    );
    assert.equal(
      content.replace(`${plan.html}\n`, ''),
      normalized,
      'Existing body must be preserved',
    );
    const before = snapshot(post);
    const after = { ...before, blogContent: content };
    const validation = {
      batch: marker,
      trigger: 'Owner-approved UK content strategy and validated publication',
      preservedTitleSlugMetadata: true,
      preservedBodyExceptLegacyCtaUrls: true,
      htmlAllowlistAndBalancePassed: true,
      linkChecksPassed: true,
      checkedLinks: addedLinks,
      linkApproval:
        'Owner requested UK hub and all white-label CTAs to catalogue',
      beforeHash: hash(post.blogContent),
      afterHash: hash(content),
      sourceQueries: evidence,
      evidenceScope: 'UK cluster context; not a claim of page-specific demand',
      checkedAt: new Date().toISOString(),
    };
    validation.editorialCorrections = plan.corrections || [];
    validation.preservedBodyExceptLegacyCtaUrls = !plan.corrections?.length;
    validation.preservedBodyExceptRecordedCorrections = true;
    changes.push({ post, before, after, validation });
  }
  console.log(
    JSON.stringify(
      {
        mode: apply ? 'apply' : 'dry-run',
        articles: changes.map(({ post, validation }) => ({
          slug: post.blogSlug,
          beforeHash: validation.beforeHash,
          afterHash: validation.afterHash,
        })),
      },
      null,
      2,
    ),
  );
  if (!apply || !changes.length) return;
  // Persist reviewable drafts before applying, then apply the whole batch atomically.
  const logs = await prisma.$transaction(
    changes.map(({ post, before, after, validation }) =>
      prisma.seo_content_change_logs.create({
        data: {
          pidChange: `seo_change_${crypto.randomUUID()}`,
          pidBlog: post.pidBlog,
          changeType: marker,
          status: 'draft',
          beforeJson: JSON.stringify(before),
          afterJson: JSON.stringify(after),
          validationJson: JSON.stringify(validation),
          updatedAt: new Date(),
        },
      }),
    ),
  );
  await prisma.$transaction(async (tx) => {
    for (const [index, change] of changes.entries()) {
      const current = await tx.blog.findUnique({
        where: { pidBlog: change.post.pidBlog },
      });
      assert.deepEqual(
        snapshot(current),
        change.before,
        'Concurrent editorial change; draft retained',
      );
      assert(
        current.blogPublished &&
          current.xStaus === 'active' &&
          (!current.createdAt || current.createdAt <= new Date()),
        'Publication eligibility changed',
      );
      const updated = await tx.blog.updateMany({
        where: {
          pidBlog: current.pidBlog,
          blogContent: change.before.blogContent,
          blogTitle: current.blogTitle,
          blogSlug: current.blogSlug,
          blogExt2: current.blogExt2,
          blogPublished: true,
          xStaus: 'active',
          updatedAt: current.updatedAt,
        },
        data: { blogContent: change.after.blogContent, updatedAt: new Date() },
      });
      assert.equal(updated.count, 1, 'Concurrent update; aborting batch');
      await tx.seo_content_change_logs.update({
        where: { pidChange: logs[index].pidChange },
        data: {
          status: 'applied',
          publishedAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
  });
  for (const change of changes) {
    const saved = await prisma.blog.findUnique({
      where: { pidBlog: change.post.pidBlog },
    });
    assert.deepEqual(
      snapshot(saved),
      change.after,
      'Readback verification failed',
    );
  }
  console.log(
    `Published and verified ${changes.length} articles. Before/after snapshots retained in SEO change logs.`,
  );
}

main()
  .finally(() => prisma.$disconnect())
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
