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

    // Create store sales record
    await prisma.store_sales_faya.create({
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
