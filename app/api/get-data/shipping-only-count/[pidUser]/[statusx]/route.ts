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
    const requestReceivedOrder: number = await prisma.shipping_only.count({
      where: {
        pidUser: pidUser,
        status: 'request-received',
      },
    });

    const productShippedOrder: number = await prisma.shipping_only.count({
      where: {
        pidUser: pidUser,
        OR: [{ status: 'product-shipped' }, { status: 'ready-to-ship' }],
      },
    });

    const productArrivedOrder: number = await prisma.shipping_only.count({
      where: {
        pidUser: pidUser,
        status: 'product-arrived',
      },
    });

    const invoicedOrder: number = await prisma.shipping_only.count({
      where: {
        pidUser: pidUser,
        status: 'invoiced',
      },
    });

    const paidOrder: number = await prisma.shipping_only.count({
      where: {
        pidUser: pidUser,
        status: 'paid',
      },
    });

    const productDeliveredOrder: number = await prisma.shipping_only.count({
      where: {
        pidUser: pidUser,
        status: 'product-delivered',
      },
    });

    const cancelledRequestOrder: number = await prisma.shipping_only.count({
      where: {
        pidUser: pidUser,
        OR: [{ status: 'request-cancelled' }, { status: 'cancelled-request' }],
      },
    });

    console.log(
      '...........................................' + requestReceivedOrder,
    );
    return NextResponse.json(
      {
        requestReceivedOrder: requestReceivedOrder,
        productShippedOrder: productShippedOrder,
        productArrivedOrder: productArrivedOrder,
        invoicedOrder: invoicedOrder,
        paidOrder: paidOrder,
        productDeliveredOrder: productDeliveredOrder,
        cancelledRequestOrder: cancelledRequestOrder,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
