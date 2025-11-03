import { NextResponse } from 'next/server';

const PAYSTACK_SECRET_KEY = process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY;

// TypeScript interfaces for type safety
interface TransferRecipientRequest {
  type: string;
  name: string;
  account_number: string;
  bank_code: string;
  currency: string;
}

interface PaystackResponse {
  status: boolean;
  message: string;
  data?: any;
}

export async function POST(request: Request) {
  try {
    // Parse request body
    const body: TransferRecipientRequest = await request.json();

    // Validate required fields
    if (!body.type || !body.name || !body.account_number || !body.bank_code || !body.currency) {
      return NextResponse.json(
        {
          status: false,
          message: 'Missing required fields: type, name, account_number, bank_code, currency',
        },
        { status: 400 }
      );
    }

    // Validate Paystack secret key
    if (!PAYSTACK_SECRET_KEY) {
      return NextResponse.json(
        {
          status: false,
          message: 'Paystack secret key not configured',
        },
        { status: 500 }
      );
    }

    // Make request to Paystack API
    const response = await fetch('https://api.paystack.co/transferrecipient', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: body.type,
        name: body.name,
        account_number: body.account_number,
        bank_code: body.bank_code,
        currency: body.currency,
      }),
    });

    // Parse Paystack response
    const data: PaystackResponse = await response.json();

    // Check if request was successful
    if (!response.ok) {
      return NextResponse.json(
        {
          status: false,
          message: data.message || 'Failed to create transfer recipient',
          data: data,
        },
        { status: response.status }
      );
    }

    // Return success response
    return NextResponse.json(
      {
        status: true,
        message: data.message || 'Transfer recipient created successfully',
        data: data.data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error creating transfer recipient:', error);
    return NextResponse.json(
      {
        status: false,
        message: error.message || 'An error occurred while creating transfer recipient',
      },
      { status: 500 }
    );
  }
}

