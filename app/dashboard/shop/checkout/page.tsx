'use client';
import { useShopPayment } from '@/components/shop/useShopPayment';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
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
} from 'lucide-react';
import { useShopCart } from '@/app/context/ShopCartContext';
import { useAuth } from '@/app/context/AuthContext';
import { toast } from 'sonner';
import Loading from '../../loading';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const {
    cart,
    cartCount,
    cartTotal,
    hydrated: cartHydrated,
    updateQuantity,
    removeFromCart,
  } = useShopCart();

  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    if (cartHydrated && cart.length === 0) {
      toast.error('Your cart is empty');
      router.push('/dashboard/shop');
    }
  }, [cartHydrated, cart.length, router]);

  useEffect(() => {
    if (!user || searchParams.get('resumeCheckout') !== '1') return;
    const toastKey = `dashboard-shop-checkout-signin-toast:${user.pidUser}`;
    if (sessionStorage.getItem(toastKey)) return;
    toast.success('You are now signed in. Continue paying.', {
      duration: 30000,
    });
    sessionStorage.setItem(toastKey, 'shown');
  }, [user, searchParams]);

  useEffect(() => {
    if (user?.userEmail) {
      fetchWalletBalance();
      fetchShippingAddress();
    }
  }, [user]);

  const fetchWalletBalance = async () => {
    if (!user?.userEmail) return;
    setLoadingWallet(true);
    try {
      const response = await fetch(
        `/api/paystack/get-customer/${encodeURIComponent(user.userEmail)}`,
      );
      const data = await response.json();
      if (
        data.transactionDetails &&
        typeof data.transactionDetails.totalAmount === 'number'
      ) {
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
      const response = await fetch(
        `/api/user/update-shipping-address?pidUser=${encodeURIComponent(user.pidUser)}&userEmail=${encodeURIComponent(user.userEmail)}`,
      );
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
      toast.error('Shipping address must be at least 10 characters long');
      return false;
    }
    setSavingAddress(true);
    try {
      const response = await fetch('/api/user/update-shipping-address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      toast.error('Failed to save shipping address');
      return false;
    } finally {
      setSavingAddress(false);
    }
  };

  const {
    processingPayment,
    paymentUnavailable,
    checkingPrices,
    quoteError,
    pendingReference,
    retryQuote,
    handlePaystackPayment,
    handleWalletPayment,
  } = useShopPayment(user?.pidUser, shippingAddress, true);

  if (!cartHydrated || cart.length === 0) return null;

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-slate-950">
      {/* Deep Slate Hero Header */}
      <div className="bg-slate-900 pb-32 pt-8 text-white">
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
              <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                Checkout
              </h1>
              <p className="mt-2 text-slate-400">
                Review your order and securely complete your purchase.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                <Lock className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white">
                  Secure Checkout
                </p>
                <p className="text-xs text-slate-400">
                  Secure payment processing
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="relative z-10 mx-auto -mt-16 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        {quoteError && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-300 p-4 text-red-600 dark:text-red-300"
          >
            <p>{quoteError}</p>
            <button
              type="button"
              className="mt-3 underline"
              onClick={retryQuote}
            >
              Check prices again
            </button>
          </div>
        )}
        {checkingPrices && (
          <p
            role="status"
            className="mb-4 rounded-xl bg-white p-4 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300"
          >
            Checking current prices…
          </p>
        )}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* LEFT COLUMN: Order Details & Address */}
          <div className="flex-1 space-y-6">
            {/* Order Items Review */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                  <ShoppingBag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Order Summary
                </h2>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {cartCount} Items
                </span>
              </div>

              <div className="flex flex-col gap-4">
                {cart.map((item) => (
                  <div
                    key={item.pidProduct}
                    className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800/60 dark:bg-slate-800/30"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white dark:bg-slate-800">
                      <Image
                        src={
                          item.productImage || '/images/shop-placeholder.svg'
                        }
                        alt={item.productName}
                        fill
                        sizes="96px"
                        className="object-cover mix-blend-multiply dark:mix-blend-normal"
                      />
                    </div>

                    <div className="flex flex-1 flex-col py-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            {item.productBrand || 'Product'}
                          </p>
                          <h4 className="mt-0.5 line-clamp-2 text-sm font-bold text-slate-900 dark:text-white">
                            {item.productName}
                          </h4>
                        </div>
                        <button
                          aria-label={`Remove ${item.productName}`}
                          onClick={() => removeFromCart(item.pidProduct)}
                          disabled={processingPayment}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-rose-500 disabled:opacity-50 dark:hover:bg-rose-900/30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-base font-black text-blue-600 dark:text-blue-400">
                          ₦
                          {(item.productPrice * item.quantity).toLocaleString()}
                        </span>

                        <div className="flex items-center rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
                          <button
                            className="flex h-6 w-6 items-center justify-center rounded-md text-slate-500 transition hover:text-slate-900 disabled:opacity-50 dark:text-slate-400 dark:hover:text-white"
                            aria-label={`Decrease quantity of ${item.productName}`}
                            onClick={() =>
                              updateQuantity(item.pidProduct, item.quantity - 1)
                            }
                            disabled={processingPayment || item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-slate-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            className="flex h-6 w-6 items-center justify-center rounded-md text-slate-500 transition hover:text-slate-900 disabled:opacity-50 dark:text-slate-400 dark:hover:text-white"
                            aria-label={`Increase quantity of ${item.productName}`}
                            onClick={() =>
                              updateQuantity(item.pidProduct, item.quantity + 1)
                            }
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
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                  <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Delivery Details
                </h2>

                <div className="mb-6 space-y-2 text-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                    <span className="text-slate-500">Contact Name</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {user?.userFirstname} {user?.userLastname}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                    <span className="text-slate-500">Email Address</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {user?.userEmail}
                    </span>
                  </div>
                  {user?.phone && (
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                      <span className="text-slate-500">Phone Number</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {user.phone}
                      </span>
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
                      onChange={(e) => setShippingAddress(e.target.value)}
                      disabled={processingPayment || savingAddress}
                      className="min-h-[100px] resize-none rounded-xl border-slate-200 bg-slate-50 text-sm focus-visible:ring-blue-600 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  )}
                  {shippingAddress.trim().length > 0 && (
                    <Button
                      type="button"
                      onClick={saveShippingAddress}
                      disabled={
                        savingAddress ||
                        processingPayment ||
                        shippingAddress.trim().length < 10
                      }
                      className="w-full rounded-xl bg-slate-900 text-xs font-bold text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
                    >
                      {savingAddress ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
                          Saving...
                        </>
                      ) : (
                        'Save Address'
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* Pickup Information */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                  <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  Office Pickup
                </h2>
                <div className="rounded-2xl bg-purple-50 p-5 dark:bg-purple-900/10">
                  <p className="mb-4 text-xs leading-relaxed text-purple-800 dark:text-purple-300">
                    Prefer to pick up your order in person? You can collect your
                    items directly from our main office.
                  </p>
                  <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                    <div className="flex gap-3">
                      <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                      <span>
                        5 Olutosin Ajayi (Martins Adegboyega) Street,
                        <br />
                        Ajao Estate, Lagos
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <Wallet className="h-4 w-4 shrink-0 text-slate-400" />
                      <span>0806 839 7263</span>
                    </div>
                    <div className="flex gap-3">
                      <Clock className="h-4 w-4 shrink-0 text-slate-400" />
                      <span>Mon-Fri: 9am - 5pm</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Payment Summary */}
          <div className="w-full shrink-0 lg:sticky lg:top-24 lg:w-96">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/20 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-8">
              <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
                Payment Summary
              </h2>

              <div className="mb-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-500">
                    Subtotal ({cartCount})
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    ₦{cartTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-500">Shipping</span>
                  <span className="rounded bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                    FREE
                  </span>
                </div>

                <div className="my-4 border-t border-dashed border-slate-200 dark:border-slate-800" />

                <div className="flex items-end justify-between">
                  <span className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white">
                    Total
                  </span>
                  <span className="text-3xl font-black text-blue-600 dark:text-blue-400">
                    ₦{cartTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Wallet Information */}
              {walletBalance !== null && (
                <div
                  className={`mb-6 rounded-2xl border p-4 ${walletBalance >= cartTotal ? 'border-emerald-100 bg-emerald-50 dark:border-emerald-900/30 dark:bg-emerald-900/10' : 'border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50'}`}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Wallet Balance
                    </span>
                    {loadingWallet && (
                      <Loader2 className="h-3 w-3 animate-spin text-slate-400" />
                    )}
                  </div>
                  <div
                    className={`text-lg font-black ${walletBalance >= cartTotal ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}
                  >
                    ₦
                    {walletBalance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                  {walletBalance < cartTotal && walletBalance > 0 && (
                    <p className="mt-2 flex items-center gap-1 text-[10px] font-bold uppercase text-rose-500">
                      Short by ₦{(cartTotal - walletBalance).toLocaleString()}
                    </p>
                  )}
                </div>
              )}

              {pendingReference && <div className="mb-4 rounded-xl border border-slate-200 p-4 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300"><p>Already attempted payment? Check its status before paying again.</p><button type="button" onClick={() => router.push(`/dashboard/shop/order-success?ref=${encodeURIComponent(pendingReference)}`)} className="mt-3 font-semibold underline">Check previous payment</button></div>}
              {/* Actions */}
              <div className="space-y-3">
                <Button
                  onClick={handleWalletPayment}
                  disabled={
                    processingPayment ||
                    paymentUnavailable ||
                    loadingWallet ||
                    walletBalance === null ||
                    walletBalance < cartTotal
                  }
                  className="w-full rounded-xl bg-emerald-600 py-6 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 disabled:opacity-50 dark:bg-emerald-600"
                >
                  {processingPayment ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />{' '}
                      Processing...
                    </>
                  ) : loadingWallet ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading
                      Wallet...
                    </>
                  ) : (
                    <>
                      <Wallet className="mr-2 h-5 w-5" /> Pay from Wallet
                    </>
                  )}
                </Button>

                <Button
                  onClick={handlePaystackPayment}
                  disabled={processingPayment || paymentUnavailable}
                  className="w-full rounded-xl bg-slate-900 py-6 text-sm font-bold text-white shadow-md hover:bg-slate-800 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
                >
                  {processingPayment ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />{' '}
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" /> Pay with Card /
                      Bank
                    </>
                  )}
                </Button>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
                <ShieldCheck className="h-4 w-4" /> Secure payment by Paystack
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
