import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';
import { createHash, randomUUID } from 'node:crypto';
const db = new PrismaClient();
const name = process.argv.includes('--commissions') ? '20260914140000_affiliate_refund_adjustments' : process.argv.includes('--events') ? '20260914130000_refund_events' : process.argv.includes('--notifications') ? '20260914120000_refund_notifications' : process.argv.includes('--provider') ? '20260914110000_refund_provider_legs' : '20260914100000_refund_settlements';
const sql = readFileSync(
  new URL(`../prisma/migrations/${name}/migration.sql`, import.meta.url),
  'utf8',
);
const checksum = createHash('sha256').update(sql).digest('hex');
try {
  const rows =
    await db.$queryRaw`SELECT checksum,finished_at,rolled_back_at FROM _prisma_migrations WHERE migration_name=${name}`;
  if (rows.some((r) => r.finished_at && !r.rolled_back_at)) {
    if (
      !rows.some(
        (r) => r.finished_at && !r.rolled_back_at && r.checksum === checksum,
      )
    )
      throw Error('CHECKSUM_MISMATCH');
    console.log('Refund settlement migration already applied.');
  } else {
    if (rows.some((r) => !r.finished_at && !r.rolled_back_at))
      throw Error('UNFINISHED_MIGRATION');
    if (!process.argv.includes('--apply')) throw Error('APPLY_FLAG_REQUIRED');
    const id = randomUUID();
    await db.$executeRaw`INSERT INTO _prisma_migrations (id,checksum,migration_name,started_at,applied_steps_count) VALUES (${id},${checksum},${name},NOW(3),0)`;
    await db.$executeRawUnsafe(sql);
    await db.$executeRaw`UPDATE _prisma_migrations SET finished_at=NOW(3),applied_steps_count=1 WHERE id=${id}`;
    console.log(
      'Refund settlement table created; existing refunds and payments were not changed.',
    );
  }
} catch (error) {
  console.error(
    'Migration failed:',
    [
      'CHECKSUM_MISMATCH',
      'UNFINISHED_MIGRATION',
      'APPLY_FLAG_REQUIRED',
    ].includes(error.message)
      ? error.message
      : error.code || 'DATABASE_ERROR',
  );
  process.exitCode = 1;
} finally {
  await db.$disconnect();
}
