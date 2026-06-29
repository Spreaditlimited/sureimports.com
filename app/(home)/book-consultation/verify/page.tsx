import type { Metadata } from 'next';
import { ShieldCheck } from 'lucide-react';

import Footer from '@/app/(home)/components/Footer';
import Navigation from '@/app/(home)/components/Navigation';
import ConsultationVerifyClient from '@/components/consultation/ConsultationVerifyClient';

export const metadata: Metadata = {
  title: 'Confirm Consultation Booking | Sure Imports',
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ reference?: string; trxref?: string }>;
};

export default async function ConsultationVerifyPage({ searchParams }: PageProps) {
  // Await searchParams to align with Next.js 15+ standards
  const resolvedParams = await searchParams;
  const reference = resolvedParams?.reference || resolvedParams?.trxref || '';

  return (
    <main className="flex min-h-screen flex-col bg-slate-50/50 text-slate-950 antialiased selection:bg-brand-orange-500/30">
      <Navigation />
      
      <section className="flex flex-1 items-center justify-center px-4 py-32 sm:px-6 lg:px-8">
        <div className="relative w-full max-w-lg">
          
          {/* Subtle Ambient Glow for focus */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-orange-500/10 blur-[80px]" />
          
          {/* Processing Card */}
          <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-200/50 sm:p-12 text-center">
            
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-emerald-50 border border-emerald-100 text-emerald-500 shadow-sm">
              <ShieldCheck className="h-10 w-10" />
            </div>
            
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Verifying your booking
            </h1>
            
            <p className="mx-auto mt-4 mb-8 max-w-sm text-sm leading-relaxed text-slate-500">
              Please wait a moment while we securely confirm your payment and lock in your consultation time slot.
            </p>

            {/* Client Component Container */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 min-h-[160px] flex items-center justify-center">
              <ConsultationVerifyClient reference={reference} />
            </div>

            <p className="mt-8 text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Secure Transaction
            </p>
          </div>
          
        </div>
      </section>

      <Footer />
    </main>
  );
}