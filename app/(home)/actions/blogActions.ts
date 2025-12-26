'use server';

import { prisma } from '@/lib/prisma';

// SEO metadata interface
export interface BlogSEO {
  // General SEO
  focusKeyword?: string;
  seoTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  // Open Graph (Facebook, LinkedIn)
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  // Twitter Card
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  // Advanced
  canonicalUrl?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  // Legacy
  category?: string;
  tags?: string[];
  featured?: boolean;
}

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
  seo?: BlogSEO;
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

// Parse SEO metadata from blogExt2 field
function parseSEOData(blogExt2: string | null): BlogSEO {
  const defaultSEO: BlogSEO = {
    category: 'Import Guide',
    tags: [],
    featured: false,
  };

  if (!blogExt2) return defaultSEO;

  try {
    const parsed = JSON.parse(blogExt2);

    // Handle legacy format (plain text or simple array)
    if (typeof parsed === 'string') {
      return { ...defaultSEO, metaDescription: parsed };
    }
    if (Array.isArray(parsed)) {
      return { ...defaultSEO, tags: parsed };
    }

    // Handle new SEO format
    return {
      // General SEO
      focusKeyword: parsed.focusKeyword || undefined,
      seoTitle: parsed.seoTitle || undefined,
      metaDescription: parsed.metaDescription || undefined,
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
      // Open Graph
      ogTitle: parsed.ogTitle || undefined,
      ogDescription: parsed.ogDescription || undefined,
      ogImage: parsed.ogImage || undefined,
      // Twitter
      twitterTitle: parsed.twitterTitle || undefined,
      twitterDescription: parsed.twitterDescription || undefined,
      twitterImage: parsed.twitterImage || undefined,
      // Advanced
      canonicalUrl: parsed.canonicalUrl || undefined,
      noIndex: parsed.noIndex === true,
      noFollow: parsed.noFollow === true,
      // Legacy fields
      category: parsed.category || 'Import Guide',
      tags: Array.isArray(parsed.tags) ? parsed.tags : [],
      featured: parsed.featured === true,
    };
  } catch {
    return defaultSEO;
  }
}

// Transform database blog to BlogPost format
function transformBlogPost(dbBlog: DbBlog): BlogPost {
  // Parse SEO data
  const seo = parseSEOData(dbBlog.blogExt2);

  // Use SEO meta description as excerpt, or extract from content
  const excerpt =
    seo.metaDescription ||
    (dbBlog.blogContent
      ? dbBlog.blogContent.replace(/<[^>]*>/g, '').substring(0, 200) + '...'
      : 'No excerpt available');

  // Calculate read time (assuming 200 words per minute)
  const wordCount = dbBlog.blogContent
    ? dbBlog.blogContent.replace(/<[^>]*>/g, '').split(/\s+/).length
    : 0;
  const readTime = Math.ceil(wordCount / 200);

  // Get image URL
  const imageUrl = dbBlog.blogImage
    ? `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${dbBlog.blogImage}`
    : '/images/new/images/logo.png';

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
    category: seo.category || 'Import Guide',
    tags: seo.tags || [],
    publishDate: dbBlog.createdAt
      ? dbBlog.createdAt.toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    readTime: readTime > 0 ? readTime : 5,
    featured: seo.featured || false,
    image: imageUrl,
    slug: dbBlog.blogSlug || dbBlog.pidBlog,
    seo,
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
