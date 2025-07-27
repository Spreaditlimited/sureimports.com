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

const prisma = new PrismaClient();

export async function POST(request: Request) {
  //GET FORM DATA
  const formData = await request.formData();
  const pidUser = formData.get('pidUser') as string;
  const email = formData.get('email') as string;
  const bank_name = formData.get('bank_name') as string;
  const bank_account_number = formData.get('bank_account_number') as string;
  const bank_account_name = formData.get('bank_account_name') as string;

  //CHECK IF FILE IS UPLOADED
  if (bank_name == '' || bank_account_number == '' || bank_account_name == '') {
    /////////////// RETURN RESPONSE ///////////////
    const responsex = {
      message: 'Bank details cannot be empty',
      status: 'EMPTY_BANK_DETAILS',
    };
    return NextResponse.json(
      { responsex, successx: true, userx: null },
      { status: 401 },
    );
  }

  //CHECK IF FILE IS UPLOADED
  // if (!file) {
  //   /////////////// RETURN RESPONSE ///////////////
  //   const responsex = {
  //     message: 'No Image has been selected',
  //     status: 'NO_IMAGE',
  //   };
  //   return NextResponse.json(
  //     { responsex, successx: true, userx: null },
  //     { status: 401 },
  //   );
  // }

  //CHECK IF USER PID AND CID EXISTS
  const user = await prisma.users.findUnique({
    where: {
      pidUser: pidUser,
      userEmail: email,
    },
  });

  if (user) {
    /////////////// RETURN RESPONSE ///////////////
    //UPDATE PROFILE RECORDS
    const updatex = await prisma.users.update({
      where: { pidUser: pidUser, userEmail: email },
      data: {
        bank_name: bank_name,
        bank_account_number: bank_account_number,
        bank_account_name: bank_account_name,
        updatedAt: new Date(),
      },
    });

    if (updatex) {
      const responsex = {
        message: 'Bank details has been successfully updated!',
        status: 'ACTION_SUCCESSFUL',
      };
      return NextResponse.json(
        { responsex, successx: true, userx: null },
        { status: 401 },
      );
    } else {
      const responsex = {
        message:
          'Action Failed! You may need to re-login try again, or contact the Admin.',
        status: 'ACTION_FAILED',
      };
      return NextResponse.json(
        { responsex, successx: true, userx: null },
        { status: 401 },
      );
    }
  } else {
    const responsex = {
      message:
        'Action Failed! You may need to re-login try again, or contact the Admin.',
      status: 'ACTION_FAILED',
    };
    return NextResponse.json(
      { responsex, successx: true, userx: null },
      { status: 401 },
    );
  }

  //END
}
