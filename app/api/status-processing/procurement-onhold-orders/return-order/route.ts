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

    return NextResponse.json(
      {
        statusx: 'SUCCESS',
        message:
          'Order was successfully moved to pending for admin processing.',
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
