import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Get query parameters
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const brand = searchParams.get('brand') || '';
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999999');
    const sortBy = searchParams.get('sortBy') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const availability = searchParams.get('availability') || 'all'; // all, available, unavailable

    // Build where clause
    const where: any = {
      productVisibility: true, // Only show visible products
    };

    // Search filter (MySQL is case-insensitive by default)
    if (search) {
      where.OR = search
        .split(' ')
        .filter((term) => term.trim())
        .map((term) => ({
          OR: [
            { productName: { contains: term } },
            { productDescription: { contains: term } },
            { productBrand: { contains: term } },
            { productCategory: { contains: term } },
          ],
        }));
    }

    // Category filter
    if (category && category !== 'all') {
      where.productCategory = category;
    }

    // Brand filter
    if (brand && brand !== 'all') {
      where.productBrand = brand;
    }

    // Price range filter
    if (minPrice > 0 || maxPrice < 999999999) {
      where.productPrice = {
        gte: minPrice,
        lte: maxPrice,
      };
    }

    // Availability filter
    if (availability === 'available') {
      where.productStatus = 'available';
    } else if (availability === 'unavailable') {
      where.productStatus = 'unavailable';
    }

    // Determine sort order
    let orderBy: any = { createdAt: 'desc' }; // Default: newest first

    switch (sortBy) {
      case 'price-asc':
        orderBy = { productPrice: 'asc' };
        break;
      case 'price-desc':
        orderBy = { productPrice: 'desc' };
        break;
      case 'name-asc':
        orderBy = { productName: 'asc' };
        break;
      case 'name-desc':
        orderBy = { productName: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch products with pagination
    const [products, totalCount] = await Promise.all([
      prisma.store.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.store.count({ where }),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json(
      {
        statusx: 'SUCCESS',
        message: 'Products fetched successfully',
        data: {
          products,
          pagination: {
            currentPage: page,
            totalPages,
            totalCount,
            limit,
            hasNextPage,
            hasPrevPage,
          },
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Fetch products error:', error);
    return NextResponse.json(
      {
        statusx: 'FAILED',
        message: 'Internal server error occurred while fetching products',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
