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
import { uploadBufferToCloudinary } from '@/lib/cloudinary/upload';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  //GET FORM DATA
  const formData = await request.formData();

  const file = formData.get('file') as File;
  const pidUser = formData.get('pidUser') as string;
  const pidSpecialSourcing = formData.get('pidSpecialSourcing') as string;
  const userEmail = formData.get('userEmail') as string;
  const productName = formData.get('productName') as string;
  const whatsappNumber = formData.get('whatsappNumber') as string;
  const productQualityRatings = formData.get('productQualityRatings') as string;
  const targetUnitPrice = formData.get('targetUnitPrice') as string;
  const productDescription = formData.get('productDescription') as string;

  // Check if the file exists and is of type File
  if (!file || !(file instanceof File)) {
    const responsex = {
      message: 'Please select an image file',
      status: 'IMAGE_NOT_SELECTED',
    };
    return NextResponse.json(
      { responsex, successx: true, userx: null },
      { status: 401 },
    );
  }

  //CHECK IF FILE IS UPLOADED
  if (
    productName == '' ||
    whatsappNumber == '' ||
    productQualityRatings == '' ||
    targetUnitPrice == '' ||
    productDescription == ''
  ) {
    /////////////// RETURN RESPONSE ///////////////
    const responsex = {
      message: 'Product details cannot be empty',
      status: 'EMPTY_DETAILS',
    };
    return NextResponse.json(
      { responsex, successx: true, userx: null },
      { status: 401 },
    );
  }

  //const pidSpecialSourcing: string = randomGenerator(20);

  //SET FILE NAME & GET FILE PARAMS
  const originalFileName = file.name;
  const fileType = file.type;
  const fileExt = getFileExt(originalFileName);
  const fileSize = file.size;
  const newFileName = 'IMG' + pidSpecialSourcing;

  //CHECK FILE VALIDITY
  const allowedExt: string[] = ['png', 'jpg', 'jpeg', 'PNG', 'JPG', 'JPEG']; //enter only permitted extensions
  const fileOK = fileFilter(fileExt, allowedExt);

  if (fileOK) {
  } else {
    const responsex = {
      message: 'Please select only valid images ' + fileExt + ' is not allowed',
      status: 'INVALID_IMAGE_UPLOAD',
    };
    return NextResponse.json(
      { responsex, successx: true, userx: null },
      { status: 401 },
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
    const createx = await prisma.special_sourcing.create({
      data: {
        pidSpecialSourcing: pidSpecialSourcing,
        pidUser: pidUser,
        productName: productName,
        whatsappNumber: whatsappNumber,
        productQualityRatings: productQualityRatings,
        targetUnitPrice: targetUnitPrice,
        productDescription: productDescription,
        productImage: newFileName,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // CONFIRM THAT PROFILE DATA HAS BEEN UPDATED THEN UPLOAD IMAGE
    if (createx) {
      ///////////// IMAGE UPLOAD TO R2 STARTS /////////////
      try {
        //GET FILE PAYLOAD
        const buffer = await file.arrayBuffer();

        await uploadBufferToCloudinary(Buffer.from(buffer), {
          folder: 'sureimports/special-sourcing',
          publicId: newFileName,
          useFilename: false,
          uniqueFilename: false,
          overwrite: true,
        });

        //RETURN SUCCESS ON FILE UPLOAD
        const responsex = {
          message: 'Sourced Product was successfully placed',
          status: 'SUCCESS',
        };
        return NextResponse.json(
          { responsex, successx: true, userx: null },
          { status: 401 },
        );
      } catch (error) {
        //CATCH ANY ERRORS ON FAILED UPLOAD
        const responsex = {
          message:
            'Product Uploaded but failed image upload, please contact your admin for issue resolution. ERROR::' +
            error,
          status: 'IMAGE_UPLOAD_FAILED',
        };
        return NextResponse.json(
          { responsex, successx: true, userx: null },
          { status: 401 },
        );
      }
      ///////////// IMAGE UPLOAD TO R2 STOPS /////////////
    } else {
      //GET RESPONSE MESSAGE FOR THE FORM FEEDBACK
      const responsex = {
        message: 'Failed saving record! Please contact the admin.',
        status: 'ACTION_FAILED',
      };
      return NextResponse.json(
        { responsex, successx: true, userx: null },
        { status: 401 },
      );
    }
  }

  //END
}
