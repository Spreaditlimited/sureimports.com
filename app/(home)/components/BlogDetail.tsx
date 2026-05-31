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
  CheckCircle2,
  Link as LinkIcon
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import type { BlogPost, BlogPublisher } from '../actions/blogActions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

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
    { url: publisher.publisherSocialLinkedin, icon: Linkedin, label: 'LinkedIn' },
    { url: publisher.publisherSocialFacebook, icon: Facebook, label: 'Facebook' },
    { url: publisher.publisherSocialInstagram, icon: Instagram, label: 'Instagram' },
    { url: publisher.publisherWebsite, icon: Globe, label: 'Website' },
  ].filter((link) => link.url);

  if (socialLinks.length === 0) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {socialLinks.map((link) => (
        <a
          key={link.label}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800/50 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400"
          title={link.label}
        >
          <link.icon className="h-4 w-4" />
        </a>
      ))}
    </div>
  );
};

// Lightweight local ImageWithFallback component
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
}: BlogDetailProps) {
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
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  const isHtmlContent = (content: string) => {
    return /<[a-z][\s\S]*>/i.test(content);
  };

  return (
    <div className="bg-[#fcfcfd] dark:bg-slate-950 pb-24">
      <article className="mx-auto max-w-4xl px-4 pt-48 sm:px-6 lg:px-8">
        
        {/* Article Header */}
        <header className="mb-12 text-center">
          <div className="mb-6 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[10px] uppercase tracking-widest text-indigo-600 dark:border-indigo-900/30 dark:bg-indigo-900/20 dark:text-indigo-400">
              {post.category}
            </span>
            <span className="flex items-center gap-1.5 uppercase tracking-widest">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(post.publishDate)}
            </span>
            <span className="flex items-center gap-1.5 uppercase tracking-widest">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime} min read
            </span>
          </div>

          <h1 className="mb-8 text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl leading-[1.1]">
            {post.title}
          </h1>

          <p className="mx-auto max-w-3xl text-xl font-medium leading-relaxed text-slate-500 dark:text-slate-400">
            {post.excerpt}
          </p>

          {/* Author Bento Box */}
          <div className="mx-auto mt-12 flex max-w-2xl flex-col items-center justify-between gap-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 sm:flex-row sm:px-8">
            <div className="flex items-center gap-4 text-left">
              <ImageWithFallback
                src={post.author.avatar}
                alt={post.author.name}
                className="h-14 w-14 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
              />
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{post.author.name}</p>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{post.author.role}</p>
              </div>
            </div>

            <Button
              onClick={handleShare}
              className="h-12 w-full rounded-xl bg-slate-50 border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 hover:text-indigo-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-indigo-400 sm:w-auto px-6"
            >
              <Share2 className="mr-2 h-4 w-4" /> Share Article
            </Button>
          </div>
        </header>

        {/* Hero Image */}
        <div className="relative mb-16 overflow-hidden rounded-[40px] border border-slate-200 bg-slate-50 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <ImageWithFallback
            src={post.image}
            alt={post.title}
            className="h-[300px] w-full object-cover md:h-[500px]"
          />
          {post.featured && (
            <div className="absolute left-6 top-6">
              <Badge className="bg-brand-orange-500 hover:bg-brand-orange-600 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white border-0 shadow-lg">
                Featured Report
              </Badge>
            </div>
          )}
        </div>

        {/* Article Content */}
        <div className="mx-auto max-w-3xl">
          <div className="blog-html-content">
            {isHtmlContent(post.content) ? (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
              <div className="whitespace-pre-wrap">
                {post.content}
              </div>
            )}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-16 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-8 dark:border-slate-800">
              <span className="mr-2 text-sm font-bold uppercase tracking-widest text-slate-400">Filed Under:</span>
              {post.tags.map((tag) => (
                <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                  <span className="inline-flex cursor-pointer items-center rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400">
                    <Tag className="mr-1.5 h-3 w-3" /> {tag}
                  </span>
                </Link>
              ))}
            </div>
          )}

          {/* Publisher Bio Box */}
          <div className="mt-16 rounded-[32px] border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-900/50 sm:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <ImageWithFallback
                src={post.author.avatar}
                alt={post.author.name}
                className="h-24 w-24 flex-shrink-0 rounded-[24px] object-cover ring-1 ring-slate-200 dark:ring-slate-700"
              />
              <div className="flex-1">
                <h3 className="mb-1 text-xl font-bold text-slate-900 dark:text-white">
                  Written by {post.author.name}
                </h3>
                <p className="mb-4 text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  {post.author.role}
                </p>
                {post.publisher?.publisherBio && (
                  <p className="text-base font-medium leading-relaxed text-slate-600 dark:text-slate-400">
                    {post.publisher.publisherBio}
                  </p>
                )}
                {post.publisher && (
                  <PublisherSocialLinks publisher={post.publisher} />
                )}
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Blog HTML Content Styles (Dark & Light Mode Support) */}
      <style jsx global>{`
        .blog-html-content {
          font-family: inherit;
          font-size: 1.125rem; /* 18px */
          line-height: 2; /* 36px */
          color: #475569; /* slate-600 */
        }
        
        .dark .blog-html-content {
          color: #cbd5e1; /* slate-300 */
        }

        .blog-html-content h2 {
          font-size: 2rem;
          font-weight: 900;
          color: #0f172a; /* slate-900 */
          margin-top: 3.5rem;
          margin-bottom: 1.5rem;
          line-height: 1.3;
          letter-spacing: -0.025em;
        }

        .dark .blog-html-content h2 {
          color: #ffffff;
        }

        .blog-html-content h3 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #1e293b; /* slate-800 */
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          line-height: 1.4;
        }

        .dark .blog-html-content h3 {
          color: #f8fafc; /* slate-50 */
        }

        .blog-html-content p {
          margin-bottom: 1.5rem;
        }

        .blog-html-content strong,
        .blog-html-content b {
          font-weight: 700;
          color: #0f172a;
        }

        .dark .blog-html-content strong,
        .dark .blog-html-content b {
          color: #ffffff;
        }

        .blog-html-content a {
          color: #4f46e5; /* indigo-600 */
          font-weight: 600;
          text-decoration-line: underline;
          text-decoration-color: #c7d2fe;
          text-decoration-thickness: 2px;
          text-underline-offset: 4px;
          transition: all 0.2s ease;
        }
        
        .dark .blog-html-content a {
          color: #818cf8; /* indigo-400 */
          text-decoration-color: #3730a3;
        }

        .blog-html-content a:hover {
          color: #4338ca;
          text-decoration-color: #4f46e5;
        }

        .dark .blog-html-content a:hover {
          color: #a5b4fc;
          text-decoration-color: #818cf8;
        }

        /* Blockquotes - Notion Style */
        .blog-html-content blockquote {
          border-left: 4px solid #4f46e5; /* indigo-600 */
          background: #eef2ff; /* indigo-50 */
          padding: 1.5rem 2rem;
          border-radius: 0 1rem 1rem 0;
          margin: 2.5rem 0;
          font-style: italic;
          color: #312e81; /* indigo-900 */
          font-weight: 500;
          font-size: 1.25rem;
        }

        .dark .blog-html-content blockquote {
          border-left-color: #6366f1; /* indigo-500 */
          background: rgba(79, 70, 229, 0.1);
          color: #c7d2fe; /* indigo-200 */
        }

        .blog-html-content blockquote p {
          margin-bottom: 0;
        }

        /* Lists */
        .blog-html-content ul {
          list-style: none;
          padding-left: 0.5rem;
          margin-bottom: 2rem;
          margin-top: 1rem;
        }

        .blog-html-content ul li {
          position: relative;
          padding-left: 2rem;
          margin-bottom: 0.75rem;
        }

        .blog-html-content ul li::before {
          content: '•';
          position: absolute;
          left: 0.5rem;
          color: #4f46e5; /* indigo-600 */
          font-weight: 900;
          font-size: 1.5rem;
          line-height: 1.5rem;
        }

        .dark .blog-html-content ul li::before {
          color: #818cf8;
        }

        .blog-html-content ol {
          padding-left: 1.5rem;
          margin-bottom: 2rem;
          margin-top: 1rem;
        }

        .blog-html-content ol li {
          margin-bottom: 0.75rem;
          padding-left: 0.5rem;
        }

        .blog-html-content ol li::marker {
          color: #4f46e5;
          font-weight: 700;
        }

        .dark .blog-html-content ol li::marker {
          color: #818cf8;
        }

        /* Images inside content */
        .blog-html-content img {
          max-width: 100%;
          height: auto;
          border-radius: 1.5rem;
          margin: 2.5rem 0;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }

        .dark .blog-html-content img {
          border-color: #1e293b;
        }
      `}</style>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="mt-16 bg-slate-50 border-t border-slate-200 py-16 dark:bg-slate-900/50 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-black text-slate-900 dark:text-white">Keep Reading</h2>
              <p className="text-lg font-medium text-slate-500 dark:text-slate-400">
                Explore more insights on this topic
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`} className="block h-full outline-none">
                  <article className="group h-full flex flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:shadow-none">
                    
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <ImageWithFallback
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute left-4 top-4">
                        <Badge className="bg-white/90 text-slate-900 hover:bg-white border-0 shadow-sm backdrop-blur-sm dark:bg-slate-900/90 dark:text-white">
                          {relatedPost.category}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-6 sm:p-8">
                      <div className="mb-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{formatDate(relatedPost.publishDate)}</span>
                        <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{relatedPost.readTime} min</span>
                      </div>

                      <h3 className="mb-4 text-xl font-bold leading-snug text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                        {relatedPost.title}
                      </h3>

                      <p className="mb-6 flex-1 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        {relatedPost.excerpt}
                      </p>

                      <div className="flex items-center justify-between border-t border-slate-100 pt-6 dark:border-slate-800 mt-auto">
                        <div className="flex items-center gap-3">
                          <ImageWithFallback src={relatedPost.author.avatar} alt={relatedPost.author.name} className="h-10 w-10 rounded-full border border-slate-200 dark:border-slate-700" />
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{relatedPost.author.name}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
