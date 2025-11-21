import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import randomGenerator from '@/lib/helpers/randomGenerator';
import xMail from '@/lib/email/xMail3';

export async function GET(request: NextRequest) {
  try {
    const reference = request.nextUrl.searchParams.get('reference');

    console.log('Shop payment verification started:', { reference });

    if (!reference) {
      return NextResponse.json({
        statusx: 'FAILED',
        message: 'Payment reference is required',
      }, { status: 400 });
    }

    if (!process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY) {
      console.error('PAYSTACK_SECRET_KEY is not defined');
      return NextResponse.json({
        statusx: 'FAILED',
        message: 'Payment configuration error',
      }, { status: 500 });
    }

    console.log('Verifying payment with Paystack...');
    // Verify payment with Paystack
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paystackData = await paystackResponse.json();
    console.log('Paystack verification response:', {
      status: paystackData.status,
      transactionStatus: paystackData.data?.status,
    });

    if (!paystackData.status || paystackData.data.status !== 'success') {
      return NextResponse.json({
        statusx: 'FAILED',
        message: 'Payment verification failed',
        data: paystackData,
      }, { status: 400 });
    }

    const transactionData = paystackData.data;
    const metadata = transactionData.metadata;

    // Extract cart items and user info from metadata
    const pidUser = metadata.pidUser;
    const cartItems = metadata.cart_items || [];
    const amount = transactionData.amount / 100; // Convert from kobo to naira

    // Get user details
    const user: any = await prisma.users.findUnique({
      where: {
        pidUser: pidUser as string,
      },
    });

    if (!user) {
      return NextResponse.json({
        statusx: 'FAILED',
        message: 'User not found',
      }, { status: 404 });
    }

    const email = user.userEmail;
    const first_name = user.userFirstname;
    const last_name = user.userLastname;
    const phone = user.phone;

    // Generate IDs
    const pidPayment = 'PAY' + randomGenerator(10);
    const txID = 'SHOP' + randomGenerator(10);
    const txREF = reference;
    const serviceID = 'SHOP' + randomGenerator(10);

    console.log('Creating database records...');
    // Use Prisma transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      console.log('Creating payment record...');
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
          paymentType: 'PAYSTACK',
          currency: 'NGN',
          amount: amount,
          serviceID: serviceID,
          serviceName: 'SHOP',
          serviceDescription: 'Online Shop Purchase',
          affiliatePayStatus: 'pending',
          affiliateRefId: user.userAffiliateRef || 'NO_REF',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      console.log('Payment record created successfully');
      console.log('Creating store_sales records for cart items...');
      // Create store_sales records for each cart item
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
              status: 'COMPLETED',
              ext1: txREF,
              ext2: 'PAYSTACK',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });
        })
      );

      console.log(`Created ${salesRecords.length} store_sales records successfully`);
      return { create_payment, salesRecords };
    });

    console.log('Database records created successfully');

    // Send confirmation emails
    console.log('Sending confirmation emails...');
    if (result.create_payment) {
      // Build cart items HTML for email
      const cartItemsHTML = cartItems.map((item: any) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.productName}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₦${(item.productPrice * item.quantity).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
        </tr>
      `).join('');

      ////////////////////// SEND CUSTOMER PAYMENT RECEIPT EMAIL //////////////////////
      console.log('Sending customer email...');
      try {
        const xEmail_A = email;
        const xTitle_A = `Payment Successful - Order Confirmation`;
        const xBodyTitle_A = `Your Order was Successful!`;
        const xBody_A = `Dear ${first_name}, <br />
                              This is to confirm your successful payment on the <b>sureimports.com</b> shop.<br /><br />
                              Here are the details of your order: <br />
                              <h4>Transaction Reference: <b>${txREF}</b></h4><hr />
                              <h4>Payment Method: <b>Paystack</b></h4><hr />
                              <h4>Order type: <b>Shop Purchase</b></h4><hr />
                              <h4>Items Purchased:</h4>
                              <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
                                <thead>
                                  <tr style="background-color: #f5f5f5;">
                                    <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">Product</th>
                                    <th style="padding: 8px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
                                    <th style="padding: 8px; text-align: right; border-bottom: 2px solid #ddd;">Total</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  ${cartItemsHTML}
                                </tbody>
                              </table>
                              <hr />
                              <h4>Total Amount: <b>₦${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b> (NGN)</h4><hr />
                              <h4>Name: <b>${first_name + ' ' + last_name}</b></h4><hr />
                              <h4>Phone: <b>${phone || 'N/A'}</b></h4><hr />
                              <h4>Email: <b>${email}</b></h4><hr />
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
        console.log('Customer email sent successfully');
      } catch (emailError) {
        console.error('Error sending customer email:', emailError);
        // Don't fail the entire verification if email fails
      }

      ////////////////////// SEND ADMIN PAYMENT EMAIL //////////////////////
      console.log('Sending admin email...');
      try {
        const xEmail_B = 'hello@sureimports.com';
        const xTitle_B = `New Shop Purchase - ${cartItems.length} item(s)`;
        const xBodyTitle_B = `Shop Purchase Successful!`;
        const xBody_B = `Hi Admin, <br />A shop purchase has been completed successfully on sureimports.com.<br /><br />
                            Here are the details of the order: <br />
                            <h4>Transaction Reference: <b>${txREF}</b></h4><hr />
                            <h4>Payment Method: <b>Paystack</b></h4><hr />
                            <h4>Customer name: <b>${first_name + ' ' + last_name}</b></h4><hr />
                            <h4>Phone Number: <b>${phone || 'N/A'}</b></h4><hr />
                            <h4>Items Purchased:</h4>
                            <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
                              <thead>
                                <tr style="background-color: #f5f5f5;">
                                  <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">Product</th>
                                  <th style="padding: 8px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
                                  <th style="padding: 8px; text-align: right; border-bottom: 2px solid #ddd;">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                ${cartItemsHTML}
                              </tbody>
                            </table>
                            <hr />
                            <h4>Total Amount: <b>₦${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b> (NGN)</h4><hr />
                            <h4>Address: <b>${user?.address || 'Not provided'}</b></h4><hr />
                            Kind regards,<br />
                            Sureimports.com Automated System`;

        await xMail({
          xEmail: xEmail_B,
          xTitle: xTitle_B,
          xBodyTitle: xBodyTitle_B,
          xBody: xBody_B,
        });
        console.log('Admin email sent successfully');
      } catch (emailError) {
        console.error('Error sending admin email:', emailError);
        // Don't fail the entire verification if email fails
      }

      console.log('Shop payment processed successfully:', txREF);
    }

    return NextResponse.json({
      statusx: 'SUCCESS',
      message: 'Payment verified and order created successfully',
      data: {
        transactionRef: txREF,
        amount: amount,
        itemsCount: cartItems.length,
        paymentStatus: 'PAID',
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Payment verification error:', error);
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json({
      statusx: 'FAILED',
      message: 'Internal server error occurred while verifying payment',
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}

