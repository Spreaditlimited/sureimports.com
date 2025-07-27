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
    } = await request.json();

    const pidStore = 'STORE' + randomGenerator(10);
    const pidPayment = 'PAY' + randomGenerator(10);
    const reference = `SURESTORE_${Date.now()}`;

    // Get user details
    const user = await prisma.users.findUnique({
      where: { pidUser: pidUser },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create store sales record
    await prisma.store_sales.create({
      data: {
        pidStore: pidStore,
        pidProduct: pidProduct,
        pidUser: pidUser,
        product_name: productName || 'Unknown Product',
        unit_price: productPrice.toString(),
        total_price: amount.toString(),
        quantity: quantity.toString() || (1).toString(),
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create payment record
    await prisma.payments.create({
      data: {
        pidPayment: pidPayment,
        pidUser: pidUser,
        payerName: user.userFirstname || 'Unknown User',
        txID: pidStore,
        txRef: reference,
        paymentStatus: 'PENDING',
        paymentType: 'UNKNOWN',
        currency: currency || 'NGN',
        amount: parseFloat(amount) || 0,
        serviceID: serviceID,
        serviceName: serviceName || 'SURESTORE',
        serviceDescription: serviceDescription || 'Online Purchase',
        affiliatePayStatus: 'pending',
        affiliateRefId: user.userAffiliateRef || 'Unknown User',
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
