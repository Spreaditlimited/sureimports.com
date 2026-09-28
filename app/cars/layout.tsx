import Link from 'next/link';
import type { Metadata } from 'next';
import './vehicles.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { BackToTopButton } from '@/app/(home)/components/BackToTopButton';

export const metadata: Metadata = {
  title: {
    default: 'Electric Cars & Commercial Vehicles from China',
    template: '%s | Sure Imports Vehicles',
  },
  description:
    'Explore electric vans, passenger vehicles and cargo trucks from China. Transparent Naira pricing, bank-transfer payments and tracked import orders.',
};
export default function CarsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="public-site-theme">
      <Navbar />
      <div className="vehicles-site pt-20">
        <div className="vehicle-subnav">
          <strong>Cars & commercial vehicles</strong>
          <nav aria-label="Vehicle navigation">
            <Link href="/cars">Explore</Link>
            <Link href="/cars#faqs">FAQs</Link>
            <Link href="/dashboard/vehicles">My vehicle orders ↗</Link>
          </nav>
        </div>
        {children}
      </div>
      <Footer />
      <WhatsAppButton
        waID="CUR7YKW3K3RBA1"
        message="Hello! I'd like to ask about your services."
        position="bottom-left"
      />
      <BackToTopButton />
    </div>
  );
}
