import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import { PrismaClient } from '@prisma/client';
const prisma=new PrismaClient();
const folder='deliverables/seo-implementation-2026-10-08';
const expected={publisherId:'PUB1767167254459',blogBy:'Tochukwu Nkwocha'};
const fields={pidBlog:true,blogSlug:true,blogBy:true,publisherId:true,updatedAt:true};
async function main(){
 await fs.mkdir(folder,{recursive:true});
 const publisher=await prisma.blog_publisher.findUnique({where:{pidPublisher:expected.publisherId}});
 assert(publisher?.publisherName===expected.blogBy&&publisher.status==='active'&&publisher.publisherImage);
 if(!process.argv.includes('--apply')){
  const all=await prisma.blog.findMany({select:fields});
  const changes=all.filter(x=>x.publisherId!==expected.publisherId||x.blogBy!==expected.blogBy);
  await fs.writeFile(`${folder}/author-correction-plan.json`,JSON.stringify({expected,total:all.length,changes},null,2));
  console.log(JSON.stringify({total:all.length,recordsToAlign:changes.length,newPosts:changes.filter(x=>x.blogSlug==='ice-block-making-machine-price-nigeria'||x.blogSlug==='industrial-sewing-machine-price-nigeria').map(x=>x.blogSlug)}));return;
 }
 const plan=JSON.parse(await fs.readFile(`${folder}/author-correction-plan.json`,'utf8'));assert.deepEqual(plan.expected,expected);
 await prisma.$transaction(async tx=>{
  for(const before of plan.changes){
   const now=new Date();const current=await tx.blog.findUnique({where:{pidBlog:before.pidBlog},select:fields});assert.deepEqual(JSON.parse(JSON.stringify(current)),before,'Concurrent author edit; aborting');
   const result=await tx.blog.updateMany({where:{pidBlog:before.pidBlog,publisherId:before.publisherId,blogBy:before.blogBy,updatedAt:current.updatedAt},data:{...expected,updatedAt:now}});assert.equal(result.count,1);
   await tx.seo_content_change_logs.create({data:{pidChange:`seo_change_${crypto.randomUUID()}`,pidBlog:before.pidBlog,changeType:'owner_requested_author_correction',status:'applied',beforeJson:JSON.stringify(before),afterJson:JSON.stringify({...before,...expected,updatedAt:now}),validationJson:JSON.stringify({changedFields:['publisherId','blogBy','updatedAt'],ownerInstruction:'Author for all is Tochukwu Nkwocha'}),publishedAt:now,updatedAt:now}});
  }
 },{timeout:60000});
 const all=await prisma.blog.findMany({select:fields});assert(all.every(x=>x.publisherId===expected.publisherId&&x.blogBy===expected.blogBy));
 const receipt={author:expected.blogBy,publisherId:expected.publisherId,total:all.length,corrected:plan.changes.length};await fs.writeFile(`${folder}/author-correction-receipt.json`,JSON.stringify(receipt,null,2));console.log(JSON.stringify(receipt));
}
main().catch(e=>{console.error(e.message);process.exitCode=1}).finally(()=>prisma.$disconnect());
