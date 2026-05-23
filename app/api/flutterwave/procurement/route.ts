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
import xMail from '@/lib/email/xMail2';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  //GET FORM JSON DATA

  console.log('JESUS IS GOD');

  const {
    pidPaymentx,
    pidOrderx,
    pidUserx,
    payerNamex,
    emailx,
    serviceIDx,
    serviceDescriptionx,
    amountx,
    paymentTypex,
    currenctyx,
    customerx,
    flwRefx,
    trxIDx,
    statusx,
    trxRefx,
  } = await request.json();

  console.log('JESUS IS KING' + request);

  //CHECK IF USER PID AND CID EXISTS
  const user = await prisma.users.findUnique({
    where: {
      pidUser: pidUserx,
      userEmail: emailx,
    },
  });

  if (user) {
    /////////////// RETURN RESPONSE ///////////////
    //CREATE REQUEST

    const createx = await prisma.payments.create({
      data: {
        pidPayment: pidPaymentx,
        pidUser: pidUserx,
        payerName: payerNamex,
        txID: trxIDx,
        txRef: trxRefx,
        paymentStatus: statusx,
        paymentType: paymentTypex,
        currency: currenctyx,
        amount: amountx,
        serviceID: pidOrderx,
        serviceDescription: serviceDescriptionx,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // CONFIRM THAT PROFILE DATA HAS BEEN UPDATED THEN UPLOAD IMAGE
    if (createx) {
      //UPDATE SERVICE STATUS
      const updatex = await prisma.orders.update({
        where: {
          pidUser: pidUserx,
          pidOrder: serviceIDx,
        },
        data: {
          status: 'pending',
          updatedAt: new Date(),
        },
      });

      //SEND EMAIL TO USER
      try {
        ////////////////////// SEND BANK PAYMENT EMAIL BLOCK STARTS //////////////////////
        //import { xMail } from '@/lib/email/xMail';
        const xEmail = emailx as string;
        const xTitle = `Payment Successful!`;
        const xBodyTitle = `Payment Successful`;
        const xBody1 = `Dear ` + user.userFirstname;
        +`,` + `<br />Your payment was successful.`;
        const xBody2 = `Your order is currently being processed by our team. <br /> You may check your dashboard status for progress.`;
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
      } catch (error) {
        console.error('Failed to send email:', error);
      }

      try {
        //GET FILE PAYLOAD
        const responsex = {
          message: 'Your request has been successfuly submitted!',
          status: 'SUCCESS',
        };
        return NextResponse.json(
          { responsex, successx: true, userx: null },
          { status: 200 },
        );
      } catch (error) {
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
