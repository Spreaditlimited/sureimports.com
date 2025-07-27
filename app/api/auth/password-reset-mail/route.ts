import validateEmail from '@/lib/helpers/validateEmail';
import validatePassword from '@/lib/helpers/validatePassword';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import randomGenerator from '@/lib/helpers/randomGenerator';
import validateInput from '@/lib/helpers/validateInput';
import xMail from '@/lib/email/xMail';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

//PROCESS REGISTRATION FORM REQUEST
export async function POST(request: Request) {
  // Read form data off req body
  const body = await request.json();

  const { userEmail } = body;

  // Validate email
  // if (!validateEmail(userEmail)) {
  //   /////////////// RETURN RESPONSE ///////////////
  //   const responsex = {
  //     message: 'Please provide a vaild email.',
  //     status: 'INVALID_EMAIL',
  //   };
  //   return NextResponse.json(
  //     { responsex, successx: true, userx: null },
  //     { status: 401 },
  //   );
  // }

  // Create a Session Code
  const sessioncode = randomGenerator(10);

  // Create a Reset Code
  const resetCode = randomGenerator(6);

  //CHECK IF USER PID AND CID EXISTS
  const user = await prisma.users.findUnique({
    where: {
      userEmail: userEmail,
    },
  });

  if (!user) {
    /////////////// RETURN RESPONSE ///////////////
    const responsex = {
      message: 'No such user exists in our Database',
      status: 'NOT_REGISTERED',
    };
    return NextResponse.json(
      { responsex, successx: true, userx: null },
      { status: 401 },
    );
  }

  //get user details
  const registeredEmail = user?.userEmail;
  const pidUser = user?.pidUser;

  //UPDATE RESET CODE
  if (user) {
    console.log('User exists.');
    //UPDATE THE CID TO VALIDATE USER
    const updatex = await prisma.users.update({
      where: { userEmail: userEmail },
      data: { cidStatus: resetCode },
    });

    if (updatex) {
      ////////////////////// SEND REGISTRATION EMAIL BLOCK STARTS //////////////////////
      //import { xMail } from '@/lib/email/xMail';
      const xEmail = userEmail as string;
      const xTitle = `Password Reset`;
      const xBodyTitle = `Password Reset Link`;
      const xBody1 = `A Password Reset Link has been sent to you here.`;
      const xBody2 = `Please follow the Password Reset Link below to create a new password.`;
      const xButtonTitle = `Password Reset Link`;
      const xButtonLink =
        process.env.ROOT_URL +
        `/auth/password-reset-link?pidUser=${pidUser}&resetCode=${resetCode}`;
      await xMail({
        xEmail,
        xTitle,
        xBodyTitle,
        xBody1,
        xBody2,
        xButtonTitle,
        xButtonLink,
      });
      ////////////////////// SEND REGISTRATION EMAIL BLOCK STOPS  //////////////////////

      /////////////// RETURN RESPONSE ///////////////
      const responsex = {
        message:
          'An Email Password Reset Link has been sent to your registered email.',
        status: 'PASSWORD_RESET_LINK_SENT',
      };
      return NextResponse.json(
        { responsex, successx: true, userx: null },
        { status: 401 },
      );
    }
  }

  //END
}
