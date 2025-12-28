'use client';
import { useState, useMemo } from 'react';
import {
  Search,
  Calendar,
  Clock,
  User,
  Tag,
  Filter,
  ChevronDown,
  TrendingUp,
  BookOpen,
  Users,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import type { ImgHTMLAttributes } from 'react';
import type { StaticImageData } from 'next/image';
import type { BlogPost } from '../actions/blogActions';
import Link from 'next/link';

// Blog categories
const blogCategories = [
  'All',
  'Import Guide',
  'Business Tips',
  'Sourcing Gadgets',
];

// Helper functions
function getFeaturedPosts(posts: BlogPost[]): BlogPost[] {
  return posts.filter((post) => post.featured).slice(0, 3);
}

function getBlogPostsByCategory(
  posts: BlogPost[],
  category: string,
): BlogPost[] {
  if (category === 'All') return posts;
  return posts.filter((post) => post.category === category);
}

function searchBlogPosts(posts: BlogPost[], query: string): BlogPost[] {
  const lowerQuery = query.toLowerCase();
  return posts.filter(
    (post) =>
      post.title.toLowerCase().includes(lowerQuery) ||
      post.excerpt.toLowerCase().includes(lowerQuery) ||
      post.content.toLowerCase().includes(lowerQuery) ||
      post.author.name.toLowerCase().includes(lowerQuery) ||
      post.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
  );
}

// Lightweight image component that supports StaticImageData and provides a simple fallback
type ImageSource = string | StaticImageData;

type ImageWithFallbackProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'src'
> & {
  src: ImageSource;
  fallbackSrc?: string;
};

function ImageWithFallback({
  src,
  alt = '',
  fallbackSrc,
  ...props
}: ImageWithFallbackProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(
    typeof src === 'string' ? src : src.src,
  );
  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={() => {
        if (fallbackSrc && currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
      }}
      {...props}
    />
  );
}

// Interface for optional navigation props
interface BlogListProps {
  blogPosts: BlogPost[];
  initialTag?: string;
}

export default function BlogList({
  blogPosts,
  initialTag,
}: BlogListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState<string | null>(
    initialTag || null,
  );
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>(
    'newest',
  );

  // Get all unique tags from blog posts
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    blogPosts.forEach((post) => {
      post.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [blogPosts]);

  // Handle tag click - filter posts by tag
  const handleTagClick = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setSelectedTag(selectedTag === tag ? null : tag);
    setSearchQuery('');
    setSelectedCategory('All');
  };

  // Clear tag filter
  const clearTagFilter = () => {
    setSelectedTag(null);
  };

  const filteredPosts = useMemo(() => {
    let posts = blogPosts;

    // Filter by tag first if selected
    if (selectedTag) {
      posts = posts.filter((post) =>
        post.tags.some(
          (tag) => tag.toLowerCase() === selectedTag.toLowerCase(),
        ),
      );
    } else if (searchQuery) {
      posts = searchBlogPosts(posts, searchQuery);
    } else {
      posts = getBlogPostsByCategory(posts, selectedCategory);
    }

    // Sort posts
    switch (sortBy) {
      case 'newest':
        posts = [...posts].sort(
          (a, b) =>
            new Date(b.publishDate).getTime() -
            new Date(a.publishDate).getTime(),
        );
        break;
      case 'oldest':
        posts = [...posts].sort(
          (a, b) =>
            new Date(a.publishDate).getTime() -
            new Date(b.publishDate).getTime(),
        );
        break;
      case 'popular':
        posts = [...posts].sort((a, b) => b.readTime - a.readTime);
        break;
    }

    return posts;
  }, [searchQuery, selectedCategory, selectedTag, sortBy, blogPosts]);

  const featuredPosts = getFeaturedPosts(blogPosts).slice(0, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Calculate blog stats
  const totalArticles = blogPosts.length;
  const totalReadTime = blogPosts.reduce((acc, post) => acc + post.readTime, 0);
  const categoriesCount = blogCategories.length - 1; // Exclude "All"

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-slate-900/90"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>

          {/* Floating Elements */}
          <div className="absolute left-10 top-20 h-2 w-2 animate-pulse rounded-full bg-blue-400/30"></div>
          <div
            className="absolute right-20 top-32 h-1 w-1 animate-pulse rounded-full bg-purple-400/40"
            style={{ animationDelay: '1s' }}
          ></div>
          <div
            className="absolute bottom-40 left-16 h-1.5 w-1.5 animate-pulse rounded-full bg-blue-300/20"
            style={{ animationDelay: '2s' }}
          ></div>
          <div
            className="absolute right-32 top-40 h-1 w-1 animate-pulse rounded-full bg-purple-300/30"
            style={{ animationDelay: '3s' }}
          ></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
          {/* Header Content */}
          <div className="mb-12 text-center lg:mb-16">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-600/20 px-4 py-2 backdrop-blur-sm">
              <BookOpen className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">
                Import Insights & Expert Guides
              </span>
            </div>

            {/* Main Title */}
            <h1 className="mb-6 bg-gradient-to-r from-white via-blue-100 to-slate-300 bg-clip-text text-3xl leading-tight text-transparent sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              Import Insights{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Blog
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-3xl px-4 text-base leading-relaxed text-slate-300 sm:px-0 sm:text-lg lg:text-xl">
              Master the art of international trade with expert insights,
              success stories, and practical guides to help you build a thriving
              import business.
            </p>

            {/* Stats Row */}
            <div className="mx-auto mb-10 grid max-w-2xl grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm lg:p-6">
                <div className="mb-2 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-blue-400 sm:h-6 sm:w-6" />
                </div>
                <div className="mb-1 text-xl text-white sm:text-2xl lg:text-3xl">
                  {totalArticles}+
                </div>
                <div className="text-xs text-slate-400 sm:text-sm">
                  Articles
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm lg:p-6">
                <div className="mb-2 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-purple-400 sm:h-6 sm:w-6" />
                </div>
                <div className="mb-1 text-xl text-white sm:text-2xl lg:text-3xl">
                  {totalReadTime}+
                </div>
                <div className="text-xs text-slate-400 sm:text-sm">
                  Min Read
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm lg:p-6">
                <div className="mb-2 flex items-center justify-center">
                  <Tag className="h-5 w-5 text-green-400 sm:h-6 sm:w-6" />
                </div>
                <div className="mb-1 text-xl text-white sm:text-2xl lg:text-3xl">
                  {categoriesCount}
                </div>
                <div className="text-xs text-slate-400 sm:text-sm">
                  Categories
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Search and Filter Section */}
          <div className="mx-auto max-w-4xl">
            {/* Mobile-First Search Bar */}
            <div className="mb-6 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md sm:p-6">
              <div className="space-y-4">
                {/* Search Input - Full Width on Mobile */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-slate-300" />
                  <Input
                    placeholder="Search articles, authors, or topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="rounded-xl border-white/20 bg-white/10 py-3 pl-12 pr-4 text-base text-white placeholder-slate-300 focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>

                {/* Filter Row - Responsive Layout */}
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                  {/* Category Filter */}
                  <div className="flex-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex w-full items-center justify-between gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white transition-colors hover:bg-white/20">
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          <span className="text-sm sm:text-base">
                            {selectedCategory}
                          </span>
                        </div>
                        <ChevronDown className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56 border-slate-700 bg-slate-800">
                        {blogCategories.map((category) => (
                          <DropdownMenuItem
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className="cursor-pointer text-white hover:bg-slate-700"
                          >
                            {category}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Sort Options */}
                  <div className="flex-1 sm:flex-none">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex w-full items-center justify-between gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white transition-colors hover:bg-white/20 sm:w-auto">
                        <span className="text-sm sm:text-base">
                          Sort:{' '}
                          {sortBy === 'newest'
                            ? 'Newest'
                            : sortBy === 'oldest'
                              ? 'Oldest'
                              : 'Popular'}
                        </span>
                        <ChevronDown className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-48 border-slate-700 bg-slate-800">
                        <DropdownMenuItem
                          onClick={() => setSortBy('newest')}
                          className="cursor-pointer text-white hover:bg-slate-700"
                        >
                          Newest First
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setSortBy('oldest')}
                          className="cursor-pointer text-white hover:bg-slate-700"
                        >
                          Oldest First
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setSortBy('popular')}
                          className="cursor-pointer text-white hover:bg-slate-700"
                        >
                          Most Popular
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Quick Category Pills */}
                <div className="flex flex-wrap gap-2">
                  {blogCategories.slice(1, 5).map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`rounded-full px-3 py-1.5 text-xs transition-colors sm:text-sm ${
                        selectedCategory === category
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/10 text-slate-300 hover:bg-white/20'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Summary */}
            {(searchQuery || selectedCategory !== 'All' || selectedTag) && (
              <div className="mb-8 text-center">
                <p className="text-slate-300">
                  {selectedTag ? (
                    <span className="inline-flex items-center gap-2">
                      Showing{' '}
                      <span className="font-medium text-blue-400">
                        {filteredPosts.length}
                      </span>{' '}
                      articles tagged with{' '}
                      <Badge
                        className="cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
                        onClick={clearTagFilter}
                      >
                        <Tag className="mr-1 h-3 w-3" />
                        {selectedTag}
                        <span className="ml-1 text-xs">×</span>
                      </Badge>
                    </span>
                  ) : searchQuery ? (
                    <>
                      Found{' '}
                      <span className="font-medium text-blue-400">
                        {filteredPosts.length}
                      </span>{' '}
                      articles for "
                      <span className="text-white">{searchQuery}</span>"
                    </>
                  ) : (
                    <>
                      Showing{' '}
                      <span className="font-medium text-blue-400">
                        {filteredPosts.length}
                      </span>{' '}
                      articles in{' '}
                      <span className="text-white">{selectedCategory}</span>
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Featured Posts Section */}
      {searchQuery === '' && selectedCategory === 'All' && (
        <section className="bg-gradient-to-b from-slate-900 to-slate-800 py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center lg:mb-16">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-600/20 px-4 py-2 backdrop-blur-sm">
                <TrendingUp className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-medium text-yellow-300">
                  Featured Content
                </span>
              </div>
              <h2 className="mb-4 text-2xl text-white sm:text-3xl lg:text-4xl">
                Must-Read Articles
              </h2>
              <p className="mx-auto max-w-2xl text-base text-slate-300 sm:text-lg">
                Don't miss these essential reads for import professionals
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {featuredPosts.map((post, index) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="block"
                >
                  <Card className="group h-full cursor-pointer overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 hover:border-white/20">
                    <div className="relative overflow-hidden">
                      <ImageWithFallback
                        src={post.image}
                        alt={post.title}
                        className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105 sm:h-52 lg:h-48"
                      />
                      <div className="absolute left-4 top-4">
                        <Badge className="bg-blue-600 px-3 py-1 text-xs text-white sm:text-sm">
                          Featured
                        </Badge>
                      </div>
                      <div className="absolute right-4 top-4">
                        <div className="rounded-full bg-black/50 px-2 py-1 backdrop-blur-sm">
                          <span className="text-xs text-white">{index + 1}</span>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-4 sm:p-6">
                      <div className="mb-3 flex items-center gap-3 text-xs text-slate-400 sm:gap-4 sm:text-sm">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                          {formatDate(post.publishDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                          {post.readTime} min
                        </span>
                      </div>

                      <h3 className="mb-3 text-lg leading-tight text-white transition-colors group-hover:text-blue-400 sm:text-xl">
                        {post.title}
                      </h3>

                      <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                        {post.excerpt}
                      </p>

                      {/* Tags */}
                      {post.tags.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-1.5">
                          {post.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className={`cursor-pointer border-slate-600 text-xs transition-colors hover:border-blue-500 hover:bg-blue-600/20 hover:text-blue-400 ${
                                selectedTag === tag
                                  ? 'border-blue-500 bg-blue-600/20 text-blue-400'
                                  : 'text-slate-300'
                              }`}
                              onClick={(e) => handleTagClick(tag, e)}
                            >
                              <Tag className="mr-1 h-2.5 w-2.5" />
                              {tag}
                            </Badge>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="text-xs text-slate-500">
                              +{post.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <ImageWithFallback
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="h-8 w-8 rounded-full"
                          />
                          <div>
                            <p className="text-sm text-white">
                              {post.author.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {post.author.role}
                            </p>
                          </div>
                        </div>

                        <Badge
                          variant="secondary"
                          className="bg-slate-700 text-xs text-slate-300"
                        >
                          {post.category}
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

      {/* All Posts Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between lg:mb-12">
            <div>
              <h2 className="mb-2 text-2xl text-white sm:text-3xl">
                {searchQuery
                  ? `Search Results (${filteredPosts.length})`
                  : 'All Articles'}
              </h2>
              {selectedCategory !== 'All' && (
                <p className="text-slate-300">
                  Showing articles in:{' '}
                  <span className="text-blue-400">{selectedCategory}</span>
                </p>
              )}
            </div>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="block"
                >
                  <Card className="group h-full cursor-pointer overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 hover:border-white/20">
                    <div className="relative overflow-hidden">
                      <ImageWithFallback
                        src={post.image}
                        alt={post.title}
                        className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105 sm:h-52 lg:h-48"
                      />
                      {post.featured && (
                        <div className="absolute left-4 top-4">
                          <Badge className="bg-blue-600 text-xs text-white">
                            Featured
                          </Badge>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-4 sm:p-6">
                      <div className="mb-3 flex items-center gap-3 text-xs text-slate-400 sm:gap-4 sm:text-sm">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                          {formatDate(post.publishDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                          {post.readTime} min
                        </span>
                      </div>

                      <h3 className="mb-3 line-clamp-2 text-lg leading-tight text-white transition-colors group-hover:text-blue-400 sm:text-xl">
                        {post.title}
                      </h3>

                      <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                        {post.excerpt}
                      </p>

                      {/* Tags */}
                      {post.tags.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-1.5">
                          {post.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className={`cursor-pointer border-slate-600 text-xs transition-colors hover:border-blue-500 hover:bg-blue-600/20 hover:text-blue-400 ${
                                selectedTag === tag
                                  ? 'border-blue-500 bg-blue-600/20 text-blue-400'
                                  : 'text-slate-300'
                              }`}
                              onClick={(e) => handleTagClick(tag, e)}
                            >
                              <Tag className="mr-1 h-2.5 w-2.5" />
                              {tag}
                            </Badge>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="text-xs text-slate-500">
                              +{post.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ImageWithFallback
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="h-8 w-8 rounded-full"
                          />
                          <div>
                            <p className="text-sm text-white">
                              {post.author.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {post.author.role}
                            </p>
                          </div>
                        </div>

                        <Badge
                          variant="secondary"
                          className="bg-slate-700 text-xs text-slate-300"
                        >
                          {post.category}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
                <Search className="mx-auto mb-4 h-16 w-16 text-slate-400" />
                <h3 className="mb-2 text-xl text-white">
                  {blogPosts.length === 0
                    ? 'No blog posts published yet'
                    : 'No articles found'}
                </h3>
                <p className="mb-6 text-slate-300">
                  {blogPosts.length === 0
                    ? 'Check back soon for exciting content about importing and international trade.'
                    : 'Try adjusting your search terms or browse all categories'}
                </p>
                {blogPosts.length > 0 && (
                  <Button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setSelectedTag(null);
                    }}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    View All Articles
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
