import { getAdminInvoicingBaseUrl } from '@/lib/invoicing/upstream';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pidReceipt: string }> },
) {
  try {
    const { pidReceipt } = await params;
    const accessToken = request.nextUrl.searchParams.get('accessToken') || '';

    const upstream = await fetch(
      `${getAdminInvoicingBaseUrl(request.url)}/api/invoicing/public/receipt/${encodeURIComponent(pidReceipt)}?accessToken=${encodeURIComponent(accessToken)}`,
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
      { statusx: 'ERROR', message: 'Failed to load receipt', error: error.message },
      { status: 500 },
    );
  }
}
