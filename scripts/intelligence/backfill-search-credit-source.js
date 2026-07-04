const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const tableRows = await prisma.$queryRaw`
    SELECT COUNT(*) AS total
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'intelligence_search_requests'
  `;
  const tableExists = Number(tableRows[0]?.total || 0) > 0;

  if (!tableExists) {
    console.log('intelligence_search_requests does not exist; nothing to backfill.');
    return;
  }

  const columnRows = await prisma.$queryRaw`
    SELECT COUNT(*) AS total
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'intelligence_search_requests'
      AND COLUMN_NAME = 'creditSource'
  `;
  const columnExists = Number(columnRows[0]?.total || 0) > 0;

  if (!columnExists) {
    await prisma.$executeRawUnsafe(
      'ALTER TABLE `intelligence_search_requests` ADD COLUMN `creditSource` VARCHAR(40) NULL',
    );
    console.log('Added intelligence_search_requests.creditSource.');
  } else {
    console.log('Confirmed intelligence_search_requests.creditSource already exists.');
  }

  const updated = await prisma.$executeRawUnsafe(`
    UPDATE intelligence_search_requests r
    SET r.creditSource = CASE
      WHEN EXISTS (
        SELECT 1
        FROM intelligence_credit_transactions t
        WHERE t.pidUser = r.pidUser
          AND t.reason = 'extra_search_credits_purchase'
          AND t.amount > 0
          AND t.createdAt <= r.createdAt
      ) THEN 'paid'
      WHEN EXISTS (
        SELECT 1
        FROM intelligence_credit_transactions t
        WHERE t.pidUser = r.pidUser
          AND t.reason IN ('starter_monthly_search_credits', 'pro_monthly_search_credits')
          AND t.amount > 0
          AND t.createdAt <= r.createdAt
      ) THEN 'subscription'
      ELSE 'free'
    END
    WHERE r.creditCost > 0
      AND (r.creditSource IS NULL OR r.creditSource = '')
  `);

  console.log(`Backfilled ${updated} search request row(s).`);

  const summary = await prisma.$queryRaw`
    SELECT COALESCE(creditSource, 'NULL') AS creditSource, COUNT(*) AS total
    FROM intelligence_search_requests
    GROUP BY COALESCE(creditSource, 'NULL')
    ORDER BY creditSource
  `;

  for (const row of summary) {
    console.log(`${row.creditSource}: ${row.total}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
