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

  const newTotalAmount = formData.get('newTotalAmount') as string;
  const newTotalWeight = formData.get('newTotalWeight') as string;
  const newEstimatedTotalShippingCost = formData.get(
    'newEstimatedTotalShippingCost',
  ) as string;

  const serviceID = formData.get('serviceID') as string;
  const serviceDescription = formData.get('serviceDescription') as string;
  const currentStatus = formData.get('currentStatus') as string;

  // return NextResponse.json(
  //   { statusx: 'EMPTY_BANK_PAYMENT_DETAILS', message: 'Bank payment details cannot be empty' + serviceID +'-------'+pidUser},
  //   { status: 401 },
  // );

  //CHECK FOR EMPTY PAYMENT DETAILS
  if (bank == '' || depositor == '' || amount == '') {
    /////////////// RETURN RESPONSE ///////////////

    return NextResponse.json(
      {
        statusx: 'EMPTY_BANK_PAYMENT_DETAILS',
        message: 'Bank payment details cannot be empty',
      },
      { status: 200 },
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
    let statusz = 'saved';

    if (currentStatus == 'saved') {
      statusz = 'bank-pending-saved-orders';
    }

    if (currentStatus == 'pay-for-shipping') {
      statusz = 'bank-pending-shipping-orders';
    }

    if (currentStatus == 'on-hold') {
      statusz = 'bank-pending-saved-orders';
    }

    /////////////// UPDATE BANK RECORDS ///////////////
    const createx = await prisma.bank_payment.create({
      data: {
        pidUser: pidUser,
        pidOrder: serviceID,
        pidBankPayment: pidBankPayment,
        pidBank: bank,
        amount: amount,
        currency: currencyType,
        depositorName: depositor,
        trxNumber: pidBankPayment,
        serviceType: statusz,
        bankStatus: 'PENDING',
        ext1: serviceDescription,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    //GET ORDER RECORD
    const order = await prisma.orders.findUnique({
      where: {
        pidUser: pidUser,
        pidOrder: serviceID,
      },
    });

    const orderTotalCost = order?.orderTotalCost || null;
    const orderWeight = order?.orderWeight || null;
    const orderShippingCost = order?.orderShippingCost || null;

    //UPDATE ORDER & SERVICE STATUS for old values
    const updatex = await prisma.orders.update({
      where: {
        pidUser: pidUser,
        pidOrder: serviceID,
      },
      data: {
        orderTotalCostOld: orderTotalCost,
        orderWeightOld: orderWeight,
        orderShippingCostOld: orderShippingCost,
        //status: statusz,
        //updatedAt: new Date(),
      },
    });

    //UPDATE ORDER & SERVICE STATUS for new values
    const updatex2 = await prisma.orders.update({
      where: {
        pidUser: pidUser,
        pidOrder: serviceID,
      },
      data: {
        orderTotalCost: newTotalAmount,
        orderWeight: newTotalWeight,
        orderShippingCost: newEstimatedTotalShippingCost,
        status: statusz,
        updatedAt: new Date(),
      },
    });

    //SEND EMAIL TO USER
    try {
      ////////////////////// SEND BANK PAYMENT EMAIL BLOCK STARTS //////////////////////
      //import { xMail } from '@/lib/email/xMail';
      const xEmail = email as string;
      const xTitle = `Bank payment verification pending`;
      const xBodyTitle = `Payment Pending Verification`;
      const xBody1 =
        `Dear ` +
        user.userFirstname +
        `,` +
        `<br />Thank you for making a bank payment to the Procurement service with ID: <b>` +
        serviceID +
        `</b>.<br />` +
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
      console.log('Email was Successfully sent!');
      //success update
      return NextResponse.json(
        { statusx: 'SUCCESS', message: 'Bank details uploaded successfully!' },
        { status: 200 },
      );
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  } else {
    return NextResponse.json(
      {
        statusx: 'ACTION_FAILED',
        message:
          'Action Failed! You may need to re-login try again, or contact the Admin.',
      },
      { status: 401 },
    );
  }

  //END
}
