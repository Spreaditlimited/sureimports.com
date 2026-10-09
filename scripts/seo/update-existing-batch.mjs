import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import {PrismaClient} from '@prisma/client';
import {findBlogPublicationIssues} from '../../../admin.sureimports.com/lib/blogPublicationValidation.ts';
import {validateExternalLinkContinuity} from '../../../admin.sureimports.com/lib/seo/externalLinkPolicy.ts';
import {findNewUnapprovedLinks} from '../../../admin.sureimports.com/lib/seo/linkPolicy.ts';
const db=new PrismaClient();const out='deliverables/seo-existing-2026-10-09';const folder='scripts/seo/content/existing-2026-10';const batch='existing_content_only_20261009';
const read=async name=>JSON.parse(await fs.readFile(`${out}/${name}.json`,'utf8'));
const snap=x=>JSON.parse(JSON.stringify(x));const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const words=x=>x.replace(/<[^>]*>/g,' ').trim().split(/\s+/).length;
const imageUrl=x=>x.startsWith('https://')?x:`https://res.cloudinary.com/djprcwnsz/image/upload/${x}`;
async function validate(c){
 const b=c.before,a=c.after,s=JSON.parse(a.blogExt2);
 assert(b&&a.pidBlog===b.pidBlog&&a.blogSlug===b.blogSlug,'Existing records only; ID and URL must stay unchanged');
 assert(b.blogPublished&&b.xStaus==='active'&&new Date(b.createdAt)<=new Date());
 assert.equal(a.blogImage,b.blogImage);assert.equal(a.publisherId,'PUB1767167254459');assert.equal(a.blogBy,'Tochukwu Nkwocha');
 assert(words(a.blogContent)>=Math.max(2000,words(b.blogContent)),'Do not shorten these useful long guides');
 assert(a.blogTitle.length<65&&s.metaDescription.length>=120&&s.metaDescription.length<=160);
 assert.equal(s.canonicalUrl,`https://www.sureimports.com/blog/${a.blogSlug}`);assert.equal(s.ogImage,imageUrl(b.blogImage));
 assert(!/<script|javascript:|\bon\w+\s*=||```/i.test(a.blogContent));
 const embeds=x=>(x.match(/<iframe\b[\s\S]*?<\/iframe>/gi)||[]).map(v=>v.replace(/>\s*</g,'><'));
 assert.deepEqual(embeds(a.blogContent),embeds(b.blogContent),'Preserve existing videos');
 validateExternalLinkContinuity({originalHtml:b.blogContent,rewrittenHtml:a.blogContent,changes:c.review.externalLinkChanges});
 assert.deepEqual(await findBlogPublicationIssues({prisma:db,html:a.blogContent,publishAt:new Date(),currentSlug:a.blogSlug}),[]);
}
async function prepare(){
 try{await fs.access(`${out}/release.json`);throw Error('Draft exists; inspect it and use --apply');}catch(e){if(e.code!=='ENOENT')throw e;}
 const before=await read('before'),map=await read('map'),trigger=await read('trigger-evidence');
 const reviews=JSON.parse(await fs.readFile(`${folder}/review.json`,'utf8'));const changes=[];
 for(const spec of map){
  const b=before.find(x=>spec.url.endsWith(x.blogSlug));assert(b);const current=await db.blog.findUnique({where:{pidBlog:b.pidBlog}});assert.deepEqual(snap(current),b,'Concurrent source edit');
  const review=reviews[spec.id];const html=await fs.readFile(`${folder}/${spec.id}.html`,'utf8');
  const category=await db.blog_category.findUnique({where:{pidCategory:b.categoryId}});assert(category?.status==='active');
  const seo={...JSON.parse(b.blogExt2||'{}'),metaTitle:review.title,seoTitle:review.title,metaDescription:review.metaDescription,focusKeyword:review.focusKeyword,keywords:review.keywords,canonicalUrl:spec.url,ogTitle:review.title,ogDescription:review.metaDescription,ogImage:imageUrl(b.blogImage),twitterTitle:review.title,twitterDescription:review.metaDescription,twitterImage:imageUrl(b.blogImage),category:category.categoryName,noIndex:false,noFollow:false};
  const after={pidBlog:b.pidBlog,blogSlug:b.blogSlug,blogTitle:review.title,blogContent:html,blogImage:b.blogImage,blogBy:'Tochukwu Nkwocha',publisherId:'PUB1767167254459',blogExt2:JSON.stringify(seo)};
  const c={key:spec.id,before:b,after,words:words(html),bodyHash:hash(html),review,pidChange:`seo_change_${crypto.randomUUID()}`};await validate(c);changes.push(c);
 }
 const registry=await db.seo_linkable_pages.findMany({where:{status:'active'}});const registrationUrls=new Set();
 for(const c of changes){const {pending}=findNewUnapprovedLinks({originalHtml:c.before.blogContent,rewrittenHtml:c.after.blogContent,approvedUrls:registry.map(x=>x.url)});for(const url of pending){assert(url.startsWith('/blog/'),'Unexpected new service route');const row=await db.blog.findFirst({where:{blogSlug:url.slice(6),blogPublished:true,xStaus:'active',createdAt:{lte:new Date()}}});assert(row,'New internal link is not live');registrationUrls.add(url);}}
 const m={batch,preparedAt:new Date().toISOString(),changes,inbounds:[],registrationUrls:[...registrationUrls],trigger,authorization:'User directed existing-content improvement using the established map; exact natural links between reviewed live articles only. No new articles.'};
 await fs.writeFile(`${out}/release.json`,JSON.stringify(m,null,2),{flag:'wx'});
 await db.$transaction(async tx=>{for(const c of changes)await tx.seo_content_change_logs.create({data:{pidChange:c.pidChange,pidBlog:c.before.pidBlog,changeType:batch,status:'draft',beforeJson:JSON.stringify(c.before),afterJson:JSON.stringify(c.after),validationJson:JSON.stringify({trigger,words:c.words,bodyHash:c.bodyHash,review:c.review}),updatedAt:new Date()}});});
 console.log(JSON.stringify({status:'drafts saved',articles:changes.map(c=>({key:c.key,words:c.words,previousWords:words(c.before.blogContent)})),registrationUrls:m.registrationUrls}));
}
async function apply(){
 const m=await read('release');assert.equal(m.batch,batch);assert.equal(m.changes.length,3);
 for(const c of m.changes){assert.equal(hash(c.after.blogContent),c.bodyHash);await validate(c);}
 const now=new Date();const totalBefore=await db.blog.count();
 await db.$transaction(async tx=>{
  for(const c of m.changes){const current=await tx.blog.findUnique({where:{pidBlog:c.before.pidBlog}});assert.deepEqual(snap(current),c.before,'Concurrent edit; stop');}
  for(const url of m.registrationUrls)await tx.seo_linkable_pages.upsert({where:{normalizedUrl:url},create:{pidLink:`seo_link_${crypto.randomUUID()}`,url,normalizedUrl:url,label:url.split('/').pop().replaceAll('-',' ').slice(0,180),status:'active',source:'user_directed_editorial_batch',approvedBy:'user_instruction_20261009_existing',approvedAt:now},update:{status:'active'}});
  const registry=await tx.seo_linkable_pages.findMany({where:{status:'active'}});
  for(const c of m.changes){
   const links=findNewUnapprovedLinks({originalHtml:c.before.blogContent,rewrittenHtml:c.after.blogContent,approvedUrls:registry.map(x=>x.url)});assert.deepEqual(links.pending,[]);
   const result=await tx.blog.updateMany({where:{pidBlog:c.before.pidBlog,updatedAt:new Date(c.before.updatedAt)},data:{...c.after,updatedAt:now}});assert.equal(result.count,1);
   await tx.seo_content_change_logs.update({where:{pidChange:c.pidChange},data:{status:'applied',publishedAt:now,updatedAt:now,validationJson:JSON.stringify({words:c.words,bodyHash:c.bodyHash,review:c.review,links,trigger:m.trigger,authorization:m.authorization,existingRecordOnly:true})}});
  }
 },{timeout:60000});
 const receipt={updatedAt:now,articles:m.changes.map(c=>({key:c.key,slug:c.after.blogSlug,pidBlog:c.after.pidBlog,words:c.words,previousWords:words(c.before.blogContent)})),newArticlesCreated:0,totalBefore,totalAfter:await db.blog.count()};
 await fs.writeFile(`${out}/receipt.json`,JSON.stringify(receipt,null,2));console.log(JSON.stringify(receipt,null,2));
}
try{if(process.argv.includes('--apply'))await apply();else await prepare();}catch(e){console.error(e.message);process.exitCode=1;}finally{await db.$disconnect();}
