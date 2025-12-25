'use server';

import { prisma } from '@/lib/prisma';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  category: string;
  tags: string[];
  publishDate: string;
  readTime: number;
  featured: boolean;
  image: string;
  slug: string;
}

// Database blog model
interface DbBlog {
  id: number;
  pidBlog: string;
  blogTitle: string;
  blogContent: string | null;
  blogSlug: string | null;
  blogPublished: boolean;
  blogImage: string | null;
  blogBy: string | null;
  blogExt1: string | null;
  blogExt2: string | null;
  xStaus: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

// Transform database blog to BlogPost format
function transformBlogPost(dbBlog: DbBlog): BlogPost {
  // Extract excerpt from content (first 200 characters)
  const excerpt = dbBlog.blogContent
    ? dbBlog.blogContent.replace(/<[^>]*>/g, '').substring(0, 200) + '...'
    : 'No excerpt available';

  // Calculate read time (assuming 200 words per minute)
  const wordCount = dbBlog.blogContent
    ? dbBlog.blogContent.replace(/<[^>]*>/g, '').split(/\s+/).length
    : 0;
  const readTime = Math.ceil(wordCount / 200);

  // Get image URL
  const imageUrl = dbBlog.blogImage
    ? `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${dbBlog.blogImage}`
    : '/images/new/images/logo.png';

  // Parse tags from blogExt2 if available (assuming JSON array)
  let tags: string[] = [];
  try {
    if (dbBlog.blogExt2) {
      tags = JSON.parse(dbBlog.blogExt2);
    }
  } catch {
    tags = ['Import Guide'];
  }

  // Parse category and featured status from metadata if available
  let category = 'Import Guide';
  let featured = false;
  
  // You can extend this to parse from blogExt2 as well
  try {
    if (dbBlog.blogExt2) {
      const metadata = JSON.parse(dbBlog.blogExt2);
      if (metadata.category) category = metadata.category;
      if (metadata.featured !== undefined) featured = metadata.featured;
    }
  } catch {
    // Use defaults
  }

  return {
    id: dbBlog.pidBlog,
    title: dbBlog.blogTitle,
    excerpt,
    content: dbBlog.blogContent || '',
    author: {
      name: dbBlog.blogBy || 'Admin',
      avatar: '/images/new/images/ijeoma-tdaniels.JPG',
      role: 'Content Lead',
    },
    category,
    tags,
    publishDate: dbBlog.createdAt
      ? dbBlog.createdAt.toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    readTime: readTime > 0 ? readTime : 5,
    featured,
    image: imageUrl,
    slug: dbBlog.blogSlug || dbBlog.pidBlog,
  };
}

export async function fetchPublishedBlogs(): Promise<BlogPost[]> {
  try {
    const blogs = await prisma.blog.findMany({
      where: {
        blogPublished: true,
        xStaus: 'active',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return blogs.map(transformBlogPost);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

export async function fetchBlogBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const blog = await prisma.blog.findFirst({
      where: {
        blogSlug: slug,
        blogPublished: true,
        xStaus: 'active',
      },
    });

    if (!blog) return null;

    return transformBlogPost(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

export async function searchBlogs(query: string): Promise<BlogPost[]> {
  try {
    const blogs = await prisma.blog.findMany({
      where: {
        blogPublished: true,
        xStaus: 'active',
        OR: [
          { blogTitle: { contains: query, mode: 'insensitive' } },
          { blogContent: { contains: query, mode: 'insensitive' } },
          { blogBy: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return blogs.map(transformBlogPost);
  } catch (error) {
    console.error('Error searching blogs:', error);
    return [];
  }
}
