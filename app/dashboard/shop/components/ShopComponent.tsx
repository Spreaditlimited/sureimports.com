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
  Filter,
  SlidersHorizontal,
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
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || '',
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'all',
  );
  const [selectedBrand, setSelectedBrand] = useState(
    searchParams.get('brand') || 'all',
  );
  const [minPrice, setMinPrice] = useState(
    parseFloat(searchParams.get('minPrice') || '0'),
  );
  const [maxPrice, setMaxPrice] = useState(
    parseFloat(searchParams.get('maxPrice') || '999999999'),
  );
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page') || '1'),
  );

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Fetch filter options
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [
    searchQuery,
    selectedCategory,
    selectedBrand,
    minPrice,
    maxPrice,
    sortBy,
    currentPage,
  ]);

  // Scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
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
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    updateURL();
  };

  const clearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
    updateURL();
  };

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    scrollToTop();
  };

  const handleFilterChange = (filters: any) => {
    setSelectedCategory(filters.category || 'all');
    setSelectedBrand(filters.brand || 'all');
    setMinPrice(filters.minPrice || 0);
    setMaxPrice(filters.maxPrice || 999999999);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="bg-slate-100 px-4 py-[25px] text-slate-800 dark:bg-black dark:text-white">
        <div className="flex flex-col gap-[25px]">
          {/* Filter Bar */}
          <div className="mx-auto w-full max-w-7xl">
            <div
              className="sticky top-16 z-40 rounded-xl border border-slate-300/60 bg-slate-100/90 px-4 py-3 backdrop-blur-md supports-[backdrop-filter]:bg-slate-100/70 dark:border-gray-700/60 dark:bg-gray-900/80 dark:backdrop-blur"
              style={{ top: 'calc(var(--nav-height, 4rem) + 0.5rem)' }}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                {/* Search */}
                <div className="flex w-full items-center gap-2 md:w-[28rem]">
                  <Input
                    value={searchQuery}
                    placeholder="Search products..."
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSearch();
                    }}
                    className="h-[49px] w-full rounded-xl border border-slate-300 bg-slate-200 text-gray-800 placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      onClick={clearSearch}
                      className="h-[49px] rounded-xl border border-slate-300 bg-slate-200 px-3 dark:border-gray-600 dark:bg-gray-800"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    onClick={handleSearch}
                    className="h-[49px] rounded-xl border border-slate-300 bg-slate-200 px-4 text-gray-800 hover:bg-slate-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                  >
                    <SearchIcon className="h-4 w-4" />
                  </Button>
                </div>

                {/* Sort and Actions */}
                <div className="flex items-center gap-2">
                  <Select
                    value={sortBy}
                    onValueChange={(value) => {
                      setSortBy(value);
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="h-[49px] w-[180px] rounded-xl border border-slate-300 bg-slate-200 dark:border-gray-600 dark:bg-gray-800">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="price-asc">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price-desc">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="name-asc">Name: A-Z</SelectItem>
                      <SelectItem value="name-desc">Name: Z-A</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    onClick={() => setShowFilterPanel(true)}
                    className="h-[49px] rounded-xl border border-slate-300 bg-slate-200 px-4 text-gray-800 hover:bg-slate-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                  >
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filters
                  </Button>

                  <Button
                    onClick={() => setShowCartSidebar(true)}
                    className="relative h-[49px] rounded-xl bg-indigo-600 px-4 text-white hover:bg-indigo-700"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Cart
                    {cartCount > 0 && (
                      <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                        {cartCount}
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="mx-auto w-full max-w-7xl">
            {loading ? (
              <div className="py-8 text-center text-slate-600 dark:text-slate-400">
                Loading products...
              </div>
            ) : products.length === 0 ? (
              <div className="py-8 text-center text-slate-600 dark:text-slate-400">
                No products found. Try adjusting your search or filters.
              </div>
            ) : (
              <>
                <ProductGrid products={products} />

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-8 flex justify-center gap-2">
                    <Button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                      className="rounded-xl"
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-4 text-sm">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <Button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      className="rounded-xl"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700"
        >
          <ChevronUp className="h-6 w-6" />
        </Button>
      )}

      {/* Filter Panel */}
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

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={showCartSidebar}
        onClose={() => setShowCartSidebar(false)}
      />
    </>
  );
}
