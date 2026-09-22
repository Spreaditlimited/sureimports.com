import assert from 'node:assert/strict';
import { PrismaClient } from '@prisma/client';

// Apple: https://www.apple.com/iphone-18-pro/specs/
// These finish images were already selected from Apple's product page.
const finishes = { White: 'Silver', Blue: 'Glacier', Red: 'Burgundy' };
const db = new PrismaClient();
const apply = process.argv.includes('--apply');
try {
  const before = await db.store.findMany({ orderBy: { id: 'asc' } });
  const changes = [];
  for (const [oldColour, colour] of Object.entries(finishes)) {
    for (const storage of [256, 512]) {
      const name = `iPhone 18 Pro Max ${storage}GB — ${colour} — Brand new`;
      const oldName = `iPhone 18 Pro Max ${storage}GB — ${oldColour} — Brand new`;
      const rows = before.filter(
        (r) => r.productVisibility && [name, oldName].includes(r.productName),
      );
      assert.equal(rows.length, 1, `Expected one product: ${name}`);
      const row = rows[0];
      assert.equal(row.productCondition, 'BRAND_NEW');
      assert(
        row.productImage?.includes(`iphone-18-pro-max-${colour.toLowerCase()}`),
        'Image finish mismatch',
      );
      const replace = (text) =>
        typeof text === 'string'
          ? text.replace(new RegExp(`\\b${oldColour}\\b`, 'gi'), colour)
          : text;
      changes.push({
        row,
        data: {
          productName: name,
          productDescription: replace(row.productDescription),
          productFeature: replace(row.productFeature),
          productSpecification: replace(row.productSpecification),
        },
      });
    }
  }
  console.log(
    JSON.stringify(
      {
        mode: apply ? 'apply' : 'dry-run',
        changes: changes.map((c) => ({
          from: c.row.productName,
          to: c.data.productName,
          priceUnchanged: c.row.productPrice,
        })),
      },
      null,
      2,
    ),
  );
  if (apply) {
    await db.$transaction(
      async (tx) => {
        for (const c of changes) {
          const result = await tx.store.updateMany({
            where: { pidProduct: c.row.pidProduct, updatedAt: c.row.updatedAt },
            data: { ...c.data, updatedAt: new Date() },
          });
          assert.equal(
            result.count,
            1,
            'Concurrent change detected; rolling back',
          );
        }
        const after = await tx.store.findMany({ orderBy: { id: 'asc' } });
        const ids = new Set(changes.map((c) => c.row.pidProduct));
        assert.deepEqual(
          after.filter((r) => !ids.has(r.pidProduct)),
          before.filter((r) => !ids.has(r.pidProduct)),
        );
        for (const c of changes) {
          const row = after.find((r) => r.pidProduct === c.row.pidProduct);
          assert.deepEqual(row, {
            ...c.row,
            ...c.data,
            updatedAt: row.updatedAt,
          });
        }
      },
      { timeout: 30000 },
    );
    console.log(
      'Verified: six colour labels corrected; prices, images and all other products unchanged.',
    );
  }
} finally {
  await db.$disconnect();
}
