import React from 'react';
import StoreComponent from './components/StoreComponent';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';

const DashBoard = async ({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; id2?: string; q?: string }>;
}) => {
  const { id, id2, q } = await searchParams;
  if (!id) {
    notFound();
  }

  const searchTerms = (q || '')
    .split(/\s+/)
    .map((term) => term.trim())
    .filter(Boolean);

  const searchOr =
    searchTerms.length > 0
      ? searchTerms.flatMap((term) => [
          { productName: { contains: term } },
          { productBrand: { contains: term } },
          { productCategory: { contains: term } },
          { productDescription: { contains: term } },
        ])
      : undefined;

  // Fetch categories (always, as they are needed for filters)
  const categories = await db.store.findMany({
    select: {
      productCategory: true,
    },
    distinct: ['productCategory'],
  });

  // Fetch brands based on category (and optionally q if you want to filter brands by search)
  const brands = await db.store.findMany({
    where: {
      productCategory: id !== 'all' ? id : undefined, // If id is 'all', don't filter by category for brands
      ...(searchOr ? { OR: searchOr } : {}),
    },
    select: {
      productBrand: true,
    },
    distinct: ['productBrand'],
  });

  // Fetch products based on category, brand, and search
  const products = await db.store.findMany({
    where: {
      ...(id !== 'all' && { productCategory: id }),
      ...(id2 !== 'all' && { productBrand: id2 }),
      ...(searchOr ? { OR: searchOr } : {}),
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!products) {
    notFound();
  }

  return (
    <div>
      <div className="p-4 dark:bg-black">
        <div className="flex justify-between max-sm:flex-col">
          <div className="text-[28px] font-bold text-slate-800 dark:text-slate-200 max-sm:pb-4">
            Buy Phones and Laptops
          </div>
        </div>

        <div className="mt-[7px] items-start justify-center gap-2 rounded-xl bg-white p-2 py-[10px] text-base font-normal text-slate-600 dark:bg-black dark:text-white max-sm:pl-4 md:flex-row">
          Every phone from Sure Imports comes sealed in its original box,
          complete with all accessories, and includes a one-year warranty for
          your peace of mind. Laptops are pre-owned and come with a bag and
          charger and a 3-month warranty
        </div>
      </div>
      <StoreComponent
        products={products}
        categories={categories}
        brands={brands}
        id={id}
        id2={id2}
        q={q} // Pass q to StoreComponent if needed for state
      />
    </div>
  );
};

export default DashBoard;
