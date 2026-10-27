'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductImage from '@/components/shop/ProductImage';
import imageStyles from '@/components/shop/ProductImage.module.css';
import Link from 'next/link';
import ProductCard from '@/components/shop/ProductCard';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  ShoppingCart,
  ArrowLeft,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Sparkles,
  Wallet,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useShopCart } from '@/app/context/ShopCartContext';
import {
  productConditionLabel,
  type ShopProduct,
  type ShopCardProduct,
} from '@/lib/shop/discovery';
import { resolveMediaUrl } from '@/lib/cloudinary/url';
import CartSidebar from '@/app/dashboard/shop/components/CartSidebar';

export default function ProductDetailsContent({
  product,
  relatedProducts,
}: {
  product: ShopProduct;
  relatedProducts: ShopCardProduct[];
}) {
  const router = useRouter();
  const { addToCart, isInCart, getCartItem } = useShopCart();
  const minimumQuantity = Math.max(1, Math.ceil(product.productMOQ || 1));
  const [quantity, setQuantity] = useState(minimumQuantity);
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  useEffect(() => {
    const handleOpenShopCart = () => setShowCartSidebar(true);
    window.addEventListener('open-shop-cart', handleOpenShopCart);
    return () =>
      window.removeEventListener('open-shop-cart', handleOpenShopCart);
  }, []);

  const handleAddToCart = (openCart = true) => {
    if (!product) return;
    const imageUrl =
      resolveMediaUrl(product.productImage) ||
      '/placeholder.svg?height=400&width=400';
    addToCart(
      {
        pidProduct: product.pidProduct,
        productName: product.productName || 'Product',
        productPrice: Number(product.productPrice || 0),
        productImage: imageUrl,
        productBrand: product.productBrand || '',
        productCategory: product.productCategory || '',
      },
      quantity,
    );
    if (openCart) {
      setShowCartSidebar(true);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart(false);
    router.push('/shop/checkout');
  };

  const imageUrl =
    resolveMediaUrl(product.productImage) ||
    '/placeholder.svg?height=800&width=800';
  const inCart = isInCart(product.pidProduct);
  const cartItem = getCartItem(product.pidProduct);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#fcfcfd] pt-20 dark:bg-slate-950 sm:pt-24">
        <main className="mx-auto max-w-[var(--si-content-max)] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Link
            href="/shop"
            className="group mb-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 transition hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Collection
          </Link>
          <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
            <div className="w-full lg:sticky lg:top-24 lg:w-1/2">
              <div className="relative aspect-square w-full overflow-hidden rounded-[40px] border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
                <ProductImage
                  src={product.productImage ? imageUrl : ''}
                  alt={product.productName || 'Product'}
                  priority
                  detail
                />

                <div className="absolute left-6 top-6 flex flex-col gap-2">
                  {product.productCondition && (
                    <div className="flex w-fit items-center gap-1.5 rounded-full bg-white/90 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm backdrop-blur-md dark:bg-slate-900/90 dark:text-white">
                      {['NEW', 'BRAND_NEW'].includes(
                        product.productCondition,
                      ) ? (
                        <Sparkles className="h-3 w-3 text-blue-600" />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-blue-600" />
                      )}
                      {productConditionLabel(product)}
                    </div>
                  )}
                  {product.productCategory && (
                    <div className={imageStyles.label}>
                      {product.productCategory}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col lg:w-1/2">
              <div className="mb-8">
                <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl">
                  {product.productName}
                </h1>
                {product.productBrand && (
                  <p className="mt-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400">
                    By{' '}
                    <span className="text-slate-900 dark:text-white">
                      {product.productBrand}
                    </span>
                  </p>
                )}
              </div>

              <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Unit Price
                    </p>
                    <div className="text-4xl font-black text-blue-600 dark:text-blue-400">
                      {product.productPrice && product.productPrice > 0
                        ? `₦${product.productPrice.toLocaleString('en-NG', { maximumFractionDigits: 2 })}`
                        : 'Request a price'}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-right text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Quantity
                    </p>
                    <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
                      <button
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm transition hover:text-slate-900 disabled:opacity-50 dark:bg-slate-700 dark:text-slate-300 dark:hover:text-white"
                        onClick={() =>
                          setQuantity(Math.max(minimumQuantity, quantity - 1))
                        }
                        disabled={quantity <= minimumQuantity}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center text-sm font-bold text-slate-900 dark:text-white">
                        {quantity}
                      </span>
                      <button
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm transition hover:text-slate-900 dark:bg-slate-700 dark:text-slate-300 dark:hover:text-white"
                        onClick={() => setQuantity(quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {product.productMOQ && product.productMOQ > 1 && (
                  <div className="mt-4 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                    <Info className="h-4 w-4" /> Minimum order quantity is{' '}
                    {product.productMOQ} units.
                  </div>
                )}
              </div>

              <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
                {product.productStatus === 'available'
                  ? 'Available to order.'
                  : product.productStatus === 'unavailable'
                    ? 'Currently unavailable.'
                    : 'Confirm availability before ordering.'}{' '}
                {/iphone/i.test(product.productName || '')
                  ? 'Nigeria doorstep delivery is included.'
                  : 'Confirm delivery arrangements before ordering.'}{' '}
                <Link href="/shipping-policy" className="underline">
                  Shipping policy
                </Link>
                {' · '}
                <Link href="/warranty-policy" className="underline">
                  Warranty and returns
                </Link>
              </p>
              <div className="mb-8 space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    onClick={() => handleAddToCart()}
                    disabled={
                      inCart ||
                      product.productStatus === 'unavailable' ||
                      !product.productPrice
                    }
                    className={`flex-1 rounded-2xl py-6 text-sm font-bold shadow-lg transition-all ${
                      inCart
                        ? 'cursor-not-allowed bg-emerald-50 text-emerald-600 shadow-none hover:bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400'
                        : 'bg-blue-600 text-white shadow-blue-600/20 hover:bg-blue-500 active:scale-[0.98]'
                    }`}
                  >
                    {inCart ? (
                      <>
                        <CheckCircle2 className="mr-2 h-5 w-5" /> Added to Cart
                        ({cartItem?.quantity})
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    disabled={
                      product.productStatus === 'unavailable' ||
                      !product.productPrice
                    }
                    variant="outline"
                    className="flex-1 rounded-2xl border-slate-200 bg-white py-6 text-sm font-bold text-slate-900 hover:bg-slate-50 active:scale-[0.98] dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
                  >
                    Buy it Now
                  </Button>
                </div>

                <div
                  onClick={() =>
                    router.push(
                      `/dashboard/store/pay-small-small-terms?id=${product.pidProduct}`,
                    )
                  }
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 p-5 transition-all hover:border-purple-300 hover:shadow-md dark:border-purple-900/30 dark:from-purple-900/10 dark:to-indigo-900/10"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm dark:bg-slate-800">
                        <Wallet className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h2 className="font-bold text-slate-900 dark:text-white">
                          Pay Small Small
                        </h2>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          Lock this item and pay in installments.
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-purple-400 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>

              <div className="mb-10 grid grid-cols-2 gap-4 border-y border-slate-100 py-6 dark:border-slate-800">
                {product.warrantyPeriod && (
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-500" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">
                        Warranty
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {product.warrantyPeriod === 'MONTHS12'
                          ? '12-month limited warranty'
                          : product.warrantyPeriod.replace(/^MONTHS/, '') +
                            ' months'}
                        {' · '}
                        <Link href="/warranty-policy" className="underline">
                          View policy
                        </Link>
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 shrink-0 text-blue-500" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">
                      Delivery
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {/iphone/i.test(product.productName || '')
                        ? 'Nigeria doorstep delivery included'
                        : 'Pickup & nationwide delivery'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {product.productDescription && (
                  <div>
                    <h2 className="mb-3 text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">
                      Overview
                    </h2>
                    <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-600 [overflow-wrap:anywhere] dark:text-slate-400">
                      {product.productDescription}
                    </p>
                  </div>
                )}

                {product.productFeature && (
                  <div>
                    <h2 className="mb-3 text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">
                      Key Features
                    </h2>
                    <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap break-words text-slate-600 [overflow-wrap:anywhere]">
                      {product.productFeature}
                    </div>
                  </div>
                )}

                {product.productSpecification && (
                  <div>
                    <h2 className="mb-3 text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">
                      Product details
                    </h2>
                    <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap break-words rounded-2xl bg-slate-50 p-6 text-slate-600 [overflow-wrap:anywhere] dark:bg-slate-900/50">
                      {product.productSpecification}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div className="mt-24 border-t border-slate-200 pt-16 dark:border-slate-800">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  You might also like
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.pidProduct}
                    id={relatedProduct.pidProduct}
                    name={relatedProduct.productName || 'Product'}
                    brand={relatedProduct.productBrand || ''}
                    category={relatedProduct.productCategory || ''}
                    priceNGN={Number(relatedProduct.productPrice || 0)}
                    image={resolveMediaUrl(relatedProduct.productImage) || ''}
                    condition={relatedProduct.productCondition}
                    minimumQuantity={relatedProduct.productMOQ}
                  />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
      <CartSidebar
        isOpen={showCartSidebar}
        onClose={() => setShowCartSidebar(false)}
      />
      <Footer />
    </>
  );
}
