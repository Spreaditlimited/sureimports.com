/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
      return [
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
  
    eslint: {
        ignoreDuringBuilds: true,
      },
    experimental: {
      serverActions: {
        bodySizeLimit: '55mb',
      },
    },
    images: {
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
