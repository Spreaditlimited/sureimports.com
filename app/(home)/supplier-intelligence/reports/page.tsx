import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, FileSearch, Search, ShieldCheck } from 'lucide-react';

import Footer from '@/app/(home)/components/Footer';
import Navigation from '@/app/(home)/components/Navigation';
import ReportCover from '@/components/intelligence/ReportCover';
import {
  formatReportPrice,
  getPublishedReports,
} from '@/lib/intelligence/reports';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Supplier Intelligence Reports | Sure Imports',
  description:
    'Buy category-specific China supplier intelligence reports with checked manufacturers, official contact routes and practical buyer notes. No subscription required.',
  alternates: {
    canonical: 'https://www.sureimports.com/supplier-intelligence/reports',
  },
};

export default async function SupplierIntelligenceReportsPage() {
  const reports = await getPublishedReports();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <Navigation />
      <section className="bg-[#071426] pb-20 pt-36 text-white md:pb-24 md:pt-44">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-orange-400">
              One-time purchase · Downloadable editions
            </p>
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">
              Supplier Intelligence Reports
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
              Choose one product category, pay once and receive a professionally
              produced supplier decision document. No membership is required.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#reports"
                className="inline-flex items-center gap-2 rounded-full bg-brand-orange-500 px-6 py-3 text-sm font-bold text-white hover:bg-brand-orange-600"
              >
                Browse reports <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/supplier-intelligence#pricing"
                className="inline-flex items-center rounded-full border border-white/20 px-6 py-3 text-sm font-bold text-white hover:bg-white/10"
              >
                Explore membership
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-8">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          {[
            ['Choose one category', 'Buy only the intelligence you need.'],
            ['Research-backed', 'Checked supplier leads and decision notes.'],
            [
              'Use it anywhere',
              'Destination-market questions for global buyers.',
            ],
          ].map(([title, text], index) => {
            const Icon = [Search, ShieldCheck, FileSearch][index];
            return (
              <div
                key={title}
                className="flex gap-4 rounded-2xl bg-slate-50 p-5"
              >
                <Icon className="h-5 w-5 shrink-0 text-brand-orange-500" />
                <div>
                  <h2 className="text-sm font-black">{title}</h2>
                  <p className="mt-1 text-sm text-slate-600">{text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="reports" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-brand-orange-600">
                Published library
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight">
                Choose your category
              </h2>
            </div>
            <p className="text-sm font-semibold text-slate-500">
              {reports.length} reports available
            </p>
          </div>
          {reports.length ? (
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {reports.map((report) => (
                <article
                  key={report.pidReport}
                  className="group rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <ReportCover
                    title={report.title}
                    editionLabel={report.editionLabel}
                    supplierCount={report.supplierCount}
                    coverImageUrl={report.coverImageUrl}
                    compact
                  />
                  <div className="px-2 pb-3 pt-6">
                    <p className="text-xs font-black uppercase tracking-widest text-brand-orange-600">
                      {report.editionLabel}
                    </p>
                    <h2 className="mt-2 text-xl font-black leading-tight">
                      {report.title}
                    </h2>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">
                      {report.description}
                    </p>
                    <div className="mt-5 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold text-slate-500">
                          One-time purchase
                        </p>
                        <p className="mt-1 text-lg font-black">
                          From {formatReportPrice(report.priceUsdCents, 'USD')}
                        </p>
                      </div>
                      <Link
                        href={`/supplier-intelligence/reports/${report.slug}`}
                        className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-bold text-white"
                      >
                        View report <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <FileSearch className="mx-auto h-8 w-8 text-brand-orange-500" />
              <h2 className="mt-4 text-xl font-black">
                The first report editions are being prepared
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
                Published reports will appear here as soon as they pass the
                Supplier Intelligence review process.
              </p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
