'use client';

import type { MouseEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useShopCart } from '@/app/context/ShopCartContext';

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  priceNGN: number;
  image: string;
  category: string;
}

export default function ProductCard({
  id,
  name,
  brand,
  priceNGN,
  image,
  category,
}: ProductCardProps) {
  const { addToCart, isInCart } = useShopCart();
  const formatCurrency = (val: number) =>
    val.toLocaleString('en-NG', { minimumFractionDigits: 0 });
  const inCart = isInCart(id);

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCart) return;
    addToCart({
      pidProduct: id,
      productName: name,
      productPrice: priceNGN,
      productImage: image,
      productBrand: brand,
      productCategory: category,
    });
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <Link
        href={`/shop/${id}`}
        className="relative aspect-square w-full overflow-hidden bg-slate-50 p-6 dark:bg-slate-800/50"
      >
        <div className="absolute left-4 top-4 z-10">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-slate-700 backdrop-blur-sm dark:bg-slate-900/90 dark:text-slate-300">
            <Plane className="h-3 w-3 text-indigo-500" /> 10-Day Ship
          </span>
        </div>
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105 dark:mix-blend-normal"
        />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {brand}
          </span>
          <span className="text-[10px] font-semibold text-slate-500">
            {category}
          </span>
        </div>

        <Link href={`/shop/${id}`}>
          <h3 className="mb-4 line-clamp-2 text-lg font-bold leading-tight text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
            {name}
          </h3>
        </Link>

        <div className="mt-auto flex items-end justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
          <div>
            <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Wholesale Price
            </p>
            <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">
              ₦{formatCurrency(priceNGN)}
            </p>
          </div>
          <Button
            size="icon"
            onClick={handleAddToCart}
            disabled={inCart}
            className="h-10 w-10 shrink-0 rounded-xl bg-slate-100 text-slate-600 transition-all hover:bg-brand-orange-500 hover:text-white dark:bg-slate-800 dark:text-slate-300"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
