import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { refundUser, sameOriginMutation } from '@/lib/refunds/request-auth';
import { protectRefundDestination } from '@/lib/refunds/destination';
import { decimalUnits, majorAmount } from '@/lib/refunds/money';

export async function POST(request: Request) {
  const pidUser = await refundUser();
  if (!pidUser) return NextResponse.json({ statusx: 'FAILED', message: 'Please sign in.' }, { status: 401 });
  if (!sameOriginMutation(request)) return NextResponse.json({ statusx: 'FAILED', message: 'Please refresh this page and try again. Sign in again if needed.' }, { status: 403 });
  try {
    const result = await prisma.$transaction(async tx => {
      // Freeze destination and entitlements together, before marking requested.
      const [user] = await tx.$queryRaw<{ bank_name: string; bank_account_number: string; bank_account_name: string; bank_code: string }[]>`SELECT bank_name,bank_account_number,bank_account_name,bank_code FROM users WHERE pidUser=${pidUser} FOR UPDATE`;
      if (!user?.bank_name || !user.bank_account_number || !user.bank_account_name || !user.bank_code) return null;
      const refunds = await tx.$queryRaw<{ pidRefund: string; amount: string }[]>`SELECT pidRefund,amount FROM refund_records WHERE pidUser=${pidUser} AND currency='NGN' AND refundStatus='pending' ORDER BY pidRefund FOR UPDATE`;
      for (const refund of refunds) {
        const minor = decimalUnits(String(refund.amount), 2);
        if (minor <= BigInt(0)) throw new Error('Invalid refund amount');
        const amount = majorAmount(minor);
        const destination = protectRefundDestination({ accountName: user.bank_account_name, accountNumber: user.bank_account_number, bankName: user.bank_name, bankCode: user.bank_code, country: 'NG' }, refund.pidRefund);
        await tx.$executeRaw`INSERT INTO refund_settlements (refundId,pidUser,sourceCurrency,sourceAmount,settlementCurrency,settlementAmount,exchangeRate,method,destinationCiphertext,status,createdAt,updatedAt) VALUES (${refund.pidRefund},${pidUser},'NGN',${amount},'NGN',${amount},1,'BANK',${destination},'REQUESTED',NOW(3),NOW(3))`;
        await tx.refund_records.update({ where: { pidRefund: refund.pidRefund }, data: { refundStatus: 'requested', updatedAt: new Date() } });
      }
      return refunds.map(refund => refund.pidRefund);
    });
    if (result === null) return NextResponse.json({ statusx: 'PROFILE_REQUIRED', message: 'Add and verify your bank account before requesting a refund.', actionHref: '/dashboard/profile-update', actionLabel: 'Update Bank Details' }, { status: 400 });
    if (!result.length) return NextResponse.json({ statusx: 'FAILED', message: 'You have no new Naira refunds available for a bank request.' }, { status: 409 });
    return NextResponse.json({ statusx: 'SUCCESS', message: 'Your bank refund request has been submitted for processing.', data: { requestedRefundIds: result, count: result.length } });
  } catch {
    return NextResponse.json({ statusx: 'FAILED', message: 'Unable to submit your bank refund request. Refresh and try again.' }, { status: 503 });
  }
}
