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
  //GET FORM DATA
  const formData = await request.formData();

  const pidVerifySupplier = formData.get('pidVerifySupplier') as string;
  const pidUser = formData.get('pidUser') as string;
  const userEmail = formData.get('userEmail') as string;
  const supplierName = formData.get('supplierName') as string;
  const supplierPhone = formData.get('supplierPhone') as string;
  const supplierAddress = formData.get('supplierAddress') as string;
  const supplierProduct = formData.get('supplierProduct') as string;
  const supplierWebsite = formData.get('supplierWebsite') as string;
  const supplierDetails = formData.get('supplierDetails') as string;

  // Check if the file exists and is of type File
  if (
    supplierName === undefined ||
    supplierName === '' ||
    supplierName === null ||
    supplierPhone === undefined ||
    supplierPhone === '' ||
    supplierPhone === null ||
    supplierAddress === undefined ||
    supplierAddress === '' ||
    supplierAddress === null ||
    supplierProduct === undefined ||
    supplierProduct === '' ||
    supplierProduct === null ||
    supplierWebsite === undefined ||
    supplierWebsite === '' ||
    supplierWebsite === null ||
    supplierDetails === undefined ||
    supplierDetails === '' ||
    supplierDetails === null
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
      userEmail: userEmail,
    },
  });

  if (user) {
    /////////////// RETURN RESPONSE ///////////////
    //UPDATE PROFILE RECORDS
    const createx = await prisma.verify_supplier.create({
      data: {
        pidVerifySupplier: pidVerifySupplier,
        pidUser: pidUser,
        supplierName: supplierName,
        supplierPhone: supplierPhone,
        supplierAddress: supplierAddress,
        supplierProduct: supplierProduct,
        supplierWebsite: supplierWebsite,
        supplierDetails: supplierDetails,
        status: 'pending-payment',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // CONFIRM THAT PROFILE DATA HAS BEEN UPDATED THEN UPLOAD IMAGE
    if (createx) {
      ///////////// IMAGE UPLOAD TO R2 STARTS /////////////
      try {
        //RETURN SUCCESS ON FILE UPLOAD
        const responsex = {
          message:
            'We have received your supplier verification request. We will send the verification result to your registered email within 3 business days',
          status: 'SUCCESS',
        };
        return NextResponse.json(
          { responsex, successx: true, userx: null },
          { status: 401 },
        );
      } catch (error) {
        //CATCH ANY ERRORS ON FAILED UPLOAD
        //GET RESPONSE MESSAGE FOR THE FORM FEEDBACK
        console.error(error);
        console.log(error);
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
