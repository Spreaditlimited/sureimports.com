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

  //GET FORM DATA
  const { password, confirmPassword, pidUser, resetCode } = body;

  // Validate same password
  if (password != confirmPassword) {
    /////////////// RETURN RESPONSE ///////////////
    const responsex = {
      message: 'Passwords must be the same',
      status: 'PASSWORD_NOT_SAME',
    };
    return NextResponse.json(
      { responsex, successx: true, userx: null },
      { status: 401 },
    );
  }

  // Validate password complexity
  // if (!validatePassword(password)) {
  //   let msg =
  //     'Password must have a minimum of eight characters, at least one uppercase letter, one lowercase letter, one number and one special character';
  //   /////////////// RETURN RESPONSE ///////////////
  //   const responsex = {
  //     message: msg,
  //     status: 'PASSWORD_NOT_COMPLEX',
  //   };
  //   return NextResponse.json(
  //     { responsex, successx: true, userx: null },
  //     { status: 401 },
  //   );
  // }

  //CHECK IF USER PID AND CID EXISTS
  const user = await prisma.users.findUnique({
    where: {
      pidUser: pidUser,
      cidStatus: resetCode,
    },
  });

  if (!user) {
    /////////////// RETURN RESPONSE ///////////////
    const responsex = {
      message:
        'This Password Reset Link is invalid, please request for another link.',
      status: 'INVALID_RESET',
    };
    return NextResponse.json(
      { responsex, successx: true, userx: null },
      { status: 401 },
    );
  }

  // Hash the password & session
  const passwordHash = bcrypt.hashSync(password, 8);
  // Get user email
  const userEmail = user.userEmail;

  //UPDATE RESET CODE
  if (user) {
    console.log('User exists.');
    //UPDATE THE CID TO VALIDATE USER
    const updatex = await prisma.users.update({
      where: { pidUser: pidUser },
      data: {
        userPassword: passwordHash,
        loginStatus: 'RESET',
        userCid: 'VERIFIED',
      },
    });

    if (updatex) {
      ////////////////////// SEND REGISTRATION EMAIL BLOCK STARTS //////////////////////
      //import { xMail } from '@/lib/email/xMail';
      const xEmail = userEmail as string;
      const xTitle = `Password Reset Successful!`;
      const xBodyTitle = `Password Reset Successful!`;
      const xBody1 = `The Password has been successfuly reset.`;
      const xBody2 = `You can now login with the new password.`;
      const xButtonTitle = `Login`;
      const xButtonLink = process.env.ROOT_URL + `/auth/login`;
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
        message: 'Password has been successfully reset!',
        status: 'PASSWORD_RESET_SUCCESSFUL',
      };
      return NextResponse.json(
        { responsex, successx: true, userx: null },
        { status: 401 },
      );
    }
  }

  //END
}
