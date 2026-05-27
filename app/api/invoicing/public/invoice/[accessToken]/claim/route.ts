import { NextRequest, NextResponse } from 'next/server';

const ADMIN_BASE_URL =
  process.env.ADMIN_INVOICING_API_BASE_URL || 'https://admin.sureimports.com';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ accessToken: string }> },
) {
  try {
    const { accessToken } = await params;
    const payload = await request.json();
    const selectedBankAccountId = String(payload?.selectedBankAccountId || '').trim();

    if (!selectedBankAccountId) {
      return NextResponse.json(
        {
          statusx: 'ERROR',
          message:
            'Please select the bank account you paid into before confirming payment.',
        },
        { status: 400 },
      );
    }

    const upstream = await fetch(
      `${ADMIN_BASE_URL}/api/invoicing/public/invoice/${encodeURIComponent(accessToken)}/claim`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          selectedBankAccountId,
        }),
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
      { statusx: 'ERROR', message: 'Failed to submit payment claim', error: error.message },
      { status: 500 },
    );
  }
}
