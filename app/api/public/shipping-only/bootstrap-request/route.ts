import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import randomGenerator from '@/lib/helpers/randomGenerator';
import { generateToken, verifyToken } from '@/lib/jwt';
import { notifyNewShippingOnlyRequest } from '@/lib/notifications/shippingOnly';
import { sendFacebookLeadCapiEvent } from '@/lib/facebookCapi';

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
    let activeUser = null as Awaited<ReturnType<typeof prisma.users.findUnique>>;

    if (token) {
      const payload = verifyToken(token);
      if (payload && typeof payload === 'object' && 'pidUser' in payload) {
        activeUser = await prisma.users.findUnique({
          where: { pidUser: String(payload.pidUser) },
        });
      }
    }

    let user = activeUser;
    let createdNewAccount = false;

    if (!user) {
      const firstName = normalize(body?.account?.firstName);
      const lastName = normalize(body?.account?.lastName);
      const email = normalize(body?.account?.email).toLowerCase();
      const phone = normalize(body?.account?.phone);

      if (!email) {
        return NextResponse.json(
          {
            statusx: 'FAILED_VALIDATION',
            message: 'Email is required to continue.',
          },
          { status: 400 },
        );
      }

      const existingUser = await prisma.users.findFirst({
        where: { userEmail: email },
      });

      if (existingUser) {
        return NextResponse.json(
          {
            statusx: 'ACCOUNT_EXISTS_LOGIN_REQUIRED',
            message:
              'An account with this email already exists. Please sign in to continue.',
            loginPath: `/auth/login?next=${encodeURIComponent('/ship-with-us?resumeCheckout=1')}`,
          },
          { status: 409 },
        );
      }

      const tempPassword = randomGenerator(12);
      const passwordHash = bcrypt.hashSync(tempPassword, 8);
      const sessionHash = bcrypt.hashSync(randomGenerator(10), 8);
      const pidUser = `CUS${randomGenerator(10)}`;

      user = await prisma.users.create({
        data: {
          pidUser,
          userFirstname: firstName || 'Customer',
          userLastname: lastName || '',
          userEmail: email,
          userPassword: passwordHash,
          userSession: sessionHash,
          userPhone: phone || '',
          userCid: 'VERIFIED',
          loginStatus: 'ACTIVE',
          userStatus: 'AL1',
          userAffiliateCode: randomGenerator(6),
          userAffiliateRef: 'NO_REF',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      createdNewAccount = true;
    }

    if (!user) {
      return NextResponse.json(
        { statusx: 'FAILED', message: 'Unable to initialize account.' },
        { status: 500 },
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

    const authToken = generateToken({
      pidUser: user.pidUser,
      userEmail: user.userEmail,
      userFirstname: user.userFirstname,
      userImage: user.userImage,
    });

    const response = NextResponse.json(
      {
        statusx: 'SUCCESS',
        message: 'Shipping request created successfully.',
        redirectTo: '/dashboard/shipping-only',
        createdNewAccount,
      },
      { status: 200 },
    );

    response.cookies.set('token', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('shipping-only bootstrap error:', error);
    return NextResponse.json(
      { statusx: 'FAILED', message: 'Unable to create request at this time.' },
      { status: 500 },
    );
  }
}
