import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogList from '../components/BlogList';
import { fetchPublishedBlogsLite } from '../actions/blogActions';
import { JsonLdScript } from '@/components/seo/JsonLd';
import { generateBreadcrumbSchema } from '@/lib/seo/schema';
import {
  blogListingHref,
  parseBlogListingParams,
  type BlogListingParams,
} from '@/lib/blogListing';

const baseUrl = 'https://www.sureimports.com';
export const revalidate = 3600;
type PageProps = { searchParams: Promise<BlogListingParams> };

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = parseBlogListingParams(await searchParams);
  const filtered = Boolean(
    params.q || params.tag || params.category || params.sort === 'oldest',
  );
  const title = `Import Insights Blog${params.page > 1 ? ` — Page ${params.page}` : ''}`;
  const description =
    'Practical guides to sourcing products, checking suppliers, planning shipping and calculating import costs from China to Nigeria.';
  const canonical = `${baseUrl}${blogListingHref(params)}`;
  const image = `${baseUrl}/images/sure-imports-social-card.png`;
  return {
    title,
    description,
    robots: { index: !filtered, follow: true },
    alternates: {
      canonical,
      types: {
        'application/rss+xml': [
          { url: `${baseUrl}/blog/rss`, title: 'Sure Imports Blog RSS Feed' },
        ],
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonical,
      images: [
        { url: image, width: 1200, height: 630, alt: 'Sure Imports Blog' },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function BlogPage({ searchParams }: PageProps) {
  const params = parseBlogListingParams(await searchParams);
  const result = await fetchPublishedBlogsLite(
    params.page,
    9,
    params.q,
    params,
  );
  // Never serve the last page at an unlimited number of invented page URLs.
  if (params.page > result.totalPages) notFound();
  return (
    <>
      <JsonLdScript
        data={generateBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog' },
        ])}
      />
      <Navbar />
      <main
        className="min-h-screen bg-[var(--si-canvas)]"
        data-si-page-theme="editorial"
      >
        <BlogList
          blogPosts={result.posts}
          featuredPosts={result.featuredPosts}
          initialSearchQuery={params.q}
          initialTag={params.tag}
          initialCategory={params.category}
          initialSort={params.sort}
          categories={result.categories}
          currentPage={result.page}
          totalPages={result.totalPages}
          totalPosts={result.totalPosts}
          totalReadTime={result.totalReadTime}
        />
      </main>
      <Footer />
    </>
  );
}
