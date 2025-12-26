import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const pidUser = request.nextUrl.searchParams.get('pidUser');
  const pidPaySmallSmall = request.nextUrl.searchParams.get('pidPaySmallSmall');
  const pidProduct = request.nextUrl.searchParams.get('pidProduct');
  const amount = request.nextUrl.searchParams.get('amount');

  // console.log('pidUser:', pidUser);
  // console.log('pidPaySmallSmall:', pidPaySmallSmall);
  // console.log('pidProduct:', pidProduct);
  // console.log('amount:', amount);
  // return;

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

  // check if user exist
  if (user) {
    //console.log('User found:', user);
    //return NextResponse.json({ user });
  } else {
    return NextResponse.json(
      {
        statusx: 'FAILED',
        message: 'Please contact support for assistance',
      },
      { status: 200 },
    );
  }

  // Update single
  const updatex = await prisma.paysmallsmall.update({
    where: { pidPaySmallSmall: pidPaySmallSmall as string | undefined },
    data: { status: 'CANCELLED' },
  });

  if (updatex) {
    //console.log('Deleted successfully');
    return NextResponse.json(
      {
        statusx: 'SUCCESS',
        message: 'PaySmallSmall Profile was Successfully Cancelled',
      },
      { status: 200 },
    );
  } else {
    //console.log('Failed to delete');
    return NextResponse.json(
      {
        statusx: 'FAILED',
        message: 'PaySmallSmall Profile was NOT Cancelled',
      },
      { status: 200 },
    );
  }
}
