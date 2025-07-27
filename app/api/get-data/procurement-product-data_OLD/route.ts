// app/api/orders/total/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Assuming you have Prisma setup in `lib/prisma.ts`

function replaceNullWithZero<T>(value: T | null): T | number {
  return value === null ? 0 : value;
}

export async function GET(request: NextRequest) {
  const pidOrder = request.nextUrl.searchParams.get('pidOrder') as any;

  try {
    //TOTAL PRODUCTS PRICE
    const price: any = await prisma.$queryRaw`
        SELECT pidOrder, SUM(productQuantity * productPrice) as totalPricex
        FROM products
        WHERE pidOrder = ${pidOrder}
      `;

    //TOTAL PRODUCTS WEIGHT
    const weight: any = await prisma.$queryRaw`
        SELECT pidOrder, SUM(productQuantity * productWeight) as totalWeightx
        FROM products
        WHERE pidOrder = ${pidOrder}
      `;

    //PRODUCTS TOTAL COUNT
    const count = await prisma.products.count({
      where: {
        pidOrder: pidOrder,
      },
    });

    //PRODUCTS ALL RECORDS
    const products = await prisma.products.findMany({
      where: {
        pidOrder: pidOrder,
      },
    });

    //ORDER CURRENCY TYPE
    const orderRecord = await prisma.orders.findUnique({
      where: { pidOrder: pidOrder as string | undefined },
      select: {
        currencyType: true,
        destinationCountry: true,
      },
    });

    const totalPrice = replaceNullWithZero(price[0].totalPricex);
    const totalWeight = replaceNullWithZero(weight[0].totalWeightx);
    const totalCount = replaceNullWithZero(count);

    console.log('JESUS CHRIST IS GREAT! ' + totalWeight);

    return NextResponse.json({
      productsGetAll: products,
      productsTotalPrice: totalPrice,
      productsTotalWeight: totalWeight,
      productsTotalCount: totalCount,
      currencyType: orderRecord?.currencyType,
      destinationCountry: orderRecord?.destinationCountry,
    });
  } catch (error) {
    console.error('Error calculating total amount:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
