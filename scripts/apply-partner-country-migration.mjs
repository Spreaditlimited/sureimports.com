import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';
import { createHash, randomUUID } from 'node:crypto';
const db = new PrismaClient();
const name = process.argv.includes('--settlement')
  ? '20260914070000_partner_country_settlement'
  : '20260914060000_partner_country_policies';
const sql = readFileSync(
  new URL(`../prisma/migrations/${name}/migration.sql`, import.meta.url),
  'utf8',
);
const checksum = createHash('sha256').update(sql).digest('hex');
try {
  const rows =
    await db.$queryRaw`SELECT checksum, finished_at, rolled_back_at FROM _prisma_migrations WHERE migration_name=${name}`;
  if (rows.some((r) => r.finished_at && !r.rolled_back_at)) {
    if (
      !rows.some(
        (r) => r.checksum === checksum && r.finished_at && !r.rolled_back_at,
      )
    )
      throw Error('CHECKSUM_MISMATCH');
    console.log('Country migration already applied.');
  } else {
    if (rows.some((r) => !r.finished_at && !r.rolled_back_at))
      throw Error('UNFINISHED_MIGRATION_REQUIRES_REVIEW');
    if (!process.argv.includes('--apply'))
      throw Error('Run with --apply to apply this single migration.');
    const id = randomUUID();
    await db.$executeRaw`INSERT INTO _prisma_migrations (id,checksum,migration_name,started_at,applied_steps_count) VALUES (${id},${checksum},${name},NOW(3),0)`;
    for (const statement of sql
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean))
      await db.$executeRawUnsafe(statement);
    await db.$executeRaw`UPDATE _prisma_migrations SET finished_at=NOW(3),applied_steps_count=1 WHERE id=${id}`;
    console.log(
      'Country policies migration applied. No existing orders or payment records changed.',
    );
  }
  const countries =
    await db.$queryRaw`SELECT code,revision FROM partner_country_policies ORDER BY code`;
  console.log(countries);
} catch (error) {
  console.error(
    'Country migration failed:',
    error.code ||
      (['CHECKSUM_MISMATCH', 'UNFINISHED_MIGRATION_REQUIRES_REVIEW'].includes(
        error.message,
      )
        ? error.message
        : 'Review migration status before retrying.'),
  );
  process.exitCode = 1;
} finally {
  await db.$disconnect();
}
