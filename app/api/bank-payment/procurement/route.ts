import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import xMail from '@/lib/email/xMail2';
import { getProcurementOrderLifecycle } from '@/lib/procurement/orderLifecycle';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const pidUser = String(formData.get('pidUser') || '');
    const email = String(formData.get('userEmail') || '');
    const pidBankPayment = String(formData.get('pidBankPayment') || '');
    const requestedUsdAmount = Number(formData.get('amount') || 0);
    const requestedNairaAmount = Number(formData.get('amountNaira') || 0);
    const bank = String(formData.get('bank') || '');
    const depositor = String(formData.get('depositor') || '').trim();
    const serviceID = String(formData.get('serviceID') || '');
    const serviceDescription = String(
      formData.get('serviceDescription') ||
        'Pay for General Procurement Service',
    );

    if (!pidUser || !email || !serviceID || !pidBankPayment) {
      return NextResponse.json(
        { statusx: 'ACTION_FAILED', message: 'Missing payment details.' },
        { status: 400 },
      );
    }

    if (!bank || !depositor) {
      return NextResponse.json(
        {
          statusx: 'EMPTY_BANK_PAYMENT_DETAILS',
          message: 'Bank payment details cannot be empty',
        },
        { status: 400 },
      );
    }

    const user = await prisma.users.findFirst({
      where: { pidUser, userEmail: email },
    });
    if (!user) {
      return NextResponse.json(
        {
          statusx: 'ACTION_FAILED',
          message:
            'Action failed. You may need to sign in again or contact support.',
        },
        { status: 401 },
      );
    }

    let lifecycle;
    try {
      lifecycle = await getProcurementOrderLifecycle(serviceID, pidUser);
    } catch {
      return NextResponse.json(
        { statusx: 'ACTION_FAILED', message: 'Order not found.' },
        { status: 404 },
      );
    }

    if (!lifecycle.payment.isPayable) {
      return NextResponse.json(
        { statusx: 'ACTION_FAILED', message: 'This order has no payment due.' },
        { status: 400 },
      );
    }

    const currentStatus = String(lifecycle.order.status || '');
    const expectedAmount = lifecycle.payment.due;
    const expectedCurrency = lifecycle.payment.currency;
    const requestedAmount =
      expectedCurrency === 'NGN'
        ? requestedNairaAmount
        : requestedUsdAmount;

    if (
      !Number.isFinite(requestedAmount) ||
      Math.abs(requestedAmount - expectedAmount) > 0.01
    ) {
      return NextResponse.json(
        {
          statusx: 'ORDER_AMOUNT_CHANGED',
          message:
            'The order amount changed. Return to the order, refresh it and try again.',
        },
        { status: 409 },
      );
    }

    if (
      currentStatus === 'saved' &&
      expectedCurrency === 'NGN' &&
      expectedAmount < 100000
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
    if (
      currentStatus === 'saved' &&
      expectedCurrency === 'USD' &&
      expectedAmount < 200
    ) {
      return NextResponse.json(
        {
          statusx: 'MINIMUM_ORDER_AMOUNT',
          message:
            'We cannot process orders below $200 for this destination. Please edit your order before paying.',
        },
        { status: 400 },
      );
    }
    if (
      currentStatus === 'saved' &&
      expectedCurrency === 'USD' &&
      lifecycle.totalMeasurement < 10
    ) {
      return NextResponse.json(
        {
          statusx: 'MINIMUM_ORDER_AMOUNT',
          message:
            'We cannot ship orders below 10kg to this destination. Please edit your order before paying.',
        },
        { status: 400 },
      );
    }

    const pendingStatus =
      currentStatus === 'pay-for-shipping'
        ? 'bank-pending-shipping-orders'
        : currentStatus === 'saved' || currentStatus === 'on-hold'
          ? 'bank-pending-saved-orders'
          : '';
    if (!pendingStatus) {
      return NextResponse.json(
        {
          statusx: 'ACTION_FAILED',
          message: 'This order is not awaiting a bank payment.',
        },
        { status: 409 },
      );
    }

    const shouldFreezeEstimate = currentStatus !== 'pay-for-shipping';
    await prisma.$transaction(async (tx) => {
      await tx.bank_payment.create({
        data: {
          pidUser,
          pidOrder: serviceID,
          pidBankPayment,
          pidBank: bank,
          amount: String(expectedAmount),
          currency: expectedCurrency,
          depositorName: depositor,
          trxNumber: pidBankPayment,
          serviceType: pendingStatus,
          bankStatus: 'PENDING',
          ext1: serviceDescription,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      const updatedOrder = await tx.orders.updateMany({
        where: { pidUser, pidOrder: serviceID, status: currentStatus },
        data: {
          orderTotalCostOld: lifecycle.order.orderTotalCost,
          orderWeightOld: lifecycle.order.orderWeight,
          orderShippingCostOld: lifecycle.order.orderShippingCost,
          orderTotalCost: shouldFreezeEstimate
            ? lifecycle.snapshot.orderTotalCost
            : undefined,
          orderWeight: shouldFreezeEstimate
            ? lifecycle.snapshot.orderWeight
            : undefined,
          orderShippingCost: shouldFreezeEstimate
            ? lifecycle.snapshot.orderShippingCost
            : undefined,
          vat: shouldFreezeEstimate ? lifecycle.snapshot.vat : undefined,
          serviceCharge: shouldFreezeEstimate
            ? lifecycle.snapshot.serviceCharge
            : undefined,
          exchangeRate1: shouldFreezeEstimate
            ? lifecycle.snapshot.exchangeRate1
            : undefined,
          exchangeRate2: shouldFreezeEstimate
            ? lifecycle.snapshot.exchangeRate2
            : undefined,
          exchangeRate3: shouldFreezeEstimate
            ? lifecycle.snapshot.exchangeRate3
            : undefined,
          status: pendingStatus,
          updatedAt: new Date(),
        },
      });
      if (updatedOrder.count !== 1) {
        throw new Error('Order status changed while payment was submitted.');
      }
    });

    try {
      await xMail({
        xEmail: email,
        xTitle: 'Bank payment verification pending',
        xBodyTitle: 'Payment Pending Verification',
        xBody1: `Dear ${user.userFirstname || 'Customer'},<br />Thank you for making a bank payment to the Procurement service with ID: <b>${serviceID}</b>.<br />Your payment is currently being verified by our team. You may check your dashboard for progress.<br /><br />Best regards,<br /><br /><b>- SureImports Processing Team</b><br />`,
        xBody2: '',
        xButtonTitle: '',
        xButtonLink: '',
      });
    } catch (error) {
      console.error('Failed to send bank payment email:', error);
    }

    return NextResponse.json(
      { statusx: 'SUCCESS', message: 'Bank details uploaded successfully!' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Procurement bank payment submission failed:', error);
    return NextResponse.json(
      {
        statusx: 'ACTION_FAILED',
        message: 'Unable to submit bank payment details right now.',
      },
      { status: 500 },
    );
  }
}
