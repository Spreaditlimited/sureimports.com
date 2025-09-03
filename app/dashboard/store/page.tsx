import React from 'react';
import StoreComponent from './components/StoreComponent';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/app/utils/jwt';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';

const DashBoard = async ({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; id2?: string }>;
}) => {
  const { id, id2 } = await searchParams;
  if (!id) {
    notFound();
  }

  const categories = await db.store.findMany({
    select: {
      productCategory: true, // Replace with your column name
    },
    distinct: ['productCategory'], // Ensures unique categories
  });

  const brands = await db.store.findMany({
    where: {
      productCategory: id,
      //productBrand: id2,
      //productCategory: { contains: 'example.com' },
      //posts: { some: { published: true } }
    },
    select: {
      productBrand: true, // Replace with your column name
    },
    distinct: ['productBrand'], // Ensures unique categories
  });

  const products = await db.store.findMany({
    where: {
      productCategory: id,
      productBrand: id2,
      //productCategory: { contains: 'example.com' },
      //posts: { some: { published: true } }
    },
    orderBy: { createdAt: 'desc' },
    // skip: 10,
    // take: 5,
    //include: { posts: true } // Include relations
  });

  if (!products) {
    notFound();
  }

  return (
    <div>
            <div className="p-4 dark:bg-black">
        <div className="flex justify-between max-sm:flex-col">
          <div
            className="text-[28px] font-bold text-slate-800 dark:text-slate-200 max-sm:pb-4"
          >
            Buy Phones and Laptops
          </div>

        </div>

        <div className="mt-[7px] items-start justify-center gap-2 rounded-xl bg-white p-2 py-[10px] text-base font-normal text-slate-600 dark:bg-black dark:text-white max-sm:pl-4 md:flex-row">
        Every phone from Sure Imports comes sealed in its original box, complete with all accessories, and includes a one-year warranty for your peace of mind. Laptops are pre-owned and come with a bag and charger and a 3-month warranty
        </div>
      </div>
      <StoreComponent
        products={products}
        categories={categories}
        brands={brands}
        id={id}
        id2={id2}
      />
    </div>
  );
};

export default DashBoard;
