'use client';
import { useState } from 'react';
import {
  Calendar,
  Clock,
  Tag,
  Share2,
  Globe,
  Linkedin,
  Facebook,
  Instagram,
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import type { BlogPost, BlogPublisher } from '../actions/blogActions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// X (Twitter) icon component
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Publisher Social Links Component
const PublisherSocialLinks = ({ publisher }: { publisher: BlogPublisher }) => {
  const socialLinks = [
    { url: publisher.publisherSocialX, icon: XIcon, label: 'X (Twitter)' },
    {
      url: publisher.publisherSocialLinkedin,
      icon: Linkedin,
      label: 'LinkedIn',
    },
    {
      url: publisher.publisherSocialFacebook,
      icon: Facebook,
      label: 'Facebook',
    },
    {
      url: publisher.publisherSocialInstagram,
      icon: Instagram,
      label: 'Instagram',
    },
    { url: publisher.publisherWebsite, icon: Globe, label: 'Website' },
  ].filter((link) => link.url);

  if (socialLinks.length === 0) return null;

  return (
    <div className="mt-3 flex items-center gap-3">
      {socialLinks.map((link) => (
        <a
          key={link.label}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 transition-colors hover:text-blue-400"
          title={link.label}
        >
          <link.icon className="h-5 w-5" />
        </a>
      ))}
    </div>
  );
};

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

interface BlogDetailProps {
  post: BlogPost;
  relatedPosts?: BlogPost[];
  onBack?: () => void;
  onSelectPost?: (slug: string) => void;
}

export default function BlogDetail({
  post,
  relatedPosts = [],
  onBack,
  onSelectPost,
}: BlogDetailProps) {
  const router = useRouter();

  // Fallback handlers if none provided
  const handleBackClick = onBack ?? (() => router.back());
  const handleSelectPostClick =
    onSelectPost ?? ((s: string) => router.push(`/blog/${s}`));

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

  // Check if content is HTML
  const isHtmlContent = (content: string) => {
    return /<[a-z][\s\S]*>/i.test(content);
  };

  return (
    <div className="bg-slate-900">
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

          {/* Publisher/Author and Actions */}
          <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <ImageWithFallback
                src={post.author.avatar}
                alt={post.author.name}
                className="h-12 w-12 rounded-full object-cover"
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
          {post.tags && post.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="inline-block"
                >
                  <Badge
                    variant="outline"
                    className="cursor-pointer border-slate-600 text-slate-300 transition-colors hover:border-blue-500 hover:bg-blue-600/20 hover:text-blue-400"
                  >
                    <Tag className="mr-1 h-3 w-3" />
                    {tag}
                  </Badge>
                </Link>
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
          {post.tags && post.tags.length > 0 && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="text-slate-400">Tagged with:</span>
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="inline-block"
                >
                  <Badge
                    variant="outline"
                    className="cursor-pointer border-slate-600 text-slate-300 transition-colors hover:border-blue-500 hover:bg-blue-600/20 hover:text-blue-400"
                  >
                    <Tag className="mr-1 h-3 w-3" />
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          )}

          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <ImageWithFallback
                src={post.author.avatar}
                alt={post.author.name}
                className="h-20 w-20 flex-shrink-0 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="mb-1 text-lg text-white">
                  About {post.author.name}
                </h3>
                <p className="mb-2 text-sm text-slate-300">
                  {post.author.role}
                </p>
                {post.publisher?.publisherBio && (
                  <p className="text-sm leading-relaxed text-slate-400">
                    {post.publisher.publisherBio}
                  </p>
                )}
                {post.publisher && (
                  <PublisherSocialLinks publisher={post.publisher} />
                )}
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
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="block"
                >
                  <Card className="group h-full cursor-pointer border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 hover:border-white/20">
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
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
