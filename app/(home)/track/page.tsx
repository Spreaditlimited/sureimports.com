import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TrackingClient from './TrackingClient';

export const metadata: Metadata = {
  title: 'Track Your Shipment',
  description:
    'Track your Sure Imports Ship With Us shipment from our China warehouse through arrival and collection in Nigeria.',
  alternates: { canonical: 'https://www.sureimports.com/track' },
};

export default function TrackShipmentPage() {
  return (
    <>
      <Navbar forceLightNavbar />
      <TrackingClient />
      <Footer />
    </>
  );
}
