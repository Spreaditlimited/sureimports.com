'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Eye } from 'lucide-react';
import { useShopCart } from '@/app/context/ShopCartContext';
import { resolveMediaUrl } from '@/lib/cloudinary/url';

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addToCart, isInCart } = useShopCart();

  const imageUrl = resolveMediaUrl(product.productImage)
    || '/placeholder.svg?height=240&width=320';

  const handleViewDetails = () => {
    router.push(`/dashboard/shop/${product.pidProduct}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
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
    <div className="group relative overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:shadow-md dark:border-border dark:bg-card">
      {/* Product Image */}
      <div
        className="relative h-60 w-full cursor-pointer overflow-hidden bg-gray-100 dark:bg-gray-800"
        onClick={handleViewDetails}
      >
        <Image
          src={imageUrl}
          alt={product.productName || 'Product'}
          fill
          className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />

        {/* Category Badge */}
        {product.productCategory && (
          <div className="absolute left-2 top-2 rounded-md bg-indigo-600 px-2 py-1 text-xs font-medium text-white">
            {product.productCategory.toUpperCase()}
          </div>
        )}

        {/* Brand Badge */}
        {product.productBrand && (
          <div className="absolute right-2 top-2 rounded-md bg-slate-800/80 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {product.productBrand.toUpperCase()}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3
          className="mb-2 line-clamp-2 cursor-pointer text-lg font-semibold text-foreground hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400"
          onClick={handleViewDetails}
        >
          {product.productName}
        </h3>

        {product.productDescription && (
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground dark:text-gray-400">
            {product.productDescription}
          </p>
        )}

        {/* Price */}
        <div className="mb-4 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            ₦{product.productPrice?.toLocaleString() || '0'}
          </span>
          {product.productMOQ && product.productMOQ > 1 && (
            <span className="text-xs text-muted-foreground dark:text-gray-400">
              MOQ: {product.productMOQ}
            </span>
          )}
        </div>

        {/* Warranty Info */}
        {product.warrantyPeriod && (
          <div className="mb-3 text-xs text-muted-foreground dark:text-gray-400">
            Warranty: {product.warrantyPeriod}
          </div>
        )}

        {/* Condition */}
        {product.productCondition && (
          <div className="mb-3">
            <span
              className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                product.productCondition === 'NEW'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
              }`}
            >
              {product.productCondition}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleViewDetails}
            variant="outline"
            className="flex-1 rounded-lg border-gray-300 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
          <Button
            onClick={handleAddToCart}
            className="flex-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
            disabled={isInCart(product.pidProduct)}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isInCart(product.pidProduct) ? 'In Cart' : 'Add'}
          </Button>
        </div>
      </div>
    </div>
  );
}
