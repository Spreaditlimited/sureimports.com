import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.sureimports.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/auth/', '/private/'],
      },
      {
        userAgent: ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'ChatGPT-User'],
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/auth/', '/private/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
