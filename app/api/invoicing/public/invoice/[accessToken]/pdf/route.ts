import { NextRequest, NextResponse } from 'next/server';

const ADMIN_BASE_URL =
  process.env.ADMIN_INVOICING_API_BASE_URL || 'https://admin.sureimports.com';

export const runtime = 'nodejs';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ accessToken: string }> },
) {
  try {
    const { accessToken } = await params;
    const upstream = await fetch(
      `${ADMIN_BASE_URL}/api/invoicing/public/invoice/${encodeURIComponent(accessToken)}/pdf`,
      {
        method: 'GET',
        cache: 'no-store',
      },
    );

    const body = await upstream.arrayBuffer();
    const headers = new Headers({
      'Cache-Control': 'private, no-store',
      'Content-Type': upstream.headers.get('content-type') || 'application/octet-stream',
    });
    const contentDisposition = upstream.headers.get('content-disposition');
    if (contentDisposition) headers.set('Content-Disposition', contentDisposition);

    return new NextResponse(body, {
      status: upstream.status,
      headers,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        statusx: 'ERROR',
        message: 'Failed to download invoice PDF',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
