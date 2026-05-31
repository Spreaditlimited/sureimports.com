import * as React from 'react';
import type { Metadata } from 'next';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PrivacyPolicy from '../components/PrivacyPolicy'; // Adjust path if needed based on your folder structure

export const metadata: Metadata = {
  title: 'Privacy Policy | Sure Imports',
  description: 'Read the Sure Imports privacy policy and learn how we collect, use, and protect your information.',
  alternates: {
    canonical: 'https://www.sureimports.com/privacy-policy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#fcfcfd] pt-48 dark:bg-slate-950">
        <PrivacyPolicy />
      </main>
      <Footer />
    </>
  );
}