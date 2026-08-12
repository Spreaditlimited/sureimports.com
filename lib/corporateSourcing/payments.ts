import { createHash, randomBytes } from 'node:crypto';

import { prisma } from '@/lib/prisma';

export type CorporateSourcingPayment = {
  pidPayment: string;
  pidUser: string | null;
  requestId: string | null;
  email: string;
  firstName: string | null;
  lastName: string | null;
  billingCountry: string | null;
  paymentProvider: string;
  providerReference: string | null;
  providerCaptureReference: string | null;
  status: string;
  amountMinor: number;
  currency: string;
  submissionTokenHash: string;
  paidAt: Date | null;
  consumedAt: Date | null;
};

export function corporateSubmissionToken() {
  return randomBytes(48).toString('base64url');
}

export function hashCorporateSubmissionToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export async function ensureCorporateSourcingPayments() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS corporate_sourcing_research_payments (
      id INT NOT NULL AUTO_INCREMENT,
      pidPayment VARCHAR(80) NOT NULL,
      pidUser VARCHAR(191) NULL,
      requestId VARCHAR(80) NULL,
      email VARCHAR(255) NOT NULL,
      firstName VARCHAR(120) NULL,
      lastName VARCHAR(120) NULL,
      billingCountry VARCHAR(120) NULL,
      paymentProvider VARCHAR(40) NOT NULL,
      providerReference VARCHAR(160) NULL,
      providerCaptureReference VARCHAR(160) NULL,
      status VARCHAR(40) NOT NULL DEFAULT 'pending',
      amountMinor INT NOT NULL,
      currency VARCHAR(10) NOT NULL,
      submissionTokenHash VARCHAR(64) NOT NULL,
      paidAt DATETIME(3) NULL,
      consumedAt DATETIME(3) NULL,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      UNIQUE KEY corporate_sourcing_payment_pid_key (pidPayment),
      UNIQUE KEY corporate_sourcing_payment_request_key (requestId),
      UNIQUE KEY corporate_sourcing_payment_provider_key (providerReference),
      UNIQUE KEY corporate_sourcing_payment_capture_key (providerCaptureReference),
      KEY corporate_sourcing_payment_email_status_idx (email, status),
      PRIMARY KEY (id)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  `);
}

export async function getCorporateSourcingPayment(pidPayment: string) {
  await ensureCorporateSourcingPayments();
  const rows = await prisma.$queryRaw<CorporateSourcingPayment[]>`
    SELECT * FROM corporate_sourcing_research_payments
    WHERE pidPayment = ${pidPayment}
    LIMIT 1
  `;
  return rows[0] || null;
}

export async function confirmCorporateSourcingPayment(input: {
  pidPayment: string;
  paidAt?: Date | null;
  providerCaptureReference?: string | null;
}) {
  await ensureCorporateSourcingPayments();
  await prisma.$executeRaw`
    UPDATE corporate_sourcing_research_payments
    SET status = 'paid',
        paidAt = COALESCE(paidAt, ${input.paidAt || new Date()}),
        providerCaptureReference = COALESCE(${input.providerCaptureReference || null}, providerCaptureReference),
        updatedAt = ${new Date()}
    WHERE pidPayment = ${input.pidPayment}
      AND status NOT IN ('refunded', 'reversed', 'disputed')
  `;
  return getCorporateSourcingPayment(input.pidPayment);
}
