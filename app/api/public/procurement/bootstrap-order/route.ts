import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import randomGenerator from '@/lib/helpers/randomGenerator';
import { generateToken, verifyToken } from '@/lib/jwt';
import { resolvePublicAccount } from '@/lib/auth/resolvePublicAccount';
import { sendFacebookLeadCapiEvent } from '@/lib/facebookCapi';

type ProductInput = {
  productName: string;
  productLink: string;
  productPrice: number;
  productWeight: number;
  productQuantity: number;
  productInfo?: string;
};

type Payload = {
  account?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  order: {
    orderName: string;
    destinationCountry: string;
    currencyType: string;
    shippingPlan: string;
    orderCategory: string;
    shippingAddress: string;
  };
  products: ProductInput[];
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
    const products = Array.isArray(body?.products) ? body.products : [];

    if (!body?.order) {
      return NextResponse.json(
        { statusx: 'FAILED_VALIDATION', message: 'Missing order payload.' },
        { status: 400 },
      );
    }

    if (products.length === 0) {
      return NextResponse.json(
        { statusx: 'FAILED_VALIDATION', message: 'Add at least one product.' },
        { status: 400 },
      );
    }

    const pidOrder = `DR${Date.now()}`;
    const orderName = normalize(body.order.orderName);
    const destinationCountry = normalize(body.order.destinationCountry);
    const currencyType = normalize(body.order.currencyType);
    const shippingPlan = normalize(body.order.shippingPlan);
    const orderCategory = normalize(body.order.orderCategory);
    const shippingAddress = normalize(body.order.shippingAddress);

    if (
      !orderName ||
      !destinationCountry ||
      !currencyType ||
      !shippingPlan ||
      !orderCategory ||
      !shippingAddress
    ) {
      return NextResponse.json(
        { statusx: 'FAILED_VALIDATION', message: 'Please complete all order fields.' },
        { status: 400 },
      );
    }

    const invalidProduct = products.find(
      (item) =>
        !normalize(item.productName) ||
        !normalize(item.productLink) ||
        Number.isNaN(Number(item.productPrice)) ||
        Number(item.productPrice) < 0.01 ||
        Number.isNaN(Number(item.productWeight)) ||
        Number(item.productWeight) <= 0 ||
        Number.isNaN(Number(item.productQuantity)) ||
        Number(item.productQuantity) < 1 ||
        !normalize(item.productInfo),
    );

    if (invalidProduct) {
      return NextResponse.json(
        {
          statusx: 'FAILED_VALIDATION',
          message:
            'Each product requires name, link, info, and valid price/weight/quantity values.',
        },
        { status: 400 },
      );
    }

    const token = request.cookies.get('token')?.value;
    let authenticatedPidUser: string | null = null;

    if (token) {
      const payload = verifyToken(token);
      if (payload && typeof payload === 'object' && 'pidUser' in payload) {
        authenticatedPidUser = String(payload.pidUser);
      }
    }

    const email = normalize(body?.account?.email).toLowerCase();
    if (!authenticatedPidUser && !email) {
      return NextResponse.json(
        {
          statusx: 'FAILED_VALIDATION',
          message: 'Email is required to continue to payment.',
        },
        { status: 400 },
      );
    }

    const account = await resolvePublicAccount({
      authenticatedPidUser,
      email,
      firstName: normalize(body?.account?.firstName),
      lastName: normalize(body?.account?.lastName),
      phone: normalize(body?.account?.phone),
      affiliateRef: 'NO_REF',
    });
    if (account.status === 'login_required') {
      return NextResponse.json(
        {
          statusx: 'ACCOUNT_EXISTS_LOGIN_REQUIRED',
          message:
            'An account with this email already exists. Please sign in to continue.',
          loginPath: `/auth/login?next=${encodeURIComponent('/buy-from-chinese-websites?resumeCheckout=1')}`,
        },
        { status: 409 },
      );
    }
    const { user, createdNewAccount } = account;

    await prisma.orders.create({
      data: {
        pidOrder,
        pidUser: user.pidUser,
        orderName,
        destinationCountry,
        currencyType,
        shippingPlan,
        orderCategory,
        shippingAddress,
        status: 'saved',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    await prisma.products.createMany({
      data: products.map((item) => ({
        pidProduct: `PRD${Date.now()}${randomGenerator(5)}`,
        pidOrder,
        pidUser: user!.pidUser,
        productName: normalize(item.productName),
        productLink: normalize(item.productLink),
        productPrice: Number(item.productPrice),
        productWeight: Number(item.productWeight),
        productQuantity: Number(item.productQuantity),
        productInfo: normalize(item.productInfo),
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    });

    // Non-blocking CAPI lead event for public procurement submissions.
    try {
      const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
      const accessToken = process.env.FACEBOOK_CAPI_ACCESS_TOKEN;
      if (pixelId && accessToken && body.fbEventId) {
        const estimatedValue = products.reduce(
          (sum, item) => sum + Number(item.productPrice) * Number(item.productQuantity),
          0,
        );
        await sendFacebookLeadCapiEvent({
          pixelId,
          accessToken,
          eventId: body.fbEventId,
          eventSourceUrl: body.pageUrl || null,
          testEventCode: process.env.FACEBOOK_TEST_EVENT_CODE || null,
          userData: {
            email: body?.account?.email || user.userEmail || null,
            phone: body?.account?.phone || user.userPhone || null,
            clientIpAddress: getIpAddress(request),
            clientUserAgent: request.headers.get('user-agent'),
            fbp: body.fbp || null,
            fbc: body.fbc || null,
          },
          customData: {
            content_name: 'Buy From Chinese Websites Submission',
            content_category: 'Procurement',
            num_items: products.length,
            value: Number.isFinite(estimatedValue) ? estimatedValue : 0,
            currency: currencyType || 'USD',
          },
        });
      }
    } catch (capiError) {
      console.error('procurement bootstrap Facebook CAPI failed:', capiError);
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
        message: 'Order created successfully.',
        redirectTo: `/dashboard/procurement/view-order/${pidOrder}?statusx=saved`,
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
    console.error('bootstrap-order error:', error);
    return NextResponse.json(
      { statusx: 'FAILED', message: 'Unable to create order at this time.' },
      { status: 500 },
    );
  }
}
