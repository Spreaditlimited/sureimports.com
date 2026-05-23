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

  const formData = await request.formData();

  const pidProduct = formData.get('pidProduct') as string;
  const pidUser = formData.get('pidUser') as string;
  const userEmail = formData.get('userEmail') as string;
  const phone = formData.get('phone') as any;
  const amount = formData.get('amount') as any;
  const quantity = formData.get('quantity') as string;

  console.log('JESUS IS KING');

  //CHECK IF USER EXISTS
  const user = await prisma.users.findUnique({
    where: {
      pidUser: pidUser,
      userEmail: userEmail,
    },
  });

  const product = await prisma.store.findUnique({
    where: {
      pidProduct: pidProduct,
    },
  });

  console.log(
    'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk' + phone,
  );
  //CHECK FOR PROFILE PHONE NUMBER
  // if (((user?.phone == '') || (user?.phone == null)) && ((phone == '') || (phone == 0) || (phone == '0'))) {
  //       //SUCCESS
  //       return NextResponse.json(
  //         { statusx: 'NO_PHONE_NUMBER', message: 'No Profile Phone Number, you are are required to provide a valid phone number.' },
  //         { status: 200 },
  //       );
  // }

  //   if ((user?.phone == '') || (user?.phone == null)) {
  //     //SUCCESS
  //     return NextResponse.json(
  //       { statusx: 'NO_PHONE_NUMBER', message: 'No Profile Phone Number, you are are required to provide a valid phone number.' },
  //       { status: 200 },
  //     );
  // }

  console.log('JESUS IS GREAT!!!!!!!');

  const pidPaySmallSmall = 'PSS' + randomGenerator(20);

  // try {
  //   const createx = await prisma.paysmallsmall.create({
  //     data: {
  //       pidPaySmallSmall: pidPaySmallSmall,
  //       pidUser: pidUser,
  //       pidProduct: pidProduct,
  //       // productName: pidProduct,
  //       // productDescription: 'SAVED',
  //       amount: parseFloat(amount) as any,
  //       quantity: parseInt(quantity),
  //       status: 'SAVED',
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //     },
  //   });

  // }
  // catch(error){
  //   if (error instanceof Error) {
  //     console.log('ERROR_MESSAGE:'+error.stack);
  //   } else {
  //     console.log(error);
  //   }
  // }

  if (user) {
    //CREATE REQUEST
    const createx = await prisma.paysmallsmall.create({
      data: {
        pidPaySmallSmall: pidPaySmallSmall,
        pidUser: pidUser,
        pidProduct: pidProduct,
        productName: product?.productName,
        productDescription: product?.productDescription,
        amount: parseFloat(amount) as any,
        quantity: parseInt(quantity),
        status: 'SAVED',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // CONFIRM THAT PAY SMALL SMALL HAS BEEN STARTED
    if (createx) {
      //SUCCESS
      return NextResponse.json(
        {
          statusx: 'SUCCESS',
          message: 'Product added, pay small small Initiated!',
        },
        { status: 200 },
      );
    } else {
      //FAILED
      return NextResponse.json(
        {
          statusx: 'FAILED',
          message: 'Failed saving record! Please contact the admin.',
        },
        { status: 200 },
      );
    }
  }

  //END
}
