import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

import { ensureSearchConsoleTables } from '@/lib/search-console';
import { prisma } from '@/lib/prisma';

function isAuthorized(request: NextRequest) {
  const expected = process.env.SEO_INTERNAL_API_SECRET || process.env.CRON_SECRET;
  return Boolean(expected) && request.headers.get('authorization') === `Bearer ${expected}`;
}

function productSlug(pageUrl: string) {
  try {
    const parts = new URL(pageUrl).pathname.split('/').filter(Boolean);
    const whiteLabelIndex = parts.indexOf('white-label');
    return whiteLabelIndex >= 0 ? String(parts[whiteLabelIndex + 1] || '') : '';
  } catch {
    return '';
  }
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  await ensureSearchConsoleTables();
  const days = Math.max(7, Math.min(365, Number(request.nextUrl.searchParams.get('days') || 120)));
  const limit = Math.max(1, Math.min(1500, Number(request.nextUrl.searchParams.get('limit') || 1000)));
  const startDate = new Date();
  startDate.setUTCDate(startDate.getUTCDate() - days);

  const rows = await prisma.$queryRaw<
    Array<{
      pageUrl: string;
      query: string;
      clicks: bigint | number;
      impressions: bigint | number;
      position: Prisma.Decimal | number | null;
    }>
  >(Prisma.sql`
    SELECT
      pageUrl,
      query,
      SUM(clicks) AS clicks,
      SUM(impressions) AS impressions,
      SUM(position * impressions) / NULLIF(SUM(impressions), 0) AS position
    FROM search_console_query_stats
    WHERE date >= ${startDate}
      AND pageUrl LIKE ${'%://linescout.sureimports.com/white-label/%'}
    GROUP BY pageUrl, query
    HAVING SUM(impressions) > 0
    ORDER BY impressions DESC, clicks DESC
    LIMIT ${Math.min(5000, limit * 10)}
  `);

  const byPage = new Map<
    string,
    {
      pageUrl: string;
      slug: string;
      clicks: number;
      impressions: number;
      weightedPosition: number;
      queries: Array<{ query: string; clicks: number; impressions: number; position: number }>;
    }
  >();
  for (const row of rows) {
    const slug = productSlug(row.pageUrl);
    if (!slug) continue;
    const clicks = Number(row.clicks || 0);
    const impressions = Number(row.impressions || 0);
    const position = Number(row.position || 0);
    const current = byPage.get(row.pageUrl) || {
      pageUrl: row.pageUrl,
      slug,
      clicks: 0,
      impressions: 0,
      weightedPosition: 0,
      queries: [],
    };
    current.clicks += clicks;
    current.impressions += impressions;
    current.weightedPosition += position * impressions;
    if (current.queries.length < 10) {
      current.queries.push({ query: row.query, clicks, impressions, position });
    }
    byPage.set(row.pageUrl, current);
  }

  const products = Array.from(byPage.values())
    .map((row) => ({
      pageUrl: row.pageUrl,
      slug: row.slug,
      clicks: row.clicks,
      impressions: row.impressions,
      position: row.impressions ? row.weightedPosition / row.impressions : 0,
      queries: row.queries,
    }))
    .sort((left, right) => right.impressions - left.impressions || right.clicks - left.clicks)
    .slice(0, limit);

  return NextResponse.json({ ok: true, days, products });
}
