import { getDeviceShippingSettings } from '@/lib/procurement/deviceShippingSettings';
import { orderDeviceRates } from '@/lib/procurement/deviceShipping';
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

    const destination = getOneRecord?.destinationCountry
      ? await prisma.country.findUnique({
          where: { pidCountry: getOneRecord.destinationCountry },
          select: { countryName: true },
        })
      : null;

    const deviceRates = getOneRecord && destination?.countryName?.trim().toLowerCase() === 'nigeria'
      ? getOneRecord.status === 'saved' ? await getDeviceShippingSettings() : orderDeviceRates(getOneRecord, destination.countryName)
      : null;
    return NextResponse.json({
      deviceRates,
      getOneRecord: getOneRecord,
      destinationCountryName: destination?.countryName || '',
    });
  } catch (error) {
    console.error('Error Processing:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
