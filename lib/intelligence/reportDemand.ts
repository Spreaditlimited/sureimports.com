import { createHash } from 'crypto';

import { prisma } from '@/lib/prisma';

export type ReportDemandItem = {
  pidRequest: string;
  query: string;
  status: string;
  weeklyVotes: number;
  totalVotes: number;
  selectedWeek: string | null;
  publishedReportSlug: string | null;
};

function watDate(value = new Date()) {
  return new Date(value.getTime() + 60 * 60 * 1000);
}

export function reportDemandWeekKey(value = new Date()) {
  const date = watDate(value);
  const daysSinceMonday = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - daysSinceMonday);
  return date.toISOString().slice(0, 10);
}

export function previousReportDemandWeekKey(value = new Date()) {
  return reportDemandWeekKey(new Date(value.getTime() - 7 * 24 * 60 * 60 * 1000));
}

export function daysUntilDemandSelection(value = new Date()) {
  const date = watDate(value);
  const day = date.getUTCDay();
  const days = day === 0 ? 1 : 8 - day;
  return days;
}

export function normalizeReportDemandQuery(value: string) {
  const normalized = value
    .toLowerCase()
    .replace(/make[\s-]?up/g, 'makeup')
    .replace(/two[\s-]?piece/g, 'two piece')
    .replace(/&/g, ' and ')
    .replace(/[’']/g, '')
    .replace(/\b(i need|i want|looking for|searching for|find me|please|reliable|best|good)\b/g, ' ')
    .replace(/\b(vendors?|suppliers?|manufacturers?|factories|factory|wholesale|china|chinese)\b/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return normalized.slice(0, 180);
}

export function reportDemandVoterKey(email: string) {
  return createHash('sha256').update(email.trim().toLowerCase()).digest('hex');
}

export function reportDemandId(prefix: 'REQ' | 'VOTE' | 'SEARCH') {
  return `INT${prefix}${Date.now().toString(36).toUpperCase()}${Math.random()
    .toString(36)
    .slice(2, 9)
    .toUpperCase()}`;
}

export async function getTopReportDemand(limit = 10) {
  const weekKey = reportDemandWeekKey();
  const rows = await prisma.$queryRaw<
    Array<{
      pidRequest: string;
      query: string;
      status: string;
      weeklyVotes: bigint | number;
      totalVotes: number;
      selectedWeek: string | null;
      publishedReportSlug: string | null;
    }>
  >`
    SELECT
      r.pidRequest,
      r.query,
      CASE
        WHEN r.publishedReportSlug IS NOT NULL THEN 'published'
        WHEN sr.status IN ('running', 'awaiting_approval', 'approved') THEN 'researching'
        ELSE r.status
      END AS status,
      COUNT(v.id) AS weeklyVotes,
      r.voteCount AS totalVotes,
      r.selectedWeek,
      r.publishedReportSlug
    FROM intelligence_report_requests r
    LEFT JOIN intelligence_report_request_votes v
      ON v.requestId = r.pidRequest AND v.weekKey = ${weekKey}
    LEFT JOIN intelligence_search_requests sr
      ON sr.pidSearch = r.queueSearchRequestId
    WHERE r.status <> 'archived'
    GROUP BY
      r.pidRequest,
      r.query,
      r.status,
      sr.status,
      r.voteCount,
      r.selectedWeek,
      r.publishedReportSlug
    ORDER BY weeklyVotes DESC, r.voteCount DESC, r.updatedAt DESC
    LIMIT ${Math.min(20, Math.max(1, limit))}
  `;

  return rows.map(
    (row): ReportDemandItem => ({
      ...row,
      weeklyVotes: Number(row.weeklyVotes || 0),
      totalVotes: Number(row.totalVotes || 0),
    }),
  );
}
