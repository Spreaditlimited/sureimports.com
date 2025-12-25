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
  { params }: { params: Promise<{ pidUser: string; pidSpecialSourcing: string }> },
) {
  try {
    const { pidUser, pidSpecialSourcing } = await params;
    const deletedProduct = await prisma.special_sourcing.deleteMany({
      where: {
        pidUser: pidUser,
        pidSpecialSourcing: pidSpecialSourcing,
        status: 'pending',
      },
    });

    if (deletedProduct.count > 0) {
      const responsex = {
        message: 'Request was successfully deleted!',
        status: 'SUCCESS',
      };
      return NextResponse.json(
        { responsex, successx: true, userx: null },
        { status: 200 },
      );
    } else {
      const responsex = {
        message: 'You are not allowed to delete this product',
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
      message: 'You are not allowed to delete this product',
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
