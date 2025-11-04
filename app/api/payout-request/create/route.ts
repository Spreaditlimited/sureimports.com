import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import randomGenerator from '@/lib/helpers/randomGenerator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pidUser, amount } = body;

    // Validate required parameters
    if (!pidUser || !amount) {
      return NextResponse.json({
        statusx: 'FAILED',
        message: 'Missing required parameters: pidUser and amount are required',
      }, { status: 400 });
    }

    // Validate amount is a number and greater than 0
    const payoutAmount = parseFloat(amount);
    if (isNaN(payoutAmount) || payoutAmount <= 0) {
      return NextResponse.json({
        statusx: 'FAILED',
        message: 'Invalid amount. Amount must be greater than 0',
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

    // Check if user has bank_transfer_code (Paystack recipient code)
    if (!user.bank_transfer_code) {
      return NextResponse.json({
        statusx: 'FAILED',
        message: 'Bank details not found. Please add your bank details in your profile settings before requesting a payout.',
      }, { status: 400 });
    }

    const email = user.userEmail;

    // Fetch customer wallet balance from Paystack
    console.log('Fetching customer wallet balance for email:', email);
    
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.ROOT_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/paystack/get-customer/${encodeURIComponent(email)}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch customer wallet data:', response.statusText);
      return NextResponse.json({
        statusx: 'FAILED',
        message: 'Failed to fetch wallet balance information',
      }, { status: 500 });
    }

    const data = await response.json();
    
    console.log('Customer API Response:', {
      statusx: data.statusx,
      message: data.message,
      hasCustomerDetails: !!data.customerDetails,
      hasTransactionDetails: !!data.transactionDetails,
    });

    // Check if customer exists
    if (data.statusx === 'NO_CUSTOMER' || data.statusx === 'NO_ACCOUNT') {
      return NextResponse.json({
        statusx: 'FAILED',
        message: 'Wallet not found. Please activate your wallet first.',
      }, { status: 400 });
    }

    // Check if customer data fetch failed
    if (data.statusx === 'FAILED') {
      return NextResponse.json({
        statusx: 'FAILED',
        message: data.message || 'Failed to retrieve wallet balance information',
      }, { status: 400 });
    }

    // Extract wallet balance from transaction details
    const transactionDetails = data.transactionDetails;
    const walletBalance = transactionDetails?.totalAmount || 0;

    console.log('Wallet Balance:', walletBalance, 'Payout Amount:', payoutAmount);

    // Check if user has sufficient funds
    if (walletBalance < payoutAmount) {
      return NextResponse.json({
        statusx: 'FAILED',
        message: `Insufficient wallet balance. Current balance: ₦${walletBalance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}, Requested: ₦${payoutAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
      }, { status: 400 });
    }

    // Check if user already has a pending payout request
    const existingPendingPayout = await prisma.payoutrequest.findFirst({
      where: {
        pidUser: pidUser as string,
        status: 'pending',
      },
    });

    if (existingPendingPayout) {
      return NextResponse.json({
        statusx: 'FAILED',
        message: 'You already have a pending payout request. Please wait for it to be processed before creating a new one.',
        data: {
          existingPayout: {
            pidPayout: existingPendingPayout.pidPayout,
            amount: existingPendingPayout.amount,
            createdAt: existingPendingPayout.createdAt,
          },
        },
      }, { status: 400 });
    }

    // Generate unique identifiers
    const pidPayout = 'PAYOUT' + randomGenerator(10);
    const reference = `PAYOUT_${Date.now()}`;
    const reason = 'Wallet withdrawal request';

    // Create payout request
    const payoutRequest = await prisma.payoutrequest.create({
      data: {
        pidPayout: pidPayout,
        pidUser: pidUser as string,
        amount: payoutAmount,
        recipient: user.bank_transfer_code, // Paystack transfer recipient code
        reference: reference,
        reason: reason,
        status: 'pending',
        xStatus: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log('Payout request created successfully:', pidPayout);

    return NextResponse.json({
      statusx: 'SUCCESS',
      message: `Payout request created successfully! ₦${payoutAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} will be transferred to your registered bank account within 3 business days.`,
      data: {
        pidPayout: payoutRequest.pidPayout,
        amount: payoutRequest.amount,
        reference: payoutRequest.reference,
        status: payoutRequest.status,
        createdAt: payoutRequest.createdAt,
        bankDetails: {
          bankName: user.bank_name,
          accountNumber: user.bank_account_number,
          accountName: user.bank_account_name,
        },
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Create payout request error:', error);
    return NextResponse.json({
      statusx: 'FAILED',
      message: 'Internal server error occurred while creating payout request',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

