import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import ShopContent from './ShopContent';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Shop Phones, Laptops and Accessories',
  description:
    'Browse available phones, laptops and accessories from Sure Imports. Compare product specifications, condition, prices and minimum order quantities.',
  alternates: { canonical: 'https://www.sureimports.com/shop' },
  openGraph: {
    title: 'Shop Phones, Laptops and Accessories | Sure Imports',
    description:
      'Browse available products and compare specifications, condition and pricing.',
    url: 'https://www.sureimports.com/shop',
    images: ['https://www.sureimports.com/images/sure-imports-social-card.png'],
  },
};

export default async function ShopPage() {
  const where = { productVisibility: true };
  const [products, totalCount, categories] = await Promise.all([
    prisma.store.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: 24,
      select: {
        pidProduct: true,
        productName: true,
        productBrand: true,
        productPrice: true,
        productImage: true,
        productCategory: true,
        productCondition: true,
        productMOQ: true,
      },
    }),
    prisma.store.count({ where }),
    prisma.store.findMany({
      where,
      select: { productCategory: true },
      distinct: ['productCategory'],
    }),
  ]);
  return (
    <ShopContent
      initialData={{
        products: products.map((product) => ({
          ...product,
          productPrice:
            product.productPrice == null ? null : Number(product.productPrice),
        })),
        totalCount,
        categories: categories.flatMap((row) =>
          row.productCategory ? [row.productCategory] : [],
        ),
      }}
    />
  );
}
