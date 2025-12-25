import BlogList from "../components/BlogList";
import Header from '@/app/(home)/components/Navigation';
import Footer from '@/app/(home)/components/Footer';
import type { Metadata } from 'next';
import { fetchPublishedBlogs } from '../actions/blogActions';

export const metadata: Metadata = {
  title: 'Import Insights Blog | Sure Imports',
  description: 'Master the art of international trade with expert insights, success stories, and practical guides to help you build a thriving import business.',
  openGraph: {
    title: 'Import Insights Blog | Sure Imports',
    description: 'Expert insights and guides for import professionals',
    type: 'website',
    url: '/blog',
  },
};

const Page = async () => {
  // Fetch blog posts from database
  const blogPosts = await fetchPublishedBlogs();
  
  // Log to verify data is being fetched
  console.log('Fetched blog posts count:', blogPosts.length);
  if (blogPosts.length > 0) {
    console.log('First blog post:', blogPosts[0].title);
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <BlogList blogPosts={blogPosts} />
      </main>
      <Footer />
    </>
  );
};

export default Page;




