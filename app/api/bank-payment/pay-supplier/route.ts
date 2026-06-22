// app/api/upload/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
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
    const request = await prisma.pay_supplier.findUnique({
      where: {
        pidPaySupplier: serviceID,
      },
      select: {
        pidUser: true,
        pidPaySupplier: true,
        status: true,
      },
    });

    if (!request || request.pidUser !== pidUser) {
      return NextResponse.json(
        {
          statusx: 'ACTION_FAILED',
          message: 'Pay Supplier request not found.',
        },
        { status: 404 },
      );
    }

    /////////////// RETURN RESPONSE ///////////////
    //create account payment
    await prisma.bank_payment.create({
      data: {
        pidUser: pidUser,
        pidOrder: serviceID,
        pidBankPayment: pidBankPayment,
        pidBank: bank,
        amount: amount,
        currency: currencyType,
        depositorName: depositor,
        trxNumber: pidBankPayment,
        serviceType: 'pay-supplier',
        bankStatus: 'PENDING',
        ext1: serviceDescription,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    //UPDATE SERVICE STATUS
    await prisma.pay_supplier.update({
      where: {
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
      {
        statusx: 'SUCCESS',
        message: responsex.message,
        responsex,
        successx: true,
        userx: null,
      },
      { status: 200 },
    );
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
