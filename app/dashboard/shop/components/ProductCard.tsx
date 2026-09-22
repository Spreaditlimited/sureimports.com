'use client';

import { usePathname } from 'next/navigation';
import ShopProductCard from '@/components/shop/ProductCard';
import { resolveMediaUrl } from '@/lib/cloudinary/url';

interface Product {
  pidProduct: string;
  productName?: string | null;
  productBrand?: string | null;
  productCategory?: string | null;
  productImage?: string | null;
  productPrice?: number | null;
  productCondition?: string | null;
  productMOQ?: number | null;
}

export default function ProductCard({ product }: { product: Product }) {
  const pathname = usePathname();
  return (
    <ShopProductCard
      id={product.pidProduct}
      name={product.productName || 'Product'}
      brand={product.productBrand || ''}
      category={product.productCategory || ''}
      image={resolveMediaUrl(product.productImage) || ''}
      priceNGN={Number(product.productPrice || 0)}
      condition={product.productCondition}
      minimumQuantity={product.productMOQ}
      basePath={pathname?.startsWith('/shop') ? '/shop' : '/dashboard/shop'}
      openCartOnAdd={false}
    />
  );
}
