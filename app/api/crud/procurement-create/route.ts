// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { resolveNewProcurementShippingPricing } from '@/lib/procurement/shippingPricing';
import { prisma } from '@/lib/prisma';
import { requireProcurementUser } from '@/lib/procurement/assistance';

export async function POST(request: Request) {
  const {
    pidOrder,
    pidUser,
    emailUser,
    orderName,
    destinationCountry,
    currencyType,
    shippingPlan,
    orderCategory,
    shippingAddress,
    allowSeparateOrder,
  } = await request.json();
  const user = await requireProcurementUser();
  if (!user) return NextResponse.json({ responsex: { status: 'UNAUTHORIZED', message: 'Please sign in again.' }, successx: false }, { status: 401 });
  const existingDrafts = await prisma.orders.findMany({
    where: { pidUser: user.pidUser, status: 'saved', mergedIntoOrderId: null },
    orderBy: { updatedAt: 'desc' },
    select: { pidOrder: true, orderName: true, updatedAt: true, _count: { select: { products: true } } },
  });
  if (existingDrafts.length && allowSeparateOrder !== true) {
    return NextResponse.json({
      responsex: { status: 'EXISTING_SAVED_ORDERS', message: 'Continue your saved order, or explicitly choose a separate shipment.', drafts: existingDrafts.map(({ _count, ...draft }) => ({ ...draft, productCount: _count.products })) },
      successx: false,
    }, { status: 409 });
  }

  if (user) {
    /////////////// RETURN RESPONSE ///////////////
    //CREATE REQUEST

    let shippingPricing;
    try {
      shippingPricing = await resolveNewProcurementShippingPricing(
        destinationCountry,
        shippingPlan,
      );
    } catch (error) {
      const responsex = {
        message:
          error instanceof Error ? error.message : 'Invalid shipping selection.',
        status: 'INVALID_SHIPPING_SELECTION',
      };
      return NextResponse.json(
        { responsex, successx: false, userx: null },
        { status: 400 },
      );
    }

    const createx = await prisma.orders.create({
      data: {
        pidOrder,
        pidUser: user.pidUser,
        orderName,
        destinationCountry,
        currencyType,
        shippingPlan,
        orderCategory,
        shippingAddress,
        shippingPricingVersion: shippingPricing.version,
        shippingMeasurementUnit: shippingPricing.measurementUnit,
        shippingRateSnapshot: shippingPricing.rate,
        shippingRateCurrency: shippingPricing.rateCurrency,
        status: 'saved',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // CONFIRM THAT PROFILE DATA HAS BEEN UPDATED THEN UPLOAD IMAGE
    if (createx) {
      try {
        //GET FILE PAYLOAD
        const responsex = {
          message: 'order created, now start adding products',
          status: 'SUCCESS',
          pidOrder: pidOrder,
        };
        return NextResponse.json(
          { responsex, successx: true, userx: null },
          { status: 200 },
        );
      } catch (error) {
        //GET RESPONSE MESSAGE FOR THE FORM FEEDBACK
        const responsex = {
          message: 'Failed saving record! Please contact the admin.',
          status: 'FAILED',
        };
        return NextResponse.json(
          { responsex, successx: true, userx: null },
          { status: 401 },
        );
      }
    } else {
      //GET RESPONSE MESSAGE FOR THE FORM FEEDBACK
      const responsex = {
        message: 'Failed saving record! Please contact the admin.',
        status: 'FAILED',
      };
      return NextResponse.json(
        { responsex, successx: true, userx: null },
        { status: 401 },
      );
    }
  }

  //END
}
