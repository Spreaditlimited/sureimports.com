import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import validateEmail from '@/lib/helpers/validateEmail';
import validatePassword from '@/lib/helpers/validatePassword';
import bcrypt from 'bcryptjs';
import { signToken } from '@/app/utils/jwt';
import { redirect } from 'next/navigation';

export async function POST(request: NextRequest) {
  ///////////// LOGIN FORM VERIFICATION STARTS /////////////
  const { email, password, keepMeSignedIn } = await request.json();

  //SET EXPIRY TIME FOR TOKEN
  const expiry_time1: number = 3600 * 24 * 7; // 1 day
  const expiry_time2: number = 3600 * 24 * 7; // 7 days
  const expiry_timex: number = keepMeSignedIn ? expiry_time2 : expiry_time1;

  // Validate email
  if (!validateEmail(email)) {
    //GET RESPONSE MESSAGE FOR THE FORM FEEDBACK
    const messagex = {
      message1: 'Invalid email or password',
      message2: 'SUCCESS',
      message3: 200,
    };
    const statusx = 'SUCCESS';
    //RETURN RESPONSE
    return NextResponse.json(
      { messagex, statusx, success: false, userx: null },
      { status: 200 },
    );
  }

  // Lookup the user in database
  try {
    const user = await prisma.users.findFirst({
      where: {
        userEmail: email,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log('ERROR_MESSAGE:' + error.stack);
    } else {
      console.log(error);
    }
  }

  const user = await prisma.users.findFirst({
    where: {
      userEmail: email,
    },
  });

  //Check if user exists
  if (!user) {
    //GET RESPONSE MESSAGE FOR THE FORM FEEDBACK
    const messagex = {
      message1: 'No such user exists in our Database',
      message2: 'SUCCESS',
      message3: 200,
    };
    const statusx = 'SUCCESS';
    //RETURN RESPONSE
    return NextResponse.json(
      { messagex, statusx, success: false, userx: null },
      { status: 200 },
    );
  }

  // Check if this is a new but returning user
  const userWelcomReset = await prisma.users.findFirst({
    where: {
      userEmail: email,
      loginStatus: 'RESET',
    },
  });

  if (!userWelcomReset) {
    //GET RESPONSE MESSAGE FOR THE FORM FEEDBACK
    const messagex = {
      message1:
        'You have to reset your password as a first time login into the new app.',
      message2: 'RESET',
      message3: 200,
    };
    const statusx = 'RESET';
    //RETURN RESPONSE
    return NextResponse.json(
      { messagex, statusx, success: false, userx: null },
      { status: 200 },
    );
  }

  //Check if users email has been verified
  // Lookup the user in database
  const userVerification = await prisma.users.findFirst({
    where: {
      userEmail: email,
      userCid: 'VERIFIED',
    },
  });

  if (!userVerification) {
    //GET RESPONSE MESSAGE FOR THE FORM FEEDBACK
    const messagex = {
      message1:
        'Your email has not yet been verified, please login to your email box to verify your account from the Successful Registration Email.',
      message2: 'SUCCESS',
      message3: 200,
    };

    const statusx = 'NOT_VERIFIED';
    //RETURN RESPONSE
    return NextResponse.json(
      { messagex, statusx, success: false, userx: null },
      { status: 200 },
    );
  }

  // Validate password format
  // if (!validatePassword(password)) {
  //   //GET RESPONSE MESSAGE FOR THE FORM FEEDBACK
  //   const messagex = {
  //     message1: 'Invalid email or password',
  //     message2: 'SUCCESS',
  //     message3: 200,
  //   };
  //   const statusx = 'SUCCESS';
  //   //RETURN RESPONSE
  //   return NextResponse.json(
  //     { messagex, statusx, success: false, userx: null },
  //     { status: 200 },
  //   );
  // }

  // Compare password entered by user with user password in database
  const isCorrectPassword = bcrypt.compareSync(
    password,
    user.userPassword as string,
  );

  if (!isCorrectPassword) {
    //GET RESPONSE MESSAGE FOR THE FORM FEEDBACK
    const messagex = {
      message1: 'Invalid Login Details',
      message2: 'SUCCESS',
      message3: 200,
    };
    const statusx = 'SUCCESS';
    //RETURN RESPONSE
    return NextResponse.json(
      { messagex, statusx, success: false, userx: null },
      { status: 200 },
    );
  }

  /////////// CHECK IF PASSWORD LOGIN WAS SUCCESSFUL ////////////
  if (isCorrectPassword) {
    const userx = {
      pidUser: user.pidUser,
      email: user.userEmail,
      name: user.userFirstname,
      userImage: user.userImage,
      userStatus: user.userStatus,
    };
    const token = signToken(userx);
    const response = NextResponse.json(
      { messagex: null, statusx: null, successx: true, userx: userx },
      { status: 200 },
    );
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: expiry_timex, //expiry time
    });
    return response;
  } else {
    //GET RESPONSE MESSAGE FOR THE FORM FEEDBACK
    const messagex = {
      message1: 'Invalid Login Details, you may contact admin',
      message2: 'SUCCESS',
      message3: 200,
    };
    const statusx = 'SUCCESS';
    //RETURN RESPONSE
    return NextResponse.json(
      { messagex, statusx, success: false, userx: null },
      { status: 401 },
    );
  }

  //end
}
