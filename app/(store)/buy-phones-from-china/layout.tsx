import NavBar from '@/components/home/NavBar';
import './globals.css';
import { ReactNode } from 'react';
import { CookieConsent } from '@/components/home/CookieConsent';
import WhatsAppButton from '@/components/WhatsAppButton';
//import Footer from '@/components/home/Footer';
import ScrollToTopButton from '@/components/home/scrollToTopButton';
import Header from '@/app/(home)/components/Navigation';
import Footer from '@/app/(home)/components/Footer';

export const metadata = {
  title: 'Buy Phones From China',
  description:
    'Shop verified phones and laptops sourced from China with quality checks, transparent pricing, and reliable delivery.',
  alternates: {
    canonical: 'https://www.sureimports.com/buy-phones-from-china',
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <div className="relative">
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
        <ScrollToTopButton />
      </div>
    </>
  );
}
