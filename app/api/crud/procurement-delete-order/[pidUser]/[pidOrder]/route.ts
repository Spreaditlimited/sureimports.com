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
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pidUser: string; pidOrder: string }> },
) {
  const { pidUser, pidOrder } = await params;

  // const responsex = {
  //   message: 'TEST DELETE!!!!!!!!!!!!!------------------------------',
  //   status: 'SUCCESS',
  // };
  // return NextResponse.json(
  //   { responsex, successx: true, userx: null },
  //   { status: 200 },
  // );

  try {
    const deleteOrder = await prisma.orders.deleteMany({
      where: {
        pidUser: pidUser,
        pidOrder: pidOrder,
        //status: 'saved',
      },
    });

    const deleteProduct = await prisma.products.deleteMany({
      where: {
        pidUser: pidUser,
        pidOrder: pidOrder,
        //status: 'saved',
      },
    });

    if (deleteOrder.count > 0) {
      //redirect("/dashboard/procurement");
      //revalidatePath('/dashboard/procurement');
      const responsex = {
        message: 'Order was successfully deleted!',
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
