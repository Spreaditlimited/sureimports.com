'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { X, Cookie } from 'lucide-react';

interface CookieConsentProps {
  onNavigateToPrivacyPolicy?: () => void;
}

export default function CookieConsent({
  onNavigateToPrivacyPolicy,
}: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Tracking reads this cookie, so an old localStorage preference cannot
    // suppress a fresh choice when the consent cookie is missing or expired.
    if (
      !document.cookie
        .split(';')
        .some((value) => /^consent=(true|false)$/.test(value.trim()))
    ) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const open = () => setIsVisible(true);
    window.addEventListener('si:open-consent', open);
    return () => window.removeEventListener('si:open-consent', open);
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('cookie-consent', 'accepted');
    } catch {
      /* Use the cookie. */
    }
    document.cookie = 'consent=true; Path=/; Max-Age=31536000; SameSite=Lax';
    window.dispatchEvent(new Event('si:consent-change'));
    setIsVisible(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem('cookie-consent', 'declined');
    } catch {
      /* Use the cookie. */
    }
    document.cookie = 'consent=false; Path=/; Max-Age=31536000; SameSite=Lax';
    window.dispatchEvent(new Event('si:consent-change'));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="si-menu fixed bottom-6 left-6 right-6 z-[60] mx-auto max-w-4xl rounded-3xl border border-slate-800 bg-slate-950/90 p-6 shadow-2xl sm:flex sm:items-center sm:justify-between sm:gap-6">
      <button
        aria-label="Close cookie notice"
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-4 text-slate-500 hover:text-white"
      >
        <X className="h-5 w-5" />
      </button>
      <div className="mb-6 flex items-start gap-4 sm:mb-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-orange-500/20 text-brand-orange-500">
          <Cookie className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">We use cookies</h3>
          <p className="mt-1 text-xs text-slate-400">
            Optional cookies help us measure website use and advertising,
            including completed signups from ChatGPT ads. Choose whether to
            allow them.{' '}
            {onNavigateToPrivacyPolicy ? (
              <button
                onClick={onNavigateToPrivacyPolicy}
                className="text-indigo-400 hover:underline"
              >
                Learn more
              </button>
            ) : (
              <Link
                href="/privacy-policy"
                className="text-indigo-400 hover:underline"
              >
                Learn more
              </Link>
            )}
            .
          </p>
        </div>
      </div>
      <div className="flex shrink-0 gap-3">
        <Button
          onClick={handleDecline}
          variant="ghost"
          className="text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          Decline
        </Button>
        <Button
          onClick={handleAccept}
          className="border-0 bg-brand-orange-500 text-white hover:bg-brand-orange-600"
        >
          Accept Cookies
        </Button>
      </div>
    </div>
  );
}
