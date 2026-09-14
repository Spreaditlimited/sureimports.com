import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import randomGenerator from '@/lib/helpers/randomGenerator';
import { getProcurementOrderLifecycle } from '@/lib/procurement/orderLifecycle';
import { procurementRefund } from '@/lib/refunds/money';
import { refundUser, sameOriginMutation } from '@/lib/refunds/request-auth';
import { productPrincipalUsd, productRetentionRatio } from '@/lib/refunds/components';

export async function POST(request: NextRequest) {
  const authenticatedUser = await refundUser();
  if (!authenticatedUser || !sameOriginMutation(request)) return NextResponse.json({ message: 'Please sign in and try again.' }, { status: 403 });
  const pidUser = request.nextUrl.searchParams.get('pidUser');
  const pidOrder = request.nextUrl.searchParams.get('pidOrder');
  if (pidUser !== authenticatedUser) return NextResponse.json({ message: 'Order not found.' }, { status: 404 });
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
    const refund = procurementRefund(
      refundBeforeFeeUsd,
      lifecycle.destinationCountry,
      lifecycle.rates.ngnPerUsd,
      2.5,
    );
    const pidRefund = `RFND${randomGenerator(15)}`;
    const previousProductUsd = productPrincipalUsd(
      String(lifecycle.order.orderTotalCost || '0'),
      String(lifecycle.order.orderShippingCost || '0'),
      String(lifecycle.order.serviceCharge || '0'),
      String(lifecycle.order.vat || '0'),
    );
    const componentSnapshot = JSON.stringify({ version: 1, productRetentionRatio: productRetentionRatio(previousProductUsd, lifecycle.productsTotalUsd), previousProductUsd, productUsd: lifecycle.productsTotalUsd, refundBeforeFeeUsd });

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
          amount: refund.amount,
          currency: refund.currency,
          ext1: 'ORDER_ADJUSTMENT',
          ext2: componentSnapshot,
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
