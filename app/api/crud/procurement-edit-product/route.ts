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
  // //GET FORM JSON DATA
  // const responsex = {
  //   message: 'Your pr=============================='+request.json(),
  //   status: 'SUCCESS',
  // };
  // return NextResponse.json(
  //   { responsex, successx: true, userx: null },
  //   { status: 200 },
  // );
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

  if (!normalizedProductLink) {
    const responsex = {
      message: 'Please enter a valid product link.',
      status: 'INVALID_PRODUCT_LINK',
    };
    return NextResponse.json(
      { responsex, successx: false, userx: null },
      { status: 400 },
    );
  }
  if (
    !Number.isFinite(measurementValue) ||
    measurementValue <= 0 ||
    !Number.isFinite(quantityValue) ||
    quantityValue < 1
  ) {
    const responsex = {
      message: 'Per-item measurement must be greater than zero and quantity must be at least one.',
      status: 'INVALID_MEASUREMENT',
    };
    return NextResponse.json(
      { responsex, successx: false, userx: null },
      { status: 400 },
    );
  }

  console.log('JESUS IS KING FOREVER');

  // if (
  //   productName === '' ||
  //   productLink === '' ||
  //   //productCategory === '' ||
  //   productPrice === '' ||
  //   productWeight === '' ||
  //   productQuantity === ''
  // ) {
  //   const responsex = {
  //     message: 'Fields cannot be submitted empty!',
  //     status: 'EMPTY_FIELD',
  //   };
  //   return NextResponse.json(
  //     { responsex, successx: true, userx: null },
  //     { status: 200 },
  //   );
  // }

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

    //UPDATE RECORD

    const existingProduct = await prisma.products.findFirst({
      where: { pidUser, pidProduct },
      select: {
        orders: { select: { shippingPricingVersion: true, status: true } },
      },
    });
    if (!existingProduct) {
      const responsex = { message: 'Product not found.', status: 'NOT_FOUND' };
      return NextResponse.json(
        { responsex, successx: false, userx: null },
        { status: 404 },
      );
    }
    if (!['saved', 'on-hold'].includes(String(existingProduct.orders.status || ''))) {
      const responsex = {
        message: 'Products can only be changed while an order is saved or on hold.',
        status: 'ORDER_NOT_EDITABLE',
      };
      return NextResponse.json(
        { responsex, successx: false, userx: null },
        { status: 409 },
      );
    }
    const usesMeasurementPricing =
      existingProduct.orders.shippingPricingVersion === 2;

    const updatex = await prisma.products.update({
      where: { pidUser: pidUser as string, pidProduct: pidProduct },
      data: {
        productName,
        productLink: normalizedProductLink,
        //productCategory,
        productPrice: parseFloat(productPrice),
        productWeight: usesMeasurementPricing ? undefined : measurementValue,
        shippingMeasurePerUnit: usesMeasurementPricing
          ? measurementValue
          : undefined,
        productQuantity: quantityValue,
        productInfo,
        updatedAt: new Date(),
      },
    });

    // CONFIRM THAT PROFILE DATA HAS BEEN UPDATED THEN UPLOAD IMAGE
    if (updatex) {
      try {
        //GET FILE PAYLOAD
        const responsex = {
          message: 'Your product has been successfuly updated!',
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
