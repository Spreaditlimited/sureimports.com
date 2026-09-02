'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function VerificationReturnClient() {
  const params = useSearchParams();
  const [state, setState] = useState<'checking' | 'success' | 'error'>(
    'checking',
  );
  const [message, setMessage] = useState('Confirming your secure payment…');

  useEffect(() => {
    const provider = params.get('provider');
    const pidPayment = params.get('pidPayment');
    const reference =
      provider === 'paypal' ? params.get('token') : params.get('reference');
    if (!provider || !pidPayment || !reference) {
      setState('error');
      setMessage('The payment return details are incomplete.');
      return;
    }
    fetch('/api/supplier-verifications/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, pidPayment, reference }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.success)
          throw new Error(data.message || 'Payment could not be confirmed.');
        setState('success');
        setMessage(
          data.paymentPurpose === 'PHYSICAL_VISIT'
            ? 'Physical-visit payment confirmed. Our China team can now schedule the visit.'
            : 'Standard verification payment confirmed. Online checks can now begin.',
        );
      })
      .catch((error) => {
        setState('error');
        setMessage(
          error instanceof Error
            ? error.message
            : 'Payment could not be confirmed.',
        );
      });
  }, [params]);

  const Icon =
    state === 'checking'
      ? Loader2
      : state === 'success'
        ? CheckCircle2
        : XCircle;
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-20">
      <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
        <Icon
          className={`mx-auto h-12 w-12 ${state === 'checking' ? 'animate-spin text-orange-500' : state === 'success' ? 'text-emerald-600' : 'text-red-600'}`}
        />
        <h1 className="mt-5 text-2xl font-black text-slate-950">
          {state === 'checking'
            ? 'Confirming payment'
            : state === 'success'
              ? 'Payment confirmed'
              : 'Payment needs attention'}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>
        {state !== 'checking' ? (
          <Link
            href="/dashboard/verify-supplier"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-black text-white"
          >
            Open Supplier Verification
          </Link>
        ) : null}
      </section>
    </main>
  );
}
