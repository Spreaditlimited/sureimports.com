import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import randomGenerator from '@/lib/helpers/randomGenerator';

const formatNaira = (value: number) =>
  value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      pidUser,
      pidOrder,
      amount,
      nextStatus,
      newTotalAmount,
      newTotalWeight,
      newEstimatedTotalShippingCost,
    } = body || {};

    if (!pidUser || !pidOrder || !amount) {
      return NextResponse.json(
        { statusx: 'FAILED', message: 'pidUser, pidOrder and amount are required' },
        { status: 400 },
      );
    }

    const payAmount = Number(amount);
    if (!Number.isFinite(payAmount) || payAmount <= 0) {
      return NextResponse.json(
        { statusx: 'FAILED', message: 'Invalid amount' },
        { status: 400 },
      );
    }

    const user = await prisma.users.findUnique({
      where: { pidUser: String(pidUser) },
    });
    if (!user?.userEmail) {
      return NextResponse.json(
        { statusx: 'FAILED', message: 'User not found' },
        { status: 404 },
      );
    }

    const order = await prisma.orders.findFirst({
      where: { pidOrder: String(pidOrder), pidUser: String(pidUser) },
    });
    if (!order) {
      return NextResponse.json(
        { statusx: 'FAILED', message: 'Order not found' },
        { status: 404 },
      );
    }

    const destinationCountry = order.destinationCountry
      ? await prisma.country.findUnique({
          where: { pidCountry: String(order.destinationCountry) },
          select: { countryName: true },
        })
      : null;
    const destinationName = String(
      destinationCountry?.countryName || order.destinationCountry || '',
    )
      .trim()
      .toLowerCase();
    if (!destinationName.includes('nigeria')) {
      return NextResponse.json(
        {
          statusx: 'UNSUPPORTED_DESTINATION',
          message:
            'Wallet payment is only available for Nigeria-bound orders.',
        },
        { status: 400 },
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.ROOT_URL ||
      'http://localhost:3000';
    let walletData: any = null;
    try {
      const walletCheck = await fetch(
        `${baseUrl}/api/paystack/get-customer/${encodeURIComponent(user.userEmail)}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json' } },
      );
      if (!walletCheck.ok) {
        return NextResponse.json(
          {
            statusx: 'FAILED',
            message:
              'Unable to verify wallet balance right now. Please try again in a moment.',
          },
          { status: 502 },
        );
      }
      walletData = await walletCheck.json();
    } catch (walletError) {
      return NextResponse.json(
        {
          statusx: 'FAILED',
          message:
            'Unable to verify wallet balance right now. Please check your connection and try again.',
        },
        { status: 502 },
      );
    }

    if (walletData?.statusx !== 'WALLET_READY') {
      return NextResponse.json(
        { statusx: 'NO_WALLET', message: 'Please activate your wallet first.' },
        { status: 400 },
      );
    }

    const walletBalance = Number(walletData?.transactionDetails?.totalAmount || 0);
    if (walletBalance < payAmount) {
      const shortfall = Number((payAmount - walletBalance).toFixed(2));
      return NextResponse.json(
        {
          statusx: 'INSUFFICIENT_WALLET_BALANCE',
          message: `Insufficient wallet balance. Current balance: ₦${formatNaira(walletBalance)}. Required: ₦${formatNaira(payAmount)}. Please add ₦${formatNaira(shortfall)} to continue.`,
          meta: {
            walletBalance,
            requiredAmount: payAmount,
            shortfall,
          },
        },
        { status: 400 },
      );
    }

    const txRef = `PROCWAL${randomGenerator(10)}`;
    const txID = `PROCWALTX${randomGenerator(10)}`;
    const fullName = `${user.userFirstname || ''} ${user.userLastname || ''}`.trim() || 'Customer';
    const targetStatus = String(nextStatus || 'pending');

    await prisma.$transaction(async (tx) => {
      await tx.debits.create({
        data: {
          pidDebit: `DEB${randomGenerator(12)}`,
          pidUser: String(pidUser),
          email: user.userEmail as string,
          payerName: fullName,
          txID,
          txRef,
          paymentStatus: 'DEBITED',
          paymentType: 'WALLET',
          currency: 'NGN',
          amount: payAmount,
          serviceID: String(pidOrder),
          serviceName: 'PROCUREMENT',
          serviceDescription: 'General procurement payment via wallet',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      await tx.payments.create({
        data: {
          pidPayment: `PAY${randomGenerator(12)}`,
          pidUser: String(pidUser),
          payerName: fullName,
          payerEmail: user.userEmail,
          txID,
          txRef,
          paymentStatus: 'PAID',
          paymentType: 'WALLET',
          currency: 'NGN',
          amount: payAmount,
          serviceID: String(pidOrder),
          serviceName: 'PROCUREMENT',
          serviceDescription: 'General procurement wallet payment',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      await tx.orders.update({
        where: { pidOrder: String(pidOrder) },
        data: {
          status: targetStatus,
          orderTotalCost: newTotalAmount ? String(newTotalAmount) : undefined,
          orderWeight: newTotalWeight ? String(newTotalWeight) : undefined,
          orderShippingCost: newEstimatedTotalShippingCost
            ? String(newEstimatedTotalShippingCost)
            : undefined,
          updatedAt: new Date(),
        },
      });
    });

    return NextResponse.json({
      statusx: 'SUCCESS',
      message: 'Wallet payment successful.',
    });
  } catch (error) {
    console.error('Procurement wallet payment failed:', error);
    return NextResponse.json(
      {
        statusx: 'FAILED',
        message:
          error instanceof Error
            ? error.message
            : 'Unable to complete wallet payment right now. Please try again.',
      },
      { status: 500 },
    );
  }
}
