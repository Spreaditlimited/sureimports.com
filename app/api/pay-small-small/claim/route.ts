import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import xMail from '@/lib/email/xMail3';

export async function GET(request: NextRequest) {
  const pidUser = request.nextUrl.searchParams.get('pidUser');
  const pidPaySmallSmall = request.nextUrl.searchParams.get('pidPaySmallSmall');
  const pidProduct = request.nextUrl.searchParams.get('pidProduct');
  const amount = request.nextUrl.searchParams.get('amount');

  const user: any = await prisma.users.findUnique({
    where: {
      pidUser: pidUser as string | undefined,
    },
    // select: {
    //   countryName: true,
    // },
  });

  const email = user.userEmail;
  const first_name = user.userFirstname;
  const last_name = user.userLastname;
  const phone = user.phone;

  // check if user exist
  if (user) {
    //console.log('User found:', user);
    //return NextResponse.json({ user });
  } else {
    return NextResponse.json(
      {
        statusx: 'FAILED',
        message: 'Please contact support for assistance',
      },
      { status: 200 },
    );
  }

  //create a random 10 digit reference for the pidDebit
  const pidDebit = `DEB${Math.floor(1000000000 + Math.random() * 9000000000)}`; // Generate a random 10-digit number


    // Create Debits Record
    const create_debits = await prisma.debits.create({
      data: { 
        pidDebit: pidDebit as any,
        pidUser: pidUser as any,
        payerName: `${first_name} ${last_name}`,
        txID: `DEB${Math.floor(100000 + Math.random() * 900000)}`, // Generate a random 6-digit number
        txRef: `REF${Math.floor(100000 + Math.random() * 900000)}`, // Generate a random 6-digit number
        paymentStatus: 'DEBITED',
        amount: parseFloat(amount as string),
        currency: 'NGN',
       },
    });

    if (create_debits) {

      const update_status = await prisma.paysmallsmall.update({
        where: { pidPaySmallSmall: pidPaySmallSmall as string | undefined },
        data: { status: 'COMPLETED' },
      });


      const pss = await prisma.paysmallsmall.findUnique({
        where: { pidPaySmallSmall: pidPaySmallSmall as string | undefined },
      });



     ////////////////////// SEND CUSTOMER PAYMENT RECEIPT EMAIL BLOCK STARTS //////////////////////
      //import { xMail } from '@/lib/email/xMail';
      const xEmail_A = email; //hello@sureimports.com
      const xTitle_A = `Thank you for completing your Pay Small Small order`;
      const xBodyTitle_A = `Your Purchase was Successful!`;
      const xBody_A = `Dear ${first_name}, <br />
                            This is to confirm your Pay Small Small Order Completion on the <b>sureimports.com</b> website.<br /><br />
                            Here are the details of your order: <br />
                            <h4>Order type: <b>Pay Small Small</b></h4><hr />
                            <h4>Product: <b>${pss?.productName}</b></h4><hr />
                            <h4>Quantity: <b>${pss?.quantity}</b></h4><hr />
                            <h4>Amount: <b>N${pss?.amount}</b> (NGN)</h4><hr />
                            <h4>Name: <b>${first_name+' '+last_name}</b></h4><hr />
                            <h4>Phone: <b>${user.phone}</b></h4><hr />
                            <h4>Email: <b>${email}</b></h4><hr />
                            <b>Our address for pick up is:</b><br />
                            Sure Imports, 5 Olutosin Ajayi (Martins Adegboyega) Street, Ajao Estate, Lagos, Nigeria. 0806 839 7263.<br /><br />
                            We are open 9am to 5pm weekdays except for public holidays.<br />
                            Thank you once more for choosing the SureImports Pay Small Small.<br /><br />
                            Kind regards,<br />
                            <b>Sure Imports Team</b>`;
      await xMail({
        xEmail: xEmail_A,
        xTitle: xTitle_A,
        xBodyTitle: xBodyTitle_A,
        xBody: xBody_A,
      });
      ////////////////////// SEND PAYMENT RECEIPT EMAIL BLOCK STARTS //////////////////////
    

    ////////////////////// SEND ADMIN PAYMENT EMAIL BLOCK STARTS //////////////////////
    //import { xMail } from '@/lib/email/xMail';
    // const xEmail_B = 'hello@sureimports.com';
    // const xTitle_B = `New Pay Small Small Purchase Successful!`;
    // const xBodyTitle_B = `Pay Small Small Purchase Successful!`;
    // const xBody_B = `Hi Admin, <br />A Pay Small Small order has been completed successfully on sureimports.com shop.</b><br />
    //                     Here are the details of the order: <br />
    //                     <h4>Order ID: <b>${pidProduct}</b></h4><hr />
    //                     <h4>Order Type: <b>Pay Small Small</b></h4><hr />
    //                     <h4>Customer name: <b>${first_name+' '+last_name}</b></h4><hr />
    //                     <h4>Phone Number: <b>${user?.phone}</b></h4><hr />
    //                     <h4>Product Name: <b>${pss?.productName}</b></h4><hr />
    //                     <h4>Quantity: <b>${pss?.quantity}</b></h4><hr />
    //                     <h4>Amount: <b>N${pss?.amount}</b> (NGN)</h4><hr />
    //                     <h4>Address: <b>${user?.address}</b></h4><hr />
    //                     Kind regards,<br />
    //                     Sureimports.com Automated System`;

    // await xMail({
    //   xEmail: xEmail_B,
    //   xTitle: xTitle_B,
    //   xBodyTitle: xBodyTitle_B,
    //   xBody: xBody_B,
    // });
    ////////////////////// SEND ADMIN PAYMENT EMAIL BLOCK STARTS //////////////////////


      
      console.log('Deleted successfully');
      return NextResponse.json(
       {
         statusx: 'SUCCESS',
         message: 'Debit Record was Successfully Created',
       },
       { status: 200 },
      );
    } else {
      //console.log('Failed to delete');
      return NextResponse.json(
        {
          statusx: 'FAILED',
          message: 'Debit Record was NOT Created',
        },
        { status: 200 },
      );
    }



}
