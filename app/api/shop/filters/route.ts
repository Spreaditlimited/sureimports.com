import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Fetch distinct categories
    const categories = await prisma.store.findMany({
      where: {
        productVisibility: true,
      },
      select: {
        productCategory: true,
      },
      distinct: ['productCategory'],
    });

    // Fetch distinct brands
    const brands = await prisma.store.findMany({
      where: {
        productVisibility: true,
      },
      select: {
        productBrand: true,
      },
      distinct: ['productBrand'],
    });

    // Get price range
    const priceRange = await prisma.store.aggregate({
      where: {
        productVisibility: true,
      },
      _min: {
        productPrice: true,
      },
      _max: {
        productPrice: true,
      },
    });

    return NextResponse.json({
      statusx: 'SUCCESS',
      message: 'Filter options fetched successfully',
      data: {
        categories: categories.map(c => c.productCategory).filter(Boolean),
        brands: brands.map(b => b.productBrand).filter(Boolean),
        priceRange: {
          min: priceRange._min.productPrice || 0,
          max: priceRange._max.productPrice || 1000000,
        },
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Fetch filters error:', error);
    return NextResponse.json({
      statusx: 'FAILED',
      message: 'Internal server error occurred while fetching filters',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

