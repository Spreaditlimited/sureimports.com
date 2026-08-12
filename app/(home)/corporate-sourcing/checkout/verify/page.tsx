'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

import {
  corporateSourcingDraftToFormData,
  deleteCorporateSourcingDraft,
  getCorporateSourcingDraft,
} from '@/lib/corporateSourcing/pendingDraft';

function VerifyContent() {
  const params = useSearchParams();
  const provider = params.get('provider') || '';
  const pidPayment = params.get('pidPayment') || '';
  const reference =
    provider === 'paypal'
      ? params.get('token') || ''
      : params.get('reference') || params.get('trxref') || '';
  const [state, setState] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Confirming your payment and submitting your sourcing brief…');
  const [requestUrl, setRequestUrl] = useState('/dashboard/corporate-sourcing');

  useEffect(() => {
    async function verifyAndSubmit() {
      try {
        const stored = JSON.parse(
          window.localStorage.getItem('sureimports:corporateSourcingCheckout') || '{}',
        );
        if (stored.pidPayment !== pidPayment || !stored.submissionToken) {
          throw new Error('We could not restore this checkout. Please contact Sure Imports with your payment reference.');
        }
        const verifyResponse = await fetch('/api/corporate-sourcing/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider,
            pidPayment,
            reference,
            submissionToken: stored.submissionToken,
          }),
        });
        const verification = await verifyResponse.json();
        if (!verifyResponse.ok || !verification.success) {
          throw new Error(verification.message || 'Payment verification failed.');
        }
        const draft = await getCorporateSourcingDraft();
        if (!draft) {
          throw new Error('Payment is confirmed, but your saved sourcing brief could not be restored. Please contact Sure Imports.');
        }
        const formData = corporateSourcingDraftToFormData(draft);
        formData.append('pid_payment', pidPayment);
        formData.append('submission_token', stored.submissionToken);
        const submitResponse = await fetch('/api/corporate-gifts', {
          method: 'POST',
          body: formData,
        });
        const submission = await submitResponse.json().catch(() => null);
        if (!submitResponse.ok || !submission?.success) {
          throw new Error(submission?.error || 'Your paid sourcing brief could not be submitted.');
        }
        await deleteCorporateSourcingDraft();
        window.localStorage.removeItem('sureimports:corporateSourcingCheckout');
        setRequestUrl(submission.redirectTo || '/dashboard/corporate-sourcing');
        setState('success');
        setMessage('Payment confirmed. Your sourcing brief has been submitted to Sure Imports for review.');
      } catch (error) {
        setState('error');
        setMessage(error instanceof Error ? error.message : 'We could not complete your request.');
      }
    }
    void verifyAndSubmit();
  }, [pidPayment, provider, reference]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12 dark:bg-slate-950">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${state === 'success' ? 'bg-emerald-50 dark:bg-emerald-500/10' : state === 'error' ? 'bg-red-50 dark:bg-red-500/10' : 'bg-orange-50 dark:bg-orange-500/10'}`}>
          {state === 'loading' ? <Loader2 className="h-8 w-8 animate-spin text-brand-orange-500" /> : state === 'success' ? <CheckCircle2 className="h-8 w-8 text-emerald-600" /> : <XCircle className="h-8 w-8 text-red-600" />}
        </div>
        <h1 className="mt-6 text-2xl font-black text-slate-950 dark:text-white">
          {state === 'success' ? 'Your sourcing brief is submitted' : state === 'error' ? 'We could not complete the submission' : 'Confirming payment'}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{message}</p>
        {state === 'success' ? (
          <Link href={requestUrl} className="mt-7 inline-flex rounded-xl bg-brand-orange-500 px-5 py-3 text-sm font-bold text-white hover:bg-brand-orange-600">
            View Corporate Sourcing
          </Link>
        ) : null}
        {state === 'error' ? (
          <Link href="/corporate-sourcing#corporate-sourcing-form" className="mt-7 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white dark:bg-white dark:text-slate-950">
            Return to Corporate Sourcing
          </Link>
        ) : null}
      </div>
    </main>
  );
}

export default function CorporateSourcingVerifyPage() {
  return <Suspense fallback={null}><VerifyContent /></Suspense>;
}
