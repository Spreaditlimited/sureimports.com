import { validDeviceType, usesDeviceFlatFee, normalizeDeviceType } from '@/lib/procurement/deviceShipping';
// app/api/upload/route.ts
import { PrismaClient } from '@prisma/client';
import { random } from 'lodash';
import getFileExt from '@/app/utils/fileExt';
import fileFilter from '@/utils/fileFilter';
import randomGenerator from '@/lib/helpers/randomGenerator';
import { NextResponse } from 'next/server';
import { generateSlug } from '@/utils/slugGenerator';
import { normalizeProductUrl } from '@/lib/productUrl';
import { requireProcurementUser } from '@/lib/procurement/assistance';

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
    productCategory: rawProductCategory,
    productPrice,
    productWeight,
    productQuantity,
    productInfo,
  } = await request.json();
  const productCategory = normalizeDeviceType(rawProductCategory);
  if (!validDeviceType(productCategory)) return NextResponse.json({ responsex: { status: 'INVALID_PRODUCT', message: 'Choose Phone, Laptop or Other goods.' }, successx: false }, { status: 400 });
  const normalizedProductLink = normalizeProductUrl(productLink);
  let measurementValue = Number(productWeight);
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
    (!Number.isFinite(quantityValue) || (productCategory !== 'OTHER' && !Number.isSafeInteger(quantityValue))) ||
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

  const user = await requireProcurementUser();
  if (!user) return NextResponse.json({ responsex: { message: 'Please sign in again.', status: 'UNAUTHORIZED' }, successx: false }, { status: 401 });

  if (user) {
    /////////////// RETURN RESPONSE ///////////////
    //CREATE REQUEST

    //UPDATE RECORD

    const existingProduct = await prisma.products.findFirst({
      where: { pidUser: user.pidUser, pidProduct },
      select: {
        orders: { select: { devicePhoneRateNgn: true, deviceLaptopRateNgn: true, destinationCountry: true, shippingPricingVersion: true, status: true, orderType: true } },
      },
    });
    if (!existingProduct) {
      const responsex = { message: 'Product not found.', status: 'NOT_FOUND' };
      return NextResponse.json(
        { responsex, successx: false, userx: null },
        { status: 404 },
      );
    }
    if (existingProduct.orders.orderType === 'PARTNER_PROCUREMENT' || !['saved', 'on-hold'].includes(String(existingProduct.orders.status || ''))) {
      const responsex = {
        message: 'Products can only be changed while an order is saved or on hold.',
        status: 'ORDER_NOT_EDITABLE',
      };
      return NextResponse.json(
        { responsex, successx: false, userx: null },
        { status: 409 },
      );
    }
    const destination = existingProduct.orders.destinationCountry ? await prisma.country.findUnique({ where: { pidCountry: existingProduct.orders.destinationCountry }, select: { countryName: true } }) : null;
    if ((existingProduct.orders.status === 'saved' || (existingProduct.orders.devicePhoneRateNgn != null && existingProduct.orders.deviceLaptopRateNgn != null)) && usesDeviceFlatFee(destination?.countryName, productCategory)) measurementValue = 0;
    else if (!Number.isFinite(measurementValue) || measurementValue <= 0) return NextResponse.json({ responsex: { status: 'INVALID_MEASUREMENT', message: 'Enter a per-item weight or volume greater than zero.' }, successx: false }, { status: 400 });
    const usesMeasurementPricing =
      existingProduct.orders.shippingPricingVersion === 2;

    const updatex = await prisma.products.update({
      where: { pidUser: user.pidUser, pidProduct: pidProduct },
      data: {
        productName,
        productLink: normalizedProductLink,

        productCategory,
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
