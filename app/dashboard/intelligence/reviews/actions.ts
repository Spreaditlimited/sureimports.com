'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { checkAuth } from '@/lib/auth/checkAuth';
import randomGenerator from '@/lib/helpers/randomGenerator';
import { prisma } from '@/lib/prisma';

export type IntelligenceReviewRequest = {
  pidRequest: string;
  pidUser: string;
  email: string;
  requestType: string;
  nicheSlug: string | null;
  nicheName: string | null;
  supplierName: string | null;
  supplierWebsite: string | null;
  supplierContact: string | null;
  supplierAddress: string | null;
  productDetails: string | null;
  quoteDetails: string | null;
  targetQuantity: string | null;
  budgetRange: string | null;
  decisionNeeded: string | null;
  status: string;
  adminResponse: string | null;
  adminRecommendations: string | null;
  adminRiskLevel: string | null;
  reviewedByName: string | null;
  reviewedAt: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
};

function clean(value: FormDataEntryValue | null, max = 4000) {
  return String(value || '').trim().slice(0, max);
}

async function hasProReviewAccess(input: { pidUser: string; email: string }) {
  const now = new Date();
  const rows = await prisma.$queryRaw<Array<{ total: bigint }>>`
    SELECT COUNT(*) AS total
    FROM intelligence_subscriptions
    WHERE plan = 'pro'
      AND status IN ('active', 'non_renewing')
      AND (currentPeriodEnd IS NULL OR currentPeriodEnd > ${now})
      AND (
        pidUser = ${input.pidUser}
        OR LOWER(email) = LOWER(${input.email})
      )
  `;

  return Number(rows[0]?.total || 0) > 0;
}

export async function getUserIntelligenceReviewRequests(pidUser: string) {
  return prisma.$queryRaw<IntelligenceReviewRequest[]>`
    SELECT
      pidRequest,
      pidUser,
      email,
      requestType,
      nicheSlug,
      nicheName,
      supplierName,
      supplierWebsite,
      supplierContact,
      supplierAddress,
      productDetails,
      quoteDetails,
      targetQuantity,
      budgetRange,
      decisionNeeded,
      status,
      adminResponse,
      adminRecommendations,
      adminRiskLevel,
      reviewedByName,
      reviewedAt,
      createdAt,
      updatedAt
    FROM intelligence_review_requests
    WHERE pidUser = ${pidUser}
    ORDER BY createdAt DESC
    LIMIT 50
  `;
}

export async function createIntelligenceReviewRequest(formData: FormData) {
  const user = await checkAuth();

  if (!user?.pidUser || !user.userEmail) {
    throw new Error('Login required.');
  }

  const hasProAccess = await hasProReviewAccess({
    pidUser: user.pidUser,
    email: user.userEmail,
  });

  if (!hasProAccess) {
    throw new Error('This review workflow is available on the Pro plan.');
  }

  const requestType = clean(formData.get('requestType'), 60) || 'supplier_review';
  const supplierName = clean(formData.get('supplierName'), 180);
  const supplierWebsite = clean(formData.get('supplierWebsite'), 500);
  const supplierContact = clean(formData.get('supplierContact'), 500);
  const supplierAddress = clean(formData.get('supplierAddress'), 700);
  const productDetails = clean(formData.get('productDetails'));
  const quoteDetails = clean(formData.get('quoteDetails'));
  const targetQuantity = clean(formData.get('targetQuantity'), 120);
  const budgetRange = clean(formData.get('budgetRange'), 180);
  const decisionNeeded = clean(formData.get('decisionNeeded'));
  const nicheSlug = clean(formData.get('nicheSlug'), 180);
  const nicheName = clean(formData.get('nicheName'), 180);

  if (!supplierName && !supplierWebsite && !productDetails) {
    throw new Error('Add at least a supplier name, supplier link, or product details.');
  }

  if (!decisionNeeded) {
    throw new Error('Tell us the decision you need help making.');
  }

  const pidRequest = `INTREV${randomGenerator(12)}`;

  await prisma.$executeRaw`
    INSERT INTO intelligence_review_requests (
      pidRequest,
      pidUser,
      email,
      requestType,
      nicheSlug,
      nicheName,
      supplierName,
      supplierWebsite,
      supplierContact,
      supplierAddress,
      productDetails,
      quoteDetails,
      targetQuantity,
      budgetRange,
      decisionNeeded,
      status,
      createdAt,
      updatedAt
    ) VALUES (
      ${pidRequest},
      ${user.pidUser},
      ${user.userEmail},
      ${requestType},
      ${nicheSlug || null},
      ${nicheName || null},
      ${supplierName || null},
      ${supplierWebsite || null},
      ${supplierContact || null},
      ${supplierAddress || null},
      ${productDetails || null},
      ${quoteDetails || null},
      ${targetQuantity || null},
      ${budgetRange || null},
      ${decisionNeeded},
      'submitted',
      ${new Date()},
      ${new Date()}
    )
  `;

  revalidatePath('/dashboard/intelligence');
  revalidatePath('/dashboard/intelligence/reviews');
  redirect('/dashboard/intelligence/reviews?created=1');
}
