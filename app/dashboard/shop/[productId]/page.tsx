'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
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
  Info
} from 'lucide-react';
import { useShopCart } from '@/app/context/ShopCartContext';
import { toast } from 'sonner';
import Loading from '../../loading';
import { resolveMediaUrl } from '@/lib/cloudinary/url';

function ProductDetailsContent({ params }: { params: Promise<{ productId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addToCart, isInCart, getCartItem } = useShopCart();

  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [resolvedParams.productId]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/shop/product/${resolvedParams.productId}`);
      const data = await response.json();

      if (data.statusx === 'SUCCESS') {
        setProduct(data.data.product);
        setRelatedProducts(data.data.relatedProducts || []);
      } else {
        toast.error(data.message || 'Product not found');
        router.push('/dashboard/shop');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
      router.push('/dashboard/shop');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    const imageUrl = resolveMediaUrl(product.productImage) || '/placeholder.svg?height=400&width=400';
    addToCart({
      pidProduct: product.pidProduct,
      productName: product.productName,
      productPrice: product.productPrice,
      productImage: imageUrl,
      productBrand: product.productBrand,
      productCategory: product.productCategory,
    }, quantity);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/dashboard/shop/checkout');
  };

  if (loading) return <Loading />;
  
  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[#fcfcfd] dark:bg-slate-950">
        <div className="rounded-full bg-slate-100 p-6 dark:bg-slate-900">
          <Info className="h-8 w-8 text-slate-400" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">Product not found</h2>
        <Button variant="ghost" onClick={() => router.push('/dashboard/shop')} className="mt-4 text-blue-600">
          <ArrowLeft className="mr-2 h-4 w-4" /> Return to Shop
        </Button>
      </div>
    );
  }

  const imageUrl = resolveMediaUrl(product.productImage) || '/placeholder.svg?height=800&width=800';
  const inCart = isInCart(product.pidProduct);
  const cartItem = getCartItem(product.pidProduct);

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-slate-950">
      {/* Minimalist Top Navigation */}
      <div className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/80">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => router.back()} 
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 transition hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Collection
          </button>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
          
          {/* Left: Product Image Showcase (Sticky) */}
          <div className="w-full lg:sticky lg:top-24 lg:w-1/2">
            <div className="relative aspect-square w-full overflow-hidden rounded-[40px] bg-slate-50 border border-slate-100 dark:bg-slate-900/50 dark:border-slate-800">
              <Image
                src={imageUrl}
                alt={product.productName || 'Product'}
                fill
                className="object-contain object-center p-8 mix-blend-multiply dark:mix-blend-normal"
                priority
              />
              
              {/* Floating Badges */}
              <div className="absolute left-6 top-6 flex flex-col gap-2">
                {product.productCondition && (
                  <div className="flex w-fit items-center gap-1.5 rounded-full bg-white/90 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm backdrop-blur-md dark:bg-slate-900/90 dark:text-white">
                    {product.productCondition === 'NEW' ? <Sparkles className="h-3 w-3 text-blue-600" /> : <span className="h-2 w-2 rounded-full bg-blue-600" />}
                    {product.productCondition}
                  </div>
                )}
                {product.productCategory && (
                  <div className="flex w-fit items-center rounded-full bg-blue-600/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600 backdrop-blur-md dark:bg-blue-500/20 dark:text-blue-400">
                    {product.productCategory}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="flex w-full flex-col lg:w-1/2">
            
            {/* Header Info */}
            <div className="mb-8">
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl leading-tight">
                {product.productName}
              </h1>
              {product.productBrand && (
                <p className="mt-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400">
                  By <span className="text-slate-900 dark:text-white">{product.productBrand}</span>
                </p>
              )}
            </div>

            {/* Price & Quantity Area */}
            <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Unit Price</p>
                  <div className="text-4xl font-black text-blue-600 dark:text-blue-400">
                    ₦{product.productPrice?.toLocaleString() || '0'}
                  </div>
                </div>

                {/* Minimalist Quantity Selector */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 text-right">Quantity</p>
                  <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
                    <button
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm transition hover:text-slate-900 disabled:opacity-50 dark:bg-slate-700 dark:text-slate-300 dark:hover:text-white"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center text-sm font-bold text-slate-900 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm transition hover:text-slate-900 dark:bg-slate-700 dark:text-slate-300 dark:hover:text-white"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {product.productMOQ && product.productMOQ > 1 && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                  <Info className="h-4 w-4" /> Minimum order quantity is {product.productMOQ} units.
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mb-8 space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={handleAddToCart}
                  disabled={inCart}
                  className={`flex-1 rounded-2xl py-6 text-sm font-bold shadow-lg transition-all ${
                    inCart 
                      ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 shadow-none cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-600/20 active:scale-[0.98]'
                  }`}
                >
                  {inCart ? (
                    <><CheckCircle2 className="mr-2 h-5 w-5" /> Added to Cart ({cartItem?.quantity})</>
                  ) : (
                    <><ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart</>
                  )}
                </Button>
                <Button
                  onClick={handleBuyNow}
                  variant="outline"
                  className="flex-1 rounded-2xl border-slate-200 bg-white py-6 text-sm font-bold text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800 active:scale-[0.98]"
                >
                  Buy it Now
                </Button>
              </div>

              {/* Installment Feature Card */}
              <div 
                onClick={() => router.push(`/dashboard/store/pay-small-small-terms?id=${product.pidProduct}`)}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 p-5 transition-all hover:border-purple-300 hover:shadow-md dark:border-purple-900/30 dark:from-purple-900/10 dark:to-indigo-900/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm dark:bg-slate-800">
                      <Wallet className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Pay Small Small</h4>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Lock this item and pay in installments.</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-purple-400 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>

            {/* Trust Features */}
            <div className="mb-10 grid grid-cols-2 gap-4 border-y border-slate-100 py-6 dark:border-slate-800">
              {product.warrantyPeriod && (
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">Warranty</p>
                    <p className="mt-0.5 text-xs text-slate-500">{product.warrantyPeriod} included</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-blue-500 shrink-0" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">Delivery</p>
                  <p className="mt-0.5 text-xs text-slate-500">Pickup & nationwide delivery</p>
                </div>
              </div>
            </div>

            {/* Details & Specs Accordion/List */}
            <div className="space-y-8">
              {product.productDescription && (
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-3">Overview</h3>
                  <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-600 [overflow-wrap:anywhere] dark:text-slate-400">
                    {product.productDescription}
                  </p>
                </div>
              )}

              {product.productFeature && (
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-3">Key Features</h3>
                  <div className="prose prose-sm prose-slate dark:prose-invert max-w-none whitespace-pre-wrap break-words text-slate-600 [overflow-wrap:anywhere]">
                    {product.productFeature}
                  </div>
                </div>
              )}

              {product.productSpecification && (
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-3">Easy Buy</h3>
                  <div className="prose prose-sm prose-slate dark:prose-invert max-w-none whitespace-pre-wrap break-words text-slate-600 [overflow-wrap:anywhere] rounded-2xl bg-slate-50 p-6 dark:bg-slate-900/50">
                    {product.productSpecification}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Related Products - Using consistent design system */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 border-t border-slate-200 pt-16 dark:border-slate-800">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">You might also like</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => {
                const relatedImgUrl = resolveMediaUrl(relatedProduct.productImage) || '/placeholder.svg?height=400&width=400';

                return (
                  <div
                    key={relatedProduct.pidProduct}
                    onClick={() => router.push(`/dashboard/shop/${relatedProduct.pidProduct}`)}
                    className="group flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="relative aspect-[4/3] w-full bg-slate-50 dark:bg-slate-800/50">
                      <Image
                        src={relatedImgUrl}
                        alt={relatedProduct.productName}
                        fill
                        className="object-cover object-center mix-blend-multiply transition-transform duration-500 group-hover:scale-105 dark:mix-blend-normal"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3
                        className="break-words text-sm font-bold leading-snug text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400"
                        title={relatedProduct.productName}
                      >
                        {relatedProduct.productName}
                      </h3>
                      <div className="mt-auto pt-4">
                        <span className="text-lg font-black tracking-tight text-blue-600 dark:text-blue-400">
                          ₦{relatedProduct.productPrice?.toLocaleString() || '0'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ProductDetailsPage({ params }: { params: Promise<{ productId: string }> }) {
  return <ProductDetailsContent params={params} />;
}
