import { NextRequest, NextResponse } from 'next/server';

const ADMIN_BASE_URL =
  process.env.ADMIN_INVOICING_API_BASE_URL || 'https://admin.sureimports.com';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ accessToken: string }> },
) {
  try {
    const { accessToken } = await params;
    const upstream = await fetch(
      `${ADMIN_BASE_URL}/api/invoicing/public/invoice/${encodeURIComponent(accessToken)}`,
      {
        method: 'GET',
        cache: 'no-store',
      },
    );

    const body = await upstream.text();
    return new NextResponse(body, {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return NextResponse.json(
      { statusx: 'ERROR', message: 'Failed to load invoice', error: error.message },
      { status: 500 },
    );
  }
}

