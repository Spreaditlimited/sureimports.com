import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getProcurementOrderLifecycle } from '@/lib/procurement/orderLifecycle';

export async function GET(request: NextRequest) {
  const pidUser = request.nextUrl.searchParams.get('pidUser');
  const pidOrder = request.nextUrl.searchParams.get('pidOrder');
  if (!pidUser || !pidOrder) {
    return NextResponse.json(
      { statusx: 'FAILED', message: 'Order details are required.' },
      { status: 400 },
    );
  }

  try {
    const lifecycle = await getProcurementOrderLifecycle(pidOrder, pidUser);
    if (lifecycle.order.status !== 'on-hold') {
      return NextResponse.json(
        { statusx: 'FAILED', message: 'This order is no longer on hold.' },
        { status: 409 },
      );
    }
    if (Math.abs(lifecycle.onHoldDifferenceUsd) > 0.01) {
      return NextResponse.json(
        {
          statusx: 'FAILED',
          message: 'This order has a payment or refund adjustment to process.',
        },
        { status: 409 },
      );
    }

    const updated = await prisma.orders.updateMany({
      where: { pidUser, pidOrder, status: 'on-hold' },
      data: {
        status: 'pending',
        orderTotalCostOld: lifecycle.order.orderTotalCost,
        orderWeightOld: lifecycle.order.orderWeight,
        orderShippingCostOld: lifecycle.order.orderShippingCost,
        ...lifecycle.snapshot,
        updatedAt: new Date(),
      },
    });
    if (updated.count !== 1) {
      return NextResponse.json(
        {
          statusx: 'FAILED',
          message: 'Order status changed. Refresh and try again.',
        },
        { status: 409 },
      );
    }

    return NextResponse.json({
      statusx: 'SUCCESS',
      message: 'Order was successfully returned for admin processing.',
    });
  } catch (error) {
    console.error('Failed to return on-hold procurement order:', error);
    return NextResponse.json(
      { statusx: 'FAILED', message: 'Unable to update the order right now.' },
      { status: 500 },
    );
  }
}
