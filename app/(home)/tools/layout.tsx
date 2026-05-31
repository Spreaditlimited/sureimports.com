import * as React from 'react';
import type { Metadata } from 'next';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'Import Tools | Sure Imports',
    template: '%s | Import Tools | Sure Imports',
  },
  description:
    'Free import tools for landed cost estimation, CBM calculation, shipping comparison, and pricing decisions.',
  alternates: {
    canonical: 'https://www.sureimports.com/tools',
  },
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfd] dark:bg-slate-950">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}