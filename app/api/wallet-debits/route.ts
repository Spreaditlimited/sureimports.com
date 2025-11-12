import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const pidUser = request.nextUrl.searchParams.get('pidUser');

    // Validate required parameter
    if (!pidUser) {
      return NextResponse.json({
        statusx: 'FAILED',
        message: 'Missing required parameter: pidUser is required',
      }, { status: 400 });
    }

    // Get user details to fetch email
    const user: any = await prisma.users.findUnique({
      where: {
        pidUser: pidUser as string,
      },
      select: {
        userEmail: true,
        userFirstname: true,
        userLastname: true,
      },
    });

    if (!user) {
      return NextResponse.json({
        statusx: 'FAILED',
        message: 'User not found',
      }, { status: 404 });
    }

    // Fetch debit transactions for the user
    const debits = await prisma.debits.findMany({
      where: {
        pidUser: pidUser as string,
      },
      orderBy: {
        createdAt: 'desc', // Most recent first
      },
    });

    // Calculate total debited amount
    const totalDebited = debits
      .filter(debit => debit.paymentStatus === 'DEBITED')
      .reduce((sum, debit) => sum + (debit.amount || 0), 0);

    return NextResponse.json({
      statusx: 'SUCCESS',
      message: 'Debit transactions fetched successfully',
      data: {
        debits: debits,
        totalDebited: totalDebited,
        count: debits.length,
        userInfo: {
          email: user.userEmail,
          firstName: user.userFirstname,
          lastName: user.userLastname,
        },
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Fetch debit transactions error:', error);
    return NextResponse.json({
      statusx: 'FAILED',
      message: 'Internal server error occurred while fetching debit transactions',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

