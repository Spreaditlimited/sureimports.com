import * as React from 'react';
import TermsAndConditions from '../components/TermsAndConditions';
import Header from '@/app/(home)/components/Navigation';
import Footer from '@/app/(home)/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description:
    'Review the terms and conditions governing Sure Imports services and platform usage.',
  alternates: {
    canonical: 'https://www.sureimports.com/terms-and-conditions',
  },
};

const Page: React.FC = () => (
  <>
    <Header />
    <main className="min-h-screen">
      <TermsAndConditions />
    </main>
    <Footer />
  </>
);

export default Page;
