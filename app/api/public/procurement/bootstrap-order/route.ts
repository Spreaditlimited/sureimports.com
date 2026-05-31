import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import randomGenerator from '@/lib/helpers/randomGenerator';
import { generateToken, verifyToken } from '@/lib/jwt';

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
};

function normalize(value: string | undefined): string {
  return (value || '').trim();
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
            message: 'Email is required to continue to payment.',
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
            loginPath: `/auth/login?next=${encodeURIComponent('/dashboard/procurement/create-order')}`,
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
