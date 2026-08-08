import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import xMail from '@/lib/email/xMail2';
import {
  getTopReportDemand,
  normalizeReportDemandQuery,
  reportDemandId,
  reportDemandVoterKey,
  reportDemandWeekKey,
} from '@/lib/intelligence/reportDemand';
import { getPublishedReports } from '@/lib/intelligence/reports';
import { getReportSeo } from '@/lib/intelligence/reportSeo';
import { verifyToken } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function clean(value: unknown, max = 180) {
  return String(value || '')
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, max);
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;',
      })[character] || character,
  );
}

async function sessionEmail() {
  const token = (await cookies()).get('token')?.value;
  const payload = token ? (verifyToken(token) as any) : null;
  return clean(payload?.userEmail, 255).toLowerCase();
}

async function findMatchingPublishedReport(query: string) {
  const normalized = normalizeReportDemandQuery(query);
  const terms = normalized.split(' ').filter((term) => term.length > 1);
  if (!terms.length) return null;
  const reports = await getPublishedReports();

  const matches = reports
    .map((report) => {
      const seo = getReportSeo(report.slug, report.supplierCount);
      const text = normalizeReportDemandQuery(
        [
          report.slug,
          report.title,
          report.subtitle,
          report.description,
          seo?.primaryKeyword,
          ...(seo?.secondaryKeywords || []),
          ...(seo?.products || []),
        ]
          .filter(Boolean)
          .join(' '),
      );
      const matchedTerms = terms.filter((term) => text.includes(term)).length;
      return { report, score: matchedTerms / terms.length };
    })
    .filter((item) => item.score >= 0.75)
    .sort((a, b) => b.score - a.score);

  const match = matches[0]?.report;
  return match
    ? {
        slug: match.slug,
        title: match.title,
        supplierCount: match.supplierCount,
      }
    : null;
}

export async function GET() {
  try {
    const data = await getTopReportDemand(10);
    return NextResponse.json({
      success: true,
      data,
      weekKey: reportDemandWeekKey(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unable to load report requests.',
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    if (clean(body.companyWebsite, 200)) {
      return NextResponse.json({ success: true, duplicate: false });
    }

    const pidRequest = clean(body.pidRequest, 80);
    const submittedQuery = clean(body.query, 180);
    const email = (clean(body.email, 255).toLowerCase() ||
      (await sessionEmail())) as string;
    if (!validEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Enter a valid email address to vote.' },
        { status: 400 },
      );
    }

    let query = submittedQuery;
    let normalizedQuery = normalizeReportDemandQuery(query);
    if (pidRequest) {
      const rows = await prisma.$queryRaw<
        Array<{
          query: string;
          normalizedQuery: string;
          publishedReportSlug: string | null;
        }>
      >`
        SELECT query, normalizedQuery, publishedReportSlug
        FROM intelligence_report_requests
        WHERE pidRequest = ${pidRequest}
        LIMIT 1
      `;
      const existing = rows[0];
      if (!existing) {
        return NextResponse.json(
          { success: false, error: 'This report request was not found.' },
          { status: 404 },
        );
      }
      if (existing.publishedReportSlug) {
        return NextResponse.json({
          success: true,
          availableReport: {
            slug: existing.publishedReportSlug,
            title: existing.query,
          },
        });
      }
      query = existing.query;
      normalizedQuery = existing.normalizedQuery;
    }

    if (query.length < 3 || normalizedQuery.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Describe the product report you want.' },
        { status: 400 },
      );
    }

    if (!pidRequest) {
      const availableReport = await findMatchingPublishedReport(query);
      if (availableReport) {
        return NextResponse.json({ success: true, availableReport });
      }
    }

    const weekKey = reportDemandWeekKey();
    const voterKey = reportDemandVoterKey(email);
    const voteRows = await prisma.$queryRaw<Array<{ count: bigint | number }>>`
      SELECT COUNT(*) AS count
      FROM intelligence_report_request_votes
      WHERE voterKey = ${voterKey} AND weekKey = ${weekKey}
    `;
    if (Number(voteRows[0]?.count || 0) >= 12) {
      return NextResponse.json(
        {
          success: false,
          error:
            'You have reached the weekly voting limit. New voting opens on Monday.',
        },
        { status: 429 },
      );
    }

    const requestId = pidRequest || reportDemandId('REQ');
    if (!pidRequest) {
      await prisma.$executeRaw`
        INSERT IGNORE INTO intelligence_report_requests (
          pidRequest, query, normalizedQuery, status, voteCount, createdAt, updatedAt
        ) VALUES (
          ${requestId}, ${query}, ${normalizedQuery}, 'requested', 0, ${new Date()}, ${new Date()}
        )
      `;
    }

    const requestRows = pidRequest
      ? await prisma.$queryRaw<
          Array<{ pidRequest: string; query: string; voteCount: number }>
        >`
          SELECT pidRequest, query, voteCount
          FROM intelligence_report_requests
          WHERE pidRequest = ${pidRequest}
          LIMIT 1
        `
      : await prisma.$queryRaw<
          Array<{ pidRequest: string; query: string; voteCount: number }>
        >`
          SELECT pidRequest, query, voteCount
          FROM intelligence_report_requests
          WHERE normalizedQuery = ${normalizedQuery}
          LIMIT 1
        `;
    const reportRequest = requestRows[0];
    if (!reportRequest) throw new Error('Unable to create the report request.');

    const inserted = await prisma.$executeRaw`
      INSERT IGNORE INTO intelligence_report_request_votes (
        pidVote, requestId, email, voterKey, weekKey, createdAt
      ) VALUES (
        ${reportDemandId('VOTE')}, ${reportRequest.pidRequest}, ${email},
        ${voterKey}, ${weekKey}, ${new Date()}
      )
    `;
    if (inserted > 0) {
      await prisma.$executeRaw`
        UPDATE intelligence_report_requests
        SET voteCount = voteCount + 1, updatedAt = ${new Date()}
        WHERE pidRequest = ${reportRequest.pidRequest}
      `;
    }

    if (!pidRequest && inserted > 0 && reportRequest.voteCount === 0) {
      await xMail({
        xEmail: email,
        xTitle: `Your report request is on the Research Radar`,
        xBodyTitle: 'Your vote has been counted',
        xBody1: `You asked Sure Imports to research <b>${escapeHtml(reportRequest.query)}</b>. It is now on the weekly Research Radar, where buyer demand decides what we produce next.`,
        xBody2:
          'Every Monday, the highest-ranked requests move into our manufacturer research and review queue. We will keep your email attached privately so we can let you know when the report is published.',
        xButtonTitle: 'View the Research Radar',
        xButtonLink:
          'https://www.sureimports.com/supplier-intelligence/reports#research-radar',
      });
    }

    return NextResponse.json({
      success: true,
      duplicate: inserted === 0,
      request: {
        pidRequest: reportRequest.pidRequest,
        query: reportRequest.query,
        weeklyVoteAdded: inserted > 0,
      },
      data: await getTopReportDemand(10),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unable to record your report request.',
      },
      { status: 500 },
    );
  }
}
