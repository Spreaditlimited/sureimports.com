'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

import {
  PENDING_PROCUREMENT_CHECKOUT_KEY,
  POST_AUTH_REDIRECT_KEY,
  PROCUREMENT_RESUME_CHECKOUT_PATH,
} from '@/lib/auth/loginRedirect';

export default function ResumeProcurementCheckoutPage() {
  const router = useRouter();
  const attemptedRef = useRef(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (attemptedRef.current) return;
    attemptedRef.current = true;

    const resumeOrder = async () => {
      const pendingRaw = window.localStorage.getItem(
        PENDING_PROCUREMENT_CHECKOUT_KEY,
      );
      if (!pendingRaw) {
        router.replace('/buy-from-chinese-websites#start-order');
        return;
      }

      let pendingPayload: unknown;
      try {
        pendingPayload = JSON.parse(pendingRaw);
      } catch {
        window.localStorage.removeItem(PENDING_PROCUREMENT_CHECKOUT_KEY);
        window.localStorage.removeItem(POST_AUTH_REDIRECT_KEY);
        setError('Your saved order draft could not be read. Please recreate it.');
        return;
      }

      try {
        const authResponse = await fetch('/api/auth/me', { cache: 'no-store' });
        if (!authResponse.ok) {
          window.localStorage.setItem(
            POST_AUTH_REDIRECT_KEY,
            PROCUREMENT_RESUME_CHECKOUT_PATH,
          );
          router.replace(
            `/auth/login?next=${encodeURIComponent(PROCUREMENT_RESUME_CHECKOUT_PATH)}`,
          );
          return;
        }

        const response = await fetch('/api/public/procurement/bootstrap-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pendingPayload),
        });
        const data = (await response.json()) as {
          statusx?: string;
          message?: string;
          redirectTo?: string;
        };

        if (response.ok && data.statusx === 'SUCCESS' && data.redirectTo) {
          window.localStorage.removeItem(PENDING_PROCUREMENT_CHECKOUT_KEY);
          window.localStorage.removeItem(POST_AUTH_REDIRECT_KEY);
          router.replace(data.redirectTo);
          return;
        }

        if (response.status === 401 || data.statusx === 'AUTH_REQUIRED') {
          window.localStorage.setItem(
            POST_AUTH_REDIRECT_KEY,
            PROCUREMENT_RESUME_CHECKOUT_PATH,
          );
          router.replace(
            `/auth/login?next=${encodeURIComponent(PROCUREMENT_RESUME_CHECKOUT_PATH)}`,
          );
          return;
        }

        setError(data.message || 'We could not save your order. Please try again.');
      } catch {
        setError('We could not save your order right now. Please try again.');
      }
    };

    void resumeOrder();
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur">
        {error ? (
          <>
            <h1 className="text-2xl font-bold">Order handoff paused</h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">{error}</p>
            <Link
              href="/buy-from-chinese-websites#start-order"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-brand-orange-500 px-5 font-semibold text-white hover:bg-brand-orange-600"
            >
              Return to your order
            </Link>
          </>
        ) : (
          <>
            <Loader2 className="mx-auto h-9 w-9 animate-spin text-brand-orange-500" />
            <h1 className="mt-5 text-xl font-bold">Saving your order</h1>
            <p className="mt-2 text-sm text-slate-300">
              We’re securely moving your order into the dashboard.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
