import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import randomGenerator from '@/lib/helpers/randomGenerator';
import { recordWalletDebit } from '@/lib/walletLedger';
import { getProcurementOrderLifecycle } from '@/lib/procurement/orderLifecycle';

const formatNaira = (value: number) =>
  value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pidUser, pidOrder, amount } = body || {};

    if (!pidUser || !pidOrder || !amount) {
      return NextResponse.json(
        {
          statusx: 'FAILED',
          message: 'pidUser, pidOrder and amount are required',
        },
        { status: 400 },
      );
    }

    const requestedAmount = Number(amount);
    if (!Number.isFinite(requestedAmount) || requestedAmount <= 0) {
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

    let lifecycle;
    try {
      lifecycle = await getProcurementOrderLifecycle(
        String(pidOrder),
        String(pidUser),
      );
    } catch {
      return NextResponse.json(
        { statusx: 'FAILED', message: 'Order not found' },
        { status: 404 },
      );
    }

    if (lifecycle.payment.currency !== 'NGN') {
      return NextResponse.json(
        {
          statusx: 'UNSUPPORTED_DESTINATION',
          message: 'Wallet payment is only available for Nigeria-bound orders.',
        },
        { status: 400 },
      );
    }

    if (!lifecycle.payment.isPayable) {
      return NextResponse.json(
        { statusx: 'FAILED', message: 'This order has no payment due.' },
        { status: 400 },
      );
    }

    const payAmount = lifecycle.payment.due;
    if (Math.abs(requestedAmount - payAmount) > 0.01) {
      return NextResponse.json(
        {
          statusx: 'ORDER_AMOUNT_CHANGED',
          message:
            'The order amount changed. Refresh the order and try again.',
          meta: { requiredAmount: payAmount },
        },
        { status: 409 },
      );
    }

    if (
      String(lifecycle.order.status || '') === 'saved' &&
      payAmount < 100000
    ) {
      return NextResponse.json(
        {
          statusx: 'MINIMUM_ORDER_AMOUNT',
          message:
            'We cannot process Nigeria-bound procurement orders below ₦100,000. Please edit your order before paying.',
        },
        { status: 400 },
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.ROOT_URL ||
      'http://localhost:3000';
    let walletData: {
      statusx?: string;
      transactionDetails?: { totalAmount?: number | string };
    } | null = null;
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
    } catch {
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

    const walletBalance = Number(
      walletData?.transactionDetails?.totalAmount || 0,
    );
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
    const fullName =
      `${user.userFirstname || ''} ${user.userLastname || ''}`.trim() ||
      'Customer';
    const currentOrderStatus = String(lifecycle.order.status || '');
    const targetStatus = lifecycle.payment.nextStatus;
    const shouldUpdateOrderTotals = currentOrderStatus !== 'pay-for-shipping';
    const pidDebit = `DEB${randomGenerator(12)}`;

    await prisma.$transaction(async (tx) => {
      await tx.debits.create({
        data: {
          pidDebit,
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

      await recordWalletDebit(tx, {
        pidUser: String(pidUser),
        userEmail: user.userEmail,
        userFirstname: user.userFirstname,
        userLastname: user.userLastname,
      }, {
        amount: payAmount,
        reference: `DEBIT:${pidDebit}`,
        description: 'General procurement payment via wallet',
        currency: 'NGN',
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

      const updatedOrder = await tx.orders.updateMany({
        where: {
          pidOrder: String(pidOrder),
          pidUser: String(pidUser),
          status: currentOrderStatus,
        },
        data: {
          status: targetStatus,
          orderTotalCostOld:
            currentOrderStatus === 'on-hold'
              ? lifecycle.order.orderTotalCost
              : undefined,
          orderWeightOld:
            currentOrderStatus === 'on-hold'
              ? lifecycle.order.orderWeight
              : undefined,
          orderShippingCostOld:
            currentOrderStatus === 'on-hold'
              ? lifecycle.order.orderShippingCost
              : undefined,
          orderTotalCost:
            shouldUpdateOrderTotals
              ? lifecycle.snapshot.orderTotalCost
              : undefined,
          orderWeight:
            shouldUpdateOrderTotals
              ? lifecycle.snapshot.orderWeight
              : undefined,
          orderShippingCost:
            shouldUpdateOrderTotals
              ? lifecycle.snapshot.orderShippingCost
              : undefined,
          vat: shouldUpdateOrderTotals ? lifecycle.snapshot.vat : undefined,
          serviceCharge: shouldUpdateOrderTotals
            ? lifecycle.snapshot.serviceCharge
            : undefined,
          exchangeRate1: shouldUpdateOrderTotals
            ? lifecycle.snapshot.exchangeRate1
            : undefined,
          exchangeRate2: shouldUpdateOrderTotals
            ? lifecycle.snapshot.exchangeRate2
            : undefined,
          exchangeRate3: shouldUpdateOrderTotals
            ? lifecycle.snapshot.exchangeRate3
            : undefined,
          updatedAt: new Date(),
        },
      });
      if (updatedOrder.count !== 1) {
        throw new Error('Order status changed while payment was processing.');
      }
    });

    return NextResponse.json({
      statusx: 'SUCCESS',
      message: 'Wallet payment successful.',
      nextStatus: targetStatus,
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
