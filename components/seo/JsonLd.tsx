'use client';

import Script from 'next/script';

interface JsonLdProps {
  data: object | object[];
}

/**
 * Component to render JSON-LD structured data
 * Use this in page components to add schema.org structured data
 */
export function JsonLd({ data }: JsonLdProps) {
  const jsonLd = Array.isArray(data) ? data : [data];

  return (
    <>
      {jsonLd.map((item, index) => (
        <Script
          key={index}
          id={`json-ld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
          strategy="afterInteractive"
        />
      ))}
    </>
  );
}

/**
 * Server component version for JSON-LD
 * Use this in server components
 */
export function JsonLdScript({ data }: JsonLdProps) {
  const jsonLd = Array.isArray(data) ? data : [data];

  return (
    <>
      {jsonLd.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
