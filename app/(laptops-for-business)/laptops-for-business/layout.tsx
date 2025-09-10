'use client';

import Footer from '@/components/home/Footer';
import NavBar from '@/components/home/NavBar';
import WhatsAppButton from '@/components/WhatsAppButton';
import { ReactNode } from 'react';
import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { TrackingPixels } from '../../(home)/components/TrackingPixels';

type HomeLayoutProps = {
  children: ReactNode;
};

// Back-to-top button (purple-blue gradient)
const BackToTopButton = () => {
  const [visible, setVisible] = useState(false);
  const [angle, setAngle] = useState(45); // gradient rotation

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y > 200);

      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Rotate ~0.5deg per pixel; loop within 0-359
          setAngle(((y * 0.5) % 360 + 360) % 360);
          ticking = false;
        });
        ticking = true;
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      className={`fixed z-50 bottom-6 right-6 transition-all duration-300
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'}
        rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2`}
    >
      <div
        className="p-3 rounded-full text-white"
        style={{
          background: `linear-gradient(${angle}deg, #6366f1, #a855f7, #3b82f6)`,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 01.707.293l5 5a1 1 0 11-1.414 1.414L11 7.414V17a1 1 0 11-2 0V7.414L5.707 9.707A1 1 0 114.293 8.293l5-5A1 1 0 0110 3z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </button>
  );
};

const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <html lang="en">
      <head>
        <title>Sure Imports - Home</title>
        <Suspense fallback={null}>
          <TrackingPixels />
        </Suspense>
      </head>
      <body className="bg-white text-gray-900 antialiased">
        <main className="min-h-screen">
          {children}
          <WhatsAppButton
            waID="CUR7YKW3K3RBA1"
            message="Hello! I'd like to ask about your services."
            position="bottom-left"
          />
          <BackToTopButton />
        </main>
      </body>
    </html>
  );
};

export default HomeLayout;
