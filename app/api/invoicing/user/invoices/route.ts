import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';

type SqlRow = Record<string, unknown>;

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { statusx: 'ERROR', message: 'Unauthorized' },
        { status: 401 },
      );
    }

    const payload = verifyToken(token) as { pidUser?: string } | null;
    if (!payload?.pidUser) {
      return NextResponse.json(
        { statusx: 'ERROR', message: 'Unauthorized' },
        { status: 401 },
      );
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
      return NextResponse.json(
        { statusx: 'ERROR', message: 'Unauthorized' },
        { status: 401 },
      );
    }

    const emailSet = [user.userEmail, user.email]
      .filter((x): x is string => Boolean(x))
      .map((x) => x.trim().toLowerCase());

    const emailConditions =
      emailSet.length > 0
        ? Prisma.sql` OR ${Prisma.join(
            emailSet.map(
              (email) =>
                Prisma.sql`LOWER(COALESCE(customerEmail, '')) = ${email}`,
            ),
            ' OR ',
          )}`
        : Prisma.empty;

    const invoices = await prisma.$queryRaw<SqlRow[]>(Prisma.sql`
      SELECT
        pidInvoice,
        invoiceNumber,
        pidUser,
        linkedRequestId,
        customerEmail,
        status,
        currency,
        grandTotal,
        amountPaid,
        balanceDue,
        issuedAt,
        createdAt
      FROM invoices
      WHERE pidUser = ${user.pidUser}
      ${emailConditions}
      ORDER BY createdAt DESC
    `);

    const invoiceIds = invoices
      .map((inv) => String(inv.pidInvoice || '').trim())
      .filter(Boolean);

    let accessTokens: SqlRow[] = [];
    let claims: SqlRow[] = [];

    if (invoiceIds.length > 0) {
      try {
        accessTokens = await prisma.$queryRaw<SqlRow[]>(Prisma.sql`
          SELECT
            pidInvoice,
            accessToken,
            expiresAt,
            createdAt
          FROM invoice_access_tokens
          WHERE pidInvoice IN (${Prisma.join(invoiceIds)})
            AND revokedAt IS NULL
            AND expiresAt > NOW(3)
          ORDER BY createdAt DESC
        `);
      } catch (error) {
        console.warn('invoice_access_tokens lookup skipped:', error);
      }

      try {
        claims = await prisma.$queryRaw<SqlRow[]>(Prisma.sql`
          SELECT
            pidClaim,
            pidInvoice,
            claimedAmount,
            currency,
            status,
            paymentReference,
            claimedAt,
            createdAt
          FROM invoice_payment_claims
          WHERE pidInvoice IN (${Prisma.join(invoiceIds)})
          ORDER BY claimedAt DESC, createdAt DESC
        `);
      } catch (error) {
        console.warn('invoice_payment_claims lookup skipped:', error);
      }
    }

    const latestTokenByInvoice = new Map<string, string>();
    for (const row of accessTokens) {
      const invoiceId = String(row.pidInvoice || '').trim();
      const accessToken = String(row.accessToken || '').trim();
      if (!invoiceId || !accessToken || latestTokenByInvoice.has(invoiceId))
        continue;
      latestTokenByInvoice.set(invoiceId, accessToken);
    }

    const claimsByInvoice = new Map<string, SqlRow[]>();
    for (const claim of claims) {
      const invoiceId = String(claim.pidInvoice || '').trim();
      if (!invoiceId) continue;
      const existing = claimsByInvoice.get(invoiceId) || [];
      existing.push(claim);
      claimsByInvoice.set(invoiceId, existing);
    }

    const data = invoices.map((inv) => {
      const invoiceId = String(inv.pidInvoice || '').trim();
      const invoiceClaims = claimsByInvoice.get(invoiceId) || [];

      return {
        ...inv,
        accessToken: latestTokenByInvoice.get(invoiceId) || null,
        paymentClaimsCount: invoiceClaims.length,
        latestPaymentClaimStatus:
          invoiceClaims.length > 0
            ? String(invoiceClaims[0].status || '')
            : null,
      };
    });

    return NextResponse.json({ statusx: 'SUCCESS', data });
  } catch (error: unknown) {
    console.error('GET /api/invoicing/user/invoices error', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { statusx: 'ERROR', message: 'Failed to load invoices', error: message },
      { status: 500 },
    );
  }
}
