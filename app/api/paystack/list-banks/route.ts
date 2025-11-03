import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const currency = searchParams.get('currency') || 'NGN';

    // Get Paystack secret key from environment
    const paystackSecretKey = process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY;

    if (!paystackSecretKey) {
      console.error('Paystack secret key not configured');
      return NextResponse.json(
        {
          status: false,
          message: 'Payment service not configured',
        },
        { status: 500 }
      );
    }

    // Call Paystack API to get list of banks
    const response = await fetch(
      `https://api.paystack.co/bank?currency=${currency}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Paystack API error:', data);
      return NextResponse.json(
        {
          status: false,
          message: data.message || 'Failed to fetch banks',
        },
        { status: response.status }
      );
    }

    // Return successful response
    return NextResponse.json({
      status: true,
      message: 'Banks retrieved',
      data: data.data,
    });
  } catch (error: any) {
    console.error('Error fetching banks:', error);
    return NextResponse.json(
      {
        status: false,
        message: 'An error occurred while fetching banks',
      },
      { status: 500 }
    );
  }
}

