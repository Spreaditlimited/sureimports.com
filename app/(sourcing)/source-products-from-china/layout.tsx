import WhatsAppButton from '@/components/WhatsAppButton';
import './globals.css';
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { BackToTopButton } from '@/app/(home)/components/BackToTopButton';

export const metadata: Metadata = {
  title: 'Source Products From China',
  description:
    'Custom product sourcing from China with supplier vetting, negotiation, quality assurance, and end-to-end logistics.',
  alternates: {
    canonical: 'https://www.sureimports.com/source-products-from-china',
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      {children}
      <WhatsAppButton
        waID="CUR7YKW3K3RBA1"
        message="Hello! I'd like to ask about your services."
        position="bottom-left"
      />
      <BackToTopButton />
    </>
  );
}
