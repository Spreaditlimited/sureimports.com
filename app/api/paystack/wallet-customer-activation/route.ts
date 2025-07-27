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
  const pidUser = request.nextUrl.searchParams.get('pidUser');

  //DESTINATION COUNTRY
  const user: any = await prisma.users.findUnique({
    where: {
      pidUser: pidUser as string | undefined,
    },
    // select: {
    //   countryName: true,
    // },
  });

  const email = user.userEmail;
  const first_name = user.userFirstname;
  const last_name = user.userLastname;
  const phone = user.phone;

  const customerData: CustomerData = {
    email: email,
    first_name: first_name,
    last_name: last_name,
    phone: phone,
  };

  try {
    //////////////////// CREATE CUSTOMER PROFILE ////////////////////
    const response = await fetch('https://api.paystack.co/customer', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });

    const data: PaystackResponse = await response.json();

    ////////// UPDATE CUSTOMER PROFILE //////////
    const response2 = await fetch(
      'https://api.paystack.co/customer/' + data.data.customer_code,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      },
    );

    const data2: PaystackResponse = await response2.json();

    ////////// NO CUSTOMER FOUND //////////
    if (!response.ok) {
      //throw new Error(data.message || 'Failed to create customer');
      return NextResponse.json(
        {
          statusx: 'FAILED',
          message:
            'Wallet creation failed, you may contact the admin if this persists.',
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        statusx: 'SUCCESS',
        message: 'Wallet Profile was Successfully Created',
        customerID: data.data.customer_code,
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
