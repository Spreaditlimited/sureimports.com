// app/api/paystack-payment/create-record/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import randomGenerator from '@/lib/helpers/randomGenerator';

export async function POST(request: Request) {
  try {
    const {
      email,
      amount,
      pidUser,
      pidProduct,
      productPrice,
      productName,
      quantity,
      currency,
      serviceID,
      serviceName,
      serviceDescription,

      activeTab,
      purchaseType,
      fullName,
      phone,
      address,
      deliveryOption,
      deliveryLocation,
    } = await request.json();

    const randomValue = randomGenerator(10);

    const pidStore = 'FAYASTORE' + randomValue;
    const pidPayment = 'PAY' + randomValue;
    const reference = `FAYASTORE_${Date.now()}`;

    const user: any = await prisma.users.findUnique({
      where: {
        pidUser: pidUser as string,
      },
    });

    // Get product details
    const product: any = await prisma.store.findUnique({
      where: {
        pidProduct: pidProduct as string,
      },
    });

    ////////////////// PAYMENT PARAMS STARTS //////////////////////
    const txID = 'DEB' + randomValue;
    const txREF = 'REF' + randomValue;

    const affiliatePayoutAmount = product.affiliatePayout || 0;
    const affiliatePayoutPercentage = 2.5; // hard coded
    const superAffiliatePayoutAmount = product.superAffiliatePayout || 0;
    const superAffiliatePayoutPercentage = 0.2; // hard coded

    const affiliateRefId = user.userAffiliateRef || 'NO_REF';
    ////////////////// PAYMENT PARAMS ENDS //////////////////////

    // Get user details
    // const user = await prisma.users.findUnique({
    //   where: { pidUser: pidUser },
    // });

    // if (!user) {
    //   return NextResponse.json({ error: 'User not found' }, { status: 404 });
    // }

    // Create store sales record

    await prisma.store_sales.create({
      data: {
        pidStore: `SALE${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        pidProduct: pidProduct as string,
        pidUser: pidUser as string,
        product_name: productName,
        unit_price: (amount / parseInt(quantity)).toFixed(2),
        total_price: amount.toFixed(2),
        quantity: quantity.toString(),
        status: 'COMPLETED',
        ext1: txREF, // Store transaction reference
        ext2: 'WALLET', // Store payment method
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // console.log(
    //   'Z=======================Z:' +
    //     'email: ' +
    //     email +
    //     'amount: ' +
    //     amount +
    //     'pidUser: ' +
    //     pidUser +
    //     'pidProduct: ' +
    //     pidProduct +
    //     'pidStore: ' +
    //     pidStore +
    //     'productPrice: ' +
    //     productPrice +
    //     'productName: ' +
    //     productName +
    //     'quantity: ' +
    //     quantity +
    //     'activeTab: ' +
    //     activeTab +
    //     'purchaseType: ' +
    //     purchaseType +
    //     'fullName: ' +
    //     fullName +
    //     'phone: ' +
    //     phone +
    //     'address: ' +
    //     address +
    //     'deliveryOption: ' +
    //     deliveryOption +
    //     'deliveryLocation: ' +
    //     deliveryLocation,
    // );

    await prisma.payments.create({
      data: {
        pidPayment: pidPayment,
        pidUser: pidUser as any,
        payerName: fullName || 'Unknown User',
        payerEmail: email,
        txID: pidPayment,
        txRef: pidPayment,
        paymentStatus: 'PAID',
        paymentType: 'WALLET',
        currency: 'NGN',
        amount: amount,
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

    // console.log(
    //     '1111========pidStore: ' +
    //     pidStore +
    //     '111111 =========paymentData: ' +
    //     pidPayment +
    //     '111111 ========Ref: ' +
    //     reference,
    // );

    return NextResponse.json({
      success: true,
      pidStore,
      pidPayment,
      reference,
    });
  } catch (error) {
    console.error('Error creating payment record:', error);
    return NextResponse.json(
      { error: 'Failed to create payment record' },
      { status: 500 },
    );
  }
}
