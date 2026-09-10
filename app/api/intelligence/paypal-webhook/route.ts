import { after, NextResponse } from 'next/server';

import {
  confirmReportOrderPayment,
  transitionReportOrderAccess,
} from '@/lib/intelligence/reportOrders';
import { getPayPalOrder, verifyPayPalWebhookSignature } from '@/lib/paypal';
import { prisma } from '@/lib/prisma';
import { resolvePayPalAccessStatus } from '@/lib/intelligence/reportOrderPolicy';
import {
  confirmCorporateSourcingPayment,
  ensureCorporateSourcingPayments,
} from '@/lib/corporateSourcing/payments';
import { confirmSupplierVerificationPayment } from '@/lib/supplierVerification/service';
import { voidAffiliateConversions } from '@/lib/affiliate/commissions';
import { paypalEventReversesCommission } from '@/lib/affiliate/reversalPolicy';
import { sendAffiliateAccountNotification } from '@/lib/affiliate/emailNotifications';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type AffiliatePayoutNotice = { id: number; pidPayout: string; affiliateId: number; provider: string; currency: string; amount: unknown };

function notifyAffiliatePayout(payout: AffiliatePayoutNotice, status: 'PAID' | 'PROCESSING' | 'FAILED' | 'REVERSED') {
  const paid = status === 'PAID';
  const reversed = status === 'REVERSED';
  const processing = status === 'PROCESSING';
  after(() => sendAffiliateAccountNotification({
    affiliateId: payout.affiliateId,
    eventKey: `payout:${status.toLowerCase()}:${payout.pidPayout}`,
    eventType: paid ? 'PAYOUT_PAID' : processing ? 'PAYOUT_PROCESSING' : reversed ? 'PAYOUT_REVERSED' : 'PAYOUT_FAILED',
    subject: paid ? 'Your Sure Imports affiliate payout has been paid' : processing ? 'Your Sure Imports affiliate payout is processing' : reversed ? 'Your Sure Imports affiliate payout was reversed' : 'Your Sure Imports affiliate payout failed',
    title: paid ? 'Payout completed' : processing ? 'Payout is processing' : reversed ? 'Payout reversed' : 'Payout was not completed',
    message: paid
      ? 'Your affiliate payout was completed successfully. Provider processing times may affect when the funds appear in PayPal.'
      : processing
        ? 'Your payout has been approved and submitted to PayPal for processing.'
        : reversed
          ? 'PayPal reported that this payout was returned or reversed. Review the payout page or contact support if you need assistance.'
          : 'PayPal could not complete this payout. Review the payout page for the latest status.',
    facts: [
      { label: 'Reference', value: payout.pidPayout },
      { label: 'Provider', value: payout.provider },
      { label: 'Amount', value: new Intl.NumberFormat('en-US', { style: 'currency', currency: payout.currency }).format(Number(payout.amount)) },
      { label: 'Status', value: status },
    ],
    actionLabel: 'Track payout',
    actionPath: '/dashboard/payouts',
  }));
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const signatureHeaders = {
    'paypal-transmission-id': request.headers.get('paypal-transmission-id'),
    'paypal-transmission-time': request.headers.get('paypal-transmission-time'),
    'paypal-cert-url': request.headers.get('paypal-cert-url'),
    'paypal-auth-algo': request.headers.get('paypal-auth-algo'),
    'paypal-transmission-sig': request.headers.get('paypal-transmission-sig'),
  };
  if (Object.values(signatureHeaders).some((value) => !value)) {
    return NextResponse.json(
      { message: 'Invalid PayPal signature.' },
      { status: 401 },
    );
  }

  const verification = await verifyPayPalWebhookSignature({
    body,
    headers: signatureHeaders,
  }).catch(() => null);
  if (
    String(verification?.verification_status || '').toUpperCase() !== 'SUCCESS'
  ) {
    return NextResponse.json(
      { message: 'Invalid PayPal signature.' },
      { status: 401 },
    );
  }

  const event = String(body?.event_type || '').toUpperCase();
  if (
    event.startsWith('PAYMENT.PAYOUTSBATCH.') ||
    event.startsWith('PAYMENT.PAYOUTS-ITEM.')
  ) {
    const senderItemReference = String(
      body?.resource?.payout_item?.sender_item_id || '',
    ).trim();
    const batchReference = String(
      body?.resource?.batch_header?.payout_batch_id ||
        body?.resource?.payout_batch_id ||
        '',
    ).trim();
    if (batchReference || senderItemReference) {
      const payouts = await prisma.$queryRaw<Array<AffiliatePayoutNotice>>`
        SELECT id, pidPayout, affiliateId, provider, currency, amount FROM affiliate_payouts
        WHERE externalReference = ${batchReference}
           OR pidPayout = ${senderItemReference}
        LIMIT 1
      `;
      const payout = payouts[0];
      if (payout && event === 'PAYMENT.PAYOUTS-ITEM.SUCCEEDED') {
        await prisma.$transaction([
          prisma.$executeRaw`
            UPDATE affiliate_payouts
            SET status = 'PAID', providerStatus = 'SUCCESS', processedAt = ${new Date()},
                lastCheckedAt = ${new Date()}, updatedAt = ${new Date()}
            WHERE id = ${payout.id}
          `,
          prisma.$executeRaw`
            UPDATE affiliate_conversions c
            INNER JOIN affiliate_payout_items i ON i.conversionId = c.id
            SET c.status = 'PAID', c.updatedAt = ${new Date()}
            WHERE i.payoutId = ${payout.id} AND c.status = 'RESERVED'
          `,
        ]);
        notifyAffiliatePayout(payout, 'PAID');
      } else if (payout && [
        'PAYMENT.PAYOUTSBATCH.DENIED',
        'PAYMENT.PAYOUTSBATCH.CANCELED',
        'PAYMENT.PAYOUTS-ITEM.BLOCKED',
        'PAYMENT.PAYOUTS-ITEM.CANCELED',
        'PAYMENT.PAYOUTS-ITEM.FAILED',
        'PAYMENT.PAYOUTS-ITEM.REFUNDED',
        'PAYMENT.PAYOUTS-ITEM.RETURNED',
      ].includes(event)) {
        await prisma.$transaction([
          prisma.$executeRaw`
            UPDATE affiliate_payouts
            SET status = 'FAILED', providerStatus = ${event.split('.').pop() || 'FAILED'},
                failedAt = ${new Date()}, processedAt = NULL,
                lastCheckedAt = ${new Date()}, updatedAt = ${new Date()}
            WHERE id = ${payout.id}
          `,
          prisma.$executeRaw`
            UPDATE affiliate_conversions c
            INNER JOIN affiliate_payout_items i ON i.conversionId = c.id
            SET c.status = 'RESERVED', c.updatedAt = ${new Date()}
            WHERE i.payoutId = ${payout.id} AND c.status <> 'VOIDED'
          `,
        ]);
        notifyAffiliatePayout(
          payout,
          ['PAYMENT.PAYOUTS-ITEM.REFUNDED', 'PAYMENT.PAYOUTS-ITEM.RETURNED'].includes(event) ? 'REVERSED' : 'FAILED',
        );
      } else if (payout) {
        await prisma.$executeRaw`
          UPDATE affiliate_payouts
          SET status = 'PROCESSING', providerStatus = ${event.split('.').pop() || 'PROCESSING'},
              lastCheckedAt = ${new Date()}, updatedAt = ${new Date()}
          WHERE id = ${payout.id} AND status NOT IN ('PAID', 'FAILED')
        `;
        notifyAffiliatePayout(payout, 'PROCESSING');
      }
    }
    return NextResponse.json({ received: true });
  }
  if (
    ![
      'PAYMENT.CAPTURE.COMPLETED',
      'PAYMENT.CAPTURE.DENIED',
      'PAYMENT.CAPTURE.DECLINED',
      'PAYMENT.CAPTURE.REFUNDED',
      'PAYMENT.CAPTURE.REVERSED',
      'CHECKOUT.ORDER.APPROVED',
      'CUSTOMER.DISPUTE.CREATED',
      'CUSTOMER.DISPUTE.UPDATED',
      'CUSTOMER.DISPUTE.RESOLVED',
    ].includes(event)
  ) {
    return NextResponse.json({ received: true });
  }
  const resource = body?.resource || {};
  const captureReference = String(
    resource?.disputed_transactions?.[0]?.seller_transaction_id ||
      (event.startsWith('PAYMENT.CAPTURE.') ? resource?.id : '') ||
      '',
  ).trim();
  const orderId = String(
    resource?.supplementary_data?.related_ids?.order_id ||
      (event === 'CHECKOUT.ORDER.APPROVED' ? resource?.id : '') ||
      '',
  ).trim();
  if (!orderId && !captureReference)
    return NextResponse.json({ received: true });
  const reversesPayment = paypalEventReversesCommission(event);
  if (reversesPayment) {
    await voidAffiliateConversions({
      externalPaymentReferences: [captureReference, orderId]
        .filter(Boolean)
        .map((reference) => `paypal:${reference}`),
      reason: `PayPal reported ${event}.`,
      reversalReference: `paypal:${String(body?.id || captureReference || orderId)}`,
    });
  }
  const supplierPayment = await prisma.supplier_verification_payments.findFirst({
    where: {
      paymentProvider: 'paypal',
      OR: [
        ...(orderId ? [{ providerReference: orderId }] : []),
        ...(captureReference ? [{ providerCaptureReference: captureReference }] : []),
      ],
    },
  }).catch(() => null);
  if (supplierPayment) {
    if (
      event === 'PAYMENT.CAPTURE.REFUNDED' ||
      event === 'PAYMENT.CAPTURE.REVERSED' ||
      event === 'PAYMENT.CAPTURE.DENIED' ||
      event === 'PAYMENT.CAPTURE.DECLINED' ||
      event.startsWith('CUSTOMER.DISPUTE.')
    ) {
      const nextStatus = event.includes('REFUNDED') ? 'refunded' : 'disputed';
      const requestUpdate =
        supplierPayment.paymentPurpose === 'PHYSICAL_VISIT'
          ? {
              transportQuoteStatus: nextStatus.toUpperCase(),
              updatedAt: new Date(),
            }
          : supplierPayment.paymentPurpose === 'LEGACY_COMBINED'
            ? {
                status: nextStatus.toUpperCase(),
                transportQuoteStatus: nextStatus.toUpperCase(),
                updatedAt: new Date(),
              }
            : { status: nextStatus.toUpperCase(), updatedAt: new Date() };
      await prisma.$transaction([
        prisma.supplier_verification_payments.update({
          where: { pidPayment: supplierPayment.pidPayment },
          data: { status: nextStatus },
        }),
        prisma.verify_supplier.update({
          where: { pidVerifySupplier: supplierPayment.requestId },
          data: requestUpdate,
        }),
      ]);
      await voidAffiliateConversions({
        externalOrderReference: `supplier-verification:${supplierPayment.requestId}`,
        reason: `PayPal reported ${event} for Supplier Verification request ${supplierPayment.requestId}.`,
        reversalReference: `paypal:${String(body?.id || captureReference || orderId)}`,
      });
      return NextResponse.json({ received: true });
    }
    const paypalOrder = await getPayPalOrder(orderId || supplierPayment.providerReference || '');
    const unit = paypalOrder?.purchase_units?.[0];
    const capture = unit?.payments?.captures?.[0];
    if (
      String(paypalOrder?.status || '').toUpperCase() === 'COMPLETED' &&
      String(capture?.status || '').toUpperCase() === 'COMPLETED' &&
      String(unit?.custom_id || '') === supplierPayment.pidPayment &&
      Math.round(Number(capture?.amount?.value || 0) * 100) === supplierPayment.amountMinor &&
      String(capture?.amount?.currency_code || '').toUpperCase() === supplierPayment.currency
    ) {
      await confirmSupplierVerificationPayment({
        pidPayment: supplierPayment.pidPayment,
        paidAt: capture?.create_time ? new Date(capture.create_time) : null,
        providerEventId: String(body?.id || '') || null,
        providerCaptureReference: String(capture?.id || '') || null,
      });
    }
    return NextResponse.json({ received: true });
  }
  await ensureCorporateSourcingPayments();
  const corporateRows = await prisma.$queryRaw<Array<{
    pidPayment: string;
    providerReference: string | null;
    providerCaptureReference: string | null;
    amountMinor: number;
    currency: string;
  }>>`
    SELECT pidPayment, providerReference, providerCaptureReference, amountMinor, currency
    FROM corporate_sourcing_research_payments
    WHERE paymentProvider = 'paypal'
      AND (providerReference = ${orderId || '__none__'} OR providerCaptureReference = ${captureReference || '__none__'})
    LIMIT 1
  `;
  const corporatePayment = corporateRows[0];
  if (corporatePayment) {
    if (
      event === 'PAYMENT.CAPTURE.REFUNDED' ||
      event === 'PAYMENT.CAPTURE.REVERSED' ||
      event === 'PAYMENT.CAPTURE.DENIED' ||
      event === 'PAYMENT.CAPTURE.DECLINED' ||
      event.startsWith('CUSTOMER.DISPUTE.')
    ) {
      const status = resolvePayPalAccessStatus(event) || 'reversed';
      await prisma.$executeRaw`
        UPDATE corporate_sourcing_research_payments
        SET status = ${status}, updatedAt = ${new Date()}
        WHERE pidPayment = ${corporatePayment.pidPayment}
      `;
      return NextResponse.json({ received: true });
    }
    const paypalOrder = await getPayPalOrder(orderId || corporatePayment.providerReference || '');
    const unit = paypalOrder?.purchase_units?.[0];
    const capture = unit?.payments?.captures?.[0];
    if (
      String(paypalOrder?.status || '').toUpperCase() === 'COMPLETED' &&
      String(capture?.status || '').toUpperCase() === 'COMPLETED' &&
      String(unit?.custom_id || '') === corporatePayment.pidPayment &&
      Math.round(Number(capture?.amount?.value || 0) * 100) === corporatePayment.amountMinor &&
      String(capture?.amount?.currency_code || '').toUpperCase() === corporatePayment.currency
    ) {
      await confirmCorporateSourcingPayment({
        pidPayment: corporatePayment.pidPayment,
        paidAt: capture?.create_time ? new Date(capture.create_time) : null,
        providerCaptureReference: String(capture?.id || '').trim() || null,
      });
    }
    return NextResponse.json({ received: true });
  }
  const reportOrder = await prisma.intelligence_report_orders.findFirst({
    where: {
      paymentProvider: 'paypal',
      OR: [
        ...(orderId ? [{ providerReference: orderId }] : []),
        ...(captureReference
          ? [{ providerCaptureReference: captureReference }]
          : []),
      ],
    },
  });
  if (!reportOrder) return NextResponse.json({ received: true });
  if (
    event === 'PAYMENT.CAPTURE.REFUNDED' ||
    event === 'PAYMENT.CAPTURE.REVERSED' ||
    event === 'PAYMENT.CAPTURE.DENIED' ||
    event === 'PAYMENT.CAPTURE.DECLINED' ||
    event.startsWith('CUSTOMER.DISPUTE.')
  ) {
    const status = resolvePayPalAccessStatus(event) || 'revoked';
    await transitionReportOrderAccess({
      pidOrder: reportOrder.pidOrder,
      status,
      source: 'paypal',
      eventType: event.toLowerCase(),
      providerEventId: String(body?.id || '') || null,
      reason: `PayPal reported ${event}.`,
    });
    return NextResponse.json({ received: true });
  }
  const paypalOrder = await getPayPalOrder(
    orderId || reportOrder.providerReference || '',
  );
  const unit = paypalOrder?.purchase_units?.[0];
  const capture = unit?.payments?.captures?.[0];
  if (
    String(paypalOrder?.status || '').toUpperCase() === 'COMPLETED' &&
    String(capture?.status || '').toUpperCase() === 'COMPLETED' &&
    String(unit?.custom_id || '') === reportOrder.pidOrder &&
    Math.round(Number(capture?.amount?.value || 0) * 100) ===
      reportOrder.amountMinor &&
    String(capture?.amount?.currency_code || '').toUpperCase() ===
      reportOrder.currency
  ) {
    await confirmReportOrderPayment({
      pidOrder: reportOrder.pidOrder,
      source: 'paypal',
      paidAt: capture?.create_time ? new Date(capture.create_time) : null,
      providerEventId: String(body?.id || '') || null,
      providerCaptureReference: String(capture?.id || '').trim() || null,
    });
  }
  return NextResponse.json({ received: true });
}
