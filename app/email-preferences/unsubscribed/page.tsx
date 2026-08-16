import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, MailX } from 'lucide-react';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Email Preferences',
  description: 'Manage your Sure Imports email preferences.',
  robots: { index: false, follow: false },
};

export default async function UnsubscribedPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const success = status === 'success';
  const Icon = success ? CheckCircle2 : MailX;

  return (
    <>
      <Navbar forceLightNavbar />
      <main className="min-h-[75vh] bg-slate-50 px-4 pb-20 pt-32 text-slate-950">
        <div className="mx-auto max-w-2xl text-center">
          <div
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${
              success ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            }`}
          >
            <Icon className="h-8 w-8" aria-hidden="true" />
          </div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.24em] text-brand-orange-600">
            Email preferences
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {success ? 'You have been unsubscribed' : 'This link is unavailable'}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
            {success
              ? 'You will no longer receive Sure Imports marketing emails. Essential account and order emails are not affected.'
              : 'The unsubscribe link may be incomplete or invalid. You can contact us at hello@sureimports.com if you need help.'}
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-800"
          >
            Return to Sure Imports
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
