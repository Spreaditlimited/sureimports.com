import { randomUUID } from 'crypto';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

export const ASSISTANCE_DURATION_DAYS = 7;

export function hasWhatsAppNumber(user: {
  userPhone?: string | null;
  phone?: string | null;
}) {
  const value = String(user.userPhone || user.phone || '').trim();
  const digits = value.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

export async function requireProcurementUser() {
  const token = (await cookies()).get('token')?.value;
  const payload = token
    ? (verifyToken(token) as { pidUser?: string } | null)
    : null;
  if (!payload?.pidUser) return null;
  return prisma.users.findUnique({
    where: { pidUser: payload.pidUser },
    select: { pidUser: true, userEmail: true, userPhone: true, phone: true },
  });
}

export function procurementId(prefix: string) {
  return `${prefix}_${randomUUID().replaceAll('-', '')}`;
}

export const mergeCompatibilityFields = [
  'destinationCountry',
  'currencyType',
  'shippingPlan',
  'orderCategory',
  'shippingPricingVersion',
  'shippingMeasurementUnit',
  'shippingRateCurrency',
] as const;

export function incompatibleOrderFields(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
) {
  return mergeCompatibilityFields.filter(
    (field) => (target[field] ?? null) !== (source[field] ?? null),
  );
}

export async function mergeSavedOrders(input: {
  pidUser: string;
  orderIds: string[];
  targetOrderId: string;
  actorType: 'USER' | 'ADMIN';
  actorPid: string;
  assistanceCaseId?: string;
  idempotencyKey: string;
}) {
  const orderIds = [...new Set(input.orderIds)];
  if (orderIds.length < 2 || !orderIds.includes(input.targetOrderId)) {
    throw new Error(
      'Select at least two orders and choose one as the destination.',
    );
  }

  return prisma.$transaction(async (tx) => {
    const existing = await tx.procurement_order_merges.findUnique({
      where: { idempotencyKey: input.idempotencyKey },
    });
    if (existing) return existing;

    const orders = await tx.orders.findMany({
      where: { pidOrder: { in: orderIds }, pidUser: input.pidUser },
      include: { products: true },
    });
    if (orders.length !== orderIds.length)
      throw new Error('One or more orders were not found.');
    if (
      orders.some(
        (order) => order.status !== 'saved' || order.mergedIntoOrderId,
      )
    ) {
      throw new Error('Only active saved orders can be merged.');
    }
    const target = orders.find(
      (order) => order.pidOrder === input.targetOrderId,
    )!;
    const conflicts = orders.flatMap((order) =>
      incompatibleOrderFields(target, order),
    );
    if (conflicts.length) {
      throw new Error(
        `These orders use different ${[...new Set(conflicts)].join(', ')} settings.`,
      );
    }
    const [cardPayments, bankPayments] = await Promise.all([
      tx.payments.count({ where: { serviceID: { in: orderIds } } }),
      tx.bank_payment.count({ where: { pidOrder: { in: orderIds } } }),
    ]);
    if (cardPayments || bankPayments)
      throw new Error('Paid orders cannot be merged.');

    const pidMerge = procurementId('PM');
    const sources = orders.filter(
      (order) => order.pidOrder !== input.targetOrderId,
    );
    const movedProductCount = sources.reduce(
      (sum, order) => sum + order.products.length,
      0,
    );
    const merge = await tx.procurement_order_merges.create({
      data: {
        pidMerge,
        pidUser: input.pidUser,
        targetOrderId: input.targetOrderId,
        actorType: input.actorType,
        actorPid: input.actorPid,
        assistanceCaseId: input.assistanceCaseId,
        idempotencyKey: input.idempotencyKey,
        movedProductCount,
      },
    });
    for (const source of sources) {
      await tx.procurement_order_merge_sources.create({
        data: {
          pidMerge,
          sourceOrderId: source.pidOrder,
          productCount: source.products.length,
          snapshotJson: JSON.parse(JSON.stringify(source)),
        },
      });
      await tx.products.updateMany({
        where: { pidOrder: source.pidOrder },
        data: {
          pidOrder: input.targetOrderId,
          pidUser: input.pidUser,
          updatedAt: new Date(),
        },
      });
      await tx.orders.update({
        where: { pidOrder: source.pidOrder },
        data: {
          status: 'merged',
          mergedIntoOrderId: input.targetOrderId,
          mergedAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
    await tx.orders.update({
      where: { pidOrder: input.targetOrderId },
      data: { assistanceRevision: { increment: 1 }, updatedAt: new Date() },
    });
    return merge;
  });
}
