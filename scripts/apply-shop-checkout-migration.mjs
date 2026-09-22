import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';
import { createHash, randomUUID } from 'node:crypto';

const db = new PrismaClient();
const guest = process.argv.includes('--guest');
const name = guest ? '20260922210000_shop_guest_checkout' : '20260922190000_shop_checkout_integrity';
const sql = readFileSync(
  new URL(`../prisma/migrations/${name}/migration.sql`, import.meta.url),
  'utf8',
);
const checksum = createHash('sha256').update(sql).digest('hex');
try {
  const rows =
    await db.$queryRaw`SELECT checksum,finished_at,rolled_back_at FROM _prisma_migrations WHERE migration_name=${name}`;
  if (rows.some((row) => row.finished_at && !row.rolled_back_at)) {
    if (
      !rows.some(
        (row) =>
          row.finished_at && !row.rolled_back_at && row.checksum === checksum,
      )
    )
      throw Error('CHECKSUM_MISMATCH');
    console.log('Shop checkout migration is already applied.');
  } else {
    if (rows.some((row) => !row.finished_at && !row.rolled_back_at))
      throw Error('UNFINISHED_MIGRATION');
    const statements = sql
      .split(';')
      .map((value) => value.trim())
      .filter(Boolean);
    if (
      statements.length !== 1 ||
      !(guest ? /^ALTER TABLE shop_checkouts\s+ADD COLUMN guestTokenHash/.test(statements[0]) : /^CREATE TABLE shop_checkouts\s*\(/.test(statements[0]))
    )
      throw Error('UNEXPECTED_SQL');
    if (!process.argv.includes('--apply'))
      console.log(
        guest ? 'Ready: additive guest-checkout fields and index only. Existing financial records remain unchanged.' : 'Ready: one new shop checkout table. Existing products, payments, orders and balances remain unchanged.',
      );
    else {
      const id = randomUUID();
      await db.$executeRaw`INSERT INTO _prisma_migrations(id,checksum,migration_name,started_at,applied_steps_count) VALUES(${id},${checksum},${name},NOW(3),0)`;
      await db.$executeRawUnsafe(statements[0]);
      await db.$executeRaw`UPDATE _prisma_migrations SET finished_at=NOW(3),applied_steps_count=1 WHERE id=${id}`;
      console.log(
        guest ? 'Applied guest checkout fields and index. Existing financial records unchanged.' : 'Applied shop checkout table. Existing financial records unchanged.',
      );
    }
  }
} catch (error) {
  console.error(
    'Shop migration:',
    /^[A-Z_]+$/.test(error.message)
      ? error.message
      : error.code || 'DATABASE_ERROR',
  );
  process.exitCode = 1;
} finally {
  await db.$disconnect();
}
