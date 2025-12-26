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
import Image from 'next/image';
import { getBlogPostBySlug, blogPosts, type BlogPost } from './BlogData';

interface BlogDetailProps {
  slug: string;
  onBack: () => void;
  onSelectPost: (slug: string) => void;
}

export default function BlogDetail({
  slug,
  onBack,
  onSelectPost,
}: BlogDetailProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const foundPost = getBlogPostBySlug(slug);
    if (foundPost) {
      setPost(foundPost);

      // Get related posts (same category, excluding current post)
      const related = blogPosts
        .filter(
          (p) => p.category === foundPost.category && p.id !== foundPost.id,
        )
        .slice(0, 3);
      setRelatedPosts(related);
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

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="text-center">
          <h1 className="mb-4 text-2xl text-white">Article not found</h1>
          <Button
            onClick={onBack}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  // Parse markdown-like content to HTML
  const formatContent = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        // Headers
        if (line.startsWith('# ')) {
          return (
            <h1
              key={index}
              className="mb-6 mt-8 text-3xl text-white md:text-4xl"
            >
              {line.slice(2)}
            </h1>
          );
        }
        if (line.startsWith('## ')) {
          return (
            <h2
              key={index}
              className="mb-4 mt-8 text-2xl text-white md:text-3xl"
            >
              {line.slice(3)}
            </h2>
          );
        }
        if (line.startsWith('### ')) {
          return (
            <h3
              key={index}
              className="mb-3 mt-6 text-xl text-white md:text-2xl"
            >
              {line.slice(4)}
            </h3>
          );
        }

        // Bold text
        if (line.startsWith('**') && line.endsWith('**')) {
          return (
            <p key={index} className="mb-4 text-white">
              <strong>{line.slice(2, -2)}</strong>
            </p>
          );
        }

        // Lists
        if (line.startsWith('- ')) {
          return (
            <li key={index} className="mb-2 ml-4 text-slate-300">
              {line.slice(2)}
            </li>
          );
        }

        // Regular paragraphs - check for HTML anchor tags
        if (line.trim() && !line.startsWith('#')) {
          // Check if line contains HTML anchor tags
          if (line.includes('<a href=')) {
            // Parse the line to handle anchor tags with proper styling
            const styledLine = line.replace(
              /<a href="([^"]*)"([^>]*)>/g,
              '<a href="$1"$2 style="color: #60a5fa; text-decoration: underline; transition: color 0.2s ease;" onmouseover="this.style.color=\'#93c5fd\'" onmouseout="this.style.color=\'#60a5fa\'">',
            );
            return (
              <p
                key={index}
                className="mb-4 leading-relaxed text-slate-300"
                dangerouslySetInnerHTML={{ __html: styledLine }}
              />
            );
          }
          return (
            <p key={index} className="mb-4 leading-relaxed text-slate-300">
              {line}
            </p>
          );
        }

        // Empty lines
        if (!line.trim()) {
          return <div key={index} className="mb-2"></div>;
        }

        return null;
      })
      .filter(Boolean);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Button
            onClick={onBack}
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
          <Image
            src={post.image}
            alt={post.title}
            width={800}
            height={400}
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
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={48}
                height={48}
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
          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Tag className="mr-1 h-3 w-3" />
                {tag}
              </Badge>
            ))}
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-invert prose-slate max-w-none">
          <div className="blog-content rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-md md:p-12">
            {formatContent(post.content)}
          </div>
        </div>

        {/* Article Footer */}
        <footer className="mt-12 border-t border-slate-700 pt-8">
          <div className="mb-6 flex flex-wrap gap-2">
            <span className="text-slate-400">Tagged with:</span>
            {post.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="border-slate-600 text-slate-300"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={64}
                height={64}
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
                  onClick={() => onSelectPost(relatedPost.slug)}
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      width={400}
                      height={200}
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
                        <Image
                          src={relatedPost.author.avatar}
                          alt={relatedPost.author.name}
                          width={24}
                          height={24}
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
