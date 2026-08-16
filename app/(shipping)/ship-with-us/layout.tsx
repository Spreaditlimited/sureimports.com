import type { Metadata } from 'next';
import { ReactNode } from 'react';
import WhatsAppButton from '@/components/WhatsAppButton';
import { BackToTopButton } from '@/app/(home)/components/BackToTopButton';

export const metadata: Metadata = {
  title: 'Ship With Us | China Logistics & Shipping',
  description:
    'Already have a supplier? Create a shipping-only request with Sure Imports. Send your goods to our China warehouse and track your shipment directly from your dashboard.',
  alternates: {
    canonical: 'https://www.sureimports.com/ship-with-us',
  },
};

interface ShipWithUsLayoutProps {
  children: ReactNode;
}

export default function ShipWithUsLayout({ children }: ShipWithUsLayoutProps) {
  return (
    <div className="public-site-theme relative min-h-screen bg-[#fcfcfd] dark:bg-slate-950">
      {children}

      {/* Sales Conversion: Specifically mentions "shipping service" */}
      <WhatsAppButton
        waID="CUR7YKW3K3RBA1"
        message="Hello! I'm on the Ship With Us page and I'd like to ask about your shipping-only logistics service."
        position="bottom-left"
      />

      <BackToTopButton />
    </div>
  );
}
