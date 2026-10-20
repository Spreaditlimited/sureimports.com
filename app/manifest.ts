import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Sure Imports',
    short_name: 'Sure Imports',
    description: 'Source products, manage your orders and track your imports.',
    start_url: '/dashboard',
    scope: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#48439b',
    icons: [192, 512].map((size) => ({
      src: `/app-icons/icon-${size}.png`,
      sizes: `${size}x${size}`,
      type: 'image/png',
      purpose: 'any',
    })),
  };
}
