// app/api/upload/route.ts
import { PrismaClient } from '@prisma/client';
import getFileExt from '@/app/utils/fileExt';
import fileFilter from '@/utils/fileFilter';
import { NextResponse } from 'next/server';
import { uploadBufferToCloudinary } from '@/lib/cloudinary/upload';

const prisma = new PrismaClient();

function getUploadFile(formData: FormData, key: string) {
  const value = formData.get(key);
  if (!(value instanceof File) || value.size === 0) return null;
  return value;
}

function getStoredFileName(file: File | null, pidPaySupplier: string, index: number) {
  if (!file) return null;

  const fileExt = getFileExt(file.name || 'default.noimage');
  const allowedExt = ['png', 'jpg', 'jpeg', 'PNG', 'JPG', 'JPEG', 'pdf', 'PDF'];

  if (!fileFilter(fileExt, allowedExt)) return null;

  return `IMG${pidPaySupplier}${index}`;
}

async function uploadPaySupplierFile(file: File | null, publicId: string | null) {
  if (!file || !publicId) return null;

  const buffer = await file.arrayBuffer();
  const uploaded = await uploadBufferToCloudinary(Buffer.from(buffer), {
    folder: 'sureimports/pay-supplier',
    publicId,
    resourceType: 'auto',
    useFilename: false,
    uniqueFilename: false,
    overwrite: true,
  });

  return uploaded.url;
}

export async function POST(request: Request) {
  //GET FORM DATA
  const formData = await request.formData();

  const pidPaySupplier = formData.get('pidPaySupplier') as string;
  const pidUser = formData.get('pidUser') as string;
  const userEmail = formData.get('userEmail') as string;
  const supplierName = formData.get('supplierName') as string;
  const supplierPhone = formData.get('supplierPhone') as string;
  const supplierEmail = formData.get('supplierEmail') as string;
  const aliPayAccountQRCodeImage = getUploadFile(
    formData,
    'aliPayAccountQRCodeImage',
  );
  const weChatAccountQRCodeImage = getUploadFile(
    formData,
    'weChatAccountQRCodeImage',
  );
  const proformaInvoiceImage = getUploadFile(formData, 'proformaInvoiceImage');
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
  if (!proformaInvoiceImage) {
    const responsex = {
      message: 'Please select an image or PDF file for ProForma',
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

  const newFileName1 = getStoredFileName(aliPayAccountQRCodeImage, pidPaySupplier, 1);
  const newFileName2 = getStoredFileName(weChatAccountQRCodeImage, pidPaySupplier, 2);
  const newFileName3 = getStoredFileName(proformaInvoiceImage, pidPaySupplier, 3);

  if (!newFileName3) {
    const responsex = {
      message: 'Please upload a valid proforma invoice image or PDF.',
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

        const [aliPayUrl, weChatUrl, proformaUrl] = await Promise.all([
          uploadPaySupplierFile(aliPayAccountQRCodeImage, newFileName1),
          uploadPaySupplierFile(weChatAccountQRCodeImage, newFileName2),
          uploadPaySupplierFile(proformaInvoiceImage, newFileName3),
        ]);

        await prisma.pay_supplier.update({
          where: { pidPaySupplier },
          data: {
            aliPayAccountQRCodeImage: aliPayUrl || newFileName1,
            weChatAccountQRCodeImage: weChatUrl || newFileName2,
            proformaInvoiceImage: proformaUrl || newFileName3,
          },
        });

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
