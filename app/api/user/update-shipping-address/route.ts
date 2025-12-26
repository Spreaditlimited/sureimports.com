import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pidUser, userEmail, shippingAddress } = body;

    // Validate required parameters
    if (!pidUser || !userEmail) {
      return NextResponse.json(
        {
          statusx: 'FAILED',
          message:
            'Missing required parameters: pidUser and userEmail are required',
        },
        { status: 400 },
      );
    }

    if (!shippingAddress || shippingAddress.trim().length === 0) {
      return NextResponse.json(
        {
          statusx: 'FAILED',
          message: 'Shipping address cannot be empty',
        },
        { status: 400 },
      );
    }

    // Validate minimum length
    if (shippingAddress.trim().length < 10) {
      return NextResponse.json(
        {
          statusx: 'FAILED',
          message: 'Shipping address must be at least 10 characters long',
        },
        { status: 400 },
      );
    }

    // Check if user exists
    const user = await prisma.users.findUnique({
      where: {
        pidUser: pidUser,
        userEmail: userEmail,
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

    // Update shipping address
    const updatedUser = await prisma.users.update({
      where: {
        pidUser: pidUser,
        userEmail: userEmail,
      },
      data: {
        userShippingAddress2: shippingAddress.trim(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        statusx: 'SUCCESS',
        message: 'Shipping address updated successfully',
        data: {
          userShippingAddress2: updatedUser.userShippingAddress2,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error updating shipping address:', error);
    return NextResponse.json(
      {
        statusx: 'FAILED',
        message: 'Failed to update shipping address',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

// GET endpoint to fetch current shipping address
export async function GET(request: NextRequest) {
  try {
    const pidUser = request.nextUrl.searchParams.get('pidUser');
    const userEmail = request.nextUrl.searchParams.get('userEmail');

    if (!pidUser || !userEmail) {
      return NextResponse.json(
        {
          statusx: 'FAILED',
          message:
            'Missing required parameters: pidUser and userEmail are required',
        },
        { status: 400 },
      );
    }

    const user = await prisma.users.findUnique({
      where: {
        pidUser: pidUser,
        userEmail: userEmail,
      },
      select: {
        userShippingAddress2: true,
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

    return NextResponse.json(
      {
        statusx: 'SUCCESS',
        data: {
          userShippingAddress2: user.userShippingAddress2 || '',
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error fetching shipping address:', error);
    return NextResponse.json(
      {
        statusx: 'FAILED',
        message: 'Failed to fetch shipping address',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
