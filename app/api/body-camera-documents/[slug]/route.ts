import { NextResponse } from 'next/server';
import { downloadCloudinaryPdf } from '@/lib/cloudinary/download';
import { bodyCameraDocumentBySlug } from '@/lib/bodyCameraSolutions/documents';

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params;
  const document = bodyCameraDocumentBySlug.get(slug);

  if (!document) {
    return NextResponse.json(
      { message: 'Document not found.' },
      { status: 404 },
    );
  }

  try {
    const pdf = await downloadCloudinaryPdf(document.cloudinaryPublicId);

    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${document.filename}"`,
        'Content-Length': String(pdf.length),
        'Cache-Control':
          'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
        'X-Content-Type-Options': 'nosniff',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    });
  } catch (error) {
    console.error('Unable to download body-camera document:', error);
    return NextResponse.json(
      { message: 'The document is temporarily unavailable.' },
      { status: 502 },
    );
  }
}
