import { NextResponse } from 'next/server';
import { z } from 'zod';
import { checkAuth } from '@/lib/auth/checkAuth';
import { prisma } from '@/lib/prisma';
import {
  SUPPLIER_VERIFICATION_TERMS_VERSION,
  createSupplierVerificationEvent,
  getSupplierVerificationSettings,
  publicVerificationRequest,
  supplierVerificationId,
} from '@/lib/supplierVerification/service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const httpUrl = z
  .string()
  .url()
  .max(1000)
  .refine((value) => /^https?:\/\//i.test(value), 'Use an HTTP or HTTPS URL.');
const optionalUrl = z.union([z.literal(''), httpUrl]).optional();
const requestSchema = z.object({
  supplierName: z.string().trim().min(2).max(255),
  supplierNameChinese: z.string().trim().max(255).optional().default(''),
  registrationNumber: z.string().trim().max(120).optional().default(''),
  supplierPhone: z.string().trim().max(120).optional().default(''),
  supplierEmail: z
    .union([z.literal(''), z.string().email().max(255)])
    .optional()
    .default(''),
  supplierWechat: z.string().trim().max(160).optional().default(''),
  supplierAddress: z.string().trim().min(5).max(2000),
  supplierAddressChinese: z.string().trim().max(2000).optional().default(''),
  supplierProduct: z.string().trim().min(2).max(500),
  supplierWebsite: optionalUrl.default(''),
  marketplaceUrls: z.array(httpUrl).max(8).optional().default([]),
  supplierDetails: z.string().trim().min(10).max(5000),
  verificationType: z.enum(['ONLINE', 'PHYSICAL']),
  billingCountry: z.string().trim().min(2).max(120),
  termsAccepted: z.literal(true),
});

export async function GET() {
  const auth = await checkAuth();
  if (!auth)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const [requests, settings] = await Promise.all([
    prisma.verify_supplier.findMany({
      where: { pidUser: auth.pidUser },
      orderBy: { createdAt: 'desc' },
      include: {
        payments: { orderBy: { createdAt: 'desc' }, take: 10 },
        events: {
          where: { visibility: 'CUSTOMER' },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    }),
    getSupplierVerificationSettings(),
  ]);
  return NextResponse.json({
    requests: requests.map(publicVerificationRequest),
    pricing: {
      feeNaira: settings.feeNgnKobo / 100,
      feeUsdCents: settings.feeUsdCents,
      onlineEnabled: settings.onlineEnabled,
      physicalEnabled: settings.physicalEnabled,
    },
  });
}

export async function POST(request: Request) {
  const auth = await checkAuth();
  if (!auth)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const parsed = requestSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: 'Please review the supplier details.',
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }
  const input = parsed.data;
  const settings = await getSupplierVerificationSettings();
  if (input.verificationType === 'ONLINE' && !settings.onlineEnabled) {
    return NextResponse.json(
      { message: 'Online verification is temporarily unavailable.' },
      { status: 409 },
    );
  }
  if (input.verificationType === 'PHYSICAL' && !settings.physicalEnabled) {
    return NextResponse.json(
      { message: 'Physical verification is temporarily unavailable.' },
      { status: 409 },
    );
  }
  const user = await prisma.users.findUnique({
    where: { pidUser: auth.pidUser },
  });
  if (!user || user.userEmail.toLowerCase() !== auth.userEmail.toLowerCase()) {
    return NextResponse.json(
      { message: 'Account could not be verified.' },
      { status: 403 },
    );
  }
  const pidVerifySupplier = supplierVerificationId('SV');
  const isPhysical = input.verificationType === 'PHYSICAL';
  const status = 'AWAITING_PAYMENT';
  const created = await prisma.verify_supplier.create({
    data: {
      pidVerifySupplier,
      pidUser: auth.pidUser,
      userEmail: user.userEmail,
      customerName:
        [user.userFirstname, user.userLastname].filter(Boolean).join(' ') ||
        user.userEmail,
      supplierName: input.supplierName,
      supplierNameChinese: input.supplierNameChinese || null,
      registrationNumber: input.registrationNumber || null,
      supplierPhone: input.supplierPhone || null,
      supplierEmail: input.supplierEmail || null,
      supplierWechat: input.supplierWechat || null,
      supplierAddress: input.supplierAddress,
      supplierAddressChinese: input.supplierAddressChinese || null,
      supplierProduct: input.supplierProduct,
      supplierWebsite: input.supplierWebsite || null,
      marketplaceUrls: input.marketplaceUrls,
      supplierDetails: input.supplierDetails,
      verificationType: input.verificationType,
      billingCountry: input.billingCountry,
      status,
      transportQuoteStatus: isPhysical
        ? 'LOCKED_UNTIL_VERIFICATION_PAID'
        : 'NOT_REQUIRED',
      termsVersion: SUPPLIER_VERIFICATION_TERMS_VERSION,
      submittedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  await createSupplierVerificationEvent({
    requestId: pidVerifySupplier,
    eventType: 'REQUEST_SUBMITTED',
    toStatus: status,
    message: isPhysical
      ? 'Request received. Pay the standard verification fee first. Once confirmed, we can research and quote the optional physical visit.'
      : 'Request received. Complete payment to start the online verification.',
    actorId: auth.pidUser,
    actorEmail: auth.userEmail,
  });
  return NextResponse.json(
    { request: publicVerificationRequest(created) },
    { status: 201 },
  );
}
