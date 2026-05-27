//'use client';
import React, { useState } from 'react';
import { PrismaClient } from '@prisma/client';
import { Metadata } from 'next';
import { checkAuth } from '@/lib/auth/checkAuth';
import { getUser } from '@/lib/auth/auth';
import { notFound, redirect } from 'next/navigation';
import RefundsPage from './components/RefundsPage';

const prisma = new PrismaClient();

let titlex = 'Dashboard: Refunds';
let descriptionx =
  'Import from China. We guarantee the quality and accuracy of every product we source for you from China.';
export const metadata: Metadata = {
  title: titlex,
  description: descriptionx,
  openGraph: {
    title: titlex,
    description: descriptionx,
    images: [
      {
        url: 'https://www.sureimports.com/images/svg-logo-white.svg',
        width: 1200,
        height: 630,
        alt: 'Sure Imports',
      },
    ],
  },
};

export default async function RefundRecordsPage() {
  // const Page = async ({
  //   searchParams,
  // }: {
  //   searchParams: Promise<{ status?: string }>;
  // }) => {

  //     const { status } = await searchParams;

  //     if (!status) {
  //       notFound();
  //     }

  // Check if the user is authenticated
  // const check = await checkAuth();
  // if (!check) {
  //   redirect('/auth/login');
  // }
  const user = (await getUser()) as any;

  const records: any = await prisma.refund_records.findMany({
    where: {
      pidUser: user.pidUser,
      //refundStatus: status,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  //const records = await getRefundRecords();

  return (
    <>
      <RefundsPage records={records} />
    </>
  );
}

//export default Page;
