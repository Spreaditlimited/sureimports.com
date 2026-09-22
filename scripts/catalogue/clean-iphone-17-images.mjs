import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { setDefaultResultOrder } from 'node:dns';
import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';

setDefaultResultOrder('ipv4first');
const apply = process.argv.includes('--apply');
const db = new PrismaClient();
const sources = [
  { model: 'iPhone 17 Pro', key: 'iphone-17-pro-cosmicorange', file: '/private/tmp/iphone-17-pro-clean.png', source: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-pro-finish-select-cosmicorange-202509?wid=940&hei=1112&fmt=png-alpha' },
  { model: 'iPhone 17 Pro Max', key: 'iphone-17-pro-max-cosmicorange', file: '/private/tmp/iphone-17-pro-max-clean.png', source: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-pro-max-finish-select-cosmicorange-202509?wid=940&hei=1112&fmt=png-alpha' },
];
try {
  const before = await db.store.findMany({ orderBy: { id: 'asc' } });
  const changes = [];
  for (const source of sources) {
    const info = await sharp(source.file).metadata();
    assert.ok(info.width >= 900 && info.height >= 1000 && info.hasAlpha, 'Expected original transparent Apple catalogue image');
    const targets = before.filter(row => row.productVisibility && [256,512].some(size => row.productName === `${source.model} ${size}GB — Refurbished`));
    assert.equal(targets.length, 2, `Unexpected catalogue targets for ${source.model}`);
    console.log(JSON.stringify({ model: source.model, targets: targets.map(row => row.productName), width: info.width, height: info.height }));
    if (!apply) continue;
    cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET, secure: true });
    const upload = await cloudinary.uploader.upload(source.file, { public_id: `sureimports/shop/iphones/2026-09-clean/${source.key}`, overwrite: false, resource_type: 'image' });
    assert.ok(upload.secure_url && upload.width >= 900 && upload.height >= 1000);
    for (const row of targets) changes.push({ pidProduct: row.pidProduct, name: row.productName, before: row.productImage, after: upload.secure_url, source: source.source });
  }
  if (apply) {
    const folder = '.catalogue-backups/iphone-images';
    await fs.mkdir(folder, { recursive: true });
    const backup = `${folder}/clean-17-${Date.now()}.json`;
    await fs.writeFile(backup, JSON.stringify(changes, null, 2), { mode: 0o600 });
    await db.$transaction(async tx => {
      for (const change of changes) {
        const result = await tx.store.updateMany({ where: { pidProduct: change.pidProduct, productImage: change.before, productVisibility: true }, data: { productImage: change.after } });
        assert.equal(result.count, 1, 'Concurrent image change; aborting');
      }
      const after = await tx.store.findMany({ orderBy: { id: 'asc' } });
      assert.deepEqual(after, before.map(row => ({ ...row, productImage: changes.find(change => change.pidProduct === row.pidProduct)?.after || row.productImage })), 'Unexpected catalogue changes');
    }, { timeout: 60000 });
    console.log(JSON.stringify({ updated: changes.length, backup, changes, pricesAndOtherProductsUnchanged: true }, null, 2));
  }
} catch (error) {
  console.error('Image update did not complete:', error.code || error.name);
  process.exitCode = 1;
} finally { await db.$disconnect(); }
