import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {PrismaClient} from '@prisma/client';
const db=new PrismaClient();const out='deliverables/seo-power-security-2026-10-09';
try{
 const m=JSON.parse(await fs.readFile(`${out}/release.json`,'utf8'));const result=[];
 for(const c of m.changes){
  const rows=await db.blog.findMany({where:{blogSlug:c.after.blogSlug},include:{publisher:true,category:true}});assert.equal(rows.length,1);const row=rows[0];
  for(const key of Object.keys(c.after))assert.equal(row[key],c.after[key],`Database mismatch ${key}`);
  assert.equal(row.publisher.publisherName,'Tochukwu Nkwocha');assert(row.publisher.publisherImage);assert(row.createdAt<=new Date());
  const url=`https://www.sureimports.com/blog/${row.blogSlug}`;
  const res=await fetch(url,{signal:AbortSignal.timeout(30000)});assert.equal(res.status,200);const html=await res.text();
  await fs.writeFile(`${out}/${c.key}-live.html`,html);
  const seo=JSON.parse(row.blogExt2);
  assert(html.includes('rel="canonical" href="'+url+'"'),'Canonical mismatch');
  assert(html.includes(row.blogTitle),'Title missing');assert(html.includes('Tochukwu Nkwocha'),'Author missing');
  assert(html.includes(row.blogImage),'Feature image missing');assert(html.includes(row.publisher.publisherImage),'Author image missing');
  assert(html.includes(seo.metaDescription),'Description missing');assert(!/name="robots" content="[^"]*noindex/.test(html));
  assert(html.includes('<h2>'),'Body missing');
  // Next Script inserts article JSON-LD after hydration; validate the browser DOM.
  const rendered=await fs.readFile(`${out}/${c.key}-rendered.html`,'utf8');
  const scripts=[...rendered.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(x=>JSON.parse(x[1]));
  assert(JSON.stringify(scripts).includes('Tochukwu Nkwocha'),'Structured author missing');
  const im=await fetch(seo.ogImage,{method:'HEAD'});assert(im.ok&&im.headers.get('content-type')?.startsWith('image/'));
  result.push({slug:row.blogSlug,status:res.status,words:c.words,pidBlog:row.pidBlog,author:row.publisher.publisherName,canonical:url,featureImage:seo.ogImage,structuredData:true,descriptionLength:seo.metaDescription.length});
 }
 const inbound=await db.blog.findUnique({where:{pidBlog:m.inbound.before.pidBlog}});assert.equal(inbound.blogContent,m.inbound.after.blogContent);
 const sitemapRes=await fetch('https://www.sureimports.com/sitemap.xml');assert(sitemapRes.ok);const sitemap=await sitemapRes.text();
 for(const c of m.changes)assert(sitemap.includes(`/blog/${c.after.blogSlug}`),'Sitemap entry missing');
 const logs=await db.seo_content_change_logs.findMany({where:{pidChange:{in:[...m.changes,m.inbound].map(x=>x.pidChange)}}});assert.equal(logs.length,4);assert(logs.every(x=>x.status==='applied'));
 const report={checkedAt:new Date().toISOString(),articles:result,inboundPage:inbound.blogSlug,sitemap:true,appliedChangeLogs:logs.length};
 await fs.writeFile(`${out}/verification.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}catch(e){console.error(e.message);process.exitCode=1;}finally{await db.$disconnect();}
