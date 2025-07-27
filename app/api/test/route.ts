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
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();
const PAYSTACK_SECRET_KEY = process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY;

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const reference = 'PS_1751191714636'; // Replace with actual reference for testing

  //const { reference } = req.body;

  console.log('TEST BOX!!!!!!!!!!!!!------------------------------');

  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    },
  );

  const data = await response.json();

  if (!data.status) {
    return res.status(400).json({
      status: false,
      message: data.message || 'Payment verification failed',
    });
  }

  const paymentData = data.data;

  console.log(
    'TEST CIRCLE!!!!!!!!!!!!!------------------------------' + response.ok,
  ); //return;
  console.log(
    'TEST TRIANGLE!!!!!!!!!!!!!------------------------------' + data,
  ); //return;
  console.log(
    'TEST RECTANGLE!!!!!!!!!!!!!------------------------------' +
      paymentData.amount,
  ); //return;
  console.log(
    'TEST RECTANGLE!!!!!!!!!!!!!------------------------------' +
      paymentData.channel,
  ); //return;
}
