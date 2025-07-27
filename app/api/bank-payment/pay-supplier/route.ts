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
import xMail from '@/lib/email/xMail2';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  //GET FORM DATA
  const formData = await request.formData();
  const pidUser = formData.get('pidUser') as string;
  const email = formData.get('userEmail') as string;
  const pidBankPayment = formData.get('pidBankPayment') as string;
  const amount = formData.get('amount') as string;
  const currencyType = formData.get('currencyType') as string;
  const destinationCountry = formData.get('destinationCountry') as string;
  const bank = formData.get('bank') as string;
  const depositor = formData.get('depositor') as string;
  const serviceID = formData.get('serviceID') as string;
  const serviceDescription = formData.get('serviceDescription') as string;

  //CHECK FOR EMPTY PAYMENT DETAILS
  if (bank == '' || depositor == '' || amount == '') {
    /////////////// RETURN RESPONSE ///////////////
    const responsex = {
      message: 'Bank payment details cannot be empty',
      status: 'EMPTY_BANK_PAYMENT_DETAILS',
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
      userEmail: email,
    },
  });

  if (user) {
    /////////////// RETURN RESPONSE ///////////////
    //create account payment
    const createx = await prisma.bank_payment.create({
      data: {
        pidUser: pidUser,
        pidBankPayment: pidBankPayment,
        pidBank: bank,
        amount: amount,
        currency: currencyType,
        depositorName: depositor,
        trxNumber: pidBankPayment,
        serviceType: serviceID,
        bankStatus: 'PENDING',
        ext1: serviceDescription,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    //UPDATE SERVICE STATUS
    const updatex = await prisma.pay_supplier.update({
      where: {
        pidUser: pidUser,
        pidPaySupplier: serviceID,
      },
      data: {
        status: 'pending-payment',
        updatedAt: new Date(),
      },
    });

    //SEND EMAIL TO USER
    try {
      ////////////////////// SEND REGISTRATION EMAIL BLOCK STARTS //////////////////////
      //import { xMail } from '@/lib/email/xMail';
      const xEmail = email as string;
      const xTitle = `Bank payment verification pending`;
      const xBodyTitle = `Payment Pending Verification`;
      const xBody1 =
        `Dear ` +
        user.userFirstname +
        `,` +
        `<br />Thank you for making a bank payment to the Pay Supplier service.<br />` +
        `Your payment is currently being verified by our team to proceed with service request. <br /> ` +
        `You may check your dashboard status for progress. <br /><br />` +
        `Best regards,<br /><br />` +
        `<b>- SureImports Processing Team</b><br />`;
      const xBody2 = '';
      const xButtonTitle = '';
      const xButtonLink = '';
      await xMail({
        xEmail,
        xTitle,
        xBodyTitle,
        xBody1,
        xBody2,
        xButtonTitle,
        xButtonLink,
      });
      ////////////////////// SEND REGISTRATION EMAIL BLOCK STARTS //////////////////////
      console.log('Email was Successfully sent! Jesus is King!');
    } catch (error) {
      console.error('Failed to send email:', error);
    }

    //success update
    const responsex = {
      message: 'Bank details uploaded',
      status: 'SUCCESS',
    };
    return NextResponse.json(
      { responsex, successx: true, userx: null },
      { status: 200 },
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

  //END
}
