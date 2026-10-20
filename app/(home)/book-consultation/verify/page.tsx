import type { Metadata } from 'next';

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

export default async function ConsultationVerifyPage({
  searchParams,
}: PageProps) {
  // Await searchParams to align with Next.js 15+ standards
  const resolvedParams = await searchParams;
  const reference = resolvedParams?.reference || resolvedParams?.trxref || '';

  return (
    <main className="min-h-screen bg-[var(--si-canvas)] text-[var(--si-ink)]">
      <Navigation />
      <section className="flex min-h-[70vh] items-center justify-center px-4 py-32">
        <ConsultationVerifyClient reference={reference} />
      </section>
      <Footer />
    </main>
  );
}
