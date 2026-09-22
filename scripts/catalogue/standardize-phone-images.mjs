import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';

// Audited model-for-model replacements only; no price, stock or copy changes.
const groups = {
  0:[1,132], 2:[3], 4:[5], 7:[6], 15:[8,29], 12:[11], 13:[14],
  16:[17], 18:[19], 23:[24,71], 111:[25,49,112], 27:[28],
  118:[30,31,32,33,119], 34:[35], 128:[41,42,43,44,45,105,127],
  113:[46,106,107,114,115], 54:[55], 58:[59], 60:[61],
  123:[62,124], 63:[80,125], 48:[66], 68:[67], 69:[70],
  75:[72,74,122], 76:[77], 26:[81,108,129], 82:[83,116,117],
  84:[85], 90:[89], 92:[91,93], 21:[95], 100:[101,102,103,109,110],
  120:[121], 104:[126], 25:[131],
};
const folder = '.catalogue-backups/phone-presentation';
const audited = await fs.readFile(`${folder}/audit.json`);
assert.equal(createHash('sha256').update(audited).digest('hex'), 'ad241be426ef6382aff10b06289fc1404d96f7242434bc2a459d5ccf4fb330b0', 'Audit changed: review model mappings again before applying');
const {results} = JSON.parse(audited);
const sources = JSON.parse(await fs.readFile(`${folder}/replacement-sources.json`));
assert.ok(sources.every(s=>s.url), 'Resolve missing source images first');
const byOld = new Map();
for (const [target, indices] of Object.entries(groups)) {
  for (const index of indices) byOld.set(results[index].source, { image: results[target].source });
}
for (const source of sources) for (const index of source.indices) byOld.set(results[index].source, { source });
const db = new PrismaClient();
try {
  const before = await db.store.findMany({ orderBy: { id:'asc' } });
  const targets = before.filter(r=>r.productVisibility && r.productCategory === 'phone' && byOld.has(r.productImage));
  console.log(JSON.stringify({ changes:targets.length, products:targets.map(r=>r.productName) }));
  if (!process.argv.includes('--apply')) process.exitCode = 0;
  else {
    cloudinary.config({ cloud_name:process.env.CLOUDINARY_CLOUD_NAME, api_key:process.env.CLOUDINARY_API_KEY, api_secret:process.env.CLOUDINARY_API_SECRET, secure:true });
    for (const source of sources) {
      const uploaded = await cloudinary.uploader.upload(`${folder}/${source.key}.jpg`, { public_id:`sureimports/shop/phones/2026-09-uniform/${source.key}`, overwrite:false, resource_type:'image' });
      source.image = uploaded.secure_url;
    }
    const changes = targets.map(r=>({pidProduct:r.pidProduct, name:r.productName, before:r.productImage, after:byOld.get(r.productImage).image || byOld.get(r.productImage).source.image }));
    const backup = `${folder}/before-${Date.now()}.json`;
    await fs.writeFile(backup, JSON.stringify(changes,null,2), {mode:0o600});
    await db.$transaction(async tx=>{
      for (const c of changes) {
        const r = await tx.store.updateMany({where:{pidProduct:c.pidProduct,productImage:c.before,productVisibility:true,productCategory:'phone'},data:{productImage:c.after}});
        assert.equal(r.count,1,'Concurrent change; aborting');
      }
      const after = await tx.store.findMany({orderBy:{id:'asc'}});
      assert.deepEqual(after,before.map(r=>({...r,productImage:changes.find(c=>c.pidProduct===r.pidProduct)?.after || r.productImage})), 'Unrelated catalogue changes detected');
    },{timeout:60000});
    await fs.writeFile(`${folder}/applied.json`,JSON.stringify(changes,null,2));
    console.log(JSON.stringify({updated:changes.length,backup,otherFieldsUnchanged:true}));
  }
} finally { await db.$disconnect(); }
