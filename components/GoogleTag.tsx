// components/GoogleTag.tsx
'use client';
import Script from 'next/script';

const googleTagID = process.env.NEXT_PUBLIC_GOOGLE_TAG_ID;

const GoogleTag = () => {
  // Don't render if no Google Tag ID is configured
  if (!googleTagID) {
    return null;
  }

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
            gtag('config', '${googleTagID}');
          `,
        }}
      />
    </>
  );
};

export default GoogleTag;
