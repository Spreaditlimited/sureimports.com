import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import randomGenerator from '@/lib/helpers/randomGenerator';
import { verifyToken } from '@/lib/jwt';
import { notifyNewShippingOnlyRequest } from '@/lib/notifications/shippingOnly';
import { sendFacebookLeadCapiEvent } from '@/lib/facebookCapi';
import { SHIPPING_ONLY_RESUME_PATH } from '@/lib/auth/loginRedirect';

type Payload = {
  account?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  request: {
    whatsappNumber?: string;
    shippingName?: string;
    shippingTo?: string;
    grossWeight?: string;
    trackingNumber?: string;
    shippingPlan?: string;
    expectedShipments?: string;
    wantProductVerification?: boolean;
    wantConsolidation?: boolean;
    multipleSuppliers?: boolean;
  };
  fbEventId?: string;
  fbp?: string;
  fbc?: string;
  pageUrl?: string;
};

function normalize(value: string | undefined): string {
  return (value || '').trim();
}

function getIpAddress(req: Request) {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const first = forwardedFor.split(',')[0]?.trim();
    if (first) return first;
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp;
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Payload;

    if (!body?.request) {
      return NextResponse.json(
        { statusx: 'FAILED_VALIDATION', message: 'Missing request payload.' },
        { status: 400 },
      );
    }

    const whatsappNumber = normalize(body.request.whatsappNumber);
    const shippingName = normalize(body.request.shippingName);
    const shippingTo = normalize(body.request.shippingTo);
    const grossWeight = normalize(body.request.grossWeight);
    const trackingNumber = normalize(body.request.trackingNumber);
    const shippingPlan = normalize(body.request.shippingPlan);
    const expectedShipments = normalize(body.request.expectedShipments);
    const notes = expectedShipments;

    if (!shippingName || !shippingTo || !grossWeight || !shippingPlan || !notes) {
      return NextResponse.json(
        {
          statusx: 'FAILED_VALIDATION',
          message:
            'Please complete shipping name, destination country, shipping plan, gross weight, and expected shipment notes.',
        },
        { status: 400 },
      );
    }

    const token = request.cookies.get('token')?.value;
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
          message: 'Please sign in or create an account to submit your request.',
          loginPath: `/auth/login?next=${encodeURIComponent(SHIPPING_ONLY_RESUME_PATH)}`,
        },
        { status: 401 },
      );
    }

    const user = await prisma.users.findUnique({
      where: { pidUser: authenticatedPidUser },
    });
    if (!user) {
      return NextResponse.json(
        {
          statusx: 'AUTH_REQUIRED',
          message: 'Your session is no longer valid.',
          loginPath: `/auth/login?next=${encodeURIComponent(SHIPPING_ONLY_RESUME_PATH)}`,
        },
        { status: 401 },
      );
    }

    const pidShippingOnly = `SL${Date.now()}${randomGenerator(4)}`;

    await prisma.shipping_only.create({
      data: {
        pidShippingOnly,
        pidUser: user.pidUser,
        whatsappNumber,
        shippingName,
        shippingTo,
        grossWeight,
        trackingNumber,
        shippingPlan,
        expectedShipments,
        description: notes,
        wantProductVerification: Boolean(body.request.wantProductVerification),
        wantConsolidation: Boolean(body.request.wantConsolidation),
        multipleSuppliers: Boolean(body.request.multipleSuppliers),
        status: 'request-received',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    try {
      await notifyNewShippingOnlyRequest({
        pidShippingOnly,
        customerName:
          `${user.userFirstname || ''} ${user.userLastname || ''}`.trim() ||
          shippingName ||
          'Customer',
        customerEmail: user.userEmail || '',
        whatsappNumber,
        shippingName,
        shippingTo,
        shippingPlan,
        grossWeight,
        trackingNumber,
        expectedShipments,
        description: notes,
      });
    } catch (emailError) {
      console.error('shipping-only bootstrap email notification failed:', emailError);
    }

    // Non-blocking CAPI lead event for shipping-only submissions.
    try {
      const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
      const accessToken = process.env.FACEBOOK_CAPI_ACCESS_TOKEN;
      if (pixelId && accessToken && body.fbEventId) {
        await sendFacebookLeadCapiEvent({
          pixelId,
          accessToken,
          eventId: body.fbEventId,
          eventSourceUrl: body.pageUrl || null,
          testEventCode: process.env.FACEBOOK_TEST_EVENT_CODE || null,
          userData: {
            email: body?.account?.email || user.userEmail || null,
            phone:
              body?.request?.whatsappNumber ||
              body?.account?.phone ||
              user.userPhone ||
              null,
            clientIpAddress: getIpAddress(request),
            clientUserAgent: request.headers.get('user-agent'),
            fbp: body.fbp || null,
            fbc: body.fbc || null,
          },
          customData: {
            content_name: 'Shipping Only Submission',
            content_category: 'Shipping Only',
            value: 1,
            currency: 'NGN',
          },
        });
      }
    } catch (capiError) {
      console.error('shipping-only bootstrap Facebook CAPI failed:', capiError);
    }

    return NextResponse.json(
      {
        statusx: 'SUCCESS',
        message: 'Shipping request created successfully.',
        redirectTo: `/dashboard/shipping-only/request-received?request=${encodeURIComponent(pidShippingOnly)}`,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('shipping-only bootstrap error:', error);
    return NextResponse.json(
      { statusx: 'FAILED', message: 'Unable to create request at this time.' },
      { status: 500 },
    );
  }
}
