'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import CookieConsent from '@/app/(home)/components/CookieConsent';
import { syncOpenAIConsent } from '@/lib/marketing/openaiEvents';

export default function OpenAIAdsPixel() {
  const pathname = usePathname();
  useEffect(() => {
    syncOpenAIConsent();
    window.addEventListener('si:consent-change', syncOpenAIConsent);
    window.addEventListener('storage', syncOpenAIConsent);
    return () => {
      window.removeEventListener('si:consent-change', syncOpenAIConsent);
      window.removeEventListener('storage', syncOpenAIConsent);
    };
  }, [pathname]);

  // These acquisition routes previously had no consent choice.
  return pathname.startsWith('/buy-from-chinese-websites') ||
    pathname.startsWith('/auth/') ||
    pathname.startsWith('/blog') ||
    pathname === '/privacy-policy' ? (
    <CookieConsent />
  ) : null;
}
