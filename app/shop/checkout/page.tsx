'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  CreditCard,
  Loader2,
  Wallet,
  Minus,
  Plus,
  Trash2,
  ShieldCheck,
  Lock,
  MapPin,
  Building2,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

import { useShopCart } from '@/app/context/ShopCartContext';
import { useAuth } from '@/app/context/AuthContext';
import Loading from '@/app/dashboard/loading';

declare global {
  interface Window {
    PaystackPop: any;
  }
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
  const [cartHydrated, setCartHydrated] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [shippingAddressError, setShippingAddressError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('shopCart');
        const parsed = raw ? JSON.parse(raw) : [];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCartHydrated(true);
          return;
        }
      } catch {
        // fall through to hydration check
      }
    }
    setCartHydrated(true);
  }, []);

  useEffect(() => {
    if (cartHydrated && cart.length === 0) {
      toast.error('Your cart is empty');
      router.push('/shop');
    }
  }, [cartHydrated, cart.length, router]);

  useEffect(() => {
    if (!user || searchParams.get('resumeCheckout') !== '1') return;
    const toastKey = `shop-checkout-signin-toast:${user.pidUser}`;
    if (sessionStorage.getItem(toastKey)) return;
    toast.success('You are now signed in. Continue paying.', {
      duration: 30000,
    });
    sessionStorage.setItem(toastKey, 'shown');
  }, [user, searchParams]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);

    if (user?.userEmail) {
      fetchWalletBalance();
      fetchShippingAddress();
    }

    return () => {
      document.body.removeChild(script);
    };
  }, [user]);

  const fetchWalletBalance = async () => {
    if (!user?.userEmail) return;
    setLoadingWallet(true);
    try {
      const response = await fetch(`/api/paystack/get-customer/${encodeURIComponent(user.userEmail)}`);
      const data = await response.json();
      if (data.transactionDetails && typeof data.transactionDetails.totalAmount === 'number') {
        setWalletBalance(data.transactionDetails.totalAmount);
      } else if (data.statusx === 'NO_ACCOUNT') {
        setWalletBalance(0);
      } else {
        setWalletBalance(0);
      }
    } catch (error) {
      setWalletBalance(0);
    } finally {
      setLoadingWallet(false);
    }
  };

  const fetchShippingAddress = async () => {
    if (!user?.pidUser || !user?.userEmail) return;
    setLoadingAddress(true);
    try {
      const response = await fetch(`/api/user/update-shipping-address?pidUser=${encodeURIComponent(user.pidUser)}&userEmail=${encodeURIComponent(user.userEmail)}`);
      const data = await response.json();
      if (data.statusx === 'SUCCESS' && data.data?.userShippingAddress2) {
        setShippingAddress(data.data.userShippingAddress2);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAddress(false);
    }
  };

  const saveShippingAddress = async () => {
    if (!user?.pidUser || !user?.userEmail) return false;
    if (!shippingAddress || shippingAddress.trim().length < 10) {
      setShippingAddressError('Shipping address must be at least 10 characters long');
      toast.error('Shipping address must be at least 10 characters long');
      return false;
    }
    setShippingAddressError('');
    setSavingAddress(true);
    try {
      const response = await fetch('/api/user/update-shipping-address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pidUser: user.pidUser, userEmail: user.userEmail, shippingAddress: shippingAddress.trim() }),
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
      toast.error('Failed to save shipping address');
      return false;
    } finally {
      setSavingAddress(false);
    }
  };

  const ensurePaystackReady = async () => {
    if (typeof window !== 'undefined' && window.PaystackPop?.setup) {
      return true;
    }

    const existingScript = document.querySelector(
      'script[src="https://js.paystack.co/v1/inline.js"]',
    ) as HTMLScriptElement | null;

    if (existingScript) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      return Boolean(window.PaystackPop?.setup);
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;

    await new Promise<void>((resolve, reject) => {
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Paystack script'));
      document.body.appendChild(script);
    });

    return Boolean(window.PaystackPop?.setup);
  };

  const handlePaymentSuccess = (reference: string) => {
    toast.info('Payment initiated successfully!');
  };

  const handlePaymentClose = () => {
    toast.info('Payment window was closed');
    setProcessingPayment(false);
  };

  const handleVerificationComplete = (success: boolean, data?: any) => {
    if (success) {
      toast.success('Payment verified successfully! Your order has been placed.');
      clearCart();
      router.push('/shop/order-success?ref=' + (data?.reference || ''));
    } else {
      const errorMessage = data?.message || data?.error || 'Payment verification failed';
      toast.error(errorMessage);
    }
    setProcessingPayment(false);
  };

  const handlePaystackPayment = async () => {
    if (processingPayment) return;
    if (!user) {
      router.push(
        `/auth/login?next=${encodeURIComponent('/shop/checkout?resumeCheckout=1')}`,
      );
      return;
    }
    if (!shippingAddress || shippingAddress.trim().length < 10) {
      setShippingAddressError('Please enter a valid shipping address before proceeding');
      toast.error('Please enter a valid shipping address before proceeding'); return;
    }
    setShippingAddressError('');

    let paystackReady = false;
    try {
      paystackReady = await ensurePaystackReady();
    } catch (error) {
      toast.error('Payment gateway failed to load. Please refresh and try again.');
      return;
    }
    if (!paystackReady) {
      toast.error('Payment gateway is not ready. Please refresh and try again.');
      return;
    }

    setProcessingPayment(true);
    const addressSaved = await saveShippingAddress();
    if (!addressSaved) { setProcessingPayment(false); return; }

    try {
      const response = await fetch('/api/shop/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pidUser: user.pidUser, cartItems: cart, totalAmount: cartTotal,
          paymentMethod: 'paystack', shippingAddress: shippingAddress.trim(),
        }),
      });

      const data = await response.json();
      if (data.statusx !== 'SUCCESS') {
        toast.error(data.message || 'Failed to initialize payment');
        setProcessingPayment(false); return;
      }

      const reference = data.data.reference;
      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: user.userEmail,
        amount: Math.round(cartTotal * 100),
        currency: 'NGN',
        ref: reference,
        metadata: { pidUser: user.pidUser, cart_items: cart, shipping_address: shippingAddress.trim() },
        onClose: function () { handlePaymentClose(); },
        callback: function (response: any) {
          handlePaymentSuccess(response.reference);
          verifyPayment(response.reference);
        },
      });

      handler.openIframe();
    } catch (error) {
      toast.error('Failed to initialize payment');
      setProcessingPayment(false);
    }
  };

  const verifyPayment = async (reference: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/shop/payment/verify?reference=${reference}`);
      const data = await response.json();
      if (data.statusx === 'SUCCESS') handleVerificationComplete(true, { ...data, reference });
      else handleVerificationComplete(false, data);
    } catch (error) {
      handleVerificationComplete(false, { message: 'Failed to verify payment', error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  const handleWalletPayment = async () => {
    if (!user) {
      router.push(
        `/auth/login?next=${encodeURIComponent('/shop/checkout?resumeCheckout=1')}`,
      );
      return;
    }
    if (!shippingAddress || shippingAddress.trim().length < 10) {
      setShippingAddressError('Please enter a valid shipping address before proceeding');
      toast.error('Please enter a valid shipping address before proceeding'); return;
    }
    setShippingAddressError('');
    if (walletBalance === null) { toast.error('Loading wallet info. Please wait.'); return; }
    if (walletBalance === 0 && !loadingWallet) { toast.warning('Wallet not activated.'); return; }
    if (walletBalance < cartTotal) {
      toast.error(`Insufficient balance. Required: ₦${cartTotal.toLocaleString()}`); return;
    }

    setProcessingPayment(true);
    const addressSaved = await saveShippingAddress();
    if (!addressSaved) { setProcessingPayment(false); return; }

    toast.info('Processing wallet payment...');
    try {
      const response = await fetch('/api/shop/payment/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pidUser: user.pidUser, cartItems: cart, totalAmount: cartTotal, shippingAddress: shippingAddress.trim(),
        }),
      });
      const data = await response.json();

      if (data.statusx === 'SUCCESS') {
        toast.success('Payment successful! Your order has been placed.');
        clearCart();
        router.push(`/shop/order-success?ref=${data.data.transactionRef}`);
      } else {
        toast.error(data.message || 'Wallet payment failed');
      }
    } catch (error) {
      toast.error('Failed to process wallet payment');
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) return <Loading />;
  if (!cartHydrated || cart.length === 0) return null;

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-slate-950">
      
      {/* Deep Slate Hero Header */}
      <div className="bg-slate-900 pb-32 pt-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <button 
            onClick={() => router.back()} 
            disabled={processingPayment}
            className="group mb-8 flex w-fit items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 transition hover:text-white disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Shop
          </button>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                  Step 2 of 2
                </span>
              </div>
              <h1 className="text-3xl font-black tracking-tight md:text-5xl">Checkout</h1>
              <p className="mt-3 text-sm font-medium text-slate-400 md:text-base">
                Review your order and securely complete your purchase.
              </p>
            </div>
            
            <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                <Lock className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white">Secure Checkout</p>
                <p className="text-xs text-slate-400">AES-256 Encryption</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto -mt-16 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          
          {/* LEFT COLUMN: Order Details & Address */}
          <div className="flex-1 space-y-8">
            
            {/* Order Items Review */}
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-10">
              <div className="mb-8 flex items-center justify-between border-b border-slate-100 pb-6 dark:border-slate-800">
                <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  Order Summary
                </h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:bg-slate-800">
                  {cartCount} Items
                </span>
              </div>

              <div className="flex flex-col gap-4">
                {cart.map((item) => (
                  <div key={item.pidProduct} className="group flex flex-col sm:flex-row gap-6 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:border-indigo-100 dark:border-slate-800/60 dark:bg-slate-800/30 dark:hover:border-slate-700">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-white shadow-sm dark:bg-slate-800">
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        className="object-cover mix-blend-multiply dark:mix-blend-normal"
                      />
                    </div>

                    <div className="flex flex-1 flex-col py-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{item.productBrand || 'Product'}</p>
                          <h4 className="mt-1 text-sm font-bold text-slate-900 dark:text-white sm:text-base">{item.productName}</h4>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.pidProduct)}
                          disabled={processingPayment}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-500 disabled:opacity-50 dark:hover:bg-rose-900/30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-4">
                        <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                          ₦{(item.productPrice * item.quantity).toLocaleString()}
                        </span>
                        
                        <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                          <button
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                            onClick={() => updateQuantity(item.pidProduct, item.quantity - 1)}
                            disabled={processingPayment || item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-10 text-center text-xs font-bold text-slate-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                            onClick={() => updateQuantity(item.pidProduct, item.quantity + 1)}
                            disabled={processingPayment}
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

            {/* Delivery & Address Information */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
                <h2 className="mb-6 flex items-center gap-3 text-lg font-bold text-slate-900 dark:text-white">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  Delivery Details
                </h2>
                
                <div className="mb-8 space-y-3 text-sm">
                  <div className="flex flex-col border-b border-slate-100 pb-3 dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Contact Name</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{user?.userFirstname} {user?.userLastname}</span>
                  </div>
                  <div className="flex flex-col border-b border-slate-100 pb-3 dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email Address</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{user?.userEmail}</span>
                  </div>
                  {user?.phone && (
                    <div className="flex flex-col border-b border-slate-100 pb-3 dark:border-slate-800">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Phone Number</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{user.phone}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Shipping Address <span className="text-rose-500">*</span>
                  </label>
                  {loadingAddress ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
                    </div>
                  ) : (
                    <Textarea
                      placeholder="Enter your complete delivery address..."
                      value={shippingAddress}
                      onChange={(e) => {
                        const value = e.target.value;
                        setShippingAddress(value);
                        if (value.trim().length >= 10) {
                          setShippingAddressError('');
                        }
                      }}
                      disabled={processingPayment || savingAddress}
                      className={`min-h-[120px] resize-none rounded-xl bg-slate-50 p-4 text-sm focus-visible:ring-indigo-600 dark:bg-slate-950 dark:text-white ${
                        shippingAddressError
                          ? 'border-rose-400 focus-visible:ring-rose-500 dark:border-rose-500'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    />
                  )}
                  {shippingAddressError ? (
                    <p className="text-xs font-semibold text-rose-500">
                      {shippingAddressError}
                    </p>
                  ) : null}
                  {shippingAddress.trim().length > 0 && (
                    <Button
                      type="button"
                      onClick={saveShippingAddress}
                      disabled={savingAddress || processingPayment || shippingAddress.trim().length < 10}
                      className="w-full rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 font-bold text-xs h-10"
                    >
                      {savingAddress ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Confirm Address'}
                    </Button>
                  )}
                </div>
              </div>

              {/* Pickup Information */}
              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
                <h2 className="mb-6 flex items-center gap-3 text-lg font-bold text-slate-900 dark:text-white">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                    <Building2 className="h-5 w-5" />
                  </div>
                  Office Pickup
                </h2>
                <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-6 dark:border-purple-900/30 dark:bg-purple-900/10">
                  <p className="mb-6 text-sm leading-relaxed text-purple-800 dark:text-purple-300">
                    Prefer to pick up your order in person? You can collect your items directly from our main office in Lagos.
                  </p>
                  <div className="space-y-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <div className="flex gap-3">
                      <MapPin className="h-5 w-5 shrink-0 text-slate-400" />
                      <span>5 Olutosin Ajayi (Martins Adegboyega) Street,<br />Ajao Estate, Lagos</span>
                    </div>
                    <div className="flex gap-3">
                      <Wallet className="h-5 w-5 shrink-0 text-slate-400" />
                      <span>0806 839 7263</span>
                    </div>
                    <div className="flex gap-3">
                      <Clock className="h-5 w-5 shrink-0 text-slate-400" />
                      <span>Mon-Fri: 9am - 5pm</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Payment Summary */}
          <div className="w-full shrink-0 lg:sticky lg:top-24 lg:w-[400px]">
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/20 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-8">
              <h2 className="mb-8 text-2xl font-bold text-slate-900 dark:text-white">Payment Summary</h2>

              <div className="mb-8 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-500">Subtotal ({cartCount})</span>
                  <span className="font-bold text-slate-900 dark:text-white">₦{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-500">Shipping</span>
                  <span className="rounded bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">FREE</span>
                </div>
                
                <div className="my-6 border-t border-dashed border-slate-200 dark:border-slate-800" />
                
                <div className="flex items-end justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">Total Due</span>
                  <span className="text-4xl font-black tracking-tight text-indigo-600 dark:text-indigo-400">
                    ₦{cartTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Wallet Information - Designed as a premium card */}
              {walletBalance !== null && (
                <div className={`mb-8 relative overflow-hidden rounded-2xl p-6 border ${walletBalance >= cartTotal ? 'bg-emerald-500 border-emerald-600 shadow-lg shadow-emerald-500/20' : 'bg-slate-900 border-slate-800 shadow-lg'}`}>
                  {/* Decorative background shapes */}
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                  <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                  
                  <div className="relative z-10 flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Wallet Balance</span>
                    {loadingWallet && <Loader2 className="h-4 w-4 animate-spin text-white/70" />}
                  </div>
                  <div className="relative z-10 text-3xl font-black text-white">
                    ₦{walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  
                  {walletBalance < cartTotal && walletBalance > 0 && (
                    <div className="relative z-10 mt-3 inline-flex items-center gap-1.5 rounded-lg bg-rose-500/20 px-3 py-1 text-xs font-bold text-rose-100 backdrop-blur-sm">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Short by ₦{(cartTotal - walletBalance).toLocaleString()}
                    </div>
                  )}
                  {walletBalance >= cartTotal && (
                    <div className="relative z-10 mt-3 inline-flex items-center gap-1.5 rounded-lg bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Sufficient Funds
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3">
                {walletBalance !== null && walletBalance >= cartTotal && (
                  <Button
                    onClick={handleWalletPayment}
                    disabled={processingPayment || loadingWallet}
                    className="h-14 w-full rounded-2xl bg-emerald-600 text-base font-bold text-white shadow-xl shadow-emerald-600/20 hover:bg-emerald-500 disabled:opacity-50 dark:bg-emerald-500 active:scale-[0.98] transition-all border-0"
                  >
                    {processingPayment ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
                    ) : loadingWallet ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading...</>
                    ) : (
                      <><Wallet className="mr-2 h-5 w-5" /> Pay from Wallet</>
                    )}
                  </Button>
                )}

                <Button
                  onClick={handlePaystackPayment}
                  disabled={processingPayment}
                  className="h-14 w-full rounded-2xl bg-brand-orange-500 text-base font-bold text-white shadow-xl shadow-brand-orange-500/20 hover:bg-brand-orange-600 disabled:opacity-50 active:scale-[0.98] transition-all border-0"
                >
                  {processingPayment ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
                  ) : (
                    <><CreditCard className="mr-2 h-5 w-5" /> Pay with Card or Bank</>
                  )}
                </Button>
              </div>

              <div className="mt-8 flex items-center justify-center gap-2 text-xs font-bold text-slate-400">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Payments secured by Paystack
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return <CheckoutContent />;
}
