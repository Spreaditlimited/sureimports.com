import { prisma } from '@/lib/prisma';
import xMail from '@/lib/email/xMail';
import randomGenerator from '@/lib/helpers/randomGenerator';
import { NextResponse } from 'next/server';

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
      nextStatus,
      newTotalAmount,
      newTotalWeight,
      newEstimatedTotalShippingCost,
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

    const requestedAmount = Number(amount || 0);
    const requestedCurrency = String(currency || '').toUpperCase();
    const order = await prisma.orders.findFirst({
      where: { pidOrder: service_id, pidUser: consumer_id },
      select: { status: true, destinationCountry: true },
    });

    if (!order) {
      return NextResponse.json(
        { status: 'error', message: 'Order not found' },
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

    if (
      String(order.status || '') === 'saved' &&
      destinationName.includes('nigeria') &&
      (requestedCurrency !== 'NGN' || requestedAmount < 100000)
    ) {
      return NextResponse.json(
        {
          status: 'error',
          message:
            'We cannot process Nigeria-bound procurement orders below ₦100,000. Please edit your order before paying.',
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
    const paidAmount = verifiedAmount || requestedAmount;
    const paidCurrency = String(paymentData.currency || currency || 'NGN');

    if (
      !Number.isFinite(verifiedAmount) ||
      Math.abs(verifiedAmount - requestedAmount) > 0.01 ||
      (requestedCurrency && paidCurrency.toUpperCase() !== requestedCurrency)
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
    const existingPayment = await prisma.payments.findFirst({
      where: { txRef: reference },
    });

    if (existingPayment?.paymentStatus === 'PAID') {
      return NextResponse.json({
        status: 'success',
        message: 'Payment verified successfully',
      });
    }

    const user = await prisma.users.findUnique({
      where: { pidUser: consumer_id },
    });
    const currentOrderStatus = String(order.status || '');
    const targetStatus = String(nextStatus || '');
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
          currency: paidCurrency,
          amount: paidAmount,
          serviceID: service_id,
          serviceName: service_name || 'PROCUREMENT',
          serviceDescription: description || 'General procurement payment',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      if (targetStatus) {
        await tx.orders.update({
          where: { pidOrder: service_id },
          data: {
            status: targetStatus,
            orderTotalCost:
              shouldUpdateOrderTotals && newTotalAmount
                ? String(newTotalAmount)
                : undefined,
            orderWeight:
              shouldUpdateOrderTotals && newTotalWeight
                ? String(newTotalWeight)
                : undefined,
            orderShippingCost:
              shouldUpdateOrderTotals && newEstimatedTotalShippingCost
                ? String(newEstimatedTotalShippingCost)
                : undefined,
            updatedAt: new Date(),
          },
        });
      }
    });

    const customerEmail = email || user?.userEmail;
    const displayAmount = formatAmount(paidAmount, paidCurrency);

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
