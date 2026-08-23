import Link from 'next/link';
import { ArrowRight, Download, FileText } from 'lucide-react';
import { bodyCameraDocuments } from '@/lib/bodyCameraSolutions/documents';

const sectionEyebrow =
  'text-xs font-bold uppercase tracking-[0.22em] text-brand-orange-600';

export default function DocumentDownloads() {
  return (
    <section className="border-t border-slate-200 px-6 py-10 dark:border-slate-800 sm:px-10 sm:py-12">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className={`${sectionEyebrow} flex items-center gap-2`}>
            <FileText className="h-4 w-4" /> Downloads & pricing
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Official documents for procurement review.
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            Review the product catalogue and detailed DEM technical description.
            These documents do not contain product prices.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
          {bodyCameraDocuments.length} PDFs available
        </span>
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-2">
        {bodyCameraDocuments.map((document) => (
          <article
            key={document.slug}
            className="flex h-full flex-col rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950 sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-blue-700 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:text-blue-300 dark:ring-slate-800">
                <FileText className="h-5 w-5" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Official Hytera PDF
              </span>
            </div>
            <h3 className="mt-5 text-lg font-bold leading-6">
              {document.title}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {document.description}
            </p>
            <p className="mt-5 text-xs font-semibold text-slate-500">
              {document.version} · {document.pages} pages · {document.fileSize}
            </p>
            <a
              href={`/api/body-camera-documents/${document.slug}`}
              download={document.filename}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl border border-blue-900/15 bg-white px-4 py-3 text-sm font-bold text-blue-800 transition hover:border-blue-900/30 hover:bg-blue-50 dark:bg-slate-900 dark:text-blue-300 dark:hover:bg-slate-800"
            >
              <Download className="h-4 w-4" /> Download PDF
            </a>
          </article>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-5 rounded-2xl bg-blue-50 p-5 dark:bg-blue-500/10 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="text-sm font-bold text-slate-950 dark:text-white">
            Need current NGN or USD pricing?
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Pricing is configured around camera quantities, evidence retention,
            infrastructure, delivery and support requirements.
          </p>
        </div>
        <Link
          href="#assessment"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-blue-800 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-900"
        >
          Request pricing <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
