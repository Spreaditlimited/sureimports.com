'use server';

import { prisma } from '@/lib/prisma';

// Media base URL for serving filename-based images during migration
const MEDIA_PUBLIC_URL =
  process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL ||
  process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL ||
  '';

function resolveBlogImageUrl(imagePath: string | null): string {
  if (!imagePath) return '/images/new/images/logo.png';

  const media = imagePath.trim();

  if (
    media.startsWith('http://') ||
    media.startsWith('https://') ||
    media.startsWith('/')
  ) {
    return media;
  }

  const base = MEDIA_PUBLIC_URL.replace(/\/$/, '');

  // Admin blog uploads may store only the generated public ID.
  // Cloudinary can serve the asset by public ID when the admin folder is restored.
  if (base && /^BLOG_[A-Z0-9]+$/.test(media)) {
    return `${base}/admin-sureimports/blog/${media}`;
  }

  return base ? `${base}/${media.replace(/^\//, '')}` : media;
}

function getPublishedBlogWhere() {
  return {
    blogPublished: true,
    xStaus: 'active',
    AND: [{ OR: [{ createdAt: null }, { createdAt: { lte: new Date() } }] }],
  };
}

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

export interface BlogListPost extends Omit<BlogPost, 'content'> {
  content: string;
}

export interface BlogListPageResult {
  posts: BlogListPost[];
  featuredPosts: BlogListPost[];
  page: number;
  pageSize: number;
  totalPosts: number;
  totalPages: number;
}

function toLitePost(dbBlog: DbBlog): BlogListPost {
  const transformed = transformBlogPost(dbBlog);
  return {
    ...transformed,
    content: '',
    excerpt:
      transformed.excerpt && transformed.excerpt !== 'No excerpt available'
        ? transformed.excerpt
        : `Read insights from ${transformed.title}.`,
  };
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
  const imageUrl = resolveBlogImageUrl(dbBlog.blogImage);

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
      where: getPublishedBlogWhere(),
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

export async function fetchPublishedBlogsLite(
  page = 1,
  pageSize = 9,
): Promise<BlogListPageResult> {
  try {
    const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
    const safePageSize =
      Number.isFinite(pageSize) && pageSize > 0
        ? Math.min(9, Math.floor(pageSize))
        : 9;
    const where = getPublishedBlogWhere();

    const totalPosts = await prisma.blog.count({ where });

    const totalPages = Math.max(1, Math.ceil(totalPosts / safePageSize));
    const resolvedPage = Math.min(safePage, totalPages);
    const postSelect = {
      id: true,
      pidBlog: true,
      blogTitle: true,
      blogSlug: true,
      blogPublished: true,
      blogFeatured: true,
      blogImage: true,
      blogBy: true,
      publisherId: true,
      blogExt1: true,
      blogExt2: true,
      xStaus: true,
      createdAt: true,
      updatedAt: true,
      publisher: {
        select: {
          pidPublisher: true,
          publisherName: true,
          publisherSlug: true,
          publisherEmail: true,
          publisherBio: true,
          publisherRole: true,
          publisherImage: true,
          publisherSocialX: true,
          publisherSocialLinkedin: true,
          publisherSocialFacebook: true,
          publisherSocialInstagram: true,
          publisherWebsite: true,
        },
      },
      category: {
        select: {
          categoryName: true,
        },
      },
    } as const;

    const blogs = await prisma.blog.findMany({
      where,
      select: postSelect,
      orderBy: {
        createdAt: 'desc',
      },
      take: safePageSize,
      skip: (resolvedPage - 1) * safePageSize,
    });

    const featuredBlogs = await prisma.blog.findMany({
      where: {
        ...where,
        OR: [{ blogFeatured: true }, { blogExt2: { contains: '"featured":true' } }],
      },
      select: postSelect,
      orderBy: {
        createdAt: 'desc',
      },
      take: 3,
    });

    const posts = blogs.map((blog) => toLitePost(blog as DbBlog));
    const featuredPosts = featuredBlogs.map((blog) => toLitePost(blog as DbBlog));

    return {
      posts,
      featuredPosts,
      page: resolvedPage,
      pageSize: safePageSize,
      totalPosts,
      totalPages,
    };
  } catch (error) {
    console.error('Error fetching lite blogs:', error);
    return {
      posts: [],
      featuredPosts: [],
      page: 1,
      pageSize: 9,
      totalPosts: 0,
      totalPages: 1,
    };
  }
}

export async function fetchPublishedBlogSlugs(): Promise<string[]> {
  try {
    const blogs = await prisma.blog.findMany({
      where: getPublishedBlogWhere(),
      select: {
        blogSlug: true,
        pidBlog: true,
      },
    });

    return blogs
      .map((blog) => blog.blogSlug || blog.pidBlog)
      .filter((slug): slug is string => Boolean(slug && slug.length > 0));
  } catch (error) {
    console.error('Error fetching blog slugs:', error);
    return [];
  }
}

export async function fetchRelatedBlogs(
  category: string,
  excludeId: string,
  limit = 3,
): Promise<BlogPost[]> {
  try {
    const blogs = await prisma.blog.findMany({
      where: {
        ...getPublishedBlogWhere(),
        pidBlog: { not: excludeId },
        category: {
          is: {
            categoryName: category,
          },
        },
      },
      include: {
        publisher: true,
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return blogs.map((blog) => transformBlogPost(blog as DbBlog));
  } catch (error) {
    console.error('Error fetching related blogs:', error);
    return [];
  }
}

export async function fetchBlogBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const blog = await prisma.blog.findFirst({
      where: {
        ...getPublishedBlogWhere(),
        OR: [{ blogSlug: slug }, { pidBlog: slug }],
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
        ...getPublishedBlogWhere(),
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
        ...getPublishedBlogWhere(),
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
        ...getPublishedBlogWhere(),
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
        ...getPublishedBlogWhere(),
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
