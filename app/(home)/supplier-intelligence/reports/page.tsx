import type { Metadata } from 'next';

import Footer from '@/app/(home)/components/Footer';
import Navigation from '@/app/(home)/components/Navigation';
import ReportSearchExperience from '@/components/intelligence/ReportSearchExperience';
import { getReportSeo } from '@/lib/intelligence/reportSeo';
import { getPublicPublishedReports } from '@/lib/intelligence/reports';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Search China Supplier Reports | Sure Imports',
  description:
    'Search ready-made China supplier reports by product. Vote for a missing category and help decide which manufacturer report Sure Imports researches next.',
  keywords: [
    'China supplier reports',
    'search China manufacturers',
    'verified supplier list China',
    'China sourcing reports',
    'request supplier research',
  ],
  alternates: {
    canonical: 'https://www.sureimports.com/supplier-intelligence/reports',
  },
};

export default async function SupplierIntelligenceReportsPage() {
  const { reports } = await getPublicPublishedReports();
  const searchReports = reports.map((report) => {
    const seo = getReportSeo(
      report.slug,
      report.supplierCount,
      report.seoProfile,
    );
    return {
      pidReport: report.pidReport,
      slug: report.slug,
      title: report.title,
      description: seo?.introduction || report.description,
      editionLabel: report.editionLabel,
      coverImageUrl: report.coverImageUrl,
      supplierCount: report.supplierCount,
      priceNaira: report.priceNaira,
      priceUsdCents: report.priceUsdCents,
      searchableText: [
        report.slug,
        report.title,
        report.subtitle,
        report.description,
        seo?.primaryKeyword,
        ...(seo?.secondaryKeywords || []),
        ...(seo?.products || []),
        ...(seo?.audiences || []),
      ]
        .filter(Boolean)
        .join(' '),
    };
  });

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <Navigation />
      <ReportSearchExperience reports={searchReports} />
      <Footer />
    </main>
  );
}
