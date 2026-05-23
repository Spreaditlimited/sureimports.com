// app/api/upload/route.ts
import { PrismaClient } from '@prisma/client';
import { random } from 'lodash';
import getFileExt from '@/app/utils/fileExt';
import fileFilter from '@/utils/fileFilter';
import randomGenerator from '@/lib/helpers/randomGenerator';
import { NextResponse } from 'next/server';
import { generateSlug } from '@/utils/slugGenerator';
import { uploadBufferToCloudinary } from '@/lib/cloudinary/upload';

///////////// IMAGE UPLOAD TO R2 STARTS /////////////
const r2ImageUpload = async (file: File, { newFileName, fileType }: any) => {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    await uploadBufferToCloudinary(buffer, {
      folder: 'sureimports/profile',
      publicId: newFileName,
      useFilename: false,
      uniqueFilename: false,
      overwrite: true,
    });

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
