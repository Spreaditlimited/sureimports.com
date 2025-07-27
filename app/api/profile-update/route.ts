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
import r2ImageUpload from '@/lib/helpers/r2ImageUpload';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  //GET FORM DATA
  const formData = await request.formData();

  const file = formData.get('file') as File;
  const pidUser = formData.get('pidUser') as string;
  const email = formData.get('email') as string;
  const fullName = formData.get('fullName') as string;
  const gender = formData.get('gender') as string;
  const dob = formData.get('dob') as string;
  const phone = formData.get('phone') as string;
  const country = formData.get('country') as string;
  const address = formData.get('address') as string;

  //CHECK IF USER PID AND CID EXISTS
  const user = await prisma.users.findUnique({
    where: {
      pidUser: pidUser,
      userEmail: email,
    },
  });

  //CHECK IF DETAILS ARE EMPTY
  if (
    fullName == '' ||
    gender == '' ||
    dob == '' ||
    phone == '' ||
    country == '' ||
    address == ''
  ) {
    /////////////// RETURN RESPONSE ///////////////
    const responsex = {
      message: 'User Bio-Data details cannot be empty',
      status: 'EMPTY_DETAILS',
    };
    return NextResponse.json(
      { responsex, successx: true, userx: null },
      { status: 401 },
    );
  }

  //UPDATE PROFILE RECORDS
  const updatex = await prisma.users.update({
    where: { pidUser: pidUser, userEmail: email },
    data: {
      userEmail: email,
      userFirstname: fullName,
      gender: gender,
      dob: dob,
      phone: phone,
      country: country,
      address: address,
      //userImage: newFileName,
      updatedAt: new Date(),
    },
  });

  let imageStatus = 'YES';

  //CHECK IF IMAGE IS SELECTED OR IF IMAGE EXISTS IN DB
  if (!file || !(file instanceof File)) {
    if (user?.userImage == null) {
      const responsex = {
        message: 'Please select an image file',
        status: 'NO_IMAGE_SELECTED',
      };
      return NextResponse.json(
        { responsex, successx: true, userx: null },
        { status: 401 },
      );
    } else {
      imageStatus = 'NO';
    }
  }

  if (imageStatus == 'NO') {
    //RETURN SUCCESS CONTENT UPLOAD
    const responsex = {
      message: 'Profile was successfuly updated',
      status: 'SUCCESS',
    };
    return NextResponse.json(
      { responsex, successx: true, userx: null },
      { status: 401 },
    );
  } else {
    //FILE DETAILS (NAME, SIZE, TYPE)
    let originalFileName = file.name;
    let fileSize = file.size;
    let fileType = file.type;
    let productCode: string = randomGenerator(20);
    let fileExt = getFileExt(originalFileName);
    let newFileName = 'IMG' + productCode;

    //CHECK FILE VALIDITY
    const allowedExt: string[] = ['png', 'jpg', 'jpeg', 'PNG', 'JPG', 'JPEG']; //enter only permitted extensions
    const fileOK = fileFilter(fileExt, allowedExt);

    if (fileOK) {
    } else {
      const responsex = {
        message:
          'Please select only valid images, ' + fileExt + ' is not allowed',
        status: 'INVALID_IMAGE_UPLOAD',
      };
      return NextResponse.json(
        { responsex, successx: true, userx: null },
        { status: 401 },
      );
    }

    //update image file in database
    const updatex = await prisma.users.update({
      where: { pidUser: pidUser, userEmail: email },
      data: {
        userImage: newFileName,
        updatedAt: new Date(),
      },
    });

    ///////////// IMAGE UPLOAD TO R2 STARTS /////////////
    try {
      //GET FILE PAYLOAD
      const buffer = await file.arrayBuffer();

      //FILE UPLOAD DETAILS
      const upload = new Upload({
        client: getR2Client(),
        params: {
          Bucket: process.env.R2_BUCKET_NAME,
          Key: newFileName,
          Body: Buffer.from(buffer),
          ContentType: fileType,
        },
      });

      //UPLOAD FILE
      await upload.done();

      //RETURN SUCCESS ON FILE UPLOAD
      const responsex = {
        message: 'Profile was successfuly updated',
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
  }

  //CHECK IF FILE IS UPLOADED
  // Check if the file exists and is of type File
  if (user?.userImage == null) {
    if (!file || !(file instanceof File)) {
      //if (user?.userImage == null) {
      const responsex = {
        message: 'Please select an image file',
        status: 'NO_IMAGE_SELECTED',
      };
      return NextResponse.json(
        { responsex, successx: true, userx: null },
        { status: 401 },
      );
    }
    // else {
    //   //do nothing
    // }
  } else {
  }

  if (user) {
    /////////////// RETURN RESPONSE ///////////////

    // CONFIRM THAT PROFILE DATA HAS BEEN UPDATED THEN UPLOAD IMAGE
    if (updatex) {
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
