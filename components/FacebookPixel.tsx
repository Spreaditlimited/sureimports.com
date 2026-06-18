'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export const FacebookPixel: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initializedRef = useRef(false);

  useEffect(() => {
    const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
    if (!pixelId) return;

    import('react-facebook-pixel')
      .then((x) => x.default)
      .then((ReactPixel) => {
        if (!initializedRef.current) {
          ReactPixel.init(pixelId);
          initializedRef.current = true;
        }
        ReactPixel.pageView();
      });
  }, [pathname, searchParams]);

  return null;
};
