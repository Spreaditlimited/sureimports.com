// app/api/upload/route.ts
import { PrismaClient } from '@prisma/client';
import { random } from 'lodash';
import getFileExt from '@/app/utils/fileExt';
import fileFilter from '@/utils/fileFilter';
import randomGenerator from '@/lib/helpers/randomGenerator';
import { NextResponse } from 'next/server';
import { generateSlug } from '@/utils/slugGenerator';
import { PaystackButton } from 'react-paystack';
import { useRouter } from 'next/navigation';
import { normalizeProductUrl } from '@/lib/productUrl';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  //GET FORM JSON DATA

  console.log('JESUS IS GOD');

  const {
    pidProduct,
    pidOrder,
    pidUser,
    emailUser,
    productName,
    productLink,
    //productCategory,
    productPrice,
    productWeight,
    productQuantity,
    productInfo,
  } = await request.json();
  const normalizedProductLink = normalizeProductUrl(productLink);
  const measurementValue = Number(productWeight);
  const quantityValue = Number(productQuantity);

  console.log('JESUS IS KING');

  if (
    productName === '' ||
    !normalizedProductLink ||
    //productCategory === '' ||
    productPrice === '' ||
    productWeight === '' ||
    productQuantity === '' ||
    !Number.isFinite(measurementValue) ||
    measurementValue <= 0 ||
    !Number.isFinite(quantityValue) ||
    quantityValue < 1
  ) {
    const responsex = {
      message: 'Fields cannot be submitted empty!',
      status: 'EMPTY_FIELD',
    };
    return NextResponse.json(
      { responsex, successx: true, userx: null },
      { status: 200 },
    );
  }

  //CHECK IF USER PID AND CID EXISTS
  const user = await prisma.users.findUnique({
    where: {
      pidUser: pidUser,
      userEmail: emailUser,
    },
  });

  if (user) {
    /////////////// RETURN RESPONSE ///////////////
    //CREATE REQUEST

    const order = await prisma.orders.findFirst({
      where: { pidOrder, pidUser },
      select: { shippingPricingVersion: true, status: true },
    });
    if (!order) {
      const responsex = { message: 'Order not found.', status: 'ORDER_NOT_FOUND' };
      return NextResponse.json(
        { responsex, successx: false, userx: null },
        { status: 404 },
      );
    }
    if (!['saved', 'on-hold'].includes(String(order.status || ''))) {
      const responsex = {
        message: 'Products can only be changed while an order is saved or on hold.',
        status: 'ORDER_NOT_EDITABLE',
      };
      return NextResponse.json(
        { responsex, successx: false, userx: null },
        { status: 409 },
      );
    }
    const usesMeasurementPricing = order.shippingPricingVersion === 2;

    const createx = await prisma.products.create({
      data: {
        pidProduct,
        pidOrder,
        pidUser,
        productName,
        productLink: normalizedProductLink,
        productPrice: parseFloat(productPrice),
        productWeight: usesMeasurementPricing ? null : measurementValue,
        shippingMeasurePerUnit: usesMeasurementPricing
          ? measurementValue
          : null,
        productQuantity: quantityValue,
        productInfo,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log(
      '..........................x...........................' + productWeight,
    );
    // CONFIRM THAT PROFILE DATA HAS BEEN UPDATED THEN UPLOAD IMAGE
    if (createx) {
      try {
        //GET FILE PAYLOAD
        const responsex = {
          message: 'Your product has been successfuly added!',
          status: 'SUCCESS',
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
