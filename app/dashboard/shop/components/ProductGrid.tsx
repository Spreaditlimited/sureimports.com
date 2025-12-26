'use client';

import React from 'react';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: any[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid gap-5 rounded-xl bg-slate-200 p-2 dark:bg-slate-700 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.pidProduct} product={product} />
      ))}
    </div>
  );
}
