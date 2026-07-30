import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TrackingClient from '../TrackingClient';

export const metadata: Metadata = {
  title: 'Shipment Progress',
  robots: { index: false, follow: false },
};

export default async function TrackingResultPage({
  params,
}: {
  params: Promise<{ trackingId: string }>;
}) {
  const { trackingId } = await params;
  return (
    <>
      <Navbar forceLightNavbar />
      <TrackingClient initialTrackingId={decodeURIComponent(trackingId)} />
      <Footer />
    </>
  );
}
