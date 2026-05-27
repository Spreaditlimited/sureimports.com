'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search as SearchIcon,
  X,
  ChevronUp,
  ShoppingCart,
  SlidersHorizontal,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { useShopCart } from '@/app/context/ShopCartContext';
import ProductGrid from './ProductGrid';
import FilterPanel from './FilterPanel';
import CartSidebar from './CartSidebar';
import { toast } from 'sonner';

export default function ShopComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cartCount } = useShopCart();

  // State
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showCartSidebar, setShowCartSidebar] = useState(false);

  // Filter options
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || 'all');
  const [minPrice, setMinPrice] = useState(parseFloat(searchParams.get('minPrice') || '0'));
  const [maxPrice, setMaxPrice] = useState(parseFloat(searchParams.get('maxPrice') || '999999999'));
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  useEffect(() => { fetchFilterOptions(); }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedCategory, selectedBrand, minPrice, maxPrice, sortBy, currentPage]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchFilterOptions = async () => {
    try {
      const response = await fetch('/api/shop/filters');
      const data = await response.json();
      if (data.statusx === 'SUCCESS') {
        setCategories(data.data.categories);
        setBrands(data.data.brands);
        setPriceRange(data.data.priceRange);
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: searchQuery,
        category: selectedCategory,
        brand: selectedBrand,
        minPrice: minPrice.toString(),
        maxPrice: maxPrice.toString(),
        sortBy: sortBy,
        page: currentPage.toString(),
        limit: '12',
      });

      const response = await fetch(`/api/shop/products?${params.toString()}`);
      const data = await response.json();

      if (data.statusx === 'SUCCESS') {
        setProducts(data.data.products);
        setPagination(data.data.pagination);
      } else {
        toast.error(data.message || 'Failed to fetch products');
      }
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => { setCurrentPage(1); updateURL(); };
  const clearSearch = () => { setSearchQuery(''); setCurrentPage(1); updateURL(); };

  const updateURL = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedBrand !== 'all') params.set('brand', selectedBrand);
    if (minPrice > 0) params.set('minPrice', minPrice.toString());
    if (maxPrice < 999999999) params.set('maxPrice', maxPrice.toString());
    if (sortBy !== 'newest') params.set('sortBy', sortBy);
    if (currentPage > 1) params.set('page', currentPage.toString());
    router.push(`/dashboard/shop?${params.toString()}`);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const handlePageChange = (page: number) => { setCurrentPage(page); scrollToTop(); };

  const handleFilterChange = (filters: any) => {
    setSelectedCategory(filters.category || 'all');
    setSelectedBrand(filters.brand || 'all');
    setMinPrice(filters.minPrice || 0);
    setMaxPrice(filters.maxPrice || 999999999);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="mx-auto w-full max-w-7xl">
        
        {/* Floating Action Bar */}
        <div className="sticky top-4 z-40 mb-8 rounded-2xl border border-slate-200/60 bg-white/80 p-3 shadow-lg shadow-slate-200/20 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/80 dark:shadow-none">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            
            {/* Search Input */}
            <div className="relative flex-1 lg:max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <SearchIcon className="h-4 w-4 text-slate-400" />
              </div>
              <Input
                value={searchQuery}
                placeholder="Search premium devices..."
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                className="h-11 w-full rounded-xl border-slate-200 bg-slate-50 pl-10 pr-10 text-sm font-medium focus-visible:ring-1 focus-visible:ring-blue-600 dark:border-slate-800 dark:bg-slate-950"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
              <Select value={sortBy} onValueChange={(value) => { setSortBy(value); setCurrentPage(1); }}>
                <SelectTrigger className="h-11 w-[160px] rounded-xl border-slate-200 bg-slate-50 text-xs font-bold dark:border-slate-800 dark:bg-slate-950 shrink-0">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800">
                  <SelectItem value="newest">Newest Arrivals</SelectItem>
                  <SelectItem value="oldest">Classic First</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="name-asc">Name: A to Z</SelectItem>
                  <SelectItem value="name-desc">Name: Z to A</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setShowFilterPanel(true)}
                className="h-11 rounded-xl border-slate-200 bg-slate-50 px-4 text-xs font-bold hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 shrink-0"
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>

              <Button
                onClick={() => setShowCartSidebar(true)}
                className="relative h-11 rounded-xl bg-blue-600 px-5 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500 shrink-0"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Cart
                {cartCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-rose-500 text-[10px] font-black text-white dark:border-slate-900">
                    {cartCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mb-4"></div>
              <p className="text-sm font-bold tracking-widest uppercase">Loading Collection</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/50 py-24 text-center dark:border-slate-800 dark:bg-slate-900/50">
               <div className="rounded-full bg-slate-100 p-4 dark:bg-slate-800 mb-4">
                <SearchIcon className="h-8 w-8 text-slate-400" />
               </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No products found</h3>
              <p className="mt-1 text-sm text-slate-500">We couldn't find anything matching your current filters.</p>
              <Button onClick={clearSearch} variant="link" className="mt-4 text-blue-600">Clear all filters</Button>
            </div>
          ) : (
            <>
              <ProductGrid products={products} />

              {/* Minimal Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-12 flex items-center justify-between border-t border-slate-200 pt-6 dark:border-slate-800">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="h-10 rounded-xl border-slate-200 px-4 text-xs font-bold dark:border-slate-800"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Prev
                  </Button>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    {pagination.currentPage} / {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="h-10 rounded-xl border-slate-200 px-4 text-xs font-bold dark:border-slate-800"
                  >
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-xl transition-transform hover:-translate-y-1 dark:bg-blue-600"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}

      <FilterPanel
        isOpen={showFilterPanel}
        onClose={() => setShowFilterPanel(false)}
        categories={categories}
        brands={brands}
        priceRange={priceRange}
        selectedCategory={selectedCategory}
        selectedBrand={selectedBrand}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onFilterChange={handleFilterChange}
      />

      <CartSidebar
        isOpen={showCartSidebar}
        onClose={() => setShowCartSidebar(false)}
      />
    </>
  );
}