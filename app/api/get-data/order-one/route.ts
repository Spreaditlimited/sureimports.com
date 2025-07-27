// app/api/orders/total/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Assuming you have Prisma setup in `lib/prisma.ts`

export async function GET(request: NextRequest) {
  // const pidUser = request.nextUrl.searchParams.get('pidUser');
  const pidOrder = request.nextUrl.searchParams.get('pidOrder') as any;
  console.log('JESUS CHRIST IS GREAT!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  try {
    //GET ONE RECORD
    const getOneRecord = await prisma.orders.findUnique({
      where: {
        pidOrder: pidOrder,
      },
      //   select: {
      //     orders: true,
      //   },
    });

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
