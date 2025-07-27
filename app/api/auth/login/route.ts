import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/jwt';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { userEmail, userPassword } = await request.json();

  /////////////////////////// START
  // Lookup the user in database
  // try {
  //   const user = await prisma.users.findFirst({
  //     where: {
  //       userEmail: userEmail,
  //     },
  //   });
  // } catch (error) {
  //   if (error instanceof Error) {
  //     console.log('ERROR_MESSAGE:' + error.stack);
  //   } else {
  //     console.log(error);
  //   }
  // }

  //-----------------------USER_DOES_NOT_EXIST
  //Check if user exists in the database
  const user = await prisma.users.findFirst({
    where: {
      userEmail: userEmail,
    },
  });

  if (!user) {
    //>>>>>>>>>>>>>>>>>>>>>> RESPONSE
    return NextResponse.json(
      {
        statusx: 'USER_DOES_NOT_EXIST',
        message: 'No such user exists on our database',
      },
      { status: 200 },
    );
  }

  //-----------------------RESET
  // Check if this is a new but returning user
  const userWelcomReset = await prisma.users.findFirst({
    where: {
      userEmail: userEmail,
      loginStatus: 'RESET',
    },
  });

  if (!userWelcomReset) {
    //>>>>>>>>>>>>>>>>>>>>>> RESPONSE
    return NextResponse.json(
      {
        statusx: 'RESET',
        message:
          'You have to reset your password as a first time login into the new app.',
      },
      { status: 200 },
    );
  }

  //-----------------------NOT_VERIFIED
  //Check if users email has been verified
  const userVerification = await prisma.users.findFirst({
    where: {
      userEmail: userEmail,
      userCid: 'VERIFIED',
    },
  });

  if (!userVerification) {
    //>>>>>>>>>>>>>>>>>>>>>> RESPONSE
    return NextResponse.json(
      {
        statusx: 'NOT_VERIFIED',
        message:
          'Your email has not yet been verified, please login to your email box to verify your account from the Successful Registration Email.',
      },
      { status: 200 },
    );
  }

  //-----------------------SUCCESS
  // Authenticate user via email and password
  try {
    //email check
    const user = await prisma.users.findUnique({ where: { userEmail } });
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 400 },
      );
    }

    //password check
    const isPasswordValid = await bcrypt.compare(
      userPassword,
      user.userPassword as string,
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 400 },
      );
    }

    //generate token with user data payload
    const token = generateToken({
      pidUser: user.pidUser,
      userEmail: user.userEmail,
      userFirstname: user.userFirstname,
      userImage: user.userImage,
    });

    const response = NextResponse.json({
      user: {
        pidUser: user.pidUser,
        userEmail: user.userEmail,
        userFirstname: user.userFirstname,
        userImage: user.userImage,
      },
      statusx: 'SUCCESS',
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    //console.log('----------------------x----------------------'+response);return;
    return response;
  } catch (error) {
    console.error('Login error:', error);
    //>>>>>>>>>>>>>>>>>>>>>> RESPONSE
    return NextResponse.json(
      { statusx: 'FAILED', message: error },
      { status: 200 },
    );
    // return NextResponse.json(
    //   { message: 'Internal server error' },
    //   { status: 500 },
    // );
  }
}
