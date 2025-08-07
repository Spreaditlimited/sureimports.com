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
import { secureInput } from '@/utils/secureInput';

export async function POST(request: NextRequest) {
  ///////////// SIGNUP FORM VERIFICATION STARTS /////////////
  const {
    userFirstname,
    userLastname,
    email,
    phone,
    password,
    confirmPassword,
    userAffiliateRef,
  } = await request.json();

  // Clean affiliate code
  const userAffiliateRefx = secureInput(userAffiliateRef);
  if (!userAffiliateRefx) {
    //GET RESPONSE MESSAGE FOR THE FORM FEEDBACK
    const messagex = {
      message1: 'Invalid Data Processed',
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

  const sessioncode = randomGenerator(10);

  // Hash the password & session
  const passwordHash = bcrypt.hashSync(password, 8);
  const sessionHash = bcrypt.hashSync(sessioncode, 8);
  const cid = randomGenerator(6);
  const pidUser = 'CUS' + randomGenerator(10);

  //////////////////////// FORM INPUT VALIDATION ////////////////////////
  // validate firstname
  if (
    userFirstname === undefined ||
    userFirstname === 'undefined' ||
    userFirstname === '' ||
    userFirstname === null
  ) {
    //GET RESPONSE MESSAGE FOR THE FORM FEEDBACK
    const messagex = {
      message1: 'Firstname cannot be empty',
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

  // validate firstname
  // if ( (firstname === undefined) || (firstname === "undefined") || (firstname === "") || (firstname === null) ) {
  //             //GET RESPONSE MESSAGE FOR THE FORM FEEDBACK
  //             const messagex = {message1:"Firstname cannot be empty", message2:"SUCCESS", message3:200};
  //             const statusx = "SUCCESS";
  //             //RETURN RESPONSE
  //             return NextResponse.json({ messagex, statusx, success:false, userx: null }, { status: 200 });
  // }

  // validate lastname
  // if ( (lastname === undefined) || (lastname === "undefined") || (lastname === "") || (lastname === null) ) {
  //             //GET RESPONSE MESSAGE FOR THE FORM FEEDBACK
  //             const messagex = {message1:"Lastname cannot be empty", message2:"SUCCESS", message3:200};
  //             const statusx = "SUCCESS";
  //             //RETURN RESPONSE
  //             return NextResponse.json({ messagex, statusx, success:false, userx: null }, { status: 200 });
  // }

  // Validate email
  if (!validateEmail(email)) {
    //GET RESPONSE MESSAGE FOR THE FORM FEEDBACK
    const messagex = {
      message1: 'Please provide a valid email',
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
  const user = await prisma.users.findFirst({
    where: {
      userEmail: email,
    },
  });

  //Check if user exists
  if (user) {
    //GET RESPONSE MESSAGE FOR THE FORM FEEDBACK
    const messagex = {
      message1: 'User already exists, you may login to continue.',
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

  // Validate phone
  // const phoneRegex = /^\d{11}$/;
  // if (!phoneRegex.test(userPhone)) {
  //       return "Phone Number must contain a minimum of 11 digits";
  // }

  // Validate password
  // if (!validatePassword(password)) {
  //   let msg =
  //     'Password must have a minimum of eight characters, at least one uppercase letter, one lowercase letter, one number and one special character';
  //   //GET RESPONSE MESSAGE FOR THE FORM FEEDBACK
  //   const messagex = { message1: msg, message2: 'SUCCESS', message3: 200 };
  //   const statusx = 'SUCCESS';
  //   //RETURN RESPONSE
  //   return NextResponse.json(
  //     { messagex, statusx, success: false, userx: null },
  //     { status: 200 },
  //   );
  // }

  // Validate same password
  if (password != confirmPassword) {
    //GET RESPONSE MESSAGE FOR THE FORM FEEDBACK
    const messagex = {
      message1: 'Passwords must be the same',
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

  // Create a user in db
  const create = await prisma.users.create({
    data: {
      pidUser: pidUser,
      userFirstname: userFirstname,
      userLastname: userLastname,
      userEmail: email,
      userPassword: passwordHash,
      userSession: sessionHash,
      userPhone: phone,
      userCid: cid,
      loginStatus: 'RESET',
      userStatus: 'AL1',
      userAffiliateCode: randomGenerator(6),
      userAffiliateRef: userAffiliateRefx,
    },
  });

  //send mail
  try {
    ////////////////////// SEND REGISTRATION EMAIL BLOCK STARTS //////////////////////
    //import { xMail } from '@/lib/email/xMail';
    const xEmail = email as string;
    const xTitle = `Registration Successful!`;
    const xBodyTitle = `Registration Successful!`;
    const xButtonTitle = `Validate Email`;
    const xButtonLink =
      process.env.ROOT_URL +
      `/api/auth/email-verification?pidUser=${pidUser}&cid=${cid}`;

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

    await xMail2({
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
      { messagex: null, statusx: null, successx: true, userx: null },
      { status: 200 },
    );
    //redirect("/success/registration");
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
}
