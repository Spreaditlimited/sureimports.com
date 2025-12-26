import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import randomGenerator from '@/lib/helpers/randomGenerator';
import xMail from '@/lib/email/xMail';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // Get form data
    const formData = await request.formData();
    const pidUser = formData.get('pidUser') as string;
    const email = formData.get('email') as string;

    // Validate inputs
    if (!pidUser || !email) {
      return NextResponse.json(
        {
          responsex: {
            message: 'User ID and email are required',
            status: 'MISSING_PARAMETERS',
          },
          successx: false,
        },
        { status: 400 },
      );
    }

    // Check if user exists
    const user = await prisma.users.findUnique({
      where: {
        pidUser: pidUser,
        userEmail: email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          responsex: {
            message: 'User not found. Please re-login and try again.',
            status: 'USER_NOT_FOUND',
          },
          successx: false,
        },
        { status: 404 },
      );
    }

    // Generate 6-digit verification code
    const verificationCode = randomGenerator(6);

    // Store verification code in userExt2 field with timestamp
    const codeData = JSON.stringify({
      code: verificationCode,
      timestamp: new Date().toISOString(),
      purpose: 'bank_details_update',
    });

    await prisma.users.update({
      where: { pidUser: pidUser },
      data: {
        userExt2: codeData,
        updatedAt: new Date(),
      },
    });

    // Send verification code via email
    try {
      const xEmail = email;
      const xTitle = 'Bank Details Update - Verification Code';
      const xBodyTitle = 'Bank Details Update Verification';
      const xBody1 = `You have requested to update your bank details. Please use the verification code below to complete this action.`;
      const xBody2 = `Your verification code is: <strong style="font-size: 24px; color: #2563eb;">${verificationCode}</strong><br/><br/>This code will expire in 10 minutes. If you did not request this change, please contact support immediately.`;
      const xButtonTitle = 'Go to Dashboard';
      const xButtonLink = process.env.ROOT_URL + '/dashboard';

      console.log('Attempting to send verification email to:', xEmail);
      console.log('Verification code:', verificationCode);

      await xMail({
        xEmail,
        xTitle,
        xBodyTitle,
        xBody1,
        xBody2,
        xButtonTitle,
        xButtonLink,
      });

      console.log('Verification email sent successfully to:', xEmail);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail the request if email fails - code is already stored in DB
      console.warn('Email failed but verification code is stored in database');
    }

    // Return success response
    return NextResponse.json(
      {
        responsex: {
          message: 'Verification code has been sent to your email.',
          status: 'CODE_SENT',
        },
        successx: true,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error('Error in send-code endpoint:', error);
    return NextResponse.json(
      {
        responsex: {
          message: 'An error occurred. Please try again.',
          status: 'SERVER_ERROR',
        },
        successx: false,
      },
      { status: 500 },
    );
  }
}
