import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '1000');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const whereClause: any = {
      xStaus: 'active',
    };

    // Filter by published status
    if (status === 'published') {
      whereClause.blogPublished = true;
    } else if (status === 'draft') {
      whereClause.blogPublished = false;
    }

    // Add search functionality
    if (search) {
      whereClause.OR = [
        { blogTitle: { contains: search, mode: 'insensitive' } },
        { blogContent: { contains: search, mode: 'insensitive' } },
        { blogBy: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Fetch blogs with pagination
    const [blogs, totalCount] = await Promise.all([
      prisma.blog.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.blog.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json(
      {
        success: true,
        data: blogs,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalCount,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch blogs',
      },
      { status: 500 },
    );
  }
}
