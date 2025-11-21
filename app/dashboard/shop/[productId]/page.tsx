'use client';

import React, { useState, useEffect } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ArrowLeft, Minus, Plus, Package, Shield, Truck } from 'lucide-react';
import { BiMoney } from 'react-icons/bi';
import { useShopCart } from '@/app/context/ShopCartContext';
import { toast } from 'sonner';
import Loading from '../../loading';

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

    const imageUrl = product.productImage
      ? `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${product.productImage}`
      : '/placeholder.svg?height=400&width=400';

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

  const handlePaySmallSmall = () => {
    if (!product) return;
    router.push(`/dashboard/store/pay-small-small-terms?id=${product.pidProduct}`);
  };

  if (loading) {
    return <Loading />;
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Product not found</p>
      </div>
    );
  }

  const imageUrl = product.productImage
    ? `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${product.productImage}`
    : '/placeholder.svg?height=400&width=400';

  const inCart = isInCart(product.pidProduct);
  const cartItem = getCartItem(product.pidProduct);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shop
        </Button>

        {/* Product Details */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-white dark:bg-gray-800">
            <Image
              src={imageUrl}
              alt={product.productName || 'Product'}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-4">
              {product.productCategory && (
                <span className="inline-block rounded-md bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
                  {product.productCategory.toUpperCase()}
                </span>
              )}
            </div>

            <h1 className="mb-4 text-3xl font-bold text-foreground dark:text-white">
              {product.productName}
            </h1>

            {product.productBrand && (
              <p className="mb-4 text-lg text-muted-foreground dark:text-gray-400">
                Brand: <span className="font-medium">{product.productBrand}</span>
              </p>
            )}

            <div className="mb-6 text-4xl font-bold text-indigo-600 dark:text-indigo-400">
              ₦{product.productPrice?.toLocaleString() || '0'}
            </div>

            {/* Product Features */}
            <div className="mb-6 space-y-3">
              {product.productCondition && (
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">
                    Condition: <span className="font-medium">{product.productCondition}</span>
                  </span>
                </div>
              )}
              {product.warrantyPeriod && (
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">
                    Warranty: <span className="font-medium">{product.warrantyPeriod}</span>
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">
                  Pickup available at our Lagos office
                </span>
              </div>
            </div>

            {/* Description */}
            {product.productDescription && (
              <div className="mb-6">
                <h3 className="mb-2 text-lg font-semibold text-foreground dark:text-white">
                  Description
                </h3>
                <p className="text-muted-foreground dark:text-gray-400">
                  {product.productDescription}
                </p>
              </div>
            )}

            {/* Features */}
            {product.productFeature && (
              <div className="mb-6">
                <h3 className="mb-2 text-lg font-semibold text-foreground dark:text-white">
                  Features
                </h3>
                <div className="text-muted-foreground dark:text-gray-400">
                  {product.productFeature}
                </div>
              </div>
            )}

            {/* Specifications */}
            {product.productSpecification && (
              <div className="mb-6">
                <h3 className="mb-2 text-lg font-semibold text-foreground dark:text-white">
                  Specifications
                </h3>
                <div className="text-muted-foreground dark:text-gray-400">
                  {product.productSpecification}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-foreground dark:text-white">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <Button
                  size="icon"
                  variant="outline"
                  className="border-gray-300 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center text-lg font-medium dark:text-white">
                  {quantity}
                </span>
                <Button
                  size="icon"
                  variant="outline"
                  className="border-gray-300 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {product.productMOQ && product.productMOQ > 1 && (
                <p className="mt-2 text-sm text-muted-foreground dark:text-gray-400">
                  Minimum Order Quantity: {product.productMOQ}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={inCart}
                  className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {inCart ? `In Cart (${cartItem?.quantity})` : 'Add to Cart'}
                </Button>
                <Button
                  onClick={handleBuyNow}
                  variant="outline"
                  className="flex-1 border-gray-300 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                >
                  Buy Now
                </Button>
              </div>

              {/* Pay Small Small Button */}
              <Button
                onClick={handlePaySmallSmall}
                className="w-full bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700"
              >
                <BiMoney className="mr-2 h-5 w-5" />
                Pay Small Small
              </Button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold text-foreground dark:text-white">
              Related Products
            </h2>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => {
                const relatedImageUrl = relatedProduct.productImage
                  ? `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${relatedProduct.productImage}`
                  : '/placeholder.svg?height=200&width=200';

                return (
                  <div
                    key={relatedProduct.pidProduct}
                    className="cursor-pointer overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:shadow-md"
                    onClick={() => router.push(`/dashboard/shop/${relatedProduct.pidProduct}`)}
                  >
                    <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
                      <Image
                        src={relatedImageUrl}
                        alt={relatedProduct.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="mb-2 text-sm font-medium line-clamp-2">
                        {relatedProduct.productName}
                      </h3>
                      <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                        ₦{relatedProduct.productPrice?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductDetailsPage({ params }: { params: Promise<{ productId: string }> }) {
  return <ProductDetailsContent params={params} />;
}

