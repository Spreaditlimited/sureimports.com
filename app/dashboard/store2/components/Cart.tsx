"use client";

import { useState, useEffect } from "react";
import svgPaths from "../imports/svg-f4xdchptqj";
import { Product } from "./App";
import { ThemeToggle } from "./ThemeToggle";
import  ImageWithFallback from '../../favicon.ico';

interface CartItem extends Product {
  quantity: number;
}

interface CartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
  onBackToStore: () => void;
  onBulkBuyer?: () => void;
  onCheckout?: () => void;
}

function CartItemRow({ item, onUpdateQuantity, onRemoveItem }: { 
  item: CartItem; 
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onRemoveItem: (productId: number) => void;
}) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-border">
      {/* Product Image */}
      <div className="bg-muted rounded-lg size-16 md:size-20 border border-border overflow-hidden flex-shrink-0">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm md:text-base leading-tight line-clamp-2 text-card-foreground">{item.title}</h3>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">Brand: {item.brand}</p>
        <p className="font-medium text-base md:text-lg text-card-foreground mt-2">{item.price}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3">
        <div className="bg-background border border-border rounded-lg h-8 md:h-10 flex items-center px-2 md:px-3 gap-2 md:gap-3">
          <button
            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
            className="w-4 h-4 md:w-5 md:h-5 flex items-center justify-center hover:opacity-70 transition-opacity"
          >
            <svg className="block size-full" fill="none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16">
              <path d="M4 8H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-foreground" />
            </svg>
          </button>
          <span className="font-semibold text-sm md:text-base text-foreground min-w-[20px] text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="w-4 h-4 md:w-5 md:h-5 flex items-center justify-center hover:opacity-70 transition-opacity"
          >
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
              <path d="M1 7H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="stroke-foreground" />
              <path d="M7 13V1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="stroke-foreground" />
            </svg>
          </button>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemoveItem(item.id)}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-1.5 md:p-2 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
        >
          <div className="w-3 h-3 md:w-4 md:h-4">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 18">
              <path d={svgPaths.p25e0dc00} fill="#F24444" />
              <path d={svgPaths.p61e3700} fill="#F24444" />
              <path d={svgPaths.p10e1fc00} fill="#F24444" />
              <path d={svgPaths.p24d19500} fill="#F24444" />
              <path d={svgPaths.p119fe100} fill="#F24444" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}

function OrderSummary({ cartItems, onCheckoutClick }: { cartItems: CartItem[]; onCheckoutClick: () => void }) {
  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseInt(item.price.replace(/[₦,]/g, '').split('.')[0]);
    return sum + (price * item.quantity);
  }, 0);
  
  const shippingCharge = 1000;
  const tax = 2500;
  const total = subtotal + shippingCharge + tax;

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 w-full">
      <div className="space-y-4">
        {/* Title */}
        <h2 className="font-semibold text-lg md:text-xl text-card-foreground">Order Summary</h2>

        {/* Divider */}
        <div className="border-t border-border"></div>

        {/* Summary Items */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Subtotal:</span>
            <span className="font-medium text-sm text-card-foreground">₦{subtotal.toLocaleString()}.00</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Shipping:</span>
            <span className="font-medium text-sm text-card-foreground">₦{shippingCharge.toLocaleString()}.00</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Tax:</span>
            <span className="font-medium text-sm text-card-foreground">₦{tax.toLocaleString()}.00</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border"></div>

        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="font-semibold text-base md:text-lg text-card-foreground">Total:</span>
          <span className="font-semibold text-base md:text-lg text-card-foreground">₦{total.toLocaleString()}.00</span>
        </div>

        {/* Promo Code */}
        <div className="relative">
          <div className="bg-background border border-border rounded-lg h-10 w-full relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                <path d={svgPaths.p3623000} className="fill-foreground" />
                <path d={svgPaths.p2ea8de00} className="fill-foreground" />
                <path d={svgPaths.p295a6900} className="fill-foreground" />
                <path d={svgPaths.p2dd4b600} className="fill-foreground" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Add Promo Code"
              className="w-full h-full pl-10 pr-20 rounded-lg text-sm text-foreground placeholder:text-muted-foreground bg-transparent border-none outline-none"
            />
            <button className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-indigo-800 dark:bg-primary hover:bg-indigo-900 dark:hover:bg-primary/90 transition-colors text-white dark:text-primary-foreground px-3 md:px-4 py-1.5 rounded-md font-medium text-sm flex items-center gap-1">
              Apply
              <div className="w-4 h-4">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                  <path d={svgPaths.p261e480} fill="white" className="dark:fill-primary-foreground" />
                  <path d={svgPaths.p1fa47c80} fill="white" className="dark:fill-primary-foreground" />
                  <path d={svgPaths.p10ac3380} fill="white" className="dark:fill-primary-foreground" />
                </svg>
              </div>
            </button>
          </div>
        </div>

        {/* Checkout Button */}
        <button 
          onClick={onCheckoutClick}
          className="w-full bg-indigo-800 dark:bg-primary hover:bg-indigo-900 dark:hover:bg-primary/90 transition-colors text-white dark:text-primary-foreground rounded-lg py-3 font-medium text-base flex items-center justify-center gap-2"
        >
          Checkout Now
          <div className="w-5 h-5">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
              <path d={svgPaths.p261e480} fill="white" className="dark:fill-primary-foreground" />
              <path d={svgPaths.p1fa47c80} fill="white" className="dark:fill-primary-foreground" />
              <path d={svgPaths.p10ac3380} fill="white" className="dark:fill-primary-foreground" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}

// Mobile Header Component
function MobileHeader({ onBulkBuyer, onBackToStore }: { onBulkBuyer?: () => void; onBackToStore: () => void }) {
  return (
    <div className="mb-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToStore}
            className="bg-slate-600 hover:bg-slate-700 dark:bg-muted dark:hover:bg-muted/80 transition-colors flex items-center gap-1 px-2 py-1 rounded-lg"
          >
            <div className="w-3 h-3">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                <path d="M15 18L9 12L15 6" stroke="white" className="dark:stroke-foreground" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-medium text-white dark:text-foreground text-xs">
              Back
            </span>
          </button>
          <h1 className="text-lg font-semibold text-foreground">Shopping Cart</h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {onBulkBuyer && (
            <button
              onClick={onBulkBuyer}
              className="bg-purple-600 hover:bg-purple-700 transition-colors flex items-center gap-1 px-2 py-1 rounded-lg"
            >
              <div className="w-3 h-3">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                  <path d="M16 11V7C16 5.89543 15.1046 5 14 5H10C8.89543 5 8 5.89543 8 7V11M5 9H19L18 21H6L5 9Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 12V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 12V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15 12V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="font-medium text-white text-xs">Bulk?</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Cart({ cartItems, onUpdateQuantity, onRemoveItem, onClearCart, onBackToStore, onBulkBuyer, onCheckout }: CartProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCheckoutClick = () => {
    if (onCheckout) {
      onCheckout();
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-background mx-auto max-w-7xl px-4 md:px-8 py-6 md:py-12 min-h-screen">
        {/* Mobile Header */}
        {isMobile ? (
          <MobileHeader onBulkBuyer={onBulkBuyer} onBackToStore={onBackToStore} />
        ) : (
          /* Desktop Header */
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-foreground">Shopping Cart</h1>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                {onBulkBuyer && (
                  <button
                    onClick={onBulkBuyer}
                    className="bg-purple-600 hover:bg-purple-700 transition-colors flex items-center gap-2 px-4 py-2 rounded-lg"
                  >
                    <div className="w-5 h-5">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                        <path d="M16 11V7C16 5.89543 15.1046 5 14 5H10C8.89543 5 8 5.89543 8 7V11M5 9H19L18 21H6L5 9Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 12V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9 12V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M15 12V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="font-medium text-white text-sm">Bulk Buyer?</span>
                  </button>
                )}
                <button
                  onClick={onBackToStore}
                  className="bg-slate-600 hover:bg-slate-700 dark:bg-muted dark:hover:bg-muted/80 transition-colors flex items-center gap-2 px-4 py-2 rounded-lg"
                >
                  <div className="w-5 h-5">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                      <path d="M15 18L9 12L15 6" stroke="white" className="dark:stroke-foreground" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="font-medium text-white dark:text-foreground text-sm">Back to Store</span>
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 opacity-50 text-muted-foreground">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
              <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16 5 16H17M17 13V16M9 19.5A1.5 1.5 0 1 1 12 19.5 1.5 1.5 0 0 1 9 19.5ZM20 19.5A1.5 1.5 0 1 1 23 19.5 1.5 1.5 0 0 1 20 19.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-foreground mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">Add some products to your cart to get started</p>
          <button
            onClick={onBackToStore}
            className="bg-indigo-800 hover:bg-indigo-900 dark:bg-primary dark:hover:bg-primary/90 transition-colors text-white dark:text-primary-foreground px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2"
          >
            <div className="w-5 h-5">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16 5 16H17M17 13V16M9 19.5A1.5 1.5 0 1 1 12 19.5 1.5 1.5 0 0 1 9 19.5ZM20 19.5A1.5 1.5 0 1 1 23 19.5 1.5 1.5 0 0 1 20 19.5Z" stroke="white" className="dark:stroke-primary-foreground" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background mx-auto max-w-7xl px-4 md:px-8 py-6 md:py-12 min-h-screen">
      {/* Mobile Header */}
      {isMobile ? (
        <MobileHeader onBulkBuyer={onBulkBuyer} onBackToStore={onBackToStore} />
      ) : (
        /* Desktop Header */
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-foreground">Shopping Cart</h1>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              {onBulkBuyer && (
                <button
                  onClick={onBulkBuyer}
                  className="bg-purple-600 hover:bg-purple-700 transition-colors flex items-center gap-2 px-4 py-2 rounded-lg"
                >
                  <div className="w-5 h-5">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                      <path d="M16 11V7C16 5.89543 15.1046 5 14 5H10C8.89543 5 8 5.89543 8 7V11M5 9H19L18 21H6L5 9Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 12V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9 12V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M15 12V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="font-medium text-white text-sm">Bulk Buyer?</span>
                </button>
              )}
              <button
                onClick={onBackToStore}
                className="bg-slate-600 hover:bg-slate-700 dark:bg-muted dark:hover:bg-muted/80 transition-colors flex items-center gap-2 px-4 py-2 rounded-lg"
              >
                <div className="w-5 h-5">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                    <path d="M15 18L9 12L15 6" stroke="white" className="dark:stroke-foreground" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="font-medium text-white dark:text-foreground text-sm">Back to Store</span>
              </button>
            </div>
          </div>
          <p className="text-base text-muted-foreground mt-2">
            Review your items and proceed to checkout when ready.
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-xl p-4 md:p-6">
            <div className="space-y-4">
              {/* Section Title */}
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-base md:text-lg text-card-foreground">
                  Cart Items ({cartItems.length})
                </h3>
                {cartItems.length > 0 && (
                  <button
                    onClick={onClearCart}
                    className="text-sm text-muted-foreground hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-border"></div>

              {/* Cart Items */}
              <div className="space-y-0">
                {cartItems.map((item, index) => (
                  <div key={item.id}>
                    <CartItemRow 
                      item={item}
                      onUpdateQuantity={onUpdateQuantity}
                      onRemoveItem={onRemoveItem}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <OrderSummary cartItems={cartItems} onCheckoutClick={handleCheckoutClick} />
        </div>
      </div>
    </div>
  );
}