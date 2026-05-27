import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import Paysmallsmall from './components/Paysmallsmall';

export default async function PaySmallSmallPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  if (!id) {
    notFound();
  }

  // Server-side data fetching
  const product = await db.store.findUnique({
    where: {
      pidProduct: id,
    },
  });

  if (!product) {
    notFound();
  }

  // We return the child component directly. 
  // It completely handles its own premium layout, headers, and spacing.
  return <Paysmallsmall product={product} />;
}