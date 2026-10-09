import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import {PrismaClient} from '@prisma/client';
import {findBlogPublicationIssues,extractInternalBlogSlugs,findAudienceRoutingIssues} from '../../../admin.sureimports.com/lib/blogPublicationValidation.ts';
import {validateExternalLinkContinuity} from '../../../admin.sureimports.com/lib/seo/externalLinkPolicy.ts';
import {extractLinkableUrls,findNewUnapprovedLinks} from '../../../admin.sureimports.com/lib/seo/linkPolicy.ts';
const db=new PrismaClient();
const out='deliverables/seo-power-security-2026-10-09';
const batch='nigeria_power_security_20261009';
const manifestFile=`${out}/release.json`;
const snap=x=>JSON.parse(JSON.stringify(x));
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const wordCount=html=>html.replace(/<[^>]*>/g,' ').replace(/&[^; ]+;/g,' ').trim().split(/\s+/).length;
const imageUrl=id=>`https://res.cloudinary.com/djprcwnsz/image/upload/${id}`;
const read=async name=>JSON.parse(await fs.readFile(`${out}/${name}.json`,'utf8'));
function validateHtml(html){
 const allowed=new Set(['p','strong','em','h2','h3','ul','ol','li','table','thead','tbody','tr','th','td','a']);
 assert(!/<!--|<!doctype|javascript:|data:|<h1|```||\bon\w+\s*=/i.test(html),'Unsafe or unfinished HTML');
 for(const match of html.matchAll(/<(\/?)([a-z0-9]+)([^>]*)>/gi)){
  assert(allowed.has(match[2].toLowerCase()),`Unsupported tag ${match[2]}`);
  const attrs=match[3].trim();
  if(match[2]==='a'&&!match[1])assert(/^href=("[^"<>]+"|'[^'<>]+')$/.test(attrs),`Invalid anchor ${attrs}`);
  else assert.equal(attrs,'','Only href attributes are allowed');
 }
}
async function validateArticle(client,change,virtualSlugs=[]){
 const a=change.after;const seo=JSON.parse(a.blogExt2);
 assert(/^BLOG\d{13}$/.test(a.pidBlog));assert.equal(a.blogBy,'Tochukwu Nkwocha');assert.equal(a.publisherId,'PUB1767167254459');
 assert(wordCount(a.blogContent)>=2000);validateHtml(a.blogContent);
 assert(a.blogTitle.length<65);assert(seo.metaDescription.length>=120&&seo.metaDescription.length<=160);
 assert.equal(seo.canonicalUrl,`https://www.sureimports.com/blog/${a.blogSlug}`);
 assert.equal(seo.ogImage,imageUrl(a.blogImage));assert.equal(seo.twitterImage,seo.ogImage);
 const publisher=await client.blog_publisher.findUnique({where:{pidPublisher:a.publisherId}});
 const category=await client.blog_category.findUnique({where:{pidCategory:a.categoryId}});
 assert(publisher?.status==='active'&&publisher.publisherImage&&publisher.publisherName===a.blogBy);
 assert(category?.status==='active'&&category.categoryName===seo.category);
 assert(a.blogImage?.startsWith('admin-sureimports/blog/BLOG_GEN_'));
 assert.deepEqual(findAudienceRoutingIssues(a.blogContent),[]);
 validateExternalLinkContinuity({originalHtml:change.before?.blogContent,rewrittenHtml:a.blogContent,changes:change.externalLinkChanges});
 const linked=extractInternalBlogSlugs(a.blogContent).filter(x=>!virtualSlugs.includes(x));
 const rows=await client.blog.findMany({where:{blogSlug:{in:linked},blogPublished:true,xStaus:'active',OR:[{createdAt:null},{createdAt:{lte:new Date()}}]}});
 for(const slug of linked)assert(rows.some(x=>x.blogSlug===slug),`Blog is not live: ${slug}`);
}
async function prepare(){
 try{await fs.access(manifestFile);throw Error('Release already prepared; use --apply or inspect saved draft');}catch(e){if(e.code!=='ENOENT')throw e;}
 const originals=await read('before');const images=await read('images/upload-receipt');const trigger=await read('trigger-evidence');
 const changes=[];const stamp=Date.now();
 for(const [index,key] of ['solar','cctv','generator'].entries()){
  const job=await read(`${key}-job`);assert.equal(job.status,'completed');
  const draft=await read(`${key}-reviewed`);const before=originals.find(x=>x.blogSlug===job.spec.slug)||null;
  const html=await fs.readFile(`scripts/seo/content/power-security-2026-10/${key}.html`,'utf8');
  const current=await db.blog.findMany({where:{blogSlug:job.spec.slug}});
  if(before){assert.equal(current.length,1);assert.deepEqual(snap(current[0]),before,'Source changed since backup');}else assert.equal(current.length,0,'Duplicate topic/slug');
  const blogImage=key==='solar'?before.blogImage:images[key].publicId;
  const categoryId=before?.categoryId||'CAT1766930711389';
  const category=await db.blog_category.findUnique({where:{pidCategory:categoryId}});assert(category);
  const title=job.spec.title;const description=draft.metaDescription;
  const seo={...JSON.parse(before?.blogExt2||'{}'),metaTitle:title,seoTitle:title,metaDescription:description,focusKeyword:draft.focusKeyword,keywords:draft.keywords,canonicalUrl:`https://www.sureimports.com/blog/${job.spec.slug}`,ogTitle:title,ogDescription:description,ogImage:imageUrl(blogImage),twitterTitle:title,twitterDescription:description,twitterImage:imageUrl(blogImage),noIndex:false,noFollow:false,category:category.categoryName,tags:key==='cctv'?['CCTV','Security Cameras','Nigeria']:key==='generator'?['Solar Generators','Portable Power','Nigeria']:['Solar Equipment','China Import','Nigeria'],featured:false};
  const after={pidBlog:`BLOG${stamp+index}`,blogTitle:title,blogSlug:job.spec.slug,blogContent:html,blogPublished:true,blogFeatured:false,blogImage,blogBy:'Tochukwu Nkwocha',publisherId:'PUB1767167254459',categoryId,blogExt1:before?.blogExt1||null,blogExt2:JSON.stringify(seo),xStaus:'active'};
  changes.push({key,pidChange:`seo_change_${crypto.randomUUID()}`,before,after,bodyHash:hash(html),job:{id:job.id,model:job.model},externalLinkChanges:draft.externalLinkChanges,review:draft.editorialReview,words:wordCount(html)});
 }
 const virtual=changes.map(x=>x.after.blogSlug);
 for(const change of changes){await validateArticle(db,change,virtual);const res=await fetch(imageUrl(change.after.blogImage),{method:'HEAD',signal:AbortSignal.timeout(15000)});assert(res.ok&&res.headers.get('content-type')?.startsWith('image/'),'Image unavailable');}
 const inboundBefore=await db.blog.findFirst({where:{blogSlug:'25-best-products-to-import-from-china-to-nigeria-in-2026-high-demand-opportunities',blogPublished:true,xStaus:'active'}});assert(inboundBefore);
 const anchor='<h2>Match technical products to the support you can provide</h2>';assert(inboundBefore.blogContent.includes(anchor));
 const paragraph='<p>For security and backup-power stock, use the <a href="/blog/how-to-import-cctv-and-security-gadgets-from-china-to-nigeria">CCTV camera buying and import guide</a> to compare recording, installation and support costs. For portable backup units, the <a href="/blog/solar-generator-price-nigeria">solar-generator price and capacity guide</a> separates battery size, output and panel-inclusive packages.</p>';
 const inbound={pidChange:`seo_change_${crypto.randomUUID()}`,before:snap(inboundBefore),after:{blogContent:inboundBefore.blogContent.replace(anchor,anchor+'\n'+paragraph)}};
 const registry=await db.seo_linkable_pages.findMany({where:{status:'active'}});
 const registrationUrls=new Set();
 for(const change of [...changes,inbound]){
  const {pending}=findNewUnapprovedLinks({originalHtml:change.before?.blogContent,rewrittenHtml:change.after.blogContent,approvedUrls:registry.map(x=>x.url)});
  for(const url of pending){assert(url.startsWith('/blog/')||url==='/tools/landed-cost-estimator',`Unreviewed internal route ${url}`);registrationUrls.add(url);}
 }
 // Discover every pidBlog reference rather than assuming the known tables are exhaustive.
 const columns=await db.$queryRawUnsafe("SELECT TABLE_NAME AS tableName FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND COLUMN_NAME='pidBlog'");
 const references=columns.map(x=>x.tableName).filter(x=>x!=='blog');
 for(const name of references)assert(/^[a-zA-Z0-9_]+$/.test(name));
 const manifest={batch,preparedAt:new Date().toISOString(),changes,inbound,registrationUrls:[...registrationUrls],registryAuthorization:'User explicitly requested publishing this queue under established rules with natural relevant internal links; these concrete editorial routes were reviewed for this release.',references,trigger};
 await fs.writeFile(manifestFile,JSON.stringify(manifest,null,2),{flag:'wx'});
 // The records remain drafts in the change log until the separate apply step succeeds.
 await db.$transaction(async tx=>{for(const c of [...changes,inbound])await tx.seo_content_change_logs.create({data:{pidChange:c.pidChange,pidBlog:c.before?.pidBlog||c.after.pidBlog,changeType:batch,status:'draft',beforeJson:JSON.stringify(c.before),afterJson:JSON.stringify(c.after),validationJson:JSON.stringify({prepared:true,words:c.words,job:c.job,bodyHash:c.bodyHash,trigger,externalLinkChanges:c.externalLinkChanges,registryCandidates:manifest.registrationUrls}),updatedAt:new Date()}});});
 console.log(JSON.stringify({mode:'draft saved',articles:changes.map(x=>({key:x.key,words:x.words,slug:x.after.blogSlug})),registryCandidates:manifest.registrationUrls,references},null,2));
}
async function apply(){
 const m=await read('release');assert.equal(m.batch,batch);assert.equal(m.changes.length,3);
 for(const c of m.changes){assert.equal(hash(c.after.blogContent),c.bodyHash);await validateArticle(db,c,m.changes.map(x=>x.after.blogSlug));const r=await fetch(imageUrl(c.after.blogImage),{method:'HEAD'});assert(r.ok,'Image unavailable');}
 const now=new Date();const receipt=[];
 await db.$transaction(async tx=>{
  for(const c of [...m.changes,m.inbound]){
   const current=c.before?await tx.blog.findUnique({where:{pidBlog:c.before.pidBlog}}):null;
   assert.deepEqual(snap(current),c.before,'Concurrent edit: abort entire release');
   if(!c.before)assert.equal(await tx.blog.count({where:{OR:[{pidBlog:c.after.pidBlog},{blogSlug:c.after.blogSlug}]}}),0);
   else if(c.after.pidBlog)assert.equal(await tx.blog.count({where:{pidBlog:c.after.pidBlog}}),0);
  }
  for(const c of m.changes){
   const createdAt=c.key==='solar'?new Date(c.before.createdAt):now;
   const data={...c.after,createdAt,updatedAt:now};
   if(c.before){
    const updated=await tx.blog.updateMany({where:{pidBlog:c.before.pidBlog,updatedAt:c.before.updatedAt?new Date(c.before.updatedAt):null},data});assert.equal(updated.count,1);
    for(const table of m.references)await tx.$executeRawUnsafe(`UPDATE \`${table}\` SET pidBlog=? WHERE pidBlog=?`,data.pidBlog,c.before.pidBlog);
   }else await tx.blog.create({data});
   receipt.push({key:c.key,slug:data.blogSlug,pidBlog:data.pidBlog,words:c.words,image:data.blogImage,createdAt,pidChange:c.pidChange});
  }
  const ib=m.inbound;const updated=await tx.blog.updateMany({where:{pidBlog:ib.before.pidBlog,updatedAt:new Date(ib.before.updatedAt)},data:{...ib.after,updatedAt:now}});assert.equal(updated.count,1);
  // Register only the exact reviewed editorial routes; no wildcard approval or system setting changes.
  for(const url of m.registrationUrls)await tx.seo_linkable_pages.upsert({where:{normalizedUrl:url},create:{pidLink:`seo_link_${crypto.randomUUID()}`,url,normalizedUrl:url,label:url.split('/').pop().replaceAll('-',' ').slice(0,180),status:'active',source:'user_directed_editorial_batch',approvedBy:'user_instruction_20261009',approvedAt:now},update:{status:'active'}});
  const registry=await tx.seo_linkable_pages.findMany({where:{status:'active'}});
  for(const c of [...m.changes,m.inbound]){
   const slug=c.after.blogSlug||c.before.blogSlug;
   const issues=await findBlogPublicationIssues({prisma:tx,html:c.after.blogContent,publishAt:now,currentSlug:slug});assert.deepEqual(issues,[]);
   const links=findNewUnapprovedLinks({originalHtml:c.before?.blogContent,rewrittenHtml:c.after.blogContent,approvedUrls:registry.map(x=>x.url)});assert.deepEqual(links.pending,[]);
   await tx.seo_content_change_logs.update({where:{pidChange:c.pidChange},data:{pidBlog:c.after.pidBlog||c.before.pidBlog,status:'applied',afterJson:JSON.stringify({...c.after,createdAt:c.key==='solar'?c.before.createdAt:c.key?now:undefined,updatedAt:now}),validationJson:JSON.stringify({words:c.words,bodyHash:c.bodyHash,job:c.job,sourceQuerySets:m.trigger.sourceQuerySets,manualTrigger:m.trigger.trigger,externalLinkChanges:c.externalLinkChanges,links,publicationIssues:issues,review:c.review,registryAuthorization:m.registryAuthorization}),publishedAt:now,updatedAt:now}});
  }
 },{timeout:60000});
 await fs.writeFile(`${out}/receipt.json`,JSON.stringify({publishedAt:now,articles:receipt,inboundPage:m.inbound.before.blogSlug},null,2));console.log(JSON.stringify(receipt,null,2));
}
async function main(){if(process.argv.includes('--apply'))await apply();else await prepare();}
main().catch(e=>{console.error(e.message);process.exitCode=1;}).finally(()=>db.$disconnect());
