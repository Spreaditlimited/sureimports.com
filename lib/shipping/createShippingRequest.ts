import 'server-only';

import { randomBytes } from 'node:crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export type ShippingRequestData = {
  pidUser: string;
  whatsappNumber: string;
  shippingName: string;
  shippingTo: string;
  grossWeight: string;
  trackingNumber?: string | null;
  shippingPlan: string;
  expectedShipments: string;
  description: string;
  wantProductVerification?: boolean;
  wantConsolidation?: boolean;
  multipleSuppliers?: boolean;
  owner?: {
    affiliateId: number;
    referralId?: number | null;
    apiCredentialId?: number | null;
    sourceType: 'PARTNER_API' | 'AFFILIATE_LINK';
    sourceReference?: string | null;
  } | null;
};

export function newShippingRequestId() {
  return `SL${Date.now()}${randomBytes(5).toString('hex').toUpperCase()}`;
}

export async function createShippingRequestInTransaction(
  tx: Prisma.TransactionClient,
  data: ShippingRequestData,
) {
  const pidShippingOnly = newShippingRequestId();
  const shippingRequest = await tx.shipping_only.create({
    data: {
      pidShippingOnly,
      pidUser: data.pidUser,
      whatsappNumber: data.whatsappNumber,
      shippingName: data.shippingName,
      shippingTo: data.shippingTo,
      grossWeight: data.grossWeight,
      trackingNumber: data.trackingNumber || '',
      shippingPlan: data.shippingPlan,
      expectedShipments: data.expectedShipments,
      description: data.description,
      wantProductVerification: Boolean(data.wantProductVerification),
      wantConsolidation: Boolean(data.wantConsolidation),
      multipleSuppliers: Boolean(data.multipleSuppliers),
      status: 'request-received',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  const attribution = data.owner
    ? await tx.shipping_request_attributions.create({
        data: {
          pidAttribution: `sattr_${randomBytes(18).toString('base64url')}`,
          pidShippingOnly,
          affiliateId: data.owner.affiliateId,
          referralId: data.owner.referralId || null,
          apiCredentialId: data.owner.apiCredentialId || null,
          sourceType: data.owner.sourceType,
          sourceReference:
            data.owner.sourceType === 'AFFILIATE_LINK'
              ? `${data.owner.sourceReference || 'referral'}:${pidShippingOnly}`.slice(
                  0,
                  191,
                )
              : data.owner.sourceReference?.slice(0, 191) || null,
        },
      })
    : null;
  return { shippingRequest, attribution };
}

export async function createShippingRequest(data: ShippingRequestData) {
  return prisma.$transaction((tx) =>
    createShippingRequestInTransaction(tx, data),
  );
}

export async function websiteShippingOwner(pidUser: string) {
  const referral = await prisma.affiliate_referrals.findUnique({
    where: { customerReference: pidUser },
    select: {
      id: true,
      affiliateId: true,
      pidReferral: true,
      affiliate: { select: { status: true } },
    },
  });
  if (!referral || referral.affiliate.status !== 'ACTIVE') return null;
  return {
    affiliateId: referral.affiliateId,
    referralId: referral.id,
    sourceType: 'AFFILIATE_LINK' as const,
    sourceReference: referral.pidReferral,
  };
}
