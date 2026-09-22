import { after, NextResponse } from 'next/server';
import { shopUser, shopFailure } from '@/lib/shop/auth';
import {
  createShopCheckout,
  finalizeShopCheckout,
  processShopEffects,
} from '@/lib/shop/checkout';
export async function POST(request: Request) {
  let reference: string | undefined;
  try {
    const user = await shopUser(request, true);
    const row = await createShopCheckout(
      user.pidUser,
      await request.json(),
      'WALLET',
    );
    reference = row.reference;
    const checkout = await finalizeShopCheckout(row.reference);
    after(() => processShopEffects(checkout.reference));
    return NextResponse.json({
      statusx: 'SUCCESS',
      data: {
        transactionRef: checkout.reference,
        reference: checkout.reference,
        status: checkout.status,
      },
    });
  } catch (error) {
    return shopFailure(error, reference);
  }
}
