'use client';

import { flushFacebookEvents } from '@/lib/marketing/facebookEvents';
import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useOptionalConsent } from '@/lib/marketing/useOptionalConsent';
import { hasOptionalCookieConsent } from '@/lib/marketing/optionalConsent';

export const FacebookPixel: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initializedRef = useRef(false);
  const consent = useOptionalConsent();

  useEffect(() => {
    const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
    if (!consent) {
      (window as typeof window & { fbq?: (...args: unknown[]) => void }).fbq?.(
        'consent',
        'revoke',
      );
      return;
    }
    if (!pixelId || !hasOptionalCookieConsent()) return;

    import('react-facebook-pixel')
      .then((x) => x.default)
      .then((ReactPixel) => {
        if (!hasOptionalCookieConsent()) return;
        if (!initializedRef.current) {
          ReactPixel.init(pixelId);
          initializedRef.current = true;
        }
        (window as Window & { __siPixelReady?: boolean }).__siPixelReady = true;
        ReactPixel.grantConsent();
        flushFacebookEvents();
        ReactPixel.pageView();
      })
      .catch(() => {
        /* CAPI remains available when browser tracking is blocked. */
      });
  }, [pathname, searchParams, consent]);

  return null;
};
