// app/api/upload/route.ts
import { PrismaClient } from '@prisma/client';
import { random } from 'lodash';
import { getR2Client } from '@/app/utils/r2Client';
import { Upload } from '@aws-sdk/lib-storage';
import getFileExt from '@/app/utils/fileExt';
import fileFilter from '@/utils/fileFilter';
import randomGenerator from '@/lib/helpers/randomGenerator';
import { NextRequest, NextResponse } from 'next/server';
import { generateSlug } from '@/utils/slugGenerator';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const pidUser = request.nextUrl.searchParams.get('pidUser');
  const pidOrder = request.nextUrl.searchParams.get('pidOrder');

  try {
    //UPDATE SERVICE STATUS
    const updatex = await prisma.orders.update({
      where: {
        pidUser: pidUser as string,
        pidOrder: pidOrder as string,
      },
      data: {
        status: 'cancelled',
        updatedAt: new Date(),
      },
    });

    if (updatex) {
      const responsex = {
        message: 'Order was successfully cancelled!',
        status: 'SUCCESS',
      };
      return NextResponse.json(
        { responsex, successx: true, userx: null },
        { status: 200 },
      );
    } else {
      const responsex = {
        message: 'You are not allowed to cancel this product',
        status: 'FAILED',
      };
      return NextResponse.json(
        { responsex, successx: true, userx: null },
        { status: 200 },
      );
    }
  } catch (error) {
    // return NextResponse.json(
    //   { error: 'Failed to fetch user' },
    //   { status: 500 },
    // );
    const responsex = {
      message: 'You are not allowed to cancel this product',
      status: 'FAILED',
    };
    return NextResponse.json(
      { responsex, successx: true, userx: null },
      { status: 401 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
