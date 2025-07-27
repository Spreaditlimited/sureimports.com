// app/api/paystack-payment/verify-payment/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import xMail from '@/lib/email/xMail3';

const PAYSTACK_SECRET_KEY = process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY;

export async function POST(request: Request) {
  try {
    const {
      reference,
      pidUser,
      pidStore,
      pidPayment,

      email,
      amount,
      pidProduct,
      productPrice,
      productName,
      quantity,
      currency,
      serviceID,
      serviceName,
      serviceDescription,
    } = await request.json();

    if (!reference) {
      return NextResponse.json(
        { message: 'Reference is required' },
        { status: 400 },
      );
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    const data = await response.json();

    if (!data.status) {
      return NextResponse.json(
        {
          status: false,
          message: data.message || 'Payment verification failed',
        },
        { status: 400 },
      );
    }

    const paymentData = data.data;

    // Here you can:
    // 1. Save the payment details to your database
    // 2. Update order status
    // 3. Send confirmation emails, etc.

    // const user = await prisma.users.findUnique({
    //   where: { pidUser: pidUser },
    // });pidStore

    await prisma.store_sales_faya.update({
      where: { pidStore: pidStore },
      data: {
        status: 'PAID',
        updatedAt: new Date(),
      },
    });

    const store = await prisma.store_sales_faya.findUnique({
      where: { pidStore: pidStore },
    });

    console.log(
      'Full Name: ' + store?.fullName + ' Address: ' + store?.address,
    );

    const payment = await prisma.payments.update({
      where: { pidPayment: pidPayment },
      data: {
        paymentStatus: 'PAID',
        paymentType: paymentData.channel,
        updatedAt: new Date(),
      },
    });

    //MAIL FOR : Pay and Pick up
    if (store?.deliveryOption == 'Pay before Delivery') {
      ////////////////////// SEND CUSTOMER PAYMENT RECEIPT EMAIL BLOCK STARTS //////////////////////
      //import { xMail } from '@/lib/email/xMail';
      const xEmail_A = email; //hello@sureimports.com
      const xTitle_A = `Thank you for your order`;
      const xBodyTitle_A = `FAYA 60W PD cable Purchase Successful!`;
      const xBody_A = `Dear ${store?.fullName}, <br />
                        This is to confirm your order on the <b>sureimports.com</b> website.<br />
                        Here are the details of your order: <br />
                        <h4>Order type: <b>${store?.deliveryOption} | (${store?.purchaseType})</b></h4><hr />
                        <h4>Product: <b>${store?.product_name}</b></h4><hr />
                        <h4>Quantity: <b>${quantity}</b></h4><hr />
                        <h4>Name: <b>${store?.fullName}</b></h4><hr />
                        <h4>Phone: <b>${store?.phone}</b></h4><hr />
                        <h4>Email: <b>${email}</b></h4><hr />
                        <h4>Delivery Address: <b>${store?.address}</b></h4><hr />
                        This order will be delivered by <b>Fez Logistics</b>, our logistics partners. Please, expect a call from them.<br />
                        Thank you once more for choosing the <b>FAYA 60W PD</b> Cable.<br /><br />
                        Kind regards,<br />
                        <b>Sure Imports Team</b>`;
      await xMail({
        xEmail: xEmail_A,
        xTitle: xTitle_A,
        xBodyTitle: xBodyTitle_A,
        xBody: xBody_A,
      });
      ////////////////////// SEND PAYMENT RECEIPT EMAIL BLOCK STARTS //////////////////////
    }

    //MAIL FOR : Pay and Pick up
    if (store?.deliveryOption == 'Pay and Pick up') {
      ////////////////////// SEND CUSTOMER PAYMENT RECEIPT EMAIL BLOCK STARTS //////////////////////
      //import { xMail } from '@/lib/email/xMail';
      const xEmail_A = email; //hello@sureimports.com
      const xTitle_A = `Thank you for your order`;
      const xBodyTitle_A = `FAYA 60W PD cable Purchase Successful!`;
      const xBody_A = `Dear ${store?.fullName}, <br />
                            This is to confirm your order on the <b>sureimports.com</b> website.<br /><br />
                            Here are the details of your order: <br />
                            <h4>Order type: <b>${store?.deliveryOption} | (${store?.purchaseType})</b></h4><hr />
                            <h4>Product: <b>${store?.product_name}</b></h4><hr />
                            <h4>Quantity: <b>${quantity}</b></h4><hr />
                            <h4>Name: <b>${store?.fullName}</b></h4><hr />
                            <h4>Phone: <b>${store?.phone}</b></h4><hr />
                            <h4>Email: <b>${email}</b></h4><hr />
                            <b>Our address for pick up is:</b><br />
                            Sure Imports, 5 Olutosin Ajayi (Martins Adegboyega) Street, Ajao Estate, Lagos, Nigeria. 0806 839 7263.<br /><br />
                            We are open 9am to 5pm weekdays except for public holidays.<br />
                            Thank you once more for choosing the FAYA 60W PD Cable.<br /><br />
                            Kind regards,<br />
                            <b>Sure Imports Team</b>`;
      await xMail({
        xEmail: xEmail_A,
        xTitle: xTitle_A,
        xBodyTitle: xBodyTitle_A,
        xBody: xBody_A,
      });
      ////////////////////// SEND PAYMENT RECEIPT EMAIL BLOCK STARTS //////////////////////
    }

    ////////////////////// SEND ADMIN PAYMENT EMAIL BLOCK STARTS //////////////////////
    //import { xMail } from '@/lib/email/xMail';
    const xEmail_B = 'hello@sureimports.com';
    const xTitle_B = `New Store Purchase Successful!`;
    const xBodyTitle_B = `FAYA 60W PD cable Purchase Successful!`;
    const xBody_B = `Hi Admin, <br />A FAYA charging cable order has been completed successfully on sureimports.com shop.</b><br />
                        Here are the details of the order: <br />
                        <h4>Order ID: <b>${serviceID}</b></h4><hr />
                        <h4>Order Type: <b>${store?.deliveryOption} | (${store?.purchaseType})</b></h4><hr />
                        <h4>Customer name: <b>${store?.fullName}</b></h4><hr />
                        <h4>Phone Number: <b>${store?.phone}</b></h4><hr />
                        <h4>Product Name: <b>${store?.product_name}</b></h4><hr />
                        <h4>Quantity: <b>${quantity}</b></h4><hr />
                        <h4>Address: <b>${store?.address}</b></h4><hr />
                        Kind regards,<br />
                        Sureimports.com Automated System`;

    await xMail({
      xEmail: xEmail_B,
      xTitle: xTitle_B,
      xBodyTitle: xBodyTitle_B,
      xBody: xBody_B,
    });
    ////////////////////// SEND ADMIN PAYMENT EMAIL BLOCK STARTS //////////////////////

    return NextResponse.json({
      status: true,
      message: 'Payment verified successfully',
      data: paymentData,
      paymentMethod: paymentData.channel,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      {
        status: false,
        message: 'An error occurred while verifying payment',
      },
      { status: 500 },
    );
  }
}

// Optionally add other HTTP methods with proper responses
export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}
