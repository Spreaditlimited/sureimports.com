'use client';
import { useState, useEffect } from 'react';
import { deleteCookie, hasCookie, setCookie } from 'cookies-next';

export const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    if (!hasCookie('consent')) {
      setShowConsent(true);
    }
  }, []);

  const acceptConsent = () => {
    setShowConsent(false);
    setCookie('consent', 'true', { maxAge: 365 * 24 * 3600 });
    // Trigger GTM or analytics scripts here
  };

  const declineConsent = () => {
    setShowConsent(true);
    setCookie('consent', 'false', { maxAge: 0 });
    // Trigger GTM or analytics scripts here

    deleteCookie('consent');
    window.gtag?.('consent', 'update', {
      ad_storage: 'denied',
      analytics_storage: 'denied',
    });
  };

  ////////////////// DISABLE GOOGLE TAGS //////////////////
  //   "use client";
  // import Script from 'next/script';
  // import { hasCookie } from 'cookies-next';

  // export const GTM = () => {
  //   return (
  //     <>
  //       {hasCookie('consent') && (
  //         <Script
  //           id="gtm-script"
  //           strategy="afterInteractive"
  //           src={`https://www.googletagmanager.com/gtm.js?id=${process.env.GTM_ID}`}
  //         />
  //       )}
  //     </>
  //   );
  // };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between bg-slate-700 bg-opacity-90 p-4 pb-20 text-white shadow-lg">
      <p>
        <b>Accept cookies from Sure Imports on this browser?</b>
        <br />
        We use cookies to understand, secure, operate, and provide our services.
        Learn more about how we use cookies in our
        <a href="/privacy-policy" className="text-blue-400">
          {' '}
          Privacy Policy.
        </a>
      </p>
      <div>
        <button
          onClick={declineConsent}
          className="m-5 mr-2 rounded-xl bg-gray-100 p-5 px-4 py-2 text-gray-600"
        >
          Decline
        </button>
        <button
          onClick={acceptConsent}
          className="m-5 mr-2 rounded-xl bg-blue-600 p-5 px-4 py-2 text-white"
        >
          Accept
        </button>
      </div>
    </div>
  );
};
