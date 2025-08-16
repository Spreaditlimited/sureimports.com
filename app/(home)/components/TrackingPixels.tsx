'use client';
import Script from 'next/script';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const FB_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '1080444112537852';
const TT_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || 'CUGVPGRC77U7F7KCBAEG';
const GA_ID = process.env.NEXT_PUBLIC_GA4_ID || 'G-CMGHVCHW1D';

export function TrackingPixels() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Send GA4 page_view on client-side route changes (and initial load)
  useEffect(() => {
    if (!(window as any).gtag || !GA_ID) return;
    const query = searchParams?.toString();
    const page_location = `${window.location.origin}${pathname}${query ? `?${query}` : ''}`;
    (window as any).gtag('event', 'page_view', {
      page_title: document.title,
      page_location,
      page_path: pathname,
      send_to: GA_ID,
    });
  }, [pathname, searchParams]);

  return (
    <>
      {/* Facebook Pixel */}
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s){
              if(f.fbq)return;
              n=f.fbq=function(){
                n.callMethod ? n.callMethod.apply(n,arguments) : n.queue.push(arguments)
              };
              if(!f._fbq)f._fbq=n;
              n.push=n; n.loaded=!0; n.version='2.0';
              n.queue=[];
              t=b.createElement(e); t.async=!0; t.src=v;
              s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s);
            }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init','${FB_ID}');
            fbq('track','PageView');
          `,
        }}
      />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${FB_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>

      {/* TikTok Pixel */}
      <Script
        id="tt-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function (w, d, t) {
              var ttq = w.ttq = w.ttq || [];
              ttq.methods = ["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];
              ttq.setAndDefer = function (obj, method) {
                obj[method] = function () { obj.push([method].concat([].slice.call(arguments,0))) }
              };
              for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
              ttq.load = function (id, config) {
                var script = d.createElement("script");
                script.type = "text/javascript"; script.async = true;
                script.src = "https://analytics.tiktok.com/i18n/pixel/events.js";
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
