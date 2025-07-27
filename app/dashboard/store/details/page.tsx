import React from 'react';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/app/utils/jwt';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import ProductDetails from '../components/ProductDetails';

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) => {
  const { id } = await searchParams;

  if (!id) {
    notFound();
  }

  const product = await db.store.findUnique({
    where: {
      pidProduct: id,
      //productCategory: { contains: 'example.com' },
      //posts: { some: { published: true } }
    },
    //orderBy: { createdAt: 'desc' },
    // skip: 10,
    // take: 5,
    //include: { posts: true } // Include relations
  });

  if (!product) {
    notFound();
  }

  return (
    <div>
      <ProductDetails product={product} />
    </div>
  );
};

export default Page;
