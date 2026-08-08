import randomGenerator from '@/lib/helpers/randomGenerator';
import { prisma } from '@/lib/prisma';

export type IntelligenceSearchRequest = {
  pidSearch: string;
  pidUser: string;
  email: string;
  query: string;
  originalQuery: string | null;
  confirmedAt: Date | null;
  targetSupplierCount: number;
  notes: string | null;
  status: string;
  creditCost: number;
  creditReserved: boolean;
  relatedPidJob: string | null;
  adminNotes: string | null;
  progressStage: string | null;
  progressPercent: number | null;
  resultSlug: string | null;
  creditSource: string | null;
  createdAt: Date;
  updatedAt: Date | null;
};

export type ExistingNicheSearchMatch = {
  name: string;
  slug: string;
  supplierCount: number;
};

export type IntelligenceCreditAccount = {
  pidAccount: string;
  pidUser: string;
  balance: number;
  lifetimeGranted: number;
  lifetimeUsed: number;
  createdAt: Date;
  updatedAt: Date | null;
};

export const SEARCH_CREDIT_COST = 1;
export const FREE_INITIAL_SEARCH_CREDITS = 1;
export const PRO_MONTHLY_SEARCH_CREDITS = 3;

function clean(value: unknown, max = 4000) {
  return String(value || '')
    .trim()
    .slice(0, max);
}

async function ensureCreditTables() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS intelligence_credit_accounts (
      id INT NOT NULL AUTO_INCREMENT,
      pidAccount VARCHAR(80) NOT NULL,
      pidUser VARCHAR(80) NOT NULL,
      balance INT NOT NULL DEFAULT 0,
      lifetimeGranted INT NOT NULL DEFAULT 0,
      lifetimeUsed INT NOT NULL DEFAULT 0,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NULL,
      UNIQUE KEY intelligence_credit_accounts_pid_key (pidAccount),
      UNIQUE KEY intelligence_credit_accounts_user_key (pidUser),
      PRIMARY KEY (id)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS intelligence_credit_transactions (
      id INT NOT NULL AUTO_INCREMENT,
      pidTransaction VARCHAR(80) NOT NULL,
      pidUser VARCHAR(80) NOT NULL,
      amount INT NOT NULL,
      reason VARCHAR(120) NOT NULL,
      reference VARCHAR(160) NULL,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      UNIQUE KEY intelligence_credit_transactions_pid_key (pidTransaction),
      KEY intelligence_credit_transactions_user_idx (pidUser),
      KEY intelligence_credit_transactions_reference_idx (reference),
      PRIMARY KEY (id)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS intelligence_search_requests (
      id INT NOT NULL AUTO_INCREMENT,
      pidSearch VARCHAR(80) NOT NULL,
      pidUser VARCHAR(80) NOT NULL,
      email VARCHAR(255) NOT NULL,
      query VARCHAR(220) NOT NULL,
      originalQuery VARCHAR(220) NULL,
      confirmedAt DATETIME(3) NULL,
      targetSupplierCount INT NOT NULL DEFAULT 3,
      notes LONGTEXT NULL,
      status VARCHAR(40) NOT NULL DEFAULT 'awaiting_admin',
      creditCost INT NOT NULL DEFAULT 1,
      creditReserved TINYINT(1) NOT NULL DEFAULT 1,
      relatedPidJob VARCHAR(80) NULL,
      adminNotes LONGTEXT NULL,
      progressStage VARCHAR(180) NULL,
      progressPercent INT NOT NULL DEFAULT 0,
      resultSlug VARCHAR(180) NULL,
      creditSource VARCHAR(40) NULL,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NULL,
      UNIQUE KEY intelligence_search_requests_pid_key (pidSearch),
      KEY intelligence_search_requests_user_idx (pidUser),
      KEY intelligence_search_requests_status_idx (status),
      KEY intelligence_search_requests_job_idx (relatedPidJob),
      PRIMARY KEY (id)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  `);

  for (const statement of [
    'ALTER TABLE intelligence_search_requests ADD COLUMN progressStage VARCHAR(180) NULL',
    'ALTER TABLE intelligence_search_requests ADD COLUMN progressPercent INT NOT NULL DEFAULT 0',
    'ALTER TABLE intelligence_search_requests ADD COLUMN resultSlug VARCHAR(180) NULL',
    'ALTER TABLE intelligence_search_requests ADD COLUMN creditSource VARCHAR(40) NULL',
    'ALTER TABLE intelligence_search_requests ADD COLUMN originalQuery VARCHAR(220) NULL',
    'ALTER TABLE intelligence_search_requests ADD COLUMN confirmedAt DATETIME(3) NULL',
  ]) {
    try {
      await prisma.$executeRawUnsafe(statement);
    } catch {
      // Existing databases may already have these columns.
    }
  }
}

async function getNextCreditSource(pidUser: string) {
  const rows = await prisma.$queryRaw<
    Array<{
      freeGranted: bigint | number | null;
      paidGranted: bigint | number | null;
      subscriptionGranted: bigint | number | null;
      freeUsed: bigint | number | null;
      paidUsed: bigint | number | null;
      subscriptionUsed: bigint | number | null;
    }>
  >`
    SELECT
      COALESCE(SUM(CASE WHEN t.reason = 'free_signup_credit' THEN t.amount ELSE 0 END), 0) AS freeGranted,
      COALESCE(SUM(CASE WHEN t.reason = 'extra_search_credits_purchase' THEN t.amount ELSE 0 END), 0) AS paidGranted,
      COALESCE(SUM(CASE WHEN t.reason IN ('starter_monthly_search_credits', 'pro_monthly_search_credits') THEN t.amount ELSE 0 END), 0) AS subscriptionGranted,
      (
        SELECT COUNT(*)
        FROM intelligence_search_requests r
        WHERE r.pidUser = ${pidUser}
          AND r.creditCost > 0
          AND r.creditSource = 'free'
          AND r.status NOT IN ('rejected', 'failed', 'cancelled', 'invalid')
      ) AS freeUsed,
      (
        SELECT COUNT(*)
        FROM intelligence_search_requests r
        WHERE r.pidUser = ${pidUser}
          AND r.creditCost > 0
          AND r.creditSource = 'paid'
          AND r.status NOT IN ('rejected', 'failed', 'cancelled', 'invalid')
      ) AS paidUsed,
      (
        SELECT COUNT(*)
        FROM intelligence_search_requests r
        WHERE r.pidUser = ${pidUser}
          AND r.creditCost > 0
          AND r.creditSource = 'subscription'
          AND r.status NOT IN ('rejected', 'failed', 'cancelled', 'invalid')
      ) AS subscriptionUsed
    FROM intelligence_credit_transactions t
    WHERE t.pidUser = ${pidUser}
      AND t.amount > 0
  `;
  const row = rows[0];
  const paidRemaining =
    Number(row?.paidGranted || 0) - Number(row?.paidUsed || 0);
  if (paidRemaining > 0) return 'paid';

  const subscriptionRemaining =
    Number(row?.subscriptionGranted || 0) - Number(row?.subscriptionUsed || 0);
  if (subscriptionRemaining > 0) return 'subscription';

  const freeRemaining =
    Number(row?.freeGranted || 0) - Number(row?.freeUsed || 0);
  if (freeRemaining > 0) return 'free';

  return 'paid';
}

export async function getOrCreateIntelligenceCreditAccount(
  pidUser?: string | null,
) {
  if (!pidUser) return null;
  await ensureCreditTables();

  const rows = await prisma.$queryRaw<IntelligenceCreditAccount[]>`
    SELECT pidAccount, pidUser, balance, lifetimeGranted, lifetimeUsed, createdAt, updatedAt
    FROM intelligence_credit_accounts
    WHERE pidUser = ${pidUser}
    LIMIT 1
  `;

  if (rows[0]) return rows[0];

  const pidAccount = `INTCRED${randomGenerator(12)}`;
  await prisma.$executeRaw`
    INSERT INTO intelligence_credit_accounts (
      pidAccount,
      pidUser,
      balance,
      lifetimeGranted,
      lifetimeUsed,
      createdAt,
      updatedAt
    ) VALUES (
      ${pidAccount},
      ${pidUser},
      ${FREE_INITIAL_SEARCH_CREDITS},
      ${FREE_INITIAL_SEARCH_CREDITS},
      0,
      ${new Date()},
      ${new Date()}
    )
  `;

  await prisma.$executeRaw`
    INSERT INTO intelligence_credit_transactions (
      pidTransaction,
      pidUser,
      amount,
      reason,
      reference,
      createdAt
    ) VALUES (
      ${`INTCTX${randomGenerator(12)}`},
      ${pidUser},
      ${FREE_INITIAL_SEARCH_CREDITS},
      'free_signup_credit',
      'freemium',
      ${new Date()}
    )
  `;

  return getOrCreateIntelligenceCreditAccount(pidUser);
}

export async function grantIntelligenceCredits(input: {
  pidUser: string;
  amount: number;
  reason: string;
  reference?: string | null;
}) {
  if (!input.pidUser || input.amount <= 0) return false;
  await ensureCreditTables();
  await getOrCreateIntelligenceCreditAccount(input.pidUser);

  if (input.reference) {
    const existing = await prisma.$queryRaw<Array<{ total: bigint }>>`
      SELECT COUNT(*) AS total
      FROM intelligence_credit_transactions
      WHERE pidUser = ${input.pidUser}
        AND reference = ${input.reference}
        AND reason = ${input.reason}
    `;
    if (Number(existing[0]?.total || 0) > 0) return false;
  }

  await prisma.$executeRaw`
    UPDATE intelligence_credit_accounts
    SET
      balance = balance + ${input.amount},
      lifetimeGranted = lifetimeGranted + ${input.amount},
      updatedAt = ${new Date()}
    WHERE pidUser = ${input.pidUser}
  `;

  await prisma.$executeRaw`
    INSERT INTO intelligence_credit_transactions (
      pidTransaction,
      pidUser,
      amount,
      reason,
      reference,
      createdAt
    ) VALUES (
      ${`INTCTX${randomGenerator(12)}`},
      ${input.pidUser},
      ${input.amount},
      ${clean(input.reason, 120)},
      ${clean(input.reference, 160) || null},
      ${new Date()}
    )
  `;

  return true;
}

export async function createSearchRequestWithReservedCredit(input: {
  pidUser: string;
  email: string;
  query: string;
  originalQuery: string;
  targetSupplierCount: number;
  notes?: string | null;
}) {
  await ensureCreditTables();
  const account = await getOrCreateIntelligenceCreditAccount(input.pidUser);

  if (!account || account.balance < SEARCH_CREDIT_COST) {
    throw new Error('You do not have enough search credits for this request.');
  }

  const pidSearch = `INTSRCH${randomGenerator(12)}`;
  const creditSource = await getNextCreditSource(input.pidUser);

  await prisma.$transaction(async (tx) => {
    const accounts = await tx.$queryRaw<IntelligenceCreditAccount[]>`
      SELECT pidAccount, pidUser, balance, lifetimeGranted, lifetimeUsed, createdAt, updatedAt
      FROM intelligence_credit_accounts
      WHERE pidUser = ${input.pidUser}
      LIMIT 1
      FOR UPDATE
    `;
    const latestAccount = accounts[0];
    if (!latestAccount || latestAccount.balance < SEARCH_CREDIT_COST) {
      throw new Error(
        'You do not have enough search credits for this request.',
      );
    }

    await tx.$executeRaw`
      UPDATE intelligence_credit_accounts
      SET
        balance = balance - ${SEARCH_CREDIT_COST},
        lifetimeUsed = lifetimeUsed + ${SEARCH_CREDIT_COST},
        updatedAt = ${new Date()}
      WHERE pidUser = ${input.pidUser}
    `;

    await tx.$executeRaw`
      INSERT INTO intelligence_credit_transactions (
        pidTransaction,
        pidUser,
        amount,
        reason,
        reference,
        createdAt
      ) VALUES (
        ${`INTCTX${randomGenerator(12)}`},
        ${input.pidUser},
        ${-SEARCH_CREDIT_COST},
        'search_request_reserved',
        ${pidSearch},
        ${new Date()}
      )
    `;

    await tx.$executeRaw`
      INSERT INTO intelligence_search_requests (
        pidSearch,
        pidUser,
        email,
        query,
        originalQuery,
        confirmedAt,
        targetSupplierCount,
        notes,
        status,
        creditCost,
        creditReserved,
        progressStage,
        progressPercent,
        resultSlug,
        creditSource,
        createdAt,
        updatedAt
      ) VALUES (
        ${pidSearch},
        ${input.pidUser},
        ${clean(input.email, 255)},
        ${clean(input.query, 220)},
        ${clean(input.originalQuery, 220)},
        ${new Date()},
        ${Math.min(10, Math.max(3, Math.round(input.targetSupplierCount || 3)))},
        ${clean(input.notes) || null},
        'awaiting_admin',
        ${SEARCH_CREDIT_COST},
        1,
        'Search request received',
        5,
        NULL,
        ${creditSource},
        ${new Date()},
        ${new Date()}
      )
    `;
  });

  return pidSearch;
}

export async function createExistingNicheSearchResultWithConsumedCredit(input: {
  pidUser: string;
  email: string;
  query: string;
  originalQuery: string;
  targetSupplierCount: number;
  notes?: string | null;
  matches: ExistingNicheSearchMatch[];
}) {
  await ensureCreditTables();
  const account = await getOrCreateIntelligenceCreditAccount(input.pidUser);

  if (!account || account.balance < SEARCH_CREDIT_COST) {
    throw new Error('You do not have enough search credits for this request.');
  }

  const pidSearch = `INTSRCH${randomGenerator(12)}`;
  const creditSource = await getNextCreditSource(input.pidUser);
  const resultSummary = input.matches
    .map((match) => `${match.name} (${match.supplierCount} suppliers)`)
    .join(', ');

  await prisma.$transaction(async (tx) => {
    const accounts = await tx.$queryRaw<IntelligenceCreditAccount[]>`
      SELECT pidAccount, pidUser, balance, lifetimeGranted, lifetimeUsed, createdAt, updatedAt
      FROM intelligence_credit_accounts
      WHERE pidUser = ${input.pidUser}
      LIMIT 1
      FOR UPDATE
    `;
    const latestAccount = accounts[0];
    if (!latestAccount || latestAccount.balance < SEARCH_CREDIT_COST) {
      throw new Error(
        'You do not have enough search credits for this request.',
      );
    }

    await tx.$executeRaw`
      UPDATE intelligence_credit_accounts
      SET
        balance = balance - ${SEARCH_CREDIT_COST},
        lifetimeUsed = lifetimeUsed + ${SEARCH_CREDIT_COST},
        updatedAt = ${new Date()}
      WHERE pidUser = ${input.pidUser}
    `;

    await tx.$executeRaw`
      INSERT INTO intelligence_credit_transactions (
        pidTransaction,
        pidUser,
        amount,
        reason,
        reference,
        createdAt
      ) VALUES (
        ${`INTCTX${randomGenerator(12)}`},
        ${input.pidUser},
        ${-SEARCH_CREDIT_COST},
        'search_existing_category_result',
        ${pidSearch},
        ${new Date()}
      )
    `;

    await tx.$executeRaw`
      INSERT INTO intelligence_search_requests (
        pidSearch,
        pidUser,
        email,
        query,
        originalQuery,
        confirmedAt,
        targetSupplierCount,
        notes,
        status,
        creditCost,
        creditReserved,
        adminNotes,
        progressStage,
        progressPercent,
        resultSlug,
        creditSource,
        createdAt,
        updatedAt
      ) VALUES (
        ${pidSearch},
        ${input.pidUser},
        ${clean(input.email, 255)},
        ${clean(input.query, 220)},
        ${clean(input.originalQuery, 220)},
        ${new Date()},
        ${Math.min(10, Math.max(3, Math.round(input.targetSupplierCount || 3)))},
        ${clean(input.notes) || null},
        'fulfilled_existing',
        ${SEARCH_CREDIT_COST},
        0,
        ${`Result delivered: ${resultSummary}`},
        'Existing supplier intelligence returned',
        100,
        ${input.matches[0]?.slug || null},
        ${creditSource},
        ${new Date()},
        ${new Date()}
      )
    `;
  });

  return pidSearch;
}

export async function createExistingNicheSearchLog(input: {
  pidUser: string;
  email: string;
  query: string;
  originalQuery: string;
  targetSupplierCount: number;
  notes?: string | null;
  matches: ExistingNicheSearchMatch[];
}) {
  await ensureCreditTables();

  const pidSearch = `INTSRCH${randomGenerator(12)}`;
  const resultSummary = input.matches
    .map((match) => `${match.name} (${match.supplierCount} suppliers)`)
    .join(', ');

  await prisma.$executeRaw`
    INSERT INTO intelligence_search_requests (
      pidSearch,
      pidUser,
      email,
      query,
      originalQuery,
      confirmedAt,
      targetSupplierCount,
      notes,
      status,
      creditCost,
      creditReserved,
      adminNotes,
      progressStage,
      progressPercent,
      resultSlug,
      creditSource,
      createdAt,
      updatedAt
    ) VALUES (
      ${pidSearch},
      ${input.pidUser},
      ${clean(input.email, 255)},
      ${clean(input.query, 220)},
      ${clean(input.originalQuery, 220)},
      ${new Date()},
      ${Math.min(10, Math.max(3, Math.round(input.targetSupplierCount || 3)))},
      ${clean(input.notes) || null},
      'fulfilled_existing',
      0,
      0,
      ${`Subscriber result delivered: ${resultSummary}`},
      'Existing supplier intelligence returned',
      100,
      ${input.matches[0]?.slug || null},
      'subscription',
      ${new Date()},
      ${new Date()}
    )
  `;

  return pidSearch;
}

export async function refundReservedSearchCredit(
  pidSearch: string,
  reason: string,
) {
  await ensureCreditTables();

  return prisma.$transaction(async (tx) => {
    const requests = await tx.$queryRaw<IntelligenceSearchRequest[]>`
      SELECT
        pidSearch,
        pidUser,
        email,
        query,
        originalQuery,
        confirmedAt,
        targetSupplierCount,
        notes,
        status,
        creditCost,
        creditReserved,
        relatedPidJob,
        adminNotes,
        progressStage,
        progressPercent,
        resultSlug,
        creditSource,
        createdAt,
        updatedAt
      FROM intelligence_search_requests
      WHERE pidSearch = ${pidSearch}
      LIMIT 1
      FOR UPDATE
    `;
    const request = requests[0];
    if (!request || !request.creditReserved || request.creditCost <= 0) {
      return false;
    }

    const released = await tx.$executeRaw`
      UPDATE intelligence_search_requests
      SET
        creditReserved = 0,
        adminNotes = ${clean(reason, 4000)},
        updatedAt = ${new Date()}
      WHERE pidSearch = ${request.pidSearch}
        AND creditReserved = 1
    `;
    if (released === 0) return false;

    await tx.$executeRaw`
      UPDATE intelligence_credit_accounts
      SET
        balance = balance + ${request.creditCost},
        lifetimeUsed = GREATEST(0, lifetimeUsed - ${request.creditCost}),
        updatedAt = ${new Date()}
      WHERE pidUser = ${request.pidUser}
    `;

    await tx.$executeRaw`
      INSERT INTO intelligence_credit_transactions (
        pidTransaction,
        pidUser,
        amount,
        reason,
        reference,
        createdAt
      ) VALUES (
        ${`INTCTX${randomGenerator(12)}`},
        ${request.pidUser},
        ${request.creditCost},
        'search_request_refunded',
        ${request.pidSearch},
        ${new Date()}
      )
    `;

    return true;
  });
}

export async function findReusableUserSearchRequest(input: {
  pidUser: string;
  query: string;
}) {
  await ensureCreditTables();

  const rows = await prisma.$queryRaw<IntelligenceSearchRequest[]>`
    SELECT
      pidSearch,
      pidUser,
      email,
      query,
      originalQuery,
      confirmedAt,
      targetSupplierCount,
      notes,
      status,
      creditCost,
      creditReserved,
      relatedPidJob,
      adminNotes,
      progressStage,
      progressPercent,
      resultSlug,
      creditSource,
      createdAt,
      updatedAt
    FROM intelligence_search_requests
    WHERE pidUser = ${input.pidUser}
      AND LOWER(TRIM(query)) = LOWER(TRIM(${clean(input.query, 220)}))
      AND status IN (
        'awaiting_admin',
        'approved_to_run',
        'queued',
        'running',
        'awaiting_approval',
        'approved',
        'fulfilled_existing'
      )
    ORDER BY createdAt DESC
    LIMIT 1
  `;

  return rows[0] || null;
}

export async function getUserIntelligenceSearchRequests(
  pidUser?: string | null,
) {
  if (!pidUser) return [];
  await ensureCreditTables();

  return prisma.$queryRaw<IntelligenceSearchRequest[]>`
    SELECT
      pidSearch,
      pidUser,
      email,
      query,
      originalQuery,
      confirmedAt,
      targetSupplierCount,
      notes,
      status,
      creditCost,
      creditReserved,
      relatedPidJob,
      adminNotes,
      progressStage,
      progressPercent,
      resultSlug,
      creditSource,
      createdAt,
      updatedAt
    FROM intelligence_search_requests
    WHERE pidUser = ${pidUser}
    ORDER BY createdAt DESC
    LIMIT 20
  `;
}
