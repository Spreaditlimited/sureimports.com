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
        { status: 401 },
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
          { status: 401 },
        );
      }
      userId = decoded.pidUser as string;
    } catch (error) {
      return NextResponse.json(
        {
          statusx: 'FAILED',
          message: 'Token verification failed',
        },
        { status: 401 },
      );
    }

    if (!userId) {
      return NextResponse.json(
        {
          statusx: 'FAILED',
          message: 'User ID not found in token',
        },
        { status: 401 },
      );
    }

    // Fetch all store sales for the user
    const orders = await prisma.store_sales.findMany({
      where: {
        pidUser: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Resolve payment method + shipping snapshot by transaction reference.
    const refs = Array.from(
      new Set(
        orders
          .map((order) => order.ext1)
          .filter((ref): ref is string => Boolean(ref && ref.trim().length > 0)),
      ),
    );
    const payments =
      refs.length > 0
        ? await prisma.payments.findMany({
            where: {
              txRef: { in: refs },
            },
            select: {
              txRef: true,
              paymentType: true,
              paymentExt1: true,
              paymentExt2: true,
              createdAt: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          })
        : [];
    const paymentByRef = new Map<string, (typeof payments)[number]>();
    for (const payment of payments) {
      if (!payment.txRef || paymentByRef.has(payment.txRef)) continue;
      paymentByRef.set(payment.txRef, payment);
    }

    const enrichedOrders = orders.map((order) => {
      const payment = order.ext1 ? paymentByRef.get(order.ext1) : undefined;
      const methodFromStore = (order.ext2 || '').toUpperCase();
      const hasLegacyMethod =
        methodFromStore === 'PAYSTACK' || methodFromStore === 'WALLET';

      return {
        ...order,
        paymentMethod: hasLegacyMethod
          ? methodFromStore
          : payment?.paymentType || null,
        shippingAddressSnapshot: payment?.paymentExt1 || null,
        trackingNumber: payment?.paymentExt2 || null,
      };
    });

    console.log(`Fetched ${orders.length} orders for user ${userId}`);

    return NextResponse.json({
      statusx: 'SUCCESS',
      message: 'Orders fetched successfully',
      data: enrichedOrders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      {
        statusx: 'FAILED',
        message: 'Failed to fetch orders',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
