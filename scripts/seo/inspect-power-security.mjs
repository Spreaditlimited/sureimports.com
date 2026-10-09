import { PrismaClient } from '@prisma/client';
import fs from 'node:fs/promises';
const db = new PrismaClient();
const out = 'deliverables/seo-power-security-2026-10-09';
try {
  await fs.mkdir(out,{recursive:true});
  const rows = await db.blog.findMany({where:{OR:[{blogSlug:{contains:'solar'}},{blogSlug:{contains:'cctv'}}]}});
  const registry = await db.$queryRawUnsafe("SELECT url, normalizedUrl, label FROM seo_linkable_pages WHERE status='active'");
  await fs.writeFile(`${out}/before.json`,JSON.stringify(rows,null,2),{flag:'wx'});
  await fs.writeFile(`${out}/registry.json`,JSON.stringify(registry,null,2));
  console.log(JSON.stringify(rows.map(({blogContent,blogExt2,...r})=>({...r,words:blogContent.replace(/<[^>]*>/g,' ').split(/\s+/).length,links:[...blogContent.matchAll(/href=["']([^"']+)/g)].map(x=>x[1]),seo:blogExt2})),null,2));
  console.log('Registry entries:',registry.length);
} finally {await db.$disconnect();}
