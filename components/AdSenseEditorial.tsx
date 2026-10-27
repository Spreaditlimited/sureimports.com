import Script from 'next/script';

/** Loads the account's published consent message on editorial/policy pages. */
export default function AdSenseEditorial() {
  return (
    <Script
      id="sureimports-adsense"
      async
      crossOrigin="anonymous"
      strategy="afterInteractive"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5096489822053301"
    />
  );
}
