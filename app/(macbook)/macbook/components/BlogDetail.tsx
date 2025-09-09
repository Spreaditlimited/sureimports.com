import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, Clock, User, Tag, Share2, BookOpen, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { getBlogPostBySlug, blogPosts, type BlogPost } from "./BlogData";

interface BlogDetailProps {
  slug: string;
  onBack: () => void;
  onSelectPost: (slug: string) => void;
}

export default function BlogDetail({ slug, onBack, onSelectPost }: BlogDetailProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const foundPost = getBlogPostBySlug(slug);
    if (foundPost) {
      setPost(foundPost);
      
      // Get related posts (same category, excluding current post)
      const related = blogPosts
        .filter(p => p.category === foundPost.category && p.id !== foundPost.id)
        .slice(0, 3);
      setRelatedPosts(related);
    }
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", 
      day: "numeric"
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Article not found</h1>
          <Button onClick={onBack} className="bg-blue-600 hover:bg-blue-700 text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
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
          return <h1 key={index} className="text-3xl md:text-4xl text-white mb-6 mt-8">{line.slice(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl md:text-3xl text-white mb-4 mt-8">{line.slice(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl md:text-2xl text-white mb-3 mt-6">{line.slice(4)}</h3>;
        }
        
        // Bold text
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={index} className="text-white mb-4"><strong>{line.slice(2, -2)}</strong></p>;
        }
        
        // Lists
        if (line.startsWith('- ')) {
          return <li key={index} className="text-slate-300 mb-2 ml-4">{line.slice(2)}</li>;
        }
        
        // Regular paragraphs - check for HTML anchor tags
        if (line.trim() && !line.startsWith('#')) {
          // Check if line contains HTML anchor tags
          if (line.includes('<a href=')) {
            // Parse the line to handle anchor tags with proper styling
            const styledLine = line.replace(
              /<a href="([^"]*)"([^>]*)>/g, 
              '<a href="$1"$2 style="color: #60a5fa; text-decoration: underline; transition: color 0.2s ease;" onmouseover="this.style.color=\'#93c5fd\'" onmouseout="this.style.color=\'#60a5fa\'">'
            );
            return (
              <p key={index} className="text-slate-300 mb-4 leading-relaxed" 
                 dangerouslySetInnerHTML={{ __html: styledLine }} />
            );
          }
          return <p key={index} className="text-slate-300 mb-4 leading-relaxed">{line}</p>;
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            onClick={onBack}
            variant="ghost" 
            className="text-slate-300 hover:text-white hover:bg-white/10 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Image */}
        <div className="relative overflow-hidden rounded-xl mb-8">
          <ImageWithFallback
            src={post.image}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover"
          />
          {post.featured && (
            <div className="absolute top-6 left-6">
              <Badge className="bg-blue-600 text-white text-sm px-3 py-1">Featured Article</Badge>
            </div>
          )}
        </div>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-slate-400">
            <Badge variant="secondary" className="bg-blue-600/20 text-blue-400 border-blue-600/30">
              {post.category}
            </Badge>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(post.publishDate)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.readTime} min read
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl text-white mb-6 leading-tight">
            {post.title}
          </h1>

          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Author and Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <ImageWithFallback
                src={post.author.avatar}
                alt={post.author.name}
                className="w-12 h-12 rounded-full"
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
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-6">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-invert prose-slate max-w-none">
          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-8 md:p-12 blog-content">
            {formatContent(post.content)}
          </div>
        </div>

        {/* Article Footer */}
        <footer className="mt-12 pt-8 border-t border-slate-700">
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-slate-400">Tagged with:</span>
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="border-slate-600 text-slate-300">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
            <div className="flex items-center gap-4">
              <ImageWithFallback
                src={post.author.avatar}
                alt={post.author.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="text-lg text-white mb-1">About {post.author.name}</h3>
                <p className="text-slate-300 text-sm mb-2">{post.author.role}</p>
                <p className="text-slate-400 text-sm">
                  Ijeoma is a content strategist and storyteller who helps entrepreneurs and brands turn their authentic stories into powerful growth tools. She blends strategy with creativity, analyzing backend business operations to craft content that connects, influences, and inspires.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </article>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="bg-gradient-to-b from-slate-800 to-slate-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl text-white mb-4">Related Articles</h2>
              <p className="text-slate-300">Continue reading with these related posts</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Card 
                  key={relatedPost.id}
                  className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group"
                  onClick={() => onSelectPost(relatedPost.slug)}
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <ImageWithFallback
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-3 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(relatedPost.publishDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {relatedPost.readTime} min read
                      </span>
                    </div>
                    
                    <h3 className="text-lg text-white group-hover:text-blue-400 transition-colors line-clamp-2 mb-3">
                      {relatedPost.title}
                    </h3>
                    
                    <p className="text-slate-300 text-sm line-clamp-3 mb-4">
                      {relatedPost.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ImageWithFallback
                          src={relatedPost.author.avatar}
                          alt={relatedPost.author.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-xs text-slate-400">{relatedPost.author.name}</span>
                      </div>
                      <Badge variant="secondary" className="bg-slate-700 text-slate-300 text-xs">
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