import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadBufferToCloudinary } from '@/lib/cloudinary/upload';
import xMail from '@/lib/email/xMail2';
import {
  notifyCustomerCorporateGiftStatus,
  type CorporateGiftStatus,
} from '@/lib/notifications/corporateGifts';
import { sendFacebookLeadCapiEvent } from '@/lib/facebookCapi';
import { verifyToken } from '@/lib/jwt';
import { CORPORATE_SOURCING_RESUME_PATH } from '@/lib/auth/loginRedirect';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_DELIVERY_LEAD_DAYS = 60;
const SUPPORTED_UPLOAD_EXTENSIONS = new Set([
  'jpg',
  'jpeg',
  'png',
  'gif',
  'webp',
  'svg',
  'pdf',
]);

class UploadValidationError extends Error {}

const getString = (formData: FormData, keys: string[]) => {
  for (const key of keys) {
    const value = formData.get(key);
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
};

const getFileExtension = (filename: string) =>
  filename.includes('.') ? filename.split('.').pop()?.toLowerCase() || '' : '';

const hasExpectedFileSignature = (buffer: Buffer, extension: string) => {
  if (extension === 'jpg' || extension === 'jpeg') {
    return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  if (extension === 'png') {
    return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }

  if (extension === 'gif') {
    const signature = buffer.subarray(0, 6).toString('ascii');
    return signature === 'GIF87a' || signature === 'GIF89a';
  }

  if (extension === 'webp') {
    return (
      buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
      buffer.subarray(8, 12).toString('ascii') === 'WEBP'
    );
  }

  if (extension === 'pdf') {
    return buffer.subarray(0, 1024).toString('ascii').includes('%PDF-');
  }

  if (extension === 'svg') {
    return /<svg(?:\s|>)/i.test(buffer.subarray(0, 4096).toString('utf8'));
  }

  return false;
};

const validateUpload = async (file: File, label: string) => {
  if (file.size > MAX_FILE_SIZE) {
    throw new UploadValidationError(`${label} exceeds the 10MB limit.`);
  }

  const extension = getFileExtension(file.name);
  if (!SUPPORTED_UPLOAD_EXTENSIONS.has(extension)) {
    throw new UploadValidationError(
      `${label} must be a JPG, PNG, GIF, WebP, SVG, or PDF file.`,
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (!hasExpectedFileSignature(buffer, extension)) {
    throw new UploadValidationError(
      `${label} does not contain valid ${extension.toUpperCase()} data. Renaming a file does not convert its format.`,
    );
  }

  return buffer;
};

const uploadToCloudinary = async (buffer: Buffer, key: string) => {
  const uploaded = await uploadBufferToCloudinary(buffer, {
    folder: 'sureimports/corporate-gifts',
    publicId: key,
    resourceType: 'image',
    useFilename: false,
    uniqueFilename: false,
    overwrite: true,
  });
  return uploaded.url;
};

const getIpAddress = (req: Request) => {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const first = forwardedFor.split(',')[0]?.trim();
    if (first) return first;
  }

  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp;

  return null;
};

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    let authenticatedPidUser: string | null = null;
    if (token) {
      try {
        const payload = verifyToken(token);
        if (payload && typeof payload === 'object' && 'pidUser' in payload) {
          authenticatedPidUser = String(payload.pidUser);
        }
      } catch {
        authenticatedPidUser = null;
      }
    }

    if (!authenticatedPidUser) {
      return NextResponse.json(
        {
          statusx: 'AUTH_REQUIRED',
          error: 'Please sign in or create an account to submit your request.',
          loginPath: `/auth/login?next=${encodeURIComponent(CORPORATE_SOURCING_RESUME_PATH)}`,
        },
        { status: 401 },
      );
    }

    const authenticatedUser = await prisma.users.findUnique({
      where: { pidUser: authenticatedPidUser },
      select: { pidUser: true },
    });
    if (!authenticatedUser) {
      return NextResponse.json(
        { statusx: 'AUTH_REQUIRED', error: 'Your session is no longer valid.' },
        { status: 401 },
      );
    }

    const formData = await req.formData();

    // 1. Extract text fields (supports current and legacy keys)
    const data = {
      businessName: getString(formData, ['business_name']),
      contactPersonFullName: getString(formData, [
        'contact_person_full_name',
        'contact_person',
      ]),
      productOrItemNeeded: getString(formData, [
        'product_or_item_needed',
        'product_needed',
      ]),
      detailedSpecifications: getString(formData, [
        'detailed_specifications',
        'detailed_specs',
      ]),
      quantityNeededRaw: getString(formData, ['quantity_needed', 'quantity']),
      preferredQualityLevel: getString(formData, [
        'preferred_quality_level',
        'quality_level',
      ]),
      brandingCustomizationRequired: getString(formData, [
        'branding_customization_required',
        'branding_required',
      ]),
      expectedDeliveryDate: getString(formData, [
        'expected_delivery_date',
        'delivery_date',
      ]),
      finalDeliveryLocationNigeria: getString(formData, [
        'final_delivery_location_nigeria',
        'delivery_location',
      ]),
      contactEmail: getString(formData, ['contact_email']),
      whatsappNumber: getString(formData, ['whatsapp_number', 'whatsapp']),
      proceedTimeline:
        getString(formData, ['proceed_timeline', 'proceeding_timeline']) ||
        null,
      hearAboutSureImports:
        getString(formData, ['hear_about_sureimports', 'source']) || null,
      additionalNotes: getString(formData, ['additional_notes']) || null,
      pageUrl: getString(formData, ['page_url']) || null,
      utmSource: getString(formData, ['utm_source']) || null,
      utmMedium: getString(formData, ['utm_medium']) || null,
      utmCampaign: getString(formData, ['utm_campaign']) || null,
      utmContent: getString(formData, ['utm_content']) || null,
      utmTerm: getString(formData, ['utm_term']) || null,
      submittedAt:
        getString(formData, ['submitted_at']) || new Date().toISOString(),
      fbEventId: getString(formData, ['fb_event_id']) || null,
      fbp: getString(formData, ['fbp']) || null,
      fbc: getString(formData, ['fbc']) || null,
    };

    const quantityNeeded = Number(data.quantityNeededRaw);

    // 2. Server-side validation
    if (
      !data.businessName ||
      !data.contactPersonFullName ||
      !data.productOrItemNeeded ||
      !data.detailedSpecifications ||
      !Number.isFinite(quantityNeeded) ||
      quantityNeeded <= 0 ||
      !data.preferredQualityLevel ||
      !data.brandingCustomizationRequired ||
      !data.expectedDeliveryDate ||
      !data.finalDeliveryLocationNigeria ||
      !data.contactEmail ||
      !data.whatsappNumber
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    if (!EMAIL_REGEX.test(data.contactEmail)) {
      return NextResponse.json(
        { error: 'Invalid contact email' },
        { status: 400 },
      );
    }

    const expectedDeliveryDate = new Date(`${data.expectedDeliveryDate}T00:00:00`);
    const minimumAllowedDate = new Date();
    minimumAllowedDate.setHours(0, 0, 0, 0);
    minimumAllowedDate.setDate(minimumAllowedDate.getDate() + MIN_DELIVERY_LEAD_DAYS);

    if (
      Number.isNaN(expectedDeliveryDate.getTime()) ||
      expectedDeliveryDate < minimumAllowedDate
    ) {
      return NextResponse.json(
        {
          error:
            'Expected delivery date must be at least 2 months from today (recommended 2-3 months).',
        },
        { status: 400 },
      );
    }

    const pidRequest = `CGR-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    // 3. Extract files (actual front-end keys + legacy keys)
    const attachments = [];
    const refImage =
      (formData.get('reference_image_upload') as File | null) ||
      (formData.get('reference_image') as File | null);
    const companyLogo =
      (formData.get('company_logo_upload') as File | null) ||
      (formData.get('company_logo') as File | null);

    let referenceFileUrl: string | null = null;
    let logoFileUrl: string | null = null;
    if (refImage && refImage.size > 0) {
      const buffer = await validateUpload(refImage, 'Reference file');
      attachments.push({ filename: refImage.name });
      referenceFileUrl = await uploadToCloudinary(
        buffer,
        `${pidRequest}-reference`,
      );
    }

    if (companyLogo && companyLogo.size > 0) {
      const buffer = await validateUpload(companyLogo, 'Company logo');
      attachments.push({ filename: companyLogo.name });
      logoFileUrl = await uploadToCloudinary(buffer, `${pidRequest}-logo`);
    }

    // 4. Persist submission against the authenticated account
    await prisma.corporate_gift_request.create({
      data: {
        pidRequest,
        pidUser: authenticatedUser.pidUser,
        businessName: data.businessName,
        contactPersonFullName: data.contactPersonFullName,
        productOrItemNeeded: data.productOrItemNeeded,
        detailedSpecifications: data.detailedSpecifications,
        quantityNeeded,
        preferredQualityLevel: data.preferredQualityLevel,
        brandingCustomizationRequired: data.brandingCustomizationRequired,
        expectedDeliveryDate: data.expectedDeliveryDate,
        finalDeliveryLocationNigeria: data.finalDeliveryLocationNigeria,
        contactEmail: data.contactEmail,
        whatsappNumber: data.whatsappNumber,
        proceedTimeline: data.proceedTimeline,
        hearAboutSureImports: data.hearAboutSureImports,
        additionalNotes: data.additionalNotes,
        referenceFileUrl,
        referenceFileName: refImage?.name || null,
        logoFileUrl,
        logoFileName: companyLogo?.name || null,
        status: 'Pending',
        pageUrl: data.pageUrl,
        utmSource: data.utmSource,
        utmMedium: data.utmMedium,
        utmCampaign: data.utmCampaign,
        utmContent: data.utmContent,
        utmTerm: data.utmTerm,
        submittedAt: data.submittedAt,
      },
    });

    const notificationResult = await notifyCustomerCorporateGiftStatus({
      requestId: pidRequest,
      businessName: data.businessName,
      contactPersonFullName: data.contactPersonFullName,
      contactEmail: data.contactEmail,
      whatsappNumber: data.whatsappNumber,
      status: 'Pending' as CorporateGiftStatus,
      onboarding: {
        accountCreated: false,
        dashboardLink: 'https://sureimports.com/dashboard/corporate-sourcing',
      },
    });

    // 6. Construct Email Body
    const emailText = `
New Corporate Sourcing Request
-----------------------------------

Request ID: ${pidRequest}

Business Name: ${data.businessName}
Contact Person: ${data.contactPersonFullName}
Email: ${data.contactEmail}
WhatsApp: ${data.whatsappNumber}

PRODUCT OR MACHINE DETAILS
--------------------------
Product or Machine Needed: ${data.productOrItemNeeded}
Quantity: ${quantityNeeded}
Quality / Duty Level: ${data.preferredQualityLevel}
Branding / Customization: ${data.brandingCustomizationRequired}

Specifications:
${data.detailedSpecifications}

DELIVERY & TIMELINE
-------------------
Expected Delivery Date: ${data.expectedDeliveryDate}
Final Delivery Location: ${data.finalDeliveryLocationNigeria}
Proceeding Timeline: ${data.proceedTimeline || 'N/A'}

EXTRA INFO
----------
Source: ${data.hearAboutSureImports || 'N/A'}
Additional Notes: ${data.additionalNotes || 'N/A'}
UTM Source: ${data.utmSource || 'N/A'}
UTM Medium: ${data.utmMedium || 'N/A'}
UTM Campaign: ${data.utmCampaign || 'N/A'}
UTM Content: ${data.utmContent || 'N/A'}
UTM Term: ${data.utmTerm || 'N/A'}

TRACKING
--------
Submitted At: ${data.submittedAt}
Page URL: ${data.pageUrl || 'N/A'}
    `.trim();

    // 7. Send internal team email notification (non-blocking for user success)
    try {
      const attachmentNames = attachments.length
        ? attachments.map((file) => file.filename).join(', ')
        : 'None';

      await xMail({
        xEmail: 'hello@sureimports.com',
        xTitle: `New Corporate Sourcing Request - ${data.businessName}`,
        xBodyTitle: 'New Corporate Sourcing Request',
        xBody1: `A new corporate sourcing request has been submitted.<br /><b>Request ID:</b> ${pidRequest}`,
        xBody2: `<pre>${emailText}</pre><p><strong>Attachments:</strong> ${attachmentNames}</p>`,
        xButtonTitle: 'Open Admin Dashboard',
        xButtonLink: 'https://admin.sureimports.com/dashboard/corporate-sourcing',
        throwOnError: true,
      });
    } catch (emailError) {
      console.error('Corporate sourcing email notification failed:', emailError);
    }

    // 8. Send Facebook CAPI Lead event (non-blocking for user success)
    try {
      const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
      const accessToken = process.env.FACEBOOK_CAPI_ACCESS_TOKEN;

      if (pixelId && accessToken && data.fbEventId) {
        await sendFacebookLeadCapiEvent({
          pixelId,
          accessToken,
          eventId: data.fbEventId,
          eventSourceUrl: data.pageUrl,
          testEventCode: process.env.FACEBOOK_TEST_EVENT_CODE || null,
          userData: {
            email: data.contactEmail,
            phone: data.whatsappNumber,
            clientIpAddress: getIpAddress(req),
            clientUserAgent: req.headers.get('user-agent'),
            fbp: data.fbp,
            fbc: data.fbc,
          },
          customData: {
            content_name: 'Corporate Sourcing Submission',
            content_category: 'Corporate Sourcing',
            value: quantityNeeded,
            currency: 'NGN',
          },
        });
      }
    } catch (capiError) {
      console.error('Corporate sourcing Facebook CAPI failed:', capiError);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Request submitted successfully',
        pidRequest,
        redirectTo: `/dashboard/corporate-sourcing?request=${encodeURIComponent(pidRequest)}`,
        notifications: notificationResult,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof UploadValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Log server errors safely without exposing to client
    console.error('Submission processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 },
    );
  }
}
