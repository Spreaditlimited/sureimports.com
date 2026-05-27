import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import randomGenerator from '@/lib/helpers/randomGenerator';

const formatNaira = (value: number) =>
  value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pidUser, pidRequest, amount, pidPaymentRecord } = body || {};

    if (!pidUser || !pidRequest || !amount) {
      return NextResponse.json(
        { statusx: 'FAILED', message: 'pidUser, pidRequest and amount are required' },
        { status: 400 },
      );
    }

    const payAmount = Number(amount);
    if (!Number.isFinite(payAmount) || payAmount <= 0) {
      return NextResponse.json(
        { statusx: 'FAILED', message: 'Invalid amount' },
        { status: 400 },
      );
    }

    const user = await prisma.users.findUnique({
      where: { pidUser: String(pidUser) },
    });
    if (!user?.userEmail) {
      return NextResponse.json(
        { statusx: 'FAILED', message: 'User not found' },
        { status: 404 },
      );
    }

    const project = await prisma.corporate_gift_request.findFirst({
      where: { pidRequest: String(pidRequest), pidUser: String(pidUser) },
    });
    if (!project) {
      return NextResponse.json(
        { statusx: 'FAILED', message: 'Corporate project not found' },
        { status: 404 },
      );
    }

    let linkedLegacyInvoice: { currency_type: string | null } | null = null;
    let linkedInvoicingInvoice:
      | {
          pidInvoice: string;
          status: string | null;
          currency: string | null;
          grandTotal: string | number | null;
          amountPaid: string | number | null;
          balanceDue: string | number | null;
        }
      | null = null;

    // Wallet balance is NGN; only allow NGN-denominated corporate invoices.
    if (pidPaymentRecord) {
      linkedLegacyInvoice = await prisma.payment_records.findFirst({
        where: {
          pidPayment: String(pidPaymentRecord),
          pid_order: String(pidRequest),
        },
        select: {
          currency_type: true,
        },
      });

      if (!linkedLegacyInvoice) {
        try {
          const invoiceRows = await prisma.$queryRawUnsafe<Array<Record<string, any>>>(
            `
              SELECT pidInvoice, status, currency, grandTotal, amountPaid, balanceDue
              FROM invoices
              WHERE pidInvoice = ?
                AND linkedRequestId = ?
              LIMIT 1
            `,
            String(pidPaymentRecord),
            String(pidRequest),
          );
          if (Array.isArray(invoiceRows) && invoiceRows.length > 0) {
            linkedInvoicingInvoice = {
              pidInvoice: String(invoiceRows[0].pidInvoice),
              status: invoiceRows[0].status ?? null,
              currency: invoiceRows[0].currency ?? null,
              grandTotal: invoiceRows[0].grandTotal ?? null,
              amountPaid: invoiceRows[0].amountPaid ?? null,
              balanceDue: invoiceRows[0].balanceDue ?? null,
            };
          }
        } catch (lookupError) {
          console.warn('Corporate wallet payment invoice lookup failed:', lookupError);
        }
      }

      if (!linkedLegacyInvoice && !linkedInvoicingInvoice) {
        return NextResponse.json(
          {
            statusx: 'INVOICE_NOT_FOUND',
            message: 'Invoice record not found for this corporate gift request.',
          },
          { status: 404 },
        );
      }

      const invoiceCurrency = String(
        linkedLegacyInvoice?.currency_type || linkedInvoicingInvoice?.currency || '',
      ).toUpperCase();
      if (invoiceCurrency !== 'NGN') {
        return NextResponse.json(
          {
            statusx: 'UNSUPPORTED_CURRENCY',
            message: `Wallet payment is only available for Naira (NGN) invoices. This invoice currency is ${invoiceCurrency || 'UNKNOWN'}.`,
          },
          { status: 400 },
        );
      }

      if (linkedInvoicingInvoice) {
        const invoiceBalanceDue = Number(linkedInvoicingInvoice.balanceDue || 0);
        if (payAmount > invoiceBalanceDue) {
          return NextResponse.json(
            {
              statusx: 'AMOUNT_EXCEEDS_INVOICE_BALANCE',
              message: `Payment amount exceeds invoice balance due. Balance due: ₦${formatNaira(invoiceBalanceDue)}.`,
            },
            { status: 400 },
          );
        }
      }
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.ROOT_URL ||
      'http://localhost:3000';
    let walletData: any = null;
    try {
      const walletCheck = await fetch(
        `${baseUrl}/api/paystack/get-customer/${encodeURIComponent(user.userEmail)}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json' } },
      );
      if (!walletCheck.ok) {
        return NextResponse.json(
          {
            statusx: 'FAILED',
            message:
              'Unable to verify wallet balance right now. Please try again in a moment.',
          },
          { status: 502 },
        );
      }
      walletData = await walletCheck.json();
    } catch (walletError) {
      return NextResponse.json(
        {
          statusx: 'FAILED',
          message:
            'Unable to verify wallet balance right now. Please check your connection and try again.',
        },
        { status: 502 },
      );
    }

    if (walletData?.statusx !== 'WALLET_READY') {
      return NextResponse.json(
        { statusx: 'NO_WALLET', message: 'Please activate your wallet first.' },
        { status: 400 },
      );
    }

    const walletBalance = Number(walletData?.transactionDetails?.totalAmount || 0);
    if (walletBalance < payAmount) {
      const shortfall = Number((payAmount - walletBalance).toFixed(2));
      return NextResponse.json(
        {
          statusx: 'INSUFFICIENT_WALLET_BALANCE',
          message: `Insufficient wallet balance. Current balance: ₦${formatNaira(walletBalance)}. Required: ₦${formatNaira(payAmount)}. Please add ₦${formatNaira(shortfall)} to continue.`,
          meta: {
            walletBalance,
            requiredAmount: payAmount,
            shortfall,
          },
        },
        { status: 400 },
      );
    }

    const txRef = `CGWAL${randomGenerator(10)}`;
    const txID = `CGWALTX${randomGenerator(10)}`;
    const fullName = `${user.userFirstname || ''} ${user.userLastname || ''}`.trim() || 'Customer';
    let fullySettledInvoicingInvoice = false;

    await prisma.$transaction(async (tx) => {
      await tx.debits.create({
        data: {
          pidDebit: `DEB${randomGenerator(12)}`,
          pidUser: String(pidUser),
          email: user.userEmail as string,
          payerName: fullName,
          txID,
          txRef,
          paymentStatus: 'DEBITED',
          paymentType: 'WALLET',
          currency: 'NGN',
          amount: payAmount,
          serviceID: String(pidRequest),
          serviceName: 'CORPORATE_GIFTS',
          serviceDescription: 'Corporate gifts payment via wallet',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      await tx.payments.create({
        data: {
          pidPayment: `PAY${randomGenerator(12)}`,
          pidUser: String(pidUser),
          payerName: fullName,
          payerEmail: user.userEmail,
          txID,
          txRef,
          paymentStatus: 'PAID',
          paymentType: 'WALLET',
          currency: 'NGN',
          amount: payAmount,
          serviceID: String(pidRequest),
          serviceName: 'CORPORATE_GIFTS',
          serviceDescription: `Corporate gifts project payment (${pidRequest})`,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      if (pidPaymentRecord && linkedLegacyInvoice) {
        await tx.payment_records.updateMany({
          where: { pidPayment: String(pidPaymentRecord), pid_order: String(pidRequest) },
          data: {
            payment_status: 'PAID',
            payment_type: 'WALLET',
            tx_date_server: new Date().toISOString(),
            updatedAt: new Date(),
          },
        });
      }

      if (pidPaymentRecord && linkedInvoicingInvoice) {
        const currentGrandTotal = Number(linkedInvoicingInvoice.grandTotal || 0);
        const currentAmountPaid = Number(linkedInvoicingInvoice.amountPaid || 0);
        const newAmountPaid = Number((currentAmountPaid + payAmount).toFixed(2));
        const newBalanceDue = Number(Math.max(currentGrandTotal - newAmountPaid, 0).toFixed(2));
        const nextInvoiceStatus =
          newBalanceDue <= 0
            ? 'PAID'
            : newAmountPaid > 0
              ? 'PARTIALLY_PAID'
              : String(linkedInvoicingInvoice.status || 'ISSUED');

        fullySettledInvoicingInvoice = newBalanceDue <= 0;

        await tx.$executeRawUnsafe(
          `
            UPDATE invoices
            SET amountPaid = ?, balanceDue = ?, status = ?, paidAt = ?, updatedAt = NOW(3)
            WHERE pidInvoice = ?
          `,
          String(newAmountPaid),
          String(newBalanceDue),
          nextInvoiceStatus,
          newBalanceDue <= 0 ? new Date() : null,
          linkedInvoicingInvoice.pidInvoice,
        );

        try {
          await tx.$executeRawUnsafe(
            `
              INSERT INTO invoice_payments
              (pidInvoicePayment, pidInvoice, pidUser, amount, currency, paymentMethod, reference, paidAt, createdAt, updatedAt)
              VALUES (?, ?, ?, ?, ?, 'WALLET', ?, NOW(3), NOW(3), NOW(3))
            `,
            `IVP-${randomGenerator(10)}`,
            linkedInvoicingInvoice.pidInvoice,
            String(pidUser),
            String(payAmount),
            'NGN',
            txRef,
          );
        } catch (paymentInsertError) {
          console.warn('invoice_payments insert skipped:', paymentInsertError);
        }
      }

      const canMoveProjectToProduction =
        !pidPaymentRecord ||
        Boolean(linkedLegacyInvoice) ||
        fullySettledInvoicingInvoice;

      if (
        canMoveProjectToProduction &&
        String(project.status || '').toLowerCase() === 'invoiced'
      ) {
        await tx.corporate_gift_request.update({
          where: { pidRequest: String(pidRequest) },
          data: {
            status: 'Production Started',
            updatedAt: new Date(),
          },
        });
      }
    });

    return NextResponse.json({
      statusx: 'SUCCESS',
      message: 'Corporate project payment completed with wallet.',
    });
  } catch (error) {
    console.error('Corporate wallet payment failed:', error);
    return NextResponse.json(
      {
        statusx: 'FAILED',
        message:
          error instanceof Error
            ? error.message
            : 'Unable to complete wallet payment right now. Please try again.',
      },
      { status: 500 },
    );
  }
}
