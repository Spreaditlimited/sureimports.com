/** @type {import('next').NextConfig} */
const nextConfig = {
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
