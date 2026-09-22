import fs from 'node:fs';
import assert from 'node:assert/strict';
import { PrismaClient } from '@prisma/client';

const source = JSON.parse(
  fs.readFileSync(new URL('./iphone-prices-2026-09-22.json', import.meta.url)),
);
const apply = process.argv.includes('--apply');
const db = new PrismaClient();
const entries = source.brandNew.filter(([model]) => /^18(?: |$)/.test(model));
assert.equal(
  entries.length,
  9,
  'Expected exactly nine approved iPhone 18 variants',
);
assert.equal(source.ngnPerRmb, 210);
try {
  const all = await db.store.findMany({ orderBy: { id: 'asc' } });
  const changes = entries.map(([model, storage, base, colour]) => {
    const name = `iPhone ${model} ${storage}GB${colour ? ' — ' + colour : ''} — Brand new`;
    const matches = all.filter(
      (row) =>
        row.productName === name &&
        row.productCondition === 'BRAND_NEW' &&
        row.productVisibility,
    );
    assert.equal(matches.length, 1, `Expected one visible product: ${name}`);
    const before = matches[0];
    const previousPrice = (base + 1000) * 210;
    const price = (base + 800) * 210;
    assert(
      [previousPrice, price].includes(before.productPrice),
      `Unexpected current price: ${name}. No changes applied.`,
    );
    return { before, name, base, previousPrice, price };
  });
  console.log(
    JSON.stringify(
      {
        mode: apply ? 'apply' : 'dry-run',
        changes: changes.map((c) => ({
          name: c.name,
          baseRmb: c.base,
          currentPrice: c.before.productPrice,
          previousPrice: c.previousPrice,
          newPrice: c.price,
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
          if (c.before.productPrice === c.price) continue;
          const result = await tx.store.updateMany({
            where: {
              pidProduct: c.before.pidProduct,
              productPrice: c.previousPrice,
              updatedAt: c.before.updatedAt,
              productVisibility: true,
            },
            data: { productPrice: c.price, updatedAt: new Date() },
          });
          assert.equal(
            result.count,
            1,
            'Product changed during update; rolling back',
          );
        }
        const after = await tx.store.findMany({ orderBy: { id: 'asc' } });
        const targetIds = new Set(changes.map((c) => c.before.pidProduct));
        assert.deepEqual(
          after.filter((r) => !targetIds.has(r.pidProduct)),
          all.filter((r) => !targetIds.has(r.pidProduct)),
          'Other products changed',
        );
        for (const c of changes) {
          const row = after.find((r) => r.pidProduct === c.before.pidProduct);
          assert.equal(row.productPrice, c.price);
          assert.deepEqual(
            {
              ...row,
              productPrice: c.before.productPrice,
              updatedAt: c.before.updatedAt,
            },
            c.before,
            'Unexpected non-price changes',
          );
        }
      },
      { timeout: 30000 },
    );
    console.log(
      'Verified: all nine prices updated; other products and non-price fields unchanged.',
    );
  }
} finally {
  await db.$disconnect();
}
