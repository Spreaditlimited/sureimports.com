import Image from 'next/image';
import { ArrowDownToLine, CheckCircle2, MessageCircleMore } from 'lucide-react';

import WhatsAppButton from '@/components/WhatsAppButton';
import { freeCatalogs } from '@/lib/intelligence/freeCatalogs';

export default function FreeCatalogsSection() {
  return (
    <section
      id="free-catalogs"
      aria-labelledby="free-catalogs-heading"
      className="scroll-mt-24 border-b border-slate-200 bg-[#f7f5f1] py-16 md:py-20"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange-600">
            Free product catalogs
          </p>
          <h2
            id="free-catalogs-heading"
            className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl"
          >
            Browse styles, then let us source your choice.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Download a catalog at no cost. When you find a product you like,
            send its style code and your preferred options to our team on
            WhatsApp. We confirm availability and the final price before you
            order.
          </p>
        </div>

        <div className="mt-9 space-y-8">
          {freeCatalogs.map((catalog) => (
            <article
              key={catalog.slug}
              className="grid overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]"
            >
              <div className="flex items-center justify-center bg-[#ece9f3] p-6 sm:p-9">
                <div className="relative aspect-[595/842] w-full max-w-[320px] overflow-hidden rounded-xl bg-white shadow-2xl shadow-slate-950/15">
                  <Image
                    src={catalog.coverImageUrl}
                    alt={`${catalog.title} catalog cover showing three wigs from the collection`}
                    fill
                    sizes="(max-width: 1023px) 320px, 320px"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col p-6 sm:p-9 lg:p-12">
                <p className="text-xs font-bold uppercase tracking-[0.17em] text-brand-orange-600">
                  Free download · {catalog.pageCount} pages · {catalog.fileSizeLabel}
                </p>
                <h3 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  {catalog.title}
                </h3>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  {catalog.description}
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    [`${catalog.styleCount} styles`, 'Photographed styles with codes'],
                    ['13 × 4 or 13 × 6', 'Lace frontal options'],
                    ['1 piece', 'Minimum order'],
                  ].map(([value, label]) => (
                    <div
                      key={value}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      <p className="text-sm font-bold text-slate-950">{value}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-7 border-t border-slate-200 pt-6">
                  <p className="text-sm font-semibold text-slate-950">
                    How to order from the catalog
                  </p>
                  <ol className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                    {[
                      'Download the PDF and note the JY style code you want.',
                      'Tell us your preferred colour, length and lace size on WhatsApp.',
                      'We confirm supplier availability and your final quote before payment.',
                    ].map((step) => (
                      <li key={step} className="flex items-start gap-2.5">
                        <CheckCircle2
                          aria-hidden="true"
                          className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600"
                        />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                <p className="mt-5 text-xs leading-5 text-slate-500">
                  The catalog&apos;s USD prices are product reference prices.
                  Colour, texture, length and lace options can change the price;
                  shipping and the final amount are confirmed in your quote.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <a
                    href={`/api/intelligence/free-catalogs/${catalog.slug}/download`}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--si-primary)] px-6 py-3 text-sm font-semibold text-[var(--si-on-primary)] transition hover:brightness-95"
                  >
                    <ArrowDownToLine aria-hidden="true" className="h-4 w-4" />
                    Download free catalog
                  </a>
                  <div className="inline-flex items-center gap-2">
                    <MessageCircleMore
                      aria-hidden="true"
                      className="hidden h-4 w-4 text-emerald-700 sm:block"
                    />
                    <WhatsAppButton
                      waID="CUR7YKW3K3RBA1"
                      variant="inline"
                      triggerLabel="Ask about a style"
                      triggerClassName="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-emerald-600 px-6 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50 sm:w-auto"
                      message={`Hello Sure Imports, I found a style in the ${catalog.title} catalog. Please help me confirm availability and a quote.`}
                    />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
