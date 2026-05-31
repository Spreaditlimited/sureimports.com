import type { Metadata } from 'next';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PublicShippingOnlyFlow from './components/PublicShippingOnlyFlow';

export const metadata: Metadata = {
  title: 'Ship With Us | Sure Imports',
  description:
    'Have your own supplier? Let us handle the logistics. Send your goods to our dedicated China warehouse and we will deliver them safely to your destination.',
  alternates: {
    canonical: 'https://www.sureimports.com/ship-with-us',
  },
};

export default function ShipWithUsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfd] dark:bg-slate-950">
      <Navbar />
      <main className="flex-1">
        <PublicShippingOnlyFlow />
      </main>
      <Footer />
    </div>
  );
}