import fs from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const run = promisify(execFile);
const sources = JSON.parse(await fs.readFile('scripts/catalogue/phone-image-sources.json'));
const folder = '.catalogue-backups/phone-presentation';
for (const s of sources) {
  const brand = s.key.split('-')[0];
  const url = s.url || `https://fdn2.gsmarena.com/vv/pics/${brand}/${s.key}-1.jpg`;
  try {
    await run('curl', ['-4','-f','-sS','--connect-timeout','8','--max-time','20',url,'-o',`${folder}/${s.key}.jpg`]);
    s.url = url;
    console.log(s.key, 'downloaded');
  } catch { console.log(s.key, 'unavailable'); }
}
await fs.writeFile(`${folder}/replacement-sources.json`, JSON.stringify(sources, null, 2));
const cards = await Promise.all(sources.filter(s=>s.url).map(async s => `<article><img src="data:image/jpeg;base64,${(await fs.readFile(`${folder}/${s.key}.jpg`)).toString('base64')}"><p>${s.key}</p></article>`));
await fs.writeFile(`${folder}/replacements.html`, `<style>body{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;font:14px system-ui}article{text-align:center;border:1px solid #ddd;padding:12px}img{width:230px;height:230px;object-fit:contain}</style>${cards.join('')}`);
