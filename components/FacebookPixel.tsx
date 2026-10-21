'use client';

import { flushFacebookEvents } from '@/lib/marketing/facebookEvents';
import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export const FacebookPixel: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initializedRef = useRef(false);

  useEffect(() => {
    const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
    if (
      !pixelId ||
      document.cookie.split(';').some((c) => c.trim() === 'consent=false')
    )
      return;

    import('react-facebook-pixel')
      .then((x) => x.default)
      .then((ReactPixel) => {
        if (document.cookie.split(';').some((c) => c.trim() === 'consent=false')) return;
        if (!initializedRef.current) {
          ReactPixel.init(pixelId);
          initializedRef.current = true;
        }
        (window as Window & { __siPixelReady?: boolean }).__siPixelReady = true;
        flushFacebookEvents();
        ReactPixel.pageView();
      })
      .catch(() => {
        /* CAPI remains available when browser tracking is blocked. */
      });
  }, [pathname, searchParams]);

  return null;
};
