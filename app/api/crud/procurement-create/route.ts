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

const prisma = new PrismaClient();

export async function POST(request: Request) {
  //GET FORM JSON DATA

  console.log('JESUS IS GOD');

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
  } = await request.json();

  // {
  //   //"orderName":"TEST ORDER X 777",
  //   //"destinationCountry":"CTY1737279402903",
  //   //"currencyType":"USD",
  //   //"shippingPlan":"SHP1737280820075",
  //   //"orderCategory":"Raw Batteries",
  //   //"shippingAddress":"This is order 777",
  //   //"pidOrder":"DR1737425818459",
  //   //"pidUser":"CUSQ61E2A8WXT",
  //   //"emailUser":"atsuemmanuel@gmail.com"
  // }

  console.log('JESUS IS KING' + pidOrder);

  //CHECK IF USER EXISTS
  const user = await prisma.users.findUnique({
    where: {
      pidUser: pidUser,
      userEmail: emailUser,
    },
  });

  console.log('JESUS IS GREAT!!!!!!!');

  if (user) {
    /////////////// RETURN RESPONSE ///////////////
    //CREATE REQUEST

    const createx = await prisma.orders.create({
      data: {
        pidOrder,
        pidUser,
        orderName,
        destinationCountry,
        currencyType,
        shippingPlan,
        orderCategory,
        shippingAddress,
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
