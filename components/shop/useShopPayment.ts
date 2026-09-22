'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useShopCart } from '@/app/context/ShopCartContext';
import { saveShopCheckoutDraft } from '@/lib/shop/checkoutDraft';

export function useShopPayment(
  userId: string | undefined,
  address: string,
  dashboard: boolean,
  contact?: { name: string; email: string },
) {
  const router = useRouter();
  const { cart, cartTotal, replaceCart, hydrated } = useShopCart();
  const busyRef = useRef(false);
  const [busy, setBusy] = useState(false);
  const [pendingReference, setPendingReference] = useState('');
  const [quoteError, setQuoteError] = useState('');
  const [checkedKey, setCheckedKey] = useState('');
  const [retry, setRetry] = useState(0);
  const cartKey = JSON.stringify(
    cart.map((item) => ({
      pidProduct: item.pidProduct,
      quantity: item.quantity,
      productPrice: item.productPrice,
    })),
  );
  const base = dashboard ? '/dashboard/shop' : '/shop';
  useEffect(() => {
    try {
      setPendingReference(
        sessionStorage.getItem(`shop-pending:${userId || 'guest'}`) || '',
      );
    } catch {
      /* Storage unavailable. */
    }
  }, [userId]);

  useEffect(() => {
    if (!hydrated || !cart.length) return;
    const controller = new AbortController();
    setQuoteError('');
    fetch('/api/shop/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartItems: JSON.parse(cartKey) }),
      signal: controller.signal,
    })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok)
          throw new Error(result.message || 'Unable to check current prices.');
        return result.data;
      })
      .then((quote) => {
        if (controller.signal.aborted) return;
        const nextKey = JSON.stringify(
          quote.cart.map((item: any) => ({
            pidProduct: item.pidProduct,
            quantity: item.quantity,
            productPrice: item.productPrice,
          })),
        );
        if (nextKey !== cartKey) {
          replaceCart(quote.cart);
          toast.info(
            'Your cart has been updated to current prices. Please review the total.',
          );
        }
        setCheckedKey(nextKey);
      })
      .catch((error) => {
        if (!controller.signal.aborted) setQuoteError(error.message);
      });
    return () => controller.abort();
  }, [cartKey, hydrated, userId, replaceCart, retry, cart.length]);

  async function pay(provider: 'paystack' | 'wallet') {
    if (busyRef.current) return;
    if (!userId && provider === 'wallet') {
      router.push(
        `/auth/login?next=${encodeURIComponent(`${base}/checkout?resumeCheckout=1`)}`,
      );
      return;
    }
    if (
      !userId &&
      (!contact?.name.trim() ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact?.email.trim() || ''))
    ) {
      toast.error(
        'Enter your full name and a valid email address before paying.',
      );
      return;
    }
    if (checkedKey !== cartKey || quoteError) {
      toast.error('Please check current prices before paying.');
      return;
    }
    if (address.trim().length < 10) {
      toast.error('Enter your complete delivery address before paying.');
      return;
    }
    busyRef.current = true;
    setBusy(true);
    try {
      let guestToken: string | undefined;
      if (!userId) {
        guestToken = sessionStorage.getItem('shop-guest-token') || undefined;
        if (!guestToken) {
          guestToken = Array.from(
            crypto.getRandomValues(new Uint8Array(32)),
            (byte) => byte.toString(16).padStart(2, '0'),
          ).join('');
          sessionStorage.setItem('shop-guest-token', guestToken);
        }
        saveShopCheckoutDraft({
          name: contact!.name.trim(),
          email: contact!.email.trim(),
          address: address.trim(),
        });
      }
      // Survives network retries/reloads. A method change cannot create a second payment for this attempt.
      const storageKey = `shop-attempt:${userId || 'guest'}:${cartKey}:${address.trim()}:${userId ? '' : JSON.stringify(contact)}`;
      let requestKey = sessionStorage.getItem(storageKey);
      if (!requestKey) {
        const bytes = crypto.getRandomValues(new Uint8Array(16));
        bytes[6] = (bytes[6] & 15) | 64;
        bytes[8] = (bytes[8] & 63) | 128;
        const hex = Array.from(bytes, (byte) =>
          byte.toString(16).padStart(2, '0'),
        ).join('');
        requestKey = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
        sessionStorage.setItem(storageKey, requestKey);
      }
      const response = await fetch(
        provider === 'wallet'
          ? '/api/shop/payment/wallet'
          : '/api/shop/checkout',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cartItems: cart,
            totalAmount: cartTotal,
            shippingAddress: address.trim(),
            requestKey,
            dashboard,
            ...(!userId
              ? {
                  contactName: contact!.name.trim(),
                  contactEmail: contact!.email.trim(),
                  guestToken,
                }
              : {}),
          }),
        },
      );
      const result = await response.json();
      if (result.data?.reference) {
        setPendingReference(result.data.reference);
        sessionStorage.setItem(
          `shop-pending:${userId || 'guest'}`,
          result.data.reference,
        );
        if (guestToken)
          sessionStorage.setItem(
            `shop-guest:${result.data.reference}`,
            guestToken,
          );
        sessionStorage.setItem(
          `shop-attempt-key:${result.data.reference}`,
          storageKey,
        );
      }
      if (!response.ok) {
        if (result.data?.cart) replaceCart(result.data.cart);
        throw new Error(
          result.message ||
            'We could not complete this attempt. Please check its status before paying again.',
        );
      }
      const reference = result.data.reference;
      sessionStorage.setItem(`shop-pending:${userId || 'guest'}`, reference);
      sessionStorage.setItem(`shop-attempt-key:${reference}`, storageKey);
      if (result.data.status === 'PAID')
        router.push(
          `${base}/order-success?ref=${encodeURIComponent(reference)}`,
        );
      else window.location.assign(result.data.authorization_url);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Payment status could not be confirmed. Retry this attempt; do not start another if you have been charged.',
      );
      busyRef.current = false;
      setBusy(false);
    }
  }
  return {
    processingPayment: busy,
    paymentUnavailable: checkedKey !== cartKey || !!quoteError,
    checkingPrices: checkedKey !== cartKey && !quoteError,
    quoteError,
    pendingReference,
    retryQuote: () => setRetry((value) => value + 1),
    handlePaystackPayment: () => pay('paystack'),
    handleWalletPayment: () => pay('wallet'),
  };
}
