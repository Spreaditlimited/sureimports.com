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

  // Keep active payment snapshots, but remove stale SAVED entries when
  // the linked store product has been deleted.
  const staleSavedRows = await db.paysmallsmall.findMany({
    where: {
      pidUser: userId,
      status: 'SAVED',
    },
    select: {
      id: true,
      pidProduct: true,
      store: {
        select: {
          id: true,
        },
      },
    },
  });

  const staleSavedIds = staleSavedRows
    .filter((row) => !row.pidProduct || !row.store)
    .map((row) => row.id);

  if (staleSavedIds.length > 0) {
    await db.paysmallsmall.deleteMany({
      where: {
        id: {
          in: staleSavedIds,
        },
      },
    });
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
      <PaySmallSmall productx={product} status={statusz} />
      {/* <ProductClaim product={product} status={statusz} /> */}
    </div>
  );
};

export default Page;
