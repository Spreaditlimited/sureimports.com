// app/api/upload/route.ts
import { PrismaClient } from '@prisma/client';
import { random } from 'lodash';
import getFileExt from '@/app/utils/fileExt';
import randomGenerator from '@/lib/helpers/randomGenerator';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Function to handle GET requests for moving an order to pending status from on-hold status
export async function GET(request: NextRequest) {
  const pidUser = request.nextUrl.searchParams.get('pidUser') as any;
  const pidOrder = request.nextUrl.searchParams.get('pidOrder') as any;
  const refundAmount = request.nextUrl.searchParams.get('refundAmount') as any;

  //refund amount less 2.5% inconvenience fee
  const refundAmountx =
    parseFloat(refundAmount) * -1 -
    (2.5 / 100) * (parseFloat(refundAmount) * -1);
  const pidRefundx = 'RFND' + randomGenerator(15);

  try {
    //UPDATE SERVICE STATUS
    const updatex = await prisma.orders.update({
      where: {
        pidUser: pidUser,
        pidOrder: pidOrder,
      },
      data: {
        status: 'pending',
        updatedAt: new Date(),
      },
    });

    //CREATE REFUND RECORD
    const refund = await prisma.refund_records.create({
      data: {
        pidRefund: pidRefundx,
        pidUser: pidUser,
        pidOrder: pidOrder,
        amount: refundAmountx.toString(),
        //currency: 'USD',
        refundStatus: 'pending',
        serviceType: 'PROCUREMENT',
        // ext1: 'refund',
        // ext2: 'pending',
        // xStatus: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        statusx: 'SUCCESS',
        message:
          'Your Refund record has been updated and the Order was successfully moved to pending for admin processing.',
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        statusx: 'FAILED',
        message: 'Failed to delete admin user Error:' + error,
      },
      { status: 200 },
    );
  } finally {
    await prisma.$disconnect();
  }

  //END
}
