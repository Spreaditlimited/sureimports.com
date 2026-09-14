import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { refundUser, sameOriginMutation } from '@/lib/refunds/request-auth';
import { refundSettlementQuote } from '@/lib/refunds/money';
import { protectRefundDestination } from '@/lib/refunds/destination';
import { requestOriginalPayPalRefund } from '@/lib/refunds/paypal-settlement';

const destinationSchema = z
  .object({
    accountName: z.string().trim().min(2).max(120),
    bankName: z.string().trim().min(2).max(120),
    accountNumber: z
      .string()
      .trim()
      .regex(/^[A-Z0-9 -]{5,34}$/i),
    bankCode: z.string().trim().min(3).max(34),
    bankCountry: z
      .string()
      .trim()
      .regex(/^[A-Z]{2}$/),
    confirmedOwnAccount: z.literal(true),
  })
  .strict();
type Context = { params: Promise<{ refundId: string }> };

export async function GET(_request: NextRequest, context: Context) {
  const pidUser = await refundUser();
  if (!pidUser)
    return NextResponse.json({ message: 'Please sign in.' }, { status: 401 });
  const { refundId } = await context.params;
  const refund = await prisma.refund_records.findFirst({
    where: { pidRefund: refundId, pidUser },
  });
  if (!refund || !['USD', 'NGN'].includes(refund.currency || ''))
    return NextResponse.json(
      { message: 'Refund not found.' },
      { status: 404 },
    );
  try {
    const settlements = await prisma.$queryRaw<
      Record<string, unknown>[]
    >`SELECT sourceCurrency, sourceAmount, settlementCurrency, settlementAmount, exchangeRate, method, status, reference FROM refund_settlements WHERE refundId=${refundId} AND pidUser=${pidUser}`;
    if (settlements.length)
      return NextResponse.json(
        { settlement: settlements[0] },
        { headers: { 'Cache-Control': 'no-store' } },
      );
    if (refund.refundStatus !== 'pending')
      return NextResponse.json(
        { message: refund.refundStatus === 'requested' ? 'Your earlier request needs a settlement review. Please contact support with this refund reference; do not submit a duplicate request.' : 'This refund is no longer available for a new request.' },
        { status: 409 },
      );
    if (refund.currency === 'NGN') return NextResponse.json({ message: 'Use Request Refund to submit your verified Nigerian bank account, or choose Transfer to Wallet.' });
    const payments = refund.pidOrder
      ? await prisma.payments.findMany({
          where: {
            pidUser,
            serviceID: refund.pidOrder,
            paymentStatus: { in: ['PAID', 'paid', 'success', 'SUCCESS'] },
          },
          select: { paymentType: true },
        })
      : [];
    if (
      payments.length &&
      payments.every((payment) => payment.paymentType === 'PAYPAL')
    ) {
      return NextResponse.json(
        {
          originalPayment: { amount: refund.amount, currency: refund.currency },
          message:
            'Your refund returns through PayPal in the original payment currency. Any GBP conversion is handled by PayPal or your bank.',
        },
        { headers: { 'Cache-Control': 'no-store' } },
      );
    }
    if (
      !payments.length ||
      payments.some((payment) =>
        String(payment.paymentType || '')
          .toUpperCase()
          .includes('PAYPAL'),
      )
    ) {
      return NextResponse.json(
        {
          message:
            'We need to check your original payment before arranging this refund. Please contact support with your refund reference.',
        },
        { status: 409 },
      );
    }
    const user = await prisma.users.findUnique({
      where: { pidUser },
      select: { userCountry: true, country: true },
    });
    const country = String(user?.userCountry || user?.country || '').trim();
    if (!country)
      return NextResponse.json(
        {
          message:
            'Please complete your country in your profile before requesting settlement.',
        },
        { status: 409 },
      );
    const [rates] = await prisma.$queryRaw<
      { exGbpPerUsd: string | null }[]
    >`SELECT exGbpPerUsd FROM exchange_rate WHERE id=1`;
    const quote = refundSettlementQuote({
      amount: refund.amount || '0',
      currency: refund.currency!,
      customerCountry: country,
      gbpPerUsd: rates?.exGbpPerUsd,
    });
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('Refund quotes are unavailable.');
    const quoteToken = jwt.sign({ ...quote, refundId, pidUser }, secret, {
      algorithm: 'HS256',
      audience: 'refund-settlement',
      expiresIn: '30m',
    });
    return NextResponse.json(
      { quote, quoteToken },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    console.error(
      'Refund quote unavailable',
      error instanceof Error ? error.name : 'Error',
    );
    return NextResponse.json(
      {
        message:
          'We could not load your refund details. Refresh this page, or contact support with your refund reference if this continues.',
      },
      { status: 503 },
    );
  }
}

export async function POST(request: NextRequest, context: Context) {
  const pidUser = await refundUser();
  if (!pidUser || !sameOriginMutation(request))
    return NextResponse.json(
      { message: 'Please sign in and try again.' },
      { status: 403 },
    );
  const { refundId } = await context.params;
  try {
    const text = await request.text();
    if (text.length > 8000)
      return NextResponse.json(
        { message: 'Please check the length of your bank details and try again.' },
        { status: 413 },
      );
    const body = JSON.parse(text);
    if (body.method === 'PAYPAL') {
      await requestOriginalPayPalRefund(refundId, pidUser);
      return NextResponse.json({
        message:
          'Your refund request has been received. It will return through PayPal, and we will notify you when it has been processed.',
      });
    }
    const destination = destinationSchema.parse(body.destination);
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('Unavailable');
    const quote = jwt.verify(body.quoteToken, secret, {
      algorithms: ['HS256'],
      audience: 'refund-settlement',
    });
    if (
      typeof quote === 'string' ||
      quote.pidUser !== pidUser ||
      quote.refundId !== refundId ||
      quote.sourceCurrency !== 'USD'
    )
      throw new Error('Invalid quote');
    if (
      quote.settlementCurrency === 'GBP' &&
      (destination.bankCountry !== 'GB' ||
        !/^\d{8}$/.test(destination.accountNumber) ||
        !/^\d{6}$/.test(destination.bankCode.replace(/[- ]/g, '')))
    )
      return NextResponse.json(
        {
          message:
            'For GBP, enter a UK bank account with an 8-digit account number and 6-digit sort code.',
        },
        { status: 400 },
      );
    const ciphertext = protectRefundDestination(destination, refundId);
    await prisma.$transaction(async (tx) => {
      const [refund] = await tx.$queryRaw<
        { amount: string; currency: string; refundStatus: string }[]
      >`SELECT amount,currency,refundStatus FROM refund_records WHERE pidRefund=${refundId} AND pidUser=${pidUser} FOR UPDATE`;
      if (
        !refund ||
        refund.refundStatus !== 'pending' ||
        refund.currency !== quote.sourceCurrency ||
        Number(refund.amount).toFixed(2) !== quote.sourceAmount
      )
        throw new Error('Refund changed');
      await tx.$executeRaw`INSERT INTO refund_settlements (refundId,pidUser,sourceCurrency,sourceAmount,settlementCurrency,settlementAmount,exchangeRate,method,destinationCiphertext) VALUES (${refundId},${pidUser},${quote.sourceCurrency},${quote.sourceAmount},${quote.settlementCurrency},${quote.settlementAmount},${quote.exchangeRate},'BANK',${ciphertext})`;
      await tx.refund_records.update({
        where: { pidRefund: refundId },
        data: { refundStatus: 'requested', updatedAt: new Date() },
      });
    });
    return NextResponse.json({
      message:
        'Refund requested. Your bank details will be reviewed before payment. No transfer has been made yet.',
    });
  } catch (error) {
    const message =
      error instanceof z.ZodError
        ? 'Enter the account holder name, bank, account number, bank code and bank country, and confirm account ownership.'
        : 'The request could not be confirmed. Refresh to check its status before trying again.';
    return NextResponse.json({ message }, { status: 409 });
  }
}
