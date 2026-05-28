import WhatsAppButton from '@/components/WhatsAppButton';
import './globals.css';
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { BackToTopButton } from '@/app/(home)/components/BackToTopButton';

export const metadata: Metadata = {
  title: 'Buy From Chinese Websites',
  description:
    'Buy from trusted Chinese websites with supplier verification, quality checks, and international shipping by Sure Imports.',
  alternates: {
    canonical: 'https://www.sureimports.com/buy-from-chinese-websites',
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
