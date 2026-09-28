'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  PENDING_VEHICLE_REQUEST_KEY,
  POST_AUTH_REDIRECT_KEY,
  VEHICLE_RESUME_PATH,
} from '@/lib/auth/loginRedirect';
import { readVehicleDraft } from '@/lib/vehicles/requestDraft';

export default function ResumeVehiclePage() {
  const router = useRouter();
  const attempted = useRef(false);
  const [error, setError] = useState('');
  const [returnPath, setReturnPath] = useState('/cars');
  useEffect(() => {
    if (attempted.current) return;
    attempted.current = true;
    async function resume() {
      try {
        const draft = readVehicleDraft(
          window.localStorage.getItem(PENDING_VEHICLE_REQUEST_KEY),
        );
        if (!draft) {
          setError(
            'Your saved vehicle request is missing or could not be read. Please complete the form again.',
          );
          return;
        }
        setReturnPath(
          `/cars/models/${draft.modelSlug}?configuration=${encodeURIComponent(draft.variantId)}&quantity=${draft.quantity}#enquire`,
        );
        const authenticate = () => {
          window.localStorage.setItem(
            POST_AUTH_REDIRECT_KEY,
            VEHICLE_RESUME_PATH,
          );
          router.replace(
            `/auth/login?next=${encodeURIComponent(VEHICLE_RESUME_PATH)}`,
          );
        };
        const auth = await fetch('/api/auth/me', { cache: 'no-store' });
        if (auth.status === 401) {
          authenticate();
          return;
        }
        if (!auth.ok)
          throw new Error(
            'We could not check your account. Your draft is still saved.',
          );
        const response = await fetch('/api/vehicles/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(draft),
        });
        if (response.status === 401) {
          authenticate();
          return;
        }
        const data = await response.json();
        if (!response.ok || !data.id)
          throw new Error(
            data.message || 'We could not save your vehicle request.',
          );
        try {
          window.localStorage.removeItem(PENDING_VEHICLE_REQUEST_KEY);
          if (
            window.localStorage.getItem(POST_AUTH_REDIRECT_KEY) ===
            VEHICLE_RESUME_PATH
          )
            window.localStorage.removeItem(POST_AUTH_REDIRECT_KEY);
        } catch {
          /* The order is saved; storage cleanup must not block the dashboard. */
        }
        router.replace(`/dashboard/vehicles/${data.id}`);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Unable to restore your request. Please try again.',
        );
      }
    }
    void resume();
  }, [router]);
  return (
    <main className="public-site-theme flex min-h-screen items-center justify-center bg-[var(--si-canvas)] px-6 text-[var(--si-ink)]">
      <div
        className="w-full max-w-md rounded-3xl border border-[var(--si-border)] bg-[var(--si-surface)] p-8 text-center"
        role="status"
      >
        {error ? (
          <>
            <h1 className="text-2xl font-bold">Your request needs attention</h1>
            <p className="mt-4">{error}</p>
            <Link
              href={returnPath}
              className="mt-6 inline-flex rounded-xl bg-[var(--si-primary)] px-5 py-3 text-white"
            >
              Return to your vehicle request
            </Link>
          </>
        ) : (
          <>
            <Loader2
              className="mx-auto h-9 w-9 animate-spin"
              aria-hidden="true"
            />
            <h1 className="mt-5 text-xl font-bold">
              Saving your vehicle request
            </h1>
            <p className="mt-3">We’re adding your request to your dashboard.</p>
          </>
        )}
      </div>
    </main>
  );
}
