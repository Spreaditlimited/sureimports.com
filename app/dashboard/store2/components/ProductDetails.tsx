"use client";

import { useState, useEffect } from "react";
import svgPaths from "../imports/svg-3g55n0e1d6";
import mobilesvgPaths from "../imports/svg-4aglxup5kq";
import { Product, CartItem } from "./App";
import { WalletPaymentDialog } from "./WalletPaymentDialog";
//import ImageWithFallback from '../../favicon.ico';
import imgSureimportsReverse from '../../../../public/favicon.png';

interface ProductDetailsProps {
  product: Product;
  onBackToStore: () => void;
  onAddToCart: (product: Product) => void;
  cartItems: CartItem[];
  onGoToCart: () => void;
  onBulkBuyer?: () => void;
  onCheckout?: (quantity: number) => void;
  onPaySmallSmall?: (product: Product, quantity: number) => void;
}

// Mobile Header Component
function MobileHeader({ onBulkBuyer, onBackToStore }: { onBulkBuyer?: () => void; onBackToStore: () => void }) {
  return (
    <>
      {/* Dark Header */}
      <div className="bg-[#0e0e1f] dark:bg-card h-[90px] w-full relative">
        {/* Logo */}
        <div 
          className="absolute top-1/2 left-4 transform -translate-y-1/2 w-[180px] h-[20px] bg-no-repeat bg-contain"
          style={{ backgroundImage: `url('${imgSureimportsReverse}')` }}
        />
        
        {/* Hamburger Menu */}
        <div className="absolute top-1/2 right-16 transform -translate-y-1/2 w-[26px] h-[20px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26 20">
            <path d={mobilesvgPaths.p26572800} fill="white" className="dark:fill-foreground" />
          </svg>
        </div>
        
        {/* Search Icon */}
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 w-[26px] h-[26px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26 26">
            <path d={mobilesvgPaths.p14b4c900} fill="white" className="dark:fill-foreground" />
            <path d={mobilesvgPaths.p32503f00} fill="white" className="dark:fill-foreground" />
          </svg>
        </div>
      </div>
      
      {/* Title and Buttons */}
      <div className="flex items-center justify-between px-5 py-6 bg-background">
        <h1 className="text-lg font-semibold text-foreground">
          Product Details
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToStore}
            className="bg-slate-600 hover:bg-slate-700 dark:bg-muted dark:hover:bg-muted/80 transition-colors flex items-center gap-1 px-2 py-1 rounded-lg"
          >
            <div className="w-4 h-4">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                <path d={svgPaths.p3c066000} fill="white" className="dark:fill-foreground" />
                <path d={svgPaths.pff6570} fill="white" className="dark:fill-foreground" />
                <path d={svgPaths.p3e164800} fill="white" className="dark:fill-foreground" />
                <path d={svgPaths.p1faa6100} fill="white" className="dark:fill-foreground" />
              </svg>
            </div>
            <span className="font-medium text-white dark:text-foreground text-xs">Back</span>
          </button>
          {onBulkBuyer && (
            <button
              onClick={onBulkBuyer}
              className="bg-purple-600 hover:bg-purple-700 transition-colors flex items-center gap-2 px-3 py-2 rounded-lg"
            >
              <div className="w-4 h-4">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                  <path d="M16 11V7C16 5.89543 15.1046 5 14 5H10C8.89543 5 8 5.89543 8 7V11M5 9H19L18 21H6L5 9Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 12V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 12V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15 12V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="font-medium text-white text-xs">Bulk Buyer?</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}

// Mobile Product Info Component
function MobileProductInfo({ 
  product, 
  quantity, 
  onQuantityChange, 
  onAddToCart, 
  cartItems, 
  onGoToCart, 
  onPayFromWallet,
  onBackToStore,
  onCheckout,
  onPaySmallSmall
}: { 
  product: Product; 
  quantity: number; 
  onQuantityChange: (quantity: number) => void;
  onAddToCart: (product: Product) => void;
  cartItems: CartItem[];
  onGoToCart: () => void;
  onPayFromWallet: () => void;
  onBackToStore: () => void;
  onCheckout?: (quantity: number) => void;
  onPaySmallSmall?: (product: Product, quantity: number) => void;
}) {
  const [activeTab, setActiveTab] = useState("Description");
  const isInCart = cartItems.some(item => item.id === product.id);

  return (
    <div className="bg-card mx-5 p-5 rounded-xl border border-border shadow-sm">
      <div className="space-y-4">
        {/* Product Image */}
        <div className="bg-muted rounded-xl relative aspect-square overflow-hidden border border-border">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Brand Tag and Add to Cart - Above Title */}
        <div className="flex items-center gap-2">
          <div className="bg-indigo-800 dark:bg-primary inline-flex items-center px-2 py-1 rounded-full">
            <span className="font-medium text-white dark:text-primary-foreground text-xs">{product.brand}</span>
          </div>
          <button
            onClick={() => isInCart ? onGoToCart() : onAddToCart(product)}
            className={`transition-colors inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
              isInCart 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            <div className="w-3 h-3">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                <path
                  d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16 5 16H17M17 13V16M9 19.5A1.5 1.5 0 1 1 12 19.5 1.5 1.5 0 0 1 9 19.5ZM20 19.5A1.5 1.5 0 1 1 23 19.5 1.5 1.5 0 0 1 20 19.5Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="font-medium">
              {isInCart ? 'Go to Cart' : 'Add to Cart'}
            </span>
          </button>
        </div>
        
        {/* Title and Rating */}
        <div>
          <h2 className="font-semibold text-foreground leading-tight mb-1">
            {product.title}
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="w-3 h-3">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
                    <path
                      d={svgPaths.p304c0b00}
                      fill={index < product.rating ? "#FFC107" : "#E0E0E0"}
                    />
                  </svg>
                </div>
              ))}
            </div>
            <span className="text-foreground text-sm">{product.rating}.0</span>
          </div>
        </div>

        {/* Price and Quantity */}
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-foreground">{product.price}</div>
            <div className="text-sm text-muted-foreground">MOQ - 1</div>
          </div>
          <div className="bg-card border border-border flex items-center gap-2 px-2 py-1 rounded-lg">
            <button
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="w-5 h-5 flex items-center justify-center hover:opacity-70 transition-opacity text-foreground"
            >
              <span className="leading-none">−</span>
            </button>
            <span className="font-semibold text-foreground text-sm min-w-[20px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => onQuantityChange(quantity + 1)}
              className="w-5 h-5 flex items-center justify-center hover:opacity-70 transition-opacity text-foreground"
            >
              <span className="leading-none">+</span>
            </button>
          </div>
        </div>

        {/* Product Specs - Filter Panel Aligned */}
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          <div className="bg-muted border border-border px-2 py-1 rounded-md">
            <span className="text-muted-foreground">Category</span>
            <div className="font-medium text-foreground">{product.category}</div>
          </div>
          <div className="bg-muted border border-border px-2 py-1 rounded-md">
            <span className="text-muted-foreground">Brand</span>
            <div className="font-medium text-foreground">{product.brand}</div>
          </div>
          <div className="bg-muted border border-border px-2 py-1 rounded-md">
            <span className="text-muted-foreground">Condition</span>
            <div className="font-medium text-foreground">{product.condition}</div>
          </div>
          {product.memory && (
            <div className="bg-muted border border-border px-2 py-1 rounded-md">
              <span className="text-muted-foreground">Memory</span>
              <div className="font-medium text-foreground">{product.memory} RAM</div>
            </div>
          )}
          {product.storage && (
            <div className="bg-muted border border-border px-2 py-1 rounded-md">
              <span className="text-muted-foreground">Storage</span>
              <div className="font-medium text-foreground">{product.storage} SSD</div>
            </div>
          )}
          {product.hasGraphicsCard && product.graphicsMemory && (
            <div className="bg-muted border border-border px-2 py-1 rounded-md">
              <span className="text-muted-foreground">Graphics</span>
              <div className="font-medium text-foreground">{product.graphicsMemory} VRAM</div>
            </div>
          )}
          {product.warranty && (
            <div className="bg-muted border border-border px-2 py-1 rounded-md col-span-2">
              <span className="text-muted-foreground">Warranty</span>
              <div className="font-medium text-foreground">{product.warranty}</div>
            </div>
          )}
        </div>

        {/* Product Description */}
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground text-sm">Product Description</h3>
          <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
            <p>
              {product.description} This premium device offers exceptional performance and reliability.
            </p>
            <p>
              <strong>What's Included:</strong> Complete original packaging, all standard accessories, warranty documentation, and quick start guide.
            </p>
            <p>
              <strong>Shipping:</strong> Fast 10-day shipping from China with tracking and comprehensive after-sales support.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button 
            onClick={() => onCheckout && onCheckout(quantity)}
            className="flex-1 bg-indigo-800 hover:bg-indigo-900 dark:bg-primary dark:hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 py-3 rounded-lg text-white dark:text-primary-foreground text-sm font-medium"
          >
            <div className="w-5 h-5">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16 5 16H17M17 13V16M9 19.5A1.5 1.5 0 1 1 12 19.5 1.5 1.5 0 0 1 9 19.5ZM20 19.5A1.5 1.5 0 1 1 23 19.5 1.5 1.5 0 0 1 20 19.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            Checkout
          </button>
          
          <button 
            onClick={() => onPaySmallSmall && onPaySmallSmall(product, quantity)}
            className="flex-1 bg-green-600 hover:bg-green-700 transition-colors flex items-center justify-center gap-2 py-3 rounded-lg text-white text-sm font-medium"
          >
            <div className="w-5 h-5">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                <path d="M12 2V22M17 5H9.5C8.11929 5 7 6.11929 7 7.5C7 8.88071 8.11929 10 9.5 10H14.5C15.8807 10 17 11.1193 17 12.5C17 13.8807 15.8807 15 14.5 15H7M21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            Pay Small Small
          </button>
        </div>

        {/* Compact Tabs */}
        <div className="border-t border-border pt-4">
          <div className="flex gap-1 mb-3">
            {["Description", "Features", "Pay Small Small"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-2 py-1 rounded text-sm font-medium transition-colors ${
                  activeTab === tab 
                    ? 'bg-indigo-800 dark:bg-primary text-white dark:text-primary-foreground' 
                    : 'bg-card text-foreground border border-border'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="text-sm text-muted-foreground leading-relaxed">
            {activeTab === "Description" && (
              <p>{product.description} This premium device offers exceptional performance and reliability.</p>
            )}
            {activeTab === "Features" && (
              <ul className="list-disc ml-4 space-y-1">
                <li>Premium build quality</li>
                <li>High-performance components</li>
                <li>Professional design</li>
                <li>Comprehensive warranty</li>
              </ul>
            )}
            {activeTab === "Pay Small Small" && (
              <ul className="list-disc ml-4 space-y-1">
                <li>Flexible payment options</li>
                <li>No hidden fees</li>
                <li>Secure payment processing</li>
                <li>Customer support included</li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Desktop Components
export default function ProductDetails({ product, onBackToStore, onAddToCart, cartItems, onGoToCart, onBulkBuyer, onCheckout, onPaySmallSmall }: ProductDetailsProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showWalletDialog, setShowWalletDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("Description");

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isInCart = cartItems.some(item => item.id === product.id);

  const handlePayFromWallet = () => {
    setShowWalletDialog(true);
  };

  const handleWalletPaymentComplete = () => {
    alert("Payment completed successfully!");
    setShowWalletDialog(false);
  };

  if (isMobile) {
    return (
      <>
        <div className="bg-background min-h-screen">
          <MobileHeader onBulkBuyer={onBulkBuyer} onBackToStore={onBackToStore} />
          <div className="pb-8">
            <MobileProductInfo 
              product={product} 
              quantity={quantity}
              onQuantityChange={setQuantity}
              onAddToCart={onAddToCart}
              cartItems={cartItems}
              onGoToCart={onGoToCart}
              onPayFromWallet={handlePayFromWallet}
              onBackToStore={onBackToStore}
              onCheckout={() => onCheckout && onCheckout(quantity)}
              onPaySmallSmall={onPaySmallSmall}
            />
          </div>
        </div>
        <WalletPaymentDialog
          isOpen={showWalletDialog}
          onClose={() => setShowWalletDialog(false)}
          cartTotal={product.price}
          onPaymentComplete={handleWalletPaymentComplete}
        />
      </>
    );
  }

  return (
    <>
      <div className="bg-background mx-auto max-w-7xl px-8 py-12">
        {/* Header Section - Consistent with main page */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-2">
            <h1 className="text-2xl font-semibold text-foreground">
              Product Details
            </h1>
            <div className="flex items-center gap-3">
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
                    <path d={svgPaths.p3c066000} fill="white" className="dark:fill-foreground" />
                    <path d={svgPaths.pff6570} fill="white" className="dark:fill-foreground" />
                    <path d={svgPaths.p3e164800} fill="white" className="dark:fill-foreground" />
                    <path d={svgPaths.p1faa6100} fill="white" className="dark:fill-foreground" />
                  </svg>
                </div>
                <span className="font-medium text-white dark:text-foreground text-sm">Back to Store</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content - Compact Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-card rounded-xl shadow-sm overflow-hidden border border-border">
            <div className="p-6">
              <div className="relative bg-muted rounded-lg border border-border overflow-hidden aspect-square">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand and Add to Cart - Above Title */}
            <div className="flex items-center gap-3">
              <div className="bg-indigo-800 dark:bg-primary inline-flex items-center px-4 py-2 rounded-lg">
                <span className="font-medium text-white dark:text-primary-foreground">{product.brand}</span>
              </div>
              <button
                onClick={() => isInCart ? onGoToCart() : onAddToCart(product)}
                className={`transition-colors inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                  isInCart 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                <div className="w-4 h-4">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                    <path
                      d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16 5 16H17M17 13V16M9 19.5A1.5 1.5 0 1 1 12 19.5 1.5 1.5 0 0 1 9 19.5ZM20 19.5A1.5 1.5 0 1 1 23 19.5 1.5 1.5 0 0 1 20 19.5Z"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="font-medium">
                  {isInCart ? 'Go to Cart' : 'Add to Cart'}
                </span>
              </button>
            </div>

            {/* Title and Rating */}
            <div>
              <h2 className="text-2xl font-semibold text-foreground leading-tight mb-2">
                {product.title}
              </h2>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="w-4 h-4">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
                        <path
                          d={svgPaths.p304c0b00}
                          fill={index < product.rating ? "#FFC107" : "#E0E0E0"}
                        />
                      </svg>
                    </div>
                  ))}
                </div>
                <span className="text-foreground text-sm">{product.rating}.0</span>
              </div>
            </div>

            {/* Price and Quantity */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-semibold text-foreground">{product.price}</div>
                <div className="text-sm text-muted-foreground">MOQ - 1</div>
              </div>
              <div className="bg-card border border-border flex items-center gap-3 px-3 py-2 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity text-foreground"
                >
                  <span className="leading-none">−</span>
                </button>
                <span className="font-semibold text-foreground min-w-[20px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity text-foreground"
                >
                  <span className="leading-none">+</span>
                </button>
              </div>
            </div>

            {/* Product Specs - Filter Panel Structure */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-muted border border-border px-3 py-2 rounded-lg">
                <span className="text-muted-foreground text-xs block">Category</span>
                <span className="font-medium text-sm text-foreground">{product.category}</span>
              </div>
              <div className="bg-muted border border-border px-3 py-2 rounded-lg">
                <span className="text-muted-foreground text-xs block">Brand</span>
                <span className="font-medium text-sm text-foreground">{product.brand}</span>
              </div>
              <div className="bg-muted border border-border px-3 py-2 rounded-lg">
                <span className="text-muted-foreground text-xs block">Condition</span>
                <span className="font-medium text-sm text-foreground">{product.condition}</span>
              </div>
              {product.memory && (
                <div className="bg-muted border border-border px-3 py-2 rounded-lg">
                  <span className="text-muted-foreground text-xs block">Memory</span>
                  <span className="font-medium text-sm text-foreground">{product.memory} RAM</span>
                </div>
              )}
              {product.storage && (
                <div className="bg-muted border border-border px-3 py-2 rounded-lg">
                  <span className="text-muted-foreground text-xs block">Storage</span>
                  <span className="font-medium text-sm text-foreground">{product.storage} SSD</span>
                </div>
              )}
              {product.hasGraphicsCard && product.graphicsMemory && (
                <div className="bg-muted border border-border px-3 py-2 rounded-lg">
                  <span className="text-muted-foreground text-xs block">Graphics</span>
                  <span className="font-medium text-sm text-foreground">{product.graphicsMemory} VRAM</span>
                </div>
              )}
              {product.warranty && (
                <div className="bg-muted border border-border px-3 py-2 rounded-lg col-span-3">
                  <span className="text-muted-foreground text-xs block">Warranty</span>
                  <span className="font-medium text-sm text-foreground">{product.warranty}</span>
                </div>
              )}
            </div>

            {/* Product Description */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Product Description</h3>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <p>
                  {product.description} This premium device offers exceptional performance, reliability, and style for professionals and enthusiasts alike.
                </p>
                <p>
                  <strong>What's Included:</strong> Complete original packaging, all standard accessories, comprehensive warranty documentation, quick start guide, and premium protective accessories.
                </p>
                <p>
                  <strong>Shipping & Support:</strong> Fast 10-day shipping directly from China with full tracking and insurance coverage. Our dedicated customer support team provides comprehensive after-sales service.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => onCheckout && onCheckout(quantity)}
                className="flex-1 bg-indigo-800 hover:bg-indigo-900 dark:bg-primary dark:hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 py-4 rounded-lg text-white dark:text-primary-foreground font-medium"
              >
                <div className="w-6 h-6">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                    <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16 5 16H17M17 13V16M9 19.5A1.5 1.5 0 1 1 12 19.5 1.5 1.5 0 0 1 9 19.5ZM20 19.5A1.5 1.5 0 1 1 23 19.5 1.5 1.5 0 0 1 20 19.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                Checkout
              </button>
              
              <button
                onClick={() => onPaySmallSmall && onPaySmallSmall(product, quantity)}
                className="flex-1 bg-green-600 hover:bg-green-700 transition-colors flex items-center justify-center gap-2 py-4 rounded-lg text-white font-medium"
              >
                <div className="w-6 h-6">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                    <path d="M12 2V22M17 5H9.5C8.11929 5 7 6.11929 7 7.5C7 8.88071 8.11929 10 9.5 10H14.5C15.8807 10 17 11.1193 17 12.5C17 13.8807 15.8807 15 14.5 15H7M21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                Pay Small Small
              </button>
            </div>

            {/* Tabs Section */}
            <div className="border-t border-border pt-6">
              <div className="flex gap-2 mb-4">
                {["Description", "Features", "Pay Small Small"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === tab 
                        ? 'bg-indigo-800 dark:bg-primary text-white dark:text-primary-foreground' 
                        : 'bg-muted hover:bg-muted/80 text-foreground'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              
              <div className="text-muted-foreground leading-relaxed">
                {activeTab === "Description" && (
                  <p>{product.description} This premium device offers exceptional performance, reliability, and style for professionals and enthusiasts alike.</p>
                )}
                {activeTab === "Features" && (
                  <ul className="list-disc ml-6 space-y-2">
                    <li>Premium build quality with attention to detail</li>
                    <li>High-performance components for demanding tasks</li>
                    <li>Professional design that stands out</li>
                    <li>Comprehensive warranty and support</li>
                    <li>Genuine accessories and original packaging</li>
                  </ul>
                )}
                {activeTab === "Pay Small Small" && (
                  <div className="space-y-3">
                    <p>Our flexible payment system allows you to pay in smaller, manageable installments:</p>
                    <ul className="list-disc ml-6 space-y-2">
                      <li>Flexible payment options tailored to your needs</li>
                      <li>No hidden fees or surprise charges</li>
                      <li>Secure payment processing with bank-level security</li>
                      <li>Dedicated customer support throughout the process</li>
                      <li>Build your credit score with timely payments</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <WalletPaymentDialog
        isOpen={showWalletDialog}
        onClose={() => setShowWalletDialog(false)}
        cartTotal={product.price}
        onPaymentComplete={handleWalletPaymentComplete}
      />
    </>
  );
}