import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import randomGenerator from '@/lib/helpers/randomGenerator';
import { getProcurementOrderLifecycle } from '@/lib/procurement/orderLifecycle';
import { refundAmountInNgn } from '@/lib/procurement/shippingMath';

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
    if (lifecycle.onHoldDifferenceUsd >= -0.01) {
      return NextResponse.json(
        { statusx: 'FAILED', message: 'This order has no refund due.' },
        { status: 409 },
      );
    }

    const refundBeforeFeeUsd = Math.abs(lifecycle.onHoldDifferenceUsd);
    const refundAmountNgn = refundAmountInNgn(
      refundBeforeFeeUsd,
      lifecycle.rates.ngnPerUsd,
      2.5,
    );
    const pidRefund = `RFND${randomGenerator(15)}`;

    await prisma.$transaction(async (tx) => {
      const updated = await tx.orders.updateMany({
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
        throw new Error('Order status changed while refund was created.');
      }

      await tx.refund_records.create({
        data: {
          pidRefund,
          pidUser,
          pidOrder,
          amount: String(refundAmountNgn),
          currency: 'NGN',
          refundStatus: 'pending',
          serviceType: 'PROCUREMENT',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    });

    return NextResponse.json({
      statusx: 'SUCCESS',
      message:
        'Your refund was recorded and the order returned for admin processing.',
    });
  } catch (error) {
    console.error('Failed to refund on-hold procurement order:', error);
    return NextResponse.json(
      { statusx: 'FAILED', message: 'Unable to update the order right now.' },
      { status: 500 },
    );
  }
}
