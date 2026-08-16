'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const LeadCapturePopup = dynamic(
  () => import('@/components/lead-capture/LeadCapturePopup'),
  { ssr: false },
);
const LiveChat = dynamic(() => import('@/components/LiveChat'), { ssr: false });
const FacebookPixel = dynamic(
  () =>
    import('@/components/FacebookPixel').then((module) => module.FacebookPixel),
  { ssr: false },
);
const Analytics = dynamic(
  () =>
    import('@/components/GoogleAnalytics').then((module) => module.Analytics),
  { ssr: false },
);

export default function DeferredGlobalEnhancements() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(() => setIsReady(true), {
        timeout: 2_000,
      });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = globalThis.setTimeout(() => setIsReady(true), 1_000);
    return () => globalThis.clearTimeout(timeoutId);
  }, []);

  if (!isReady) return null;

  return (
    <>
      <LeadCapturePopup />
      <LiveChat />
      <FacebookPixel />
      <Analytics />
    </>
  );
}
