'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

import {
  CORPORATE_SOURCING_RESUME_PATH,
  POST_AUTH_REDIRECT_KEY,
} from '@/lib/auth/loginRedirect';
import {
  corporateSourcingDraftToFormData,
  deleteCorporateSourcingDraft,
  getCorporateSourcingDraft,
} from '@/lib/corporateSourcing/pendingDraft';

export default function ResumeCorporateSourcingPage() {
  const router = useRouter();
  const attemptedRef = useRef(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (attemptedRef.current) return;
    attemptedRef.current = true;

    const resumeRequest = async () => {
      try {
        const draft = await getCorporateSourcingDraft();
        if (!draft) {
          router.replace('/corporate-sourcing#corporate-sourcing-form');
          return;
        }

        const authResponse = await fetch('/api/auth/me', { cache: 'no-store' });
        if (!authResponse.ok) {
          window.localStorage.setItem(
            POST_AUTH_REDIRECT_KEY,
            CORPORATE_SOURCING_RESUME_PATH,
          );
          router.replace(
            `/auth/login?next=${encodeURIComponent(CORPORATE_SOURCING_RESUME_PATH)}`,
          );
          return;
        }

        const response = await fetch('/api/corporate-gifts', {
          method: 'POST',
          body: corporateSourcingDraftToFormData(draft),
        });
        const data = (await response.json().catch(() => null)) as {
          statusx?: string;
          error?: string;
          redirectTo?: string;
        } | null;

        if (response.ok && data?.redirectTo) {
          await deleteCorporateSourcingDraft();
          window.localStorage.removeItem(POST_AUTH_REDIRECT_KEY);
          router.replace(data.redirectTo);
          return;
        }

        if (response.status === 401 || data?.statusx === 'AUTH_REQUIRED') {
          window.localStorage.setItem(
            POST_AUTH_REDIRECT_KEY,
            CORPORATE_SOURCING_RESUME_PATH,
          );
          router.replace(
            `/auth/login?next=${encodeURIComponent(CORPORATE_SOURCING_RESUME_PATH)}`,
          );
          return;
        }

        setError(data?.error || 'We could not submit your request. Please try again.');
      } catch {
        setError('We could not restore your request right now. Please try again.');
      }
    };

    void resumeRequest();
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur">
        {error ? (
          <>
            <h1 className="text-2xl font-bold">Request handoff paused</h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">{error}</p>
            <Link
              href="/corporate-sourcing#corporate-sourcing-form"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-brand-orange-500 px-5 font-semibold text-white hover:bg-brand-orange-600"
            >
              Return to Corporate Sourcing
            </Link>
          </>
        ) : (
          <>
            <Loader2 className="mx-auto h-9 w-9 animate-spin text-brand-orange-500" />
            <h1 className="mt-5 text-xl font-bold">Saving your sourcing request</h1>
            <p className="mt-2 text-sm text-slate-300">
              We’re securely moving your brief and files into the dashboard.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
