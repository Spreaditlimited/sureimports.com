// app/api/upload/route.ts
import { PrismaClient } from '@prisma/client';
import { random } from 'lodash';
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
    const orders = await prisma.shipping_only.findMany({
      where: {
        pidUser: pidUser,
        status: statusx,
      },
      select: {
        id: true,
        pidShippingOnly: true,
        pidUser: true,
        whatsappNumber: true,
        shippingName: true,
        shippingTo: true,
        grossWeight: true,
        trackingNumber: true,
        shippingPlan: true,
        wantProductVerification: true,
        wantConsolidation: true,
        multipleSuppliers: true,
        description: true,
        status: true,
        createdAt: true,
      },
      orderBy: [
        { id: 'desc' },
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
