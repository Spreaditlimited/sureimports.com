// app/api/upload/route.ts
import { PrismaClient } from '@prisma/client';
import { random } from 'lodash';
import getFileExt from '@/app/utils/fileExt';
import fileFilter from '@/utils/fileFilter';
import randomGenerator from '@/lib/helpers/randomGenerator';
import { NextRequest, NextResponse } from 'next/server';
import { generateSlug } from '@/utils/slugGenerator';
import { requireProcurementUser } from '@/lib/procurement/assistance';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const pidOrder = request.nextUrl.searchParams.get('pidOrder');
  const user = await requireProcurementUser();
  if (!user) return NextResponse.json({ responsex: { message: 'Unauthorized', status: 'FAILED' }, successx: false }, { status: 401 });

  try {
    //UPDATE SERVICE STATUS
    const updatex = await prisma.orders.update({
      where: {
        pidUser: user.pidUser,
        pidOrder: pidOrder as string,
        status: { not: 'merged' },
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
  } finally {}
}
