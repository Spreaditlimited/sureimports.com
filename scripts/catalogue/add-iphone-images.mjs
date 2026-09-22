import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';

const apply = process.argv.includes('--apply');
const folder = path.resolve('.catalogue-backups/iphone-images');
await fs.mkdir(folder, { recursive: true });
const pageResponse = await fetch(
  'https://www.apple.com/shop/buy-iphone/iphone-18-pro',
  { signal: AbortSignal.timeout(30000) },
);
assert.ok(pageResponse.ok, 'Apple product page could not be loaded');
const html = await pageResponse.text();
const urls = [...new Set(html.match(/https:\/\/store\.storeimages[^\s"<>]+/g))];
const sources = [
  {
    key: 'iphone-15-plus',
    match: /^iPhone 15 Plus (128|256)GB — Refurbished$/,
    url: 'https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/iphone_15_plus_hero.png',
    page: 'https://support.apple.com/en-us/111830',
  },
  {
    key: 'iphone-18-pro-black',
    match: /^iPhone 18 Pro 256GB — Brand new$/,
    apple: 'iphone-18-pro-finish-select-black-202609',
  },
  ...Object.entries({
    Black: 'black',
    Silver: 'silver',
    Glacier: 'glacier',
    Burgundy: 'burgundy',
  }).map(([label, finish]) => ({
    key: `iphone-18-pro-max-${finish}`,
    match: new RegExp(`^iPhone 18 Pro Max (256|512)GB — ${label} — Brand new$`),
    apple: `iphone-18-pro-max-finish-select-${finish}-202609`,
  })),
];
for (const source of sources) {
  source.url ||= urls.find((url) => url.includes(`/is/${source.apple}?`));
  assert.ok(source.url, `Missing verified source for ${source.key}`);
  source.page ||= 'https://www.apple.com/shop/buy-iphone/iphone-18-pro';
  const response = await fetch(source.url, {
    signal: AbortSignal.timeout(30000),
  });
  assert.ok(
    response.ok,
    `Image download failed: ${source.key} ${response.status}`,
  );
  const data = Buffer.from(await response.arrayBuffer());
  const metadata = await sharp(data).metadata();
  assert.ok(
    metadata.width >= 400 && metadata.height >= 400,
    `Image too small: ${source.key}`,
  );
  source.file = path.join(folder, `${source.key}.${metadata.format}`);
  await fs.writeFile(source.file, data);
  console.log(
    JSON.stringify({
      model: source.key,
      width: metadata.width,
      height: metadata.height,
      file: source.file,
    }),
  );
}
await fs.writeFile(
  path.join(folder, 'sources.json'),
  JSON.stringify(
    sources.map(({ key, url, page, file }) => ({ key, url, page, file })),
    null,
    2,
  ),
);
if (!apply) process.exit(0);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
const prisma = new PrismaClient();
try {
  const before = await prisma.store.findMany({ orderBy: { id: 'asc' } });
  const changes = [];
  for (const source of sources) {
    const rows = before.filter(
      (row) =>
        row.productVisibility &&
        source.match.test(row.productName || '') &&
        !row.productImage,
    );
    if (!rows.length) continue;
    const uploaded = await cloudinary.uploader.upload(source.file, {
      public_id: `sureimports/shop/iphones/2026-09/${source.key}`,
      overwrite: false,
      resource_type: 'image',
    });
    const check = await fetch(uploaded.secure_url, {
      signal: AbortSignal.timeout(30000),
    });
    assert.ok(check.ok, 'Uploaded image is not accessible');
    assert.ok(
      (await sharp(Buffer.from(await check.arrayBuffer())).metadata()).width >=
        400,
    );
    for (const row of rows)
      changes.push({
        id: row.pidProduct,
        name: row.productName,
        url: uploaded.secure_url,
      });
  }
  await fs.writeFile(
    path.join(folder, `before-${Date.now()}.json`),
    JSON.stringify(
      {
        before: before.filter((row) =>
          changes.some((c) => c.id === row.pidProduct),
        ),
        changes,
      },
      null,
      2,
    ),
    { mode: 0o600 },
  );
  await prisma.$transaction(
    async (tx) => {
      for (const change of changes) {
        const result = await tx.store.updateMany({
          where: { pidProduct: change.id, productImage: null },
          data: { productImage: change.url },
        });
        assert.equal(result.count, 1, 'Image changed concurrently; aborting');
      }
      const after = await tx.store.findMany({ orderBy: { id: 'asc' } });
      assert.deepEqual(
        after,
        before.map((row) => ({
          ...row,
          productImage:
            changes.find((c) => c.id === row.pidProduct)?.url ||
            row.productImage,
        })),
        'Unexpected catalogue change',
      );
    },
    { timeout: 60000 },
  );
  console.log(
    JSON.stringify(
      { updated: changes.length, changes, pricesAndOtherFieldsUnchanged: true },
      null,
      2,
    ),
  );
} finally {
  await prisma.$disconnect();
}
