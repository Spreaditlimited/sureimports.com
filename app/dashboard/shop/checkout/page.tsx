'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  CreditCard,
  Loader2,
  Wallet,
  Minus,
  Plus,
  Trash2,
} from 'lucide-react';
import { useShopCart } from '@/app/context/ShopCartContext';
import { useAuth } from '@/app/context/AuthContext';
import { toast } from 'sonner';
import Loading from '../../loading';

declare global {
  interface Window {
    PaystackPop: any;
  }
}

function CheckoutContent() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    cart,
    cartCount,
    cartTotal,
    clearCart,
    updateQuantity,
    removeFromCart,
  } = useShopCart();

  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    // Redirect if cart is empty
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      router.push('/dashboard/shop');
    }

    // Load Paystack script
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);

    // Fetch wallet balance and shipping address
    if (user?.userEmail) {
      fetchWalletBalance();
      fetchShippingAddress();
    }

    return () => {
      document.body.removeChild(script);
    };
  }, [cart, router, user]);

  // Fetch wallet balance
  const fetchWalletBalance = async () => {
    if (!user?.userEmail) return;

    setLoadingWallet(true);
    try {
      const response = await fetch(
        `/api/paystack/get-customer/${encodeURIComponent(user.userEmail)}`,
      );
      const data = await response.json();

      console.log('Wallet API Response:', {
        statusx: data.statusx,
        hasTransactionDetails: !!data.transactionDetails,
        totalAmount: data.transactionDetails?.totalAmount,
      });

      // Check if wallet is ready and has transaction details
      if (
        data.transactionDetails &&
        typeof data.transactionDetails.totalAmount === 'number'
      ) {
        setWalletBalance(data.transactionDetails.totalAmount);
      } else if (data.statusx === 'NO_ACCOUNT') {
        // Wallet not activated
        setWalletBalance(0);
        console.log('Wallet not activated for user:', user.userEmail);
      } else {
        // Default to 0 for any other case
        setWalletBalance(0);
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      setWalletBalance(0);
    } finally {
      setLoadingWallet(false);
    }
  };

  // Fetch shipping address
  const fetchShippingAddress = async () => {
    if (!user?.pidUser || !user?.userEmail) return;

    setLoadingAddress(true);
    try {
      const response = await fetch(
        `/api/user/update-shipping-address?pidUser=${encodeURIComponent(user.pidUser)}&userEmail=${encodeURIComponent(user.userEmail)}`,
      );
      const data = await response.json();

      if (data.statusx === 'SUCCESS' && data.data?.userShippingAddress2) {
        setShippingAddress(data.data.userShippingAddress2);
      }
    } catch (error) {
      console.error('Error fetching shipping address:', error);
    } finally {
      setLoadingAddress(false);
    }
  };

  // Save shipping address
  const saveShippingAddress = async () => {
    if (!user?.pidUser || !user?.userEmail) {
      toast.error('User information not available');
      return false;
    }

    if (!shippingAddress || shippingAddress.trim().length === 0) {
      toast.error('Please enter a shipping address');
      return false;
    }

    if (shippingAddress.trim().length < 10) {
      toast.error('Shipping address must be at least 10 characters long');
      return false;
    }

    setSavingAddress(true);
    try {
      const response = await fetch('/api/user/update-shipping-address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pidUser: user.pidUser,
          userEmail: user.userEmail,
          shippingAddress: shippingAddress.trim(),
        }),
      });

      const data = await response.json();

      if (data.statusx === 'SUCCESS') {
        toast.success('Shipping address saved successfully');
        return true;
      } else {
        toast.error(data.message || 'Failed to save shipping address');
        return false;
      }
    } catch (error) {
      console.error('Error saving shipping address:', error);
      toast.error('Failed to save shipping address');
      return false;
    } finally {
      setSavingAddress(false);
    }
  };

  const handlePaymentSuccess = (reference: string) => {
    console.log('Payment initiated, reference:', reference);
    toast.info('Payment initiated successfully!');
  };

  const handlePaymentClose = () => {
    console.log('Payment was closed');
    toast.info('Payment was closed');
    setProcessingPayment(false);
  };

  const handleVerificationComplete = (success: boolean, data?: any) => {
    if (success) {
      console.log('Payment successful:', data);
      toast.success(
        'Payment verified successfully! Your order has been placed.',
      );
      clearCart();
      router.push(
        '/dashboard/shop/order-success?ref=' + (data?.reference || ''),
      );
    } else {
      console.log('Payment failed:', data);
      const errorMessage =
        data?.message || data?.error || 'Payment verification failed';
      toast.error(errorMessage);
    }
    setProcessingPayment(false);
  };

  const handlePaystackPayment = async () => {
    if (!user) {
      toast.error('Please log in to continue');
      router.push('/login');
      return;
    }

    // Validate shipping address before payment
    if (!shippingAddress || shippingAddress.trim().length === 0) {
      toast.error('Please enter a shipping address before proceeding');
      return;
    }

    if (shippingAddress.trim().length < 10) {
      toast.error('Shipping address must be at least 10 characters long');
      return;
    }

    setProcessingPayment(true);

    // Save shipping address first
    const addressSaved = await saveShippingAddress();
    if (!addressSaved) {
      setProcessingPayment(false);
      return;
    }

    try {
      // Initialize payment with backend
      const response = await fetch('/api/shop/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pidUser: user.pidUser,
          cartItems: cart,
          totalAmount: cartTotal,
          paymentMethod: 'paystack',
          shippingAddress: shippingAddress.trim(),
        }),
      });

      const data = await response.json();

      if (data.statusx !== 'SUCCESS') {
        toast.error(data.message || 'Failed to initialize payment');
        setProcessingPayment(false);
        return;
      }

      const reference = data.data.reference;

      // Initialize Paystack popup
      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: user.userEmail,
        amount: Math.round(cartTotal * 100), // Convert to kobo
        currency: 'NGN',
        ref: reference,
        metadata: {
          pidUser: user.pidUser,
          cart_items: cart,
          shipping_address: shippingAddress.trim(),
        },
        onClose: function () {
          handlePaymentClose();
        },
        callback: function (response: any) {
          // Payment successful, now verify
          handlePaymentSuccess(response.reference);
          verifyPayment(response.reference);
        },
      });

      handler.openIframe();
    } catch (error) {
      console.error('Payment initialization error:', error);
      toast.error('Failed to initialize payment');
      setProcessingPayment(false);
    }
  };

  const verifyPayment = async (reference: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/shop/payment/verify?reference=${reference}`,
      );
      const data = await response.json();

      if (data.statusx === 'SUCCESS') {
        handleVerificationComplete(true, { ...data, reference });
      } else {
        handleVerificationComplete(false, data);
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      handleVerificationComplete(false, {
        message: 'Failed to verify payment',
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWalletPayment = async () => {
    if (!user) {
      toast.error('Please log in to continue');
      router.push('/login');
      return;
    }

    // Validate shipping address before payment
    if (!shippingAddress || shippingAddress.trim().length === 0) {
      toast.error('Please enter a shipping address before proceeding');
      return;
    }

    if (shippingAddress.trim().length < 10) {
      toast.error('Shipping address must be at least 10 characters long');
      return;
    }

    // Check if wallet balance is loaded
    if (walletBalance === null) {
      toast.error('Loading wallet information. Please try again.');
      return;
    }

    // Check if wallet is activated
    if (walletBalance === 0 && !loadingWallet) {
      toast.warning(
        'Wallet not activated. Please activate your wallet to use this payment method.',
      );
      return;
    }

    // Check if user has sufficient funds
    if (walletBalance < cartTotal) {
      toast.error(
        `Insufficient wallet balance. Current balance: ₦${walletBalance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}, Required: ₦${cartTotal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
      );
      return;
    }

    setProcessingPayment(true);

    // Save shipping address first
    const addressSaved = await saveShippingAddress();
    if (!addressSaved) {
      setProcessingPayment(false);
      return;
    }

    toast.info('Processing wallet payment...');

    try {
      const response = await fetch('/api/shop/payment/wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pidUser: user.pidUser,
          cartItems: cart,
          totalAmount: cartTotal,
          shippingAddress: shippingAddress.trim(),
        }),
      });

      const data = await response.json();

      if (data.statusx === 'SUCCESS') {
        toast.success('Payment successful! Your order has been placed.');
        clearCart();
        router.push(
          `/dashboard/shop/order-success?ref=${data.data.transactionRef}`,
        );
      } else if (data.statusx === 'INSUFFICIENT_FUNDS') {
        toast.error(data.message);
      } else if (data.statusx === 'NO_ACCOUNT') {
        toast.warning(data.message);
      } else {
        toast.error(data.message || 'Wallet payment failed');
      }
    } catch (error) {
      console.error('Wallet payment error:', error);
      toast.error('Failed to process wallet payment');
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
          disabled={processingPayment}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shop
        </Button>

        <h1 className="mb-8 text-3xl font-bold text-foreground dark:text-white">
          Checkout
        </h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="mb-4 text-xl font-semibold text-foreground dark:text-white">
                Order Summary
              </h2>

              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.pidProduct}
                    className="flex gap-4 border-b border-border pb-4 last:border-0"
                  >
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex flex-1 flex-col">
                      <div className="mb-2 flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="mb-1 font-medium text-foreground dark:text-white">
                            {item.productName}
                          </h3>
                          {item.productBrand && (
                            <p className="mb-2 text-sm text-muted-foreground dark:text-gray-400">
                              {item.productBrand}
                            </p>
                          )}
                        </div>
                        {/* Remove Button */}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-red-600 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/30"
                          onClick={() => removeFromCart(item.pidProduct)}
                          disabled={processingPayment}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="mt-auto flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground dark:text-gray-400">
                            Qty:
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-7 w-7 border-gray-300 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                            onClick={() =>
                              updateQuantity(item.pidProduct, item.quantity - 1)
                            }
                            disabled={processingPayment || item.quantity <= 1}
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
                            onClick={() =>
                              updateQuantity(item.pidProduct, item.quantity + 1)
                            }
                            disabled={processingPayment}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Item Subtotal */}
                        <span className="font-semibold text-foreground dark:text-white">
                          ₦
                          {(item.productPrice * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Customer Information */}
            <Card className="mt-6 p-6">
              <h2 className="mb-4 text-xl font-semibold text-foreground dark:text-white">
                Customer Information
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground dark:text-gray-400">
                    Name:
                  </span>
                  <span className="font-medium text-foreground dark:text-white">
                    {user?.userFirstname} {user?.userLastname}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground dark:text-gray-400">
                    Email:
                  </span>
                  <span className="font-medium text-foreground dark:text-white">
                    {user?.userEmail}
                  </span>
                </div>
                {user?.phone && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground dark:text-gray-400">
                      Phone:
                    </span>
                    <span className="font-medium text-foreground dark:text-white">
                      {user.phone}
                    </span>
                  </div>
                )}

                {/* Shipping Address Field */}
                <div className="mt-4 space-y-2">
                  <label
                    htmlFor="shippingAddress"
                    className="block text-sm font-medium text-foreground dark:text-white"
                  >
                    Shipping Address <span className="text-red-500">*</span>
                  </label>
                  {loadingAddress ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <Textarea
                      id="shippingAddress"
                      placeholder="Enter your full delivery address (street, city, state, postal code)"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      disabled={processingPayment || savingAddress}
                      className="min-h-[100px] resize-none bg-white dark:bg-gray-800 dark:text-white"
                      required
                    />
                  )}
                  <p className="text-xs text-muted-foreground dark:text-gray-400">
                    Please provide your complete delivery address. Minimum 10
                    characters required.
                  </p>
                  {shippingAddress && shippingAddress.trim().length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={saveShippingAddress}
                      disabled={
                        savingAddress ||
                        processingPayment ||
                        shippingAddress.trim().length < 10
                      }
                      className="mt-2 dark:bg-gray-800 dark:text-white"
                    >
                      {savingAddress ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Address'
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Pickup Information */}
            <Card className="mt-6 p-6">
              <h2 className="mb-4 text-xl font-semibold text-foreground dark:text-white">
                Pickup Information
              </h2>
              <div className="text-sm text-muted-foreground dark:text-gray-400">
                <p className="mb-2">
                  <strong className="text-foreground dark:text-white">
                    Address:
                  </strong>
                  <br />
                  Sure Imports, 5 Olutosin Ajayi (Martins Adegboyega) Street,
                  <br />
                  Ajao Estate, Lagos, Nigeria
                </p>
                <p className="mb-2">
                  <strong className="text-foreground dark:text-white">
                    Phone:
                  </strong>{' '}
                  0806 839 7263
                </p>
                <p>
                  <strong className="text-foreground dark:text-white">
                    Hours:
                  </strong>{' '}
                  9am to 5pm weekdays (except public holidays)
                </p>
              </div>
            </Card>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20 p-6">
              <h2 className="mb-4 text-xl font-semibold text-foreground dark:text-white">
                Payment Summary
              </h2>

              <div className="mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground dark:text-gray-400">
                    Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'})
                  </span>
                  <span className="font-medium text-foreground dark:text-white">
                    ₦{cartTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground dark:text-gray-400">
                    Delivery
                  </span>
                  <span className="font-medium text-foreground dark:text-white">
                    Pickup (Free)
                  </span>
                </div>
                <div className="border-t border-border pt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-foreground dark:text-white">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      ₦{cartTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Wallet Balance Display */}
              {walletBalance !== null && (
                <div className="mb-4 rounded-lg bg-slate-100 p-3 dark:bg-gray-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground dark:text-gray-400">
                      Wallet Balance:
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        walletBalance >= cartTotal
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      ₦{walletBalance.toLocaleString()}
                    </span>
                  </div>
                  {walletBalance < cartTotal && walletBalance > 0 && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      Insufficient balance. Need ₦
                      {(cartTotal - walletBalance).toLocaleString()} more
                    </p>
                  )}
                </div>
              )}

              {/* Payment Buttons */}
              <div className="space-y-3">
                {/* Pay from Wallet Button */}
                <Button
                  onClick={handleWalletPayment}
                  disabled={
                    processingPayment ||
                    loadingWallet ||
                    walletBalance === null ||
                    walletBalance < cartTotal
                  }
                  className="w-full bg-green-600 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {processingPayment ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : loadingWallet ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading Wallet...
                    </>
                  ) : (
                    <>
                      <Wallet className="mr-2 h-4 w-4" />
                      Pay from Wallet
                    </>
                  )}
                </Button>

                {/* Pay with Paystack Button */}
                <Button
                  onClick={handlePaystackPayment}
                  disabled={processingPayment}
                  className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  {processingPayment ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pay with Paystack
                    </>
                  )}
                </Button>
              </div>

              <p className="mt-4 text-center text-xs text-muted-foreground dark:text-gray-400">
                Secure payment powered by Paystack
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return <CheckoutContent />;
}
