// app/api/crud/pay-small-small/add-product/route.ts
import randomGenerator from '@/lib/helpers/randomGenerator';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const pidProduct = String(formData.get('pidProduct') || '');
    const pidUser = String(formData.get('pidUser') || '');
    const userEmail = String(formData.get('userEmail') || '');
    const phone = String(formData.get('phone') || '');
    const amountRaw = String(formData.get('amount') || '0');
    const quantityRaw = String(formData.get('quantity') || '1');

    if (!pidProduct || !pidUser || !userEmail) {
      return NextResponse.json(
        { statusx: 'FAILED', message: 'Missing required fields.' },
        { status: 200 },
      );
    }

    const amount = Number(amountRaw);
    const quantity = Number(quantityRaw);
    if (!Number.isFinite(amount) || amount <= 0 || !Number.isFinite(quantity) || quantity <= 0) {
      return NextResponse.json(
        { statusx: 'FAILED', message: 'Invalid amount or quantity.' },
        { status: 200 },
      );
    }

    const user = await db.users.findFirst({
      where: {
        pidUser,
        userEmail,
      },
    });

    if (!user) {
      return NextResponse.json(
        { statusx: 'FAILED', message: 'User not found.' },
        { status: 200 },
      );
    }

    if (!phone || phone.trim().length < 10) {
      return NextResponse.json(
        {
          statusx: 'NO_PHONE_NUMBER',
          message: 'Please provide a valid phone number to continue.',
        },
        { status: 200 },
      );
    }

    const product = await db.store.findUnique({
      where: { pidProduct },
    });

    if (!product) {
      return NextResponse.json(
        { statusx: 'FAILED', message: 'Product not found.' },
        { status: 200 },
      );
    }

    // Prevent duplicate initiations for the same user/product while plan is active.
    const existing = await db.paysmallsmall.findFirst({
      where: {
        pidUser,
        pidProduct,
        status: { in: ['SAVED', 'STARTED'] },
      },
      select: { pidPaySmallSmall: true },
    });

    if (existing) {
      return NextResponse.json(
        {
          statusx: 'SUCCESS',
          message: 'Pay Small Small already initiated for this product.',
        },
        { status: 200 },
      );
    }

    const created = await db.paysmallsmall.create({
      data: {
        pidPaySmallSmall: 'PSS' + randomGenerator(20),
        pidUser,
        pidProduct,
        productName: product.productName,
        productDescription: product.productDescription,
        amount,
        quantity: Math.floor(quantity),
        status: 'SAVED',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    if (!created) {
      return NextResponse.json(
        {
          statusx: 'FAILED',
          message: 'Failed saving record! Please contact the admin.',
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        statusx: 'SUCCESS',
        message: 'Product added, Pay Small Small initiated!',
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error('PSS add-product failed:', error?.message || error);
    return NextResponse.json(
      {
        statusx: 'FAILED',
        message: 'Unable to initialize Pay Small Small right now. Please try again.',
      },
      { status: 200 },
    );
  }
}
