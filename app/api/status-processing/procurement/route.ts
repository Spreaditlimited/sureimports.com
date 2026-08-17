import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import randomGenerator from '@/lib/helpers/randomGenerator';
import xMail from '@/lib/email/xMail2';
import { getProcurementOrderLifecycle } from '@/lib/procurement/orderLifecycle';
import { refundAmountInNgn } from '@/lib/procurement/shippingMath';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const pidUser = String(formData.get('pidUser') || '');
    const pidOrder = String(formData.get('pidOrder') || '');
    const newStatus = String(formData.get('newStatus') || '');

    if (!pidUser || !pidOrder || newStatus !== 'in-transit') {
      return NextResponse.json(
        { statusx: 'ACTION_FAILED', message: 'Invalid order transition.' },
        { status: 400 },
      );
    }

    const user = await prisma.users.findUnique({ where: { pidUser } });
    if (!user) {
      return NextResponse.json(
        { statusx: 'ACTION_FAILED', message: 'Customer account not found.' },
        { status: 404 },
      );
    }

    const lifecycle = await getProcurementOrderLifecycle(pidOrder, pidUser);
    if (lifecycle.order.status !== 'pay-for-shipping') {
      return NextResponse.json(
        {
          statusx: 'ACTION_FAILED',
          message: 'Order status changed. Refresh and try again.',
        },
        { status: 409 },
      );
    }
    if (lifecycle.costDifferenceUsd > 0.01) {
      return NextResponse.json(
        {
          statusx: 'ACTION_FAILED',
          message: 'The outstanding shipping balance must be paid first.',
        },
        { status: 409 },
      );
    }

    const refundAmountNgn =
      lifecycle.costDifferenceUsd < -0.01
        ? refundAmountInNgn(
            Math.abs(lifecycle.costDifferenceUsd),
            lifecycle.rates.ngnPerUsd,
          )
        : 0;

    await prisma.$transaction(async (tx) => {
      const updated = await tx.orders.updateMany({
        where: { pidUser, pidOrder, status: 'pay-for-shipping' },
        data: { status: 'in-transit', updatedAt: new Date() },
      });
      if (updated.count !== 1) {
        throw new Error('Order status changed while it was being updated.');
      }

      if (refundAmountNgn > 0) {
        await tx.refund_records.create({
          data: {
            pidRefund: `RFND${randomGenerator(15)}`,
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
      }
    });

    try {
      await Promise.all([
        xMail({
          xEmail: 'hello@sureimports.com',
          xTitle: 'An Order has been moved to In-Transit',
          xBodyTitle: 'Customer Order has been moved to In-Transit',
          xBody1: `${user.userFirstname || 'A customer'} moved order <b>${pidOrder}</b> to <b>In-Transit</b>.`,
          xBody2: '',
          xButtonTitle: '',
          xButtonLink: '',
        }),
        ...(refundAmountNgn > 0 && user.userEmail
          ? [
              xMail({
                xEmail: user.userEmail,
                xTitle: 'Refund Initiated',
                xBodyTitle: 'Refund has been initiated for your order',
                xBody1: `A refund of <b>₦${refundAmountNgn.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b> has been initiated for order <b>${pidOrder}</b>.`,
                xBody2: '',
                xButtonTitle: '',
                xButtonLink: '',
              }),
            ]
          : []),
      ]);
    } catch (error) {
      console.error('Failed to send procurement transition email:', error);
    }

    return NextResponse.json({
      statusx: 'SUCCESS',
      message:
        refundAmountNgn > 0
          ? 'Order moved to In-Transit and the refund was initiated.'
          : 'Order moved to In-Transit.',
    });
  } catch (error) {
    console.error('Procurement customer transition failed:', error);
    return NextResponse.json(
      { statusx: 'ACTION_FAILED', message: 'Unable to update the order.' },
      { status: 500 },
    );
  }
}
