'use client';

import { useState, useEffect } from 'react';
import { CartItem } from './App';
import { WalletPaymentDialog } from './WalletPaymentDialog';
import { PaymentSuccessDialog } from './PaymentSuccessDialog';
import ImageWithFallback from '../../favicon.ico';
import { MobileHeader } from './MobileHeader';

interface CheckoutProps {
  cartItems?: CartItem[];
  singleProduct?: CartItem;
  onBackToCart?: () => void;
  onBackToProduct?: () => void;
  onBulkBuyer: () => void;
  onGoToOrders?: () => void;
}

interface AddressForm {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
}

export default function Checkout({
  cartItems = [],
  singleProduct,
  onBackToCart,
  onBackToProduct,
  onBulkBuyer,
  onGoToOrders,
}: CheckoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [showWalletDialog, setShowWalletDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'paystack'>(
    'wallet',
  );
  const [lastOrderNumber, setLastOrderNumber] = useState('');
  const [addressForm, setAddressForm] = useState<AddressForm>({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Determine if we're checking out a single product or cart items
  const items = singleProduct ? [singleProduct] : cartItems;
  const isFromCart = !singleProduct;

  // Calculate totals
  const subtotal = items.reduce((total, item) => {
    const price = parseInt(item.price.replace(/[₦,]/g, ''));
    return total + price * item.quantity;
  }, 0);

  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  // Check if address form is complete
  const isAddressComplete = Object.values(addressForm).every(
    (value) => value.trim() !== '',
  );

  const handleAddressChange = (field: keyof AddressForm, value: string) => {
    setAddressForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePayWithPaystack = () => {
    if (!isAddressComplete) {
      alert('Please complete your address information before proceeding.');
      return;
    }

    setPaymentMethod('paystack');
    // Simulate Paystack payment success
    const orderNumber = `#${Date.now().toString().slice(-6)}`;
    setLastOrderNumber(orderNumber);

    // For demo purposes, show success immediately
    // In real implementation, this would integrate with actual Paystack
    setTimeout(() => {
      setShowSuccessDialog(true);
    }, 1000);
  };

  const handlePayWithWallet = () => {
    if (!isAddressComplete) {
      alert('Please complete your address information before proceeding.');
      return;
    }
    setPaymentMethod('wallet');
    setShowWalletDialog(true);
  };

  const handleWalletPaymentComplete = () => {
    setShowWalletDialog(false);
    const orderNumber = `#${Date.now().toString().slice(-6)}`;
    setLastOrderNumber(orderNumber);
    setShowSuccessDialog(true);
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    // Navigate back to store or cart
    if (onBackToCart) {
      onBackToCart();
    } else if (onBackToProduct) {
      onBackToProduct();
    }
  };

  const handleGoToOrders = () => {
    setShowSuccessDialog(false);
    if (onGoToOrders) {
      onGoToOrders();
    }
  };

  const handleBackButtonClick = () => {
    if (isFromCart && onBackToCart) {
      onBackToCart();
    } else if (!isFromCart && onBackToProduct) {
      onBackToProduct();
    }
  };

  return (
    <>
      <div className="mx-auto min-h-screen max-w-7xl bg-background px-4 py-6 md:px-8 md:py-12">
        {/* Desktop Header */}
        <div className="mb-8 hidden md:block">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={isFromCart ? onBackToCart : onBackToProduct}
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
                  {isFromCart ? 'Back to Cart' : 'Back to Product'}
                </span>
              </button>
              <h1 className="text-2xl font-semibold text-foreground">
                Checkout
              </h1>
            </div>
            <button
              onClick={onBulkBuyer}
              className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 transition-colors hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
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
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden">
          <MobileHeader />
          {/* Mobile Back Button and Title */}
          <div className="flex items-center justify-between border-b border-border bg-background px-5 py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackButtonClick}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-600 transition-colors hover:bg-slate-700 dark:bg-muted dark:hover:bg-muted/80"
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
              </button>
              <h1 className="font-medium text-foreground">Checkout</h1>
            </div>
            <button
              onClick={onBulkBuyer}
              className="flex items-center gap-2 rounded-lg bg-purple-600 px-3 py-2 transition-colors hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
            >
              <div className="h-4 w-4">
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
              <span className="text-xs font-medium text-white">
                Bulk Buyer?
              </span>
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden gap-8 lg:grid lg:grid-cols-2">
          {/* Left Column - Address & Payment */}
          <div className="space-y-8">
            {/* Shipping Address */}
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-6 text-lg font-semibold text-foreground">
                Shipping Address
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={addressForm.fullName}
                    onChange={(e) =>
                      handleAddressChange('fullName', e.target.value)
                    }
                    className="bg-input-background w-full rounded-lg border border-border px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-input dark:focus:ring-primary"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={addressForm.email}
                    onChange={(e) =>
                      handleAddressChange('email', e.target.value)
                    }
                    className="bg-input-background w-full rounded-lg border border-border px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-input dark:focus:ring-primary"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={addressForm.phoneNumber}
                    onChange={(e) =>
                      handleAddressChange('phoneNumber', e.target.value)
                    }
                    className="bg-input-background w-full rounded-lg border border-border px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-input dark:focus:ring-primary"
                    placeholder="+234 xxx xxx xxxx"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Street Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={addressForm.address}
                    onChange={(e) =>
                      handleAddressChange('address', e.target.value)
                    }
                    className="bg-input-background w-full rounded-lg border border-border px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-input dark:focus:ring-primary"
                    placeholder="Enter your street address"
                  />
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={addressForm.city}
                    onChange={(e) =>
                      handleAddressChange('city', e.target.value)
                    }
                    className="bg-input-background w-full rounded-lg border border-border px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-input dark:focus:ring-primary"
                    placeholder="Enter your city"
                  />
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    State *
                  </label>
                  <input
                    type="text"
                    id="state"
                    value={addressForm.state}
                    onChange={(e) =>
                      handleAddressChange('state', e.target.value)
                    }
                    className="bg-input-background w-full rounded-lg border border-border px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-input dark:focus:ring-primary"
                    placeholder="Enter your state"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="postalCode"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    value={addressForm.postalCode}
                    onChange={(e) =>
                      handleAddressChange('postalCode', e.target.value)
                    }
                    className="bg-input-background w-full rounded-lg border border-border px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-input dark:focus:ring-primary"
                    placeholder="Enter postal code"
                  />
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-6 text-lg font-semibold text-foreground">
                Payment Methods
              </h2>

              <div className="space-y-3">
                <button
                  onClick={handlePayWithPaystack}
                  disabled={!isAddressComplete}
                  className={`w-full rounded-lg border p-4 text-left transition-all ${
                    isAddressComplete
                      ? 'border-border hover:border-indigo-500 hover:bg-indigo-50 dark:hover:border-primary dark:hover:bg-primary/10'
                      : 'cursor-not-allowed border-border bg-muted opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <svg
                        className="h-5 w-5 text-blue-600 dark:text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 10H21V18C21 18.5523 20.5523 19 20 19H4C3.44772 19 3 18.5523 3 18V10ZM3 10V6C3 5.44772 3.44772 5 4 5H20C20.5523 5 21 5.44772 21 6V10M3 10H21M7 15H10"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">
                        Pay With Paystack
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Pay securely with your card or bank transfer
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={handlePayWithWallet}
                  disabled={!isAddressComplete}
                  className={`w-full rounded-lg border p-4 text-left transition-all ${
                    isAddressComplete
                      ? 'border-border hover:border-indigo-500 hover:bg-indigo-50 dark:hover:border-primary dark:hover:bg-primary/10'
                      : 'cursor-not-allowed border-border bg-muted opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                      <svg
                        className="h-5 w-5 text-purple-600 dark:text-purple-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8C13.1046 8 14 7.10457 14 6C14 4.89543 13.1046 4 12 4C10.8954 4 10 4.89543 10 6C10 7.10457 10.8954 8 12 8ZM12 8V21M12 8L16 12M12 8L8 12"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">
                        Pay from Wallet
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Use your wallet balance
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              {!isAddressComplete && (
                <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    <span className="font-medium">Complete your address</span>{' '}
                    to enable payment options
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="h-fit rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold text-foreground">
              Order Summary
            </h2>

            {/* Items */}
            <div className="mb-6 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-lg bg-muted">
                    <img
                      src={typeof item.image === 'string' ? item.image : 'null'}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="line-clamp-2 text-sm font-medium text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Totals */}
            <div className="space-y-3 border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">
                  ₦{subtotal.toLocaleString()}.00
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  Free
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="text-lg font-semibold text-foreground">
                  Total
                </span>
                <span className="text-lg font-semibold text-foreground">
                  ₦{total.toLocaleString()}.00
                </span>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 text-green-600 dark:text-green-400">
                  <svg
                    className="block size-full"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15V9M12 9L16 13M12 9L8 13M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-green-800 dark:text-green-200">
                  <span className="font-medium">Secure checkout</span> - Your
                  information is protected
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="space-y-6 pb-6 lg:hidden">
          {/* Shipping Address */}
          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-foreground">
              Shipping Address
            </h2>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label
                  htmlFor="fullName-mobile"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName-mobile"
                  value={addressForm.fullName}
                  onChange={(e) =>
                    handleAddressChange('fullName', e.target.value)
                  }
                  className="bg-input-background w-full rounded-lg border border-border px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-input dark:focus:ring-primary"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label
                  htmlFor="email-mobile"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email-mobile"
                  value={addressForm.email}
                  onChange={(e) => handleAddressChange('email', e.target.value)}
                  className="bg-input-background w-full rounded-lg border border-border px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-input dark:focus:ring-primary"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="phoneNumber-mobile"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phoneNumber-mobile"
                  value={addressForm.phoneNumber}
                  onChange={(e) =>
                    handleAddressChange('phoneNumber', e.target.value)
                  }
                  className="bg-input-background w-full rounded-lg border border-border px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-input dark:focus:ring-primary"
                  placeholder="+234 xxx xxx xxxx"
                />
              </div>

              <div>
                <label
                  htmlFor="address-mobile"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Street Address *
                </label>
                <input
                  type="text"
                  id="address-mobile"
                  value={addressForm.address}
                  onChange={(e) =>
                    handleAddressChange('address', e.target.value)
                  }
                  className="bg-input-background w-full rounded-lg border border-border px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-input dark:focus:ring-primary"
                  placeholder="Enter your street address"
                />
              </div>

              <div>
                <label
                  htmlFor="city-mobile"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  City *
                </label>
                <input
                  type="text"
                  id="city-mobile"
                  value={addressForm.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  className="bg-input-background w-full rounded-lg border border-border px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-input dark:focus:ring-primary"
                  placeholder="Enter your city"
                />
              </div>

              <div>
                <label
                  htmlFor="state-mobile"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  State *
                </label>
                <input
                  type="text"
                  id="state-mobile"
                  value={addressForm.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  className="bg-input-background w-full rounded-lg border border-border px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-input dark:focus:ring-primary"
                  placeholder="Enter your state"
                />
              </div>

              <div>
                <label
                  htmlFor="postalCode-mobile"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Postal Code *
                </label>
                <input
                  type="text"
                  id="postalCode-mobile"
                  value={addressForm.postalCode}
                  onChange={(e) =>
                    handleAddressChange('postalCode', e.target.value)
                  }
                  className="bg-input-background w-full rounded-lg border border-border px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-input dark:focus:ring-primary"
                  placeholder="Enter postal code"
                />
              </div>
            </div>
          </div>

          {/* Order Summary - Now appears before Payment Methods on mobile */}
          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-foreground">
              Order Summary
            </h2>

            {/* Items */}
            <div className="mb-6 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-lg bg-muted">
                    <img
                      src={typeof item.image === 'string' ? item.image : 'null'}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="line-clamp-2 text-sm font-medium text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Totals */}
            <div className="space-y-3 border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">
                  ₦{subtotal.toLocaleString()}.00
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  Free
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="text-lg font-semibold text-foreground">
                  Total
                </span>
                <span className="text-lg font-semibold text-foreground">
                  ₦{total.toLocaleString()}.00
                </span>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 text-green-600 dark:text-green-400">
                  <svg
                    className="block size-full"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15V9M12 9L16 13M12 9L8 13M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-green-800 dark:text-green-200">
                  <span className="font-medium">Secure checkout</span> - Your
                  information is protected
                </p>
              </div>
            </div>
          </div>

          {/* Payment Methods - Now appears after Order Summary on mobile */}
          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-foreground">
              Payment Methods
            </h2>

            <div className="space-y-3">
              <button
                onClick={handlePayWithPaystack}
                disabled={!isAddressComplete}
                className={`w-full rounded-lg border p-4 text-left transition-all ${
                  isAddressComplete
                    ? 'border-border hover:border-indigo-500 hover:bg-indigo-50 dark:hover:border-primary dark:hover:bg-primary/10'
                    : 'cursor-not-allowed border-border bg-muted opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <svg
                      className="h-5 w-5 text-blue-600 dark:text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 10H21V18C21 18.5523 20.5523 19 20 19H4C3.44772 19 3 18.5523 3 18V10ZM3 10V6C3 5.44772 3.44772 5 4 5H20C20.5523 5 21 5.44772 21 6V10M3 10H21M7 15H10"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      Pay With Paystack
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Pay securely with your card or bank transfer
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={handlePayWithWallet}
                disabled={!isAddressComplete}
                className={`w-full rounded-lg border p-4 text-left transition-all ${
                  isAddressComplete
                    ? 'border-border hover:border-indigo-500 hover:bg-indigo-50 dark:hover:border-primary dark:hover:bg-primary/10'
                    : 'cursor-not-allowed border-border bg-muted opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <svg
                      className="h-5 w-5 text-purple-600 dark:text-purple-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8C13.1046 8 14 7.10457 14 6C14 4.89543 13.1046 4 12 4C10.8954 4 10 4.89543 10 6C10 7.10457 10.8954 8 12 8ZM12 8V21M12 8L16 12M12 8L8 12"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      Pay from Wallet
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Use your wallet balance
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {!isAddressComplete && (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <span className="font-medium">Complete your address</span> to
                  enable payment options
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <WalletPaymentDialog
        isOpen={showWalletDialog}
        onClose={() => setShowWalletDialog(false)}
        onPaymentComplete={handleWalletPaymentComplete}
        totalAmount={total}
        items={items}
      />

      <PaymentSuccessDialog
        isOpen={showSuccessDialog}
        onClose={handleSuccessDialogClose}
        orderNumber={lastOrderNumber}
        paymentMethod={paymentMethod}
        onGoToOrders={handleGoToOrders}
      />
    </>
  );
}
