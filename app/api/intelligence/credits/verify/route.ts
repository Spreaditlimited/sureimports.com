import { NextResponse } from 'next/server';

import xMail from '@/lib/email/xMail';
import { prisma } from '@/lib/prisma';
import {
  grantIntelligenceCredits,
  getOrCreateIntelligenceCreditAccount,
} from '@/lib/intelligence/credits';
import { getActiveIntelligenceSubscription } from '@/lib/intelligence/access';
import { getConfiguredIntelligencePlan } from '@/lib/intelligence/plans';
import { verifyPaystackTransaction } from '@/lib/intelligence/paystack';

const PAYSTACK_SECRET_KEY = process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY;
const CREDIT_QUANTITIES = new Set([1, 3, 5, 10]);

function formatNairaFromKobo(amountKobo: number) {
  return `₦${Math.round(amountKobo / 100).toLocaleString('en-NG')}`;
}

async function sendCreditPurchaseEmail(input: {
  pidUser: string;
  quantity: number;
  balance: number;
  amountKobo: number;
  reference: string;
}) {
  const user = await prisma.users.findUnique({
    where: { pidUser: input.pidUser },
    select: {
      userFirstname: true,
      userLastname: true,
      userEmail: true,
      email: true,
    },
  });

  const email = user?.userEmail || user?.email;
  if (!email) return;

  const firstName = String(user?.userFirstname || '').trim();
  const displayName =
    [user?.userFirstname, user?.userLastname]
      .map((value) => String(value || '').trim())
      .filter(Boolean)
      .join(' ') || 'there';

  await xMail({
    xEmail: email,
    xTitle: 'Supplier search credits added',
    xBodyTitle: `Your supplier search credits are ready${firstName ? `, ${firstName}` : ''}`,
    xBody1: `
      Hello ${displayName},<br /><br />
      Your payment was successful and <b>${input.quantity}</b> supplier search credit${
        input.quantity === 1 ? ' has' : 's have'
      } been added to your Sure Imports account.
      <br /><br />
      <b>Amount paid:</b> ${formatNairaFromKobo(input.amountKobo)}<br />
      <b>New credit balance:</b> ${input.balance}<br />
      <b>Payment reference:</b> ${input.reference}
    `,
    xBody2:
      'You can now return to Supplier Intelligence and use your credits to request fresh supplier research.',
    xButtonTitle: 'Open Supplier Intelligence',
    xButtonLink: 'https://www.sureimports.com/dashboard/intelligence',
  });
}

export async function POST(request: Request) {
  const { reference } = await request.json().catch(() => ({ reference: '' }));
  const paymentReference = String(reference || '').trim();

  if (!paymentReference) {
    return NextResponse.json(
      { message: 'Payment reference is required.' },
      { status: 400 },
    );
  }

  if (!paymentReference.startsWith('SI_INTEL_CREDITS_')) {
    return NextResponse.json(
      { message: 'This payment reference is not for supplier search credits.' },
      { status: 400 },
    );
  }

  if (!PAYSTACK_SECRET_KEY) {
    return NextResponse.json(
      { message: 'Paystack secret key is not configured.' },
      { status: 500 },
    );
  }

  const payment = await verifyPaystackTransaction(paymentReference);
  if (!payment || payment.status !== 'success') {
    return NextResponse.json(
      { message: 'Payment verification failed.' },
      { status: 400 },
    );
  }

  const metadata = payment.metadata || {};
  if (metadata.product !== 'supplier_intelligence_search_credits') {
    return NextResponse.json(
      { message: 'This payment is not for supplier search credits.' },
      { status: 400 },
    );
  }

  const pidUser = String(metadata.pidUser || '').trim();
  const quantity = Math.round(Number(metadata.quantity || 0));

  if (!pidUser || !CREDIT_QUANTITIES.has(quantity)) {
    return NextResponse.json(
      { message: 'Credit payment metadata is invalid.' },
      { status: 400 },
    );
  }

  const subscription = await getActiveIntelligenceSubscription(pidUser);
  const plan = await getConfiguredIntelligencePlan(subscription?.plan || 'pro');
  const expectedAmountKobo =
    Math.max(1, Math.round(plan.extraCreditPriceNaira)) * quantity * 100;
  const paidAmountKobo = Math.round(Number(payment.amount || 0));

  if (paidAmountKobo < expectedAmountKobo) {
    return NextResponse.json(
      { message: 'Paid amount is lower than the credit package price.' },
      { status: 400 },
    );
  }

  const creditsGranted = await grantIntelligenceCredits({
    pidUser,
    amount: quantity,
    reason: 'extra_search_credits_purchase',
    reference: payment.reference || paymentReference,
  });

  const account = await getOrCreateIntelligenceCreditAccount(pidUser);
  const balance = account?.balance || 0;

  if (creditsGranted) {
    try {
      await sendCreditPurchaseEmail({
        pidUser,
        quantity,
        balance,
        amountKobo: paidAmountKobo,
        reference: payment.reference || paymentReference,
      });
    } catch (error) {
      console.error('Failed to send supplier credit purchase email:', error);
    }
  }

  return NextResponse.json({
    status: true,
    creditsAdded: creditsGranted ? quantity : 0,
    alreadyProcessed: !creditsGranted,
    balance,
  });
}
