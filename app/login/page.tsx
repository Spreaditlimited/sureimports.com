'use client';

import { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';

export default function LoginAliasFallbackPage() {
  const router = useRouter();
  const params = useSearchParams();

  const message = useMemo(
    () =>
      params.get('message') ||
      'This login link is outdated. Please continue from the correct login page.',
    [params],
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white shadow-xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-full bg-amber-500/20 p-2">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
          </div>
          <h1 className="text-lg font-semibold">Login Redirect</h1>
        </div>

        <p className="mb-6 text-sm text-slate-300">{message}</p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-medium hover:bg-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous Page
          </button>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold hover:bg-blue-500"
          >
            <Home className="h-4 w-4" />
            Go Home
          </button>
        </div>

        <button
          onClick={() => router.push('/auth/login')}
          className="mt-3 w-full rounded-xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-200 hover:bg-slate-800"
        >
          Open Login Page
        </button>
      </div>
    </main>
  );
}
