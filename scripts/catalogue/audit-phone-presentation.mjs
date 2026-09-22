import fs from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { PrismaClient } from '@prisma/client';
import sharp from 'sharp';

const folder = '.catalogue-backups/phone-presentation';
await fs.mkdir(folder, { recursive: true });
const db = new PrismaClient();
const rows = await db.store.findMany({ where: { productVisibility: true, productCategory: 'phone' }, select: { pidProduct: true, productName: true, productImage: true } });
await db.$disconnect();
const images = [...new Set(rows.map(row => row.productImage))];
const results = [];
const run = promisify(execFile);
let next = 0;
await Promise.all(Array.from({ length: 6 }, async () => {
while (next < images.length) {
  const index = next++;
  const source = images[index];
  const url = /^https?:/.test(source) ? source : `${process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL.replace(/\/$/, '')}/${source}`;
  const file = `${folder}/${index}.image`;
  try {
    try { await fs.access(file); } catch {
      await run('curl', ['-4', '-f', '-sS', '--connect-timeout', '8', '--max-time', '25', '--retry', '1', url, '-o', file]);
    }
    const { width, height, format } = await sharp(file).metadata();
    results.push({ index, source, width, height, format, names: rows.filter(row => row.productImage === source).map(row => row.productName) });
  } catch { results.push({ index, source, error: 'Image could not be loaded' }); }
}
}));
results.sort((a, b) => a.index - b.index);
await fs.writeFile(`${folder}/audit.json`, JSON.stringify({ products: rows.length, results }, null, 2));
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
for (let page = 0; page < Math.ceil(results.length / 24); page++) {
  const cards = await Promise.all(results.slice(page * 24, (page + 1) * 24).map(async r => `<article><div><img src="data:image/${r.format};base64,${r.error ? '' : (await fs.readFile(`${folder}/${r.index}.image`)).toString('base64')}"></div><p>${r.index}: ${escape(r.names?.[0] || r.error)}<br>${r.width} × ${r.height}</p></article>`));
  await fs.writeFile(`${folder}/page-${page}.html`, `<style>body{font:12px system-ui;background:#eee;margin:20px;display:grid;grid-template-columns:repeat(6,1fr);gap:12px}article{background:white;padding:10px}article>div{height:150px;display:flex;align-items:center;justify-content:center}img{max-width:100%;max-height:100%;object-fit:contain}p{height:50px}</style>${cards.join('')}`);
}
console.log(JSON.stringify({ products: rows.length, images: results.length, failures: results.filter(r => r.error), pages: Math.ceil(results.length / 24) }));
