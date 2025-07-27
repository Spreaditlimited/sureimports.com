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

    const updatex = await prisma.products.update({
      where: { pidUser: pidUser as string, pidProduct: pidProduct },
      data: {
        productName,
        productLink,
        //productCategory,
        productPrice: parseFloat(productPrice),
        productWeight: parseFloat(productWeight),
        productQuantity: parseFloat(productQuantity),
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
