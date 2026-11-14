import { getCloudinary } from '@/lib/cloudinary/config';
import { freeCatalogBySlug } from '@/lib/intelligence/freeCatalogs';

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params;
  const catalog = freeCatalogBySlug.get(slug);
  if (!catalog) return new Response('Catalog not found.', { status: 404 });

  const signedUrl = getCloudinary().utils.private_download_url(
    catalog.cloudinaryPublicId,
    '',
    {
      resource_type: 'raw',
      type: 'upload',
      expires_at: Math.floor(Date.now() / 1000) + 300,
      attachment: true,
    },
  );

  return new Response(null, {
    status: 302,
    headers: {
      Location: signedUrl,
      'Cache-Control': 'private, no-store',
      'Referrer-Policy': 'no-referrer',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
