import { getShopProduct, getRelatedProducts } from '@/lib/shop/catalogue';
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

    const product = await getShopProduct(id);

    if (!product) {
      return NextResponse.json(
        {
          statusx: 'FAILED',
          message: 'Product not found',
        },
        { status: 404 },
      );
    }

    const relatedProducts = await getRelatedProducts(product);

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
      },
      { status: 500 },
    );
  }
}
