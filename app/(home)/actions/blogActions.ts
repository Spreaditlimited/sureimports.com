'use server';

import { prisma } from '@/lib/prisma';

// Media base URL for serving filename-based images during migration
const MEDIA_PUBLIC_URL =
  process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL ||
  process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL ||
  '';

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

export interface BlogPublisher {
  pidPublisher: string;
  publisherName: string;
  publisherSlug?: string;
  publisherEmail?: string;
  publisherBio?: string;
  publisherRole?: string;
  publisherImage?: string;
  publisherSocialX?: string;
  publisherSocialLinkedin?: string;
  publisherSocialFacebook?: string;
  publisherSocialInstagram?: string;
  publisherWebsite?: string;
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
  publisher?: BlogPublisher;
  category: string;
  tags: string[];
  publishDate: string;
  readTime: number;
  featured: boolean;
  image: string;
  slug: string;
  seo?: BlogSEO;
}

// Database publisher model
interface DbPublisher {
  pidPublisher: string;
  publisherName: string;
  publisherSlug: string | null;
  publisherEmail: string | null;
  publisherBio: string | null;
  publisherRole: string | null;
  publisherImage: string | null;
  publisherSocialX: string | null;
  publisherSocialLinkedin: string | null;
  publisherSocialFacebook: string | null;
  publisherSocialInstagram: string | null;
  publisherWebsite: string | null;
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
  blogImage: string | null;
  blogBy: string | null;
  publisherId: string | null;
  publisher?: DbPublisher | null;
  category?: {
    categoryName: string;
  } | null;
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

  const tags = seo.tags || [];

  // Get category: prioritize database field, fallback to SEO data
  const category =
    dbBlog.category?.categoryName?.trim() || seo.category || 'Import Guide';

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
    ? dbBlog.blogImage.startsWith('http')
      ? dbBlog.blogImage
      : MEDIA_PUBLIC_URL
        ? `${MEDIA_PUBLIC_URL.replace(/\/$/, '')}/${dbBlog.blogImage}`
        : dbBlog.blogImage
    : '/images/new/images/logo.png';

  // Helper to construct media image URL - handles various path formats
  const getMediaImageUrl = (imagePath: string | null): string | undefined => {
    if (!imagePath) return undefined;

    // If already a full URL, return as-is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // Remove leading slash if present to avoid double slashes
    const cleanPath = imagePath.startsWith('/')
      ? imagePath.slice(1)
      : imagePath;

    const mediaBaseUrl = MEDIA_PUBLIC_URL.replace(/\/$/, '');
    if (!mediaBaseUrl) return undefined;
    return `${mediaBaseUrl}/${cleanPath}`;
  };

  // Transform publisher data - use publisher as primary author source
  const publisher: BlogPublisher | undefined = dbBlog.publisher
    ? {
        pidPublisher: dbBlog.publisher.pidPublisher,
        publisherName: dbBlog.publisher.publisherName,
        publisherSlug: dbBlog.publisher.publisherSlug || undefined,
        publisherEmail: dbBlog.publisher.publisherEmail || undefined,
        publisherBio: dbBlog.publisher.publisherBio || undefined,
        publisherRole: dbBlog.publisher.publisherRole || undefined,
        publisherImage: getMediaImageUrl(dbBlog.publisher.publisherImage),
        publisherSocialX: dbBlog.publisher.publisherSocialX || undefined,
        publisherSocialLinkedin:
          dbBlog.publisher.publisherSocialLinkedin || undefined,
        publisherSocialFacebook:
          dbBlog.publisher.publisherSocialFacebook || undefined,
        publisherSocialInstagram:
          dbBlog.publisher.publisherSocialInstagram || undefined,
        publisherWebsite: dbBlog.publisher.publisherWebsite || undefined,
      }
    : undefined;

  // Author data derived from publisher (primary) or blogBy field (fallback)
  const authorName = publisher?.publisherName || dbBlog.blogBy || 'Admin';
  const authorAvatar =
    publisher?.publisherImage || '/images/new/images/default-avatar.png';
  const authorRole = publisher?.publisherRole || 'Author';

  return {
    id: dbBlog.pidBlog,
    title: dbBlog.blogTitle,
    excerpt,
    content: dbBlog.blogContent || '',
    author: {
      name: authorName,
      avatar: authorAvatar,
      role: authorRole,
    },
    publisher,
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
      include: {
        publisher: true,
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return blogs.map((blog) => transformBlogPost(blog as DbBlog));
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
      include: {
        publisher: true,
        category: true,
      },
    });

    if (!blog) return null;

    return transformBlogPost(blog as DbBlog);
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
          { blogTitle: { contains: query } },
          { blogContent: { contains: query } },
          { blogBy: { contains: query } },
          { blogExt2: { contains: query } },
          { category: { is: { categoryName: { contains: query } } } },
        ],
      },
      include: {
        publisher: true,
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return blogs.map((blog) => transformBlogPost(blog as DbBlog));
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
        blogExt2: { contains: tag },
      },
      include: {
        publisher: true,
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return blogs.map((blog) => transformBlogPost(blog as DbBlog));
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
        category: { is: { categoryName: category } },
      },
      include: {
        publisher: true,
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return blogs.map((blog) => transformBlogPost(blog as DbBlog));
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
        blogExt2: { not: null },
      },
      select: {
        blogExt2: true,
      },
    });

    const allTags = new Set<string>();
    blogs.forEach((blog) => {
      if (blog.blogExt2) {
        const tags = parseSEOData(blog.blogExt2).tags || [];
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
    const categories = await prisma.blog_category.findMany({
      where: {
        status: 'active',
      },
      select: {
        categoryName: true,
      },
      distinct: ['categoryName'],
    });

    return categories
      .map((cat) => cat.categoryName)
      .filter((cat): cat is string => cat !== null && cat.trim() !== '')
      .sort();
  } catch (error) {
    console.error('Error fetching all categories:', error);
    return [];
  }
}
