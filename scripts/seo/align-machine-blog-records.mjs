import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import { PrismaClient } from '@prisma/client';
import { findBlogPublicationIssues } from '../../../admin.sureimports.com/lib/blogPublicationValidation.ts';
const prisma = new PrismaClient();
const folder = 'deliverables/seo-implementation-2026-10-08';
const file = `${folder}/record-alignment.json`;
const slugs = ['ice-block-making-machine-price-nigeria', 'industrial-sewing-machine-price-nigeria'];
const referenceTables = ['blog_lead_magnets', 'blog_lead_magnet_downloads', 'seo_content_change_logs'];
const snapshot = value => JSON.parse(JSON.stringify(value));
const imageUrl = publicId => `https://res.cloudinary.com/djprcwnsz/image/upload/${publicId}`;
async function main() {
  await fs.mkdir(folder, { recursive: true });
  if (!process.argv.includes('--apply')) {
    const publisher = await prisma.blog_publisher.findUnique({ where: { pidPublisher: 'PUB1767167254459' } });
    const category = await prisma.blog_category.findUnique({ where: { pidCategory: 'CAT1766930711389' } });
    assert(publisher?.status === 'active' && publisher.publisherImage);
    assert(category?.status === 'active');
    const stamp = Date.now(); const changes = [];
    for (const [index, slug] of slugs.entries()) {
      const rows = await prisma.blog.findMany({ where: { blogSlug: slug } });assert.equal(rows.length, 1);
      const current = rows[0];assert(current.blogPublished && current.xStaus === 'active');
      assert(current.pidBlog.startsWith('seo_ng_'), 'Record already aligned or unexpectedly changed');
      assert(current.blogImage?.startsWith('admin-sureimports/blog/BLOG_GEN_'), 'Keep the user-generated article image; refuse a placeholder');
      const image = await fetch(imageUrl(current.blogImage), { method: 'HEAD' });assert(image.ok && image.headers.get('content-type')?.startsWith('image/'), 'Generated image is unavailable');
      const issues = await findBlogPublicationIssues({ prisma, html: current.blogContent, publishAt: new Date(), currentSlug: slug });assert.deepEqual(issues, []);
      const seo = JSON.parse(current.blogExt2 || '{}');
      const after = { pidBlog: `BLOG${stamp + index}`, publisherId: publisher.pidPublisher, blogBy: publisher.publisherName, categoryId: category.pidCategory, blogExt2: JSON.stringify({ ...seo, category: category.categoryName, keywords: index === 0 ? ['ice block making machine', 'ice block making machine price in nigeria', 'ice block machine sourcing'] : ['industrial sewing machine price in nigeria', 'industrial sewing machine', 'sewing machine sourcing'], ogTitle: seo.seoTitle || current.blogTitle, ogDescription: seo.metaDescription, twitterTitle: seo.seoTitle || current.blogTitle, twitterDescription: seo.metaDescription, ogImage: imageUrl(current.blogImage), twitterImage: imageUrl(current.blogImage), featured: current.blogFeatured }) };
      assert.equal(await prisma.blog.count({where:{pidBlog:after.pidBlog}}),0);
      const references = {};
      for (const table of referenceTables) {
        const count = await prisma.$queryRawUnsafe(`SELECT COUNT(*) AS total FROM \`${table}\` WHERE pidBlog = ?`,current.pidBlog);
        references[table] = Number(count[0].total);
      }
      changes.push({ before: snapshot(current), after, references });
    }
    await fs.writeFile(file,JSON.stringify({changes},null,2));
    console.log(JSON.stringify({mode:'prepared',changes:changes.map(x=>({slug:x.before.blogSlug,oldId:x.before.pidBlog,newId:x.after.pidBlog,imagePreserved:x.before.blogImage,publisher:x.after.blogBy,categoryId:x.after.categoryId,references:x.references}))},null,2));return;
  }
  const {changes}=JSON.parse(await fs.readFile(file,'utf8'));assert.equal(changes.length,2);
  await prisma.$transaction(async tx=>{
    for(const change of changes){
      const current=await tx.blog.findUnique({where:{pidBlog:change.before.pidBlog}});assert.deepEqual(snapshot(current),change.before,'Concurrent edit; aborting without overwriting it');
      assert(/^BLOG\d{13}$/.test(change.after.pidBlog));
      const now=new Date();
      const updated=await tx.blog.updateMany({where:{pidBlog:current.pidBlog,updatedAt:current.updatedAt,blogImage:current.blogImage},data:{...change.after,updatedAt:now}});assert.equal(updated.count,1);
      const referenceUpdates={};
      for(const table of referenceTables){referenceUpdates[table]=await tx.$executeRawUnsafe(`UPDATE \`${table}\` SET pidBlog = ? WHERE pidBlog = ?`,change.after.pidBlog,current.pidBlog);}
      await tx.seo_content_change_logs.create({data:{pidChange:`seo_change_${crypto.randomUUID()}`,pidBlog:change.after.pidBlog,changeType:'blog_publishing_pattern_alignment',status:'applied',beforeJson:JSON.stringify(change.before),afterJson:JSON.stringify({...change.before,...change.after,updatedAt:now}),validationJson:JSON.stringify({imagePreserved:true,slugPreserved:true,contentPreserved:true,referenceUpdates}),publishedAt:now,updatedAt:now}});
    }
  },{timeout:30000});
  const saved=await prisma.blog.findMany({where:{blogSlug:{in:slugs}},include:{publisher:true,category:true}});
  for(const row of saved){const change=changes.find(x=>x.before.blogSlug===row.blogSlug);assert.equal(row.pidBlog,change.after.pidBlog);assert.equal(row.blogImage,change.before.blogImage);assert.equal(row.blogContent,change.before.blogContent);assert.equal(row.createdAt.toISOString(),change.before.createdAt);}
  const result=saved.map(x=>({slug:x.blogSlug,pidBlog:x.pidBlog,image:x.blogImage,publisher:x.publisher.publisherName,category:x.category.categoryName}));
  await fs.writeFile(`${folder}/record-alignment-receipt.json`,JSON.stringify(result,null,2));console.log(JSON.stringify({mode:'applied',result},null,2));
}
main().catch(e=>{console.error(e.message);process.exitCode=1}).finally(()=>prisma.$disconnect());
