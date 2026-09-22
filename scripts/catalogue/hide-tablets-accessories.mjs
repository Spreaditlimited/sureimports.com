import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();
try {
  const before = await db.store.findMany({ orderBy: { id: 'asc' } });
  const targets = before.filter(row => row.productVisibility && ['tablet', 'accessories'].includes(row.productCategory));
  console.log(JSON.stringify({ targets: targets.map(row => ({ id: row.pidProduct, name: row.productName, category: row.productCategory })) }));
  if (process.argv.includes('--apply')) {
    await fs.mkdir('.catalogue-backups', { recursive: true });
    const backup = `.catalogue-backups/hidden-tablets-accessories-${Date.now()}.json`;
    await fs.writeFile(backup, JSON.stringify(targets.map(row => ({ pidProduct: row.pidProduct, productVisibility: row.productVisibility })), null, 2), { mode: 0o600 });
    const ids = targets.map(row => row.pidProduct);
    await db.$transaction(async tx => {
      const result = await tx.store.updateMany({ where: { pidProduct: { in: ids }, productCategory: { in: ['tablet', 'accessories'] }, productVisibility: true }, data: { productVisibility: false } });
      assert.equal(result.count, ids.length, 'Catalogue changed concurrently; aborting');
      const after = await tx.store.findMany({ orderBy: { id: 'asc' } });
      assert.deepEqual(after, before.map(row => ids.includes(row.pidProduct) ? { ...row, productVisibility: false } : row), 'Unexpected catalogue changes');
      assert.equal(after.filter(row => row.productVisibility && ['tablet', 'accessories'].includes(row.productCategory)).length, 0);
    }, { timeout: 60000 });
    console.log(JSON.stringify({ hidden: targets.length, tablets: targets.filter(row => row.productCategory === 'tablet').length, accessories: targets.filter(row => row.productCategory === 'accessories').length, backup, otherProductsUnchanged: true }));
  }
} catch (error) {
  console.error(error.code || error.message);
  process.exitCode = 1;
} finally { await db.$disconnect(); }
