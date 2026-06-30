'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { checkAuth } from '@/lib/auth/checkAuth';
import { uploadBufferToCloudinary } from '@/lib/cloudinary/upload';
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
  attachmentsJson: string | null;
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

type ReviewAttachment = {
  name: string;
  url: string;
  type: string;
  size: number;
  publicId: string;
};

const MAX_REVIEW_FILES = 5;
const MAX_REVIEW_FILE_SIZE = 10 * 1024 * 1024;
const REVIEW_TYPES_WITH_ATTACHMENTS = new Set(['quote_review', 'invoice_check']);
const ALLOWED_REVIEW_EXTENSIONS = new Set([
  'pdf',
  'png',
  'jpg',
  'jpeg',
  'webp',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'txt',
]);

function getExtension(filename: string) {
  return filename.split('.').pop()?.toLowerCase() || '';
}

function getReviewFiles(formData: FormData) {
  return formData
    .getAll('attachments')
    .filter((value): value is File => value instanceof File && value.size > 0);
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
      attachmentsJson,
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
  const files = REVIEW_TYPES_WITH_ATTACHMENTS.has(requestType)
    ? getReviewFiles(formData)
    : [];

  if (!supplierName && !supplierWebsite && !productDetails) {
    throw new Error('Add at least a supplier name, supplier link, or product details.');
  }

  if (!decisionNeeded) {
    throw new Error('Tell us the decision you need help making.');
  }

  if (files.length > MAX_REVIEW_FILES) {
    throw new Error(`Upload at most ${MAX_REVIEW_FILES} supporting files.`);
  }

  const pidRequest = `INTREV${randomGenerator(12)}`;
  const attachments: ReviewAttachment[] = [];

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const extension = getExtension(file.name || '');

    if (!ALLOWED_REVIEW_EXTENSIONS.has(extension)) {
      throw new Error(
        'Only PDF, image, Word, Excel and text files are allowed for review uploads.',
      );
    }

    if (file.size > MAX_REVIEW_FILE_SIZE) {
      throw new Error('Each review file must be 10MB or less.');
    }

    const uploaded = await uploadBufferToCloudinary(
      Buffer.from(await file.arrayBuffer()),
      {
        folder: 'sureimports/intelligence-reviews',
        publicId: `${pidRequest}-${index + 1}`,
        resourceType: 'auto',
        useFilename: false,
        uniqueFilename: false,
        overwrite: true,
        tags: ['supplier-intelligence', pidRequest],
      },
    );

    attachments.push({
      name: file.name || uploaded.originalFilename || `Attachment ${index + 1}`,
      url: uploaded.url,
      type: file.type || uploaded.resourceType || 'application/octet-stream',
      size: file.size,
      publicId: uploaded.publicId,
    });
  }

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
      attachmentsJson,
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
      ${attachments.length ? JSON.stringify(attachments) : null},
      'submitted',
      ${new Date()},
      ${new Date()}
    )
  `;

  revalidatePath('/dashboard/intelligence');
  revalidatePath('/dashboard/intelligence/reviews');
  redirect('/dashboard/intelligence/reviews?created=1');
}
