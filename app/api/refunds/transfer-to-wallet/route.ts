import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';
import randomGenerator from '@/lib/helpers/randomGenerator';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { statusx: 'FAILED', message: 'Unauthorized' },
        { status: 401 },
      );
    }

    const payload = verifyToken(token) as { pidUser?: string } | null;
    if (!payload?.pidUser) {
      return NextResponse.json(
        { statusx: 'FAILED', message: 'Unauthorized' },
        { status: 401 },
      );
    }

    const { pidRefund } = await request.json();
    if (!pidRefund) {
      return NextResponse.json(
        { statusx: 'FAILED', message: 'pidRefund is required' },
        { status: 400 },
      );
    }

    const user = await prisma.users.findUnique({
      where: { pidUser: payload.pidUser },
      select: { pidUser: true, userEmail: true, userFirstname: true, userLastname: true },
    });

    if (!user?.userEmail) {
      return NextResponse.json(
        { statusx: 'FAILED', message: 'User not found' },
        { status: 404 },
      );
    }

    const refund = await prisma.refund_records.findFirst({
      where: {
        pidRefund: String(pidRefund),
        pidUser: user.pidUser,
      },
    });

    if (!refund) {
      return NextResponse.json(
        { statusx: 'FAILED', message: 'Refund record not found' },
        { status: 404 },
      );
    }

    const refundStatus = String(refund.refundStatus || '').toLowerCase();
    if (!['pending', 'requested'].includes(refundStatus)) {
      return NextResponse.json(
        { statusx: 'FAILED', message: 'Refund is not eligible for wallet transfer' },
        { status: 400 },
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.ROOT_URL ||
      'http://localhost:3000';
    const walletCheck = await fetch(
      `${baseUrl}/api/paystack/get-customer/${encodeURIComponent(user.userEmail)}`,
      { method: 'GET', headers: { 'Content-Type': 'application/json' } },
    );
    const walletData = await walletCheck.json();

    if (walletData?.statusx !== 'WALLET_READY') {
      return NextResponse.json(
        {
          statusx: 'NO_WALLET',
          message: 'Please activate your wallet first to receive refund transfers.',
        },
        { status: 400 },
      );
    }

    const transferAmount = Number(refund.amount || 0);
    if (!Number.isFinite(transferAmount) || transferAmount <= 0) {
      return NextResponse.json(
        { statusx: 'FAILED', message: 'Invalid refund amount' },
        { status: 400 },
      );
    }

    const txRef = `RFWAL${randomGenerator(10)}`;
    const txID = `RFWALTX${randomGenerator(10)}`;
    const fullName = `${user.userFirstname || ''} ${user.userLastname || ''}`.trim() || 'Customer';

    await prisma.$transaction(async (tx) => {
      // Credit wallet ledger through debits table using a dedicated credit status.
      // Wallet balance APIs compute net debits minus this credit stream.
      await tx.debits.create({
        data: {
          pidDebit: `DEB${randomGenerator(12)}`,
          pidUser: user.pidUser,
          email: user.userEmail as string,
          payerName: fullName,
          txID,
          txRef,
          paymentStatus: 'REFUND_CREDIT',
          paymentType: 'WALLET',
          currency: 'NGN',
          amount: transferAmount,
          serviceID: refund.pidOrder || refund.pidRefund,
          serviceName: 'REFUND',
          serviceDescription: `Refund transfer to wallet (${refund.pidRefund})`,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      await tx.refund_records.update({
        where: { pidRefund: refund.pidRefund },
        data: {
          refundStatus: 'wallet-transferred',
          ext1: txRef,
          updatedAt: new Date(),
        },
      });
    });

    return NextResponse.json({
      statusx: 'SUCCESS',
      message: 'Refund transferred to wallet successfully.',
    });
  } catch (error) {
    console.error('Refund to wallet transfer failed:', error);
    return NextResponse.json(
      { statusx: 'FAILED', message: 'Failed to transfer refund to wallet' },
      { status: 500 },
    );
  }
}

