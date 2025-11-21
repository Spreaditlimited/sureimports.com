import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/app/utils/jwt';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const cookieStore = cookies();
    const token = (await cookieStore).get('token')?.value;

    if (!token) {
      return NextResponse.json(
        {
          statusx: 'FAILED',
          message: 'Unauthorized - No token provided',
        },
        { status: 401 }
      );
    }

    // Verify token and get user ID
    let userId: string | null = null;
    try {
      const decoded = verifyToken(token);
      if (!decoded || typeof decoded !== 'object' || !('pidUser' in decoded)) {
        return NextResponse.json(
          {
            statusx: 'FAILED',
            message: 'Invalid token',
          },
          { status: 401 }
        );
      }
      userId = decoded.pidUser as string;
    } catch (error) {
      return NextResponse.json(
        {
          statusx: 'FAILED',
          message: 'Token verification failed',
        },
        { status: 401 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        {
          statusx: 'FAILED',
          message: 'User ID not found in token',
        },
        { status: 401 }
      );
    }

    // Fetch all orders for the user
    const orders = await prisma.store_sales.findMany({
      where: {
        pidUser: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`Fetched ${orders.length} orders for user ${userId}`);

    return NextResponse.json({
      statusx: 'SUCCESS',
      message: 'Orders fetched successfully',
      data: orders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      {
        statusx: 'FAILED',
        message: 'Failed to fetch orders',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

