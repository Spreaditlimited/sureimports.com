'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

import {
  PENDING_SHIPPING_ONLY_CHECKOUT_KEY,
  POST_AUTH_REDIRECT_KEY,
  SHIPPING_ONLY_RESUME_PATH,
} from '@/lib/auth/loginRedirect';

export default function ResumeShippingOnlyPage() {
  const router = useRouter();
  const attemptedRef = useRef(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (attemptedRef.current) return;
    attemptedRef.current = true;

    const resumeRequest = async () => {
      const pendingRaw = window.localStorage.getItem(
        PENDING_SHIPPING_ONLY_CHECKOUT_KEY,
      );
      if (!pendingRaw) {
        router.replace('/ship-with-us#start-shipment');
        return;
      }

      let pendingPayload: unknown;
      try {
        pendingPayload = JSON.parse(pendingRaw);
      } catch {
        window.localStorage.removeItem(PENDING_SHIPPING_ONLY_CHECKOUT_KEY);
        window.localStorage.removeItem(POST_AUTH_REDIRECT_KEY);
        setError('Your saved shipment draft could not be read. Please recreate it.');
        return;
      }

      try {
        const authResponse = await fetch('/api/auth/me', { cache: 'no-store' });
        if (!authResponse.ok) {
          window.localStorage.setItem(
            POST_AUTH_REDIRECT_KEY,
            SHIPPING_ONLY_RESUME_PATH,
          );
          router.replace(
            `/auth/login?next=${encodeURIComponent(SHIPPING_ONLY_RESUME_PATH)}`,
          );
          return;
        }

        const response = await fetch(
          '/api/public/shipping-only/bootstrap-request',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pendingPayload),
          },
        );
        const data = (await response.json().catch(() => null)) as {
          statusx?: string;
          message?: string;
          redirectTo?: string;
        } | null;

        if (response.ok && data?.statusx === 'SUCCESS' && data.redirectTo) {
          window.localStorage.removeItem(PENDING_SHIPPING_ONLY_CHECKOUT_KEY);
          window.localStorage.removeItem(POST_AUTH_REDIRECT_KEY);
          router.replace(data.redirectTo);
          return;
        }

        if (response.status === 401 || data?.statusx === 'AUTH_REQUIRED') {
          window.localStorage.setItem(
            POST_AUTH_REDIRECT_KEY,
            SHIPPING_ONLY_RESUME_PATH,
          );
          router.replace(
            `/auth/login?next=${encodeURIComponent(SHIPPING_ONLY_RESUME_PATH)}`,
          );
          return;
        }

        setError(data?.message || 'We could not save your shipment request.');
      } catch {
        setError('We could not restore your shipment request right now.');
      }
    };

    void resumeRequest();
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur">
        {error ? (
          <>
            <h1 className="text-2xl font-bold">Shipment handoff paused</h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">{error}</p>
            <Link
              href="/ship-with-us#start-shipment"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-brand-orange-500 px-5 font-semibold text-white hover:bg-brand-orange-600"
            >
              Return to your shipment
            </Link>
          </>
        ) : (
          <>
            <Loader2 className="mx-auto h-9 w-9 animate-spin text-brand-orange-500" />
            <h1 className="mt-5 text-xl font-bold">Saving your shipment request</h1>
            <p className="mt-2 text-sm text-slate-300">
              We’re securely moving your shipment into the dashboard.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
