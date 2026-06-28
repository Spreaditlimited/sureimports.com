import { NextRequest, NextResponse } from 'next/server';

import { importSearchConsolePerformance } from '@/lib/search-console';

function isAuthorized(request: NextRequest) {
  const expected =
    process.env.GOOGLE_SEARCH_CONSOLE_CRON_SECRET || process.env.CRON_SECRET;
  if (!expected) return false;
  return request.headers.get('authorization') === `Bearer ${expected}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const params = request.nextUrl.searchParams;

  try {
    const result = await importSearchConsolePerformance({
      startDate: params.get('startDate') || undefined,
      endDate: params.get('endDate') || undefined,
      days: params.get('days') ? Number(params.get('days')) : undefined,
      siteUrl: params.get('siteUrl') || undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Search Console import failed', error);
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : 'Search Console import failed.',
      },
      { status: 500 },
    );
  }
}
