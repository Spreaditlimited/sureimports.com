'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useShopCart } from '@/app/context/ShopCartContext';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const router = useRouter();
  const {
    cart,
    cartCount,
    cartTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useShopCart();

  const handleCheckout = () => {
    onClose();
    router.push('/dashboard/shop/checkout');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 z-50 flex h-full w-[420px] max-w-[90vw] flex-col border-l border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-950">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20">
              <ShoppingBag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Your Cart
            </h2>
            {cartCount > 0 && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[10px] font-black text-white shadow-sm">
                {cartCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-900">
                <ShoppingBag className="h-10 w-10 text-slate-300 dark:text-slate-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Your cart is empty
              </h3>
              <p className="mt-2 max-w-[200px] text-sm text-slate-500 dark:text-slate-400">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Button
                onClick={onClose}
                className="mt-8 rounded-xl bg-slate-900 px-8 py-6 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              
              {/* Clear Cart Header */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  {cartCount} {cartCount === 1 ? 'Item' : 'Items'}
                </span>
                <button
                  onClick={clearCart}
                  className="group flex items-center gap-1.5 text-xs font-bold text-rose-500 transition-colors hover:text-rose-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Clear All</span>
                </button>
              </div>

              {/* Items List */}
              <div className="flex flex-col gap-4">
                {cart.map((item) => (
                  <div
                    key={item.pidProduct}
                    className="group relative flex gap-4 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800/60 dark:bg-slate-900"
                  >
                    {/* Product Image */}
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        className="object-cover mix-blend-multiply dark:mix-blend-normal"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-1 flex-col py-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            {item.productBrand || 'Device'}
                          </p>
                          <h4 className="mt-0.5 line-clamp-2 text-sm font-bold leading-snug text-slate-900 dark:text-white">
                            {item.productName}
                          </h4>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.pidProduct)}
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400 opacity-0 transition-all hover:bg-rose-50 hover:text-rose-500 group-hover:opacity-100 dark:bg-slate-800 dark:hover:bg-rose-900/30"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-3">
                        <span className="text-sm font-black tracking-tight text-blue-600 dark:text-blue-400">
                          ₦{(item.productPrice * item.quantity).toLocaleString()}
                        </span>

                        {/* Minimalist Quantity Controls */}
                        <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
                          <button
                            className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-slate-500 shadow-sm transition hover:text-slate-900 dark:bg-slate-700 dark:text-slate-300 dark:hover:text-white"
                            onClick={() => updateQuantity(item.pidProduct, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-slate-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-slate-500 shadow-sm transition hover:text-slate-900 dark:bg-slate-700 dark:text-slate-300 dark:hover:text-white"
                            onClick={() => updateQuantity(item.pidProduct, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer / Checkout Area */}
        {cart.length > 0 && (
          <div className="border-t border-slate-100 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="mb-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-500 dark:text-slate-400">Subtotal</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  ₦{cartTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-500 dark:text-slate-400">Shipping</span>
                <span className="font-medium text-slate-400">Calculated at checkout</span>
              </div>
              
              <div className="my-2 border-t border-slate-200 border-dashed dark:border-slate-700" />
              
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-slate-900 dark:text-white">Total</span>
                <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                  ₦{cartTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 active:scale-[0.98]"
            >
              Checkout Now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}