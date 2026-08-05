import { prisma } from '@/lib/prisma';

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
  return prisma.intelligence_report_products.findMany({
    where: { status: 'published', currentVersionId: { not: null } },
    orderBy: [{ publishedAt: 'desc' }, { title: 'asc' }],
  });
}

export async function getPublishedReportBySlug(slug: string) {
  const report = await prisma.intelligence_report_products.findFirst({
    where: { slug, status: 'published', currentVersionId: { not: null } },
  });
  if (!report?.currentVersionId) return null;
  const version = await prisma.intelligence_report_versions.findFirst({
    where: {
      pidVersion: report.currentVersionId,
      reportId: report.pidReport,
      status: 'published',
      pdfUrl: { not: null },
    },
  });
  return version ? { report, version } : null;
}
