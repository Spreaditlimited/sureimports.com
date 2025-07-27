import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import randomGenerator from '@/lib/helpers/randomGenerator';
import xMail from '@/lib/email/xMail';
import { AnyAaaaRecord } from 'dns';

export async function POST(request: Request) {
  const {
    transactionId,
    tx_ref,
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

  const paymentID = 'PAY' + randomGenerator(10);

  const createx = await prisma.payments.create({
    data: {
      pidPayment: paymentID,
      pidUser: consumer_id,
      payerName: name,
      txID: transactionId.toString(),
      txRef: tx_ref,
      paymentStatus: 'PENDING',
      paymentType: payment_type,
      currency: currency,
      amount: amount,
      serviceID: service_id,
      serviceName: service_name,
      serviceDescription: description,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  try {
    const response = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        },
      },
    );

    const data = await response.json();

    const user: any = await prisma.users.findUnique({
      where: { pidUser: consumer_id },
    });

    const sourcing: any = await prisma.special_sourcing.findUnique({
      where: { pidSpecialSourcing: service_id },
    });

    if (data.status === 'success') {
      // Payment verified successfully
      // You can update your database or perform any other necessary actions here

      ////////////////////// SEND CUSTOMER PAYMENT RECEIPT EMAIL BLOCK STARTS //////////////////////
      //import { xMail } from '@/lib/email/xMail';
      const xEmail = email;
      const xTitle = `SureImport Receipt`;
      const xBodyTitle = `SureImport Receipt`;
      const xBody1 = `<div>Dear ${user.userFirstname} <br /> We have received the sourcing request you initiated and paid for and would reach out to you shortly to start processing the request.</div><br />`;
      const line1 = `Here are the details you submitted:`;
      // const line2 = `<h4>Product Name: <b>${productName}</b></h4><hr />`;
      const line3 = `<h4>Sourced Order ID: <b>${service_id}</b></h4><hr />`;
      // const line4 = `<h4>Request Order Ref: <b>${reference}</b></h4><hr />`;
      // const line5 = `<h4>Unit Price: <b>₦${productPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b></h4><hr />`;
      // const line6 = `<h4>Quantity Purchased: <b>${quantity}</b></h4><hr />`;
      const line7 = `<h4>Total Amount Paid: <b>₦${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b></h4><hr />`;
      const line8 = `Rest assured that we have started processing your order.<br />
                              If you have any concerns, please, call +234 806 458 3664 or simply reply to this email. <br />
                              Thank you for your patronage.<br /><br />
                              Kind regards,<br />
                              Sureimports.com Team.`;
      const xBody2 =
        //line1 + line2 + line3 + line4 + line5 + line6 + line7 + line8;
        line1 + line3 + line7 + line8;
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
      const xEmailB = 'hello@sureimports.com';
      const xTitleB = `New Store Purchase Successful!`;
      const xBodyTitleB = `Store Purchase Successful!`;
      const xBody1B = `Hi Admin, <br />a special sourcing requested has been initiated and paid for. Here are the details.</b><br />`;
      const line1B = `Here are the details of the order:`;
      // const line2B = `<h4>Product Name: <b>${productName}</b></h4><hr />`;
      const line3B = `<h4>Sourced Order ID: <b>${service_id}</b></h4><hr />`;
      // const line4B = `<h4>Request Order Ref: <b>${reference}</b></h4><hr />`;
      const line5B = `<h4>Unit Price: <b>₦${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b></h4><hr />`;
      // const line6B = `<h4>Quantity Purchased: <b>${quantity}</b></h4><hr />`;
      const line7B = `<h4>Total Amount Paid: <b>₦${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b></h4><hr /><br />`;
      const line8B = `Confirm this payment and start processing the request.  <br />
                          <h4><b>:: CUSTOMER DETAILS ::</b></h4>
                          <h4>Customer Name: <b>${user?.userFirstname + ' ' + user?.userLastname}</b></h4>
                          <h4>Customer Phone: <b>${user?.phone + ',' + user?.userPhone}</b></h4>
                          <h4>Customer Email: <b>${user?.userEmail}</b></h4>
                          <h4>Customer Address: <b>${user?.address}</b></h4>
                          <h4>Customer Shipping Address: <b>${user?.userShippingAddress}</b></h4><br />
                              Kind regards,<br />
                              Sureimports.com Automated System`;
      const xBody2B = line1B + line3B + line5B + line7B + line8B;
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

      const updatex = await prisma.payments.update({
        where: {
          pidUser: consumer_id,
          pidPayment: paymentID,
        },
        data: {
          paymentStatus: 'PAID',
          updatedAt: new Date(),
        },
      });

      if (updatex) {
        return NextResponse.json({
          status: 'success',
          message: 'Payment verified successfully',
        });
      }
    } else {
      return NextResponse.json({
        status: 'error',
        message: 'Payment verification failed',
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({
      status: 'error',
      message: 'An error occurred while verifying the payment',
    });
  }
}
