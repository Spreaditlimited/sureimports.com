import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';
import { createHash, randomUUID } from 'node:crypto';
const db = new PrismaClient();
const name = '20260923120000_whatsapp_performance';
const sql = readFileSync(
  new URL(`../prisma/migrations/${name}/migration.sql`, import.meta.url),
  'utf8',
);
const checksum = createHash('sha256').update(sql).digest('hex');
try {
  const rows =
    await db.$queryRaw`SELECT checksum,finished_at,rolled_back_at FROM _prisma_migrations WHERE migration_name=${name}`;
  const done = rows.find((r) => r.finished_at && !r.rolled_back_at);
  if (done) {
    if (done.checksum !== checksum) throw Error('CHECKSUM_MISMATCH');
    console.log('WhatsApp migration already applied.');
  } else {
    if (rows.some((r) => !r.finished_at && !r.rolled_back_at))
      throw Error('UNFINISHED_MIGRATION');
    const statements = sql
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean);
    if (
      statements.length !== 3 ||
      statements.some(
        (s) => !/^CREATE TABLE whatsapp_(clicks|leads|rate_limits) \(/.test(s),
      )
    )
      throw Error('UNEXPECTED_SQL');
    if (!process.argv.includes('--apply'))
      console.log(
        'Ready: three new WhatsApp reporting tables only. No existing records changed.',
      );
    else {
      const id = randomUUID();
      await db.$executeRaw`INSERT INTO _prisma_migrations(id,checksum,migration_name,started_at,applied_steps_count) VALUES(${id},${checksum},${name},NOW(3),0)`;
      for (const statement of statements) await db.$executeRawUnsafe(statement);
      await db.$executeRaw`UPDATE _prisma_migrations SET finished_at=NOW(3),applied_steps_count=3 WHERE id=${id}`;
      console.log('Applied WhatsApp reporting migration.');
    }
  }
} catch (error) {
  console.error(
    'WhatsApp migration:',
    /^[A-Z_]+$/.test(error.message)
      ? error.message
      : error.code || 'DATABASE_ERROR',
  );
  process.exitCode = 1;
} finally {
  await db.$disconnect();
}
