import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          statusx: 'FAILED',
          message: 'Product ID is required',
        },
        { status: 400 },
      );
    }

    // Fetch product by pidProduct
    const product = await prisma.store.findUnique({
      where: {
        pidProduct: id,
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          statusx: 'FAILED',
          message: 'Product not found',
        },
        { status: 404 },
      );
    }

    // Fetch related products (same category, different product)
    const relatedProducts = await prisma.store.findMany({
      where: {
        productCategory: product.productCategory,
        pidProduct: {
          not: id,
        },
        productVisibility: true,
      },
      take: 4,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(
      {
        statusx: 'SUCCESS',
        message: 'Product fetched successfully',
        data: {
          product,
          relatedProducts,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Fetch product error:', error);
    return NextResponse.json(
      {
        statusx: 'FAILED',
        message: 'Internal server error occurred while fetching product',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
