import * as React from 'react';
import type { Metadata } from 'next';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TermsAndConditions from '../components/TermsAndConditions';

export const metadata: Metadata = {
  title: 'Terms and Conditions | Sure Imports',
  description: 'Review the terms and conditions governing Sure Imports services and platform usage.',
  alternates: {
    canonical: 'https://www.sureimports.com/terms-and-conditions',
  },
};

export default function TermsAndConditionsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#fcfcfd] pt-48 dark:bg-slate-950">
        <TermsAndConditions />
      </main>
      <Footer />
    </>
  );
}