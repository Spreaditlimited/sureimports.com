'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Check, Sparkles } from 'lucide-react';
import { useShopCart } from '@/app/context/ShopCartContext';
import { resolveMediaUrl } from '@/lib/cloudinary/url';

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addToCart, isInCart } = useShopCart();

  const imageUrl = resolveMediaUrl(product.productImage) || '/placeholder.svg?height=240&width=320';
  const inCart = isInCart(product.pidProduct);

  const handleViewDetails = () => {
    router.push(`/dashboard/shop/${product.pidProduct}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inCart) return;
    
    addToCart({
      pidProduct: product.pidProduct,
      productName: product.productName,
      productPrice: product.productPrice,
      productImage: imageUrl,
      productBrand: product.productBrand,
      productCategory: product.productCategory,
    });
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
      
      {/* Product Image Area */}
      <div
        className="relative aspect-[4/3] w-full cursor-pointer overflow-hidden bg-slate-50 dark:bg-slate-800/50"
        onClick={handleViewDetails}
      >
        <Image
          src={imageUrl}
          alt={product.productName || 'Product'}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105 mix-blend-multiply dark:mix-blend-normal"
        />

        {/* Minimalist Condition Badge */}
        {product.productCondition && (
          <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm backdrop-blur-md dark:bg-slate-900/90 dark:text-white">
            {product.productCondition === 'NEW' ? (
              <Sparkles className="h-3 w-3 text-blue-600" />
            ) : (
              <span className="h-2 w-2 rounded-full bg-blue-600" />
            )}
            {product.productCondition}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col p-6">
        
        {/* Metadata Row */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <span
            className="line-clamp-2 flex-1 break-words text-[10px] font-black uppercase tracking-widest text-slate-400"
            title={product.productBrand || product.productCategory || 'Device'}
          >
            {product.productBrand || product.productCategory || 'Device'}
          </span>
          {product.warrantyPeriod && (
            <span className="shrink-0 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {product.warrantyPeriod} WTY
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          className="cursor-pointer break-words text-base font-bold leading-snug text-slate-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
          onClick={handleViewDetails}
          title={product.productName}
        >
          {product.productName}
        </h3>

        <div className="mt-auto pt-6">
          {/* Price & MOQ */}
          <div className="mb-4 flex items-end justify-between">
            <div>
              <span className="text-2xl font-black tracking-tight text-blue-600 dark:text-blue-400">
                ₦{product.productPrice?.toLocaleString() || '0'}
              </span>
              {product.productMOQ && product.productMOQ > 1 && (
                <span className="mt-1 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Min. Qty: {product.productMOQ}
                </span>
              )}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleAddToCart}
            disabled={inCart}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-bold transition-all ${
              inCart
                ? 'cursor-not-allowed bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                : 'bg-slate-900 text-white shadow-md hover:bg-blue-600 dark:bg-white dark:text-slate-900 dark:hover:bg-blue-500'
            }`}
          >
            {inCart ? (
              <>
                <Check className="h-4 w-4" />
                Added to Cart
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
