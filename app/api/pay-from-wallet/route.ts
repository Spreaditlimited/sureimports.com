import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import xMail from '@/lib/email/xMail3';
import randomGenerator from '@/lib/helpers/randomGenerator';

export async function GET(request: NextRequest) {
  const pidUser = request.nextUrl.searchParams.get('pidUser');
  //const pidPaySmallSmall = request.nextUrl.searchParams.get('pidPaySmallSmall');
  const pidProduct = request.nextUrl.searchParams.get('pidProduct');
  const amount = request.nextUrl.searchParams.get('amount');

  const user: any = await prisma.users.findUnique({
    where: {
      pidUser: pidUser as string | undefined,
    },
    // select: {
    //   countryName: true,
    // },
  });

  //get product details
  const product: any = await prisma.store.findUnique({
    where: {
      pidProduct: pidProduct as string | undefined,
    },
    // select: {
    //   countryName: true,
    // },
  });


  const email = user.userEmail;
  const first_name = user.userFirstname;
  const last_name = user.userLastname;
  const phone = user.phone;

  // check if user exist
  if (user) {
    //console.log('User found:', user);
    //return NextResponse.json({ user });
  } else {
    return NextResponse.json(
      {
        statusx: 'FAILED',
        message: 'Please contact support for assistance',
      },
      { status: 200 },
    );
  }

  ////////////////// PAYMENT PARAMS STARTS //////////////////////
  const randomValue = randomGenerator(10);
  const pidPayment = 'PAY' + randomValue;
  const txID = 'DEB' + randomValue;
  const txREF = 'REF' + randomValue;
  const serviceID = 'STORE' + randomValue;

  const affiliatePayoutAmount = product.affiliatePayout;
  const affiliatePayoutPercentage = 2.5; //hard coded
  const superAffiliatePayoutAmount = product.superAffiliatePayout;
  const superAffiliatePayoutPercentage = 0.2; //hard coded

  const affiliateRefId = user.affiliateRefId;
  ////////////////// PAYMENT PARAMS ENDS //////////////////////


  //create a random 10 digit reference for the pidDebit
  const pidDebit = `DEB${Math.floor(1000000000 + Math.random() * 9000000000)}`; // Generate a random 10-digit number


    // Create Debits Record
    const create_debits = await prisma.debits.create({
      data: { 
        pidDebit: pidDebit as any,
        pidUser: pidUser as any,
        email: email,
        payerName: `${first_name} ${last_name}`,
        txID: txID, // Generate a random 6-digit number
        txRef: txREF, // Generate a random 6-digit number
        paymentStatus: 'DEBITED',
        amount: parseFloat(amount as string),
        currency: 'NGN',
       },
    });



    // If debit creation is successful, create payment record and send emails
    if (create_debits) {

    // Create payment record
    await prisma.payments.create({
      data: {
        pidPayment: pidPayment,
        pidUser: pidUser as any,
        payerName: `${first_name} ${last_name}` || 'Unknown User',
        payerEmail: email,
        txID: txID,
        txRef: txREF,
        paymentStatus: 'PAID',
        paymentType: 'UNKNOWN',
        currency: 'NGN',
        amount: parseFloat(amount as string),
        serviceID: serviceID,
        serviceName: 'SURESTORE',
        serviceDescription: 'Online Purchase',

        affiliate_payout_amount: affiliatePayoutAmount,
        affiliate_payout_percentage: affiliatePayoutPercentage,
        superAffiliate_payout_amount: superAffiliatePayoutAmount,
        superAffiliate_payout_percentage: superAffiliatePayoutPercentage,

        affiliatePayStatus: 'pending',
        affiliateRefId: affiliateRefId || 'NO_REF',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
      

      const product: any = await prisma.store.findUnique({
        where: {
          pidProduct: pidProduct as string | undefined,
        },
        // select: {
        //   countryName: true,
        // },
      });



     ////////////////////// SEND CUSTOMER PAYMENT RECEIPT EMAIL BLOCK STARTS //////////////////////
      //import { xMail } from '@/lib/email/xMail';
      const xEmail_A = email; //hello@sureimports.com
      const xTitle_A = `Thank you for placing an order`;
      const xBodyTitle_A = `Your Purchase was Successful!`;
      const xBody_A = `Dear ${first_name}, <br />
                            This is to confirm your Payment on the <b>sureimports.com</b> website.<br /><br />
                            Here are the details of your order: <br />
                            <h4>Order type: <b>Store Purchase</b></h4><hr />
                            <h4>Product: <b>${product?.productName}</b></h4><hr />
                            <h4>Quantity: <b>${1}</b></h4><hr />
                            <h4>Amount: <b>N${amount}</b> (NGN)</h4><hr />
                            <h4>Name: <b>${first_name+' '+last_name}</b></h4><hr />
                            <h4>Phone: <b>${user.phone}</b></h4><hr />
                            <h4>Email: <b>${email}</b></h4><hr />
                            <b>Our address for pick up is:</b><br />
                            Sure Imports, 5 Olutosin Ajayi (Martins Adegboyega) Street, Ajao Estate, Lagos, Nigeria. 0806 839 7263.<br /><br />
                            We are open 9am to 5pm weekdays except for public holidays.<br />
                            Thank you once more for choosing the SureImports Pay Small Small.<br /><br />
                            Kind regards,<br />
                            <b>Sure Imports Team</b>`;
      await xMail({
        xEmail: xEmail_A,
        xTitle: xTitle_A,
        xBodyTitle: xBodyTitle_A,
        xBody: xBody_A,
      });
      ////////////////////// SEND PAYMENT RECEIPT EMAIL BLOCK STARTS //////////////////////
    




      ////////////////////// SEND ADMIN PAYMENT EMAIL BLOCK STARTS //////////////////////
      //import { xMail } from '@/lib/email/xMail';
      const xEmail_B = 'hello@sureimports.com';
      const xTitle_B = `New Pay from Wallet Purchase Successful!`;
      const xBodyTitle_B = `Pay from Wallet Purchase Successful!`;
      const xBody_B = `Hi Admin, <br />A Pay from wallet order has been completed successfully on sureimports.com shop.</b><br />
                          Here are the details of the order: <br />
                          <h4>Order ID: <b>${pidProduct}</b></h4><hr />
                          <h4>Order Type: <b>Pay Small Small</b></h4><hr />
                          <h4>Customer name: <b>${first_name+' '+last_name}</b></h4><hr />
                          <h4>Phone Number: <b>${user?.phone}</b></h4><hr />
                          <h4>Product Name: <b>${product?.productName}</b></h4><hr />
                          <h4>Quantity: <b>${product?.quantity}</b></h4><hr />
                          <h4>Amount: <b>N${product?.amount}</b> (NGN)</h4><hr />
                          <h4>Address: <b>${user?.address}</b></h4><hr />
                          Kind regards,<br />
                          Sureimports.com Automated System`;

    await xMail({
      xEmail: xEmail_B,
      xTitle: xTitle_B,
      xBodyTitle: xBodyTitle_B,
      xBody: xBody_B,
    });
    ////////////////////// SEND ADMIN PAYMENT EMAIL BLOCK STARTS //////////////////////




      
      console.log('Deleted successfully');
      return NextResponse.json(
       {
         statusx: 'SUCCESS',
         message: 'Payment was Successful',
       },
       { status: 200 },
      );
    } else {
      //console.log('Failed to delete');
      return NextResponse.json(
        {
          statusx: 'FAILED',
          message: 'Payment was not Successful',
        },
        { status: 200 },
      );
    }



}
