import { prisma } from '@/lib/prisma';
import {
  dedupeWalletLedger,
  getWalletLedger,
  syncLegacyWalletDebits,
  syncPaystackDedicatedNubanCredits,
} from '@/lib/walletLedger';

import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ email: string }> },
) {
  try {
    const { email } = await params;
    const normalizedEmail = decodeURIComponent(email).trim().toLowerCase();

    const user = await prisma.users.findFirst({
      where: {
        OR: [
          { userEmail: normalizedEmail },
          { email: normalizedEmail },
        ],
      },
      select: {
        pidUser: true,
        userEmail: true,
        email: true,
        userFirstname: true,
        userLastname: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          customerDetails: [],
          transactionDetails: [],
          statusx: 'NO_CUSTOMER',
          message: 'No customer found for this email',
        },
        { status: 200 },
      );
    }

    const walletSync = await syncPaystackDedicatedNubanCredits(user);
    if (walletSync.statusx !== 'WALLET_READY') {
      return NextResponse.json(
        {
          customerDetails: [],
          transactionDetails: [],
          statusx: 'NO_ACCOUNT',
          message: 'No Dedicated Account found for this email',
        },
        { status: 200 },
      );
    }

    await syncLegacyWalletDebits(prisma, user);
    await dedupeWalletLedger(prisma, user);
    const ledger = await getWalletLedger(prisma, user);

    const creditTransactions = ledger.transactions
      .filter((transaction) => transaction.type === 'CREDIT')
      .map((transaction) => ({
        id: transaction.id,
        reference: transaction.categoryId || transaction.id,
        amount: transaction.amount * 100,
        currency: ledger.wallet.currency,
        status: 'success',
        channel: transaction.categoryId?.startsWith('PAYSTACK:')
          ? 'dedicated_nuban'
          : 'wallet_credit',
        gateway_response: transaction.description,
        fees: 0,
        created_at: transaction.date.toISOString(),
        customer: {
          email: user.userEmail || user.email || normalizedEmail,
          first_name: user.userFirstname || '',
          last_name: user.userLastname || '',
        },
      }));

    const debitTransactions = ledger.transactions
      .filter((transaction) => transaction.type === 'DEBIT')
      .map((transaction) => ({
        id: transaction.id,
        pidDebit: transaction.categoryId || transaction.id,
        pidUser: user.pidUser,
        email: user.userEmail || user.email || normalizedEmail,
        payerName: ledger.customerName,
        txID: transaction.categoryId || transaction.id,
        txRef: transaction.categoryId || transaction.id,
        paymentStatus: 'DEBITED',
        paymentType: 'WALLET',
        currency: ledger.wallet.currency,
        amount: transaction.amount,
        serviceName: 'Wallet Debit',
        serviceDescription: transaction.description,
        xStatus: 'success',
        createdAt: transaction.date,
      }));

    return NextResponse.json(
      {
        customerDetails: walletSync.customerDetails,
        transactionDetails: {
          transactions: creditTransactions,
          debits: debitTransactions,
          ledger: ledger.transactions,
          totalAmount: ledger.balance,
          totalCredit: ledger.credits,
          totalDebit: ledger.debits,
        },
        statusx: 'WALLET_READY',
        message: 'Wallet Activation was Successful!',
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        statusx: 'FAILED',
        message:
          error instanceof Error ? error.message : 'An unknown error occurred',
      },
      { status: 500 },
    );
  }
}
