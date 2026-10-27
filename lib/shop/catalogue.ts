import 'server-only';
import { cache } from 'react';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { shopSearchPatterns } from './search';
import { SHOP_PAGE_SIZE, type ShopProduct, type ShopQuery } from './discovery';

// Only public merchandising fields cross the server/client boundary.
export const publicProductSelect = {
  pidProduct: true,
  productName: true,
  productBrand: true,
  productPrice: true,
  productImage: true,
  productCategory: true,
  productCondition: true,
  productMOQ: true,
  productStatus: true,
  productDescription: true,
  productFeature: true,
  productSpecification: true,
  warrantyPeriod: true,
} satisfies Prisma.storeSelect;
const publicCardSelect = {
  pidProduct: true,
  productName: true,
  productBrand: true,
  productPrice: true,
  productImage: true,
  productCategory: true,
  productCondition: true,
  productMOQ: true,
  productStatus: true,
} satisfies Prisma.storeSelect;

export const getShopProduct = cache(
  async (id: string): Promise<ShopProduct | null> =>
    prisma.store.findFirst({
      where: { pidProduct: id, productVisibility: true },
      select: publicProductSelect,
    }),
);

export async function getRelatedProducts(product: ShopProduct) {
  return prisma.store.findMany({
    where: {
      productVisibility: true,
      productCategory: product.productCategory,
      pidProduct: { not: product.pidProduct },
    },
    select: publicCardSelect,
    take: 4,
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
  });
}

export async function getShopListing(query: ShopQuery) {
  const where: Prisma.storeWhereInput = { productVisibility: true };
  if (query.category && query.category !== 'all')
    where.productCategory = query.category;
  const patterns = shopSearchPatterns(query.q);
  if (patterns.length) {
    const matches = await prisma.$queryRaw<{ id: number }[]>(Prisma.sql`
      SELECT id FROM store WHERE productVisibility = true AND
      ${Prisma.join(
        patterns.map(
          (pattern) =>
            Prisma.sql`LOWER(CONCAT_WS(' ', productName, productBrand, productCategory)) REGEXP ${pattern}`,
        ),
        ' AND ',
      )}
    `);
    where.id = { in: matches.map(({ id }) => id) };
  }
  const [products, totalCount, categories] = await Promise.all([
    prisma.store.findMany({
      where,
      select: publicCardSelect,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip: (query.page - 1) * SHOP_PAGE_SIZE,
      take: SHOP_PAGE_SIZE,
    }),
    prisma.store.count({ where }),
    prisma.store.findMany({
      where: { productVisibility: true },
      distinct: ['productCategory'],
      select: { productCategory: true },
      orderBy: { productCategory: 'asc' },
    }),
  ]);
  return {
    products,
    totalCount,
    categories: categories.flatMap((row) =>
      row.productCategory ? [row.productCategory] : [],
    ),
  };
}
