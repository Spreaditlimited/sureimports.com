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
