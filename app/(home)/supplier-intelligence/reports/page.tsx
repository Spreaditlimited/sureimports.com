import styles from '@/components/intelligence/ReportSearchExperience.module.css';
import type { Metadata } from 'next';

import Footer from '@/app/(home)/components/Footer';
import Navigation from '@/app/(home)/components/Navigation';
import ReportSearchExperience from '@/components/intelligence/ReportSearchExperience';
import { getReportSeo } from '@/lib/intelligence/reportSeo';
import { getPublicPublishedReports } from '@/lib/intelligence/reports';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'China Supplier Reports and Free Product Catalogs',
  description:
    'Search paid China supplier reports and browse free catalogs for importing wigs, phone cases, chargers and other products from China to Nigeria. Download a PDF and request a sourcing quote.',
  keywords: [
    'China supplier reports',
    'free product catalogs',
    'Futura wigs catalog',
    'phone accessories catalog',
    'China product catalog',
    'search China manufacturers',
    'verified supplier list China',
    'China sourcing reports',
    'import phone accessories from China',
    'wholesale phone cases China',
    'import wigs from China',
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
