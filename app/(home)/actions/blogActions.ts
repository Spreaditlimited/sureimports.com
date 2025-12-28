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
  blogFeatured?: boolean;
  blogTags?: string | null;
  blogCategory?: string | null;
  blogImage: string | null;
  blogBy: string | null;
  blogExt1: string | null;
  blogExt2: string | null;
  xStaus: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

// Parse tags from comma-separated string or JSON array
function parseTags(tagsField: string | null | undefined): string[] {
  if (!tagsField) return [];

  // Try parsing as JSON array first
  try {
    const parsed = JSON.parse(tagsField);
    if (Array.isArray(parsed)) {
      return parsed.filter((tag) => typeof tag === 'string' && tag.trim());
    }
  } catch {
    // Not JSON, treat as comma-separated string
  }

  // Parse as comma-separated string
  return tagsField
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
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

  // Parse tags: prioritize database field, fallback to SEO data
  const tags =
    dbBlog.blogTags && dbBlog.blogTags.trim()
      ? parseTags(dbBlog.blogTags)
      : seo.tags || [];

  // Get category: prioritize database field, fallback to SEO data
  const category =
    dbBlog.blogCategory && dbBlog.blogCategory.trim()
      ? dbBlog.blogCategory
      : seo.category || 'Import Guide';

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
    category,
    tags,
    publishDate: dbBlog.createdAt
      ? dbBlog.createdAt.toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    readTime: readTime > 0 ? readTime : 5,
    featured: dbBlog.blogFeatured === true || seo.featured === true,
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
          { blogTags: { contains: query, mode: 'insensitive' } },
          { blogCategory: { contains: query, mode: 'insensitive' } },
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

export async function fetchBlogsByTag(tag: string): Promise<BlogPost[]> {
  try {
    const blogs = await prisma.blog.findMany({
      where: {
        blogPublished: true,
        xStaus: 'active',
        blogTags: { contains: tag, mode: 'insensitive' },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return blogs.map(transformBlogPost);
  } catch (error) {
    console.error('Error fetching blogs by tag:', error);
    return [];
  }
}

export async function fetchBlogsByCategory(
  category: string,
): Promise<BlogPost[]> {
  try {
    const blogs = await prisma.blog.findMany({
      where: {
        blogPublished: true,
        xStaus: 'active',
        blogCategory: { equals: category, mode: 'insensitive' },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return blogs.map(transformBlogPost);
  } catch (error) {
    console.error('Error fetching blogs by category:', error);
    return [];
  }
}

export async function fetchAllTags(): Promise<string[]> {
  try {
    const blogs = await prisma.blog.findMany({
      where: {
        blogPublished: true,
        xStaus: 'active',
        blogTags: { not: null },
      },
      select: {
        blogTags: true,
      },
    });

    const allTags = new Set<string>();
    blogs.forEach((blog) => {
      if (blog.blogTags) {
        const tags = parseTags(blog.blogTags);
        tags.forEach((tag) => allTags.add(tag));
      }
    });

    return Array.from(allTags).sort();
  } catch (error) {
    console.error('Error fetching all tags:', error);
    return [];
  }
}

export async function fetchAllCategories(): Promise<string[]> {
  try {
    const blogs = await prisma.blog.findMany({
      where: {
        blogPublished: true,
        xStaus: 'active',
        blogCategory: { not: null },
      },
      select: {
        blogCategory: true,
      },
      distinct: ['blogCategory'],
    });

    return blogs
      .map((blog) => blog.blogCategory)
      .filter((cat): cat is string => cat !== null && cat.trim() !== '')
      .sort();
  } catch (error) {
    console.error('Error fetching all categories:', error);
    return [];
  }
}
