import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const pidUser = request.nextUrl.searchParams.get('pidUser');

    // Validate required parameter
    if (!pidUser) {
      return NextResponse.json(
        {
          statusx: 'FAILED',
          message: 'Missing required parameter: pidUser is required',
        },
        { status: 400 },
      );
    }

    // Fetch pending payout request for the user
    const pendingPayout = await prisma.payoutrequest.findFirst({
      where: {
        pidUser: pidUser as string,
        status: 'pending',
      },
      orderBy: {
        createdAt: 'desc', // Get the most recent pending request
      },
    });

    if (!pendingPayout) {
      return NextResponse.json(
        {
          statusx: 'NO_PENDING',
          message: 'No pending payout request found',
          data: null,
        },
        { status: 200 },
      );
    }

    // Get user details for bank information
    const user: any = await prisma.users.findUnique({
      where: {
        pidUser: pidUser as string,
      },
      select: {
        bank_name: true,
        bank_account_number: true,
        bank_account_name: true,
      },
    });

    return NextResponse.json(
      {
        statusx: 'SUCCESS',
        message: 'Pending payout request found',
        data: {
          pidPayout: pendingPayout.pidPayout,
          amount: pendingPayout.amount,
          reference: pendingPayout.reference,
          reason: pendingPayout.reason,
          status: pendingPayout.status,
          xStatus: pendingPayout.xStatus,
          createdAt: pendingPayout.createdAt,
          updatedAt: pendingPayout.updatedAt,
          bankDetails: user
            ? {
                bankName: user.bank_name,
                accountNumber: user.bank_account_number,
                accountName: user.bank_account_name,
              }
            : null,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Get pending payout request error:', error);
    return NextResponse.json(
      {
        statusx: 'FAILED',
        message:
          'Internal server error occurred while fetching pending payout request',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
