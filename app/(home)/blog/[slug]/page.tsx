import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BlogDetail from "@/app/(home)/components/BlogDetail";
import { fetchPublishedBlogs, fetchBlogBySlug } from "@/app/(home)/actions/blogActions";
import Header from '@/app/(home)/components/Navigation';
import Footer from '@/app/(home)/components/Footer';


type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const blogPosts = await fetchPublishedBlogs();
  return blogPosts
    .filter((p) => typeof p.slug === "string" && p.slug.length > 0)
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogBySlug(slug);
  
  if (!post) return { title: "Blog" };
  
  return {
    title: post.title ?? "Blog",
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `/blog/${slug}`,
    },
  };
}

export default async function BlogDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await fetchBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <BlogDetail slug={slug} />
      </main>
      <Footer />
    </>
  );
}


