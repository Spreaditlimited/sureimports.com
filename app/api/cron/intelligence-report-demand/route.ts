import { NextRequest, NextResponse } from 'next/server';

import xMail from '@/lib/email/xMail2';
import {
  normalizeReportDemandQuery,
  previousReportDemandWeekKey,
  reportDemandId,
} from '@/lib/intelligence/reportDemand';
import { getPublishedReports } from '@/lib/intelligence/reports';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

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

function reportMatchScore(query: string, reportText: string) {
  const terms = normalizeReportDemandQuery(query)
    .split(' ')
    .filter((term) => term.length > 1);
  const normalizedReport = normalizeReportDemandQuery(reportText);
  if (!terms.length) return 0;
  return terms.filter((term) => normalizedReport.includes(term)).length / terms.length;
}

async function reconcilePublishedRequests() {
  const [requests, reports] = await Promise.all([
    prisma.$queryRaw<
      Array<{ pidRequest: string; query: string }>
    >`
      SELECT pidRequest, query
      FROM intelligence_report_requests
      WHERE status <> 'published' AND publishedReportSlug IS NULL
    `,
    getPublishedReports(),
  ]);
  let matched = 0;

  for (const reportRequest of requests) {
    const report = reports
      .map((item) => ({
        item,
        score: reportMatchScore(
          reportRequest.query,
          [item.slug, item.title, item.subtitle, item.description]
            .filter(Boolean)
            .join(' '),
        ),
      }))
      .filter((item) => item.score >= 0.75)
      .sort((a, b) => b.score - a.score)[0]?.item;
    if (!report) continue;

    const voters = await prisma.$queryRaw<Array<{ email: string }>>`
      SELECT DISTINCT email
      FROM intelligence_report_request_votes
      WHERE requestId = ${reportRequest.pidRequest}
    `;
    await prisma.$executeRaw`
      UPDATE intelligence_report_requests
      SET
        status = 'published',
        publishedReportSlug = ${report.slug},
        updatedAt = ${new Date()}
      WHERE pidRequest = ${reportRequest.pidRequest}
    `;
    matched += 1;

    await Promise.all(
      voters.map(({ email }) =>
        xMail({
          xEmail: email,
          xTitle: `${reportRequest.query} report is now available`,
          xBodyTitle: 'Your requested report has been published',
          xBody1: `You voted for <b>${escapeHtml(reportRequest.query)}</b> on the Sure Imports Research Radar. The report has now passed review and is ready.`,
          xBody2:
            'Open the product page to see the edition details, manufacturer count and what the report covers before purchasing.',
          xButtonTitle: 'View the report',
          xButtonLink: `https://www.sureimports.com/supplier-intelligence/reports/${report.slug}`,
        }),
      ),
    );
  }
  return matched;
}

export async function GET(request: NextRequest) {
  if (request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const publishedMatches = await reconcilePublishedRequests();
    const weekKey = previousReportDemandWeekKey();
    const topRequests = await prisma.$queryRaw<
      Array<{
        pidRequest: string;
        query: string;
        weeklyVotes: bigint | number;
        totalVotes: number;
      }>
    >`
      SELECT
        r.pidRequest,
        r.query,
        COUNT(v.id) AS weeklyVotes,
        r.voteCount AS totalVotes
      FROM intelligence_report_requests r
      INNER JOIN intelligence_report_request_votes v
        ON v.requestId = r.pidRequest AND v.weekKey = ${weekKey}
      WHERE
        r.status = 'requested'
        AND r.queueSearchRequestId IS NULL
        AND r.publishedReportSlug IS NULL
      GROUP BY r.pidRequest, r.query, r.voteCount, r.createdAt
      HAVING weeklyVotes > 0
      ORDER BY weeklyVotes DESC, r.voteCount DESC, r.createdAt ASC
      LIMIT 10
    `;

    const selected = [];
    for (const [index, item] of topRequests.entries()) {
      const pidSearch = reportDemandId('SEARCH');
      const weeklyVotes = Number(item.weeklyVotes || 0);
      await prisma.$executeRaw`
        INSERT INTO intelligence_search_requests (
          pidSearch,
          pidUser,
          email,
          query,
          targetSupplierCount,
          notes,
          status,
          creditCost,
          creditReserved,
          relatedPidJob,
          adminNotes,
          progressStage,
          progressPercent,
          creditSource,
          createdAt,
          updatedAt
        ) VALUES (
          ${pidSearch},
          'MARKET_DEMAND',
          'hello@sureimports.com',
          ${item.query},
          10,
          ${`Ranked #${index + 1} on the public Supplier Intelligence Research Radar for the week of ${weekKey}, with ${weeklyVotes} buyer vote${weeklyVotes === 1 ? '' : 's'}. Research 10 high-confidence direct manufacturers for a paid PDF report. Apply the established report quality, contact-attribution and category-specific evidence rules.`},
          'awaiting_admin',
          0,
          false,
          NULL,
          ${`Market report demand request ${item.pidRequest}`},
          'Selected from weekly report demand',
          0,
          'market_demand',
          ${new Date()},
          ${new Date()}
        )
      `;
      await prisma.$executeRaw`
        UPDATE intelligence_report_requests
        SET
          status = 'shortlisted',
          selectedWeek = ${weekKey},
          queueSearchRequestId = ${pidSearch},
          updatedAt = ${new Date()}
        WHERE pidRequest = ${item.pidRequest}
      `;
      selected.push({
        rank: index + 1,
        query: item.query,
        weeklyVotes,
        totalVotes: Number(item.totalVotes || 0),
        pidSearch,
      });
    }

    if (selected.length) {
      const rows = selected
        .map(
          (item) =>
            `<tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">#${item.rank}</td><td style="padding:8px;border-bottom:1px solid #e2e8f0"><b>${escapeHtml(item.query)}</b></td><td style="padding:8px;border-bottom:1px solid #e2e8f0">${item.weeklyVotes}</td></tr>`,
        )
        .join('');
      await xMail({
        xEmail: 'hello@sureimports.com',
        xTitle: `Weekly Research Radar: ${selected.length} reports selected`,
        xBodyTitle: 'Buyer demand has selected this week’s research queue',
        xBody1: `<table style="width:100%;border-collapse:collapse"><thead><tr><th style="padding:8px;text-align:left">Rank</th><th style="padding:8px;text-align:left">Requested report</th><th style="padding:8px;text-align:left">Votes</th></tr></thead><tbody>${rows}</tbody></table>`,
        xBody2:
          'These requests now appear inside the existing Supplier Intelligence research queue. Generate and review each draft using the established 10-manufacturer PDF standard.',
        xButtonTitle: 'Open the research queue',
        xButtonLink:
          'https://admin.sureimports.com/dashboard/intelligence/research',
      });
    }

    return NextResponse.json({
      success: true,
      weekKey,
      selected,
      publishedMatches,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unable to process weekly report demand.',
      },
      { status: 500 },
    );
  }
}
