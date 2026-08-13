import { buildBlogRss } from '@/lib/blogRss';

export const dynamic = 'force-dynamic';

export async function GET() {
  const xml = await buildBlogRss();

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
