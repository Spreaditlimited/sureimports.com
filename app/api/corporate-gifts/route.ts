import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadBufferToCloudinary } from '@/lib/cloudinary/upload';
import xMail from '@/lib/email/xMail2';
import bcrypt from 'bcryptjs';
import {
  notifyCustomerCorporateGiftStatus,
  type CorporateGiftStatus,
} from '@/lib/notifications/corporateGifts';
import { sendFacebookLeadCapiEvent } from '@/lib/facebookCapi';
import randomGenerator from '@/lib/helpers/randomGenerator';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_CORPORATE_GIFT_QUANTITY = 500;
const MIN_DELIVERY_LEAD_DAYS = 60;

const getString = (formData: FormData, keys: string[]) => {
  for (const key of keys) {
    const value = formData.get(key);
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
};

const uploadToCloudinary = async (file: File, key: string) => {
  const buffer = Buffer.from(await file.arrayBuffer());
  const uploaded = await uploadBufferToCloudinary(buffer, {
    folder: 'sureimports/corporate-gifts',
    publicId: key,
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

    if (quantityNeeded < MIN_CORPORATE_GIFT_QUANTITY) {
      return NextResponse.json(
        {
          error: `Minimum quantity is ${MIN_CORPORATE_GIFT_QUANTITY} units.`,
        },
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
    let referenceFileUrl: string | null = null;
    let logoFileUrl: string | null = null;
    if (refImage && refImage.size > 0) {
      const ext = refImage.name.includes('.')
        ? refImage.name.split('.').pop()
        : 'bin';
      referenceFileKey = `${pidRequest}-reference.${ext}`;
      referenceFileUrl = await uploadToCloudinary(refImage, referenceFileKey);
    }

    if (companyLogo && companyLogo.size > 0) {
      const ext = companyLogo.name.includes('.')
        ? companyLogo.name.split('.').pop()
        : 'bin';
      logoFileKey = `${pidRequest}-logo.${ext}`;
      logoFileUrl = await uploadToCloudinary(companyLogo, logoFileKey);
    }

    // 4. Create account for corporate contact if missing
    let createdDashboardAccount = false;
    let temporaryPassword: string | null = null;

    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [{ userEmail: data.contactEmail }, { email: data.contactEmail }],
      },
      select: { pidUser: true },
    });
    let requestPidUser: string | null = existingUser?.pidUser || null;

    if (!existingUser) {
      temporaryPassword = randomGenerator(12);
      const passwordHash = bcrypt.hashSync(temporaryPassword, 8);
      const sessionHash = bcrypt.hashSync(randomGenerator(10), 8);
      const contactNames = data.contactPersonFullName.split(' ').filter(Boolean);
      const firstName = contactNames[0] || data.businessName;
      const lastName = contactNames.slice(1).join(' ') || 'Corporate';

      const createdUser = await prisma.users.create({
        data: {
          pidUser: `CUS${randomGenerator(10)}`,
          userFirstname: firstName,
          userLastname: lastName,
          userEmail: data.contactEmail,
          email: data.contactEmail,
          userPassword: passwordHash,
          userSession: sessionHash,
          userPhone: data.whatsappNumber,
          phone: data.whatsappNumber,
          userCid: 'VERIFIED',
          // Mark verified to allow immediate access with temporary password.
          userStatus: 'AL1',
          loginStatus: 'TEMP_PASSWORD_UNUSED',
          userAffiliateCode: randomGenerator(6),
        },
      });
      requestPidUser = createdUser.pidUser;
      createdDashboardAccount = true;
    }

    // 5. Persist submission in DB
    await prisma.corporate_gift_request.create({
      data: {
        pidRequest,
        pidUser: requestPidUser,
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
        accountCreated: createdDashboardAccount,
        temporaryPassword: temporaryPassword || undefined,
        dashboardLink: 'https://sureimports.com/dashboard/corporate-gifts',
      },
    });

    // 6. Construct Email Body
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

    // 7. Send internal team email notification (non-blocking for user success)
    try {
      const attachmentNames = attachments.length
        ? attachments.map((file) => file.filename).join(', ')
        : 'None';

      await xMail({
        xEmail: 'hello@sureimports.com',
        xTitle: `New Corporate Gift Sourcing Request - ${data.businessName}`,
        xBodyTitle: 'New Corporate Gift Sourcing Request',
        xBody1: `A new corporate gift sourcing request has been submitted.<br /><b>Request ID:</b> ${pidRequest}`,
        xBody2: `<pre>${emailText}</pre><p><strong>Attachments:</strong> ${attachmentNames}</p>`,
        xButtonTitle: 'Open Admin Dashboard',
        xButtonLink: 'https://admin.sureimports.com/dashboard/corporate-gifts',
      });
    } catch (emailError) {
      console.error('Corporate gifts email notification failed:', emailError);
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
            content_name: 'Corporate Gift Submission',
            content_category: 'Corporate Gifts',
            value: quantityNeeded,
            currency: 'NGN',
          },
        });
      }
    } catch (capiError) {
      console.error('Corporate gifts Facebook CAPI failed:', capiError);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Request submitted successfully',
        pidRequest,
        notifications: notificationResult,
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
