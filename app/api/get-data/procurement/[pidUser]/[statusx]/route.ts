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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pidUser: string; statusx: string }> },
) {
  try {
    const { pidUser, statusx } = await params;
    const orders = await prisma.orders.findMany({
      where: {
        pidUser: pidUser,
        status: statusx,
      },
      select: {
        id: true,
        pidOrder: true,
        pidUser: true,
        orderName: true,
        destinationCountry: true,
        currencyType: true,
        shippingPlan: true,
        orderCategory: true,
        shippingAddress: true,
        status: true,
        createdAt: true,
      },
      orderBy: [
        { id: 'asc' },
        //{ createdAt: 'asc' },
      ],
    });

    if (!orders) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
