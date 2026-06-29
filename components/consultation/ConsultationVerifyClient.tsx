'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';

type Status = 'loading' | 'success' | 'error';

export default function ConsultationVerifyClient({ reference }: { reference: string }) {
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('Verifying your payment and creating your Zoom meeting...');

  useEffect(() => {
    let mounted = true;

    async function verify() {
      if (!reference) {
        setStatus('error');
        setMessage('Payment reference is missing.');
        return;
      }

      try {
        const response = await fetch('/api/consultation/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference }),
        });
        const data = await response.json();
        if (!response.ok || !data?.ok) {
          throw new Error(data?.message || 'Payment could not be verified.');
        }
        if (!mounted) return;
        setStatus('success');
        setMessage(
          'Your consultation is booked. We have sent the Zoom details to your email.',
        );
      } catch (error) {
        if (!mounted) return;
        setStatus('error');
        setMessage(
          error instanceof Error
            ? error.message
            : 'Payment could not be verified.',
        );
      }
    }

    verify();
    return () => {
      mounted = false;
    };
  }, [reference]);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-full ${
          status === 'success'
            ? 'bg-emerald-50 text-emerald-600'
            : status === 'error'
              ? 'bg-red-50 text-red-600'
              : 'bg-brand-orange-50 text-brand-orange-600'
        }`}
      >
        {status === 'loading' ? <Loader2 className="h-8 w-8 animate-spin" /> : null}
        {status === 'success' ? <CheckCircle2 className="h-8 w-8" /> : null}
        {status === 'error' ? <XCircle className="h-8 w-8" /> : null}
      </div>

      <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-950">
        {status === 'success'
          ? 'Consultation booked'
          : status === 'error'
            ? 'Could not finish booking'
            : 'Confirming booking'}
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/book-consultation"
          className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
        >
          Back to booking
        </Link>
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-orange-500 px-5 text-sm font-bold text-white transition hover:bg-brand-orange-600"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
