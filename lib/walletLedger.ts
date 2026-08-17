import { Prisma, TransactionType, WalletType } from '@prisma/client';
import { prisma } from '@/lib/prisma';

type WalletDb = Prisma.TransactionClient | typeof prisma;

type WalletUser = {
  pidUser: string;
  userEmail: string | null;
  email?: string | null;
  userFirstname?: string | null;
  userLastname?: string | null;
};

type PaystackTransaction = {
  id?: number;
  reference?: string;
  amount?: number;
  currency?: string;
  status?: string;
  channel?: string;
  gateway_response?: string;
  fees?: number;
  created_at?: string;
  customer?: {
    email?: string;
    first_name?: string | null;
    last_name?: string | null;
  };
};

const WALLET_NAME = 'Sure Imports Wallet';

function toAmount(value: unknown) {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
}

function walletHolderName(user: WalletUser) {
  return (
    `${user.userFirstname || ''} ${user.userLastname || ''}`.trim() ||
    user.userEmail ||
    user.email ||
    'Customer'
  );
}

export async function ensureWallet(
  db: WalletDb,
  user: WalletUser,
  currency = 'NGN',
) {
  return db.wallet.upsert({
    where: { pidUser: user.pidUser },
    update: {
      name: WALLET_NAME,
      currency,
    },
    create: {
      name: WALLET_NAME,
      type: WalletType.MAIN,
      currency,
      balance: 0,
      pidUser: user.pidUser,
    },
  });
}

async function recordWalletTransaction(
  db: WalletDb,
  user: WalletUser,
  payload: {
    amount: number;
    type: TransactionType;
    reference: string;
    description: string;
    currency?: string;
    date?: Date;
  },
) {
  if ('$transaction' in db) {
    return db.$transaction((tx) =>
      recordWalletTransactionInTx(tx, user, payload),
    );
  }

  return recordWalletTransactionInTx(db, user, payload);
}

async function recordWalletTransactionInTx(
  db: WalletDb,
  user: WalletUser,
  payload: {
    amount: number;
    type: TransactionType;
    reference: string;
    description: string;
    currency?: string;
    date?: Date;
  },
) {
  const amount = toAmount(payload.amount);
  if (amount <= 0) return null;

  const wallet = await ensureWallet(db, user, payload.currency || 'NGN');

  await db.$queryRaw`SELECT id FROM Wallet WHERE id = ${wallet.id} FOR UPDATE`;

  const existing = await db.transaction.findFirst({
    where: {
      walletId: wallet.id,
      categoryId: payload.reference,
      type: payload.type,
    },
  });

  if (existing) return existing;

  const transaction = await db.transaction.create({
    data: {
      walletId: wallet.id,
      amount,
      type: payload.type,
      description: payload.description,
      categoryId: payload.reference,
      date: payload.date || new Date(),
    },
  });

  await db.wallet.update({
    where: { id: wallet.id },
    data: {
      balance: {
        increment: payload.type === TransactionType.CREDIT ? amount : -amount,
      },
    },
  });

  return transaction;
}

async function reconcileWalletBalance(db: WalletDb, walletId: string) {
  const transactions = await db.transaction.findMany({
    where: { walletId },
    select: {
      amount: true,
      type: true,
    },
  });

  const balance = transactions.reduce((sum, transaction) => {
    if (transaction.type === TransactionType.CREDIT)
      return sum + transaction.amount;
    if (transaction.type === TransactionType.DEBIT)
      return sum - transaction.amount;
    return sum;
  }, 0);

  await db.wallet.update({
    where: { id: walletId },
    data: { balance },
  });

  return balance;
}

export async function dedupeWalletLedger(db: WalletDb, user: WalletUser) {
  if ('$transaction' in db) {
    return db.$transaction((tx) => dedupeWalletLedgerInTx(tx, user));
  }

  return dedupeWalletLedgerInTx(db, user);
}

async function dedupeWalletLedgerInTx(db: WalletDb, user: WalletUser) {
  const wallet = await ensureWallet(db, user);

  await db.$queryRaw`SELECT id FROM Wallet WHERE id = ${wallet.id} FOR UPDATE`;

  const transactions = await db.transaction.findMany({
    where: {
      walletId: wallet.id,
      categoryId: {
        not: null,
      },
    },
    orderBy: [{ date: 'asc' }, { createdAt: 'asc' }],
    select: {
      id: true,
      categoryId: true,
      type: true,
    },
  });

  const seen = new Set<string>();
  const duplicateIds: string[] = [];

  for (const transaction of transactions) {
    const key = `${transaction.type}:${transaction.categoryId}`;
    if (seen.has(key)) {
      duplicateIds.push(transaction.id);
    } else {
      seen.add(key);
    }
  }

  if (duplicateIds.length > 0) {
    await db.transaction.deleteMany({
      where: {
        id: {
          in: duplicateIds,
        },
      },
    });
  }

  const balance = await reconcileWalletBalance(db, wallet.id);

  return {
    removedDuplicates: duplicateIds.length,
    balance,
  };
}

export async function recordWalletCredit(
  db: WalletDb,
  user: WalletUser,
  payload: {
    amount: number;
    reference: string;
    description: string;
    currency?: string;
    date?: Date;
  },
) {
  return recordWalletTransaction(db, user, {
    ...payload,
    type: TransactionType.CREDIT,
  });
}

export async function recordWalletDebit(
  db: WalletDb,
  user: WalletUser,
  payload: {
    amount: number;
    reference: string;
    description: string;
    currency?: string;
    date?: Date;
  },
) {
  return recordWalletTransaction(db, user, {
    ...payload,
    type: TransactionType.DEBIT,
  });
}

export async function syncLegacyWalletDebits(db: WalletDb, user: WalletUser) {
  const identifiers = [
    ...(user.userEmail ? [{ email: user.userEmail }] : []),
    ...(user.email ? [{ email: user.email }] : []),
    { pidUser: user.pidUser },
  ];

  const rows = await db.debits.findMany({
    where: {
      OR: identifiers,
      paymentStatus: {
        in: ['DEBITED', 'REFUND_CREDIT'],
      },
    },
    orderBy: { id: 'asc' },
    select: {
      pidDebit: true,
      paymentStatus: true,
      amount: true,
      currency: true,
      serviceDescription: true,
      serviceName: true,
    },
  });

  for (const row of rows) {
    const isRefundCredit =
      String(row.paymentStatus || '').toUpperCase() === 'REFUND_CREDIT';
    const reference = `${isRefundCredit ? 'REFUND' : 'DEBIT'}:${row.pidDebit}`;
    const description =
      row.serviceDescription ||
      row.serviceName ||
      (isRefundCredit ? 'Refund credited to wallet' : 'Wallet debit');

    if (isRefundCredit) {
      await recordWalletCredit(db, user, {
        amount: row.amount,
        reference,
        description,
        currency: row.currency || 'NGN',
      });
    } else {
      await recordWalletDebit(db, user, {
        amount: row.amount,
        reference,
        description,
        currency: row.currency || 'NGN',
      });
    }
  }
}

export async function syncPaystackDedicatedNubanCredits(user: WalletUser) {
  const email = user.userEmail || user.email;
  const paystackSecretKey =
    process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY ||
    process.env.PAYSTACK_SECRET_KEY;
  if (!email) {
    return {
      statusx: 'NO_ACCOUNT',
      customerDetails: null,
      paystackTransactions: [] as PaystackTransaction[],
    };
  }

  if (!paystackSecretKey) {
    return {
      statusx: 'NO_ACCOUNT',
      customerDetails: null,
      paystackTransactions: [] as PaystackTransaction[],
    };
  }

  const customerResponse = await fetch(
    `https://api.paystack.co/customer/${encodeURIComponent(email)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    },
  );
  const customerData = await customerResponse.json();
  const dedicatedAccounts = customerData?.data?.dedicated_accounts;

  if (
    !customerResponse.ok ||
    !Array.isArray(dedicatedAccounts) ||
    dedicatedAccounts.length === 0
  ) {
    return {
      statusx: 'NO_ACCOUNT',
      customerDetails: null,
      paystackTransactions: [] as PaystackTransaction[],
    };
  }

  const dedicatedAccount =
    customerData?.data?.dedicated_account || dedicatedAccounts[0];
  const customerDetails = {
    bankName: dedicatedAccount?.bank?.name || null,
    bankAccountName: dedicatedAccount?.account_name || null,
    bankAccountNumber: dedicatedAccount?.account_number || null,
    currency: dedicatedAccount?.currency || 'NGN',
  };

  const customerId = customerData?.data?.id;
  if (!customerId) {
    return {
      statusx: 'WALLET_READY',
      customerDetails,
      paystackTransactions: [] as PaystackTransaction[],
    };
  }

  const transactionResponse = await fetch(
    `https://api.paystack.co/transaction?customer=${customerId}&perPage=1000`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
      },
      cache: 'no-store',
    },
  );
  const transactionData = await transactionResponse.json();
  const transactions: PaystackTransaction[] = Array.isArray(
    transactionData?.data,
  )
    ? transactionData.data
    : [];
  const walletCredits = transactions.filter(
    (transaction) =>
      String(transaction.channel || '').toLowerCase() === 'dedicated_nuban' &&
      String(transaction.status || '').toLowerCase() === 'success',
  );

  for (const transaction of walletCredits) {
    const reference = `PAYSTACK:${transaction.id || transaction.reference}`;
    await recordWalletCredit(prisma, user, {
      amount: toAmount(transaction.amount) / 100,
      reference,
      description:
        transaction.gateway_response || 'Wallet funding via dedicated account',
      currency: transaction.currency || customerDetails.currency || 'NGN',
      date: transaction.created_at
        ? new Date(transaction.created_at)
        : undefined,
    });
  }

  return {
    statusx: 'WALLET_READY',
    customerDetails,
    paystackTransactions: walletCredits,
  };
}

export async function getWalletLedger(db: WalletDb, user: WalletUser) {
  const wallet = await ensureWallet(db, user);
  const transactions = await db.transaction.findMany({
    where: { walletId: wallet.id },
    orderBy: { date: 'desc' },
  });

  const credits = transactions
    .filter((transaction) => transaction.type === TransactionType.CREDIT)
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const debits = transactions
    .filter((transaction) => transaction.type === TransactionType.DEBIT)
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const balance = credits - debits;

  return {
    wallet: {
      ...wallet,
      balance,
    },
    transactions,
    credits,
    debits,
    balance,
    customerName: walletHolderName(user),
  };
}
