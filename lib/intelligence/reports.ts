import { unstable_cache } from 'next/cache';

import { prisma } from '@/lib/prisma';
import publishedReportsSnapshot from '@/lib/intelligence/publishedReportsSnapshot.json';

export type PublicPublishedReport = {
  pidReport: string;
  nicheId: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  editionLabel: string;
  coverImageUrl: string | null;
  priceNaira: number;
  priceUsdCents: number;
  status: string;
  currentVersionId: string;
  supplierCount: number;
  publishedAt: string | null;
  updatedAt: string;
};

const RETRYABLE_PRISMA_CODES = new Set(['P1001', 'P1002', 'P1017', 'P2024']);

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function isRetryableDatabaseError(error: unknown) {
  const value = error as { code?: string; name?: string; message?: string };
  return (
    RETRYABLE_PRISMA_CODES.has(value?.code || '') ||
    value?.name === 'PrismaClientInitializationError' ||
    /can't reach database server|connection.*timed out|server has closed the connection/i.test(
      value?.message || '',
    )
  );
}

async function withDatabaseRetry<T>(operation: () => Promise<T>) {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (!isRetryableDatabaseError(error) || attempt === 2) throw error;
      await wait(250 * 2 ** attempt);
    }
  }
  throw lastError;
}

function serializePublishedReport(report: {
  pidReport: string;
  nicheId: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  editionLabel: string;
  coverImageUrl: string | null;
  priceNaira: number;
  priceUsdCents: number;
  status: string;
  currentVersionId: string | null;
  supplierCount: number;
  publishedAt: Date | null;
  updatedAt: Date;
}): PublicPublishedReport {
  return {
    ...report,
    currentVersionId: report.currentVersionId || '',
    publishedAt: report.publishedAt?.toISOString() || null,
    updatedAt: report.updatedAt.toISOString(),
  };
}

const fallbackPublishedReports =
  publishedReportsSnapshot as PublicPublishedReport[];

export function formatReportPrice(
  amountMinor: number,
  currency: 'NGN' | 'USD',
) {
  return new Intl.NumberFormat(currency === 'NGN' ? 'en-NG' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'NGN' ? 0 : 2,
  }).format(currency === 'NGN' ? amountMinor : amountMinor / 100);
}

export async function getPublishedReports() {
  return withDatabaseRetry(() =>
    prisma.intelligence_report_products.findMany({
      where: { status: 'published', currentVersionId: { not: null } },
      orderBy: [{ publishedAt: 'desc' }, { title: 'asc' }],
    }),
  );
}

const getCachedPublicPublishedReports = unstable_cache(
  async () => (await getPublishedReports()).map(serializePublishedReport),
  ['supplier-intelligence-published-reports-v1'],
  { revalidate: 300, tags: ['supplier-intelligence-reports'] },
);

export async function getPublicPublishedReports() {
  try {
    const reports = await getCachedPublicPublishedReports();
    return {
      reports,
      source: 'database' as const,
    };
  } catch (error) {
    console.error(
      'Published reports database unavailable; serving last-known snapshot:',
      error,
    );
    return {
      reports: fallbackPublishedReports,
      source: 'snapshot' as const,
    };
  }
}

export async function getPublicPublishedReportBySlug(slug: string) {
  const result = await getPublicPublishedReports();
  return {
    report: result.reports.find((report) => report.slug === slug) || null,
    source: result.source,
  };
}

export async function getPublishedReportBySlug(slug: string) {
  const report = await withDatabaseRetry(() =>
    prisma.intelligence_report_products.findFirst({
      where: { slug, status: 'published', currentVersionId: { not: null } },
    }),
  );
  if (!report?.currentVersionId) return null;
  const version = await withDatabaseRetry(() =>
    prisma.intelligence_report_versions.findFirst({
      where: {
        pidVersion: report.currentVersionId as string,
        reportId: report.pidReport,
        status: 'published',
        pdfUrl: { not: null },
      },
    }),
  );
  return version ? { report, version } : null;
}
