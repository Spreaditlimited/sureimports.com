import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  CreditCard,
  Database,
  FileSearch,
  Lock,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Ship,
} from 'lucide-react';

import Footer from '@/app/(home)/components/Footer';
import Navbar from '@/components/Navbar';
import PublicHeroBackground from '@/components/home/PublicHeroBackground';
import { JsonLdScript } from '@/components/seo/JsonLd';
import PublicSupplierVerificationFlow from './components/PublicSupplierVerificationFlow';
import {
  DEFAULT_SUPPLIER_VERIFICATION_FEE_NGN_KOBO,
  DEFAULT_SUPPLIER_VERIFICATION_FEE_USD_CENTS,
  getSupplierVerificationSettings,
} from '@/lib/supplierVerification/service';

const baseUrl = 'https://www.sureimports.com';
const pageUrl = `${baseUrl}/supplier-verification`;
const startHref = '#start-verification';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'China Supplier Verification Service for Importers | Sure Imports',
  description:
    'Verify a Chinese supplier before payment. Choose online company checks or a physical supplier visit in China, with a documented verification report.',
  keywords: [
    'China supplier verification',
    'verify Chinese supplier',
    'supplier verification Nigeria',
    'factory verification China',
    'check China company registration',
    'China supplier due diligence',
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: 'China Supplier Verification Service',
    description:
      'Online company checks and physical supplier visits in China, with a documented report before you pay.',
    url: pageUrl,
    siteName: 'Sure Imports',
    type: 'website',
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Sure Imports China Supplier Verification',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'China Supplier Verification Service',
    description:
      'Check supplier identity, registration and business details before committing funds.',
    images: [`${baseUrl}/og-image.jpg`],
  },
};

const checks = [
  'Chinese registered company name and Unified Social Credit Code',
  'Registration status, legal representative and registered business scope',
  'Address, website, contact and marketplace identity consistency',
  'Quotation, invoice and proposed payment-beneficiary discrepancies',
  'Risk observations, unanswered questions and practical next steps',
];

const workflow = [
  {
    title: 'Submit the supplier',
    text: 'Provide the English and Chinese identity, address, marketplace links, contacts and what you plan to buy.',
    icon: Building2,
  },
  {
    title: 'Pay for standard checks',
    text: 'Every request starts with the standard verification fee. This begins the online checks and unlocks physical-visit pricing if requested.',
    icon: CreditCard,
  },
  {
    title: 'We investigate',
    text: 'Our China team records sources, inconsistencies, evidence and limitations against a structured checklist.',
    icon: FileSearch,
  },
  {
    title: 'Receive your report',
    text: 'Track progress from your dashboard and open the documented conclusion when the review is complete.',
    icon: ShieldCheck,
  },
];

const relatedServices = [
  {
    title: 'Supplier Intelligence',
    text: 'Research verified supplier options when you have not chosen a supplier yet.',
    href: '/supplier-intelligence',
    icon: Database,
  },
  {
    title: 'Corporate Sourcing',
    text: 'Structured supplier search and procurement for established organisations.',
    href: '/corporate-sourcing',
    icon: ClipboardCheck,
  },
  {
    title: 'Ship With Us',
    text: 'Move goods from a supplier you have already paid or contracted.',
    href: '/ship-with-us',
    icon: Ship,
  },
  {
    title: 'Book Consultation',
    text: 'Discuss supplier, product, cost or shipping decisions with our team.',
    href: '/book-consultation',
    icon: MessageSquare,
  },
];

const faqs = [
  {
    question: 'Can you verify a supplier found on Alibaba or 1688?',
    answer:
      'Yes. Submit the listing URL together with the supplier’s Chinese company name, address, contact details, quotation and business licence where available. A marketplace badge alone is not treated as proof of identity.',
  },
  {
    question:
      'What is the difference between online checks and a physical visit?',
    answer:
      'Online checks compare official registration and the supplier details supplied to you. If you request a physical visit, you first pay the standard verification fee. We then research and quote the optional on-site visit separately.',
  },
  {
    question: 'Does verification guarantee that a supplier will perform?',
    answer:
      'No. The report documents evidence and inconsistencies found at the time of review. It reduces uncertainty but cannot guarantee future quality, delivery or conduct.',
  },
  {
    question: 'How do physical-visit travel charges work?',
    answer:
      'After your standard verification payment is confirmed, our team plans the round trip from Guangzhou and includes required lodging. You can pay the separate visit quote or decline it and continue with online verification only.',
  },
];

export default async function SupplierVerificationPage() {
  const settings = await getSupplierVerificationSettings().catch(() => ({
    feeNgnKobo: DEFAULT_SUPPLIER_VERIFICATION_FEE_NGN_KOBO,
    feeUsdCents: DEFAULT_SUPPLIER_VERIFICATION_FEE_USD_CENTS,
    onlineEnabled: true,
    physicalEnabled: true,
    onlineTurnaroundDays: 3,
    physicalTurnaroundDays: 5,
  }));
  const feeNaira = settings.feeNgnKobo / 100;
  const feeUsd = settings.feeUsdCents / 100;
  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'China Supplier Verification',
      url: pageUrl,
      description: metadata.description,
      provider: {
        '@type': 'Organization',
        name: 'Sure Imports',
        url: baseUrl,
      },
      areaServed: ['Nigeria', 'China'],
      offers: [
        { '@type': 'Offer', priceCurrency: 'NGN', price: feeNaira },
        { '@type': 'Offer', priceCurrency: 'USD', price: feeUsd },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfd] text-slate-950 selection:bg-brand-orange-500/30 dark:bg-slate-950 dark:text-white">
      <JsonLdScript data={schemas} />
      <Navbar />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-slate-950 pb-20 pt-36 text-white md:pb-28 md:pt-44">
          <PublicHeroBackground />
          <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-brand-orange-500/10 blur-[120px]" />

          <div className="relative mx-auto flex max-w-[1440px] items-center justify-center px-4 text-center sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-4xl flex-col items-center">
              <div className="mb-6 inline-flex items-center justify-center gap-2 rounded-full border border-brand-orange-500/30 bg-brand-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-orange-400 backdrop-blur-md">
                <ShieldCheck className="h-4 w-4" />
                China supplier due diligence
              </div>
              <h1 className="text-5xl font-black leading-[1.1] tracking-tight sm:text-6xl md:text-7xl">
                Verify a Chinese supplier{' '}
                <span className="text-white">before you pay</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
                Choose documented online checks or an on-site visit in China. We
                compare the company identity, registration, address, contacts
                and transaction details, then provide an evidence-led report.
              </p>

              <div className="mt-10 flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row">
                <Link
                  href={startHref}
                  className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-brand-orange-500 px-8 text-base font-bold text-white shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-all hover:scale-[1.02] hover:bg-brand-orange-600"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start a Verification
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex h-14 items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 text-base font-bold text-white backdrop-blur-md transition-all hover:border-white/30 hover:bg-white/10"
                >
                  See How It Works
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="mb-16 max-w-3xl">
              <span className="text-xs font-black uppercase tracking-widest text-brand-orange-500">
                Choose your verification level
              </span>
              <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight text-slate-950 dark:text-white md:text-5xl">
                Check the business online or send our China team in person.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                Both options begin with the supplier’s legal identity. Physical
                verification is optional after the standard checks are paid:
                approve its separate travel quote or continue online-only.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <article className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/50 md:p-10">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-orange-50 text-brand-orange-500 dark:bg-brand-orange-500/10">
                  <ClipboardCheck className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-black text-slate-950 dark:text-white">
                  Online supplier checks
                </h3>
                <p className="mt-3 text-xl font-black text-brand-orange-600 dark:text-brand-orange-400">
                  ₦{feeNaira.toLocaleString()} or ${feeUsd.toFixed(2)}
                </p>
                <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-400">
                  For importers who already have a supplier and want identity,
                  registration and transaction checks. Typical target:{' '}
                  {settings.onlineTurnaroundDays} business days after payment
                  and receipt of sufficient information.
                </p>
              </article>

              <article className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/50 md:p-10">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-orange-50 text-brand-orange-500 dark:bg-brand-orange-500/10">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-black text-slate-950 dark:text-white">
                  Physical supplier visit
                </h3>
                <p className="mt-3 text-xl font-black text-brand-orange-600 dark:text-brand-orange-400">
                  Standard fee first · visit quoted separately
                </p>
                <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-400">
                  Online checks plus a visit to the supplied Chinese address. We
                  begin after the standard verification payment, then confirm
                  round-trip travel and lodging from Guangzhou as a separate,
                  optional payment. Typical target starts from{' '}
                  {settings.physicalTurnaroundDays} business days, subject to
                  location and access.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="relative overflow-hidden border-y border-slate-200 bg-slate-50 py-20 dark:border-slate-800 dark:bg-slate-900/40 md:py-28"
        >
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <span className="text-xs font-black uppercase tracking-widest text-brand-orange-500">
                How it works
              </span>
              <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight md:text-5xl">
                One accountable workflow from request to report.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                Your request, payment, review progress and final report remain
                tied to one dashboard record from beginning to end.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {workflow.map((step, index) => (
                <article
                  key={step.title}
                  className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-950/60"
                >
                  <span className="pointer-events-none absolute right-4 top-2 text-5xl font-black text-slate-100 dark:text-white/[0.03]">
                    {index + 1}
                  </span>
                  <div className="relative mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-orange-50 text-brand-orange-500 dark:bg-brand-orange-500/10">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <h3 className="relative text-lg font-black text-slate-950 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="relative mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {step.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="mx-auto grid max-w-[1440px] gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-12">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange-50 text-brand-orange-500 dark:bg-slate-800">
                <FileSearch className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                What we examine
              </h2>
              <p className="mb-8 mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                A company listing is a lead, not proof. Strong verification
                starts with the Chinese legal identity behind the trading name.
              </p>
              <ul className="space-y-4">
                {checks.map((check) => (
                  <li
                    key={check}
                    className="flex items-start gap-3 rounded-xl border border-slate-100 p-4 dark:border-slate-800 dark:bg-slate-950/50"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {check}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col justify-between rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm dark:border-slate-800 dark:bg-slate-800/30 md:p-12">
              <div>
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-brand-orange-500 dark:border-slate-700 dark:bg-slate-900">
                  <BadgeCheck className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                  Better supplier details produce a stronger review.
                </h2>
                <p className="mb-8 mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                  Include the Chinese company name, business licence, address,
                  quotation, invoice, website and marketplace links whenever
                  available. We use official Chinese business records as part of
                  the online review.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  'Chinese legal name or credit code',
                  'Alibaba, 1688 or other listing URLs',
                  'Quotation and proposed beneficiary details',
                  'Chinese address for a physical visit',
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-slate-200 bg-white p-4 text-center text-sm font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="start-verification"
          className="relative scroll-mt-24 overflow-hidden border-y border-slate-200 bg-slate-50 py-24 dark:border-slate-800 dark:bg-[#080b14]"
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-brand-orange-500/5 blur-[120px]" />

          <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/90 shadow-2xl shadow-slate-200/60 backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/70 dark:shadow-none">
              <div className="border-b border-slate-200/80 bg-slate-100/60 px-6 py-4 dark:border-slate-800/50 dark:bg-slate-950/50">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-300 dark:bg-red-500/70" />
                    <span className="h-3 w-3 rounded-full bg-amber-300 dark:bg-amber-500/70" />
                    <span className="h-3 w-3 rounded-full bg-emerald-300 dark:bg-emerald-500/70" />
                  </div>
                  <div className="inline-flex min-w-0 items-center gap-2 rounded-lg bg-white/90 px-4 py-1.5 font-mono text-xs font-medium text-slate-500 shadow-sm dark:bg-slate-800/80 dark:text-slate-400">
                    <Lock className="h-3 w-3 shrink-0 text-emerald-500" />
                    <span className="truncate">
                      sureimports.com/supplier-verification
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-10 md:p-12">
                <PublicSupplierVerificationFlow
                  feeNaira={feeNaira}
                  feeUsd={feeUsd}
                  onlineEnabled={settings.onlineEnabled}
                  physicalEnabled={settings.physicalEnabled}
                />
              </div>

              <div className="border-t border-slate-200/80 bg-slate-50/70 px-6 py-4 dark:border-slate-800/50 dark:bg-slate-950/50">
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-emerald-500" /> Secure payment
                  </span>
                  <span className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-500" /> China team
                    review
                  </span>
                  <span className="flex items-center gap-2">
                    <FileSearch className="h-4 w-4 text-brand-orange-500" />
                    Documented report
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-950 py-20 text-white md:py-28">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="mb-12 max-w-3xl">
              <span className="text-xs font-black uppercase tracking-widest text-brand-orange-400">
                Related services
              </span>
              <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
                Choose the right Sure Imports route.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-400">
                Supplier Verification is for a supplier you already found. Use
                another service when you still need supplier research,
                procurement advice or shipping support.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {relatedServices.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-brand-orange-500/50 hover:bg-white/[0.08]"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-brand-orange-300 group-hover:bg-brand-orange-500 group-hover:text-white">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-black">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">
                    {item.text}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-12 text-center text-3xl font-black tracking-tight text-slate-950 dark:text-white md:text-5xl">
              Supplier Verification FAQs
            </h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer items-center justify-between p-6 text-lg font-bold text-slate-950 outline-none transition hover:text-brand-orange-500 dark:text-white dark:hover:text-brand-orange-400">
                    <span>{faq.question}</span>
                    <span className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50 transition group-open:rotate-180 dark:bg-slate-800">
                      <ChevronDown className="h-4 w-4 text-slate-500" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 leading-relaxed text-slate-600 dark:text-slate-400">
                    <p>{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
