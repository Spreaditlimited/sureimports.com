import 'server-only';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

/** Expose only customer-facing fee figures, never actor IDs or internal quote metadata. */
export async function withCancellationDetails<T extends { pidRefund: string }>(
  records: T[],
  pidUser: string,
) {
  if (!records.length) return records;
  const details = await prisma.$queryRaw<
    Array<{ pidRefund: string; feePercent: string; fee: string; gross: string }>
  >`
    SELECT pidRefund,
      JSON_UNQUOTE(JSON_EXTRACT(ext2,'$.feePercent')) feePercent,
      JSON_UNQUOTE(JSON_EXTRACT(ext2,'$.fee')) fee,
      JSON_UNQUOTE(JSON_EXTRACT(ext2,'$.gross')) gross
    FROM refund_records WHERE pidUser=${pidUser} AND ext1='PROCUREMENT_CANCELLATION'
      AND JSON_VALID(ext2) AND pidRefund IN (${Prisma.join(records.map((record) => record.pidRefund))})`;
  const byId = new Map(
    details.map(({ pidRefund, feePercent, fee, gross }) => [
      pidRefund,
      { feePercent, fee, gross },
    ]),
  );
  return records.map((record) => ({
    ...record,
    cancellation: byId.get(record.pidRefund) || null,
  }));
}
