import { useState, useMemo } from "react";
import { Search, Calendar, Clock, User, Tag, Filter, ChevronDown, TrendingUp, BookOpen, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  blogPosts, 
  blogCategories, 
  getFeaturedPosts, 
  getBlogPostsByCategory, 
  searchBlogPosts,
  type BlogPost 
} from "./BlogData";

interface BlogListProps {
  onSelectPost: (slug: string) => void;
  onNavigateHome: () => void;
}

export default function BlogList({ onSelectPost, onNavigateHome }: BlogListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popular">("newest");

  const filteredPosts = useMemo(() => {
    let posts = searchQuery 
      ? searchBlogPosts(searchQuery)
      : getBlogPostsByCategory(selectedCategory);

    // Sort posts
    switch (sortBy) {
      case "newest":
        posts = [...posts].sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
        break;
      case "oldest":
        posts = [...posts].sort((a, b) => new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime());
        break;
      case "popular":
        posts = [...posts].sort((a, b) => b.readTime - a.readTime);
        break;
    }

    return posts;
  }, [searchQuery, selectedCategory, sortBy]);

  const featuredPosts = getFeaturedPosts().slice(0, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", 
      day: "numeric"
    });
  };

  // Calculate blog stats
  const totalArticles = blogPosts.length;
  const totalReadTime = blogPosts.reduce((acc, post) => acc + post.readTime, 0);
  const categoriesCount = blogCategories.length - 1; // Exclude "All"

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Enhanced Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-slate-900/90"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-1 h-1 bg-purple-400/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-40 left-16 w-1.5 h-1.5 bg-blue-300/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-40 right-32 w-1 h-1 bg-purple-300/30 rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
          {/* Header Content */}
          <div className="text-center mb-12 lg:mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-600/20 backdrop-blur-sm border border-blue-400/30 rounded-full px-4 py-2 mb-6">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-300 font-medium">Import Insights & Expert Guides</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-6 bg-gradient-to-r from-white via-blue-100 to-slate-300 bg-clip-text text-transparent leading-tight">
              Import Insights{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Blog</span>
            </h1>
            
            {/* Description */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed px-4 sm:px-0">
              Master the art of international trade with expert insights, success stories, and practical guides 
              to help you build a thriving import business.
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-2xl mx-auto mb-10">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 lg:p-6">
                <div className="flex items-center justify-center mb-2">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl text-white mb-1">{totalArticles}+</div>
                <div className="text-xs sm:text-sm text-slate-400">Articles</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 lg:p-6">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl text-white mb-1">{totalReadTime}+</div>
                <div className="text-xs sm:text-sm text-slate-400">Min Read</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 lg:p-6">
                <div className="flex items-center justify-center mb-2">
                  <Tag className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl text-white mb-1">{categoriesCount}</div>
                <div className="text-xs sm:text-sm text-slate-400">Categories</div>
              </div>
            </div>
          </div>

          {/* Enhanced Search and Filter Section */}
          <div className="max-w-4xl mx-auto">
            {/* Mobile-First Search Bar */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 sm:p-6 mb-6">
              <div className="space-y-4">
                {/* Search Input - Full Width on Mobile */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-300 w-5 h-5" />
                  <Input
                    placeholder="Search articles, authors, or topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-3 bg-white/10 border-white/20 text-white placeholder-slate-300 focus:border-blue-400 focus:ring-blue-400 rounded-xl text-base"
                  />
                </div>
                
                {/* Filter Row - Responsive Layout */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {/* Category Filter */}
                  <div className="flex-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-white/10 border border-white/20 text-white hover:bg-white/20 rounded-xl transition-colors">
                        <div className="flex items-center gap-2">
                          <Filter className="w-4 h-4" />
                          <span className="text-sm sm:text-base">{selectedCategory}</span>
                        </div>
                        <ChevronDown className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700">
                        {blogCategories.map((category) => (
                          <DropdownMenuItem
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className="text-white hover:bg-slate-700 cursor-pointer"
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
                      <DropdownMenuTrigger className="w-full sm:w-auto flex items-center justify-between gap-2 px-4 py-3 bg-white/10 border border-white/20 text-white hover:bg-white/20 rounded-xl transition-colors">
                        <span className="text-sm sm:text-base">Sort: {sortBy === "newest" ? "Newest" : sortBy === "oldest" ? "Oldest" : "Popular"}</span>
                        <ChevronDown className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-48 bg-slate-800 border-slate-700">
                        <DropdownMenuItem onClick={() => setSortBy("newest")} className="text-white hover:bg-slate-700 cursor-pointer">
                          Newest First
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy("oldest")} className="text-white hover:bg-slate-700 cursor-pointer">
                          Oldest First
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy("popular")} className="text-white hover:bg-slate-700 cursor-pointer">
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
                      className={`px-3 py-1.5 rounded-full text-xs sm:text-sm transition-colors ${
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
            {(searchQuery || selectedCategory !== "All") && (
              <div className="text-center mb-8">
                <p className="text-slate-300">
                  {searchQuery ? (
                    <>Found <span className="text-blue-400 font-medium">{filteredPosts.length}</span> articles for "<span className="text-white">{searchQuery}</span>"</>
                  ) : (
                    <>Showing <span className="text-blue-400 font-medium">{filteredPosts.length}</span> articles in <span className="text-white">{selectedCategory}</span></>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Featured Posts Section */}
      {searchQuery === "" && selectedCategory === "All" && (
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-slate-900 to-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 lg:mb-16">
              <div className="inline-flex items-center gap-2 bg-yellow-600/20 backdrop-blur-sm border border-yellow-400/30 rounded-full px-4 py-2 mb-4">
                <TrendingUp className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-yellow-300 font-medium">Featured Content</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl mb-4 text-white">Must-Read Articles</h2>
              <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">Don't miss these essential reads for import professionals</p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {featuredPosts.map((post, index) => (
                <Card 
                  key={post.id}
                  className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group overflow-hidden"
                  onClick={() => onSelectPost(post.slug)}
                >
                  <div className="relative overflow-hidden">
                    <ImageWithFallback
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 sm:h-52 lg:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-blue-600 text-white text-xs sm:text-sm px-3 py-1">
                        Featured
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                        <span className="text-white text-xs">{index + 1}</span>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-3 sm:gap-4 mb-3 text-xs sm:text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        {formatDate(post.publishDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        {post.readTime} min
                      </span>
                    </div>
                    
                    <h3 className="text-lg sm:text-xl mb-3 text-white group-hover:text-blue-400 transition-colors leading-tight">
                      {post.title}
                    </h3>
                    
                    <p className="text-slate-300 mb-4 line-clamp-3 text-sm sm:text-base leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <ImageWithFallback
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="text-sm text-white">{post.author.name}</p>
                          <p className="text-xs text-slate-400">{post.author.role}</p>
                        </div>
                      </div>
                      
                      <Badge variant="secondary" className="bg-slate-700 text-slate-300 text-xs">
                        {post.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 lg:mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl text-white mb-2">
                {searchQuery ? `Search Results (${filteredPosts.length})` : "All Articles"}
              </h2>
              {selectedCategory !== "All" && (
                <p className="text-slate-300">Showing articles in: <span className="text-blue-400">{selectedCategory}</span></p>
              )}
            </div>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredPosts.map((post) => (
                <Card 
                  key={post.id}
                  className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group overflow-hidden"
                  onClick={() => onSelectPost(post.slug)}
                >
                  <div className="relative overflow-hidden">
                    <ImageWithFallback
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 sm:h-52 lg:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {post.featured && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-blue-600 text-white text-xs">Featured</Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-3 sm:gap-4 mb-3 text-xs sm:text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        {formatDate(post.publishDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        {post.readTime} min
                      </span>
                    </div>
                    
                    <h3 className="text-lg sm:text-xl mb-3 text-white group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
                      {post.title}
                    </h3>
                    
                    <p className="text-slate-300 mb-4 line-clamp-3 text-sm sm:text-base leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-slate-600 text-slate-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ImageWithFallback
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="text-sm text-white">{post.author.name}</p>
                          <p className="text-xs text-slate-400">{post.author.role}</p>
                        </div>
                      </div>
                      
                      <Badge variant="secondary" className="bg-slate-700 text-slate-300 text-xs">
                        {post.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 max-w-md mx-auto">
                <Search className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl text-white mb-2">No articles found</h3>
                <p className="text-slate-300 mb-6">
                  Try adjusting your search terms or browse all categories
                </p>
                <Button 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  View All Articles
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}