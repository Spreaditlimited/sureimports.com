import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const pidBlog = searchParams.get('pidBlog');

    if (!slug && !pidBlog) {
      return NextResponse.json(
        {
          success: false,
          error: 'Either slug or pidBlog parameter is required',
        },
        { status: 400 }
      );
    }

    // Build where clause
    const whereClause: any = {
      xStaus: 'active',
    };

    if (slug) {
      whereClause.blogSlug = slug;
    } else if (pidBlog) {
      whereClause.pidBlog = pidBlog;
    }

    // Fetch single blog
    const blog = await prisma.blog.findFirst({
      where: whereClause,
    });

    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          error: 'Blog post not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: blog,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch blog',
      },
      { status: 500 }
    );
  }
}
