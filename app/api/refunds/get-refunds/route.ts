// app/api/upload/route.ts
import { PrismaClient } from '@prisma/client';
import { random } from 'lodash';
import { getR2Client } from '@/app/utils/r2Client';
import { Upload } from '@aws-sdk/lib-storage';
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

  try {
    const refunds_total = await prisma.refund_records.findMany({
      where: {
        pidUser: pidUser,
        refundStatus: 'pending',
      },
    });

    return NextResponse.json(
      {
        statusx: 'SUCCESS',
        message: 'Refunds fetched successfully',
        data: refunds_total,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        statusx: 'FAILED',
        message: 'Failed to process request - Error:' + error,
        data: [],
      },
      { status: 200 },
    );
  } finally {
    await prisma.$disconnect();
  }

  //END
}
