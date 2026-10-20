import { currentUser } from '@/lib/auth/current-user';
import { canSeeFeature } from '@/lib/features/catalog';
import { getAccountCountry, getFeatureRules } from '@/lib/features/server';
import { getActiveIntelligenceSubscription } from '@/lib/intelligence/access';
import { startIntelligencePayPalCheckout } from '@/lib/intelligence/paypalCheckout';
import {
  getIntelligencePayPalCheckout,
  syncIntelligencePayPalSubscription,
  confirmIntelligencePayPalCredits,
} from '@/lib/intelligence/paypalSettlement';
import { enforceReportCheckoutRateLimit } from '@/lib/intelligence/reportCheckoutSecurity';
export async function POST(request: Request) {
  if (
    request.headers.get('origin') !== new URL(request.url).origin ||
    request.headers.get('sec-fetch-site') === 'cross-site'
  )
    return Response.json({ message: 'Invalid origin.' }, { status: 403 });
  const user = await currentUser();
  if (!user)
    return Response.json(
      { message: 'Please sign in to continue.' },
      { status: 401 },
    );
  const body = await request.json().catch(() => null);
  try {
    if (body?.action === 'verify') {
      const checkout = await getIntelligencePayPalCheckout(
        String(body.checkout || ''),
        user.pidUser,
      );
      const result =
        checkout.kind === 'SUBSCRIPTION'
          ? await syncIntelligencePayPalSubscription(checkout)
          : await confirmIntelligencePayPalCredits(checkout, true);
      return Response.json({
        ...result,
        kind: checkout.kind,
        message: result.paid
          ? 'Payment confirmed. Your account has been updated.'
          : 'PayPal is still processing your payment. Please check again shortly.',
      });
    }
    if (!['subscription', 'credits'].includes(body?.action))
      return Response.json(
        { message: 'Invalid checkout request.' },
        { status: 400 },
      );
    const [country, rules] = await Promise.all([
      getAccountCountry(user.pidUser),
      getFeatureRules(),
    ]);
    if (!canSeeFeature('intelligence', country, rules))
      return Response.json(
        { message: 'This service is not available in your country.' },
        { status: 403 },
      );
    if (!country || country === 'Nigeria')
      return Response.json(
        {
          message:
            'Please use the payment option for your country of residence.',
        },
        { status: 400 },
      );
    if (
      !(
        await enforceReportCheckoutRateLimit({ request, email: user.userEmail })
      ).allowed
    )
      return Response.json(
        { message: 'Too many checkout attempts. Please try again later.' },
        { status: 429 },
      );
    const subscription = await getActiveIntelligenceSubscription(user.pidUser);
    const planKey =
      body.action === 'credits'
        ? subscription?.plan === 'starter'
          ? 'starter'
          : 'pro'
        : body.plan;
    if (!['starter', 'pro'].includes(planKey))
      return Response.json(
        { message: 'Choose a valid plan.' },
        { status: 400 },
      );
    return Response.json(
      await startIntelligencePayPalCheckout({
        request,
        user,
        planKey,
        kind: body.action === 'credits' ? 'CREDITS' : 'SUBSCRIPTION',
        quantity: body.quantity,
      }),
    );
  } catch (error) {
    return Response.json(
      {
        message:
          error instanceof Error
            ? error.message
            : 'Unable to process PayPal checkout.',
      },
      { status: 400 },
    );
  }
}
