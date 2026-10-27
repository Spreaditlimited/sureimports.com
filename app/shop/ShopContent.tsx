'use client';

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/shop/ProductCard';
import CartSidebar from '@/app/dashboard/shop/components/CartSidebar';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  shopListingHref,
  shopCategories,
  SHOP_PAGE_SIZE,
  type ShopQuery,
  type ShopCardProduct,
} from '@/lib/shop/discovery';
import { Search, ShoppingCart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useShopCart } from '@/app/context/ShopCartContext';
import { resolveMediaUrl } from '@/lib/cloudinary/url';
import heroStyles from './ShopHero.module.css';
import ServiceHero from '@/components/home/ServiceHero';

export type StoreProduct = ShopCardProduct;
type ShopInitialData = {
  products: StoreProduct[];
  categories: string[];
  totalCount: number;
};
export default function ShopContent({
  initialData,
  query,
}: {
  initialData: ShopInitialData;
  query: ShopQuery;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { cartCount } = useShopCart();
  const [searchQuery, setSearchQuery] = useState(query.q);
  const [loading, startTransition] = useTransition();
  const activeCategory = query.category || 'All Products';
  const products = initialData.products;
  const categories = ['All Products', ...initialData.categories];
  const page = query.page;
  const totalPages = Math.ceil(initialData.totalCount / SHOP_PAGE_SIZE);
  const totalCount = initialData.totalCount;
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  const categoryRowRef = useRef<HTMLDivElement | null>(null);
  const selectedCategory = shopCategories.find(
    (category) => category.value === query.category,
  );
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
          title={
            selectedCategory
              ? `${selectedCategory.name} from China to Nigeria`
              : 'Your next phone, laptop or everyday upgrade.'
          }
          description={
            selectedCategory?.description ||
            'Explore technology sourced from China, with clear pricing, order tracking and delivery to your doorstep in Nigeria.'
          }
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
              <form
                className={heroStyles.searchField}
                action={shopListingHref({ ...query, q: '', page: 1 })}
                onSubmit={(event) => {
                  event.preventDefault();
                  startTransition(() =>
                    router.push(
                      shopListingHref({
                        ...query,
                        q: searchQuery.trim(),
                        page: 1,
                      }) + '#shop-products',
                    ),
                  );
                }}
              >
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search products or models…"
                  aria-label="Search products"
                  name="q"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                  }}
                  className={heroStyles.searchInput}
                />
                <button type="submit" className={heroStyles.searchSubmit}>
                  Search
                </button>
              </form>
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
                <Link
                  key={category}
                  href={
                    shopListingHref({
                      ...query,
                      category: category === 'All Products' ? '' : category,
                      page: 1,
                    }) + '#shop-products'
                  }
                  aria-current={
                    activeCategory === category ? 'page' : undefined
                  }
                  className={heroStyles.categoryButton}
                >
                  {shopCategories.find((item) => item.value === category)
                    ?.name || category}
                </Link>
              ))}
            </div>
            <div className={heroStyles.resultsRow}>
              <p role="status" aria-live="polite">
                {loading
                  ? 'Finding products…'
                  : `${totalCount} ${totalCount === 1 ? 'product' : 'products'}${query.q ? ` matching “${query.q}”` : ''}`}
              </p>
              {(query.q || activeCategory !== 'All Products') && (
                <Link href="/shop#shop-products">Clear filters</Link>
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
              {page > 1 ? (
                <Link
                  href={
                    shopListingHref({ ...query, page: page - 1 }) +
                    '#shop-products'
                  }
                >
                  Previous
                </Link>
              ) : (
                <span aria-disabled="true">Previous</span>
              )}
              <span>
                Page {page} of {totalPages}
              </span>
              {page < totalPages ? (
                <Link
                  href={
                    shopListingHref({ ...query, page: page + 1 }) +
                    '#shop-products'
                  }
                >
                  Next
                </Link>
              ) : (
                <span aria-disabled="true">Next</span>
              )}
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
