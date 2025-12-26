'use client';
import { Button } from '@/components/ui/button';
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Metadata } from 'next';
import {
  Laptop,
  Phone,
  Tag,
  VideoIcon,
  Search as SearchIcon,
  X,
  ChevronUp,
} from 'lucide-react';
import { useModal } from '@/app/context/ModalContext';
import { useAuth } from '@/lib/AuthContext';
import ProductsList from './ProductsList';
import { BiMobile } from 'react-icons/bi';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

let titlex = 'Dashboard: General Procurement';
let descriptionx =
  'Import from China. We guarantee the quality and accuracy of every product we source for you from China.';
export const metadata: Metadata = {
  title: titlex,
  description: descriptionx,
  openGraph: {
    title: titlex,
    description: descriptionx,
    images: [
      {
        url: 'https://www.sureimports.com/images/svg-logo-white.svg',
        width: 1200,
        height: 630,
        alt: 'Sure Imports',
      },
    ],
  },
};

function Procurement({ products, categories, brands, id, id2, q }: any) {
  const { user } = useAuth();
  const router = useRouter();
  const { isModalOpen, openModal, closeModal } = useModal();

  // Search state
  const searchParams = useSearchParams();
  const qParam = searchParams.get('q') || '';
  //const qParam = q;
  const [query, setQuery] = React.useState(qParam);
  React.useEffect(() => setQuery(qParam), [qParam]);

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate loading or wait for products
    if (products) setLoading(false);
  }, [products]);

  // Scroll to top button state
  const [showScrollTop, setShowScrollTop] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) params.set('q', query.trim());
    else params.delete('q');
    // ensure id param exists for consistency
    if (!params.get('id')) params.set('id', id || 'all');
    router.push('/dashboard/store/?' + params.toString());
  };

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('q');

    if (!params.get('id')) params.set('id', id || 'all');
    router.push('/dashboard/store/?' + params.toString());
  };

  return (
    <>
      <div className="bg-slate-100 px-4 py-[25px] text-slate-800 dark:bg-black dark:text-white">
        <div className="flex flex-col gap-[25px]">
          {/* Filter Area (now local sticky inside product area) */}
          <div className="mx-auto w-full max-w-7xl">
            <div
              /* Sticky bar locks below nav bar (adjust --nav-height in your layout's <body> or root) */
              className="z-700 sticky top-16 rounded-xl border border-slate-300/60 bg-slate-100/90 px-4 py-3 backdrop-blur-md supports-[backdrop-filter]:bg-slate-100/70 dark:border-gray-700/60 dark:bg-gray-900/80 dark:backdrop-blur"
              style={{ top: 'calc(var(--nav-height, 4rem) + 0.5rem)' }}
              role="region"
              aria-label="Product filters"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-start">
                {/* Search */}
                <div className="w-full md:w-[28rem]">
                  <div className="flex w-full items-center gap-3">
                    <div className="flex w-full items-center gap-2">
                      <Input
                        aria-labelledby="search-label"
                        value={query}
                        placeholder="Search products..."
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') submitSearch();
                        }}
                        className="h-[49px] w-full rounded-xl border border-slate-300 bg-slate-200 text-gray-800 placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-indigo-400"
                      />
                      {qParam && (
                        <Button
                          type="button"
                          variant="ghost"
                          aria-label="Clear search"
                          onClick={clearSearch}
                          className="h-[49px] rounded-xl border border-slate-300 bg-slate-200 px-3 text-gray-800 hover:bg-slate-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        type="button"
                        onClick={submitSearch}
                        aria-label="Search products"
                        className="h-[49px] rounded-xl border border-slate-300 bg-slate-200 px-4 text-gray-800 hover:bg-slate-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                      >
                        <SearchIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Category and Brand in one row on mobile and desktop */}
                <div className="flex flex-row gap-4">
                  {/* Category Filter */}
                  <div className="w-full md:w-[28rem]">
                    <div className="flex w-full items-center gap-3">
                      <Select
                        value={id || 'all'}
                        onValueChange={(value) => {
                          const params = new URLSearchParams(
                            searchParams.toString(),
                          );
                          if (!value || value === 'all') {
                            params.set('id', 'all');
                            params.delete('id2');
                          } else {
                            params.set('id', value);
                            params.delete('id2');
                          }
                          if (query.trim()) params.set('q', query.trim());
                          router.push('/dashboard/store/?' + params.toString());
                        }}
                      >
                        <SelectTrigger
                          aria-label="Filter by category"
                          aria-labelledby="category-label"
                          className="h-[49px] w-full rounded-xl border border-slate-300 bg-slate-200 text-gray-800 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus-visible:ring-indigo-400"
                        >
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="max-h-64">
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map((category: any) => {
                            const value = category['productCategory'];
                            return (
                              <SelectItem key={value} value={value}>
                                {String(value).toUpperCase()}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Brand Filter */}
                  <div className="w-full md:w-[28rem]">
                    <div className="flex w-full items-center gap-3">
                      <Select
                        disabled={!id || id === 'all'}
                        value={id2 || 'all'}
                        onValueChange={(value) => {
                          const params = new URLSearchParams(
                            searchParams.toString(),
                          );
                          params.set('id', id || 'all');
                          if (!value || value === 'all') {
                            params.delete('id2');
                          } else {
                            params.set('id2', value);
                          }
                          if (query.trim()) params.set('q', query.trim());
                          router.push('/dashboard/store/?' + params.toString());
                        }}
                      >
                        <SelectTrigger
                          aria-label="Filter by brand"
                          aria-labelledby="brand-label"
                          className="h-[49px] w-full rounded-xl border border-slate-300 bg-slate-200 text-gray-800 focus-visible:ring-2 focus-visible:ring-indigo-500 data-[disabled=true]:opacity-60 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus-visible:ring-indigo-400"
                        >
                          <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                        <SelectContent className="max-h-64">
                          <SelectItem value="all">All Brands</SelectItem>
                          {brands.map((brand: any) => {
                            const value = brand['productBrand'];
                            return (
                              <SelectItem key={value} value={value}>
                                {String(value).toUpperCase()}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products List */}
          {loading ? (
            <div className="mx-auto w-full max-w-7xl px-4 py-8 text-center text-slate-600 dark:text-slate-400">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="mx-auto w-full max-w-7xl px-4 py-8 text-center text-slate-600 dark:text-slate-400">
              No products found. Try adjusting your search or filters.
            </div>
          ) : (
            <ProductsList products={products} />
          )}
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 dark:bg-slate-500 dark:hover:bg-slate-600"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-6 w-6" />
        </Button>
      )}
    </>
  );
}

export default Procurement;
