'use client';

import Footer from '@/components/home/Footer';
import NavBar from '@/components/home/NavBar';
import WhatsAppButton from '@/components/WhatsAppButton';
import { ReactNode } from 'react';
import { Suspense } from 'react';

type HomeLayoutProps = {
  children: ReactNode;
};

const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
      <html lang="en">
        <head>
          <title>Sure Imports - Home</title>
        </head>
        <body className="bg-white text-gray-900 antialiased">
          <main className="min-h-screen">
            {children}
          <WhatsAppButton
            waID="CUR7YKW3K3RBA1"
            message="Hello! I'd like to ask about your services."
            position="bottom-left"
          />
          </main>
        </body>
      </html>
  );
};

export default HomeLayout;
