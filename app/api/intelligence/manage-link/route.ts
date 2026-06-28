import { NextResponse } from 'next/server';

import { checkAuth } from '@/lib/auth/checkAuth';
import { getActiveIntelligenceSubscription } from '@/lib/intelligence/access';
import { generatePaystackManageLink } from '@/lib/intelligence/paystack';

export async function POST() {
  const user = await checkAuth();

  if (!user?.pidUser) {
    return NextResponse.json({ message: 'Login required.' }, { status: 401 });
  }

  const subscription = await getActiveIntelligenceSubscription(user.pidUser);

  if (!subscription) {
    return NextResponse.json(
      { message: 'No active Supplier Intelligence subscription found.' },
      { status: 404 },
    );
  }

  if (!subscription.paystackSubscriptionCode) {
    return NextResponse.json(
      { message: 'This subscription is not linked to Paystack management yet.' },
      { status: 400 },
    );
  }

  const manageLink = await generatePaystackManageLink(
    subscription.paystackSubscriptionCode,
  );

  if (!manageLink) {
    return NextResponse.json(
      { message: 'Unable to generate Paystack management link.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ manageLink });
}
