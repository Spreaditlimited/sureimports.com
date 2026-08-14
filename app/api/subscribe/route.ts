import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

import { sendFacebookLeadCapiEvent } from '@/lib/facebookCapi';
import xMail2 from '@/lib/email/xMail2';
import { prisma } from '@/lib/prisma';
import { recordMarketingOptIn } from '@/lib/marketing/contactLedger';
import { belongsToSesMarketing } from '@/lib/marketing/cutover';

const DEFAULT_SEGMENT_ID = '67699403ee348d7f8cb68f3a';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface SubscriberData {
  email: string;
  first_name?: string;
  last_name?: string;
  segment_ids?: string[];
  source?: string;
  message_variant?: string;
  page_type?: string;
  page_url?: string;
  pathname?: string;
  referrer?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
  fbclid?: string | null;
  first_seen_at?: string | null;
  dismiss_count?: number | string;
  fbEventId?: string;
  fbp?: string | null;
  fbc?: string | null;
  pageUrl?: string | null;
  lead_magnet_slug?: string | null;
  lead_magnet_title?: string | null;
  lead_magnet_download_url?: string | null;
  offer_cta?: string | null;
}

function getIpAddress(request: Request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    null
  );
}

function cleanSegmentIds(segmentIds?: string[]) {
  const cleaned = Array.isArray(segmentIds)
    ? segmentIds.filter((id) => typeof id === 'string' && id.trim())
    : [];

  return cleaned.length > 0 ? cleaned : [DEFAULT_SEGMENT_ID];
}

function cleanString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function isAlreadySubscribedResponse(status: number, responseBody: string) {
  if (status === 409) return true;

  return /already|exists|exist|duplicate|previously subscribed|subscriber.+email/i.test(
    responseBody,
  );
}

async function ensureLeadMagnetLeadColumns() {
  const statements = [
    'ALTER TABLE marketing_leads ADD COLUMN leadMagnetSlug VARCHAR(255) NULL',
    'ALTER TABLE marketing_leads ADD COLUMN leadMagnetTitle VARCHAR(255) NULL',
    'ALTER TABLE marketing_leads ADD COLUMN leadMagnetDownloadUrl TEXT NULL',
    'ALTER TABLE marketing_leads ADD COLUMN offerCta VARCHAR(120) NULL',
  ];

  for (const statement of statements) {
    try {
      await prisma.$executeRawUnsafe(statement);
    } catch (error: any) {
      if (error?.code !== 'P2010' && !/Duplicate column|ER_DUP_FIELDNAME/i.test(String(error?.message || ''))) {
        throw error;
      }
    }
  }
}

export async function POST(request: Request) {
  try {
    const body: SubscriberData = await request.json();
    const { email, first_name, last_name, segment_ids } = body;
    const normalizedEmail =
      typeof email === 'string' ? email.trim().toLowerCase() : '';
    const firstName =
      typeof first_name === 'string' ? first_name.trim() : '';

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 },
      );
    }

    if (!firstName) {
      return NextResponse.json(
        { success: false, error: 'First name is required.' },
        { status: 400 },
      );
    }

    const sesOwned = belongsToSesMarketing(new Date());

    if (!sesOwned && !process.env.FLODESK_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Newsletter service is not configured.' },
        { status: 500 },
      );
    }

    const cleanedSegmentIds = cleanSegmentIds(segment_ids);
    const leadMagnetSlug = cleanString(body.lead_magnet_slug);
    const leadMagnetTitle = cleanString(body.lead_magnet_title);
    const leadMagnetDownloadUrl = cleanString(body.lead_magnet_download_url);
    const offerCta = cleanString(body.offer_cta);

    if (leadMagnetSlug || leadMagnetDownloadUrl) {
      await ensureLeadMagnetLeadColumns();
    }

    let alreadySubscribed = false;
    if (!sesOwned) {
      const response = await fetch('https://api.flodesk.com/v1/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(process.env.FLODESK_API_KEY + ':').toString('base64')}`,
          'User-Agent': 'Sure Imports (www.sureimports.com)',
        },
        body: JSON.stringify({
          email: normalizedEmail,
          first_name: firstName,
          last_name,
          segment_ids: cleanedSegmentIds,
        }),
      });

      const responseBody = await response.text();
      alreadySubscribed = isAlreadySubscribedResponse(response.status, responseBody);
      if (!response.ok && !alreadySubscribed) {
        throw new Error(`Flodesk subscriber request failed (${response.status}): ${responseBody}`);
      }
    }

    try {
      await recordMarketingOptIn({
        email: normalizedEmail,
        firstName,
        lastName: cleanString(last_name),
        source: cleanString(body.source) || 'lead_capture_popup',
        context: {
          pageType: cleanString(body.page_type || body.message_variant),
          pathname: cleanString(body.pathname),
          segmentIds: cleanedSegmentIds,
          leadMagnetSlug,
          channelOwner: sesOwned ? 'SES' : 'FLODESK',
        },
      });
    } catch (error) {
      console.error('Marketing contact ledger sync failed', error);
    }

    let analyticsSaved = true;
    try {
      const pidLead =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `lead_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

      await prisma.$executeRaw(
        Prisma.sql`
          INSERT INTO marketing_leads (
            pidLead,
            firstName,
            email,
            segmentId,
            source,
            pageType,
            pageUrl,
            pathname,
            referrer,
            utmSource,
            utmMedium,
            utmCampaign,
            utmContent,
            utmTerm,
            fbclid,
            fbp,
            fbc,
            leadMagnetSlug,
            leadMagnetTitle,
            leadMagnetDownloadUrl,
            offerCta,
            updatedAt
          ) VALUES (
            ${pidLead},
            ${firstName},
            ${normalizedEmail},
            ${cleanedSegmentIds[0] || DEFAULT_SEGMENT_ID},
            ${cleanString(body.source) || 'lead_capture_popup'},
            ${cleanString(body.page_type || body.message_variant)},
            ${cleanString(body.page_url || body.pageUrl)},
            ${cleanString(body.pathname)},
            ${cleanString(body.referrer)},
            ${cleanString(body.utm_source)},
            ${cleanString(body.utm_medium)},
            ${cleanString(body.utm_campaign)},
            ${cleanString(body.utm_content)},
            ${cleanString(body.utm_term)},
            ${cleanString(body.fbclid)},
            ${cleanString(body.fbp)},
            ${cleanString(body.fbc)},
            ${leadMagnetSlug},
            ${leadMagnetTitle},
            ${leadMagnetDownloadUrl},
            ${offerCta},
            ${new Date()}
          )
        `,
      );
    } catch (error) {
      analyticsSaved = false;
      console.error('Marketing lead save failed', error);

      if (!alreadySubscribed) {
        return NextResponse.json(
          {
            success: false,
            code: 'MARKETING_LEAD_SAVE_FAILED',
            error: 'We could not save your subscription details. Please try again.',
          },
          { status: 500 },
        );
      }
    }

    const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
    const accessToken = process.env.FACEBOOK_CAPI_ACCESS_TOKEN;

    if (pixelId && accessToken && body.fbEventId) {
      try {
        await sendFacebookLeadCapiEvent({
          pixelId,
          accessToken,
          eventId: body.fbEventId,
          eventSourceUrl: body.pageUrl || body.page_url || null,
          testEventCode: process.env.FACEBOOK_TEST_EVENT_CODE || null,
          userData: {
            email: normalizedEmail,
            phone: null,
            clientIpAddress: getIpAddress(request),
            clientUserAgent: request.headers.get('user-agent'),
            fbp: body.fbp || null,
            fbc: body.fbc || null,
          },
          customData: {
            content_name: leadMagnetTitle || 'Website Lead Capture Popup',
            content_category: body.page_type || body.message_variant || 'site',
            source: body.source || 'lead_capture_popup',
            lead_magnet_slug: leadMagnetSlug,
            offer_cta: offerCta,
            page_type: body.page_type,
            pathname: body.pathname,
            referrer: body.referrer,
            utm_source: body.utm_source,
            utm_medium: body.utm_medium,
            utm_campaign: body.utm_campaign,
            utm_content: body.utm_content,
            utm_term: body.utm_term,
            fbclid: body.fbclid,
            dismiss_count:
              typeof body.dismiss_count === 'number'
                ? body.dismiss_count
                : Number(body.dismiss_count || 0),
            value: 1,
            currency: 'NGN',
          },
        });
      } catch (error) {
        console.error('Facebook CAPI lead event failed', error);
      }
    }

    if (leadMagnetDownloadUrl) {
      try {
        await xMail2({
          xEmail: normalizedEmail,
          xTitle: leadMagnetTitle || 'Your SureImports guide is ready',
          xBodyTitle: leadMagnetTitle || 'Your guide is ready',
          xBody1:
            `Hello ${firstName},<br /><br />` +
            `Here is the guide you requested from SureImports.<br /><br />` +
            `${cleanString(body.lead_magnet_title) ? `<b>${cleanString(body.lead_magnet_title)}</b><br /><br />` : ''}` +
            `You can download it right away using the button below.<br /><br />` +
            `Next week, I will send you the first lesson in our practical China importation series.`,
          xButtonTitle: 'Download the guide',
          xButtonLink: leadMagnetDownloadUrl,
        });
      } catch (error) {
        console.error('Lead magnet delivery email failed', error);
      }
    }

    return NextResponse.json({
      success: true,
      alreadySubscribed,
      analyticsSaved,
      leadMagnetDownloadUrl,
      message: alreadySubscribed
        ? 'This email is already subscribed.'
        : 'Subscription successful.',
    });
  } catch (error) {
    console.error('Error adding subscriber', error);
    return NextResponse.json(
      { success: false, error: 'Error adding subscriber' },
      { status: 500 },
    );
  }
}
