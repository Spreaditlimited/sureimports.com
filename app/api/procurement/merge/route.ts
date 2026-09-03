import { NextResponse } from 'next/server';
import { mergeSavedOrders, procurementId, requireProcurementUser } from '@/lib/procurement/assistance';

export async function POST(request: Request) {
  const user = await requireProcurementUser();
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  try {
    const merge = await mergeSavedOrders({ pidUser: user.pidUser, orderIds: body.orderIds || [], targetOrderId: body.targetOrderId,
      actorType: 'USER', actorPid: user.pidUser, idempotencyKey: body.idempotencyKey || procurementId('IK') });
    return NextResponse.json({ statusx: 'SUCCESS', merge });
  } catch (error) {
    return NextResponse.json({ statusx: 'FAILED', message: error instanceof Error ? error.message : 'Unable to merge orders.' }, { status: 409 });
  }
}
