// components/GoogleTag.tsx
'use client';
import Script from 'next/script';

const googleTagID = process.env.GOOGLE_TAG_ID;

const GoogleTag = () => {
  return (
    <>
      {/* Google Tag Manager */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${googleTagID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', ${googleTagID});
          `,
        }}
      />
    </>
  );
};

export default GoogleTag;
