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
  if (!validateEmail(userEmail)) {
    return Response.json(
      {
        error: 'Please provide a valid email',
      },
      { status: 400 },
    );
  }

  const sessioncode = randomGenerator(10);

  // Hash the password & session
  const cid = randomGenerator(6);

  //CHECK IF USER PID AND CID EXISTS
  const user = await prisma.users.findUnique({
    where: {
      userEmail: userEmail,
    },
  });

  //get user details
  const cidx = user?.userCid;
  const pidUser = user?.pidUser;

  //user is alreaday verified, return to login
  if (cidx === 'VERIFIED') {
    /////////////// RETURN RESPONSE ///////////////
    const responsex = {
      message:
        'Your Email has already been verified, you may proceed to login.',
      status: 'ALREADY_VERIFIED',
    };
    return NextResponse.json(
      { responsex, successx: true, userx: null },
      { status: 401 },
    );
  } else {
    if (user) {
      console.log('User exists but not verified.');
      //UPDATE THE CID TO VALIDATE USER
      const updatex = await prisma.users.update({
        where: { userEmail: userEmail },
        data: { userCid: cid },
      });

      if (updatex) {
        ////////////////////// SEND REGISTRATION EMAIL BLOCK STARTS //////////////////////
        //import { xMail } from '@/lib/email/xMail';
        const xEmail = userEmail as string;
        const xTitle = `Email Re-Validation Link`;
        const xBodyTitle = `Validate your Email`;
        const xBody1 = `A new email verification link is sent below.`;
        const xBody2 = `Please follow the button verification link below to confirm your registration.`;
        const xButtonTitle = `Validate Email`;
        const xButtonLink =
          process.env.ROOT_URL +
          `/api/auth/email-verification?pidUser=${pidUser}&cid=${cid}`;
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
            'An Email Re-validation Link has been sent to your registered email.',
          status: 'VERIFICATION_EMAIL_SENT',
        };
        return NextResponse.json(
          { responsex, successx: true, userx: null },
          { status: 401 },
        );
      }
    }
  }

  // return something
  return Response.json({ messge: 'success' });
}
