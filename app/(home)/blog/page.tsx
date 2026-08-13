import * as React from 'react';
import type { Metadata } from 'next';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogList from '../components/BlogList';
import { fetchPublishedBlogsLite } from '../actions/blogActions';
import { JsonLdScript } from '@/components/seo/JsonLd';
import { generateBreadcrumbSchema } from '@/lib/seo/schema';

// Safely use environment variables with a fallback
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sureimports.com';

// OPTIMIZATION: Revalidate this page every hour (3600 seconds). 
// This gives you the speed of a static page, while ensuring new posts appear automatically.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Import Insights Blog - Expert Guides & Tips',
  description:
    'Master the art of international trade with expert insights, success stories, and practical guides to help you build a thriving import business from China.',
  keywords: [
    'import blog',
    'china import guide',
    'international trade tips',
    'import business',
    'sourcing from china',
    'import success stories',
  ],
  openGraph: {
    title: 'Import Insights Blog | Sure Imports',
    description:
      'Expert insights and guides for import professionals. Learn how to successfully import from China.',
    type: 'website',
    url: `${baseUrl}/blog`,
    images: [
      {
        url: 'https://www.sureimports.com/images/sure-imports-social-card.png',
        width: 1200,
        height: 630,
        alt: 'Sure Imports Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Import Insights Blog | Sure Imports',
    description: 'Expert insights and guides for import professionals.',
    images: [
      'https://www.sureimports.com/images/sure-imports-social-card.png',
    ],
  },
  alternates: {
    canonical: `${baseUrl}/blog`,
    types: {
      'application/rss+xml': [
        {
          url: 'https://www.sureimports.com/blog/rss',
          title: 'Sure Imports Blog RSS Feed',
        },
      ],
    },
  },
};

// Breadcrumb schema for the blog listing page
const blogBreadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'Blog', url: '/blog' },
]);

type PageProps = {
  searchParams: Promise<{ tag?: string; page?: string; q?: string }>;
};

export default async function BlogPage({ searchParams }: PageProps) {
  const { tag, page, q } = await searchParams;
  const currentPage = Number.parseInt(page || '1', 10);
  const searchQuery = typeof q === 'string' ? q.trim() : '';
  const {
    posts,
    featuredPosts,
    totalPages,
    totalPosts,
    totalReadTime,
    page: resolvedPage,
  } =
    await fetchPublishedBlogsLite(
      Number.isFinite(currentPage) && currentPage > 0 ? currentPage : 1,
      9,
      searchQuery,
    );

  return (
    <>
      <JsonLdScript data={blogBreadcrumbSchema} />
      <Navbar />
      <main className="min-h-screen bg-slate-900">
        <BlogList
          blogPosts={posts}
          featuredPosts={featuredPosts}
          initialSearchQuery={searchQuery}
          initialTag={tag}
          currentPage={resolvedPage}
          totalPages={totalPages}
          totalPosts={totalPosts}
          totalReadTime={totalReadTime}
        />
      </main>
      <Footer />
    </>
  );
}
