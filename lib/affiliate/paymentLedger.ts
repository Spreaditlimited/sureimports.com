import 'server-only';

import { createHash, randomBytes } from 'node:crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import {
  AFFILIATE_SERVICE_KEYS,
  recordAffiliateConversion,
  voidAffiliateConversions,
} from '@/lib/affiliate/commissions';

const COMPLETED = new Set([
  'COMPLETED',
  'PAID',
  'SUCCESS',
  'SUCCESSFUL',
  'VERIFIED',
]);
const REVERSED = new Set(['REFUNDED', 'REVERSED', 'DISPUTED', 'CHARGEBACK']);

export type ExternalLedgerEvent = {
  eventId: string;
  eventType: 'REFERRAL_CLAIMED' | 'PAYMENT_STATUS_CHANGED';
  occurredAt: string;
  customerReference: string;
  referralCode?: string | null;
  payment?: {
    type: string;
    id: string;
    orderReference?: string | null;
    purpose: 'COMMITMENT_FEE' | 'PROJECT_PAYMENT' | 'SHIPPING_PAYMENT';
    status: string;
    provider?: string | null;
    providerReference?: string | null;
    currency: string;
    amount: number;
    eligibleAmount: number;
    settlementCurrency?: string | null;
    settlementAmount?: number | null;
    fxRate?: number | null;
    fxSource?: string | null;
    fxCapturedAt?: string | null;
    billingUnit?: 'KG' | 'CBM' | null;
    eligibleQuantity?: number | null;
    destinationCountry?: string | null;
    shippingMode?: 'AIR' | 'SEA' | null;
  };
  metadata?: Record<string, unknown>;
};

function clean(value: unknown, max: number) {
  return String(value ?? '')
    .trim()
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .slice(0, max);
}

function positiveMoney(value: unknown, label: string) {
  const amount = new Prisma.Decimal(String(value ?? '')).toDecimalPlaces(2);
  if (!amount.isFinite() || amount.lt(0))
    throw new Error(`${label} is invalid.`);
  return amount;
}

function parseDate(value: unknown, label: string) {
  const date = new Date(String(value || ''));
  if (Number.isNaN(date.getTime())) throw new Error(`${label} is invalid.`);
  return date;
}

function normalizeEvent(input: ExternalLedgerEvent) {
  const eventId = clean(input.eventId, 191);
  const eventType = clean(input.eventType, 40).toUpperCase();
  const customerReference = clean(input.customerReference, 191);
  const referralCode = clean(input.referralCode, 40).toUpperCase() || null;
  if (!eventId || !customerReference.startsWith('linescout:')) {
    throw new Error(
      'A valid LineScout event and customer reference are required.',
    );
  }
  if (!['REFERRAL_CLAIMED', 'PAYMENT_STATUS_CHANGED'].includes(eventType)) {
    throw new Error('Unsupported ledger event type.');
  }
  const occurredAt = parseDate(input.occurredAt, 'Event time');
  if (eventType === 'REFERRAL_CLAIMED') {
    if (!referralCode)
      throw new Error('Referral claims require a referral code.');
    return {
      eventId,
      eventType,
      occurredAt,
      customerReference,
      referralCode,
      payment: null,
      metadata: input.metadata || {},
    };
  }
  if (!input.payment) throw new Error('Payment details are required.');
  const purpose = clean(input.payment.purpose, 80).toUpperCase();
  if (
    !['COMMITMENT_FEE', 'PROJECT_PAYMENT', 'SHIPPING_PAYMENT'].includes(purpose)
  ) {
    throw new Error('Unsupported payment purpose.');
  }
  const currency = clean(input.payment.currency, 3).toUpperCase();
  const settlementCurrency =
    clean(input.payment.settlementCurrency, 3).toUpperCase() || null;
  if (
    !/^[A-Z]{3}$/.test(currency) ||
    (settlementCurrency && !/^[A-Z]{3}$/.test(settlementCurrency))
  ) {
    throw new Error('Payment currency is invalid.');
  }
  const payment = {
    type: clean(input.payment.type, 80),
    id: clean(input.payment.id, 160),
    orderReference: clean(input.payment.orderReference, 160) || null,
    purpose,
    status: clean(input.payment.status, 24).toUpperCase(),
    provider: clean(input.payment.provider, 40) || null,
    providerReference: clean(input.payment.providerReference, 191) || null,
    currency,
    amount: positiveMoney(input.payment.amount, 'Payment amount'),
    eligibleAmount: positiveMoney(
      input.payment.eligibleAmount,
      'Eligible amount',
    ),
    settlementCurrency,
    settlementAmount:
      input.payment.settlementAmount == null
        ? null
        : positiveMoney(input.payment.settlementAmount, 'Settlement amount'),
    fxRate:
      input.payment.fxRate == null
        ? null
        : new Prisma.Decimal(String(input.payment.fxRate)).toDecimalPlaces(8),
    fxSource: clean(input.payment.fxSource, 80) || null,
    fxCapturedAt: input.payment.fxCapturedAt
      ? parseDate(input.payment.fxCapturedAt, 'FX capture time')
      : null,
    billingUnit: clean(input.payment.billingUnit, 16).toUpperCase() || null,
    eligibleQuantity:
      input.payment.eligibleQuantity == null
        ? null
        : new Prisma.Decimal(
            String(input.payment.eligibleQuantity),
          ).toDecimalPlaces(4),
    destinationCountry:
      clean(input.payment.destinationCountry, 100).toUpperCase() || null,
    shippingMode: clean(input.payment.shippingMode, 24).toUpperCase() || null,
  };
  if (!payment.type || !payment.id || !payment.status)
    throw new Error('Payment identity and status are required.');
  return {
    eventId,
    eventType,
    occurredAt,
    customerReference,
    referralCode,
    payment,
    metadata: input.metadata || {},
  };
}

function hasFinalShippingBasis(payment: {
  purpose: string;
  billingUnit: string | null;
  eligibleQuantity: Prisma.Decimal | null;
}) {
  return (
    payment.purpose !== 'SHIPPING_PAYMENT' ||
    (['KG', 'CBM'].includes(payment.billingUnit || '') &&
      Boolean(payment.eligibleQuantity?.gt(0)))
  );
}

async function claimReferral(
  customerReference: string,
  referralCode: string | null,
) {
  const existing = await prisma.affiliate_referrals.findUnique({
    where: { customerReference },
  });
  if (existing || !referralCode) return existing;
  const owner = await prisma.affiliate_accounts.findFirst({
    where: {
      status: 'ACTIVE',
      OR: [
        { referralCode },
        {
          referralAliases: {
            some: {
              sourceSystem: 'LINESCOUT',
              aliasCode: referralCode,
              active: true,
            },
          },
        },
      ],
    },
    select: { id: true },
  });
  if (!owner) return null;
  try {
    return await prisma.affiliate_referrals.create({
      data: {
        pidReferral: `aref_${randomBytes(18).toString('base64url')}`,
        affiliateId: owner.id,
        visitorHash: createHash('sha256')
          .update(customerReference)
          .digest('hex'),
        landingPath: '/linescout',
        source: 'LINESCOUT',
        customerReference,
        claimedAt: new Date(),
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return prisma.affiliate_referrals.findUnique({
        where: { customerReference },
      });
    }
    throw error;
  }
}

async function recordCommissionForLedger(
  ledger: Prisma.payment_ledger_entriesGetPayload<Record<string, never>>,
) {
  const originalCurrency = ledger.originalCurrency.toUpperCase();
  let currency = originalCurrency;
  let gross = ledger.originalAmount;
  let eligible = ledger.eligibleAmount;
  if (originalCurrency !== 'NGN' && originalCurrency !== 'USD') {
    if (
      ledger.settlementCurrency !== 'USD' ||
      !ledger.settlementAmount ||
      ledger.originalAmount.lte(0)
    ) {
      throw new Error(
        'Foreign payments require a payment-time USD settlement snapshot.',
      );
    }
    currency = 'USD';
    gross = ledger.settlementAmount;
    eligible = ledger.settlementAmount
      .mul(ledger.eligibleAmount)
      .div(ledger.originalAmount)
      .toDecimalPlaces(2);
  }
  const shipping = ledger.purpose === 'SHIPPING_PAYMENT';
  return recordAffiliateConversion({
    customerReference: ledger.customerReference,
    serviceKey: shipping
      ? AFFILIATE_SERVICE_KEYS.SHIP_WITH_US
      : AFFILIATE_SERVICE_KEYS.LINESCOUT_SOURCING,
    eventKey: shipping ? null : ledger.purpose,
    externalOrderReference: `linescout:${ledger.sourcePaymentType}:${ledger.sourcePaymentId}`,
    externalPaymentReference: `linescout:${ledger.sourcePaymentType}:${ledger.sourcePaymentId}`,
    paymentCurrency: currency,
    grossAmount: gross,
    eligibleAmount: eligible,
    commissionBasisUnit: shipping ? (ledger.billingUnit as 'KG' | 'CBM') : null,
    commissionBasisQuantity: shipping ? ledger.eligibleQuantity : null,
    destinationCountry: shipping ? ledger.destinationCountry : null,
    shippingMode: shipping ? (ledger.shippingMode as 'AIR' | 'SEA') : null,
    sourceSystem: 'LINESCOUT',
    paymentLedgerEntryId: ledger.id,
  });
}

export async function retryAwaitingLineScoutAttribution(limit = 100) {
  const entries = await prisma.payment_ledger_entries.findMany({
    where: {
      sourceSystem: 'LINESCOUT',
      status: 'COMPLETED',
      processingStatus: 'AWAITING_ATTRIBUTION',
    },
    orderBy: { occurredAt: 'asc' },
    take: Math.max(1, Math.min(500, limit)),
  });
  let processed = 0;
  for (const entry of entries) {
    const result = await recordCommissionForLedger(entry);
    if (!result.recorded) continue;
    await prisma.payment_ledger_entries.update({
      where: { id: entry.id },
      data: {
        processingStatus: 'PROCESSED',
        processingError: null,
        processedAt: new Date(),
      },
    });
    processed += 1;
  }
  return { checked: entries.length, processed };
}

export async function ingestLineScoutLedgerEvent(
  raw: ExternalLedgerEvent,
  rawPayload: string,
) {
  const input = normalizeEvent(raw);
  const payloadHash = createHash('sha256').update(rawPayload).digest('hex');
  const existingEvent = await prisma.payment_ledger_events.findUnique({
    where: { externalEventId: input.eventId },
  });
  if (existingEvent && existingEvent.payloadHash !== payloadHash)
    throw new Error('Event ID was reused with a different payload.');
  if (existingEvent?.processedAt) return { duplicate: true, processed: true };

  const event =
    existingEvent ||
    (await prisma.payment_ledger_events.create({
      data: {
        pidLedgerEvent: `ple_${randomBytes(18).toString('base64url')}`,
        externalEventId: input.eventId,
        sourceSystem: 'LINESCOUT',
        eventType: input.eventType,
        payloadHash,
        payloadJson: rawPayload,
      },
    }));

  await claimReferral(input.customerReference, input.referralCode);
  if (!input.payment) {
    const awaiting = await prisma.payment_ledger_entries.findMany({
      where: {
        customerReference: input.customerReference,
        status: 'COMPLETED',
        processingStatus: 'AWAITING_ATTRIBUTION',
      },
    });
    for (const ledger of awaiting) {
      const result = await recordCommissionForLedger(ledger);
      if (result.recorded) {
        await prisma.payment_ledger_entries.update({
          where: { id: ledger.id },
          data: {
            processingStatus: 'PROCESSED',
            processingError: null,
            processedAt: new Date(),
          },
        });
      }
    }
    await prisma.payment_ledger_events.update({
      where: { id: event.id },
      data: { processedAt: new Date(), processingError: null },
    });
    return { duplicate: Boolean(existingEvent), processed: true };
  }

  const p = input.payment;
  const currentLedger = await prisma.payment_ledger_entries.findUnique({
    where: {
      sourceSystem_sourcePaymentType_sourcePaymentId: {
        sourceSystem: 'LINESCOUT',
        sourcePaymentType: p.type,
        sourcePaymentId: p.id,
      },
    },
  });
  const preserveCompleted =
    currentLedger?.status === 'COMPLETED' && !REVERSED.has(p.status);
  const nextStatus = preserveCompleted ? 'COMPLETED' : p.status;
  const ledger = await prisma.payment_ledger_entries.upsert({
    where: {
      sourceSystem_sourcePaymentType_sourcePaymentId: {
        sourceSystem: 'LINESCOUT',
        sourcePaymentType: p.type,
        sourcePaymentId: p.id,
      },
    },
    create: {
      pidLedgerEntry: `pled_${randomBytes(18).toString('base64url')}`,
      sourceSystem: 'LINESCOUT',
      sourcePaymentType: p.type,
      sourcePaymentId: p.id,
      sourceOrderReference: p.orderReference,
      customerReference: input.customerReference,
      purpose: p.purpose,
      provider: p.provider,
      providerReference: p.providerReference,
      status: p.status,
      originalCurrency: p.currency,
      originalAmount: p.amount,
      eligibleAmount: p.eligibleAmount,
      settlementCurrency: p.settlementCurrency,
      settlementAmount: p.settlementAmount,
      fxRate: p.fxRate,
      fxSource: p.fxSource,
      fxCapturedAt: p.fxCapturedAt,
      billingUnit: p.billingUnit,
      eligibleQuantity: p.eligibleQuantity,
      destinationCountry: p.destinationCountry,
      shippingMode: p.shippingMode,
      occurredAt: input.occurredAt,
      metadataJson: JSON.stringify(input.metadata),
    },
    update: {
      status: nextStatus,
      provider: p.provider,
      providerReference: p.providerReference,
      originalCurrency: preserveCompleted
        ? currentLedger.originalCurrency
        : p.currency,
      originalAmount: preserveCompleted
        ? currentLedger.originalAmount
        : p.amount,
      eligibleAmount: preserveCompleted
        ? currentLedger.eligibleAmount
        : p.eligibleAmount,
      settlementCurrency: preserveCompleted
        ? currentLedger.settlementCurrency
        : p.settlementCurrency,
      settlementAmount: preserveCompleted
        ? currentLedger.settlementAmount
        : p.settlementAmount,
      fxRate: preserveCompleted ? currentLedger.fxRate : p.fxRate,
      fxSource: preserveCompleted ? currentLedger.fxSource : p.fxSource,
      fxCapturedAt: preserveCompleted
        ? currentLedger.fxCapturedAt
        : p.fxCapturedAt,
      billingUnit: preserveCompleted
        ? currentLedger.billingUnit
        : p.billingUnit,
      eligibleQuantity: preserveCompleted
        ? currentLedger.eligibleQuantity
        : p.eligibleQuantity,
      destinationCountry: preserveCompleted
        ? currentLedger.destinationCountry
        : p.destinationCountry,
      shippingMode: preserveCompleted
        ? currentLedger.shippingMode
        : p.shippingMode,
      metadataJson: preserveCompleted
        ? currentLedger.metadataJson
        : JSON.stringify(input.metadata),
      occurredAt: preserveCompleted
        ? currentLedger.occurredAt
        : input.occurredAt,
      processingStatus: preserveCompleted
        ? currentLedger.processingStatus
        : 'PENDING',
      processingError: preserveCompleted ? currentLedger.processingError : null,
    },
  });
  await prisma.payment_ledger_events.update({
    where: { id: event.id },
    data: { ledgerEntryId: ledger.id },
  });

  try {
    if (REVERSED.has(p.status)) {
      await voidAffiliateConversions({
        externalPaymentReferences: [`linescout:${p.type}:${p.id}`],
        reason: `LineScout payment status changed to ${p.status}.`,
        reversalReference: p.providerReference || input.eventId,
      });
    } else if (COMPLETED.has(nextStatus)) {
      if (!hasFinalShippingBasis(p)) {
        const message =
          'Final billed KG or CBM quantity is required before an affiliate shipping commission can be calculated.';
        await prisma.$transaction([
          prisma.payment_ledger_entries.update({
            where: { id: ledger.id },
            data: {
              processingStatus: 'REQUIRES_PAYMENT_DATA',
              processingError: message,
              processedAt: null,
            },
          }),
          prisma.payment_ledger_events.update({
            where: { id: event.id },
            data: { processedAt: new Date(), processingError: message },
          }),
        ]);
        return {
          duplicate: Boolean(existingEvent),
          processed: false,
          reason: 'MISSING_SHIPPING_BASIS',
        };
      }
      const result = await recordCommissionForLedger(ledger);
      if (!result.recorded && result.reason === 'NO_ATTRIBUTION') {
        const awaiting = Boolean(input.referralCode);
        await prisma.payment_ledger_entries.update({
          where: { id: ledger.id },
          data: {
            processingStatus: awaiting
              ? 'AWAITING_ATTRIBUTION'
              : 'NOT_AFFILIATE_ELIGIBLE',
            processingError: awaiting ? result.reason : null,
            processedAt: awaiting ? null : new Date(),
          },
        });
        await prisma.payment_ledger_events.update({
          where: { id: event.id },
          data: {
            processedAt: new Date(),
            processingError: awaiting ? result.reason : null,
          },
        });
        return {
          duplicate: Boolean(existingEvent),
          processed: !awaiting,
          reason: result.reason,
        };
      }
      if (!result.recorded) throw new Error(result.reason);
    }
    await prisma.$transaction([
      prisma.payment_ledger_entries.update({
        where: { id: ledger.id },
        data: {
          processingStatus: 'PROCESSED',
          processingError: null,
          processedAt: new Date(),
        },
      }),
      prisma.payment_ledger_events.update({
        where: { id: event.id },
        data: { processedAt: new Date(), processingError: null },
      }),
    ]);
    return { duplicate: Boolean(existingEvent), processed: true };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message.slice(0, 1000)
        : 'Ledger processing failed.';
    await prisma.$transaction([
      prisma.payment_ledger_entries.update({
        where: { id: ledger.id },
        data: { processingStatus: 'FAILED', processingError: message },
      }),
      prisma.payment_ledger_events.update({
        where: { id: event.id },
        data: { processingError: message },
      }),
    ]);
    throw error;
  }
}
