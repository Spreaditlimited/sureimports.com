import { prisma } from '@/lib/prisma';
import { refundUser } from '@/lib/refunds/request-auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const pidUser = await refundUser();
  if (!pidUser) return NextResponse.json({ statusx: 'FAILED', message: 'Please sign in.' }, { status: 401 });
  try {
    const data = await prisma.refund_records.findMany({ where: { pidUser, refundStatus: 'pending' }, select: { id: true, pidRefund: true, pidOrder: true, amount: true, currency: true, refundStatus: true, serviceType: true, createdAt: true, updatedAt: true } });
    return NextResponse.json({ statusx: 'SUCCESS', message: 'Refunds fetched successfully', data });
  } catch {
    return NextResponse.json({ statusx: 'FAILED', message: 'Unable to load refunds. Please retry.', data: [] }, { status: 503 });
  }
}
