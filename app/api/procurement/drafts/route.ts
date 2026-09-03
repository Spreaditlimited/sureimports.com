import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  hasWhatsAppNumber,
  requireProcurementUser,
} from '@/lib/procurement/assistance';

function firstNameOnly(name: string | null) {
  if (!name || name.includes('@')) return null;
  return name.trim().split(/\s+/)[0] || null;
}

export async function GET() {
  const user = await requireProcurementUser();
  if (!user)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const [orders, cases] = await Promise.all([
    prisma.orders.findMany({
      where: {
        pidUser: user.pidUser,
        status: 'saved',
        mergedIntoOrderId: null,
      },
      orderBy: { updatedAt: 'desc' },
      include: { products: { select: { pidProduct: true } } },
    }),
    prisma.procurement_assistance_cases.findMany({
      where: {
        pidUser: user.pidUser,
        status: 'ACTIVE',
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ]);
  const assignedAdminIds = [
    ...new Set(
      cases.flatMap((item) =>
        item.assignedAdminPidUser ? [item.assignedAdminPidUser] : [],
      ),
    ),
  ];
  const [caseOrders, assignedAdmins] = await Promise.all([
    cases.length
      ? prisma.procurement_assistance_case_orders.findMany({
          where: { pidCase: { in: cases.map((item) => item.pidCase) } },
        })
      : [],
    assignedAdminIds.length
      ? prisma.users.findMany({
          where: { pidUser: { in: assignedAdminIds } },
          select: { pidUser: true, userFirstname: true },
        })
      : [],
  ]);
  const adminFirstNames = new Map(
    assignedAdmins.map((admin) => [admin.pidUser, admin.userFirstname]),
  );
  return NextResponse.json({
    hasWhatsAppNumber: hasWhatsAppNumber(user),
    orders: orders.map(({ products, ...order }) => ({
      ...order,
      productCount: products.length,
    })),
    cases: cases.map((item) => ({
      ...item,
      assignedAdminName:
        (item.assignedAdminPidUser
          ? adminFirstNames.get(item.assignedAdminPidUser)?.trim()
          : null) || firstNameOnly(item.assignedAdminName),
      orderIds: caseOrders
        .filter((row) => row.pidCase === item.pidCase)
        .map((row) => row.pidOrder),
    })),
  });
}
