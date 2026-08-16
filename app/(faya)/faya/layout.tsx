import type { Metadata } from 'next';
import './globals.css';
//import Footer from '@/components/home/Footer';
import NavBar from '@/components/home/NavBar';
import { CookieConsent } from '@/components/home/CookieConsent';
import WhatsAppButton from '@/components/WhatsAppButton';
import { BackToTopButton } from '@/app/(home)/components/BackToTopButton';
import Header from '@/app/(home)/components/Navigation';
import Footer from '@/app/(home)/components/Footer';

export const metadata: Metadata = {
  title: 'Faya',
  description:
    'Explore Faya by Sure Imports for curated products, clear pricing, and reliable fulfillment.',
  alternates: {
    canonical: 'https://www.sureimports.com/faya',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="public-site-theme relative">
        <Header />
        {/* <LiveChatWidgetComponent /> */}
        {children}
        <CookieConsent />
        {/* Add the WhatsApp button */}
        <WhatsAppButton
          waID="CUR7YKW3K3RBA1"
          message="Hello! I'd like to ask about your services."
          position="bottom-left"
        />
        {/* <LiveChat /> */}
        <Footer />
        <BackToTopButton />
      </div>
    </>
  );
}
