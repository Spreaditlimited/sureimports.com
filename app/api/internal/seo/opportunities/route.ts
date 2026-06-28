import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

import { ensureSearchConsoleTables } from '@/lib/search-console';
import { prisma } from '@/lib/prisma';

function isAuthorized(request: NextRequest) {
  const expected = process.env.SEO_INTERNAL_API_SECRET || process.env.CRON_SECRET;
  if (!expected) return false;
  return request.headers.get('authorization') === `Bearer ${expected}`;
}

function clean(value: unknown, max = 1000) {
  return String(value || '').trim().slice(0, max);
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  await ensureSearchConsoleTables();

  const params = request.nextUrl.searchParams;
  const status = clean(params.get('status') || 'open', 40);
  const opportunityType = clean(params.get('type'), 80);
  const limit = Math.min(100, Math.max(1, Number(params.get('limit') || 50)));

  const rows = await prisma.$queryRaw<
    Array<{
      pidOpportunity: string;
      pageUrl: string;
      blogSlug: string | null;
      opportunityType: string;
      primaryQuery: string | null;
      clicks: number;
      impressions: number;
      ctr: any;
      position: any;
      confidence: any;
      status: string;
      recommendation: string | null;
      recommendedCta: string | null;
      sourceStartDate: Date | null;
      sourceEndDate: Date | null;
      createdAt: Date | null;
      updatedAt: Date | null;
    }>
  >(
    Prisma.sql`
      SELECT
        pidOpportunity,
        pageUrl,
        blogSlug,
        opportunityType,
        primaryQuery,
        clicks,
        impressions,
        ctr,
        position,
        confidence,
        status,
        recommendation,
        recommendedCta,
        sourceStartDate,
        sourceEndDate,
        createdAt,
        updatedAt
      FROM seo_opportunities
      WHERE status = ${status}
        AND (${opportunityType || null} IS NULL OR opportunityType = ${opportunityType || null})
      ORDER BY confidence DESC, impressions DESC, createdAt DESC
      LIMIT ${limit}
    `,
  );

  return NextResponse.json({
    ok: true,
    opportunities: rows.map((row) => ({
      ...row,
      ctr: Number(row.ctr || 0),
      position: Number(row.position || 0),
      confidence: Number(row.confidence || 0),
    })),
  });
}
