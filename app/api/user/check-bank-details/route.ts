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

    // Fetch user details
    const user: any = await prisma.users.findUnique({
      where: {
        pidUser: pidUser as string,
      },
      select: {
        bank_account_number: true,
        bank_account_name: true,
        bank_code: true,
        bank_transfer_code: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          statusx: 'FAILED',
          message: 'User not found',
        },
        { status: 404 },
      );
    }

    // Check if user has all required bank details
    const hasBankDetails = !!(
      user.bank_account_number &&
      user.bank_account_name &&
      user.bank_code
    );

    return NextResponse.json(
      {
        statusx: 'SUCCESS',
        message: hasBankDetails
          ? 'Bank details found'
          : 'No bank details found',
        hasBankDetails: hasBankDetails,
        hasTransferCode: !!user.bank_transfer_code,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Check bank details error:', error);
    return NextResponse.json(
      {
        statusx: 'FAILED',
        message: 'Internal server error occurred while checking bank details',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
