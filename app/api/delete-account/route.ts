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
  const userEmail = formData.get('userEmail') as string;

  //CHECK IF USER PID AND CID EXISTS
  const user = await prisma.users.findUnique({
    where: {
      pidUser: pidUser,
      userEmail: userEmail,
    },
  });

  if (user) {
    /////////////// RETURN RESPONSE ///////////////
    //DELETE ACCOUNT RECORDS
    const deletex = await prisma.users.delete({
      where: { pidUser: pidUser, userEmail: userEmail },
    });

    if (deletex) {
      const responsex = {
        message: 'Your Account has been successfully Deleted!',
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
