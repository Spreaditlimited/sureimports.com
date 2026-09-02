'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

import {
  PENDING_SUPPLIER_VERIFICATION_KEY,
  POST_AUTH_REDIRECT_KEY,
  SUPPLIER_VERIFICATION_DRAFT_VERSION,
  SUPPLIER_VERIFICATION_RESUME_PATH,
} from '@/lib/auth/loginRedirect';

export default function ResumeSupplierVerificationPage() {
  const router = useRouter();
  const attemptedRef = useRef(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (attemptedRef.current) return;
    attemptedRef.current = true;

    const resumeRequest = async () => {
      const pendingRaw = window.localStorage.getItem(
        PENDING_SUPPLIER_VERIFICATION_KEY,
      );
      if (!pendingRaw) {
        router.replace('/supplier-verification#start-verification');
        return;
      }

      let draft: Record<string, unknown>;
      try {
        const savedDraft = JSON.parse(pendingRaw) as {
          version?: number;
          form?: Record<string, unknown>;
        };
        if (
          savedDraft.version !== SUPPLIER_VERIFICATION_DRAFT_VERSION ||
          !savedDraft.form
        ) {
          throw new Error('Unsupported verification draft.');
        }
        draft = savedDraft.form;
      } catch {
        window.localStorage.removeItem(PENDING_SUPPLIER_VERIFICATION_KEY);
        window.localStorage.removeItem(POST_AUTH_REDIRECT_KEY);
        setError(
          'Your saved verification draft could not be read. Please recreate it.',
        );
        return;
      }

      const marketplaceUrls = String(draft.marketplaceUrls || '')
        .split(/\n|,/)
        .map((value) => value.trim())
        .filter(Boolean);

      try {
        const authResponse = await fetch('/api/auth/me', { cache: 'no-store' });
        if (!authResponse.ok) {
          window.localStorage.setItem(
            POST_AUTH_REDIRECT_KEY,
            SUPPLIER_VERIFICATION_RESUME_PATH,
          );
          router.replace(
            `/auth/login?next=${encodeURIComponent(SUPPLIER_VERIFICATION_RESUME_PATH)}`,
          );
          return;
        }

        const response = await fetch('/api/supplier-verifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...draft, marketplaceUrls }),
        });
        const data = (await response.json()) as {
          message?: string;
          request?: { pidVerifySupplier?: string };
        };

        if (response.ok && data.request?.pidVerifySupplier) {
          window.localStorage.removeItem(PENDING_SUPPLIER_VERIFICATION_KEY);
          window.localStorage.removeItem(POST_AUTH_REDIRECT_KEY);
          router.replace('/dashboard/verify-supplier');
          return;
        }

        if (response.status === 401) {
          window.localStorage.setItem(
            POST_AUTH_REDIRECT_KEY,
            SUPPLIER_VERIFICATION_RESUME_PATH,
          );
          router.replace(
            `/auth/login?next=${encodeURIComponent(SUPPLIER_VERIFICATION_RESUME_PATH)}`,
          );
          return;
        }

        setError(
          data.message ||
            'We could not save your verification request. Please review it and try again.',
        );
      } catch {
        setError(
          'We could not save your verification request right now. Please try again.',
        );
      }
    };

    void resumeRequest();
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur">
        {error ? (
          <>
            <h1 className="text-2xl font-bold">Verification handoff paused</h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">{error}</p>
            <Link
              href="/supplier-verification#start-verification"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-brand-orange-500 px-5 font-semibold text-white hover:bg-brand-orange-600"
            >
              Return to your request
            </Link>
          </>
        ) : (
          <>
            <Loader2 className="mx-auto h-9 w-9 animate-spin text-brand-orange-500" />
            <h1 className="mt-5 text-xl font-bold">
              Saving your verification request
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              We’re securely moving your request into the dashboard.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
