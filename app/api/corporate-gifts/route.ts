import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Upload } from '@aws-sdk/lib-storage';
import { getR2Client } from '@/app/utils/r2Client';
import sendEmail from '@/lib/email/config/sendEmail';
import {
  notifyCustomerCorporateGiftStatus,
  type CorporateGiftStatus,
} from '@/lib/notifications/corporateGifts';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getString = (formData: FormData, keys: string[]) => {
  for (const key of keys) {
    const value = formData.get(key);
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
};

const toR2Url = (key: string) => {
  const base = (process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '').replace(/\/$/, '');
  return base ? `${base}/${key}` : null;
};

const uploadToR2 = async (file: File, key: string) => {
  const buffer = await file.arrayBuffer();
  const upload = new Upload({
    client: getR2Client(),
    params: {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: Buffer.from(buffer),
      ContentType: file.type || 'application/octet-stream',
    },
  });
  await upload.done();
};

export async function POST(req: Request) {
  try {
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

    const pidRequest = `CGR-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    // 3. Extract files (actual front-end keys + legacy keys)
    const attachments = [];
    const refImage =
      (formData.get('reference_image_upload') as File | null) ||
      (formData.get('reference_image') as File | null);
    const companyLogo =
      (formData.get('company_logo_upload') as File | null) ||
      (formData.get('company_logo') as File | null);

    if (refImage && refImage.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Reference image exceeds 10MB limit' },
        { status: 400 },
      );
    }

    if (companyLogo && companyLogo.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Company logo exceeds 10MB limit' },
        { status: 400 },
      );
    }

    if (refImage && refImage.size > 0) {
      const buffer = Buffer.from(await refImage.arrayBuffer());
      attachments.push({
        filename: refImage.name,
        content: buffer,
        contentType: refImage.type,
      });
    }

    if (companyLogo && companyLogo.size > 0) {
      const buffer = Buffer.from(await companyLogo.arrayBuffer());
      attachments.push({
        filename: companyLogo.name,
        content: buffer,
        contentType: companyLogo.type,
      });
    }

    let referenceFileKey: string | null = null;
    let logoFileKey: string | null = null;
    if (refImage && refImage.size > 0) {
      const ext = refImage.name.includes('.')
        ? refImage.name.split('.').pop()
        : 'bin';
      referenceFileKey = `${pidRequest}-reference.${ext}`;
      await uploadToR2(refImage, referenceFileKey);
    }

    if (companyLogo && companyLogo.size > 0) {
      const ext = companyLogo.name.includes('.')
        ? companyLogo.name.split('.').pop()
        : 'bin';
      logoFileKey = `${pidRequest}-logo.${ext}`;
      await uploadToR2(companyLogo, logoFileKey);
    }

    // 4. Persist submission in DB
    await prisma.corporate_gift_request.create({
      data: {
        pidRequest,
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
        referenceFileUrl: referenceFileKey ? toR2Url(referenceFileKey) : null,
        referenceFileName: refImage?.name || null,
        logoFileUrl: logoFileKey ? toR2Url(logoFileKey) : null,
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

    await notifyCustomerCorporateGiftStatus({
      requestId: pidRequest,
      businessName: data.businessName,
      contactPersonFullName: data.contactPersonFullName,
      contactEmail: data.contactEmail,
      whatsappNumber: data.whatsappNumber,
      status: 'Pending' as CorporateGiftStatus,
    });

    // 5. Construct Email Body
    const emailText = `
New Corporate Gift Sourcing Request
-----------------------------------

Request ID: ${pidRequest}

Business Name: ${data.businessName}
Contact Person: ${data.contactPersonFullName}
Email: ${data.contactEmail}
WhatsApp: ${data.whatsappNumber}

PRODUCT DETAILS
---------------
Product Needed: ${data.productOrItemNeeded}
Quantity: ${quantityNeeded}
Quality Level: ${data.preferredQualityLevel}
Branding Required: ${data.brandingCustomizationRequired}

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

    // 6. Send internal team email notification (non-blocking for user success)
    try {
      const attachmentNames = attachments.length
        ? attachments.map((file) => file.filename).join(', ')
        : 'None';

      await sendEmail(
        'hello@sureimports.com',
        `New Corporate Gift Sourcing Request - ${data.businessName}`,
        `<pre>${emailText}</pre><p><strong>Attachments:</strong> ${attachmentNames}</p>`,
      );
    } catch (emailError) {
      console.error('Corporate gifts email notification failed:', emailError);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Request submitted successfully',
        pidRequest,
      },
      { status: 200 },
    );
  } catch (error) {
    // Log server errors safely without exposing to client
    console.error('Submission processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 },
    );
  }
}
