import {PrismaClient} from '@prisma/client';
import fs from 'node:fs/promises';
const db=new PrismaClient();const out='deliverables/seo-equipment-2026-10-09';
try{
 await fs.mkdir(out,{recursive:true});
 const all=await db.blog.findMany();
 const rows=all.filter(x=>/packaging|salon|barber|flour|palm|milling|agro-processing/i.test(`${x.blogSlug} ${x.blogTitle}`));
 await fs.writeFile(`${out}/before.json`,JSON.stringify(rows,null,2),{flag:'wx'});
 await fs.writeFile(`${out}/live-links.json`,JSON.stringify(all.filter(x=>x.blogPublished&&x.xStaus==='active'&&(!x.createdAt||x.createdAt<=new Date())).map(x=>({slug:x.blogSlug,title:x.blogTitle})),null,2));
 console.log(JSON.stringify(rows.map(x=>({slug:x.blogSlug,title:x.blogTitle,id:x.pidBlog,published:x.blogPublished,date:x.createdAt,image:x.blogImage,words:x.blogContent.replace(/<[^>]+>/g,' ').split(/\s+/).length})),null,2));
}catch(e){console.error(e.message);process.exitCode=1;}finally{await db.$disconnect();}
