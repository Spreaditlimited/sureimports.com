import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import BlogDetail from '@/app/(home)/components/BlogDetail';
import {
  fetchPublishedBlogs,
  fetchBlogBySlug,
} from '@/app/(home)/actions/blogActions';
import Header from '@/app/(home)/components/Navigation';
import Footer from '@/app/(home)/components/Footer';
import Script from 'next/script';

type PageProps = {
  params: Promise<{ slug: string }>;
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sureimports.com';

export async function generateStaticParams() {
  const blogPosts = await fetchPublishedBlogs();
  return blogPosts
    .filter((p) => typeof p.slug === 'string' && p.slug.length > 0)
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogBySlug(slug);

  if (!post) {
    return {
      title: 'Blog Not Found | Sure Imports',
      description: 'The requested blog post could not be found.',
      robots: { index: false, follow: true },
    };
  }

  const seo = post.seo || {};

  // Use SEO-specific values with fallbacks
  const title = seo.seoTitle || post.title;
  const description =
    seo.metaDescription ||
    post.excerpt ||
    `Read ${post.title} - Expert insights on importing from China`;
  const keywordsArray = seo.keywords?.length
    ? seo.keywords
    : post.tags?.length
      ? post.tags
      : [
          'import from china',
          'china imports',
          post.category?.toLowerCase(),
        ].filter(Boolean);
  const canonicalUrl = seo.canonicalUrl || `${SITE_URL}/blog/${slug}`;

  // Open Graph values
  const ogTitle = seo.ogTitle || `${title} | Sure Imports Blog`;
  const ogDescription = seo.ogDescription || description;
  const ogImage = seo.ogImage || post.image || `${SITE_URL}/images/og-blog.png`;

  // Twitter values
  const twitterTitle = seo.twitterTitle || ogTitle;
  const twitterDescription = seo.twitterDescription || ogDescription;
  const twitterImage = seo.twitterImage || ogImage;

  // Build robots directive
  const robotsConfig = {
    index: !seo.noIndex,
    follow: !seo.noFollow,
    googleBot: {
      index: !seo.noIndex,
      follow: !seo.noFollow,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
  };

  // Calculate reading time for description enhancement
  const wordCount = post.content
    ? post.content.replace(/<[^>]*>/g, '').split(/\s+/).length
    : 0;
  const readingTime = Math.ceil(wordCount / 200);

  return {
    title: `${title} | Sure Imports`,
    description:
      description.length > 160
        ? description.slice(0, 157) + '...'
        : description,
    keywords: keywordsArray,
    authors: [{ name: post.author.name, url: SITE_URL }],
    creator: post.author.name,
    publisher: 'Sure Imports',
    robots: robotsConfig,
    alternates: {
      canonical: canonicalUrl,
    },
    category: post.category || 'Import Guide',
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: 'article',
      url: canonicalUrl,
      siteName: 'Sure Imports',
      locale: 'en_US',
      publishedTime: post.publishDate,
      modifiedTime: post.publishDate,
      authors: [post.author.name],
      section: post.category,
      tags: post.tags,
      images: [
        {
          url: ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`,
          width: 1200,
          height: 630,
          alt: ogTitle,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@sureimports',
      creator: '@sureimports',
      title: twitterTitle,
      description: twitterDescription,
      images: [
        {
          url: twitterImage.startsWith('http')
            ? twitterImage
            : `${SITE_URL}${twitterImage}`,
          alt: twitterTitle,
        },
      ],
    },
    other: {
      'article:published_time': post.publishDate,
      'article:author': post.author.name,
      'article:section': post.category,
      'article:tag': post.tags?.join(',') || '',
      'reading-time': `${readingTime} min read`,
    },
  };
}

export default async function BlogDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await fetchBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  const seo = post.seo || {};
  const canonicalUrl = seo.canonicalUrl || `${SITE_URL}/blog/${slug}`;
  const ogImage = seo.ogImage || post.image || `${SITE_URL}/images/og-blog.png`;

  // Calculate content metrics
  const plainTextContent = post.content
    ? post.content.replace(/<[^>]*>/g, '')
    : '';
  const wordCount = plainTextContent.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.ceil(wordCount / 200);

  // Enhanced JSON-LD structured data for Article (BlogPosting for better SEO)
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${canonicalUrl}#article`,
    headline: seo.seoTitle || post.title,
    name: post.title,
    description: seo.metaDescription || post.excerpt,
    image: {
      '@type': 'ImageObject',
      url: ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`,
      width: 1200,
      height: 630,
    },
    datePublished: post.publishDate,
    dateModified: post.publishDate,
    author: {
      '@type': 'Person',
      name: post.author.name,
      jobTitle: post.author.role,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Sure Imports',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/svg-logo-white.svg`,
        width: 200,
        height: 60,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    keywords:
      seo.keywords?.join(', ') || post.tags?.join(', ') || 'import from china',
    articleSection: post.category || 'Import Guide',
    articleBody: plainTextContent.slice(0, 500),
    wordCount: wordCount,
    timeRequired: `PT${readingTime}M`,
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    copyrightHolder: {
      '@type': 'Organization',
      name: 'Sure Imports',
    },
    copyrightYear: new Date(post.publishDate).getFullYear(),
  };

  // BreadcrumbList structured data
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${SITE_URL}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.category || 'Article',
        item: `${SITE_URL}/blog?category=${encodeURIComponent(post.category || 'all')}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: post.title,
        item: canonicalUrl,
      },
    ],
  };

  // WebPage schema for additional context
  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: `${post.title} | Sure Imports`,
    description: seo.metaDescription || post.excerpt,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${SITE_URL}#website`,
      name: 'Sure Imports',
      url: SITE_URL,
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`,
    },
    datePublished: post.publishDate,
    dateModified: post.publishDate,
    breadcrumb: {
      '@id': `${canonicalUrl}#breadcrumb`,
    },
  };

  // Fetch related posts for passing to the component
  const allPosts = await fetchPublishedBlogs();
  const relatedPosts = allPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <Script
        id="article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="webpage-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />

      <Header />
      <main className="min-h-screen">
        <BlogDetail post={post} relatedPosts={relatedPosts} />
      </main>
      <Footer />
    </>
  );
}
