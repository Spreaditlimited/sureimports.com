/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: ['192.168.1.173'],
    async headers() {
      return [{ source: '/support/embed', headers: [{ key: 'Content-Security-Policy', value: "frame-ancestors 'self' https://linescout.sureimports.com https://affiliate.sureimports.com https://partner.sureimports.com" }] }];
    },
    async redirects() {
      return [
        {
          source: '/faya',
          destination: 'https://myfaya.co.uk',
          permanent: true,
        },
        {
          source: '/faya-warranty-policy',
          destination: '/warranty-policy#faya-warranty',
          permanent: true,
        },
        {
          source: '/partners/:path*',
          destination: `${process.env.NODE_ENV === 'development' ? 'http://localhost:3003' : 'https://partner.sureimports.com'}/partners/:path*`,
          permanent: false,
        },
        {
          source: '/corporate-gifts',
          destination: '/corporate-sourcing',
          permanent: true,
        },
        {
          source: '/dashboard/corporate-gifts',
          destination: '/dashboard/corporate-sourcing',
          permanent: true,
        },
        {
          source: '/source-products-from-china',
          destination:
            'https://linescout.sureimports.com/sourcing-project?route_type=simple_sourcing',
          permanent: true,
        },
      ];
    },
    env: {
      NEXT_PUBLIC_GOOGLE_CAPTCHA_SITE_KEY:
        process.env.NEXT_PUBLIC_GOOGLE_CAPTCHA_SITE_KEY ||
        process.env.GOOGLE_CAPTCHA_SITE_KEY,
      NEXT_PUBLIC_GOOGLE_CLIENT_ID:
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID,
    },
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: true,
    },
  
    experimental: {
      // Avoid merging unrelated route styles into every public page.
      cssChunking: false,
      // Deliver styles with the first HTML response for mobile search visitors.
      // This removes the render-blocking CSS round trip; styles are no longer
      // cached separately on a full page load (Next.js inlineCss trade-off).
      inlineCss: true,
      serverActions: {
        bodySizeLimit: '55mb',
      },
    },
    images: {
        qualities: [75, 100],
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'res.cloudinary.com',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'b.io',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'cdn.builder.io',
            port: '',
            pathname: '/**',
          },
        ],
      },
};

export default nextConfig;
