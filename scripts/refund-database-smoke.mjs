import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import assert from 'node:assert/strict';
const db = new PrismaClient();
const id = `REFUND_SMOKE_${randomUUID()}`;
const rollback = new Error('ROLLBACK_EXPECTED');
try {
  await db
    .$transaction(async (tx) => {
      await tx.$executeRaw`INSERT INTO refund_settlements (refundId,pidUser,sourceCurrency,sourceAmount,settlementCurrency,settlementAmount,exchangeRate,method,destinationCiphertext) VALUES (${id},${id},'USD',100,'GBP',75,0.75,'BANK','SMOKE_NOT_A_DESTINATION')`;
      const [row] =
        await tx.$queryRaw`SELECT sourceAmount,settlementAmount,exchangeRate,status FROM refund_settlements WHERE refundId=${id} FOR UPDATE`;
      assert.equal(Number(row.sourceAmount), 100);
      assert.equal(Number(row.settlementAmount), 75);
      assert.equal(Number(row.exchangeRate), 0.75);
      assert.equal(row.status, 'REQUESTED');
      await tx.$executeRaw`INSERT INTO refund_provider_legs (id,refundId,paymentId,captureId,currency,amount) VALUES (${id},${id},${id},${id},'USD',10)`;
      const [leg] =
        await tx.$queryRaw`SELECT SUM(amount) amount FROM refund_provider_legs WHERE captureId=${id}`;
      assert.equal(Number(leg.amount), 10);
      await tx.$executeRaw`INSERT INTO refund_notifications (refundId,eventType) VALUES (${id},'SETTLED')`;
      const claimed = await tx.$executeRaw`UPDATE refund_notifications SET claimedAt=NOW(3),attempts=attempts+1 WHERE refundId=${id} AND eventType='SETTLED' AND claimedAt IS NULL AND status='PENDING'`;
      const duplicate = await tx.$executeRaw`UPDATE refund_notifications SET claimedAt=NOW(3),attempts=attempts+1 WHERE refundId=${id} AND eventType='SETTLED' AND claimedAt IS NULL AND status='PENDING'`;
      assert.equal(claimed, 1);
      assert.equal(duplicate, 0);
      throw rollback;
    })
    .catch((error) => {
      if (error !== rollback) throw error;
    });
  const [left] =
    await db.$queryRaw`SELECT COUNT(*) count FROM refund_settlements WHERE refundId=${id}`;
  const [legs] =
    await db.$queryRaw`SELECT COUNT(*) count FROM refund_provider_legs WHERE refundId=${id}`;
  assert.equal(Number(left.count), 0);
  assert.equal(Number(legs.count), 0);
  const [notifications] = await db.$queryRaw`SELECT COUNT(*) count FROM refund_notifications WHERE refundId=${id}`;
  assert.equal(Number(notifications.count), 0);
  console.log(
    'PASS: currency snapshot, refund allocation and transaction rollback. No test records persisted and no provider was called.',
  );
} catch (error) {
  console.error('Refund database smoke failed:', error.code || error.name);
  process.exitCode = 1;
} finally {
  await db.$disconnect();
}
