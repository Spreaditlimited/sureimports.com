import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16">
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
          404
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
          Page Not Found
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          The page you requested does not exist or may have been moved.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-500"
          >
            Go To Homepage
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
          >
            Go To Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}

