// app/api/orders/total/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Assuming you have Prisma setup in `lib/prisma.ts`

export async function GET(request: NextRequest) {
  // const pidUser = request.nextUrl.searchParams.get('pidUser');
  // const pidProduct = request.nextUrl.searchParams.get('pidProduct');
  console.log('JESUS CHRIST IS GREAT!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  try {
    //GET ONE RECORD
    const getOneRecord = await prisma.exchange_rate.findUnique({
      where: {
        id: 1 as number | undefined,
      },
      select: {
        id: true,
        settings_name: true,
        currency_name1: true,
        currency_sign1: true,
        currency_name2: true,
        currency_sign2: true,
        currency_name3: true,
        currency_sign3: true,
        service_charge: true,
        vat: true,
        exNairaToDollar: true,
        exYuanToDollar: true,
        exNairaToYuan: true,
        status: true,
      },
    });

    console.log(
      'JESUS CHRIST IS GREAT!!!!!!!!!!!!!!!!!!!!!!!!!!!' + getOneRecord,
    );

    return NextResponse.json({
      getOneRecord: getOneRecord,
    });
  } catch (error) {
    console.error('Error Processing:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
