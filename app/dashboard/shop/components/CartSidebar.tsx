'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useShopCart } from '@/app/context/ShopCartContext';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const router = useRouter();
  const { cart, cartCount, cartTotal, updateQuantity, removeFromCart, clearCart } = useShopCart();

  const handleCheckout = () => {
    onClose();
    router.push('/dashboard/shop/checkout');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 z-50 h-full w-96 max-w-[90vw] transform bg-card shadow-2xl transition-transform duration-300 ease-in-out">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border p-6">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              <h2 className="text-2xl font-semibold text-foreground dark:text-white">
                Shopping Cart
              </h2>
              {cartCount > 0 && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground opacity-50" />
                <h3 className="mb-2 text-lg font-medium text-foreground dark:text-white">
                  Your cart is empty
                </h3>
                <p className="text-sm text-muted-foreground dark:text-gray-400">
                  Add some products to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.pidProduct}
                    className="flex gap-4 rounded-lg border border-border bg-background p-4 dark:bg-gray-800"
                  >
                    {/* Product Image */}
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-700">
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-1 flex-col">
                      <h4 className="mb-1 text-sm font-medium text-foreground line-clamp-2 dark:text-white">
                        {item.productName}
                      </h4>
                      {item.productBrand && (
                        <p className="mb-2 text-xs text-muted-foreground dark:text-gray-400">
                          {item.productBrand}
                        </p>
                      )}
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                          ₦{(item.productPrice * item.quantity).toLocaleString()}
                        </span>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-7 w-7 border-gray-300 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                            onClick={() => updateQuantity(item.pidProduct, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium dark:text-white">
                            {item.quantity}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-7 w-7 border-gray-300 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                            onClick={() => updateQuantity(item.pidProduct, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-red-600 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/30"
                            onClick={() => removeFromCart(item.pidProduct)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Clear Cart Button */}
                {cart.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="w-full border-red-300 bg-white text-red-600 hover:bg-red-100 hover:text-red-700 dark:border-red-800 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-900/30"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear Cart
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t border-border p-6">
              <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground dark:text-gray-400">
                    Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'})
                  </span>
                  <span className="font-medium text-foreground dark:text-white">
                    ₦{cartTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-lg font-bold">
                  <span className="text-foreground dark:text-white">Total</span>
                  <span className="text-indigo-600 dark:text-indigo-400">
                    ₦{cartTotal.toLocaleString()}
                  </span>
                </div>
              </div>
              <Button
                onClick={handleCheckout}
                className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Proceed to Checkout
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

