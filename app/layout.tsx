import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { AuthProvider } from '@/app/context/AuthContext';
import { Suspense } from 'react';
import { FacebookPixel } from '@/components/FacebookPixel';
import { Analytics } from '@/components/GoogleAnalytics';
import LeadCapturePopup from '@/components/lead-capture/LeadCapturePopup';
import Loading from './dashboard/loading';
import LiveChat from '@/components/LiveChat';
import { JsonLdScript } from '@/components/seo/JsonLd';
import {
  organizationSchema,
  websiteSchema,
  serviceSchema,
} from '@/lib/seo/schema';

const inter = Inter({ subsets: ['latin'] });

const baseUrl = 'https://www.sureimports.com';
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-PT46CZ69';
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || 'AW-998486805';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Sure Imports - Import from China with Confidence',
    template: '%s | Sure Imports',
  },
  description:
    'Import quality products from China with confidence. Sure Imports guarantees quality, authenticity, and reliable shipping for all your import needs.',
  keywords: [
    'import from china',
    'china imports',
    'product sourcing',
    'china supplier',
    'import products',
    'wholesale from china',
    'china procurement',
    'import services',
    'china shipping',
    'quality imports',
    'nigeria imports',
    'africa imports',
  ],
  authors: [{ name: 'Sure Imports', url: baseUrl }],
  creator: 'Sure Imports',
  publisher: 'Sure Imports',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'Sure Imports',
    title: 'Sure Imports - Import from China with Confidence',
    description:
      'Import quality products from China with confidence. We guarantee quality, authenticity, and reliable shipping.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sure Imports - Import from China',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sure Imports - Import from China with Confidence',
    description:
      'Import quality products from China. Quality guaranteed, reliable shipping.',
    images: ['/images/og-image.png'],
    creator: '@sureimports',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: baseUrl,
  },
  verification: {
    // Add your verification codes here
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  category: 'business',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" type="image/png" href="/favico.png" />
        </head>

        <AuthProvider>
          <body className={`${inter.className} 'hide-scrollbar'`}>
            <Suspense fallback={<Loading />}>
              {/* Google Tag Manager (noscript) */}
              <noscript>
                <iframe
                  src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                  height="0"
                  width="0"
                  style={{ display: 'none', visibility: 'hidden' }}
                />
              </noscript>

              <Script
                id="gtm"
                strategy="lazyOnload"
                dangerouslySetInnerHTML={{
                  __html: `
                    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','${GTM_ID}');
                  `,
                }}
              />
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
                strategy="lazyOnload"
              />
              <Script
                id="google-ads-init"
                strategy="lazyOnload"
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GOOGLE_ADS_ID}');
                  `,
                }}
              />

              {/* JSON-LD Structured Data */}
              <JsonLdScript
                data={[organizationSchema, websiteSchema, serviceSchema]}
              />

              {children}

              <LeadCapturePopup />
              <LiveChat />
              <Script
                src="https://checkout.flutterwave.com/v3.js"
                strategy="lazyOnload"
              />
              <FacebookPixel />
              <Analytics />
              <Toaster />
              <SonnerToaster position="top-right" richColors />
            </Suspense>
          </body>
        </AuthProvider>
      </html>
    </>
  );
}
