import BlogList from '../components/BlogList';
import Header from '@/app/(home)/components/Navigation';
import Footer from '@/app/(home)/components/Footer';
import type { Metadata } from 'next';
import { fetchPublishedBlogs } from '../actions/blogActions';
import { JsonLdScript } from '@/components/seo/JsonLd';
import { generateBreadcrumbSchema } from '@/lib/seo/schema';

const baseUrl = 'https://sureimports.com';

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
        url: '/images/og-blog.png',
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
    images: ['/images/og-blog.png'],
  },
  alternates: {
    canonical: `${baseUrl}/blog`,
  },
};

// Breadcrumb schema for the blog listing page
const blogBreadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'Blog', url: '/blog' },
]);

type PageProps = {
  searchParams: Promise<{ tag?: string }>;
};

const Page = async ({ searchParams }: PageProps) => {
  // Fetch blog posts from database
  const blogPosts = await fetchPublishedBlogs();
  const { tag } = await searchParams;

  return (
    <>
      <JsonLdScript data={blogBreadcrumbSchema} />
      <Header />
      <main className="min-h-screen">
        <BlogList blogPosts={blogPosts} initialTag={tag} />
      </main>
      <Footer />
    </>
  );
};

export default Page;
