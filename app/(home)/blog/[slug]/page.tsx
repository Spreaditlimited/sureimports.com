import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BlogDetail from "@/app/(home)/components/BlogDetail";
import { blogPosts, type BlogPost } from "@/app/(home)/components/BlogData";
import Header from '@/app/(home)/components/Navigation';
import Footer from '@/app/(home)/components/Footer';


type PageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return blogPosts
    .filter((p) => typeof p.slug === "string" && p.slug.length > 0)
    .map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) return { title: "Blog" };
  return {
    title: post.title ?? "Blog",
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `/blog/${params.slug}`,
    },
  };
}

export default function BlogDetailsPage({ params }: PageProps) {
  const post = blogPosts.find((p) => p.slug === params.slug) as BlogPost | undefined;

  if (!post) {
    notFound();
  }

  // If BlogDetail expects a slug instead of a post, swap to: <BlogDetail slug={params.slug} />
  return (
    <>
    <Header />
      <main className="min-h-screen">
      <BlogDetail slug={params.slug} />
      </main>
    <Footer />
  </>
  )
  
}


