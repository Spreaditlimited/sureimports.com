import React from 'react';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/app/utils/jwt';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import PaySmallSmall from './components/PaySmallSmall';
//import ProductClaim from './components/ProductClaim';

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) => {
  const { status } = await searchParams;
  const statusz = status || 'SAVED'; // Default to 'SAVED' if no status is provided

  if (!statusz) {
    //notFound();
  }

  // Get cookies
  const cookieStore = cookies();
  const token = (await cookieStore).get('token')?.value; // replace 'token' with your actual cookie name

  if (!token) {
    // Handle case where user is not authenticated
    redirect('/login'); // or handle differently
  }

  // Verify token and get user ID
  let userId: string | null = null;
  try {
    const decoded = await verifyToken(token); // assuming verifyToken returns the decoded payload
    userId = decoded.pidUser; // adjust based on your JWT payload structure
  } catch (error) {
    // Handle invalid token
    redirect('/login');
  }

  if (!userId) {
    // Handle case where user ID couldn't be extracted
    notFound();
  }

  const product = await db.paysmallsmall.findMany({
    where: {
      pidUser: userId, // Now you can use the userId
      //status: statusz as any,
    },
    include: {
      store: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div>
      {/* <PaySmallSmall /> */}
      <div className="p-4 dark:bg-black">
        <div className="flex justify-between max-sm:flex-col">
          <div
            className="text-[28px] font-bold text-slate-800 dark:text-slate-200 max-sm:pb-4"
          >
            Pay Small Small
          </div>

        </div>

        <div className="mt-[7px] items-start justify-center gap-2 rounded-xl bg-white p-2 py-[10px] text-base font-normal text-slate-600 dark:bg-black dark:text-white max-sm:pl-4 md:flex-row">
        Manage your installment payments with ease
        </div>
        
      </div>
      <PaySmallSmall productx={product} status={statusz} />
      {/* <ProductClaim product={product} status={statusz} /> */}
    </div>
  );
};

export default Page;
