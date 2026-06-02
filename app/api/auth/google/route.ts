import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import randomGenerator from '@/lib/helpers/randomGenerator';
import { generateToken } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

type GoogleTokenInfo = {
  aud?: string;
  email?: string;
  email_verified?: boolean | string;
  given_name?: string;
  family_name?: string;
  name?: string;
  picture?: string;
};

function isEmailVerified(value: GoogleTokenInfo['email_verified']): boolean {
  return value === true || value === 'true';
}

function buildNameParts(payload: GoogleTokenInfo) {
  if (payload.given_name || payload.family_name) {
    return {
      firstName: payload.given_name || '',
      lastName: payload.family_name || '',
    };
  }

  const [firstName = '', ...rest] = (payload.name || '').trim().split(' ');
  return {
    firstName,
    lastName: rest.join(' '),
  };
}

export async function POST(request: Request) {
  const { credential } = (await request.json()) as { credential?: string };
  const googleClientId =
    process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    return NextResponse.json(
      {
        statusx: 'FAILED',
        message: 'Google sign-in is not configured.',
      },
      { status: 500 },
    );
  }

  if (!credential) {
    return NextResponse.json(
      {
        statusx: 'FAILED',
        message: 'Google sign-in token is missing.',
      },
      { status: 400 },
    );
  }

  try {
    const verifyResponse = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(
        credential,
      )}`,
      { cache: 'no-store' },
    );

    if (!verifyResponse.ok) {
      return NextResponse.json(
        {
          statusx: 'FAILED',
          message: 'Google sign-in could not be verified.',
        },
        { status: 401 },
      );
    }

    const payload = (await verifyResponse.json()) as GoogleTokenInfo;

    if (
      payload.aud !== googleClientId ||
      !payload.email ||
      !isEmailVerified(payload.email_verified)
    ) {
      return NextResponse.json(
        {
          statusx: 'FAILED',
          message: 'Google sign-in could not be verified.',
        },
        { status: 401 },
      );
    }

    const email = payload.email.toLowerCase();
    const names = buildNameParts(payload);
    const existingUser = await prisma.users.findUnique({
      where: { userEmail: email },
    });

    const user =
      existingUser ||
      (await prisma.users.create({
        data: {
          pidUser: `CUS${randomGenerator(10)}`,
          userFirstname: names.firstName,
          userLastname: names.lastName,
          userEmail: email,
          userPassword: bcrypt.hashSync(randomGenerator(30), 8),
          userSession: bcrypt.hashSync(randomGenerator(10), 8),
          userCid: 'VERIFIED',
          loginStatus: 'GOOGLE_AUTH',
          userStatus: 'AL1',
          userAffiliateCode: randomGenerator(6),
          userImage: payload.picture || null,
        },
      }));

    const verifiedUser =
      existingUser &&
      (existingUser.userCid !== 'VERIFIED' ||
        (!existingUser.userImage && payload.picture))
        ? await prisma.users.update({
            where: { pidUser: existingUser.pidUser },
            data: {
              userCid: 'VERIFIED',
              userImage: existingUser.userImage || payload.picture || null,
            },
          })
        : user;

    const token = generateToken({
      pidUser: verifiedUser.pidUser,
      userEmail: verifiedUser.userEmail,
      userFirstname: verifiedUser.userFirstname,
      userImage: verifiedUser.userImage,
    });

    const response = NextResponse.json({
      user: {
        pidUser: verifiedUser.pidUser,
        userEmail: verifiedUser.userEmail,
        userFirstname: verifiedUser.userFirstname,
        userLastname: verifiedUser.userLastname,
        userPhone: verifiedUser.userPhone,
        phone: verifiedUser.phone,
        userImage: verifiedUser.userImage,
      },
      statusx: 'SUCCESS',
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (error) {
    console.error('Google sign-in error:', error);
    return NextResponse.json(
      {
        statusx: 'FAILED',
        message: 'Google sign-in failed. Please try again.',
      },
      { status: 500 },
    );
  }
}
