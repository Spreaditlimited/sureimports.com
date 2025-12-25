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
  { params }: { params: Promise<{ pidUser: string; pidOrder: string }> },
) {
  try {
    const { pidUser, pidOrder } = await params;
    const products = await prisma.products.findMany({
      where: {
        pidUser: pidUser,
        pidOrder: pidOrder,
      },
      select: {
        id: true,
        pidUser: true,
        pidProduct: true,
        pidOrder: true,
        productName: true,
        productLink: true,
        productCategory: true,
        productPrice: true,
        productWeight: true,
        productQuantity: true,
        productInfo: true,
        createdAt: true,
      },
      orderBy: [
        { id: 'asc' },
        //{ createdAt: 'asc' },
      ],
    });

    if (!products) {
      return NextResponse.json(
        { error: 'Products not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
