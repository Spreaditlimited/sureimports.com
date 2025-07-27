'use server';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import validateEmail from '@/lib/helpers/validateEmail';
import validatePassword from '@/lib/helpers/validatePassword';
import bcrypt from 'bcryptjs';
import randomGenerator from '@/lib/helpers/randomGenerator';
import validateInput from '@/lib/helpers/validateInput';
import xMail2 from '@/lib/email/xMail2';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import isValidPhoneNumber from '@/lib/helpers/validatePhoneNumber';
import xMail from '@/lib/email/xMail';

export async function POST(request: NextRequest) {
  ///////////// SIGNUP FORM VERIFICATION STARTS /////////////
  const {
    userFirstname,
    userLastname,
    userEmail,
    userPhone,
    userPassword,
    confirmPassword,
    userAffiliateRef,
  } = await request.json();

  const sessioncode = randomGenerator(10);

  // Hash the password & session
  const passwordHash = bcrypt.hashSync(userPassword, 8);
  const sessionHash = bcrypt.hashSync(sessioncode, 8);
  // const cid = randomGenerator(6);
  // const pidUser = 'CUS' + randomGenerator(10);

  //////////////////////// FORM INPUT VALIDATION ////////////////////////
  // validate firstname
  if (
    userFirstname === undefined ||
    userFirstname === 'undefined' ||
    userFirstname === '' ||
    userFirstname === null
  ) {
    return NextResponse.json(
      { statusx: 'FAILED_VALIDATION', message: 'Firstname cannot be empty' },
      { status: 200 },
    );
  }

  // validate lastname
  if (
    userLastname === undefined ||
    userLastname === 'undefined' ||
    userLastname === '' ||
    userLastname === null
  ) {
    return NextResponse.json(
      { statusx: 'FAILED_VALIDATION', message: 'Lastname cannot be empty' },
      { status: 200 },
    );
  }

  // Validate email
  const validation = validateEmail(userEmail);
  if (!validation.isValid) {
    return NextResponse.json(
      { statusx: 'FAILED_VALIDATION', message: 'Please provide a valid email' },
      { status: 200 },
    );
  }

  // Validate user
  const existingUser = await prisma.users.count({
    where: { userEmail: userEmail },
  });

  if (existingUser >= 1) {
    return NextResponse.json(
      {
        statusx: 'FAILED_VALIDATION',
        message: 'User already exists, you may login to continue shopping.',
      },
      { status: 200 },
    );
  }

  // Validate phone
  if (!isValidPhoneNumber(userPhone)) {
    return NextResponse.json(
      {
        statusx: 'FAILED_VALIDATION',
        message: 'Your Phone Number is not valid, only numbers are allowed.',
      },
      { status: 200 },
    );
  }

  // Validate password
  // if (!validatePassword(userPassword)) {
  //   return NextResponse.json(
  //     {
  //       statusx: 'FAILED_VALIDATION',
  //       message:
  //         'Password must have a minimum of eight characters, at least one uppercase letter, one lowercase letter, one number and one special character',
  //     },
  //     { status: 400 },
  //   );
  // }
  console.log('JESUS IS KING!!!');

  // validate password
  if (
    userPassword === undefined ||
    userPassword === 'undefined' ||
    userPassword === '' ||
    userPassword === null
  ) {
    return NextResponse.json(
      { statusx: 'FAILED_VALIDATION', message: 'Password cannot be empty' },
      { status: 200 },
    );
  }

  // Validate same password
  if (userPassword != confirmPassword) {
    return NextResponse.json(
      { statusx: 'FAILED_VALIDATION', message: 'Passwords must be the same' },
      { status: 200 },
    );
  }

  //special data
  const hashedPassword = await bcrypt.hash(userPassword, 10);
  const cid = randomGenerator(6);
  const pidUser = 'CUS' + randomGenerator(10);

  // Lookup the user in database
  const user = await prisma.users.findFirst({
    where: {
      userEmail: userEmail,
    },
  });

  //Check if user exists
  if (user) {
    //RETURN RESPONSE
    return NextResponse.json(
      {
        statusx: 'FAILED_VALIDATION',
        message: 'User already exists, you may login to continue.',
      },
      { status: 200 },
    );
  }

  // Validate same password
  if (userPassword != confirmPassword) {
    //RETURN RESPONSE
    return NextResponse.json(
      { statusx: 'FAILED_VALIDATION', message: 'Passwords must be the same' },
      { status: 200 },
    );
  }

  // Create a user in db
  const create = await prisma.users.create({
    data: {
      pidUser: pidUser,
      userFirstname: userFirstname,
      userLastname: userLastname,
      userEmail: userEmail,
      userPassword: passwordHash,
      userSession: sessionHash,
      userPhone: userPhone,
      userCid: cid,
      loginStatus: 'RESET',
      userStatus: 'AL1',
      userAffiliateCode: randomGenerator(6),
      userAffiliateRef: userAffiliateRef,
    },
  });

  //send mail
  try {
    ////////////////////// SEND REGISTRATION EMAIL BLOCK STARTS //////////////////////
    //import { xMail } from '@/lib/email/xMail';
    // const xEmail = userEmail as string;
    // const xTitle = `Registration Successful!`;
    // const xBodyTitle = `Registration Successful!`;
    // const xBody1 = `Thank you for registering with <b>Printin Reality,</b> your one stop professional printing and packaging brand, where you get <i>Quality, Speed and Affordability</i>.`;
    // const xBody2 = `Please follow the button verification link below to confirm your registration.`;
    // const xButtonTitle = `Validate Email`;
    // const xButtonLink = `https://printin.ng/api/verification?pidUser=${pidUser}&cid=${cid}`;
    // await xMail({xEmail, xTitle, xBodyTitle, xBody1, xBody2, xButtonTitle, xButtonLink});
    ////////////////////// SEND REGISTRATION EMAIL BLOCK STARTS //////////////////////

    ////////////////////// SEND REGISTRATION EMAIL BLOCK STARTS //////////////////////
    //import { xMail } from '@/lib/email/xMail';
    const xEmail = userEmail as string;
    const xTitle = `Registration Successful!`;
    const xBodyTitle = `Registration Successful!`;
    const xButtonTitle = `Validate Email`;
    const xButtonLink =
      process.env.ROOT_URL +
      `/api/auth/email-verification-store?pidUser=${pidUser}&cid=${cid}`;

    const xBody1 =
      `Hello ` +
      userFirstname +
      `,<br /><br />` +
      `I thank you for taking this step to simplify buying products from China for yourself, and perhaps, others.<br /><br />

To gain access to your own dashboard where you can see all you can accomplish using our website, click the Validate Email button below to complete registration.



<br /><br />

<a href="` +
      xButtonLink +
      `" style="background-color: #007bff; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px;">` +
      xButtonTitle +
      `</a>

<br /><br />


You can also copy the following link and paste in your browser if you were unable to click the above button.


<br /><br />


Link: <div>` +
      xButtonLink +
      `</div>
<br />


See you inside.<br /><br />
 
<b>Tochukwu Nkwocha</b><br />
<i>CEO, Spreadit Limited</i>
`;

    await xMail({
      xEmail,
      xTitle,
      xBodyTitle,
      xBody1,
      //xBody2,
      xButtonTitle,
      xButtonLink,
    });
    ////////////////////// SEND REGISTRATION EMAIL BLOCK STARTS //////////////////////

    console.log('Email was Successfully sent!');
  } catch (error) {
    console.error('Failed to send email:', error);
  }

  // Redirect to login if success
  if (create) {
    return NextResponse.json(
      { statusx: 'SUCCESS', message: 'Account was successfully created!' },
      { status: 200 },
    );
    //redirect("/success/registration");
  } else {
    //RETURN RESPONSE
    return NextResponse.json(
      {
        statusx: 'FAILED',
        message: 'Invalid Login Details, you may contact admin',
      },
      { status: 200 },
    );
  }
}
