import { prisma } from '@/lib/prisma';
import xMail from '@/lib/email/xMail';
import randomGenerator from '@/lib/helpers/randomGenerator';
import { getProcurementOrderLifecycle } from '@/lib/procurement/orderLifecycle';
import { NextResponse } from 'next/server';
import { procurementMinimumOrderMessage } from '@/lib/procurement/minimumOrder';

const PAYSTACK_SECRET_KEY = process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY;

const formatAmount = (amount: number, currency: string) => {
  const symbol = currency === 'NGN' ? 'N' : '$';
  return `${symbol}${Number(amount || 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

export async function POST(request: Request) {
  try {
    const {
      reference,
      amount,
      email,
      name,
      phone_number,
      currency,
      payment_type,
      consumer_id,
      service_id,
      service_name,
      description,
    } = await request.json();

    if (!PAYSTACK_SECRET_KEY) {
      return NextResponse.json(
        { status: 'error', message: 'Paystack secret key is not configured' },
        { status: 500 },
      );
    }

    if (!reference || !consumer_id || !service_id) {
      return NextResponse.json(
        { status: 'error', message: 'Missing required payment details' },
        { status: 400 },
      );
    }

    const existingPayment = await prisma.payments.findFirst({
      where: { txRef: reference, paymentStatus: 'PAID' },
    });
    if (existingPayment) {
      return NextResponse.json({
        status: 'success',
        message: 'Payment verified successfully',
      });
    }

    let lifecycle;
    try {
      lifecycle = await getProcurementOrderLifecycle(service_id, consumer_id);
    } catch {
      return NextResponse.json(
        { status: 'error', message: 'Order not found' },
        { status: 404 },
      );
    }

    if (!lifecycle.payment.isPayable) {
      return NextResponse.json(
        { status: 'error', message: 'This order has no payment due.' },
        { status: 400 },
      );
    }

    const requestedAmount = Number(amount || 0);
    const requestedCurrency = String(currency || '').toUpperCase();
    const expectedAmount = lifecycle.payment.due;
    const expectedCurrency = lifecycle.payment.currency;
    const currentOrderStatus = String(lifecycle.order.status || '');

    if (
      currentOrderStatus === 'saved' &&
      expectedCurrency === 'NGN' &&
      expectedAmount < lifecycle.payment.minimumOrderNgn
    ) {
      return NextResponse.json(
        {
          status: 'error',
          message: procurementMinimumOrderMessage(
            lifecycle.payment.minimumOrderNgn,
          ),
        },
        { status: 400 },
      );
    }
    if (
      currentOrderStatus === 'saved' &&
      expectedCurrency === 'USD' &&
      expectedAmount < 200
    ) {
      return NextResponse.json(
        {
          status: 'error',
          message:
            'We cannot process orders below $200 for this destination. Please edit your order before paying.',
        },
        { status: 400 },
      );
    }
    if (
      currentOrderStatus === 'saved' &&
      expectedCurrency === 'USD' &&
      lifecycle.totalMeasurement < 10
    ) {
      return NextResponse.json(
        {
          status: 'error',
          message:
            'We cannot ship orders below 10kg to this destination. Please edit your order before paying.',
        },
        { status: 400 },
      );
    }
    if (expectedCurrency === 'USD' && expectedAmount >= 1000) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Please use bank deposit for orders of $1,000 and above.',
        },
        { status: 400 },
      );
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    const data = await response.json();
    if (!data.status || data.data?.status !== 'success') {
      return NextResponse.json(
        {
          status: 'error',
          message: data.message || 'Payment verification failed',
        },
        { status: 400 },
      );
    }

    const paymentData = data.data;
    const verifiedAmount = Number(paymentData.amount || 0) / 100;
    const paidCurrency = String(paymentData.currency || '').toUpperCase();

    if (
      !Number.isFinite(verifiedAmount) ||
      Math.abs(verifiedAmount - expectedAmount) > 0.01 ||
      paidCurrency !== expectedCurrency ||
      Math.abs(requestedAmount - expectedAmount) > 0.01 ||
      requestedCurrency !== expectedCurrency
    ) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Verified payment amount does not match order amount',
        },
        { status: 400 },
      );
    }

    const paymentID = 'PAY' + randomGenerator(10);
    const user = await prisma.users.findUnique({
      where: { pidUser: consumer_id },
    });
    const targetStatus = lifecycle.payment.nextStatus;
    const shouldUpdateOrderTotals = currentOrderStatus !== 'pay-for-shipping';

    await prisma.$transaction(async (tx) => {
      await tx.payments.create({
        data: {
          pidPayment: paymentID,
          pidUser: consumer_id,
          payerName:
            name ||
            `${user?.userFirstname || ''} ${user?.userLastname || ''}`.trim() ||
            'Customer',
          payerEmail: email || user?.userEmail,
          txID: String(paymentData.id || paymentData.reference || reference),
          txRef: reference,
          paymentStatus: 'PAID',
          paymentType: paymentData.channel || payment_type || 'PAYSTACK',
          currency: expectedCurrency,
          amount: expectedAmount,
          serviceID: service_id,
          serviceName: service_name || 'PROCUREMENT',
          serviceDescription: description || 'General procurement payment',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      if (targetStatus) {
        const updatedOrder = await tx.orders.updateMany({
          where: {
            pidOrder: service_id,
            pidUser: consumer_id,
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
            orderTotalCost: shouldUpdateOrderTotals
              ? lifecycle.snapshot.orderTotalCost
              : undefined,
            orderWeight: shouldUpdateOrderTotals
              ? lifecycle.snapshot.orderWeight
              : undefined,
            orderShippingCost: shouldUpdateOrderTotals
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
      }
    });

    const customerEmail = email || user?.userEmail;
    const displayAmount = formatAmount(expectedAmount, expectedCurrency);

    if (customerEmail) {
      const xEmail = customerEmail;
      const xTitle = 'SureImport Receipt';
      const xBodyTitle = 'SureImport Receipt';
      const xBody1 = `<div>Dear ${user?.userFirstname || 'Customer'} <br /> We have received your procurement payment and would reach out to you shortly to continue processing the request.</div><br />`;
      const xBody2 =
        `Here are the details you submitted:` +
        `<h4>Sourced Order ID: <b>${service_id}</b></h4><hr />` +
        `<h4>Total Amount Paid: <b>${displayAmount}</b></h4><hr />` +
        `Rest assured that we have started processing your order.<br />
          If you have any concerns, please, call +234 806 458 3664 or simply reply to this email. <br />
          Thank you for your patronage.<br /><br />
          Kind regards,<br />
          Sureimports.com Team.`;
      await xMail({
        xEmail,
        xTitle,
        xBodyTitle,
        xBody1,
        xBody2,
        xButtonTitle: 'Go to Dashboard',
        xButtonLink: 'https://sureimports.com/dashboard',
      });
    }

    await xMail({
      xEmail: 'hello@sureimports.com',
      xTitle: 'New Procurement Payment Successful!',
      xBodyTitle: 'Procurement Payment Successful!',
      xBody1:
        'Hi Admin, <br />a procurement payment has been completed. Here are the details.</b><br />',
      xBody2:
        `Here are the details of the order:` +
        `<h4>Sourced Order ID: <b>${service_id}</b></h4><hr />` +
        `<h4>Total Amount Paid: <b>${displayAmount}</b></h4><hr /><br />` +
        `Confirm this payment and continue processing the request.  <br />
          <h4><b>:: CUSTOMER DETAILS ::</b></h4>
          <h4>Customer Name: <b>${`${user?.userFirstname || ''} ${user?.userLastname || ''}`.trim() || name || 'Customer'}</b></h4>
          <h4>Customer Phone: <b>${user?.phone || phone_number || ''},${user?.userPhone || ''}</b></h4>
          <h4>Customer Email: <b>${user?.userEmail || email || ''}</b></h4>
          <h4>Customer Address: <b>${user?.address || ''}</b></h4>
          <h4>Customer Shipping Address: <b>${user?.userShippingAddress || ''}</b></h4><br />
          Kind regards,<br />
          Sureimports.com Automated System`,
      xButtonTitle: 'Go to Admin Dashboard',
      xButtonLink: 'https://admin.sureimports.com/dashboard',
    });

    return NextResponse.json({
      status: 'success',
      message: 'Payment verified successfully',
      nextStatus: targetStatus,
    });
  } catch (error) {
    console.error('Error verifying Paystack procurement payment:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'An error occurred while verifying the payment',
      },
      { status: 500 },
    );
  }
}
