'use client';
import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Tag,
  Share2,
  BookOpen,
  Eye,
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import type { BlogPost } from '../actions/blogActions';
import { useRouter } from 'next/navigation';

// Lightweight local ImageWithFallback component to accept string or StaticImageData and provide a safe fallback
const ImageWithFallback = ({
  src,
  alt,
  className,
}: {
  src: string | { src: string };
  alt: string;
  className?: string;
}) => {
  const [hasError, setHasError] = useState(false);
  const resolvedSrc = hasError
    ? 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='
    : typeof src === 'string'
      ? src
      : src && (src as any).src;
  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
};

export default function BlogDetail({ slug, onBack, onSelectPost }: any) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fallback handlers if none provided
  const handleBackClick = onBack ?? (() => router.back());
  const handleSelectPostClick =
    onSelectPost ?? ((s: string) => router.push(`/blog/${s}`));

  useEffect(() => {
    async function fetchBlog() {
      try {
        setLoading(true);
        // Fetch the blog post
        const response = await fetch(
          `/api/crud/blog/fetch-single?slug=${slug}`,
        );
        const data = await response.json();

        if (data.success && data.data) {
          // Transform the database blog to BlogPost format
          const dbBlog = data.data;

          const excerpt = dbBlog.blogContent
            ? dbBlog.blogContent.replace(/<[^>]*>/g, '').substring(0, 200) +
              '...'
            : 'No excerpt available';

          const wordCount = dbBlog.blogContent
            ? dbBlog.blogContent.replace(/<[^>]*>/g, '').split(/\s+/).length
            : 0;
          const readTime = Math.ceil(wordCount / 200);

          const imageUrl = dbBlog.blogImage
            ? `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${dbBlog.blogImage}`
            : '/images/new/images/logo.png';

          let tags: string[] = [];
          let category = 'Import Guide';

          try {
            if (dbBlog.blogExt2) {
              const metadata = JSON.parse(dbBlog.blogExt2);
              if (metadata.tags) tags = metadata.tags;
              if (metadata.category) category = metadata.category;
            }
          } catch {
            tags = ['Import Guide'];
          }

          const transformedPost: BlogPost = {
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
              ? new Date(dbBlog.createdAt).toISOString().split('T')[0]
              : new Date().toISOString().split('T')[0],
            readTime: readTime > 0 ? readTime : 5,
            featured: false,
            image: imageUrl,
            slug: dbBlog.blogSlug || dbBlog.pidBlog,
          };

          setPost(transformedPost);

          // Fetch all blogs for related posts
          const allResponse = await fetch(
            '/api/crud/blog/fetch?status=published&limit=100',
          );
          const allData = await allResponse.json();

          if (allData.success && allData.data) {
            const allPosts = allData.data.map((b: any) => {
              let postCategory = 'Import Guide';
              try {
                if (b.blogExt2) {
                  const meta = JSON.parse(b.blogExt2);
                  if (meta.category) postCategory = meta.category;
                }
              } catch {}
              return { ...b, category: postCategory };
            });

            const related = allPosts
              .filter(
                (p: any) =>
                  p.category === category && p.pidBlog !== dbBlog.pidBlog,
              )
              .slice(0, 3)
              .map((b: any) => {
                const ex = b.blogContent
                  ? b.blogContent.replace(/<[^>]*>/g, '').substring(0, 200) +
                    '...'
                  : 'No excerpt available';
                const wc = b.blogContent
                  ? b.blogContent.replace(/<[^>]*>/g, '').split(/\s+/).length
                  : 0;
                const rt = Math.ceil(wc / 200);
                const img = b.blogImage
                  ? `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${b.blogImage}`
                  : '/images/new/images/logo.png';

                return {
                  id: b.pidBlog,
                  title: b.blogTitle,
                  excerpt: ex,
                  content: b.blogContent || '',
                  author: {
                    name: b.blogBy || 'Admin',
                    avatar: '/images/new/images/ijeoma-tdaniels.JPG',
                    role: 'Content Lead',
                  },
                  category: b.category,
                  tags: [],
                  publishDate: b.createdAt
                    ? new Date(b.createdAt).toISOString().split('T')[0]
                    : new Date().toISOString().split('T')[0],
                  readTime: rt > 0 ? rt : 5,
                  featured: false,
                  image: img,
                  slug: b.blogSlug || b.pidBlog,
                };
              });

            setRelatedPosts(related);
          }
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-400"></div>
          <p className="text-slate-300">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="text-center">
          <h1 className="mb-4 text-2xl text-white">Article not found</h1>
          <Button asChild className="bg-blue-600 text-white hover:bg-blue-700">
            <a href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </a>
          </Button>
        </div>
      </div>
    );
  }

  // Check if content is HTML
  const isHtmlContent = (content: string) => {
    return /<[a-z][\s\S]*>/i.test(content);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Button
            onClick={handleBackClick}
            variant="ghost"
            className="mb-6 text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </div>
      </div>

      {/* Article Content */}
      <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Image */}
        <div className="relative mb-8 overflow-hidden rounded-xl">
          <ImageWithFallback
            src={post.image}
            alt={post.title}
            className="h-64 w-full object-cover md:h-96"
          />
          {post.featured && (
            <div className="absolute left-6 top-6">
              <Badge className="bg-blue-600 px-3 py-1 text-sm text-white">
                Featured Article
              </Badge>
            </div>
          )}
        </div>

        {/* Article Header */}
        <header className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <Badge
              variant="secondary"
              className="border-blue-600/30 bg-blue-600/20 text-blue-400"
            >
              {post.category}
            </Badge>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(post.publishDate)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readTime} min read
            </span>
          </div>

          <h1 className="mb-6 text-3xl leading-tight text-white md:text-5xl">
            {post.title}
          </h1>

          <p className="mb-8 text-xl leading-relaxed text-slate-300">
            {post.excerpt}
          </p>

          {/* Author and Actions */}
          <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <ImageWithFallback
                src={post.author.avatar}
                alt={post.author.name}
                className="h-12 w-12 rounded-full"
              />
              <div>
                <p className="text-white">{post.author.name}</p>
                <p className="text-sm text-slate-400">{post.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleShare}
                variant="outline"
                size="sm"
                className="border-white/20 bg-white/10 text-white hover:bg-white/20"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <a
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(`/blog?tag=${encodeURIComponent(tag)}`);
                  }}
                  className="inline-block"
                >
                  <Badge
                    variant="outline"
                    className="cursor-pointer border-slate-600 text-slate-300 transition-colors hover:border-blue-500 hover:bg-blue-600/20 hover:text-blue-400"
                  >
                    <Tag className="mr-1 h-3 w-3" />
                    {tag}
                  </Badge>
                </a>
              ))}
            </div>
          )}
        </header>

        {/* Article Content */}
        <div className="prose prose-invert prose-slate max-w-none">
          <div className="blog-content rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-md md:p-12">
            {isHtmlContent(post.content) ? (
              <div
                className="blog-html-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            ) : (
              <div className="whitespace-pre-wrap leading-relaxed text-slate-300">
                {post.content}
              </div>
            )}
          </div>
        </div>

        {/* Blog Content Styles */}
        <style jsx global>{`
          .blog-html-content h1 {
            font-size: 2rem;
            font-weight: 700;
            color: #fff;
            margin-top: 2rem;
            margin-bottom: 1rem;
            line-height: 1.3;
          }
          .blog-html-content h2 {
            font-size: 1.5rem;
            font-weight: 600;
            color: #fff;
            margin-top: 2rem;
            margin-bottom: 0.75rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }
          .blog-html-content h3 {
            font-size: 1.25rem;
            font-weight: 600;
            color: #93c5fd;
            margin-top: 1.5rem;
            margin-bottom: 0.5rem;
          }
          .blog-html-content p {
            color: #cbd5e1;
            line-height: 1.8;
            margin-bottom: 1rem;
          }
          .blog-html-content strong {
            color: #fff;
            font-weight: 600;
          }
          .blog-html-content ul {
            list-style: none;
            padding-left: 0;
            margin-bottom: 1.5rem;
          }
          .blog-html-content ul li {
            position: relative;
            padding-left: 1.5rem;
            margin-bottom: 0.5rem;
            color: #cbd5e1;
          }
          .blog-html-content ul li::before {
            content: '•';
            position: absolute;
            left: 0;
            color: #60a5fa;
            font-weight: bold;
          }
          .blog-html-content ul li p {
            margin: 0;
            display: inline;
          }
          .blog-html-content ol {
            list-style: decimal;
            padding-left: 1.5rem;
            margin-bottom: 1.5rem;
          }
          .blog-html-content ol li {
            color: #cbd5e1;
            margin-bottom: 0.5rem;
          }
          .blog-html-content a {
            color: #60a5fa;
            text-decoration: underline;
            transition: color 0.2s ease;
          }
          .blog-html-content a:hover {
            color: #93c5fd;
          }
          .blog-html-content blockquote {
            border-left: 4px solid #3b82f6;
            padding-left: 1rem;
            margin: 1.5rem 0;
            font-style: italic;
            color: #94a3b8;
          }
          .blog-html-content code {
            background: rgba(255, 255, 255, 0.1);
            padding: 0.2rem 0.4rem;
            border-radius: 0.25rem;
            font-size: 0.875rem;
            color: #f472b6;
          }
          .blog-html-content pre {
            background: rgba(0, 0, 0, 0.3);
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
            margin: 1rem 0;
          }
          .blog-html-content pre code {
            background: transparent;
            padding: 0;
          }
          .blog-html-content img {
            max-width: 100%;
            height: auto;
            border-radius: 0.5rem;
            margin: 1rem 0;
          }
          .blog-html-content table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
          }
          .blog-html-content th,
          .blog-html-content td {
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 0.75rem;
            text-align: left;
            color: #cbd5e1;
          }
          .blog-html-content th {
            background: rgba(255, 255, 255, 0.05);
            color: #fff;
            font-weight: 600;
          }
        `}</style>

        {/* Article Footer */}
        <footer className="mt-12 border-t border-slate-700 pt-8">
          {post.tags.length > 0 && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="text-slate-400">Tagged with:</span>
              {post.tags.map((tag) => (
                <a
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(`/blog?tag=${encodeURIComponent(tag)}`);
                  }}
                  className="inline-block"
                >
                  <Badge
                    variant="outline"
                    className="cursor-pointer border-slate-600 text-slate-300 transition-colors hover:border-blue-500 hover:bg-blue-600/20 hover:text-blue-400"
                  >
                    <Tag className="mr-1 h-3 w-3" />
                    {tag}
                  </Badge>
                </a>
              ))}
            </div>
          )}

          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <ImageWithFallback
                src={post.author.avatar}
                alt={post.author.name}
                className="h-16 w-16 rounded-full"
              />
              <div>
                <h3 className="mb-1 text-lg text-white">
                  About {post.author.name}
                </h3>
                <p className="mb-2 text-sm text-slate-300">
                  {post.author.role}
                </p>
                <p className="text-sm text-slate-400">
                  Ijeoma is a content strategist and storyteller who helps
                  entrepreneurs and brands turn their authentic stories into
                  powerful growth tools. She blends strategy with creativity,
                  analyzing backend business operations to craft content that
                  connects, influences, and inspires.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </article>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="bg-gradient-to-b from-slate-800 to-slate-900 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl text-white">Related Articles</h2>
              <p className="text-slate-300">
                Continue reading with these related posts
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Card
                  key={relatedPost.id}
                  className="group cursor-pointer border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 hover:border-white/20"
                  onClick={() => handleSelectPostClick(relatedPost.slug)}
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <ImageWithFallback
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <CardContent className="p-6">
                    <div className="mb-3 flex items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(relatedPost.publishDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {relatedPost.readTime} min read
                      </span>
                    </div>

                    <h3 className="mb-3 line-clamp-2 text-lg text-white transition-colors group-hover:text-blue-400">
                      {relatedPost.title}
                    </h3>

                    <p className="mb-4 line-clamp-3 text-sm text-slate-300">
                      {relatedPost.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ImageWithFallback
                          src={relatedPost.author.avatar}
                          alt={relatedPost.author.name}
                          className="h-6 w-6 rounded-full"
                        />
                        <span className="text-xs text-slate-400">
                          {relatedPost.author.name}
                        </span>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-slate-700 text-xs text-slate-300"
                      >
                        {relatedPost.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
