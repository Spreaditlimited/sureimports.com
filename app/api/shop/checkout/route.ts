import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import randomGenerator from '@/lib/helpers/randomGenerator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pidUser, cartItems, totalAmount, paymentMethod } = body;

    // Validate required parameters
    if (!pidUser || !cartItems || !totalAmount) {
      return NextResponse.json({
        statusx: 'FAILED',
        message: 'Missing required parameters: pidUser, cartItems, and totalAmount are required',
      }, { status: 400 });
    }

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({
        statusx: 'FAILED',
        message: 'Cart is empty. Please add items to cart before checkout',
      }, { status: 400 });
    }

    // Get user details
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

    const email = user.userEmail;
    const first_name = user.userFirstname;
    const last_name = user.userLastname;

    // Generate unique reference for Paystack
    const reference = `SHOP_${Date.now()}_${randomGenerator(6)}`;

    // Initialize Paystack payment
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        amount: Math.round(totalAmount * 100), // Convert to kobo
        reference: reference,
        currency: 'NGN',
        metadata: {
          pidUser: pidUser,
          first_name: first_name,
          last_name: last_name,
          cart_items: cartItems,
          payment_method: paymentMethod || 'paystack',
          source: 'shop',
        },
      }),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackData.status) {
      console.error('Paystack initialization failed:', paystackData);
      return NextResponse.json({
        statusx: 'FAILED',
        message: 'Failed to initialize payment. Please try again.',
        error: paystackData.message,
      }, { status: 500 });
    }

    // Return payment initialization data
    return NextResponse.json({
      statusx: 'SUCCESS',
      message: 'Payment initialized successfully',
      data: {
        authorization_url: paystackData.data.authorization_url,
        access_code: paystackData.data.access_code,
        reference: reference,
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({
      statusx: 'FAILED',
      message: 'Internal server error occurred during checkout',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

