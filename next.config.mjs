/** @type {import('next').NextConfig} */
const nextConfig = {
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
