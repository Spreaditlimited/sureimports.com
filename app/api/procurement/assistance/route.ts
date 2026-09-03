import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  ASSISTANCE_DURATION_DAYS,
  hasWhatsAppNumber,
  procurementId,
  requireProcurementUser,
} from '@/lib/procurement/assistance';

export async function POST(request: Request) {
  const user = await requireProcurementUser();
  if (!user)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (!hasWhatsAppNumber(user)) {
    return NextResponse.json(
      {
        statusx: 'WHATSAPP_REQUIRED',
        message:
          'Add your WhatsApp number to your profile before asking an admin for help.',
        actionHref: '/dashboard/profile-update',
      },
      { status: 422 },
    );
  }
  const body = await request.json();
  const suppliedOrderIds: unknown[] = Array.isArray(body.orderIds)
    ? body.orderIds
    : [];
  const orderIds: string[] = [
    ...new Set(
      suppliedOrderIds.filter(
        (value): value is string => typeof value === 'string',
      ),
    ),
  ];
  if (orderIds.length) {
    const count = await prisma.orders.count({
      where: {
        pidUser: user.pidUser,
        pidOrder: { in: orderIds },
        status: 'saved',
        mergedIntoOrderId: null,
      },
    });
    if (count !== orderIds.length)
      return NextResponse.json(
        { message: 'Only your active saved orders can be authorized.' },
        { status: 400 },
      );
  }
  if (!orderIds.length && !body.canCreateOrder)
    return NextResponse.json(
      { message: 'Select an order or authorize creation of a new one.' },
      { status: 400 },
    );
  const pidCase = procurementId('PA');
  const expiresAt = new Date(
    Date.now() + ASSISTANCE_DURATION_DAYS * 86_400_000,
  );
  await prisma.$transaction([
    prisma.procurement_assistance_cases.create({
      data: {
        pidCase,
        pidUser: user.pidUser,
        supportNote: String(body.supportNote || '').slice(0, 3000) || null,
        canCreateOrder: Boolean(body.canCreateOrder),
        canEditOrder: true,
        canManageProducts: true,
        canMergeOrders: orderIds.length > 1,
        expiresAt,
      },
    }),
    ...orderIds.map((pidOrder) =>
      prisma.procurement_assistance_case_orders.create({
        data: { pidCase, pidOrder },
      }),
    ),
    prisma.procurement_assistance_events.create({
      data: {
        pidEvent: procurementId('PE'),
        pidCase,
        actorType: 'USER',
        actorPid: user.pidUser,
        eventType: 'AUTHORIZED',
        detailsJson: { orderIds, canCreateOrder: Boolean(body.canCreateOrder) },
      },
    }),
  ]);
  return NextResponse.json({ statusx: 'SUCCESS', pidCase, expiresAt });
}

export async function PATCH(request: Request) {
  const user = await requireProcurementUser();
  if (!user)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const { pidCase } = await request.json();
  const revoked = await prisma.$transaction(async (tx) => {
    const assistance = await tx.procurement_assistance_cases.findFirst({
      where: { pidCase, pidUser: user.pidUser, status: 'ACTIVE' },
      select: { assignedAdminPidUser: true },
    });
    if (!assistance) return false;

    const createdOrderEvents = assistance.assignedAdminPidUser
      ? await tx.procurement_assistance_events.findMany({
          where: {
            pidCase,
            eventType: 'ORDER_CREATED',
            pidOrder: { not: null },
          },
          select: { pidOrder: true },
        })
      : [];
    const createdOrderIds = createdOrderEvents.flatMap((event) =>
      event.pidOrder ? [event.pidOrder] : [],
    );

    const result = await tx.procurement_assistance_cases.updateMany({
      where: { pidCase, pidUser: user.pidUser, status: 'ACTIVE' },
      data: {
        status: 'REVOKED',
        revokedAt: new Date(),
        assignedAdminPidUser: null,
        assignedAdminName: null,
        claimedAt: null,
      },
    });
    if (!result.count) return false;

    if (assistance.assignedAdminPidUser && createdOrderIds.length) {
      await tx.orders.updateMany({
        where: {
          pidOrder: { in: createdOrderIds },
          pidUser: user.pidUser,
          status: 'saved',
          pidAdmin: assistance.assignedAdminPidUser,
        },
        data: { pidAdmin: null },
      });
    }

    await tx.procurement_assistance_events.create({
      data: {
        pidEvent: procurementId('PE'),
        pidCase,
        actorType: 'USER',
        actorPid: user.pidUser,
        eventType: 'REVOKED',
      },
    });
    return true;
  });
  if (!revoked)
    return NextResponse.json(
      { message: 'Active authorization not found.' },
      { status: 404 },
    );
  return NextResponse.json({ statusx: 'SUCCESS' });
}
