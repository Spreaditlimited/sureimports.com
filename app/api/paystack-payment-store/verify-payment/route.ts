// app/api/paystack-payment/verify-payment/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import xMail from '@/lib/email/xMail';

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

    // console.log(
    //   '========pidStore & pidUser: ' +
    //     pidStore +
    //     pidUser +
    //     ' =========ref: ' +
    //     reference,
    // );

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

    // console.log(
    //   '========pidStore: ' + pidStore + ' =========paymentData: ' + pidPayment,
    // );

    const store = await prisma.store_sales_faya.update({
      where: { pidStore: pidStore },
      data: {
        status: 'PAID',
        updatedAt: new Date(),
      },
    });

    //console.log('Full Name: ' + store.fullName + ' Address: ' + store.address);

    const payment = await prisma.payments.update({
      where: { pidPayment: pidPayment },
      data: {
        paymentStatus: 'PAID',
        paymentType: paymentData.channel,
        updatedAt: new Date(),
      },
    });

    // console.log(
    //   '===  GOT TO THIS STAGE WITH DATA ===' + JSON.stringify(paymentData),
    // );

    ////////////////////// SEND CUSTOMER PAYMENT RECEIPT EMAIL BLOCK STARTS //////////////////////
    //import { xMail } from '@/lib/email/xMail';
    const xEmail = email;
    const xTitle = `SureImport Receipt`;
    const xBodyTitle = `SureImport FAYA 60W PD cable Receipt`;
    const xBody1 = `This is to confirm your order on the  <b>Sureimports.com website. </b><br />
    This order will be delivered by Fez Logistics, our logistics partners. Please, expect a call from them. <br />
    `;
    const line1 = `Here are the details of your order:`;
    const line2 = `<h4>Product Name: <b>${productName}</b></h4><hr />`;
    const line3 = `<h4>Order ID: <b>${serviceID}</b></h4><hr />`;
    const line4 = `<h4>Request Order Ref: <b>${reference}</b></h4><hr />`;
    const line5 = `<h4>Unit Price: <b>₦${productPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b></h4><hr />`;
    const line6 = `<h4>Quantity Purchased: <b>${quantity}</b></h4><hr />`;
    const line7 = `<h4>Total Amount Paid: <b>₦${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b></h4><hr />`;
    const line8 = `Rest assured that we have started processing your order. You should expect your order in our Lagos office within 10 business days.<br />
                        If you have any concerns, please, call +234 806 458 3664 or simply reply to this email. <br />
                        Thank you once more for choosing the FAYA 60W PD Cable.<br /><br />
                        Kind regards,<br />
                        Sureimports.com Team.`;
    const xBody2 =
      line1 + line2 + line3 + line4 + line5 + line6 + line7 + line8;
    const xButtonTitle = `Go to Dashboard`;
    const xButtonLink = `https://sureimports.com/dashboard`;
    await xMail({
      xEmail,
      xTitle,
      xBodyTitle,
      xBody1,
      xBody2,
      xButtonTitle,
      xButtonLink,
    });
    ////////////////////// SEND PAYMENT RECEIPT EMAIL BLOCK STARTS //////////////////////

    ////////////////////// SEND ADMIN PAYMENT RECEIPT EMAIL BLOCK STARTS //////////////////////
    //import { xMail } from '@/lib/email/xMail';
    const xEmailB = 'atsuemmanuel@gmail.com'; //hello@sureimports.com
    const xTitleB = `New Store Purchase Successful!`;
    const xBodyTitleB = `FAYA 60W PD cable Purchase Successful!`;
    const xBody1B = `Hi Admin, <br />A FAYA charging cable order has been completed successfully on sureimports.com shop.</b><br />`;
    const line1B = `Here are the details of the order:`;
    const line2B = `<h4>Product Name: <b>${productName}</b></h4><hr />`;
    const line3B = `<h4>Order ID: <b>${serviceID}</b></h4><hr />`;
    const line4B = `<h4>Request Order Ref: <b>${reference}</b></h4><hr />`;
    const line5B = `<h4>Unit Price: <b>₦${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b></h4><hr />`;
    const line6B = `<h4>Quantity Purchased: <b>${quantity}</b></h4><hr />`;
    const line7B = `<h4>Total Amount Paid: <b>₦${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b></h4><hr />`;
    const line8B = `<br />Log into your admin account to view more details and to start processing the order. <br />
                    <h4><b>:: CUSTOMER DETAILS ::</b></h4>
                    <h4>Customer Name: <b>${store.fullName}</b></h4>
                    <h4>Customer Phone: <b>${store.phone}</b></h4>
                    <h4>Customer Email: <b>${email}</b></h4>
                    <h4>Customer Order Type: <b>${store.purchaseType} </b></h4><br />
                    <h4>Customer Delivery Type: <b>${store.deliveryOption}</b></h4><br />
                    <h4>Customer Delivery Location: <b>${store.deliveryLocation}</b></h4>
                    <h4>Customer Address: <b>${store.address}</b></h4><br />
                        Kind regards,<br />
                        Sureimports.com Automated System`;
    const xBody2B =
      line1B + line2B + line3B + line4B + line5B + line6B + line7B + line8B;
    const xButtonTitleB = `Go to Admin Dashboard`;
    const xButtonLinkB = `https://admin.sureimports.com/dashboard`;
    await xMail({
      xEmail: xEmailB,
      xTitle: xTitleB,
      xBodyTitle: xBodyTitleB,
      xBody1: xBody1B,
      xBody2: xBody2B,
      xButtonTitle: xButtonTitleB,
      xButtonLink: xButtonLinkB,
    });
    ////////////////////// SEND PAYMENT RECEIPT EMAIL BLOCK STARTS //////////////////////

    pidPayment;

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
