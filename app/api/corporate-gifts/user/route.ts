import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token) as { pidUser?: string } | null;
    if (!payload?.pidUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.users.findUnique({
      where: { pidUser: payload.pidUser },
      select: {
        pidUser: true,
        userEmail: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const emailSet = [user.userEmail, user.email]
      .filter((x): x is string => Boolean(x))
      .map((x) => x.trim().toLowerCase());

    const emailConditions =
      emailSet.length > 0
        ? Prisma.sql` OR ${Prisma.join(
            emailSet.map((email) => Prisma.sql`LOWER(contactEmail) = ${email}`),
            ' OR ',
          )}`
        : Prisma.empty;

    const requests = await prisma.$queryRaw<
      Array<Record<string, any>>
    >(Prisma.sql`
      SELECT *
      FROM corporate_gift_request
      WHERE pidUser = ${user.pidUser}
      ${emailConditions}
      ORDER BY updatedAt DESC
    `);

    const requestIds = requests.map((row: any) => row.pidRequest).filter(Boolean);

    let paymentRecords: Array<Record<string, any>> = [];
    let issuedInvoices: Array<Record<string, any>> = [];
    let invoiceAccessTokens: Array<Record<string, any>> = [];
    let invoicePaymentClaims: Array<Record<string, any>> = [];
    let walletAndCardPayments: Array<Record<string, any>> = [];
    let bankPayments: Array<Record<string, any>> = [];

    if (requestIds.length > 0) {
      paymentRecords = await prisma.payment_records.findMany({
        where: {
          OR: [
            { pid_order: { in: requestIds } },
            { ref_id: { in: requestIds } },
            { pid_user: user.pidUser },
            { service_type: { contains: 'CORPORATE' } },
          ],
        },
        orderBy: { createdAt: 'desc' },
      });

      issuedInvoices = await prisma.$queryRaw<Array<Record<string, any>>>(
        Prisma.sql`
          SELECT
            pidInvoice,
            invoiceNumber,
            pidUser,
            linkedRequestId,
            status,
            currency,
            grandTotal,
            amountPaid,
            balanceDue,
            createdAt,
            issuedAt
          FROM invoices
          WHERE linkedRequestId IN (${Prisma.join(requestIds)})
            OR pidUser = ${user.pidUser}
          ORDER BY createdAt DESC
        `,
      );

      const issuedInvoiceIds = issuedInvoices
        .map((inv) => String(inv.pidInvoice || '').trim())
        .filter(Boolean);

      if (issuedInvoiceIds.length > 0) {
        try {
          invoiceAccessTokens = await prisma.$queryRaw<Array<Record<string, any>>>(
            Prisma.sql`
              SELECT
                pidInvoice,
                accessToken,
                expiresAt,
                createdAt
              FROM invoice_access_tokens
              WHERE pidInvoice IN (${Prisma.join(issuedInvoiceIds)})
                AND revokedAt IS NULL
                AND expiresAt > NOW(3)
              ORDER BY createdAt DESC
            `,
          );
        } catch (error) {
          console.warn('invoice_access_tokens lookup skipped:', error);
          invoiceAccessTokens = [];
        }

        try {
          invoicePaymentClaims = await prisma.$queryRaw<Array<Record<string, any>>>(
            Prisma.sql`
              SELECT
                pidClaim,
                pidInvoice,
                claimedAmount,
                currency,
                selectedBankAccountId,
                selectedBankAccountJson,
                paymentReference,
                note,
                status,
                claimedAt,
                createdAt
              FROM invoice_payment_claims
              WHERE pidInvoice IN (${Prisma.join(issuedInvoiceIds)})
              ORDER BY claimedAt DESC
            `,
          );
        } catch (error) {
          console.warn('invoice_payment_claims lookup skipped:', error);
          invoicePaymentClaims = [];
        }
      }

      walletAndCardPayments = await prisma.payments.findMany({
        where: {
          serviceID: { in: requestIds },
        },
        orderBy: { createdAt: 'desc' },
      });

      bankPayments = await prisma.bank_payment.findMany({
        where: {
          pidOrder: { in: requestIds },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    const normalize = (value: unknown) =>
      String(value || '')
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '');
    const latestTokenByInvoiceId = new Map<string, string>();
    for (const tokenRow of invoiceAccessTokens) {
      const invoiceId = String(tokenRow.pidInvoice || '').trim();
      const accessToken = String(tokenRow.accessToken || '').trim();
      if (!invoiceId || !accessToken || latestTokenByInvoiceId.has(invoiceId)) continue;
      latestTokenByInvoiceId.set(invoiceId, accessToken);
    }

    const enriched = requests.map((requestRow: any) => {
      const pid = requestRow.pidRequest;
      const normalizedPid = normalize(pid);
      const linkedInvoiceIds = issuedInvoices
        .filter((inv) => String(inv.linkedRequestId || '') === pid)
        .map((inv) => String(inv.pidInvoice || '').trim())
        .filter(Boolean);
      const legacyInvoices = paymentRecords.filter(
        (p) => {
          const pidOrder = String(p.pid_order || '');
          const refId = String(p.ref_id || '');
          const ext1 = String(p.ext1 || '');
          const ext2 = String(p.ext2 || '');
          const normalizedPidOrder = normalize(pidOrder);
          const normalizedRefId = normalize(refId);
          const normalizedExt1 = normalize(ext1);
          const normalizedExt2 = normalize(ext2);
          const hasDirectMatch = pidOrder === pid || refId === pid;
          const hasNormalizedMatch =
            (normalizedPidOrder && normalizedPidOrder.includes(normalizedPid)) ||
            (normalizedRefId && normalizedRefId.includes(normalizedPid)) ||
            (normalizedExt1 && normalizedExt1.includes(normalizedPid)) ||
            (normalizedExt2 && normalizedExt2.includes(normalizedPid)) ||
            normalizedPid.includes(normalizedPidOrder) ||
            normalizedPid.includes(normalizedRefId) ||
            normalizedPid.includes(normalizedExt1) ||
            normalizedPid.includes(normalizedExt2);
          return hasDirectMatch || hasNormalizedMatch;
        },
      );
      const invoicingSystemInvoices = issuedInvoices
        .filter((inv) => String(inv.linkedRequestId || '') === pid)
        .map((inv) => ({
          pidPayment: String(inv.pidInvoice || ''),
          pidInvoice: String(inv.pidInvoice || ''),
          amount: String(inv.grandTotal || '0'),
          currency_type: String(inv.currency || 'NGN'),
          payment_status: String(inv.status || 'ISSUED'),
          payment_type: 'INVOICE',
          createdAt: inv.createdAt || null,
          issuedAt: inv.issuedAt || null,
          invoiceNumber: inv.invoiceNumber || null,
          accessToken: latestTokenByInvoiceId.get(String(inv.pidInvoice || '').trim()) || null,
          source: 'INVOICING_SYSTEM',
        }));

      const invoices = [...invoicingSystemInvoices, ...legacyInvoices];
      const payments = [
        ...walletAndCardPayments.filter((p) => p.serviceID === pid),
        ...bankPayments.filter((p) => p.pidOrder === pid),
        ...invoicePaymentClaims
          .filter((claim) => linkedInvoiceIds.includes(String(claim.pidInvoice || '').trim()))
          .map((claim) => ({
            pidPayment: claim.pidClaim,
            amount: claim.claimedAmount,
            currency: claim.currency,
            paymentType: 'INVOICE_CLAIM',
            paymentStatus: claim.status,
            paymentReference: claim.paymentReference,
            note: claim.note,
            selectedBankAccountId: claim.selectedBankAccountId,
            selectedBankAccountJson: claim.selectedBankAccountJson,
            claimedAt: claim.claimedAt,
            createdAt: claim.createdAt,
          })),
      ];

      return {
        ...requestRow,
        invoices,
        payments,
      };
    });

    return NextResponse.json({
      statusx: 'SUCCESS',
      data: enriched,
    });
  } catch (error) {
    console.error('Failed to fetch user corporate gift requests:', error);
    return NextResponse.json(
      { statusx: 'ERROR', message: 'Failed to fetch requests' },
      { status: 500 },
    );
  }
}
