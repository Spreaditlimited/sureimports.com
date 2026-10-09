import fs from 'node:fs/promises';
import {PrismaClient} from '@prisma/client';
const db=new PrismaClient();const out='deliverables/seo-existing-2026-10-09';
try{
 const map=JSON.parse(await fs.readFile(`${out}/map.json`,'utf8'));const all=await db.blog.findMany();
 const rows=map.map(m=>{const r=all.find(x=>x.blogSlug===m.url.split('/blog/')[1]);if(!r||!r.blogPublished||r.xStaus!=='active'||r.createdAt>new Date())throw Error(`Not live: ${m.id}`);return r;});
 await fs.writeFile(`${out}/before.json`,JSON.stringify(rows,null,2),{flag:'wx'});
 await fs.writeFile(`${out}/live-links.json`,JSON.stringify(all.filter(x=>x.blogPublished&&x.xStaus==='active'&&(!x.createdAt||x.createdAt<=new Date())).map(x=>({slug:x.blogSlug,title:x.blogTitle})),null,2));
 for(const r of rows){await fs.writeFile(`${out}/${map.find(m=>m.url.endsWith(r.blogSlug)).id}-before.html`,r.blogContent);console.log(JSON.stringify({slug:r.blogSlug,id:r.pidBlog,words:r.blogContent.replace(/<[^>]+>/g,' ').trim().split(/\s+/).length,image:r.blogImage,updated:r.updatedAt,seo:JSON.parse(r.blogExt2||'{}')}));}
 const registry=await db.seo_linkable_pages.findMany({where:{status:'active'}});await fs.writeFile(`${out}/registry.json`,JSON.stringify(registry.map(x=>x.url),null,2));
}catch(e){console.error(e.message);process.exitCode=1;}finally{await db.$disconnect();}
