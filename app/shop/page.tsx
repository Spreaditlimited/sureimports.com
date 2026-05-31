'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/shop/ProductCard';
import CartSidebar from '@/app/dashboard/shop/components/CartSidebar';
import { Search, Filter, ShieldCheck, Globe, Clock, ShoppingCart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useShopCart } from '@/app/context/ShopCartContext';
import { resolveMediaUrl } from '@/lib/cloudinary/url';

type StoreProduct = {
  pidProduct: string;
  productName: string | null;
  productBrand: string | null;
  productPrice: number | null;
  productImage: string | null;
  productCategory: string | null;
};

export default function ShopPage() {
  const { cartCount } = useShopCart();
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [categories, setCategories] = useState<string[]>(['All Products']);
  const [loading, setLoading] = useState(true);
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  const categoryRowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const res = await fetch('/api/shop/filters', { cache: 'no-store' });
        const json = await res.json();
        if (json?.statusx === 'SUCCESS' && Array.isArray(json?.data?.categories)) {
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
    const loadProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          search: searchQuery,
          category: activeCategory === 'All Products' ? 'all' : activeCategory,
          sortBy: 'newest',
          page: '1',
          limit: '24',
        });

        const res = await fetch(`/api/shop/products?${params.toString()}`, {
          cache: 'no-store',
        });
        const json = await res.json();
        if (json?.statusx !== 'SUCCESS') {
          throw new Error(json?.message || 'Failed to load products');
        }
        setProducts(Array.isArray(json?.data?.products) ? json.data.products : []);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to load products';
        toast.error(message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [searchQuery, activeCategory]);

  useEffect(() => {
    // Prevent restoring a stale horizontal scroll offset that can hide the first chip.
    categoryRowRef.current?.scrollTo({ left: 0, behavior: 'auto' });
  }, [categories.length]);

  const mappedProducts = useMemo(
    () =>
      products.map((product) => ({
        id: product.pidProduct,
        name: product.productName || 'Unnamed Product',
        brand: product.productBrand || 'Unknown Brand',
        category: product.productCategory || 'General',
        priceNGN: Number(product.productPrice || 0),
        image: resolveMediaUrl(product.productImage) || '/images/default.png',
      })),
    [products],
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#fcfcfd] dark:bg-slate-950">
        <section className="bg-slate-900 pb-20 pt-48 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-indigo-400 backdrop-blur-sm">
                <Globe className="h-3.5 w-3.5" /> Guangzhou to Lagos
              </span>
              <h1 className="mb-6 text-4xl font-black tracking-tight sm:text-6xl">
                Premium Tech & Gadgets, <span className="text-brand-orange-500">Sourced Direct.</span>
              </h1>
              <p className="mb-8 text-lg text-slate-400">
                Order directly from verified Chinese manufacturers. Delivered to your doorstep in Nigeria within 10 business days.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-300">
                <ShieldCheck className="h-5 w-5 text-emerald-400" /> 8+ Years Experience
              </div>
              <div className="hidden h-1.5 w-1.5 rounded-full bg-slate-700 sm:block" />
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-300">
                <Clock className="h-5 w-5 text-indigo-400" /> 10-Day Shipping Guarantee
              </div>
              <div className="hidden h-1.5 w-1.5 rounded-full bg-slate-700 sm:block" />
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-300">
                <Globe className="h-5 w-5 text-brand-orange-400" /> Offices in Lagos & China
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search products, brands, or models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 rounded-xl border-slate-200 bg-white pl-12 text-sm shadow-sm focus-visible:ring-indigo-600 dark:border-slate-800 dark:bg-slate-900"
              />
            </div>

            <div
              ref={categoryRowRef}
              className="hide-scrollbar flex items-center gap-2 overflow-x-auto pb-2 md:pb-0"
            >
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
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
                variant="outline"
                className="ml-2 h-10 shrink-0 rounded-full border-slate-200 dark:border-slate-800"
              >
                <Filter className="mr-2 h-4 w-4" /> Filters
              </Button>
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
              <p className="col-span-full py-12 text-center text-slate-500">Loading products...</p>
            ) : mappedProducts.length === 0 ? (
              <p className="col-span-full py-12 text-center text-slate-500">No products found.</p>
            ) : (
              mappedProducts.map((product) => <ProductCard key={product.id} {...product} />)
            )}
          </div>
        </section>
      </main>
      <CartSidebar isOpen={showCartSidebar} onClose={() => setShowCartSidebar(false)} />
      <Footer />
    </>
  );
}
