import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import randomGenerator from '@/lib/helpers/randomGenerator';
import xMail from '@/lib/email/xMail2';
import { getProcurementOrderLifecycle } from '@/lib/procurement/orderLifecycle';
import { procurementRefund } from '@/lib/refunds/money';
import { refundUser, sameOriginMutation } from '@/lib/refunds/request-auth';

export async function POST(request: Request) {
  try {
    const authenticatedUser = await refundUser();
    if (!authenticatedUser || !sameOriginMutation(request)) return NextResponse.json({ message: 'Please sign in and try again.' }, { status: 403 });
    const formData = await request.formData();
    const pidUser = String(formData.get('pidUser') || '');
    const pidOrder = String(formData.get('pidOrder') || '');
    const newStatus = String(formData.get('newStatus') || '');
    if (pidUser !== authenticatedUser) return NextResponse.json({ message: 'Order not found.' }, { status: 404 });

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

    const refund =
      lifecycle.costDifferenceUsd < -0.01
        ? procurementRefund(
            Math.abs(lifecycle.costDifferenceUsd),
            lifecycle.destinationCountry,
            lifecycle.rates.ngnPerUsd,
          )
        : null;

    await prisma.$transaction(async (tx) => {
      const updated = await tx.orders.updateMany({
        where: { pidUser, pidOrder, status: 'pay-for-shipping' },
        data: { status: 'in-transit', updatedAt: new Date() },
      });
      if (updated.count !== 1) {
        throw new Error('Order status changed while it was being updated.');
      }

      if (refund && Number(refund.amount) > 0) {
        await tx.refund_records.create({
          data: {
            pidRefund: `RFND${randomGenerator(15)}`,
            pidUser,
            pidOrder,
            amount: refund.amount,
            currency: refund.currency,
            ext1: 'SHIPPING_ADJUSTMENT',
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
        ...(refund && Number(refund.amount) > 0 && user.userEmail
          ? [
              xMail({
                xEmail: user.userEmail,
                xTitle: 'Refund Initiated',
                xBodyTitle: 'Refund has been initiated for your order',
                xBody1: `A refund of <b>${refund.currency} ${refund.amount}</b> has been recorded for order <b>${pidOrder}</b>. Open Refunds in your dashboard to request settlement.`,
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
        refund && Number(refund.amount) > 0
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
