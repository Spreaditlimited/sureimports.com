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
      {/* <div className="bg-slate-100 dark:bg-slate-800"> */}
      <div className="p-4 dark:bg-black">
        <div className="flex justify-between max-sm:flex-col">
          <div className="text-[28px] font-bold text-slate-800 dark:text-slate-200 max-sm:pb-4">
            Refunds
          </div>
        </div>

        <div className="mt-[7px] items-start justify-center gap-2 rounded-xl bg-white p-2 py-[10px] text-base font-normal text-slate-600 dark:bg-black dark:text-white max-sm:pl-4 md:flex-row">
          Track Refunds & Requests across all services
        </div>
      </div>
      {/* <div className="flex flex-col pl-6 pt-6 text-[28px] font-bold text-slate-800 dark:text-white lg:flex-row lg:items-center lg:gap-3">
          Refunds
          <p className="text-base font-normal text-slate-800 dark:text-slate-400">
          Track Refunds & Requests across all services
          </p>
        </div> */}

      {/* <div className="container mx-auto p-4"> */}
      <RefundsPage records={records} />
      {/* </div> */}

      {/* </div> */}
    </>
  );
}

//export default Page;
