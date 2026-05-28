import * as React from 'react';
import PrivacyPolicy from '../components/PrivacyPolicy';
import Header from '@/app/(home)/components/Navigation';
import Footer from '@/app/(home)/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Read the Sure Imports privacy policy and how we collect, use, and protect your information.',
  alternates: {
    canonical: 'https://www.sureimports.com/privacy-policy',
  },
};

const Page: React.FC = () => (
  <>
    <Header />
    <main className="min-h-screen">
      <PrivacyPolicy />
    </main>
    <Footer />
  </>
);

export default Page;
