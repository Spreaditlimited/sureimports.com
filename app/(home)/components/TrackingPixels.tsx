'use client';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useOptionalConsent } from '@/lib/marketing/useOptionalConsent';

const TT_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || 'CUGVPGRC77U7F7KCBAEG';
const GA_ID = process.env.NEXT_PUBLIC_GA4_ID || 'G-CMGHVCHW1D';

export function TrackingPixels() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const consent = useOptionalConsent();
  const [gaReady, setGaReady] = useState(false);

  useEffect(() => {
    const ttq = (
      window as typeof window & {
        ttq?: { disableCookie?: () => void; enableCookie?: () => void };
      }
    ).ttq;
    if (consent) ttq?.enableCookie?.();
    else ttq?.disableCookie?.();
  }, [consent]);

  // Send GA4 page_view on client-side route changes (and initial load)
  useEffect(() => {
    const gtag = (window as Window & { gtag?: Window['gtag'] }).gtag;
    if (!consent || !gaReady || !gtag || !GA_ID) return;
    const query = searchParams?.toString();
    const page_location = `${window.location.origin}${pathname}${query ? `?${query}` : ''}`;
    gtag('event', 'page_view', {
      page_title: document.title,
      page_location,
      page_path: pathname,
      send_to: GA_ID,
    });
  }, [pathname, searchParams, consent, gaReady]);

  if (!consent) return null;

  return (
    <>
      {/* TikTok Pixel */}
      <Script
        id="tt-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function (w, d, t) {
              w.TiktokAnalyticsObject = 'ttq';
              var ttq = w.ttq = w.ttq || [];
              ttq.methods = ["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];
              ttq.setAndDefer = function (obj, method) {
                obj[method] = function () { obj.push([method].concat([].slice.call(arguments,0))) }
              };
              for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
              ttq.load = function (id, config) {
                var script = d.createElement("script");
                script.type = "text/javascript"; script.async = true;
                script.src = "https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=" + encodeURIComponent(id) + "&lib=ttq";
                var firstScript = d.getElementsByTagName("script")[0];
                firstScript.parentNode.insertBefore(script, firstScript);
                ttq._i = ttq._i || {}; ttq._i[id] = [];
                ttq._i[id]._u = "https://analytics.tiktok.com";
                ttq._t = ttq._t || {}; ttq._t[id] = +new Date();
                ttq._o = ttq._o || {}; ttq._o[id] = config || {};
              };
              ttq.load('${TT_ID}');
              ttq.page();
            }(window, document, 'script');
          `,
        }}
      />

      {/* Google Analytics 4 */}
      <Script
        id="ga4-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script
        id="ga4-init"
        strategy="afterInteractive"
        onReady={() => setGaReady(true)}
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            // Disable automatic page_view so we can track SPA navigations manually
            gtag('config', '${GA_ID}', { send_page_view: false });
          `,
        }}
      />
    </>
  );
}
