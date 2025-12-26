'use client';

import { useState, useEffect } from 'react';
import svgPaths from '../imports/svg-f4xdchptqj';
import { Product } from './App';
import { ThemeToggle } from './ThemeToggle';
import ImageWithFallback from '../../favicon.ico';

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

function CartItemRow({
  item,
  onUpdateQuantity,
  onRemoveItem,
}: {
  item: CartItem;
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onRemoveItem: (productId: number) => void;
}) {
  return (
    <div className="flex items-center gap-4 border-b border-border py-4">
      {/* Product Image */}
      <div className="size-16 flex-shrink-0 overflow-hidden rounded-lg border border-border bg-muted md:size-20">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-sm font-medium leading-tight text-card-foreground md:text-base">
          {item.title}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground md:text-sm">
          Brand: {item.brand}
        </p>
        <p className="mt-2 text-base font-medium text-card-foreground md:text-lg">
          {item.price}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex flex-col items-center gap-2 md:flex-row md:gap-3">
        <div className="flex h-8 items-center gap-2 rounded-lg border border-border bg-background px-2 md:h-10 md:gap-3 md:px-3">
          <button
            onClick={() =>
              onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
            }
            className="flex h-4 w-4 items-center justify-center transition-opacity hover:opacity-70 md:h-5 md:w-5"
          >
            <svg
              className="block size-full"
              fill="none"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 16 16"
            >
              <path
                d="M4 8H12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-foreground"
              />
            </svg>
          </button>
          <span className="min-w-[20px] text-center text-sm font-semibold text-foreground md:text-base">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="flex h-4 w-4 items-center justify-center transition-opacity hover:opacity-70 md:h-5 md:w-5"
          >
            <svg
              className="block size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 14 14"
            >
              <path
                d="M1 7H13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-foreground"
              />
              <path
                d="M7 13V1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-foreground"
              />
            </svg>
          </button>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemoveItem(item.id)}
          className="rounded-lg border border-red-200 bg-red-50 p-1.5 transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:hover:bg-red-900/30 md:p-2"
        >
          <div className="h-3 w-3 md:h-4 md:w-4">
            <svg
              className="block size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 17 18"
            >
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

function OrderSummary({
  cartItems,
  onCheckoutClick,
}: {
  cartItems: CartItem[];
  onCheckoutClick: () => void;
}) {
  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseInt(item.price.replace(/[₦,]/g, '').split('.')[0]);
    return sum + price * item.quantity;
  }, 0);

  const shippingCharge = 1000;
  const tax = 2500;
  const total = subtotal + shippingCharge + tax;

  return (
    <div className="w-full rounded-xl border border-border bg-card p-4 md:p-6">
      <div className="space-y-4">
        {/* Title */}
        <h2 className="text-lg font-semibold text-card-foreground md:text-xl">
          Order Summary
        </h2>

        {/* Divider */}
        <div className="border-t border-border"></div>

        {/* Summary Items */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Subtotal:</span>
            <span className="text-sm font-medium text-card-foreground">
              ₦{subtotal.toLocaleString()}.00
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Shipping:</span>
            <span className="text-sm font-medium text-card-foreground">
              ₦{shippingCharge.toLocaleString()}.00
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Tax:</span>
            <span className="text-sm font-medium text-card-foreground">
              ₦{tax.toLocaleString()}.00
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border"></div>

        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-card-foreground md:text-lg">
            Total:
          </span>
          <span className="text-base font-semibold text-card-foreground md:text-lg">
            ₦{total.toLocaleString()}.00
          </span>
        </div>

        {/* Promo Code */}
        <div className="relative">
          <div className="relative h-10 w-full rounded-lg border border-border bg-background">
            <div className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 24 24"
              >
                <path d={svgPaths.p3623000} className="fill-foreground" />
                <path d={svgPaths.p2ea8de00} className="fill-foreground" />
                <path d={svgPaths.p295a6900} className="fill-foreground" />
                <path d={svgPaths.p2dd4b600} className="fill-foreground" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Add Promo Code"
              className="h-full w-full rounded-lg border-none bg-transparent pl-10 pr-20 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button className="absolute right-1 top-1/2 flex -translate-y-1/2 transform items-center gap-1 rounded-md bg-indigo-800 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-900 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 md:px-4">
              Apply
              <div className="h-4 w-4">
                <svg
                  className="block size-full"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d={svgPaths.p261e480}
                    fill="white"
                    className="dark:fill-primary-foreground"
                  />
                  <path
                    d={svgPaths.p1fa47c80}
                    fill="white"
                    className="dark:fill-primary-foreground"
                  />
                  <path
                    d={svgPaths.p10ac3380}
                    fill="white"
                    className="dark:fill-primary-foreground"
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={onCheckoutClick}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-800 py-3 text-base font-medium text-white transition-colors hover:bg-indigo-900 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
        >
          Checkout Now
          <div className="h-5 w-5">
            <svg
              className="block size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 24 24"
            >
              <path
                d={svgPaths.p261e480}
                fill="white"
                className="dark:fill-primary-foreground"
              />
              <path
                d={svgPaths.p1fa47c80}
                fill="white"
                className="dark:fill-primary-foreground"
              />
              <path
                d={svgPaths.p10ac3380}
                fill="white"
                className="dark:fill-primary-foreground"
              />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}

// Mobile Header Component
function MobileHeader({
  onBulkBuyer,
  onBackToStore,
}: {
  onBulkBuyer?: () => void;
  onBackToStore: () => void;
}) {
  return (
    <div className="mb-6">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToStore}
            className="flex items-center gap-1 rounded-lg bg-slate-600 px-2 py-1 transition-colors hover:bg-slate-700 dark:bg-muted dark:hover:bg-muted/80"
          >
            <div className="h-3 w-3">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="white"
                  className="dark:stroke-foreground"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-xs font-medium text-white dark:text-foreground">
              Back
            </span>
          </button>
          <h1 className="text-lg font-semibold text-foreground">
            Shopping Cart
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {onBulkBuyer && (
            <button
              onClick={onBulkBuyer}
              className="flex items-center gap-1 rounded-lg bg-purple-600 px-2 py-1 transition-colors hover:bg-purple-700"
            >
              <div className="h-3 w-3">
                <svg
                  className="block size-full"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M16 11V7C16 5.89543 15.1046 5 14 5H10C8.89543 5 8 5.89543 8 7V11M5 9H19L18 21H6L5 9Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 12V16"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 12V16"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 12V16"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="text-xs font-medium text-white">Bulk?</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Cart({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onBackToStore,
  onBulkBuyer,
  onCheckout,
}: CartProps) {
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
      <div className="mx-auto min-h-screen max-w-7xl bg-background px-4 py-6 md:px-8 md:py-12">
        {/* Mobile Header */}
        {isMobile ? (
          <MobileHeader
            onBulkBuyer={onBulkBuyer}
            onBackToStore={onBackToStore}
          />
        ) : (
          /* Desktop Header */
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-foreground">
                Shopping Cart
              </h1>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                {onBulkBuyer && (
                  <button
                    onClick={onBulkBuyer}
                    className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 transition-colors hover:bg-purple-700"
                  >
                    <div className="h-5 w-5">
                      <svg
                        className="block size-full"
                        fill="none"
                        preserveAspectRatio="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M16 11V7C16 5.89543 15.1046 5 14 5H10C8.89543 5 8 5.89543 8 7V11M5 9H19L18 21H6L5 9Z"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 12V16"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9 12V16"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M15 12V16"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-white">
                      Bulk Buyer?
                    </span>
                  </button>
                )}
                <button
                  onClick={onBackToStore}
                  className="flex items-center gap-2 rounded-lg bg-slate-600 px-4 py-2 transition-colors hover:bg-slate-700 dark:bg-muted dark:hover:bg-muted/80"
                >
                  <div className="h-5 w-5">
                    <svg
                      className="block size-full"
                      fill="none"
                      preserveAspectRatio="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M15 18L9 12L15 6"
                        stroke="white"
                        className="dark:stroke-foreground"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-white dark:text-foreground">
                    Back to Store
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="py-16 text-center">
          <div className="mx-auto mb-4 h-16 w-16 text-muted-foreground opacity-50">
            <svg
              className="block size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 24 24"
            >
              <path
                d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16 5 16H17M17 13V16M9 19.5A1.5 1.5 0 1 1 12 19.5 1.5 1.5 0 0 1 9 19.5ZM20 19.5A1.5 1.5 0 1 1 23 19.5 1.5 1.5 0 0 1 20 19.5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-medium text-foreground">
            Your cart is empty
          </h2>
          <p className="mb-8 text-muted-foreground">
            Add some products to your cart to get started
          </p>
          <button
            onClick={onBackToStore}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-800 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-900 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
          >
            <div className="h-5 w-5">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16 5 16H17M17 13V16M9 19.5A1.5 1.5 0 1 1 12 19.5 1.5 1.5 0 0 1 9 19.5ZM20 19.5A1.5 1.5 0 1 1 23 19.5 1.5 1.5 0 0 1 20 19.5Z"
                  stroke="white"
                  className="dark:stroke-primary-foreground"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-7xl bg-background px-4 py-6 md:px-8 md:py-12">
      {/* Mobile Header */}
      {isMobile ? (
        <MobileHeader onBulkBuyer={onBulkBuyer} onBackToStore={onBackToStore} />
      ) : (
        /* Desktop Header */
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-foreground">
              Shopping Cart
            </h1>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              {onBulkBuyer && (
                <button
                  onClick={onBulkBuyer}
                  className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 transition-colors hover:bg-purple-700"
                >
                  <div className="h-5 w-5">
                    <svg
                      className="block size-full"
                      fill="none"
                      preserveAspectRatio="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M16 11V7C16 5.89543 15.1046 5 14 5H10C8.89543 5 8 5.89543 8 7V11M5 9H19L18 21H6L5 9Z"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 12V16"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9 12V16"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M15 12V16"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-white">
                    Bulk Buyer?
                  </span>
                </button>
              )}
              <button
                onClick={onBackToStore}
                className="flex items-center gap-2 rounded-lg bg-slate-600 px-4 py-2 transition-colors hover:bg-slate-700 dark:bg-muted dark:hover:bg-muted/80"
              >
                <div className="h-5 w-5">
                  <svg
                    className="block size-full"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M15 18L9 12L15 6"
                      stroke="white"
                      className="dark:stroke-foreground"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-white dark:text-foreground">
                  Back to Store
                </span>
              </button>
            </div>
          </div>
          <p className="mt-2 text-base text-muted-foreground">
            Review your items and proceed to checkout when ready.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-4 md:p-6">
            <div className="space-y-4">
              {/* Section Title */}
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-card-foreground md:text-lg">
                  Cart Items ({cartItems.length})
                </h3>
                {cartItems.length > 0 && (
                  <button
                    onClick={onClearCart}
                    className="text-sm text-muted-foreground transition-colors hover:text-red-600 dark:hover:text-red-400"
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
          <OrderSummary
            cartItems={cartItems}
            onCheckoutClick={handleCheckoutClick}
          />
        </div>
      </div>
    </div>
  );
}
