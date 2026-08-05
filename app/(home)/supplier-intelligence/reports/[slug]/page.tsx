import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Ship,
  ShieldCheck,
} from 'lucide-react';

import Footer from '@/app/(home)/components/Footer';
import Navigation from '@/app/(home)/components/Navigation';
import ReportCover from '@/components/intelligence/ReportCover';
import ReportCheckoutForm from '@/components/intelligence/ReportCheckoutForm';
import {
  formatReportPrice,
  getPublishedReportBySlug,
} from '@/lib/intelligence/reports';
import { getReportSeo } from '@/lib/intelligence/reportSeo';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPublishedReportBySlug(slug);
  if (!result) return { title: 'Supplier report not found | Sure Imports' };
  const seo = getReportSeo(slug);
  const canonical = `https://www.sureimports.com/supplier-intelligence/reports/${slug}`;
  const image = result.report.coverImageUrl
    ? `https://www.sureimports.com${result.report.coverImageUrl}`
    : 'https://www.sureimports.com/assets/img/logo.svg';
  return {
    title: seo?.metaTitle || `${result.report.title} | Sure Imports`,
    description:
      seo?.metaDescription ||
      result.report.description ||
      result.report.subtitle ||
      undefined,
    keywords: seo
      ? [seo.primaryKeyword, ...seo.secondaryKeywords]
      : undefined,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      url: canonical,
      title: seo?.metaTitle || result.report.title,
      description: seo?.metaDescription || result.report.subtitle || '',
      images: [{ url: image, alt: result.report.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo?.metaTitle || result.report.title,
      description: seo?.metaDescription || result.report.subtitle || '',
      images: [image],
    },
  };
}

export default async function SupplierReportPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getPublishedReportBySlug(slug);
  if (!result) notFound();
  const { report } = result;
  const seo = getReportSeo(slug);
  const canonical = `https://www.sureimports.com/supplier-intelligence/reports/${slug}`;
  const schema = seo
    ? {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Product',
            name: report.title,
            description: seo.metaDescription,
            image: report.coverImageUrl
              ? `https://www.sureimports.com${report.coverImageUrl}`
              : undefined,
            sku: report.pidReport,
            brand: { '@type': 'Brand', name: 'Sure Imports' },
            category: 'China Supplier Intelligence Report',
            offers: [
              {
                '@type': 'Offer',
                url: canonical,
                priceCurrency: 'NGN',
                price: report.priceNaira,
                availability: 'https://schema.org/InStock',
              },
              {
                '@type': 'Offer',
                url: canonical,
                priceCurrency: 'USD',
                price: report.priceUsdCents / 100,
                availability: 'https://schema.org/InStock',
              },
            ],
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Supplier Intelligence',
                item: 'https://www.sureimports.com/supplier-intelligence',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Reports',
                item: 'https://www.sureimports.com/supplier-intelligence/reports',
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: report.title,
                item: canonical,
              },
            ],
          },
          {
            '@type': 'FAQPage',
            mainEntity: seo.faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: { '@type': 'Answer', text: faq.answer },
            })),
          },
        ],
      }
    : null;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      {schema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ) : null}
      <Navigation />
      <section className="pb-20 pt-32 md:pt-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/supplier-intelligence/reports"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            All reports
          </Link>
          <div className="mt-8 grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <div className="mx-auto w-full max-w-md">
              <ReportCover
                title={report.title}
                editionLabel={report.editionLabel}
                supplierCount={report.supplierCount}
                coverImageUrl={report.coverImageUrl}
              />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-orange-600">
                Supplier Intelligence Report
              </p>
              <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                {report.title}
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">
                {seo?.introduction || report.subtitle}
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {[
                  [`${report.supplierCount}`, 'supplier profiles'],
                  [report.editionLabel, 'published edition'],
                  ['One-time', 'purchase'],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <p className="text-lg font-black">{value}</p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      Nigeria · Paystack
                    </p>
                    <p className="mt-1 text-3xl font-black">
                      {formatReportPrice(report.priceNaira, 'NGN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-500">
                      International · PayPal
                    </p>
                    <p className="mt-1 text-3xl font-black">
                      {formatReportPrice(report.priceUsdCents, 'USD')}
                    </p>
                  </div>
                </div>
                <ReportCheckoutForm reportSlug={report.slug} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {seo ? (
        <section className="border-y border-slate-200 bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-brand-orange-600">
                  China manufacturer sourcing
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                  {seo.heading}
                </h2>
                <p className="mt-5 text-base leading-8 text-slate-600">
                  {seo.introduction}
                </p>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  {seo.buyerValue}
                </p>
              </div>
              <div className="rounded-3xl bg-slate-950 p-7 text-white sm:p-8">
                <p className="text-xs font-black uppercase tracking-widest text-brand-orange-400">
                  Product coverage
                </p>
                <ul className="mt-5 space-y-4">
                  {seo.products.map((product) => (
                    <li key={product} className="flex items-start gap-3 text-sm leading-6 text-slate-200">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange-400" />
                      {product}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="border-b border-slate-200 bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-brand-orange-600">
                Inside the report
              </p>
              <h2 className="mt-3 text-3xl font-black">
                More than a contact list
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                {seo?.buyerValue || report.description}
              </p>
            </div>
            <ul className="grid gap-4">
              {[
                'Supplier comparison and shortlist view',
                'Individual manufacturer profiles and official contact routes',
                'Product fit, buyer notes and verification evidence',
                'Questions to confirm before samples, invoices or payment',
                'Destination-market compliance and shipping prompts',
                'Ship With Us next-step guidance',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-700"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      {seo ? (
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 p-7 sm:p-8">
                <p className="text-xs font-black uppercase tracking-widest text-brand-orange-600">
                  Important buying checks
                </p>
                <h2 className="mt-3 text-2xl font-black">Questions worth resolving before production</h2>
                <ul className="mt-6 space-y-4">
                  {seo.checks.map((check) => (
                    <li key={check} className="flex items-start gap-3 text-sm leading-6 text-slate-600">
                      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                      {check}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-slate-200 p-7 sm:p-8">
                <p className="text-xs font-black uppercase tracking-widest text-brand-orange-600">
                  Who this report is for
                </p>
                <h2 className="mt-3 text-2xl font-black">Built for commercial buyers</h2>
                <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                  {seo.audiences.map((audience) => (
                    <li key={audience} className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">
                      {audience}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ) : null}
      <section className="bg-[#071426] py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {[
            [
              ShieldCheck,
              'Research snapshot',
              'Every edition preserves the supplier information and verification evidence available when it was published.',
            ],
            [
              FileText,
              'Manufacturer intelligence',
              'Compare product fit, production strengths and official contact routes across a focused shortlist of direct manufacturers.',
            ],
            [
              Ship,
              'China-based support',
              'For high-value orders, our China team can arrange physical factory verification and coordinate receiving, consolidation and shipping.',
            ],
          ].map(([Icon, title, text]: any) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <Icon className="h-6 w-6 text-brand-orange-400" />
              <h2 className="mt-4 text-lg font-black">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>
      {seo ? (
        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs font-black uppercase tracking-widest text-brand-orange-600">
              Frequently asked questions
            </p>
            <h2 className="mt-3 text-center text-3xl font-black">Before you buy the report</h2>
            <div className="mt-10 space-y-4">
              {seo.faqs.map((faq) => (
                <article key={faq.question} className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h3 className="text-lg font-black">{faq.question}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <Footer />
    </main>
  );
}
