import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import xMail from '@/lib/email/xMail3';
import randomGenerator from '@/lib/helpers/randomGenerator';

export async function GET(request: NextRequest) {
  try {
    const pidUser = request.nextUrl.searchParams.get('pidUser');
    const pidPaySmallSmall = request.nextUrl.searchParams.get('pidPaySmallSmall');
    const pidProduct = request.nextUrl.searchParams.get('pidProduct');
    const amount = request.nextUrl.searchParams.get('amount');

    // Validate required parameters
    if (!pidUser || !pidPaySmallSmall || !pidProduct || !amount) {
      return NextResponse.json({
        statusx: 'FAILED',
        message: 'Missing required parameters: pidUser, pidPaySmallSmall, pidProduct, and amount are required',
      }, { status: 400 });
    }

    const user: any = await prisma.users.findUnique({
      where: {
        pidUser: pidUser as string,
      },
    });

    if (!user) {
      return NextResponse.json({
        statusx: 'FAILED',
        message: 'User not found. Please contact support for assistance',
      }, { status: 404 });
    }

    // Get Pay Small Small record - use lowercase model name
    const paySmallSmall: any = await prisma.paysmallsmall.findUnique({
      where: {
        pidPaySmallSmall: pidPaySmallSmall as string,
      },
    });

    if (!paySmallSmall) {
      return NextResponse.json({
        statusx: 'FAILED',
        message: 'Pay Small Small record not found',
      }, { status: 404 });
    }

    // Get product details
    const product: any = await prisma.store.findUnique({
      where: {
        pidProduct: pidProduct as string,
      },
    });

    if (!product) {
      return NextResponse.json({
        statusx: 'FAILED',
        message: 'Product not found',
      }, { status: 404 });
    }

    const email = user.userEmail;
    const first_name = user.userFirstname;
    const last_name = user.userLastname;
    const phone = user.phone;

    // Fetch customer data from Paystack API
    console.log('Fetching customer data for email:', email);
    
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.ROOT_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/paystack/get-customer/${encodeURIComponent(email)}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch customer data:', response.statusText);
      return NextResponse.json({
        statusx: 'FAILED',
        message: 'Failed to fetch customer wallet information',
      }, { status: 500 });
    }

    const data = await response.json();
    
    console.log('Customer API Response:', {
      statusx: data.statusx,
      message: data.message,
      hasCustomerDetails: !!data.customerDetails,
      hasTransactionDetails: !!data.transactionDetails,
    });

    // Check if customer exists
    if (data.statusx === 'NO_CUSTOMER') {
      return NextResponse.json({
        statusx: 'NO_CUSTOMER',
        message: 'Customer does not exist. Please contact support for assistance',
      }, { status: 400 });
    }

    if (data.statusx === 'FAILED') {
      return NextResponse.json({
        statusx: 'FAILED',
        message: data.message || 'Failed to retrieve customer information',
      }, { status: 400 });
    }

    const customerDetails = data.customerDetails;
    const transactionDetails = data.transactionDetails;

    // Calculate wallet balance from transaction details
    const walletBalance = transactionDetails?.totalAmount || 0;
    const claimAmount = parseFloat(amount);

    console.log('Wallet Balance:', walletBalance, 'Claim Amount:', claimAmount);

    // Check if user has sufficient funds
    if (walletBalance < claimAmount) {
      return NextResponse.json({
        statusx: 'FAILED',
        message: `Insufficient wallet balance. Current balance: ₦${walletBalance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}, Required: ₦${claimAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
      }, { status: 400 });
    }

    ////////////////// PAYMENT PARAMS STARTS //////////////////////
    const randomValue = randomGenerator(10);
    const pidPayment = 'PAY' + randomValue;
    const txID = 'DEB' + randomValue;
    const txREF = 'REF' + randomValue;
    const serviceID = 'PSS' + randomValue;

    const affiliatePayoutAmount = product.affiliatePayout || 0;
    const affiliatePayoutPercentage = 2.5;
    const superAffiliatePayoutAmount = product.superAffiliatePayout || 0;
    const superAffiliatePayoutPercentage = 0.2;

    const affiliateRefId = user.userAffiliateRef || 'NO_REF';
    ////////////////// PAYMENT PARAMS ENDS //////////////////////

    const pidDebit = `DEB${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    // Use Prisma transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Create Debits Record
      const create_debits = await tx.debits.create({
        data: {
          pidDebit: pidDebit as any,
          pidUser: pidUser as any,
          email: email,
          payerName: `${first_name} ${last_name}`,
          txID: txID,
          txRef: txREF,
          paymentStatus: 'DEBITED',
          amount: claimAmount,
          currency: 'NGN',
          createdAt: new Date(),
        },
      });

      // Create payment record
      const create_payment = await tx.payments.create({
        data: {
          pidPayment: pidPayment,
          pidUser: pidUser as any,
          payerName: `${first_name} ${last_name}` || 'Unknown User',
          payerEmail: email,
          txID: txID,
          txRef: txREF,
          paymentStatus: 'PAID',
          paymentType: 'WALLET_PSS',
          currency: 'NGN',
          amount: claimAmount,
          serviceID: serviceID,
          serviceName: 'PAY_SMALL_SMALL',
          serviceDescription: 'Pay Small Small Claim',

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

      // Update Pay Small Small status to COMPLETED - use lowercase model name
      const update_paySmallSmall = await tx.paysmallsmall.update({
        where: {
          pidPaySmallSmall: pidPaySmallSmall as string,
        },
        data: {
          status: 'COMPLETED',
          updatedAt: new Date(),
        },
      });

      // Create purchase record with ext3 field for Pay Small Small reference
      const create_purchase = await tx.store_sales.create({
        data: {
          pidStore: `SALE${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          pidProduct: pidProduct as string,
          pidUser: pidUser as string,
          product_name: product.productName,
          unit_price: claimAmount.toFixed(2),
          total_price: claimAmount.toFixed(2),
          quantity: '1',
          status: 'COMPLETED',
          ext1: txREF,
          ext2: 'WALLET_PSS',
          //ext3: pidPaySmallSmall,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return { create_debits, create_payment, update_paySmallSmall, create_purchase };
    });

    // If transaction is successful, send emails
    if (result.create_debits) {
      ////////////////////// SEND CUSTOMER EMAIL //////////////////////
      const xEmail_A = email;
      const xTitle_A = `Pay Small Small Claim Successful`;
      const xBodyTitle_A = `Your Product Claim was Successful!`;
      const xBody_A = `Dear ${first_name}, <br />
                            This is to confirm your successful Pay Small Small product claim on <b>sureimports.com</b>.<br /><br />
                            Here are the details: <br />
                            <h4>Transaction Reference: <b>${txREF}</b></h4><hr />
                            <h4>Payment Method: <b>Wallet Payment (Pay Small Small)</b></h4><hr />
                            <h4>Product: <b>${product?.productName}</b></h4><hr />
                            <h4>Amount: <b>₦${claimAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b> (NGN)</h4><hr />
                            <h4>Name: <b>${first_name + ' ' + last_name}</b></h4><hr />
                            <h4>Phone: <b>${phone || 'N/A'}</b></h4><hr />
                            <h4>Email: <b>${email}</b></h4><hr />
                            <h4>Remaining Wallet Balance: <b>₦${(walletBalance - claimAmount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b></h4><hr />
                            <b>Our address for pick up is:</b><br />
                            Sure Imports, 5 Olutosin Ajayi (Martins Adegboyega) Street, Ajao Estate, Lagos, Nigeria. 0806 839 7263.<br /><br />
                            We are open 9am to 5pm weekdays except for public holidays.<br />
                            Thank you for choosing SureImports.<br /><br />
                            Kind regards,<br />
                            <b>Sure Imports Team</b>`;

      await xMail({
        xEmail: xEmail_A,
        xTitle: xTitle_A,
        xBodyTitle: xBodyTitle_A,
        xBody: xBody_A,
      });

      ////////////////////// SEND ADMIN EMAIL //////////////////////
      const xEmail_B = 'hello@sureimports.com';
      const xTitle_B = `Pay Small Small Claim - ${product?.productName}`;
      const xBodyTitle_B = `Pay Small Small Claim Completed!`;
      const xBody_B = `Hi Admin, <br />A Pay Small Small product claim has been completed successfully.<br /><br />
                          Details: <br />
                          <h4>Transaction Reference: <b>${txREF}</b></h4><hr />
                          <h4>Pay Small Small ID: <b>${pidPaySmallSmall}</b></h4><hr />
                          <h4>Product ID: <b>${pidProduct}</b></h4><hr />
                          <h4>Customer name: <b>${first_name + ' ' + last_name}</b></h4><hr />
                          <h4>Phone Number: <b>${phone || 'N/A'}</b></h4><hr />
                          <h4>Product Name: <b>${product?.productName}</b></h4><hr />
                          <h4>Amount: <b>₦${claimAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b> (NGN)</h4><hr />
                          <h4>Address: <b>${user?.address || 'Not provided'}</b></h4><hr />
                          Kind regards,<br />
                          Sureimports.com Automated System`;

      await xMail({
        xEmail: xEmail_B,
        xTitle: xTitle_B,
        xBodyTitle: xBodyTitle_B,
        xBody: xBody_B,
      });

      console.log('Pay Small Small claim processed successfully:', txREF);
      
      return NextResponse.json({
        statusx: 'SUCCESS',
        message: `Product claimed successfully! ₦${claimAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} has been deducted from your wallet. Your new balance is ₦${(walletBalance - claimAmount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
        data: {
          transactionRef: txREF,
          amount: claimAmount,
          productName: product?.productName,
          previousBalance: walletBalance,
          newBalance: walletBalance - claimAmount,
        },
      }, { status: 200 });
    } else {
      return NextResponse.json({
        statusx: 'FAILED',
        message: 'Payment transaction failed. Please try again.',
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Pay Small Small wallet claim error:', error);
    return NextResponse.json({
      statusx: 'FAILED',
      message: 'Internal server error occurred while processing claim',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
