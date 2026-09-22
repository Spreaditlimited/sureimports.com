'use client';

import HeroPill from '@/components/home/HeroPill';
import heroLayout from '@/components/home/HeroLayout.module.css';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/shop/ProductCard';
import CartSidebar from '@/app/dashboard/shop/components/CartSidebar';
import { useSearchParams } from 'next/navigation';
import { Search, ShieldCheck, Globe, Clock, ShoppingCart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useShopCart } from '@/app/context/ShopCartContext';
import { resolveMediaUrl } from '@/lib/cloudinary/url';
import PublicHeroBackground from '@/components/home/PublicHeroBackground';
import heroStyles from './ShopHero.module.css';

type StoreProduct = {
  pidProduct: string;
  productName: string | null;
  productBrand: string | null;
  productPrice: number | null;
  productImage: string | null;
  productCategory: string | null;
  productCondition: string | null;
  productMOQ: number | null;
};

function ShopContent() {
  const searchParams = useSearchParams();
  const { cartCount } = useShopCart();
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [categories, setCategories] = useState<string[]>(['All Products']);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  const categoryRowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const res = await fetch('/api/shop/filters', { cache: 'no-store' });
        const json = await res.json();
        if (
          json?.statusx === 'SUCCESS' &&
          Array.isArray(json?.data?.categories)
        ) {
          const cleanCategories = json.data.categories.filter(Boolean);
          setCategories(['All Products', ...cleanCategories]);
        }
      } catch {
        // keep default
      }
    };
    loadFilters();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const loadProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          search: searchQuery,
          category: activeCategory === 'All Products' ? 'all' : activeCategory,
          sortBy: 'newest',
          page: String(page),
          limit: '24',
        });

        const res = await fetch(`/api/shop/products?${params.toString()}`, {
          cache: 'no-store',
          signal: controller.signal,
        });
        const json = await res.json();
        if (json?.statusx !== 'SUCCESS') {
          throw new Error(json?.message || 'Failed to load products');
        }
        setProducts(
          Array.isArray(json?.data?.products) ? json.data.products : [],
        );
        setTotalPages(json.data.pagination.totalPages);
      } catch (error: unknown) {
        if (controller.signal.aborted) return;
        const message =
          error instanceof Error ? error.message : 'Failed to load products';
        toast.error(message);
        setProducts([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    loadProducts();
    return () => controller.abort();
  }, [searchQuery, activeCategory, page]);

  useEffect(() => {
    // Prevent restoring a stale horizontal scroll offset that can hide the first chip.
    categoryRowRef.current?.scrollTo({ left: 0, behavior: 'auto' });
  }, [categories.length]);

  useEffect(() => {
    if (searchParams.get('openCart') === '1') {
      setShowCartSidebar(true);
      const url = new URL(window.location.href);
      url.searchParams.delete('openCart');
      window.history.replaceState(null, '', `${url.pathname}${url.search}`);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleOpenShopCart = () => setShowCartSidebar(true);
    window.addEventListener('open-shop-cart', handleOpenShopCart);
    return () =>
      window.removeEventListener('open-shop-cart', handleOpenShopCart);
  }, []);

  const mappedProducts = useMemo(
    () =>
      products.map((product) => ({
        id: product.pidProduct,
        name: product.productName || 'Unnamed Product',
        brand: product.productBrand || 'Unknown Brand',
        category: product.productCategory || 'General',
        priceNGN: Number(product.productPrice || 0),
        image: resolveMediaUrl(product.productImage) || '',
        condition: product.productCondition,
        minimumQuantity: product.productMOQ,
      })),
    [products],
  );

  return (
    <>
      <Navbar />
      <main className={`${heroStyles.shop} min-h-screen`}>
        <section
          className={`${heroLayout.fixed} relative overflow-hidden bg-slate-900 pb-20 pt-48 text-white`}
        >
          <PublicHeroBackground />
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl text-center">
              <HeroPill className="mb-6">
                <Globe className="h-3.5 w-3.5" /> Guangzhou to Lagos
              </HeroPill>
              <h1
                className={`${heroStyles.headline} mb-6 text-5xl font-black leading-[1.1] tracking-tight sm:text-6xl md:text-7xl`}
              >
                Premium Tech & Gadgets,{' '}
                <span className={`${heroStyles.headlineEnding} text-white`}>
                  Sourced Direct
                </span>
              </h1>
              <p className="mx-auto mb-8 max-w-3xl text-lg text-slate-300">
                Discover phones, laptops and everyday tech sourced from China.
                Shop with clear pricing and delivery to your doorstep in
                Nigeria.
              </p>
            </div>

            <div className={heroStyles.assurances}>
              <div
                className={`${heroStyles.trust} flex items-center gap-3 text-sm font-semibold`}
              >
                <ShieldCheck className="h-5 w-5" /> Since 2018
              </div>
              <div className="hidden h-1.5 w-1.5 rounded-full bg-slate-700 sm:block" />
              <div
                className={`${heroStyles.trust} flex items-center gap-3 text-sm font-semibold`}
              >
                <Clock className={`${heroStyles.accent} h-5 w-5`} /> Order
                tracking
              </div>
              <div className="hidden h-1.5 w-1.5 rounded-full bg-slate-700 sm:block" />
              <div
                className={`${heroStyles.trust} flex items-center gap-3 text-sm font-semibold`}
              >
                <Globe className="h-5 w-5 text-brand-orange-400" /> Offices in
                Lagos & China
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-10 flex min-w-0 flex-col gap-5">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search products, brands, or models..."
                aria-label="Search products"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="h-12 rounded-xl border-slate-200 bg-white pl-12 text-sm shadow-sm focus-visible:ring-indigo-600 dark:border-slate-800 dark:bg-slate-900"
              />
            </div>

            <div
              ref={categoryRowRef}
              className="hide-scrollbar flex w-full min-w-0 items-center gap-2 overflow-x-auto pb-2"
            >
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    setPage(1);
                  }}
                  aria-pressed={activeCategory === category}
                  className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
                    activeCategory === category
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                  }`}
                >
                  {category}
                </button>
              ))}
              <Button
                onClick={() => setShowCartSidebar(true)}
                className="relative ml-1 h-10 shrink-0 rounded-full bg-slate-900 px-4 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                <ShoppingCart className="mr-2 h-4 w-4" /> Cart
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white">
                    {cartCount}
                  </span>
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loading ? (
              <p className="col-span-full py-12 text-center text-slate-500">
                Loading products...
              </p>
            ) : mappedProducts.length === 0 ? (
              <p className="col-span-full py-12 text-center text-slate-500">
                No products found.
              </p>
            ) : (
              mappedProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))
            )}
          </div>
          {totalPages > 1 && (
            <nav className={heroStyles.pagination} aria-label="Product pages">
              <button
                type="button"
                disabled={loading || page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={loading || page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </nav>
          )}
        </section>
      </main>
      <CartSidebar
        isOpen={showCartSidebar}
        onClose={() => setShowCartSidebar(false)}
      />
      <Footer />
    </>
  );
}

export default function ShopPage() {
  return (
    <React.Suspense fallback={null}>
      <ShopContent />
    </React.Suspense>
  );
}
