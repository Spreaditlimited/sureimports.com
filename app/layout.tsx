import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/app/context/AuthContext';
import { Suspense } from 'react';
import { FacebookPixel } from '@/components/FacebookPixel';
import { Analytics } from '@/components/GoogleAnalytics';
import GoogleTag from '@/components/GoogleTag';
import Loading from './dashboard/loading';
import LiveChat from '@/components/LiveChat';
import { checkAuth } from '@/lib/auth/checkAuth';
import { getUser } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

let titlex = 'Import from China';
let descriptionx =
  'Import from China. We guarantee the quality and accuracy of every product we source for you from China.';

  
export const metadata: Metadata = {
  title: titlex,
  description: descriptionx,
  openGraph: {
    title: titlex,
    description: descriptionx,
    images: [
      {
        url: 'https://www.sureimports.com/images/svg-logo-white.svg',
        width: 1200,
        height: 630,
        alt: 'Sure Imports',
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en">
        <head>
          <link rel="icon" type="image/png" href="/favico.png" />
          {/* Google Tag Manager Script */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-PT46CZ69');
            `,
            }}
          />
          {/* Google tag (gtag.js) */}
          <script async src="https://www.googletagmanager.com/gtag/js?id=AW-998486805"></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-998486805');
            `,
            }}
          />
        </head>

        <AuthProvider>
          <body className={`${inter.className} 'hide-scrollbar'`}>
            <Suspense fallback={<Loading />}>
              {/* Google Tag Manager (noscript) */}
              <noscript>
                <iframe
                  src="https://www.googletagmanager.com/ns.html?id=GTM-PT46CZ69"
                  height="0"
                  width="0"
                  style={{ display: 'none', visibility: 'hidden' }}
                />
              </noscript>

              {children}

              <LiveChat />
              <script src="https://checkout.flutterwave.com/v3.js"></script>
              <FacebookPixel />
              <Analytics />
              <GoogleTag />
              <Toaster />
            </Suspense>
          </body>
        </AuthProvider>
      </html>
    </>
  );
}
