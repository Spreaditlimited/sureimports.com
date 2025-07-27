// app/api/upload/route.ts
import { PrismaClient } from '@prisma/client';
import { random } from 'lodash';
import { getR2Client } from '@/app/utils/r2Client';
import { Upload } from '@aws-sdk/lib-storage';
import getFileExt from '@/app/utils/fileExt';
import fileFilter from '@/utils/fileFilter';
import randomGenerator from '@/lib/helpers/randomGenerator';
import { NextResponse } from 'next/server';
import { generateSlug } from '@/utils/slugGenerator';
import { PaystackButton } from 'react-paystack';
import { useRouter } from 'next/navigation';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  //GET FORM JSON DATA

  console.log('JESUS IS GOD');

  const {
    pidUser,
    email,
    pidShippingOnly,
    whatsappNumber,
    shippingName,
    shippingTo,
    grossWeight,
    trackingNumber,
    shippingPlan,
    expectedShipments,
    wantProductVerification,
    wantConsolidation,
    multipleSuppliers,
    description,
  } = await request.json();

  console.log('JESUS IS KING');

  if (
    whatsappNumber === undefined ||
    whatsappNumber === '' ||
    whatsappNumber === null ||
    shippingName === undefined ||
    shippingName === '' ||
    shippingName === null ||
    grossWeight === undefined ||
    grossWeight === '' ||
    grossWeight === null ||
    trackingNumber === undefined ||
    // trackingNumber === '' ||
    // trackingNumber === null ||
    shippingTo === undefined ||
    shippingTo === '' ||
    shippingTo === null ||
    wantProductVerification === undefined ||
    wantProductVerification === '' ||
    wantProductVerification === null ||
    wantConsolidation === undefined ||
    wantConsolidation === '' ||
    wantConsolidation === null ||
    shippingPlan === undefined ||
    shippingPlan === '' ||
    shippingPlan === null ||
    description === undefined ||
    description === '' ||
    description === null
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
      userEmail: email,
    },
  });

  if (user) {
    /////////////// RETURN RESPONSE ///////////////
    //CREATE REQUEST

    const createx = await prisma.shipping_only.create({
      data: {
        pidShippingOnly: pidShippingOnly,
        pidUser: pidUser,
        whatsappNumber: whatsappNumber,
        shippingName: shippingName,
        shippingTo: shippingTo,
        grossWeight: grossWeight,
        trackingNumber: trackingNumber,
        shippingPlan: shippingPlan,
        expectedShipments: expectedShipments,
        wantProductVerification: wantProductVerification,
        wantConsolidation: wantConsolidation,
        multipleSuppliers: multipleSuppliers,
        description: description,
        status: 'request-received',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // CONFIRM THAT PROFILE DATA HAS BEEN UPDATED THEN UPLOAD IMAGE
    if (createx) {
      try {
        //GET FILE PAYLOAD
        const responsex = {
          message: 'Your request has been successfuly submitted!',
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
