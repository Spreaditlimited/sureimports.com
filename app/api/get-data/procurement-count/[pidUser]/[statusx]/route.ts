import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireProcurementUser } from '@/lib/procurement/assistance';
import { PROCUREMENT_STATUS_ITEMS } from '@/app/dashboard/procurement/constants/order-statuses';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ pidUser: string; statusx: string }> },
) {
  const user = await requireProcurementUser();
  if (!user) return NextResponse.json({ message: 'Please sign in.' }, { status: 401 });
  const { pidUser } = await params;
  if (pidUser !== user.pidUser) return NextResponse.json({ message: 'Access denied.' }, { status: 403 });
  try {
    const groups = await prisma.orders.groupBy({
      by: ['status'],
      where: { pidUser: user.pidUser },
      _count: { _all: true },
    });
    const counts = new Map(groups.map(group => [group.status, group._count._all]));
    return NextResponse.json(Object.fromEntries(PROCUREMENT_STATUS_ITEMS.map(item => [item.countKey, counts.get(item.value) || 0])), { headers: { 'Cache-Control': 'private, no-store' } });
  } catch {
    return NextResponse.json({ message: 'Unable to load order counts.' }, { status: 500 });
  }
}
