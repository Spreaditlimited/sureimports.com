import 'server-only';

import { Prisma } from '@prisma/client';
import { randomBytes } from 'node:crypto';
import { after } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendAffiliateAccountNotification } from '@/lib/affiliate/emailNotifications';
import {
  affiliateOrderReferenceForRefund,
  isCancelableAffiliatePayout,
} from '@/lib/affiliate/reversalPolicy';

export { affiliateOrderReferenceForRefund } from '@/lib/affiliate/reversalPolicy';

export const AFFILIATE_SERVICE_KEYS = {
  BUY_FROM_CHINESE_WEBSITES: 'BUY_FROM_CHINESE_WEBSITES',
  SUPPLIER_REPORTS: 'SUPPLIER_REPORTS',
  PHONES_AND_LAPTOPS: 'PHONES_AND_LAPTOPS',
  SUPPLIER_INTELLIGENCE: 'SUPPLIER_INTELLIGENCE',
  SUPPLIER_VERIFICATION: 'SUPPLIER_VERIFICATION',
  SHIP_WITH_US: 'SHIP_WITH_US',
} as const;

export type AffiliateServiceKey =
  (typeof AFFILIATE_SERVICE_KEYS)[keyof typeof AFFILIATE_SERVICE_KEYS];

type MoneyValue = string | number | Prisma.Decimal;

export type RecordAffiliateConversionInput = {
  customerReference?: string | null;
  referralReference?: string | null;
  serviceKey: AffiliateServiceKey;
  externalOrderReference: string;
  externalPaymentReference: string;
  paymentCurrency: string;
  grossAmount: MoneyValue;
  eligibleAmount: MoneyValue;
};

export type ConversionResult =
  | { recorded: true; duplicate: boolean; conversionId: string }
  | {
      recorded: false;
      reason:
        | 'NO_ATTRIBUTION'
        | 'SERVICE_INACTIVE'
        | 'UNSUPPORTED_CURRENCY'
        | 'RATE_NOT_CONFIGURED'
        | 'NO_ELIGIBLE_AMOUNT';
    };

function money(value: MoneyValue) {
  return new Prisma.Decimal(String(value)).toDecimalPlaces(2);
}

function reference(value: string, max: number) {
  const normalized = value.trim().replace(/[\u0000-\u001f\u007f]/g, '');
  if (!normalized)
    throw new Error('Affiliate conversion reference is required.');
  return normalized.slice(0, max);
}

async function resolveReferral(input: RecordAffiliateConversionInput) {
  if (input.customerReference) {
    const permanent = await prisma.affiliate_referrals.findUnique({
      where: { customerReference: input.customerReference },
      include: { affiliate: { select: { id: true, status: true } } },
    });
    if (permanent?.affiliate.status === 'ACTIVE') return permanent;
  }

  if (input.referralReference) {
    const direct = await prisma.affiliate_referrals.findFirst({
      where: {
        pidReferral: input.referralReference,
        affiliate: { status: 'ACTIVE' },
      },
      include: { affiliate: { select: { id: true, status: true } } },
    });
    if (direct) return direct;
  }

  return null;
}

async function existingConversion(
  serviceId: number,
  orderReference: string,
  paymentReference: string,
) {
  return prisma.affiliate_conversions.findFirst({
    where: {
      OR: [
        { externalPaymentReference: paymentReference },
        { externalOrderReference: orderReference, serviceId },
      ],
    },
    select: { pidConversion: true },
  });
}

export async function recordAffiliateConversion(
  input: RecordAffiliateConversionInput,
): Promise<ConversionResult> {
  const orderReference = reference(input.externalOrderReference, 120);
  const paymentReference = reference(input.externalPaymentReference, 160);
  const service = await prisma.affiliate_program_services.findFirst({
    where: { serviceKey: input.serviceKey, active: true },
    include: { currencyRates: { where: { active: true } } },
  });
  if (!service) return { recorded: false, reason: 'SERVICE_INACTIVE' };

  const duplicate = await existingConversion(
    service.id,
    orderReference,
    paymentReference,
  );
  if (duplicate) {
    return {
      recorded: true,
      duplicate: true,
      conversionId: duplicate.pidConversion,
    };
  }

  const referral = await resolveReferral(input);
  if (!referral) return { recorded: false, reason: 'NO_ATTRIBUTION' };

  const paymentCurrency = input.paymentCurrency.trim().toUpperCase();
  if (paymentCurrency !== 'NGN' && paymentCurrency !== 'USD') {
    return { recorded: false, reason: 'UNSUPPORTED_CURRENCY' };
  }
  const commissionCurrency = paymentCurrency === 'NGN' ? 'NGN' : 'USD';
  const grossAmount = money(input.grossAmount);
  const eligibleAmount = money(input.eligibleAmount);
  if (eligibleAmount.lte(0)) {
    return { recorded: false, reason: 'NO_ELIGIBLE_AMOUNT' };
  }

  const currencyRate = service.currencyRates.find(
    (rate) => rate.currency === commissionCurrency,
  );
  let commissionAmount: Prisma.Decimal;
  if (service.commissionType === 'FIXED') {
    if (!currencyRate?.fixedAmount) {
      return { recorded: false, reason: 'RATE_NOT_CONFIGURED' };
    }
    commissionAmount = currencyRate.fixedAmount.toDecimalPlaces(2);
  } else if (service.commissionType === 'PERCENTAGE') {
    const percentage = currencyRate?.percentageRate ?? service.percentageRate;
    if (!percentage) {
      return { recorded: false, reason: 'RATE_NOT_CONFIGURED' };
    }
    commissionAmount = eligibleAmount
      .mul(percentage)
      .div(100)
      .toDecimalPlaces(2);
  } else {
    return { recorded: false, reason: 'RATE_NOT_CONFIGURED' };
  }

  if (commissionAmount.lte(0)) {
    return { recorded: false, reason: 'NO_ELIGIBLE_AMOUNT' };
  }

  const pidConversion = `aconv_${randomBytes(18).toString('base64url')}`;
  const releaseMode =
    service.approvalMode === 'AUTOMATIC' ? 'AUTOMATIC' : 'MANUAL';
  const releaseAt =
    releaseMode === 'AUTOMATIC'
      ? new Date(Date.now() + service.reviewPeriodDays * 24 * 60 * 60 * 1000)
      : null;
  try {
    await prisma.$transaction([
      prisma.affiliate_conversions.create({
        data: {
          pidConversion,
          affiliateId: referral.affiliateId,
          serviceId: service.id,
          referralId: referral.id,
          externalOrderReference: orderReference,
          externalPaymentReference: paymentReference,
          paymentCurrency,
          grossAmount,
          eligibleAmount,
          commissionCurrency,
          commissionAmount,
          status: 'PENDING',
          releaseMode,
          releaseAt,
        },
      }),
      prisma.affiliate_referrals.updateMany({
        where: { id: referral.id, convertedAt: null },
        data: { convertedAt: new Date() },
      }),
    ]);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      const concurrent = await existingConversion(
        service.id,
        orderReference,
        paymentReference,
      );
      if (concurrent) {
        return {
          recorded: true,
          duplicate: true,
          conversionId: concurrent.pidConversion,
        };
      }
    }
    throw error;
  }

  after(() =>
    sendAffiliateAccountNotification({
      affiliateId: referral.affiliateId,
      eventKey: `commission:recorded:${pidConversion}`,
      eventType: 'COMMISSION_RECORDED',
      subject: 'A new affiliate commission was recorded',
      title: 'New commission recorded',
      message:
        'An eligible customer payment was attributed to your affiliate account. The commission is pending review before it becomes available.',
      facts: [
        { label: 'Service', value: service.displayName },
        { label: 'Order reference', value: orderReference },
        {
          label: 'Commission',
          value: new Intl.NumberFormat(
            commissionCurrency === 'NGN' ? 'en-NG' : 'en-US',
            { style: 'currency', currency: commissionCurrency },
          ).format(Number(commissionAmount)),
        },
        { label: 'Status', value: 'Pending' },
      ],
      actionLabel: 'View commission ledger',
      actionPath: '/dashboard/earnings',
    }),
  );

  return { recorded: true, duplicate: false, conversionId: pidConversion };
}

export async function voidAffiliateConversions(input: {
  externalOrderReference?: string;
  externalPaymentReferences?: string[];
  reason?: string;
  reversalReference?: string;
}) {
  const orderReference = input.externalOrderReference?.trim();
  const paymentReferences = (input.externalPaymentReferences || [])
    .map((item) => item.trim())
    .filter(Boolean);
  if (!orderReference && paymentReferences.length === 0) return 0;

  const match = {
    status: { not: 'VOIDED' },
    OR: [
      ...(orderReference
        ? [{ externalOrderReference: orderReference.slice(0, 120) }]
        : []),
      ...(paymentReferences.length
        ? [
            {
              externalPaymentReference: {
                in: paymentReferences.map((item) => item.slice(0, 160)),
              },
            },
          ]
        : []),
    ],
  } satisfies Prisma.affiliate_conversionsWhereInput;
  const reason = input.reason?.trim().slice(0, 1000) || 'Payment reversed';
  const reversalReference =
    input.reversalReference?.trim().slice(0, 160) || null;

  const result = await prisma.$transaction(
    async (tx) => {
      const conversions = await tx.affiliate_conversions.findMany({
        where: match,
        select: {
          id: true,
          pidConversion: true,
          affiliateId: true,
          status: true,
          externalOrderReference: true,
          commissionCurrency: true,
          commissionAmount: true,
          service: { select: { displayName: true } },
          payoutItem: {
            select: { payoutId: true, payout: { select: { status: true } } },
          },
        },
      });
      if (!conversions.length) return { conversions: [], cancelledPayouts: [] };

      const targetIds = conversions.map((conversion) => conversion.id);
      const cancelablePayoutIds = [
        ...new Set(
          conversions
            .filter(
              (conversion) =>
                conversion.payoutItem &&
                isCancelableAffiliatePayout(
                  conversion.payoutItem.payout.status,
                ),
            )
            .map((conversion) => conversion.payoutItem!.payoutId),
        ),
      ];
      const cancelledPayouts = cancelablePayoutIds.length
        ? await tx.affiliate_payouts.findMany({
            where: { id: { in: cancelablePayoutIds } },
            select: {
              id: true,
              pidPayout: true,
              affiliateId: true,
              currency: true,
              amount: true,
            },
          })
        : [];

      for (const payoutId of cancelablePayoutIds) {
        const items = await tx.affiliate_payout_items.findMany({
          where: { payoutId },
          select: { conversionId: true },
        });
        await tx.affiliate_conversions.updateMany({
          where: {
            id: {
              in: items
                .map((item) => item.conversionId)
                .filter((id) => !targetIds.includes(id)),
            },
            status: 'RESERVED',
          },
          data: { status: 'AVAILABLE' },
        });
        await tx.affiliate_payout_items.deleteMany({ where: { payoutId } });
        await tx.affiliate_payouts.update({
          where: { id: payoutId },
          data: {
            status: 'CANCELLED',
            failureReason:
              'Cancelled automatically because an included commission was reversed.',
          },
        });
      }

      for (const status of [
        ...new Set(conversions.map((conversion) => conversion.status)),
      ]) {
        await tx.affiliate_conversions.updateMany({
          where: {
            id: {
              in: conversions
                .filter((conversion) => conversion.status === status)
                .map((conversion) => conversion.id),
            },
            status,
          },
          data: {
            status: 'VOIDED',
            voidedAt: new Date(),
            reversedFromStatus: status,
            reversalReason: reason,
            reversalReference,
          },
        });
      }
      return { conversions, cancelledPayouts };
    },
    { maxWait: 10_000, timeout: 20_000 },
  );

  if (result.conversions.length || result.cancelledPayouts.length) {
    after(() =>
      Promise.all([
        ...result.conversions.map((conversion) =>
          sendAffiliateAccountNotification({
            affiliateId: conversion.affiliateId,
            eventKey: `commission:voided:${conversion.pidConversion}`,
            eventType: 'COMMISSION_VOIDED',
            subject: 'An affiliate commission was reversed',
            title: 'Commission reversed',
            message: reason,
            facts: [
              { label: 'Service', value: conversion.service.displayName },
              {
                label: 'Order reference',
                value: conversion.externalOrderReference,
              },
              {
                label: 'Commission',
                value: new Intl.NumberFormat(
                  conversion.commissionCurrency === 'NGN' ? 'en-NG' : 'en-US',
                  {
                    style: 'currency',
                    currency: conversion.commissionCurrency,
                  },
                ).format(Number(conversion.commissionAmount)),
              },
              { label: 'Previous status', value: conversion.status },
            ],
            actionLabel: 'Review commission ledger',
            actionPath: '/dashboard/earnings',
          }),
        ),
        ...result.cancelledPayouts.map((payout) =>
          sendAffiliateAccountNotification({
            affiliateId: payout.affiliateId,
            eventKey: `payout:cancelled:${payout.pidPayout}`,
            eventType: 'PAYOUT_CANCELLED',
            subject: 'Your affiliate payout request was cancelled',
            title: 'Payout request cancelled',
            message:
              'This payout request was cancelled automatically because one of its included commissions was reversed. Any unaffected commissions have been returned to your available balance.',
            facts: [
              { label: 'Reference', value: payout.pidPayout },
              {
                label: 'Amount',
                value: new Intl.NumberFormat(
                  payout.currency === 'NGN' ? 'en-NG' : 'en-US',
                  { style: 'currency', currency: payout.currency },
                ).format(Number(payout.amount)),
              },
            ],
            actionLabel: 'Review payouts',
            actionPath: '/dashboard/payouts',
          }),
        ),
      ]).then(() => undefined),
    );
  }
  return result.conversions.length;
}
