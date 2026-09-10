'use client';

import { useEffect } from 'react';

export const AffiliateTracker = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const affiliateCode = urlParams.get('ref') || urlParams.get('affRef');

    if (!affiliateCode) return;

    let source = urlParams.get('utm_source') || '';
    if (!source && document.referrer) {
      try {
        source = new URL(document.referrer).hostname;
      } catch {
        source = '';
      }
    }

    void fetch('/api/affiliate/track', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: affiliateCode,
        landingPath: window.location.pathname,
        source,
      }),
    }).finally(() => {
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete('ref');
      cleanUrl.searchParams.delete('affRef');
      window.history.replaceState(
        window.history.state,
        '',
        `${cleanUrl.pathname}${cleanUrl.search}${cleanUrl.hash}`,
      );
    });
  }, []);

  return null;
};
