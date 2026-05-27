import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

interface CustomerData {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
}

interface PaystackResponse {
  status: boolean;
  message: string;
  data?: any;
}

export async function GET(request: NextRequest) {
  const paystackSecretKey =
    process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY ||
    process.env.PAYSTACK_SECRET_KEY;

  if (!paystackSecretKey) {
    return NextResponse.json(
      {
        statusx: 'FAILED',
        message:
          'Missing Paystack secret key. Expected NEXT_SECRET_PAYSTACK_SECRET_KEY (or PAYSTACK_SECRET_KEY).',
      },
      { status: 500 },
    );
  }

  const pidUser = request.nextUrl.searchParams.get('pidUser');

  if (!pidUser) {
    return NextResponse.json(
      {
        statusx: 'FAILED',
        message: 'Missing pidUser',
      },
      { status: 400 },
    );
  }

  //DESTINATION COUNTRY
  const user: any = await prisma.users.findUnique({
    where: {
      pidUser: pidUser as string | undefined,
    },
    // select: {
    //   countryName: true,
    // },
  });

  if (!user) {
    return NextResponse.json(
      {
        statusx: 'FAILED',
        message: 'User not found',
      },
      { status: 404 },
    );
  }

  const email = String(user.userEmail || '').trim();
  const first_name = String(user.userFirstname || '').trim();
  const last_name = String(user.userLastname || '').trim();
  const rawPhone = String(user.phone || user.userPhone || '').trim();
  const phone = rawPhone.replace(/\s+/g, '');

  if (!email || !first_name || !phone) {
    return NextResponse.json(
      {
        statusx: 'FAILED',
        message:
          'Wallet activation requires profile email, full name, and phone number. Please update your profile and try again.',
      },
      { status: 200 },
    );
  }

  const customerData: CustomerData = {
    email: email,
    first_name: first_name,
    last_name: last_name || first_name,
    phone: phone,
  };

  try {
    //////////////////// CREATE CUSTOMER PROFILE ////////////////////
    const response = await fetch('https://api.paystack.co/customer', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });

    const data: PaystackResponse = await response.json();
    let customerCode: string | undefined = data?.data?.customer_code;

    // If customer already exists, reuse existing customer record by email.
    if (!response.ok) {
      const existingCustomerResponse = await fetch(
        `https://api.paystack.co/customer/${encodeURIComponent(email)}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${paystackSecretKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const existingCustomerData: PaystackResponse =
        await existingCustomerResponse.json();

      if (existingCustomerResponse.ok) {
        customerCode = existingCustomerData?.data?.customer_code;
      } else {
        return NextResponse.json(
          {
            statusx: 'FAILED',
            message: `Wallet creation failed: ${data?.message || existingCustomerData?.message || 'Unable to create customer profile'}`,
          },
          { status: 200 },
        );
      }
    }

    if (!customerCode) {
      return NextResponse.json(
        {
          statusx: 'FAILED',
          message:
            'Wallet creation failed: could not determine customer profile.',
        },
        { status: 200 },
      );
    }

    ////////// UPDATE CUSTOMER PROFILE //////////
    await fetch(
      'https://api.paystack.co/customer/' + customerCode,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      },
    );

    return NextResponse.json(
      {
        statusx: 'SUCCESS',
        message: 'Wallet Profile was Successfully Created',
        customerID: customerCode,
      },
      { status: 200 },
    );

    //return data;
  } catch (error: any) {
    //console.error('Paystack API error:', error);
    //throw new Error(error.message || 'Failed to create customer');
    return NextResponse.json(
      {
        statusx: 'FAILED',
        message:
          'Wallet creation failed, you may contact the admin if this persists. Error: ' +
          error,
      },
      { status: 200 },
    );
  }
}
