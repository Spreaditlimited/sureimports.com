/**
 * ============================================================================
 * SHOP PAYMENT API - WALLET PAYMENT
 * ============================================================================
 *
 * Purpose: Process wallet payment and create order records
 *
 * Order Status Management:
 * - Initial Status: "PAID" (set after successful wallet deduction)
 * - Status Flow: PAID → PROCESSING → SHIPPED → DELIVERED → COMPLETED
 * - Admin updates status through order management interface (to be implemented)
 *
 * Related Files:
 * - Database Schema: prisma/schema.prisma (store_sales model)
 * - Paystack Payment: app/api/shop/payment/verify/route.ts
 * - My Orders Page: app/dashboard/orders/page.tsx
 *
 * Admin Integration:
 * - TODO: Create /api/admin/orders/update-status endpoint
 * - TODO: Create admin order management UI
 * ============================================================================
 */

import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import randomGenerator from '@/lib/helpers/randomGenerator';
import xMail from '@/lib/email/xMail3';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pidUser, cartItems, totalAmount } = body;

    // Validate required parameters
    if (!pidUser || !cartItems || !totalAmount) {
      return NextResponse.json(
        {
          statusx: 'FAILED',
          message:
            'Missing required parameters: pidUser, cartItems, and totalAmount are required',
        },
        { status: 400 },
      );
    }

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        {
          statusx: 'FAILED',
          message: 'Cart is empty. Please add items to cart before checkout',
        },
        { status: 400 },
      );
    }

    // Get user details
    const user: any = await prisma.users.findUnique({
      where: {
        pidUser: pidUser as string,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          statusx: 'FAILED',
          message: 'User not found. Please contact support for assistance',
        },
        { status: 404 },
      );
    }

    const email = user.userEmail;
    const first_name = user.userFirstname;
    const last_name = user.userLastname;
    const phone = user.phone;

    // Fetch customer wallet data from Paystack API
    console.log('Fetching customer wallet data for email:', email);

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.ROOT_URL ||
      'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/paystack/get-customer/${encodeURIComponent(email)}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(
        'Failed to fetch customer wallet data:',
        response.statusText,
      );
      return NextResponse.json(
        {
          statusx: 'FAILED',
          message: 'Failed to fetch customer wallet information',
        },
        { status: 500 },
      );
    }

    const data = await response.json();

    console.log('Customer API Response:', {
      statusx: data.statusx,
      message: data.message,
      hasCustomerDetails: !!data.customerDetails,
      hasTransactionDetails: !!data.transactionDetails,
    });

    // Check if customer exists
    if (data.statusx === 'NO_CUSTOMER' || data.statusx === 'NO_ACCOUNT') {
      return NextResponse.json(
        {
          statusx: 'NO_ACCOUNT',
          message:
            'Wallet not activated. Please activate your wallet to use this payment method.',
        },
        { status: 400 },
      );
    }

    // Check if customer data fetch failed
    if (data.statusx === 'FAILED') {
      return NextResponse.json(
        {
          statusx: 'FAILED',
          message: data.message || 'Failed to retrieve wallet information',
        },
        { status: 400 },
      );
    }

    // Extract customer and transaction details
    const customerDetails = data.customerDetails;
    const transactionDetails = data.transactionDetails;

    // Calculate wallet balance from transaction details
    const walletBalance = transactionDetails?.totalAmount || 0;

    // Calculate purchase amount server-side to ensure accuracy (accounting for quantity)
    const calculatedPurchaseAmount = cartItems.reduce(
      (total: number, item: any) => {
        const itemTotal =
          parseFloat(item.productPrice) * parseInt(item.quantity || 1);
        return total + itemTotal;
      },
      0,
    );

    // Use calculated amount instead of trusting frontend value
    const purchaseAmount = calculatedPurchaseAmount;

    // Log for verification
    console.log(
      'Wallet Balance:',
      walletBalance,
      'Purchase Amount (Calculated):',
      purchaseAmount,
      'Frontend Total:',
      totalAmount,
    );

    // Verify frontend calculation matches server calculation (with small tolerance for floating point)
    const frontendTotal = parseFloat(totalAmount.toString());
    if (Math.abs(frontendTotal - purchaseAmount) > 0.01) {
      console.warn('Frontend total mismatch:', {
        frontend: frontendTotal,
        calculated: purchaseAmount,
        difference: Math.abs(frontendTotal - purchaseAmount),
      });
    }

    // Check if user has sufficient funds
    if (walletBalance < purchaseAmount) {
      return NextResponse.json(
        {
          statusx: 'INSUFFICIENT_FUNDS',
          message: `Insufficient wallet balance. Current balance: ₦${walletBalance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}, Required: ₦${purchaseAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
          data: {
            walletBalance: walletBalance,
            requiredAmount: purchaseAmount,
            shortfall: purchaseAmount - walletBalance,
          },
        },
        { status: 400 },
      );
    }

    ////////////////// PAYMENT PARAMS STARTS //////////////////////
    const randomValue = randomGenerator(10);
    const pidPayment = 'PAY' + randomValue;
    const txID = 'DEB' + randomValue;
    const txREF = 'SHOP_WALLET_' + Date.now() + '_' + randomGenerator(6);
    const serviceID = 'SHOP' + randomValue;

    const affiliateRefId = user.userAffiliateRef || 'NO_REF';
    ////////////////// PAYMENT PARAMS ENDS //////////////////////

    // Fetch product details for all cart items to get affiliate payout values
    const productDetailsWithQuantity = await Promise.all(
      cartItems.map(async (item: any) => {
        const product = await prisma.store.findUnique({
          where: {
            pidProduct: item.pidProduct,
          },
          select: {
            pidProduct: true,
            affiliatePayout: true,
            superAffiliatePayout: true,
          },
        });
        return {
          product,
          quantity: item.quantity || 1, // Default to 1 if quantity is undefined/null
        };
      }),
    );

    // Calculate total affiliate payouts across all products (accounting for quantity)
    let totalAffiliatePayout = 0;
    let totalSuperAffiliatePayout = 0;

    productDetailsWithQuantity.forEach(({ product, quantity }) => {
      if (product) {
        // Multiply affiliate payout by quantity for each product
        const affiliatePayoutForItem =
          (product.affiliatePayout || 0) * quantity;
        const superAffiliatePayoutForItem =
          (product.superAffiliatePayout || 0) * quantity;

        totalAffiliatePayout += affiliatePayoutForItem;
        totalSuperAffiliatePayout += superAffiliatePayoutForItem;

        console.log(`Product ${product.pidProduct}:`, {
          affiliatePayout: product.affiliatePayout || 0,
          superAffiliatePayout: product.superAffiliatePayout || 0,
          quantity,
          affiliatePayoutForItem,
          superAffiliatePayoutForItem,
        });
      }
    });

    console.log('Total Affiliate Payouts (with quantities):', {
      totalAffiliatePayout,
      totalSuperAffiliatePayout,
      productsCount: productDetailsWithQuantity.length,
    });

    // Hardcoded percentages (as per existing implementation)
    const affiliatePayoutPercentage = 2.5;
    const superAffiliatePayoutPercentage = 0.2;

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
          serviceDescription: 'SureStore Purchase - Wallet Payment',

          affiliate_payout_amount: totalAffiliatePayout,
          affiliate_payout_percentage: affiliatePayoutPercentage,
          superAffiliate_payout_amount: totalSuperAffiliatePayout,
          superAffiliate_payout_percentage: superAffiliatePayoutPercentage,

          affiliatePayStatus: 'pending',
          affiliateRefId: affiliateRefId || 'NO_REF',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Create store_sales records for each cart item
      // Order Status Flow: PAID → PROCESSING → SHIPPED → DELIVERED → COMPLETED
      // Initial status is PAID after successful payment
      // Admin will update status through order management interface
      const salesRecords = await Promise.all(
        cartItems.map(async (item: any) => {
          return tx.store_sales.create({
            data: {
              pidStore: `SALE${Math.floor(1000000000 + Math.random() * 9000000000)}`,
              pidProduct: item.pidProduct,
              pidUser: pidUser as string,
              product_name: item.productName,
              unit_price: item.productPrice.toFixed(2),
              total_price: (item.productPrice * item.quantity).toFixed(2),
              quantity: item.quantity.toString(),
              status: 'PAID', // Initial status after successful payment
              ext1: txREF, // Transaction reference
              ext2: 'WALLET', // Payment method
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });
        }),
      );

      return { create_debits, create_payment, salesRecords };
    });

    // If transaction is successful, send emails
    if (result.create_debits && result.create_payment) {
      // Build cart items summary for email
      const cartItemsSummary = cartItems
        .map(
          (item: any, index: number) =>
            `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${index + 1}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.productName}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">₦${item.productPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">₦${(item.productPrice * item.quantity).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
        </tr>`,
        )
        .join('');

      ////////////////////// SEND CUSTOMER PAYMENT RECEIPT EMAIL BLOCK STARTS //////////////////////
      const xEmail_A = email;
      const xTitle_A = `Payment Successful - Order Confirmation`;
      const xBodyTitle_A = `Your Order was Successful!`;
      const xBody_A = `Dear ${first_name}, <br />
                            This is to confirm your successful payment on the <b>sureimports.com</b> shop.<br /><br />
                            Here are the details of your order: <br />
                            <h4>Transaction Reference: <b>${txREF}</b></h4><hr />
                            <h4>Payment Method: <b>Wallet Payment</b></h4><hr />
                            <h4>Order type: <b>Shop Purchase</b></h4><hr />
                            <h4>Total Items: <b>${cartItems.length}</b></h4><hr />
                            <h4>Total Amount: <b>₦${purchaseAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b> (NGN)</h4><hr />
                            <br />
                            <h3>Order Items:</h3>
                            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                              <thead>
                                <tr style="background-color: #f5f5f5;">
                                  <th style="padding: 8px; border-bottom: 2px solid #ddd; text-align: left;">#</th>
                                  <th style="padding: 8px; border-bottom: 2px solid #ddd; text-align: left;">Product</th>
                                  <th style="padding: 8px; border-bottom: 2px solid #ddd; text-align: left;">Qty</th>
                                  <th style="padding: 8px; border-bottom: 2px solid #ddd; text-align: left;">Unit Price</th>
                                  <th style="padding: 8px; border-bottom: 2px solid #ddd; text-align: left;">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                ${cartItemsSummary}
                              </tbody>
                            </table>
                            <br /><hr />
                            <h4>Name: <b>${first_name + ' ' + last_name}</b></h4><hr />
                            <h4>Phone: <b>${phone || 'N/A'}</b></h4><hr />
                            <h4>Email: <b>${email}</b></h4><hr />
                            <h4>Remaining Wallet Balance: <b>₦${(walletBalance - purchaseAmount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b></h4><hr />
                            <br />
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
      const xTitle_B = `New Shop Order - Wallet Payment`;
      const xBodyTitle_B = `Shop Order Successful!`;
      const xBody_B = `Hi Admin, <br />A shop order has been completed successfully via wallet payment on sureimports.com.<br /><br />
                          Here are the details of the order: <br />
                          <h4>Transaction Reference: <b>${txREF}</b></h4><hr />
                          <h4>Payment Method: <b>Wallet Payment</b></h4><hr />
                          <h4>Customer name: <b>${first_name + ' ' + last_name}</b></h4><hr />
                          <h4>Phone Number: <b>${phone || 'N/A'}</b></h4><hr />
                          <h4>Email: <b>${email}</b></h4><hr />
                          <h4>Total Items: <b>${cartItems.length}</b></h4><hr />
                          <h4>Total Amount: <b>₦${purchaseAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b> (NGN)</h4><hr />
                          <br />
                          <h3>Order Items:</h3>
                          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                            <thead>
                              <tr style="background-color: #f5f5f5;">
                                <th style="padding: 8px; border-bottom: 2px solid #ddd; text-align: left;">#</th>
                                <th style="padding: 8px; border-bottom: 2px solid #ddd; text-align: left;">Product</th>
                                <th style="padding: 8px; border-bottom: 2px solid #ddd; text-align: left;">Qty</th>
                                <th style="padding: 8px; border-bottom: 2px solid #ddd; text-align: left;">Unit Price</th>
                                <th style="padding: 8px; border-bottom: 2px solid #ddd; text-align: left;">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              ${cartItemsSummary}
                            </tbody>
                          </table>
                          <br /><hr />
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

      console.log('Wallet payment processed successfully:', txREF);

      return NextResponse.json(
        {
          statusx: 'SUCCESS',
          message: `Payment successful! ₦${purchaseAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} has been deducted from your wallet. Your new balance is ₦${(walletBalance - purchaseAmount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
          data: {
            transactionRef: txREF,
            amount: purchaseAmount,
            itemsCount: cartItems.length,
            previousBalance: walletBalance,
            newBalance: walletBalance - purchaseAmount,
            paymentStatus: 'PAID',
          },
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        {
          statusx: 'FAILED',
          message: 'Payment transaction failed. Please try again.',
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Wallet payment error:', error);
    return NextResponse.json(
      {
        statusx: 'FAILED',
        message:
          'Internal server error occurred while processing wallet payment',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
