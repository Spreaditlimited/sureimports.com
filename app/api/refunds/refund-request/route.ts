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
  const userEmail = request.nextUrl.searchParams.get('email') as any;
  //const refundAmount = request.nextUrl.searchParams.get('refundAmount') as any;

  //refund amount less 2.5% inconvenience fee
  // const refundAmountx = (parseFloat(refundAmount) * -1) - (2.5/100 * (parseFloat(refundAmount) * -1));
  // const pidRefundx = 'RFND' + randomGenerator(15);

  const refunds_total = await prisma.refund_records.findMany({
    where: {
      pidUser: pidUser,
      refundStatus: 'pending',
    },
  });

  //Check if the user has an existing refund request pending
  if (refunds_total.length <= 0) {
    return NextResponse.json(
      {
        statusx: 'FAILED',
        message: 'You have no refunds for processing at this time.',
      },
      { status: 200 },
    );
  }

  try {
    //UPDATE REFUND STATUS
    const updatex = await prisma.refund_records.updateMany({
      where: {
        pidUser: pidUser,
      },
      data: {
        refundStatus: 'requested',
        updatedAt: new Date(),
      },
    });

    if (updatex) {
      return NextResponse.json(
        {
          statusx: 'SUCCESS',
          message:
            'Your Refund Request has been placed, pending admin processing and disbursement.',
        },
        { status: 200 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        statusx: 'FAILED',
        message: 'Failed to process request - Error:' + error,
      },
      { status: 200 },
    );
  } finally {
    await prisma.$disconnect();
  }

  //END
}
