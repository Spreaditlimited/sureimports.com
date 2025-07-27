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
        domains: ['b.io', 'cdn.builder.io'],
    },
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'pub-0ae42e0c83e848408ac329e6ca048bc2.r2.dev',
            port: '',
            pathname: '/**',
          },
        ],
      },
};

export default nextConfig;
