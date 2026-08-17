import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';
import randomGenerator from '@/lib/helpers/randomGenerator';
import {
  recordWalletCredit,
  syncPaystackDedicatedNubanCredits,
} from '@/lib/walletLedger';
import { ensurePaystackWalletAccount } from '@/lib/wallet/paystackProvisioning';

class RefundTransferConflictError extends Error {}

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

    const body = await request.json();
    const refundIds = Array.from(
      new Set(
        [
          body?.pidRefund,
          ...(Array.isArray(body?.pidRefunds) ? body.pidRefunds : []),
        ]
          .map((value) => String(value || '').trim())
          .filter(Boolean),
      ),
    );

    if (refundIds.length === 0) {
      return NextResponse.json(
        { statusx: 'FAILED', message: 'At least one refund is required' },
        { status: 400 },
      );
    }

    const user = await prisma.users.findUnique({
      where: { pidUser: payload.pidUser },
      select: {
        pidUser: true,
        userEmail: true,
        userFirstname: true,
        userLastname: true,
        phone: true,
        userPhone: true,
      },
    });

    if (!user?.userEmail) {
      return NextResponse.json(
        { statusx: 'FAILED', message: 'User not found' },
        { status: 404 },
      );
    }

    const refunds = await prisma.refund_records.findMany({
      where: {
        pidRefund: { in: refundIds },
        pidUser: user.pidUser,
      },
    });

    if (refunds.length !== refundIds.length) {
      return NextResponse.json(
        { statusx: 'FAILED', message: 'One or more refunds were not found' },
        { status: 404 },
      );
    }

    const hasIneligibleRefund = refunds.some(
      (refund) => String(refund.refundStatus || '').toLowerCase() !== 'pending',
    );
    if (hasIneligibleRefund) {
      return NextResponse.json(
        {
          statusx: 'FAILED',
          message: 'Refund is not eligible for wallet transfer',
        },
        { status: 400 },
      );
    }
    if (
      refunds.some(
        (refund) => String(refund.currency || '').toUpperCase() !== 'NGN',
      )
    ) {
      return NextResponse.json(
        {
          statusx: 'FAILED',
          message:
            'This refund is not recorded in Naira. Please contact support.',
        },
        { status: 409 },
      );
    }

    const walletProvisioning = await ensurePaystackWalletAccount(user);
    if (walletProvisioning.status !== 'READY') {
      return NextResponse.json(
        {
          statusx: 'NO_WALLET',
          message: walletProvisioning.message,
          actionHref: walletProvisioning.actionHref,
          actionLabel: walletProvisioning.actionLabel,
        },
        { status: 400 },
      );
    }

    // Pull in any successful bank credits before applying this refund credit.
    await syncPaystackDedicatedNubanCredits(user);

    const transfers = refunds.map((refund) => ({
      refund,
      amount: Number(refund.amount || 0),
      txRef: `RFWAL${randomGenerator(10)}`,
      txID: `RFWALTX${randomGenerator(10)}`,
      pidDebit: `DEB${randomGenerator(12)}`,
    }));
    if (
      transfers.some(({ amount }) => !Number.isFinite(amount) || amount <= 0)
    ) {
      return NextResponse.json(
        {
          statusx: 'FAILED',
          message: 'One or more refund amounts are invalid',
        },
        { status: 400 },
      );
    }

    const fullName =
      `${user.userFirstname || ''} ${user.userLastname || ''}`.trim() ||
      'Customer';

    await prisma.$transaction(async (tx) => {
      for (const transfer of transfers) {
        const { refund, amount, txRef, txID, pidDebit } = transfer;
        const claimedRefund = await tx.refund_records.updateMany({
          where: {
            pidRefund: refund.pidRefund,
            pidUser: user.pidUser,
            refundStatus: 'pending',
          },
          data: {
            refundStatus: 'wallet-transferred',
            ext1: txRef,
            updatedAt: new Date(),
          },
        });

        if (claimedRefund.count !== 1) {
          throw new RefundTransferConflictError();
        }

        await tx.debits.create({
          data: {
            pidDebit,
            pidUser: user.pidUser,
            email: user.userEmail as string,
            payerName: fullName,
            txID,
            txRef,
            paymentStatus: 'REFUND_CREDIT',
            paymentType: 'WALLET',
            currency: 'NGN',
            amount,
            serviceID: refund.pidOrder || refund.pidRefund,
            serviceName: 'REFUND',
            serviceDescription: `Refund transfer to wallet (${refund.pidRefund})`,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        await recordWalletCredit(tx, user, {
          amount,
          reference: `REFUND:${pidDebit}`,
          description: `Refund transfer to wallet (${refund.pidRefund})`,
          currency: 'NGN',
        });
      }
    });

    return NextResponse.json({
      statusx: 'SUCCESS',
      message:
        refunds.length === 1
          ? 'Refund transferred to wallet successfully.'
          : `${refunds.length} refunds transferred to wallet successfully.`,
      data: {
        transferredRefundIds: refunds.map((refund) => refund.pidRefund),
        amount: transfers.reduce((sum, transfer) => sum + transfer.amount, 0),
      },
    });
  } catch (error) {
    if (error instanceof RefundTransferConflictError) {
      return NextResponse.json(
        {
          statusx: 'FAILED',
          message:
            'This refund has already been moved or is no longer available.',
        },
        { status: 409 },
      );
    }

    console.error('Refund to wallet transfer failed:', error);
    return NextResponse.json(
      { statusx: 'FAILED', message: 'Failed to transfer refund to wallet' },
      { status: 500 },
    );
  }
}
