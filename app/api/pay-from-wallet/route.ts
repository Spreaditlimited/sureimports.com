import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import xMail from '@/lib/email/xMail3';
import randomGenerator from '@/lib/helpers/randomGenerator';

export async function GET(request: NextRequest) {
  try {
    const pidUser = request.nextUrl.searchParams.get('pidUser');
    const pidProduct = request.nextUrl.searchParams.get('pidProduct');
    const amount = request.nextUrl.searchParams.get('amount');
    const quantity = request.nextUrl.searchParams.get('quantity') || '1';

    // Validate required parameters
    if (!pidUser || !pidProduct || !amount) {
      return NextResponse.json({
        statusx: 'FAILED',
        message: 'Missing required parameters: pidUser, pidProduct, and amount are required',
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
    
    // Get the full URL for the API call
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

    // Check if customer data fetch failed
    if (data.statusx === 'FAILED') {
      return NextResponse.json({
        statusx: 'FAILED',
        message: data.message || 'Failed to retrieve customer information',
      }, { status: 400 });
    }

    // Extract customer and transaction details
    const customerDetails = data.customerDetails;
    const transactionDetails = data.transactionDetails;

    // Calculate wallet balance from transaction details
    const walletBalance = transactionDetails?.totalAmount || 0;
    const purchaseAmount = parseFloat(amount);

    console.log('Wallet Balance:', walletBalance, 'Purchase Amount:', purchaseAmount);

    // Check if user has sufficient funds
    if (walletBalance < purchaseAmount) {
      return NextResponse.json({
        statusx: 'FAILED',
        message: `Insufficient wallet balance. Current balance: ₦${walletBalance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}, Required: ₦${purchaseAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
      }, { status: 400 });
    }

    ////////////////// PAYMENT PARAMS STARTS //////////////////////
    const randomValue = randomGenerator(10);
    const pidPayment = 'PAY' + randomValue;
    const txID = 'DEB' + randomValue;
    const txREF = 'REF' + randomValue;
    const serviceID = 'STORE' + randomValue;

    const affiliatePayoutAmount = product.affiliatePayout || 0;
    const affiliatePayoutPercentage = 2.5; // hard coded
    const superAffiliatePayoutAmount = product.superAffiliatePayout || 0;
    const superAffiliatePayoutPercentage = 0.2; // hard coded

    const affiliateRefId = user.userAffiliateRef || 'NO_REF';
    ////////////////// PAYMENT PARAMS ENDS //////////////////////

    // Create a random 10 digit reference for the pidDebit
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
          amount: purchaseAmount,
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
          paymentType: 'WALLET',
          currency: 'NGN',
          amount: purchaseAmount,
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

      // Create purchase record
      const create_purchase = await tx.store_sales.create({
        data: {
          pidStore: `SALE${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          pidProduct: pidProduct as string,
          pidUser: pidUser as string,
          product_name: product.productName,
          unit_price: (purchaseAmount / parseInt(quantity)).toFixed(2),
          total_price: purchaseAmount.toFixed(2),
          quantity: quantity.toString(),
          status: 'COMPLETED',
          ext1: txREF, // Store transaction reference
          ext2: 'WALLET', // Store payment method
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return { create_debits, create_payment, create_purchase };
    });

    // If transaction is successful, send emails
    if (result.create_debits) {
      ////////////////////// SEND CUSTOMER PAYMENT RECEIPT EMAIL BLOCK STARTS //////////////////////
      const xEmail_A = email;
      const xTitle_A = `Payment Successful - Purchase Confirmation`;
      const xBodyTitle_A = `Your Purchase was Successful!`;
      const xBody_A = `Dear ${first_name}, <br />
                            This is to confirm your successful payment on the <b>sureimports.com</b> website.<br /><br />
                            Here are the details of your order: <br />
                            <h4>Transaction Reference: <b>${txREF}</b></h4><hr />
                            <h4>Payment Method: <b>Wallet Payment</b></h4><hr />
                            <h4>Order type: <b>Store Purchase</b></h4><hr />
                            <h4>Product: <b>${product?.productName}</b></h4><hr />
                            <h4>Quantity: <b>${quantity}</b></h4><hr />
                            <h4>Amount: <b>₦${purchaseAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b> (NGN)</h4><hr />
                            <h4>Name: <b>${first_name + ' ' + last_name}</b></h4><hr />
                            <h4>Phone: <b>${phone || 'N/A'}</b></h4><hr />
                            <h4>Email: <b>${email}</b></h4><hr />
                            <h4>Remaining Wallet Balance: <b>₦${(walletBalance - purchaseAmount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b></h4><hr />
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
      ////////////////////// SEND CUSTOMER PAYMENT RECEIPT EMAIL BLOCK ENDS //////////////////////

      ////////////////////// SEND ADMIN PAYMENT EMAIL BLOCK STARTS //////////////////////
      const xEmail_B = 'hello@sureimports.com';
      //const xEmail_B = 'atsuemmanuel@gmail.com';
      const xTitle_B = `New Wallet Purchase - ${product?.productName}`;
      const xBodyTitle_B = `Wallet Purchase Successful!`;
      const xBody_B = `Hi Admin, <br />A wallet purchase has been completed successfully on sureimports.com.<br /><br />
                          Here are the details of the order: <br />
                          <h4>Transaction Reference: <b>${txREF}</b></h4><hr />
                          <h4>Product ID: <b>${pidProduct}</b></h4><hr />
                          <h4>Payment Method: <b>Wallet Payment</b></h4><hr />
                          <h4>Customer name: <b>${first_name + ' ' + last_name}</b></h4><hr />
                          <h4>Phone Number: <b>${phone || 'N/A'}</b></h4><hr />
                          <h4>Product Name: <b>${product?.productName}</b></h4><hr />
                          <h4>Quantity: <b>${quantity}</b></h4><hr />
                          <h4>Amount: <b>₦${purchaseAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b> (NGN)</h4><hr />
                          <h4>Address: <b>${user?.address || 'Not provided'}</b></h4><hr />
                          Kind regards,<br />
                          Sureimports.com Automated System`;

      await xMail({
        xEmail: xEmail_B,
        xTitle: xTitle_B,
        xBodyTitle: xBodyTitle_B,
        xBody: xBody_B,
      });
      ////////////////////// SEND ADMIN PAYMENT EMAIL BLOCK ENDS //////////////////////

      console.log('Payment processed successfully:', txREF);
      
      return NextResponse.json({
        statusx: 'SUCCESS',
        message: `Payment successful! ₦${purchaseAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} has been deducted from your wallet. Your new balance is ₦${(walletBalance - purchaseAmount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
        data: {
          transactionRef: txREF,
          amount: purchaseAmount,
          quantity: parseInt(quantity),
          productName: product?.productName,
          previousBalance: walletBalance,
          newBalance: walletBalance - purchaseAmount,
        },
      }, { status: 200 });
    } else {
      return NextResponse.json({
        statusx: 'FAILED',
        message: 'Payment transaction failed. Please try again.',
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Pay from wallet error:', error);
    return NextResponse.json({
      statusx: 'FAILED',
      message: 'Internal server error occurred while processing payment',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
