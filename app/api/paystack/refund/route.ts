import { NextRequest, NextResponse } from 'next/server';

interface RefundRequest {
  transaction: string | number;
  amount?: number;
  currency?: string;
  customer_note?: string;
  merchant_note?: string;
}

interface PaystackRefundResponse {
  status: boolean;
  message: string;
  data: {
    transaction: {
      id: number;
      domain: string;
      reference: string;
      amount: number;
      paid_at: string;
      channel: string;
      currency: string;
      authorization: {
        exp_month: string | null;
        exp_year: string | null;
        account_name: string | null;
      };
      customer: {
        international_format_phone: string | null;
      };
      plan: object;
      subaccount: {
        currency: string | null;
      };
      split: object;
      order_id: string | null;
      paidAt: string;
      pos_transaction_data: any;
      source: any;
      fees_breakdown: any;
    };
    integration: number;
    deducted_amount: number;
    channel: string | null;
    merchant_note: string;
    customer_note: string;
    status: string;
    refunded_by: string;
    expected_at: string;
    currency: string;
    domain: string;
    amount: number;
    fully_deducted: boolean;
    id: number;
    createdAt: string;
    updatedAt: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: RefundRequest = await request.json();

    // Validate required fields
    if (!body.transaction) {
      return NextResponse.json(
        {
          success: false,
          error: 'Transaction ID or reference is required',
        },
        { status: 400 },
      );
    }

    // Get Paystack secret key from environment variables
    const paystackSecretKey = process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY;

    if (!paystackSecretKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Paystack secret key not configured',
        },
        { status: 500 },
      );
    }

    // Prepare request body for Paystack
    const refundData: RefundRequest = {
      transaction: body.transaction,
    };

    // Add optional fields if provided
    if (body.amount) refundData.amount = body.amount;
    if (body.currency) refundData.currency = body.currency;
    if (body.customer_note) refundData.customer_note = body.customer_note;
    if (body.merchant_note) refundData.merchant_note = body.merchant_note;

    // Make request to Paystack API
    const paystackResponse = await fetch('https://api.paystack.co/refund', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(refundData),
    });

    const responseData: PaystackRefundResponse = await paystackResponse.json();

    if (!paystackResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: responseData.message || 'Refund request failed',
          details: responseData,
        },
        { status: paystackResponse.status },
      );
    }

    // Return successful response
    return NextResponse.json({
      success: true,
      message: responseData.message,
      data: responseData.data,
    });
  } catch (error) {
    console.error('Paystack refund error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to initiate a refund.' },
    { status: 405 },
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to initiate a refund.' },
    { status: 405 },
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to initiate a refund.' },
    { status: 405 },
  );
}
