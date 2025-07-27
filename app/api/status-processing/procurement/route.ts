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
  const pidOrder = formData.get('pidOrder') as string;
  const currentStatus = formData.get('currentStatus') as string;
  const newStatus = formData.get('newStatus') as string;
  const refundAmount = formData.get('refundAmount') as any;
  const serviceType = formData.get('serviceType') as string;

  //const message = formData.get('message') as string;
  //const pidMessage = formData.get('pidMessage') as string;

  //CHECK IF USER PID AND CID EXISTS
  const user = await prisma.users.findUnique({
    where: {
      pidUser: pidUser,
      //userEmail: email,
    },
  });

  //UPDATE SERVICE STATUS
  const updatex = await prisma.orders.update({
    where: {
      pidUser: pidUser,
      pidOrder: pidOrder,
    },
    data: {
      status: newStatus,
      updatedAt: new Date(),
    },
  });

  //*************************************** MESSAGING BLOCK STARTS ***************************************//
  if (updatex) {
    //SEND EMAIL TO USER
    try {
      // .................... ON-HOLD(DECLINED) STAGE MAIL ....................//
      if (newStatus == 'on-hold') {
        const xEmail = 'hello@sureimports.com' as string;
        const xTitle = `Order moved to On-Hold`;
        const xBodyTitle = `Customer Order for Shipping has been moved to On-Hold`;

        const xBody1 =
          `Hello Admin, ` +
          user?.userFirstname +
          `,` +
          `<p>has moved order with ID :<b>` +
          pidOrder +
          `</b> to <b>On-Hold</b>.</p>
          <p>You may choose to review or ignore this order, as the customer is responsible for the next action.</p>
          <p>Log into the SureImports admin dashboard, go to <b>On-Hold Orders</b> to view this order.</p>`;

        const xBody2 = ``;
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
        //success update
        return NextResponse.json(
          {
            statusx: 'SUCCESS',
            message: 'Order has been successfully moved to On-Hold.',
          },
          { status: 200 },
        );
      }

      // .................... IN-TRANSIT STAGE MAIL ....................//
      if (newStatus == 'in-transit') {
        //CHECK IF NUMBER IS NEGATIVE
        let statusz: string = 'default';
        let refundAmountz = parseFloat(refundAmount);

        if (parseFloat(refundAmountz as any) < 0) {
          console.log('Number was negative');
          statusz = 'NEGATIVE';
        }

        if (parseFloat(refundAmountz as any) >= 0) {
          console.log('Number was positive');
          statusz = 'POSITIVE';
        }

        //SEND EMAIL TO ADMIN
        const xEmail = 'hello@sureimports.com' as string;
        const xTitle = `An Order has been moved to In-Transit`;
        const xBodyTitle = `Customer Order has been moved to In-Transit`;

        const xBody1 =
          `Hello Admin, ` +
          user?.userFirstname +
          `,` +
          `<p>has moved order with ID :<b>` +
          pidOrder +
          `</b> to <b>In-Transit</b>.</p>
            <p>You necessary action is required to start processing the shipment of the order.</p>
            <p>Log into the SureImports admin dashboard, go to <b>In-Transit Orders</b> to view this order.</p>`;

        const xBody2 = ``;
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

        //CREATE REFUND RECORD AND SEND REFUND EMAIL
        if (statusz == 'NEGATIVE') {
          let refundAmountx = (refundAmountz * -1).toString(); //remove negative sign
          const pidRefund = 'RFND' + randomGenerator(15);
          const createx = await prisma.refund_records.create({
            data: {
              pidRefund: pidRefund,
              pidUser: pidUser,
              pidOrder: pidOrder,
              amount: refundAmountx,
              refundStatus: 'pending',
              serviceType: serviceType,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });

          //SEND EMAIL TO ADMIN
          const xEmail = user?.userEmail as string;
          const xTitle = `Refund Initiated`;
          const xBodyTitle = `Refund has been initiated for your order`;

          const xBody1 =
            `Hello ` +
            user?.userFirstname +
            `,` +
            `<p>A refund for Order with ID :<b>` +
            pidOrder +
            `</b> has been initiated.</p>
            <p><i>Refund Amount</i>: <b>$` +
            -refundAmountz.toFixed(2) +
            ` USD</b></p>
            <p>Log into the SureImports admin dashboard, go to <b>Refunds</b> to view your refunds.</p>`;

          const xBody2 = ``;
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
          //success update
          return NextResponse.json(
            {
              statusx: 'SUCCESS',
              message:
                'Order has been successfully moved to In-Transit. Refund has also been initiated.',
            },
            { status: 200 },
          );
        }

        //success update
        return NextResponse.json(
          {
            statusx: 'SUCCESS',
            message: 'Order has been successfully moved to In-Transit.',
          },
          { status: 200 },
        );
      }

      // .................... PENDING STAGE MAIL ....................//
      if (newStatus == 'pending') {
        const xEmail = 'hello@sureimports.com' as string;
        const xTitle = `An Order has been moved to Pending`;
        const xBodyTitle = `Customer Order has been moved to Pending`;

        const xBody1 =
          `Hello Admin, ` +
          user?.userFirstname +
          `,` +
          `<p>has moved order with ID :<b>` +
          pidOrder +
          `</b> to <b>Pending</b>.</p>
            <p>You necessary action is required to start processing the order to approved.</p>
            <p>Log into the SureImports admin dashboard, go to <b>Pending Orders</b> to view this order.</p>`;

        const xBody2 = ``;
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
        //success update
        return NextResponse.json(
          {
            statusx: 'SUCCESS',
            message: 'Order has been successfully moved to Pending.',
          },
          { status: 200 },
        );
      }

      // .................... PENDING STAGE MAIL ....................//
      if (newStatus == 'cancelled') {
        const xEmail = 'hello@sureimports.com' as string;
        const xTitle = `An Order has been Cancelled`;
        const xBodyTitle = `Customer Order has been Cancelled`;

        const xBody1 =
          `Hello Admin, ` +
          user?.userFirstname +
          `,` +
          `<p>has cancelled the order with ID :<b>` +
          pidOrder +
          `</b>.</p>
            <p>You may choose to repond to this action.</p>
            <p>Log into the SureImports admin dashboard, go to <b>Cancelled Orders</b> to view this order.</p>`;

        const xBody2 = ``;
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
        //success update
        return NextResponse.json(
          {
            statusx: 'SUCCESS',
            message: 'Order has been successfully Cancelled.',
          },
          { status: 200 },
        );
      }
    } catch (error) {
      //success update
      return NextResponse.json(
        {
          statusx: 'ACTION_FAILED',
          message:
            'Action Failed! You may need to try again, or contact the Admin. Error MSG:' +
            error,
        },
        { status: 401 },
      );
    }
  } else {
    //success update
    return NextResponse.json(
      {
        statusx: 'ACTION_FAILED',
        message:
          'Action Failed! You may need to try again, or contact the Admin.',
      },
      { status: 401 },
    );
  }

  //END
}
