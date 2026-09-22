import { after, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hasShopGuestAccess, shopFailure } from '@/lib/shop/auth';
import { currentUser } from '@/lib/auth/current-user';
import { ShopError } from '@/lib/shop/policy';
import { verifyShopCheckout, processShopEffects } from '@/lib/shop/checkout';
export async function GET(request: Request) {
  try {
    const user = await currentUser();
    const reference = new URL(request.url).searchParams.get('reference') || '';
    const owned = await prisma.shop_checkouts.findUnique({
      where: { reference },
    });
    const guestAccess =
      owned &&
      hasShopGuestAccess(
        owned.guestTokenHash,
        request.headers.get('x-shop-checkout-token'),
      );
    if (owned && !guestAccess && (!user || owned.pidUser !== user.pidUser))
      throw new ShopError(
        'Sign in to view this order, or return using the browser where you made payment.',
        401,
      );
    if (!owned) {
      if (!user) throw new ShopError('Sign in to check your order.', 401);
      const payment = await prisma.payments.findFirst({
        where: {
          txRef: reference,
          pidUser: user.pidUser,
          paymentStatus: 'PAID',
          serviceName: { in: ['SHOP', 'SURESTORE'] },
        },
      });
      const orders =
        payment &&
        (await prisma.store_sales.count({
          where: { ext1: reference, pidUser: user.pidUser },
        }));
      if (payment && orders)
        return NextResponse.json(
          {
            statusx: 'SUCCESS',
            data: {
              reference,
              status: 'PAID',
              amount: payment.amount,
              shippingAddress: payment.paymentExt1,
            },
          },
          { headers: { 'Cache-Control': 'no-store' } },
        );
      throw new ShopError(
        'We could not find a confirmed order for this reference. If you paid, contact support with your payment reference.',
        404,
      );
    }
    const row = await verifyShopCheckout(reference);
    if (row.status === 'PAID') after(() => processShopEffects(reference));
    return NextResponse.json(
      {
        statusx: row.status === 'PAID' ? 'SUCCESS' : 'PENDING',
        message:
          row.status === 'PAID'
            ? 'Order confirmed.'
            : 'Payment has not been confirmed. Do not pay again if you have already been charged.',
        data: {
          reference,
          status: row.status,
          amount: row.amountMinor / 100,
          shippingAddress: row.shippingAddress,
          items: row.items,
          guestCheckout: Boolean(row.guestTokenHash),
        },
      },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    return shopFailure(error);
  }
}
