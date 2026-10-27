'use client';

import { useEffect, useState } from 'react';

type ConsentApi = {
  callbackQueue: Array<(() => void) | { CONSENT_API_READY: () => void }>;
  showRevocationMessage?: () => void;
};

export default function AdSensePrivacyChoices() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let mounted = true;
    const consentWindow = window as typeof window & { googlefc?: ConsentApi };
    const api = (consentWindow.googlefc ||= { callbackQueue: [] });
    api.callbackQueue ||= [];
    api.callbackQueue.push({
      CONSENT_API_READY: () => {
        if (mounted) setReady(typeof api.showRevocationMessage === 'function');
      },
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!ready) return null;
  return (
    <button
      type="button"
      className="my-4 text-sm font-semibold underline underline-offset-4"
      onClick={() => {
        const api = (window as typeof window & { googlefc?: ConsentApi })
          .googlefc;
        api?.callbackQueue.push(() => api.showRevocationMessage?.());
      }}
    >
      Advertising privacy and cookie settings
    </button>
  );
}
