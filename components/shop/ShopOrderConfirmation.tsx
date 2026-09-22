'use client';
import { clearShopCheckoutDraft } from '@/lib/shop/checkoutDraft';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Clock, Loader2, MapPin, RefreshCw } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { useShopCart } from '@/app/context/ShopCartContext';

export default function ShopOrderConfirmation({
  dashboard = false,
}: {
  dashboard?: boolean;
}) {
  const params = useSearchParams();
  const reference = params.get('ref') || params.get('reference') || '';
  const { user } = useAuth();
  const { cart, replaceCart, hydrated } = useShopCart();
  const [state, setState] = useState<{
    status: string;
    message?: string;
    data?: any;
  }>({ status: 'CHECKING' });
  const [busy, setBusy] = useState(false);
  const finished = useRef(false);
  const base = dashboard ? '/dashboard/shop' : '/shop';
  const check = useCallback(
    async (signal?: AbortSignal) => {
      if (!reference) {
        setState({
          status: 'ERROR',
          message:
            'No order reference was provided. Open your orders to check your purchase.',
        });
        return;
      }
      setBusy(true);
      try {
        let guestToken: string | null = null;
        try {
          guestToken = sessionStorage.getItem(`shop-guest:${reference}`);
        } catch {
          /* Account sign-in remains available. */
        }
        const response = await fetch(
          `/api/shop/payment/verify?reference=${encodeURIComponent(reference)}`,
          {
            cache: 'no-store',
            signal,
            headers: guestToken ? { 'x-shop-checkout-token': guestToken } : {},
          },
        );
        const result = await response.json();
        if (signal?.aborted) return;
        setState({
          status:
            response.status === 401
              ? 'SIGN_IN'
              : result.statusx === 'SUCCESS'
                ? 'PAID'
                : result.statusx === 'PENDING'
                  ? 'PENDING'
                  : 'ERROR',
          message: result.message,
          data: result.data,
        });
      } catch {
        if (!signal?.aborted)
          setState({
            status: 'ERROR',
            message:
              'We could not check your payment. Retry below. If you have been charged, do not pay again.',
          });
      } finally {
        if (!signal?.aborted) setBusy(false);
      }
    },
    [reference],
  );
  useEffect(() => {
    const controller = new AbortController();
    void check(controller.signal);
    return () => controller.abort();
  }, [check]);
  useEffect(() => {
    if (state.status !== 'PAID' || !hydrated || finished.current) return;
    finished.current = true;
    try {
      const owner =
        sessionStorage.getItem('shop-pending:guest') === reference
          ? 'guest'
          : user?.pidUser;
      if (
        !owner ||
        sessionStorage.getItem(`shop-pending:${owner}`) !== reference
      )
        return;
      const purchased = new Map<string, number>(
        (state.data?.items || []).map((item: any) => [
          item.pidProduct,
          item.quantity,
        ]),
      );
      replaceCart(
        cart.flatMap((item) => {
          const quantity =
            item.quantity - (purchased.get(item.pidProduct) || 0);
          return quantity > 0 ? [{ ...item, quantity }] : [];
        }),
      );
      const key = sessionStorage.getItem(`shop-attempt-key:${reference}`);
      if (key) sessionStorage.removeItem(key);
      sessionStorage.removeItem(`shop-attempt-key:${reference}`);
      sessionStorage.removeItem(`shop-pending:${owner}`);
      clearShopCheckoutDraft();
    } catch {
      /* Receipt visibility does not depend on browser storage. */
    }
  }, [state, hydrated, user?.pidUser, reference, replaceCart, cart]);
  const paid = state.status === 'PAID';
  return (
    <main className="mx-auto min-h-[65vh] max-w-3xl px-4 py-16 sm:px-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-10">
        <div className="mb-6">
          {busy ? (
            <Loader2 className="h-10 w-10 animate-spin text-violet-500" />
          ) : paid ? (
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          ) : (
            <Clock className="h-10 w-10 text-violet-500" />
          )}
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {paid
            ? 'Your order is confirmed'
            : busy
              ? 'Checking your payment'
              : state.status === 'SIGN_IN'
                ? 'Sign in to view your order'
                : 'Payment confirmation'}
        </h1>
        {paid && state.data?.guestCheckout && (
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
            Your receipt will be emailed to you. If this is your first purchase,
            look out for a separate email to set up your account. Existing
            customers can sign in to view their order.
          </p>
        )}
        <p
          role="status"
          className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300"
        >
          {paid
            ? 'Your payment is recorded. We will keep you updated as your items are processed and delivered.'
            : state.message || 'Please wait while we check your order.'}
        </p>
        {reference && (
          <p className="mt-6 break-all rounded-xl bg-slate-50 p-4 font-mono text-sm text-slate-700 dark:bg-slate-950 dark:text-slate-200">
            {reference}
          </p>
        )}
        {paid && (
          <div className="mt-6 space-y-4 border-t border-slate-200 pt-6 dark:border-slate-700">
            <p className="text-xl font-semibold text-slate-900 dark:text-white">
              Total paid:{' '}
              {new Intl.NumberFormat('en-NG', {
                style: 'currency',
                currency: 'NGN',
              }).format(state.data.amount)}
            </p>
            {state.data.shippingAddress && (
              <p className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                <MapPin className="mt-1 h-5 w-5 shrink-0" />
                {state.data.shippingAddress}
              </p>
            )}
            <p className="text-sm text-slate-500 dark:text-slate-400">
              A confirmation email will follow. You can track progress in My
              Orders.
            </p>
          </div>
        )}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {state.status === 'SIGN_IN' ? (
            <Link
              className="rounded-xl bg-violet-600 px-5 py-3 text-center font-semibold text-white"
              href={`/auth/login?next=${encodeURIComponent(`${base}/order-success?ref=${reference}`)}`}
            >
              Sign in
            </Link>
          ) : (
            !paid && (
              <button
                type="button"
                disabled={busy}
                onClick={() => check()}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-800 disabled:opacity-50 dark:border-slate-700 dark:text-white"
              >
                <RefreshCw className="h-4 w-4" />
                Check payment
              </button>
            )
          )}
          <Link
            href="/dashboard/orders"
            className="rounded-xl bg-violet-600 px-5 py-3 text-center font-semibold text-white"
          >
            My Orders
          </Link>
          <Link
            href={base}
            className="rounded-xl border border-slate-300 px-5 py-3 text-center font-semibold text-slate-800 dark:border-slate-700 dark:text-white"
          >
            Return to shop
          </Link>
        </div>
      </div>
    </main>
  );
}
