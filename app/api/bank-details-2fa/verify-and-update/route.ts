import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import xMail from '@/lib/email/xMail';

const prisma = new PrismaClient();

// Code expiration time in milliseconds (10 minutes)
const CODE_EXPIRATION_TIME = 10 * 60 * 1000;

export async function POST(request: Request) {
  try {
    // Get form data
    const formData = await request.formData();
    const pidUser = formData.get('pidUser') as string;
    const email = formData.get('email') as string;
    const verificationCode = formData.get('verificationCode') as string;
    const bank_name = formData.get('bank_name') as string;
    const bank_account_number = formData.get('bank_account_number') as string;
    const bank_account_name = formData.get('bank_account_name') as string;

    // Validate inputs
    if (!pidUser || !email || !verificationCode) {
      return NextResponse.json(
        {
          responsex: {
            message: 'All fields are required',
            status: 'MISSING_PARAMETERS',
          },
          successx: false,
        },
        { status: 400 }
      );
    }

    // Validate bank details
    if (!bank_name || !bank_account_number || !bank_account_name) {
      return NextResponse.json(
        {
          responsex: {
            message: 'Bank details cannot be empty',
            status: 'EMPTY_BANK_DETAILS',
          },
          successx: false,
        },
        { status: 400 }
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
        { status: 404 }
      );
    }

    // Check if verification code exists
    if (!user.userExt2) {
      return NextResponse.json(
        {
          responsex: {
            message: 'No verification code found. Please request a new code.',
            status: 'NO_CODE_FOUND',
          },
          successx: false,
        },
        { status: 400 }
      );
    }

    // Parse stored verification data
    let storedData;
    try {
      storedData = JSON.parse(user.userExt2);
    } catch (parseError) {
      return NextResponse.json(
        {
          responsex: {
            message: 'Invalid verification data. Please request a new code.',
            status: 'INVALID_CODE_DATA',
          },
          successx: false,
        },
        { status: 400 }
      );
    }

    // Verify the code matches
    if (storedData.code !== verificationCode) {
      return NextResponse.json(
        {
          responsex: {
            message: 'Invalid verification code. Please check and try again.',
            status: 'INVALID_CODE',
          },
          successx: false,
        },
        { status: 400 }
      );
    }

    // Check if code has expired
    const codeTimestamp = new Date(storedData.timestamp).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - codeTimestamp;

    if (timeDifference > CODE_EXPIRATION_TIME) {
      return NextResponse.json(
        {
          responsex: {
            message: 'Verification code has expired. Please request a new code.',
            status: 'CODE_EXPIRED',
          },
          successx: false,
        },
        { status: 400 }
      );
    }

    // Verify purpose matches
    if (storedData.purpose !== 'bank_details_update') {
      return NextResponse.json(
        {
          responsex: {
            message: 'Invalid verification code purpose.',
            status: 'INVALID_PURPOSE',
          },
          successx: false,
        },
        { status: 400 }
      );
    }

    // All validations passed - update bank details
    const updatex = await prisma.users.update({
      where: { pidUser: pidUser, userEmail: email },
      data: {
        bank_name: bank_name,
        bank_account_number: bank_account_number,
        bank_account_name: bank_account_name,
        userExt2: null, // Clear the verification code after successful use
        updatedAt: new Date(),
      },
    });

    if (updatex) {
      // Send confirmation email
      try {
        const xEmail = email;
        const xTitle = 'Bank Details Updated Successfully';
        const xBodyTitle = 'Bank Details Update Confirmation';
        const xBody1 = `Your bank details have been successfully updated.`;
        const xBody2 = `Bank Name: ${bank_name}<br/>Account Number: ${bank_account_number}<br/>Account Name: ${bank_account_name}<br/><br/>If you did not make this change, please contact support immediately.`;
        const xButtonTitle = 'Go to Dashboard';
        const xButtonLink = process.env.ROOT_URL + '/dashboard';

        await xMail({
          xEmail,
          xTitle,
          xBodyTitle,
          xBody1,
          xBody2,
          xButtonTitle,
          xButtonLink,
        });

        console.log('Confirmation email sent successfully!');
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Don't fail the request if confirmation email fails
      }

      return NextResponse.json(
        {
          responsex: {
            message: 'Bank details have been successfully updated!',
            status: 'ACTION_SUCCESSFUL',
          },
          successx: true,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          responsex: {
            message: 'Failed to update bank details. Please try again.',
            status: 'UPDATE_FAILED',
          },
          successx: false,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error in verify-and-update endpoint:', error);
    return NextResponse.json(
      {
        responsex: {
          message: 'An error occurred. Please try again.',
          status: 'SERVER_ERROR',
        },
        successx: false,
      },
      { status: 500 }
    );
  }
}

