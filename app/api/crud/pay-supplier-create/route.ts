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
  //GET FORM DATA
  const formData = await request.formData();

  const pidPaySupplier = formData.get('pidPaySupplier') as string;
  const pidUser = formData.get('pidUser') as string;
  const userEmail = formData.get('userEmail') as string;
  const supplierName = formData.get('supplierName') as string;
  const supplierPhone = formData.get('supplierPhone') as string;
  const supplierEmail = formData.get('supplierEmail') as string;
  const aliPayAccountQRCodeImage = formData.get(
    'aliPayAccountQRCodeImage',
  ) as File;
  const weChatAccountQRCodeImage = formData.get(
    'weChatAccountQRCodeImage',
  ) as File;
  const proformaInvoiceImage = formData.get('proformaInvoiceImage') as File;
  const supplierBankAccountDetails = formData.get(
    'supplierBankAccountDetails',
  ) as string;
  const amountToPayInYuan = formData.get('amountToPayInYuan') as any;
  const amountToPayInNaira = formData.get('amountToPayInNaira') as any;
  const serviceCharge = formData.get('serviceCharge') as string;

  //CHECK IF VALUE IS A VALID NUMBER
  const isValidNumber1 =
    /^-?\d*\.?\d*$/.test(amountToPayInYuan) && amountToPayInYuan !== '';
  const isValidNumber2 =
    /^-?\d*\.?\d*$/.test(amountToPayInNaira) && amountToPayInNaira !== '';

  if (isValidNumber1 && isValidNumber2) {
  } else {
    const responsex = {
      message: 'Please provide only numeric value for payment amount.',
      status: 'VALUE_NOT_A_NUMBER',
    };
    return NextResponse.json(
      { responsex, successx: true, userx: null },
      { status: 401 },
    );
  }

  // Check if the file exists and is of type File
  if (
    !aliPayAccountQRCodeImage ||
    !(aliPayAccountQRCodeImage instanceof File)
  ) {
    // const responsex = {
    //   message: 'Please select an image file for AliPay',
    //   status: 'ALIPAY_IMAGE_NOT_SELECTED',
    // };
    // return NextResponse.json(
    //   { responsex, successx: true, userx: null },
    //   { status: 401 },
    // );
  }

  // Check if the file exists and is of type File
  if (
    !weChatAccountQRCodeImage ||
    !(weChatAccountQRCodeImage instanceof File)
  ) {
    // const responsex = {
    //   message: 'Please select an image file for WeChat',
    //   status: 'WECHAT_IMAGE_NOT_SELECTED',
    // };
    // return NextResponse.json(
    //   { responsex, successx: true, userx: null },
    //   { status: 401 },
    // );
  }

  // Check if the file exists and is of type File
  if (!proformaInvoiceImage || !(proformaInvoiceImage instanceof File)) {
    const responsex = {
      message: 'Please select an image file for ProForma',
      status: 'PROFORMA_IMAGE_NOT_SELECTED',
    };
    return NextResponse.json(
      { responsex, successx: true, userx: null },
      { status: 401 },
    );
  }

  //CHECK IF FILE IS UPLOADED
  if (
    supplierName == '' ||
    supplierPhone == '' ||
    supplierEmail == '' ||
    //supplierBankAccountDetails == '' ||
    amountToPayInYuan == '' ||
    amountToPayInNaira == '' ||
    serviceCharge == ''
  ) {
    /////////////// RETURN RESPONSE ///////////////
    const responsex = {
      message: 'Request details cannot be empty',
      status: 'EMPTY_DETAILS',
    };
    return NextResponse.json(
      { responsex, successx: true, userx: null },
      { status: 401 },
    );
  }

  //const pidSpecialSourcing: string = randomGenerator(20);

  //::::::: 1 ::::::: aliPayAccountQRCodeImage SET FILE NAME & GET FILE PARAMS
  const originalFileName1 = aliPayAccountQRCodeImage.name
    ? aliPayAccountQRCodeImage.name
    : 'default.noimage';
  const fileType1 = aliPayAccountQRCodeImage.type;
  const fileExt1 = getFileExt(originalFileName1);
  const fileSize1 = aliPayAccountQRCodeImage.size;
  let newFileName1 = ('IMG' + pidPaySupplier + '1') as string | null;

  //CHECK FILE VALIDITY
  const allowedExt1: string[] = ['png', 'jpg', 'jpeg', 'PNG', 'JPG', 'JPEG']; //enter only permitted extensions
  const fileOK1 = fileFilter(fileExt1, allowedExt1);

  if (fileOK1) {
  } else {
    newFileName1 = null;
    //
  }

  //::::::: 2 ::::::: weChatAccountQRCodeImage SET FILE NAME & GET FILE PARAMS
  const originalFileName2 = weChatAccountQRCodeImage.name
    ? weChatAccountQRCodeImage.name
    : 'default.noimage';
  const fileType2 = weChatAccountQRCodeImage.type;
  const fileExt2 = getFileExt(originalFileName2);
  const fileSize2 = weChatAccountQRCodeImage.size;
  let newFileName2 = ('IMG' + pidPaySupplier + '2') as string | null;

  //CHECK FILE VALIDITY
  const allowedExt2: string[] = ['png', 'jpg', 'jpeg', 'PNG', 'JPG', 'JPEG']; //enter only permitted extensions
  const fileOK2 = fileFilter(fileExt2, allowedExt2);

  if (fileOK2) {
  } else {
    newFileName2 = null;
    //
  }

  //::::::: 3 ::::::: proformaInvoiceImage SET FILE NAME & GET FILE PARAMS
  const originalFileName3 = proformaInvoiceImage.name
    ? proformaInvoiceImage.name
    : 'default.noimage';
  const fileType3 = proformaInvoiceImage.type;
  const fileExt3 = getFileExt(originalFileName3);
  const fileSize3 = proformaInvoiceImage.size;
  let newFileName3 = ('IMG' + pidPaySupplier + '3') as string | null;

  //CHECK FILE VALIDITY
  const allowedExt3: string[] = ['png', 'jpg', 'jpeg', 'PNG', 'JPG', 'JPEG']; //enter only permitted extensions
  const fileOK3 = fileFilter(fileExt3, allowedExt3);

  if (fileOK3) {
  } else {
    newFileName3 = null;
    //
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
    const createx = await prisma.pay_supplier.create({
      data: {
        pidPaySupplier: pidPaySupplier,
        pidUser: pidUser,
        supplierName: supplierName,
        supplierPhone: supplierPhone,
        supplierEmail: supplierEmail,
        aliPayAccountQRCodeImage: newFileName1,
        weChatAccountQRCodeImage: newFileName2,
        proformaInvoiceImage: newFileName3,
        supplierBankAccountDetails: supplierBankAccountDetails,
        amountToPayInYuan: amountToPayInYuan,
        amountToPayInNaira: amountToPayInNaira,
        serviceCharge: serviceCharge,
        account_details1: null,
        account_details2: null,
        bank_account_details: null,
        amount_to_pay: null,
        additional_info: null,
        service_charge: null,
        vat: null,
        status: 'saved',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // CONFIRM THAT PROFILE DATA HAS BEEN UPDATED THEN UPLOAD IMAGE
    if (createx) {
      ///////////// IMAGE UPLOAD TO R2 STARTS /////////////
      try {
        //GET FILE PAYLOAD

        //----------------------------- IMAGE 1 UPLOAD
        if (newFileName1 == null) {
        } else {
          const bufferAliPay = await aliPayAccountQRCodeImage.arrayBuffer();
          //FILE UPLOAD DETAILS
          const uploadAliPay = new Upload({
            client: getR2Client(),
            params: {
              Bucket: process.env.R2_BUCKET_NAME,
              Key: newFileName1 as string,
              Body: Buffer.from(bufferAliPay),
              ContentType: fileType1,
            },
          });

          await uploadAliPay.done();
          //RETURN SUCCESS ON FILE UPLOAD
          // const responsex = {
          //   message: 'Sourced Product was successfully placed',
          //   status: 'SUCCESS',
          // };
          // return NextResponse.json(
          //   { responsex, successx: true, userx: null },
          //   { status: 200 },
          // );
        }

        //----------------------------- IMAGE 2 UPLOAD
        if (newFileName2 == null) {
        } else {
          const bufferWeChat = await weChatAccountQRCodeImage.arrayBuffer();
          const uploadWeChat = new Upload({
            client: getR2Client(),
            params: {
              Bucket: process.env.R2_BUCKET_NAME,
              Key: newFileName2 as string,
              Body: Buffer.from(bufferWeChat),
              ContentType: fileType2,
            },
          });

          await uploadWeChat.done();
          //RETURN SUCCESS ON FILE UPLOAD
          // const responsex = {
          //   message: 'Sourced Product was successfully placed',
          //   status: 'SUCCESS',
          // };
          // return NextResponse.json(
          //   { responsex, successx: true, userx: null },
          //   { status: 200 },
          // );
        }

        //----------------------------- IMAGE 3 UPLOAD
        if (newFileName3 == null) {
        } else {
          const bufferProForma = await proformaInvoiceImage.arrayBuffer();
          const uploadProForma = new Upload({
            client: getR2Client(),
            params: {
              Bucket: process.env.R2_BUCKET_NAME,
              Key: newFileName3 as string,
              Body: Buffer.from(bufferProForma),
              ContentType: fileType3,
            },
          });

          await uploadProForma.done();
          //RETURN SUCCESS ON FILE UPLOAD
          // const responsex = {
          //   message: 'Sourced Product was successfully placed',
          //   status: 'SUCCESS',
          // };
          // return NextResponse.json(
          //   { responsex, successx: true, userx: null },
          //   { status: 200 },
          // );
        }

        //RETURN SUCCESS ON FILE UPLOAD
        const responsex = {
          message: 'Sourced Product was successfully placed',
          status: 'SUCCESS',
        };
        return NextResponse.json(
          { responsex, successx: true, userx: null },
          { status: 200 },
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
