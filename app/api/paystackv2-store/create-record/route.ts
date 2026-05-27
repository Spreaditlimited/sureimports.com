// app/api/paystackv2-store/create-record/route.ts
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

    await prisma.store_sales_faya.create({
      data: {
        pidStore,
        pidProduct: pidProduct,
        pidUser: pidUser,
        product_name: productName || 'Unknown Product',
        unit_price: productPrice?.toString() || '0',
        total_price: amount?.toString() || '0',
        quantity: quantity?.toString() || '1',
        activeTab: activeTab,
        purchaseType: purchaseType,
        fullName: fullName || 'Unknown User',
        phone: phone || 'Unknown Phone',
        address: address || 'Unknown Address',
        deliveryOption: deliveryOption || 'Standard Delivery',
        deliveryLocation: deliveryLocation || 'Default Location',
        status: 'PENDING',
        ext1: '',
        ext2: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    await prisma.payments.create({
      data: {
        pidPayment,
        pidUser,
        payerName: fullName || 'Unknown User',
        payerEmail: email,
        txID: pidStore || 'FAYA',
        txRef: reference || 'FAYA',
        paymentStatus: 'PENDING',
        paymentType: 'UNKNOWN',
        currency: currency || 'NGN',
        amount: parseFloat(amount) || 0,
        serviceID: serviceID || 'FAYA',
        serviceName: serviceName || 'SURESTORE',
        serviceDescription: serviceDescription || 'Online Purchase',
        affiliatePayStatus: 'pending',
        affiliateRefId: email || 'Unknown User',
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
