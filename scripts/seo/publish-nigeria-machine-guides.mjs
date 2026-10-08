import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const out = path.join(root, 'deliverables/seo-implementation-2026-10-08');
const manifestPath = path.join(out, 'new-machine-guides-release.json');
const batch = 'nigeria-recovery-2026-10-new-machines';
const words = html => html.replace(/<[^>]*>/g, ' ').replace(/&\w+;/g, ' ').trim().split(/\s+/).length;
const specs = [
  { pid: 'BLOG1791491922704', image: 'admin-sureimports/blog/BLOG_GEN_ice-block-making-machine-price-nigeria_1791491661207', file: 'ice-block.html', slug: 'ice-block-making-machine-price-nigeria', title: 'Ice Block Making Machines in Nigeria: Prices and Buying', description: 'Compare ice block machines by output, power requirements and total setup cost, with practical checks for buying locally or sourcing from China.', keyword: 'ice block making machine' },
  { pid: 'BLOG1791491922705', image: 'admin-sureimports/blog/BLOG_GEN_industrial-sewing-machine-price-nigeria_1791491548166', file: 'sewing.html', slug: 'industrial-sewing-machine-price-nigeria', title: 'Industrial Sewing Machine Prices in Nigeria: Buyer’s Guide', description: 'Compare industrial sewing machines by stitch type, fabric, motor and total cost, including what to check when importing from China.', keyword: 'industrial sewing machine price in nigeria' },
];
async function validatePublishingIdentity(client, article) {
  // Revalidate identity at application time so pre-correction manifests cannot publish.
  assert(/^BLOG\d{13}$/.test(article.pidBlog), 'Use the admin BLOG + timestamp ID format');
  assert(article.blogImage?.startsWith('admin-sureimports/blog/'), 'Generate and upload an article-specific image before publication');
  const publisher = await client.blog_publisher.findUnique({ where: { pidPublisher: article.publisherId || '' } });
  const category = await client.blog_category.findUnique({ where: { pidCategory: article.categoryId || '' } });
  assert(publisher?.status === 'active' && publisher.publisherImage && publisher.publisherName === article.blogBy, 'Use an active existing publisher with an image');
  assert(category?.status === 'active', 'Use an active existing blog category');
}
const snap = row => ({ pidBlog: row.pidBlog, blogSlug: row.blogSlug, blogTitle: row.blogTitle, blogContent: row.blogContent, blogExt2: row.blogExt2, updatedAt: row.updatedAt?.toISOString() ?? null });
async function main() {
  await fs.mkdir(out, { recursive: true });
  if (!process.argv.includes('--apply')) {
    const candidates = await prisma.blog.findMany({ where: { OR: [{ blogSlug: { contains: 'ice-block' } }, { blogSlug: { contains: 'sewing' } }] }, select: { blogSlug: true, blogTitle: true, blogPublished: true } });
    assert.equal(candidates.length, 0, 'A related article already exists; review ownership before publishing');
    const additions = [];
    for (const spec of specs) {
      const body = await fs.readFile(path.join(root, 'scripts/seo/content/nigeria-recovery-2026-10', spec.file), 'utf8');
      assert(words(body) >= 2000);assert(!/<h1\b|<script\b|javascript:/i.test(body));
      additions.push({ pidBlog: spec.pid, blogSlug: spec.slug, blogTitle: spec.title, blogContent: body, blogPublished: true, xStaus: 'active', blogBy: 'Sure Imports Editorial', publisherId: 'PUB_SURE_IMPORTS_EDITORIAL', categoryId: 'CAT1766930711389', blogImage: spec.image, blogExt2: JSON.stringify({ metaTitle: spec.title, seoTitle: spec.title, metaDescription: spec.description, focusKeyword: spec.keyword, canonicalUrl: `https://www.sureimports.com/blog/${spec.slug}`, category: 'Import Guide', ogTitle: spec.title, ogDescription: spec.description, twitterTitle: spec.title, twitterDescription: spec.description, keywords: [spec.keyword], tags: ['Nigeria', 'Machine Sourcing'], noIndex: false, noFollow: false }) });
      await fs.writeFile(path.join(out, spec.slug+'.html'), `<!doctype html><meta charset="utf-8"><title>${spec.title}</title><main><h1>${spec.title}</h1>${body}</main>`);
    }
    for (const article of additions) {
      await validatePublishingIdentity(prisma, article);
      const image = await fetch(`https://res.cloudinary.com/djprcwnsz/image/upload/${article.blogImage}`, { method: 'HEAD' });
      assert(image.ok && image.headers.get('content-type')?.startsWith('image/'), 'Feature image must be available before publishing');
    }
    const linkParagraph = '<p data-seo-module="nigeria-machine-guide-links-2026-10">For specific equipment comparisons, read the <a href="https://www.sureimports.com/blog/ice-block-making-machine-price-nigeria">ice block machine buying guide</a> for batch output, power and site planning, or the <a href="https://www.sureimports.com/blog/industrial-sewing-machine-price-nigeria">industrial sewing machine price and selection guide</a> for stitch types, fabric tests and complete-set costs.</p>';
    const updates = [];
    for (const slug of ['machine-sourcing-from-china-for-nigeria-how-to-do-it-without-guessing', '25-best-products-to-import-from-china-to-nigeria-in-2026-high-demand-opportunities']) {
      const row = await prisma.blog.findFirst({ where: { blogSlug: slug, blogPublished: true, xStaus: 'active' } });assert(row);
      assert(!row.blogContent.includes('nigeria-machine-guide-links-2026-10'));
      const anchor = slug.startsWith('machine-') ? '<h2>Assess the Nigerian installation site early</h2>' : '<h2>Match technical products to the support you can provide</h2>';
      assert(row.blogContent.includes(anchor));
      updates.push({ before: snap(row), after: { blogContent: row.blogContent.replace(anchor, linkParagraph+'\n'+anchor) } });
    }
    await fs.writeFile(manifestPath, JSON.stringify({ batch, preparedAt: new Date().toISOString(), additions, updates }, null, 2));
    console.log(JSON.stringify({ mode: 'prepared', articles: additions.map(x=>({slug:x.blogSlug,words:words(x.blogContent)})), incomingLinksFrom:updates.map(x=>x.before.blogSlug) }, null, 2));return;
  }
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));assert.equal(manifest.batch,batch);assert.equal(manifest.additions.length,2);assert.equal(manifest.updates.length,2);
  const receipt=[];
  await prisma.$transaction(async tx=>{
    for(const article of manifest.additions){
      await validatePublishingIdentity(tx, article);
      assert(words(article.blogContent)>=2000);
      assert.equal(await tx.blog.count({where:{OR:[{blogSlug:article.blogSlug},{pidBlog:article.pidBlog}]}}),0,'Article already exists');
      const now=new Date();const data={...article,createdAt:now,updatedAt:now};
      await tx.blog.create({data});
      const pidChange=`seo_change_${crypto.randomUUID()}`;
      await tx.seo_content_change_logs.create({data:{pidChange,pidBlog:article.pidBlog,changeType:batch,status:'applied',beforeJson:'null',afterJson:JSON.stringify(data),validationJson:JSON.stringify({words:words(article.blogContent),uniqueSlugChecked:true}),publishedAt:now,updatedAt:now}});
      receipt.push({pidChange,slug:article.blogSlug,words:words(article.blogContent),action:'published'});
    }
    for(const change of manifest.updates){
      const current=await tx.blog.findUnique({where:{pidBlog:change.before.pidBlog}});assert.deepEqual(snap(current),change.before,'Concurrent edit; aborting entire release');
      const now=new Date();const result=await tx.blog.updateMany({where:{pidBlog:current.pidBlog,updatedAt:current.updatedAt,blogContent:current.blogContent},data:{...change.after,updatedAt:now}});assert.equal(result.count,1);
      const pidChange=`seo_change_${crypto.randomUUID()}`;
      await tx.seo_content_change_logs.create({data:{pidChange,pidBlog:current.pidBlog,changeType:batch,status:'applied',beforeJson:JSON.stringify(change.before),afterJson:JSON.stringify(change.after),validationJson:JSON.stringify({incomingLinks:2}),publishedAt:now,updatedAt:now}});
      receipt.push({pidChange,slug:current.blogSlug,action:'linked new guides'});
    }
  },{timeout:30000});
  await fs.writeFile(path.join(out,'new-machine-guides-receipt.json'),JSON.stringify(receipt,null,2));console.log(JSON.stringify({mode:'applied',receipt},null,2));
}
main().catch(error=>{console.error(error.message);process.exitCode=1;}).finally(()=>prisma.$disconnect());
