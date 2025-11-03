import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const accountNumber = searchParams.get('account_number');
    const bankCode = searchParams.get('bank_code');

    // Validate required parameters
    if (!accountNumber || !bankCode) {
      return NextResponse.json(
        {
          status: false,
          message: 'Account number and bank code are required',
        },
        { status: 400 }
      );
    }

    // Validate account number format (10 digits)
    if (accountNumber.length !== 10 || !/^\d+$/.test(accountNumber)) {
      return NextResponse.json(
        {
          status: false,
          message: 'Account number must be exactly 10 digits',
        },
        { status: 400 }
      );
    }

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

    // Call Paystack API to resolve account number
    const response = await fetch(
      `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
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
          message: data.message || 'Failed to verify account number',
        },
        { status: response.status }
      );
    }

    // Return successful response
    return NextResponse.json({
      status: true,
      message: 'Account number resolved',
      data: {
        account_number: data.data.account_number,
        account_name: data.data.account_name,
        bank_id: data.data.bank_id,
      },
    });
  } catch (error: any) {
    console.error('Error resolving account number:', error);
    return NextResponse.json(
      {
        status: false,
        message: 'An error occurred while verifying the account',
      },
      { status: 500 }
    );
  }
}

