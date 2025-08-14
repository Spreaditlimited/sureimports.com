'use client';

import { CookieConsent } from '@/components/home/CookieConsent';
import Footer from '@/components/home/Footer';
import NavBar from '@/components/home/NavBar';
import NotificationStrip from '@/components/home/NotificationStrip';
import ScrollToTopButton from '@/components/home/scrollToTopButton';
import LiveChat from '@/components/LiveChat';
import WhatsAppButton from '@/components/WhatsAppButton';
import { LiveChatWidgetComponent } from '@/components/live-chat-widget';
import { ReactNode } from 'react';

type HomeLayoutProps = {
  children: ReactNode;
};

const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <>
      <div className="relative">
        <NavBar />
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
};

export default HomeLayout;
