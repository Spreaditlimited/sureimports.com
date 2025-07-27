'use server';

import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Assuming you have Prisma setup in `lib/prisma.ts`

export type ProductData = {
  id: number;
  pidUser: string;
  pidProduct: string;
  pidOrder: string;
  productName: string;
  productLink: string;
  productCategory: string;
  productPrice: string;
  productWeight: string;
  productQuantity: string;
  productInfo: string;
  createdAt: string;
  // Add other fields from your schema
};

export type GetResult = {
  data: ProductData | null;
  error: string | null;
};

export async function getProduct(
  pidUser: string,
  pidProduct: string,
): Promise<GetResult> {
  try {
    const product = await prisma.products.findUnique({
      where: { pidUser: pidUser, pidProduct: pidProduct },
      select: {
        id: true,
        pidUser: true,
        pidProduct: true,
        pidOrder: true,
        productName: true,
        productLink: true,
        productCategory: true,
        productPrice: true,
        productWeight: true,
        productQuantity: true,
        productInfo: true,
        createdAt: true,
        // Add other fields you want to select
      },
    });

    if (!product) {
      return {
        data: null,
        error: 'User not found',
      };
    }

    // Revalidate the product page and the specific user page
    revalidatePath('/dashboard');
    revalidatePath(`dashboard/procurement/edit-product/${pidProduct}`);

    return {
      data: product as any,
      error: null,
    };
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return {
      data: null,
      error: 'Failed to fetch user',
    };
  }
}
