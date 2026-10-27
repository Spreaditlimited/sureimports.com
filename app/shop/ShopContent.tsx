'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/shop/ProductCard';
import CartSidebar from '@/app/dashboard/shop/components/CartSidebar';
import { useSearchParams } from 'next/navigation';
import { Search, ShieldCheck, Globe, Clock, ShoppingCart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useShopCart } from '@/app/context/ShopCartContext';
import { resolveMediaUrl } from '@/lib/cloudinary/url';
import heroStyles from './ShopHero.module.css';
import ServiceHero from '@/components/home/ServiceHero';

export type StoreProduct = {
  pidProduct: string;
  productName: string | null;
  productBrand: string | null;
  productPrice: number | null;
  productImage: string | null;
  productCategory: string | null;
  productCondition: string | null;
  productMOQ: number | null;
};

type ShopInitialData = {
  products: StoreProduct[];
  categories: string[];
  totalCount: number;
};

export default function ShopContent({
  initialData,
}: {
  initialData: ShopInitialData;
}) {
  const searchParams = useSearchParams();
  const { cartCount } = useShopCart();
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<StoreProduct[]>(
    initialData.products,
  );
  const [categories, setCategories] = useState<string[]>([
    'All Products',
    ...initialData.categories,
  ]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(
    Math.ceil(initialData.totalCount / 24),
  );
  const [totalCount, setTotalCount] = useState(initialData.totalCount);
  const initialRequest = useRef(true);
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  const categoryRowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (initialRequest.current) {
      initialRequest.current = false;
      return;
    }
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
        setTotalCount(json.data.pagination.totalCount);
      } catch (error: unknown) {
        if (controller.signal.aborted) return;
        const message =
          error instanceof Error ? error.message : 'Failed to load products';
        toast.error(message);
        setProducts([]);
        setTotalPages(0);
        setTotalCount(0);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    const timer = window.setTimeout(loadProducts, 250);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
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
      <main
        className={`${heroStyles.shop} min-h-screen`}
        data-si-page-theme="service"
      >
        <ServiceHero
          eyebrow="Guangzhou to Lagos"
          title="Your next phone, laptop or everyday upgrade."
          description="Explore technology sourced from China, with clear pricing, order tracking and delivery to your doorstep in Nigeria."
          primary={{ href: '#shop-products', label: 'Browse products' }}
          secondary={{ href: '/contact-us', label: 'Get help choosing' }}
          summaryTitle="Choose your tech. We’ll handle the order."
          steps={[
            {
              title: 'Find your fit',
              description:
                'Search products and compare the available specifications.',
            },
            {
              title: 'Keep track of your order',
              description: 'Follow progress through your Sure Imports account.',
            },
            {
              title: 'Get local support',
              description:
                'A team with operations in Lagos and China, serving buyers since 2018.',
            },
          ]}
        />

        <section
          id="shop-products"
          className="mx-auto max-w-[1440px] scroll-mt-28 px-4 py-12 sm:px-6 lg:px-8"
        >
          <div className={heroStyles.toolbar}>
            <div className={heroStyles.searchRow}>
              <div className={heroStyles.searchField}>
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search products or models…"
                  aria-label="Search products"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className={heroStyles.searchInput}
                />
              </div>
              <button
                type="button"
                onClick={() => setShowCartSidebar(true)}
                className={heroStyles.cartButton}
                aria-label={`Open cart, ${cartCount} items`}
              >
                <ShoppingCart size={19} aria-hidden="true" />
                <span className={heroStyles.cartLabel}>Cart</span>
                <span className={heroStyles.cartCount}>{cartCount}</span>
              </button>
            </div>

            <div
              ref={categoryRowRef}
              className={heroStyles.categories}
              role="group"
              aria-label="Product categories"
            >
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    setPage(1);
                  }}
                  aria-pressed={activeCategory === category}
                  className={heroStyles.categoryButton}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className={heroStyles.resultsRow}>
              <p role="status" aria-live="polite">
                {loading
                  ? 'Finding products…'
                  : `${totalCount} ${totalCount === 1 ? 'product' : 'products'}${searchQuery.trim() ? ` matching “${searchQuery.trim()}”` : ''}`}
              </p>
              {(searchQuery || activeCategory !== 'All Products') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('All Products');
                    setPage(1);
                  }}
                >
                  Clear filters
                </button>
              )}
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
