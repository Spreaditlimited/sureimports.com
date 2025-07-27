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

///////////// IMAGE UPLOAD TO R2 STARTS /////////////
const r2ImageUpload = async (file: File, { newFileName, fileType }: any) => {
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
}; //END OF R2 IMAGE UPLOAD

export default r2ImageUpload;
