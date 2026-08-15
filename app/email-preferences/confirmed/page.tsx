import type { Metadata } from 'next';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

import EmailConfirmationClient from './EmailConfirmationClient';

export const metadata: Metadata = {
  title: 'Confirm Your Email',
  description: 'Confirm your email preferences for Sure Imports updates.',
  robots: { index: false, follow: false },
};

type ConfirmationStatus = 'confirmed' | 'expired' | 'invalid';

export default async function EmailConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const safeStatus: ConfirmationStatus =
    status === 'confirmed' || status === 'expired' ? status : 'invalid';

  return (
    <>
      <Navbar forceLightNavbar />
      <EmailConfirmationClient status={safeStatus} />
      <Footer />
    </>
  );
}
