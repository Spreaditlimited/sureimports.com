import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';

async function requestBankRefund() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const payload = token
      ? (verifyToken(token) as { pidUser?: string } | null)
      : null;

    if (!payload?.pidUser) {
      return NextResponse.json(
        { statusx: 'FAILED', message: 'Unauthorized' },
        { status: 401 },
      );
    }

    const user = await prisma.users.findUnique({
      where: { pidUser: payload.pidUser },
      select: {
        pidUser: true,
        bank_name: true,
        bank_account_number: true,
        bank_account_name: true,
        bank_code: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { statusx: 'FAILED', message: 'User not found' },
        { status: 404 },
      );
    }

    if (
      !user.bank_name ||
      !user.bank_account_number ||
      !user.bank_account_name ||
      !user.bank_code
    ) {
      return NextResponse.json(
        {
          statusx: 'PROFILE_REQUIRED',
          message:
            'Add and verify your bank account details before requesting a bank refund.',
          actionHref: '/dashboard/profile-update',
          actionLabel: 'Update Bank Details',
        },
        { status: 400 },
      );
    }

    const pendingRefunds = await prisma.refund_records.findMany({
      where: {
        pidUser: user.pidUser,
        refundStatus: 'pending',
        currency: 'NGN',
      },
      select: { pidRefund: true },
    });

    if (pendingRefunds.length === 0) {
      return NextResponse.json(
        {
          statusx: 'FAILED',
          message: 'You have no new refunds available for a bank request.',
        },
        { status: 409 },
      );
    }

    const result = await prisma.refund_records.updateMany({
      where: {
        pidUser: user.pidUser,
        pidRefund: { in: pendingRefunds.map((refund) => refund.pidRefund) },
        refundStatus: 'pending',
      },
      data: {
        refundStatus: 'requested',
        updatedAt: new Date(),
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        {
          statusx: 'FAILED',
          message: 'These refunds are no longer available for a bank request.',
        },
        { status: 409 },
      );
    }

    const requestedRefunds = await prisma.refund_records.findMany({
      where: {
        pidUser: user.pidUser,
        pidRefund: { in: pendingRefunds.map((refund) => refund.pidRefund) },
        refundStatus: 'requested',
      },
      select: { pidRefund: true },
    });

    return NextResponse.json({
      statusx: 'SUCCESS',
      message:
        'Your bank refund request has been submitted for admin processing.',
      data: {
        requestedRefundIds: requestedRefunds.map((refund) => refund.pidRefund),
        count: requestedRefunds.length,
      },
    });
  } catch (error) {
    console.error('Bank refund request failed:', error);
    return NextResponse.json(
      {
        statusx: 'FAILED',
        message:
          'We could not submit your bank refund request. Please try again.',
      },
      { status: 500 },
    );
  }
}

export async function POST() {
  return requestBankRefund();
}
