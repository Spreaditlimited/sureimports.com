'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { useOptionalConsent } from '@/lib/marketing/useOptionalConsent';

export default function GoogleMarketingTags({
  gtmId,
  adsId,
}: {
  gtmId: string;
  adsId: string;
}) {
  const consent = useOptionalConsent();
  useEffect(() => {
    const target = window as typeof window & {
      dataLayer?: unknown[];
      gtag?: (...args: unknown[]) => void;
    };
    target.dataLayer ||= [];
    target.gtag ||= function () {
      target.dataLayer!.push(arguments);
    };
    target.gtag('consent', 'update', {
      ad_storage: consent ? 'granted' : 'denied',
      analytics_storage: consent ? 'granted' : 'denied',
      ad_user_data: consent ? 'granted' : 'denied',
      ad_personalization: consent ? 'granted' : 'denied',
    });
  }, [consent]);

  if (!consent) return null;
  return (
    <>
      <Script
        id="gtm"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
      var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
      j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer',${JSON.stringify(gtmId)});`,
        }}
      />
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${adsId}`}
        strategy="lazyOnload"
      />
      <Script
        id="google-ads-init"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
      window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){dataLayer.push(arguments);};
      gtag('js',new Date());gtag('config',${JSON.stringify(adsId)});`,
        }}
      />
    </>
  );
}
