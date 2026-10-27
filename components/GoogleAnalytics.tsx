// app/components/GoogleAnalytics.tsx

'use client';

import { GoogleAnalytics } from '@next/third-parties/google';
import { useOptionalConsent } from '@/lib/marketing/useOptionalConsent';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID;

export const Analytics = () => {
  const consent = useOptionalConsent();
  if (!consent || !GA_MEASUREMENT_ID) {
    return null;
  }

  return <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />;
};
