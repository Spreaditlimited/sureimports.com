import WhatsAppButton from '@/components/WhatsAppButton';
import './globals.css';
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { BackToTopButton } from '@/app/(home)/components/BackToTopButton';

export const metadata: Metadata = {
  title: 'Buy From Chinese Websites in Nigeria | 1688, Alibaba, Taobao & More',
  description:
    'Buy from Chinese websites like 1688, Alibaba, Taobao, Pinduoduo and DHgate from Nigeria. Sure Imports handles supplier checks, payment, shipping and delivery support.',
  keywords: [
    'buy from Chinese websites Nigeria',
    'buy from 1688 to Nigeria',
    'buy from Alibaba to Nigeria',
    'Taobao to Nigeria',
    'Pinduoduo to Nigeria',
    'Chinese website buying agent Nigeria',
    'China procurement service Nigeria',
    'ship from China to Nigeria',
  ],
  alternates: {
    canonical: 'https://www.sureimports.com/buy-from-chinese-websites',
  },
  openGraph: {
    title: 'Buy From Chinese Websites in Nigeria | Sure Imports',
    description:
      'Submit product links from 1688, Alibaba, Taobao, Pinduoduo, DHgate and other Chinese websites. Sure Imports helps with purchasing, checks and China-to-Nigeria delivery.',
    url: 'https://www.sureimports.com/buy-from-chinese-websites',
    siteName: 'Sure Imports',
    images: [
      {
        url: 'https://www.sureimports.com/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Buy from Chinese websites with Sure Imports',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buy From Chinese Websites in Nigeria | Sure Imports',
    description:
      'Buy from 1688, Alibaba, Taobao, Pinduoduo and other Chinese websites from Nigeria with Sure Imports.',
    images: ['https://www.sureimports.com/images/og-image.png'],
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
