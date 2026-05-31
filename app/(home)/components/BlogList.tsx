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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import type { ImgHTMLAttributes } from 'react';
import type { StaticImageData } from 'next/image';
import type { BlogListPost } from '../actions/blogActions';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';

// Blog categories
const blogCategories = [
  'All',
  'Import Guide',
  'Business Tips',
  'Sourcing Gadgets',
];

function getBlogPostsByCategory(
  posts: BlogListPost[],
  category: string,
): BlogListPost[] {
  if (category === 'All') return posts;
  return posts.filter((post) => post.category === category);
}

function searchBlogPosts(posts: BlogListPost[], query: string): BlogListPost[] {
  const lowerQuery = query.toLowerCase();
  return posts.filter(
    (post) =>
      post.title.toLowerCase().includes(lowerQuery) ||
      post.excerpt.toLowerCase().includes(lowerQuery) ||
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
  blogPosts: BlogListPost[];
  featuredPosts: BlogListPost[];
  initialTag?: string;
  currentPage: number;
  totalPages: number;
  totalPosts: number;
}

export default function BlogList({
  blogPosts,
  featuredPosts,
  initialTag,
  currentPage,
  totalPages,
  totalPosts,
}: BlogListProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState<string | null>(
    initialTag || null,
  );
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>(
    'newest',
  );

  // Handle tag click - filter posts by tag
  const handleTagClick = (tag: string, e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const totalReadTime = blogPosts.reduce((acc, post) => acc + post.readTime, 0);
  const categoriesCount = blogCategories.length - 1; 
  
  const buildPageHref = (targetPage: number) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (targetPage <= 1) {
      params.delete('page');
    } else {
      params.set('page', String(targetPage));
    }
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname || '/blog';
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-slate-950">
      
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
        <div className="absolute inset-0 z-0">
          <div className="absolute left-1/2 top-0 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-indigo-600/5 blur-[120px] dark:bg-indigo-600/10" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-48 sm:px-6 lg:px-8">
          
          <div className="mb-12 text-center lg:mb-16">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-indigo-600 dark:border-indigo-900/30 dark:bg-indigo-900/20 dark:text-indigo-400">
              <BookOpen className="h-3.5 w-3.5" />
              Import Insights & Expert Guides
            </div>

            <h1 className="mb-6 text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Import Insights{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-500">
                Blog
              </span>
            </h1>

            <p className="mx-auto mb-12 max-w-3xl text-lg font-medium leading-relaxed text-slate-500 dark:text-slate-400 sm:text-xl">
              Master the art of international trade with expert insights,
              success stories, and practical guides to help you build a thriving
              import business.
            </p>

            {/* Stats Row Bento */}
            <div className="mx-auto mb-10 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
              {[
                { icon: BookOpen, val: `${totalPosts}+`, label: 'Articles Published', color: 'text-indigo-600 dark:text-indigo-400' },
                { icon: Clock, val: `${totalReadTime}+`, label: 'Minutes of Reading', color: 'text-brand-orange-500 dark:text-brand-orange-400' },
                { icon: Tag, val: categoriesCount, label: 'Topics Covered', color: 'text-emerald-600 dark:text-emerald-400' }
              ].map((stat, i) => (
                <div key={i} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                  <div className={`mb-3 flex justify-center ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="mb-1 text-3xl font-black text-slate-900 dark:text-white">
                    {stat.val}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="mx-auto max-w-4xl">
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
              <div className="space-y-4">
                
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-slate-400" />
                  <Input
                    placeholder="Search articles, authors, or topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-14 rounded-2xl border-slate-200 bg-slate-50 pl-12 pr-4 text-base text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white dark:placeholder-slate-500 dark:focus:ring-indigo-400"
                  />
                </div>

                {/* Filter Row */}
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                  <div className="flex-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex h-12 w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-300 dark:hover:bg-slate-800">
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4 text-slate-400" />
                          <span className="text-sm font-semibold sm:text-base">
                            {selectedCategory}
                          </span>
                        </div>
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56 rounded-xl border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-2 shadow-xl">
                        {blogCategories.map((category) => (
                          <DropdownMenuItem
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className="cursor-pointer rounded-lg text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 py-2"
                          >
                            {category}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex-1 sm:flex-none">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex h-12 w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-300 dark:hover:bg-slate-800 sm:w-auto">
                        <span className="text-sm font-semibold sm:text-base">
                          Sort: {sortBy === 'newest' ? 'Newest' : sortBy === 'oldest' ? 'Oldest' : 'Popular'}
                        </span>
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-48 rounded-xl border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-2 shadow-xl">
                        {[
                          { val: 'newest', label: 'Newest First' },
                          { val: 'oldest', label: 'Oldest First' },
                          { val: 'popular', label: 'Most Popular' }
                        ].map(opt => (
                          <DropdownMenuItem
                            key={opt.val}
                            onClick={() => setSortBy(opt.val as any)}
                            className="cursor-pointer rounded-lg text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 py-2"
                          >
                            {opt.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Quick Category Pills */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {blogCategories.slice(1, 5).map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`rounded-lg px-4 py-2 text-xs font-bold transition-all sm:text-sm ${
                        selectedCategory === category
                          ? 'bg-indigo-600 text-white shadow-md dark:bg-indigo-500'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
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
              <div className="mt-8 text-center">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {selectedTag ? (
                    <span className="inline-flex items-center gap-2">
                      Showing{' '}
                      <span className="font-black text-indigo-600 dark:text-indigo-400">
                        {filteredPosts.length}
                      </span>{' '}
                      articles tagged with{' '}
                      <Badge
                        className="cursor-pointer bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50"
                        onClick={clearTagFilter}
                      >
                        <Tag className="mr-1 h-3 w-3" />
                        {selectedTag}
                        <span className="ml-1 text-xs font-black">×</span>
                      </Badge>
                    </span>
                  ) : searchQuery ? (
                    <>
                      Found{' '}
                      <span className="font-black text-indigo-600 dark:text-indigo-400">
                        {filteredPosts.length}
                      </span>{' '}
                      articles for "
                      <span className="text-slate-900 dark:text-white">{searchQuery}</span>"
                    </>
                  ) : (
                    <>
                      Showing{' '}
                      <span className="font-black text-indigo-600 dark:text-indigo-400">
                        {filteredPosts.length}
                      </span>{' '}
                      articles in{' '}
                      <span className="text-slate-900 dark:text-white">{selectedCategory}</span>
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Featured Posts Section */}
      {searchQuery === '' && selectedCategory === 'All' && currentPage === 1 && !selectedTag && (
        <section className="bg-slate-50 border-b border-slate-200 py-16 lg:py-24 dark:bg-slate-900/50 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            
            <div className="mb-12 lg:mb-16">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-orange-200 bg-brand-orange-50 px-3 py-1 dark:border-brand-orange-900/30 dark:bg-brand-orange-900/10">
                <TrendingUp className="h-4 w-4 text-brand-orange-600 dark:text-brand-orange-400" />
                <span className="text-xs font-black uppercase tracking-widest text-brand-orange-700 dark:text-brand-orange-300">
                  Featured Content
                </span>
              </div>
              <h2 className="mb-4 text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">
                Must-Read Articles
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {featuredPosts.map((post, index) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="block h-full outline-none">
                  <article className="group h-full flex flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:shadow-none">
                    
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <ImageWithFallback
                        src={post.image}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute left-4 top-4">
                        <Badge className="bg-brand-orange-500 hover:bg-brand-orange-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white border-0 shadow-md">
                          Featured
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-6 sm:p-8">
                      <div className="mb-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{formatDate(post.publishDate)}</span>
                        <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{post.readTime} min</span>
                      </div>

                      <h3 className="mb-4 text-xl font-bold leading-snug text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                        {post.title}
                      </h3>

                      <p className="mb-6 flex-1 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between border-t border-slate-100 pt-6 dark:border-slate-800 mt-auto">
                        <div className="flex items-center gap-3">
                          <ImageWithFallback src={post.author.avatar} alt={post.author.name} className="h-10 w-10 rounded-full border border-slate-200 dark:border-slate-700" />
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{post.author.name}</p>
                            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{post.author.role}</p>
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

      {/* All Posts Section */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
              {searchQuery ? 'Search Results' : 'Latest Articles'}
            </h2>
          </div>

          {filteredPosts.length > 0 ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {filteredPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="block h-full outline-none">
                    <article className="group h-full flex flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:shadow-none">
                      
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <ImageWithFallback
                          src={post.image}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute left-4 top-4">
                          <Badge className="bg-white/90 text-slate-900 hover:bg-white border-0 shadow-sm backdrop-blur-sm dark:bg-slate-900/90 dark:text-white">
                            {post.category}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col p-6 sm:p-8">
                        <div className="mb-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{formatDate(post.publishDate)}</span>
                          <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{post.readTime} min</span>
                        </div>

                        <h3 className="mb-4 text-xl font-bold leading-snug text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                          {post.title}
                        </h3>

                        <p className="mb-6 flex-1 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                          {post.excerpt}
                        </p>

                        {post.tags.length > 0 && (
                          <div className="mb-6 flex flex-wrap gap-2">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                onClick={(e) => handleTagClick(tag, e)}
                                className={`inline-flex cursor-pointer items-center rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                                  selectedTag === tag
                                    ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                                }`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between border-t border-slate-100 pt-6 dark:border-slate-800 mt-auto">
                          <div className="flex items-center gap-3">
                            <ImageWithFallback src={post.author.avatar} alt={post.author.name} className="h-10 w-10 rounded-full border border-slate-200 dark:border-slate-700" />
                            <div>
                              <p className="text-sm font-bold text-slate-900 dark:text-white">{post.author.name}</p>
                              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{post.author.role}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {searchQuery === '' && selectedCategory === 'All' && !selectedTag && totalPages > 1 && (
                <div className="mt-16 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href={currentPage > 1 ? buildPageHref(currentPage - 1) : '#'}
                          className={currentPage > 1 ? 'text-slate-600 dark:text-slate-300' : 'pointer-events-none opacity-50'}
                        />
                      </PaginationItem>
                      <PaginationItem>
                        <span className="px-4 py-2 text-sm font-bold text-slate-500 dark:text-slate-400">
                          Page {currentPage} of {totalPages}
                        </span>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext
                          href={currentPage < totalPages ? buildPageHref(currentPage + 1) : '#'}
                          className={currentPage < totalPages ? 'text-slate-600 dark:text-slate-300' : 'pointer-events-none opacity-50'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center">
              <div className="mx-auto max-w-lg rounded-[32px] border border-slate-200 bg-white p-12 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                  <Search className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="mb-3 text-2xl font-black text-slate-900 dark:text-white">
                  {blogPosts.length === 0 ? 'No posts published yet' : 'No articles found'}
                </h3>
                <p className="mb-8 text-base font-medium text-slate-500 dark:text-slate-400">
                  {blogPosts.length === 0
                    ? 'Check back soon for exciting content about importing and international trade.'
                    : 'Try adjusting your search terms or browse all categories.'}
                </p>
                {blogPosts.length > 0 && (
                  <Button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setSelectedTag(null);
                    }}
                    className="h-12 rounded-xl bg-indigo-600 px-8 text-base font-bold text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
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
