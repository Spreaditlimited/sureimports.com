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
  const { email, service } = await request.json();

  // Clean affiliate code

  const cid = randomGenerator(6);
  const pidSubscription = 'SUB' + randomGenerator(10);

  //////////////////////// FORM INPUT VALIDATION ////////////////////////
  // validate firstname
  if (
    email === undefined ||
    email === 'undefined' ||
    email === '' ||
    email === null
  ) {
    //RETURN RESPONSE
    return NextResponse.json(
      {
        messagex: 'Email cannot be empty',
        statusx: 'FAILED',
        successx: true,
        userx: null,
      },
      { status: 200 },
    );
  }

  // Validate email
  if (!validateEmail(email)) {
    //RETURN RESPONSE
    return NextResponse.json(
      {
        messagex: 'Please provide a valid email',
        statusx: 'FAILED',
        successx: true,
        userx: null,
      },
      { status: 200 },
    );
  }

  // Lookup the user in database
  const user = await prisma.subscriptions.findFirst({
    where: {
      subEmail: email,
      subService: 'SUREIMPORTS',
    },
  });

  //Check if user exists
  if (user) {
    //RETURN RESPONSE
    return NextResponse.json(
      {
        messagex: 'You are already subscribed.',
        statusx: 'FAILED',
        successx: true,
        userx: null,
      },
      { status: 200 },
    );
  }

  // Create a user in db
  const create = await prisma.subscriptions.create({
    data: {
      pidSubscription: pidSubscription,
      subEmail: email,
      subService: service,
    },
  });

  //ADD USER TO FLODESK
  const response = await fetch('https://api.flodesk.com/v1/subscribers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(process.env.FLODESK_API_KEY + ':').toString('base64')}`,
      'User-Agent': 'Sure Imports (www.sureimports.com)',
    },
    body: JSON.stringify({
      email: email,
      first_name: email,
      last_name: '',
      segment_ids: ['67699403ee348d7f8cb68f3a'],
    }),
  });

  console.log('response', response);

  // if (!response.ok) {
  // throw new Error('Failed to add subscriber to Flodesk');
  // }

  //send mail
  try {
    ////////////////////// SEND REGISTRATION EMAIL BLOCK STARTS //////////////////////
    //import { xMail } from '@/lib/email/xMail';
    const xEmail = email as string;
    const xTitle = `Subscription Successful!`;
    const xBodyTitle = `Subscription Successful!`;
    const xButtonTitle = `Visit Sure Imports`;
    const xButtonLink = 'https://sureimports.com';
    //subscription message

    // Prepare the email body
    const xBody1 =
      `Hello ` +
      `,<br /><br />` +
      `Thank you for subscribing to our service. We are excited to have you on board!<br /><br />

<a href="` +
      xButtonLink +
      `" style="background-color: #007bff; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px;">` +
      xButtonTitle +
      `</a>

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
      {
        messagex: 'Thank you for subscribing! 🎉',
        statusx: 'SUCCESS',
        successx: true,
        userx: null,
      },
      { status: 200 },
    );

    //redirect("/success/registration");
  } else {
    //RETURN RESPONSE
    return NextResponse.json(
      {
        messagex: 'Action failed. you may contact admin',
        statusx: 'FAILED',
        successx: true,
        userx: null,
      },
      { status: 200 },
    );
  }
}
