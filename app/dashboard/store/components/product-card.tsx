'use client';

import Image from 'next/image';
import { Eye, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  id: string;
  pidProduct: string;
  name: string;
  description: string;
  price: number;
  currency?: string;
  image: string;
  category?: string;
  rating?: number;
  onViewDetails?: (pidProduct: string) => void;
  onAddToCart?: (pidProduct: string) => void;
}

export default function ProductCard({
  id,
  pidProduct,
  name,
  description,
  price,
  currency = '₦',
  image,
  category = 'Product',
  rating = 0,
  onViewDetails = () => {},
  onAddToCart = () => {},
}: ProductCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:shadow-md dark:border-border dark:bg-card">
      {/* Product Image */}
      <div className="relative h-60 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        <Image
          src={image || '/placeholder.svg?height=240&width=320'}
          alt={name}
          fill
          className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
        {category && (
          <span className="absolute left-2 top-2 rounded-full bg-primary/90 px-2 py-0.5 text-xs font-medium text-primary-foreground shadow-2xl">
            {category}
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4">
        <h3 className="mb-1 line-clamp-1 text-lg font-medium text-foreground text-gray-900 dark:text-white">
          {name}
        </h3>
        <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
          {description}
        </p>

        {/* Price */}
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xl font-bold text-foreground text-gray-900 dark:text-white">
            {currency}

            {
              parseFloat(price as any)
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
            }
          </span>

          {rating > 0 && (
            <div className="flex items-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-4 w-4 ${i < rating ? 'fill-yellow-400' : 'fill-gray-300 dark:fill-gray-600'}`}
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 dark:bg-slate-700 dark:text-white"
            onClick={() => onViewDetails(pidProduct)}
          >
            <Eye className="mr-2 h-4 w-4" />
            Details
          </Button>

          <Button
            size="sm"
            className="flex-1"
            onClick={() => onAddToCart(pidProduct)}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Buy
          </Button>
        </div>
      </div>
    </div>
  );
}
