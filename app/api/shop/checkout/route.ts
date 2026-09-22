import { after, NextResponse, NextRequest } from 'next/server';
import { getAttributedReferral } from '@/lib/affiliate/attribution';
import { shopOrigin, shopFailure } from '@/lib/shop/auth';
import { currentUser } from '@/lib/auth/current-user';
import { enforceReportCheckoutRateLimit } from '@/lib/intelligence/reportCheckoutSecurity';
import { ShopError, guestCheckoutInput } from '@/lib/shop/policy';
import {
  createShopCheckout,
  initializeShopPaystack,
  processShopEffects,
} from '@/lib/shop/checkout';
export async function POST(request: NextRequest) {
  let reference: string | undefined;
  try {
    shopOrigin(request);
    const user = await currentUser();
    const body = await request.json();
    if (!user) {
      const guest = guestCheckoutInput.parse(body);
      const limit = await enforceReportCheckoutRateLimit({
        request,
        email: `shop:${guest.contactEmail}`,
      });
      if (!limit.allowed)
        throw new ShopError(
          'Too many checkout attempts. Please try again later.',
          429,
        );
    }
    const referral = await getAttributedReferral(request);
    const row = await createShopCheckout(
      user?.pidUser || '',
      body,
      'PAYSTACK',
      !user,
      referral?.pidReferral,
    );
    reference = row.reference;
    const checkout = await initializeShopPaystack(
      row.reference,
      new URL(request.url).origin,
      Boolean(user && body.dashboard === true),
    );
    if (checkout.status === 'PAID')
      after(() => processShopEffects(checkout.reference));
    return NextResponse.json({
      statusx: 'SUCCESS',
      data: {
        reference: checkout.reference,
        status: checkout.status,
        authorization_url: checkout.authorizationUrl,
        access_code: checkout.accessCode,
      },
    });
  } catch (error) {
    return shopFailure(error, reference);
  }
}
