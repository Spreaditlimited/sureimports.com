// Measure original pixels for CSS layout only. Never rewrites image bytes.
import fs from 'node:fs/promises';
import sharp from 'sharp';
const folder = '.catalogue-backups/phone-presentation';
const {results} = JSON.parse(await fs.readFile(`${folder}/audit.json`));
const applied = JSON.parse(await fs.readFile(`${folder}/applied.json`));
const sources = JSON.parse(await fs.readFile(`${folder}/replacement-sources.json`));
const files = new Map(results.filter(r=>!r.error).map(r=>[r.source,`${folder}/${r.index}.image`]));
for (const s of sources) {
  const image = applied.find(c=>c.after.includes(`/2026-09-uniform/${s.key}.`))?.after;
  if (image) files.set(image,`${folder}/${s.key}.jpg`);
}
const layouts = {};
for (const [url,file] of files) {
  const {data,info} = await sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const {width:w,height:h,channels:c} = info;
  const bg = [...data.subarray(0,c)];
  const neutral = Math.max(...bg.slice(0,3))-Math.min(...bg.slice(0,3)) < 18 && Math.min(...bg.slice(0,3)) > 220;
  let x0=w,y0=h,x1=0,y1=0;
  for(let y=0;y<h;y++) for(let x=0;x<w;x++) {
    const i=(y*w+x)*c;
    const visible=data[i+3]>20 && (bg[3]<20 || !neutral || Math.max(...[0,1,2].map(k=>Math.abs(data[i+k]-bg[k])))>22);
    if(visible){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
  }
  if(x0>=x1 || y0>=y1) throw new Error(`Empty image: ${url}`);
  // Preserve antialiasing and the edge shadow, with a little safety padding.
  x0=Math.max(0,x0-3);y0=Math.max(0,y0-3);x1=Math.min(w-1,x1+3);y1=Math.min(h-1,y1+3);
  layouts[url.split('/image/upload/').pop().replace(/^v\d+\//,'')] = [x0,y0,x1-x0+1,y1-y0+1,w,h];
}
await fs.writeFile('lib/shop/phone-image-layouts.json',JSON.stringify(layouts,null,2)+'\n');
console.log(`Measured ${Object.keys(layouts).length} original phone images for consistent CSS framing.`);
