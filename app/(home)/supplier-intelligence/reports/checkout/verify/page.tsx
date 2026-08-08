'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Download, Loader2, XCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

function VerifyContent() {
  const params = useSearchParams();
  const provider = params.get('provider') || '';
  const pidOrder = params.get('pidOrder') || '';
  const reference =
    provider === 'paypal'
      ? params.get('token') || ''
      : params.get('reference') || params.get('trxref') || '';
  const [state, setState] = useState<'loading' | 'success' | 'error'>(
    'loading',
  );
  const [message, setMessage] = useState(
    'Confirming your payment and preparing your report…',
  );
  const [downloadUrl, setDownloadUrl] = useState('');
  const [canOpenLibrary, setCanOpenLibrary] = useState(false);

  useEffect(() => {
    async function verify() {
      try {
        const response = await fetch('/api/intelligence/reports/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider, pidOrder, reference }),
        });
        const data = await response.json();
        if (!response.ok || !data.success)
          throw new Error(data.message || 'Payment verification failed.');
        setDownloadUrl(data.downloadUrl);
        setCanOpenLibrary(Boolean(data.canOpenLibrary));
        setState('success');
        setMessage(
          data.deliveryPending
            ? 'Payment confirmed. Your report is ready here now. Email and library delivery are being retried automatically.'
            : data.canOpenLibrary
              ? 'Payment confirmed. Your report is ready and has been added to My Supplier Reports.'
              : 'Payment confirmed. Your report is ready. We sent the download and secure account-access instructions to your email.',
        );
      } catch (caught) {
        setState('error');
        setMessage(
          caught instanceof Error
            ? caught.message
            : 'Payment verification failed.',
        );
      }
    }
    verify();
  }, [pidOrder, provider, reference]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
        <div
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${state === 'success' ? 'bg-emerald-50' : state === 'error' ? 'bg-red-50' : 'bg-orange-50'}`}
        >
          {state === 'loading' ? (
            <Loader2 className="h-8 w-8 animate-spin text-brand-orange-500" />
          ) : state === 'success' ? (
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          ) : (
            <XCircle className="h-8 w-8 text-red-600" />
          )}
        </div>
        <h1 className="mt-6 text-2xl font-black">
          {state === 'success'
            ? 'Your report is ready'
            : state === 'error'
              ? 'We could not confirm the payment'
              : 'Confirming payment'}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{message}</p>
        {state === 'success' ? (
          <div className="mt-7 grid gap-3">
            <a
              href={downloadUrl}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-orange-500 px-5 py-3 text-sm font-black text-white"
            >
              <Download className="h-4 w-4" />
              Download report
            </a>
            <Link
              href={
                canOpenLibrary
                  ? '/dashboard/my-reports'
                  : `/auth/login?next=${encodeURIComponent('/dashboard/my-reports')}`
              }
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700"
            >
              {canOpenLibrary
                ? 'View My Supplier Reports'
                : 'Sign in to My Supplier Reports'}
            </Link>
          </div>
        ) : null}
        {state === 'error' ? (
          <Link
            href="/supplier-intelligence/reports"
            className="mt-7 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white"
          >
            Return to reports
          </Link>
        ) : null}
      </div>
    </main>
  );
}

export default function SupplierReportVerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyContent />
    </Suspense>
  );
}
