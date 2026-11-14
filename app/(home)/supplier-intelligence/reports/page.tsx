import styles from '@/components/intelligence/ReportSearchExperience.module.css';
import type { Metadata } from 'next';

import Footer from '@/app/(home)/components/Footer';
import Navigation from '@/app/(home)/components/Navigation';
import ReportSearchExperience from '@/components/intelligence/ReportSearchExperience';
import { getReportSeo } from '@/lib/intelligence/reportSeo';
import { getPublicPublishedReports } from '@/lib/intelligence/reports';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'China Supplier Reports and Free Product Catalogs | Sure Imports',
  description:
    'Search paid China supplier reports and download free product catalogs, including Futura lace frontal wigs. Choose a style and ask Sure Imports to source it.',
  keywords: [
    'China supplier reports',
    'free product catalogs',
    'Futura wigs catalog',
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
    <main className={styles.page}>
      <Navigation />
      <ReportSearchExperience reports={searchReports} />
      <Footer />
    </main>
  );
}
