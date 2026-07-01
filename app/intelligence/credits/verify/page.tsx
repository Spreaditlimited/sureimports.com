'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';

export default function IntelligenceCreditsVerifyPage() {
  const searchParams = useSearchParams();
  const reference =
    searchParams.get('reference') || searchParams.get('trxref') || '';
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  );
  const [message, setMessage] = useState('Verifying your credit purchase...');

  useEffect(() => {
    async function verify() {
      if (!reference) {
        setStatus('error');
        setMessage('Payment reference was not found.');
        return;
      }

      try {
        const response = await fetch('/api/intelligence/credits/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference }),
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Credit verification failed.');
        }

        setStatus('success');
        setMessage(
          data.alreadyProcessed
            ? `This credit purchase was already processed. Current balance: ${data.balance}.`
            : `${data.creditsAdded} supplier search credit${
                data.creditsAdded === 1 ? '' : 's'
              } added. New balance: ${data.balance}.`,
        );
      } catch (error) {
        setStatus('error');
        setMessage(
          error instanceof Error
            ? error.message
            : 'Credit verification failed.',
        );
      }
    }

    verify();
  }, [reference]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12 text-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
          {status === 'loading' ? (
            <Loader2 className="h-7 w-7 animate-spin text-brand-orange-500" />
          ) : status === 'success' ? (
            <CheckCircle2 className="h-7 w-7 text-emerald-600" />
          ) : (
            <XCircle className="h-7 w-7 text-red-600" />
          )}
        </div>
        <h1 className="mt-6 text-2xl font-bold">
          {status === 'success'
            ? 'Credits added'
            : status === 'error'
              ? 'Verification failed'
              : 'Checking payment'}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>
        <Link
          href="/dashboard/intelligence"
          className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
        >
          Go to Supplier Intelligence
        </Link>
      </div>
    </main>
  );
}
