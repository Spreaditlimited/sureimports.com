import type { Metadata } from 'next';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Database,
  Factory,
  FileCheck2,
  FileSearch,
  LockKeyhole,
  MessageSquareText,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';

import Footer from '@/app/(home)/components/Footer';
import Navigation from '@/app/(home)/components/Navigation';
import IntelligenceSignupForm from '@/components/intelligence/IntelligenceSignupForm';
import { JsonLdScript } from '@/components/seo/JsonLd';
import { getPassingNichesWithDb } from '@/lib/intelligence/data';
import { getIntelligencePlans } from '@/lib/intelligence/plans';

const baseUrl = 'https://www.sureimports.com';
const pageUrl = 'https://www.sureimports.com/supplier-intelligence';

export const metadata: Metadata = {
  title: 'China Supplier Intelligence for Nigerian Importers | Sure Imports',
  description:
    'Access researched China supplier leads for Nigerian importers. Starter gives you the supplier intelligence database plus one monthly supplier search credit. Pro adds supplier, quote and invoice review support before payment.',
  keywords: [
    'China supplier intelligence Nigeria',
    'China suppliers for Nigerian importers',
    'verified China supplier list Nigeria',
    'supplier review before payment',
    'China supplier database Nigeria',
    'import from China to Nigeria suppliers',
    'China supplier quote review',
    'invoice review before paying China supplier',
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: 'China Supplier Intelligence for Nigerian Importers',
    description:
      'Research-backed China supplier leads plus Pro review support for suppliers, quotes and invoices before payment.',
    url: pageUrl,
    siteName: 'Sure Imports',
    type: 'website',
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Sure Imports Supplier Intelligence',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'China Supplier Intelligence for Nigerian Importers',
    description:
      'Supplier intelligence database and pre-payment review support for Nigerian importers buying from China.',
    images: [`${baseUrl}/og-image.jpg`],
  },
};

const valueProps = [
  {
    title: 'Research you can start from',
    text: 'See supplier leads organized by product category, with contact routes, product fit and buyer notes.',
    icon: ShieldCheck,
  },
  {
    title: 'Built for import decisions',
    text: 'Each category helps you ask better questions before you request quotes, samples or invoices.',
    icon: FileSearch,
  },
  {
    title: 'Nigeria-focused buying notes',
    text: 'We flag issues Nigerian importers often miss: MOQ, warranty route, shipping category, fake product risk and market fit.',
    icon: Database,
  },
  {
    title: 'China-side support',
    text: 'The research is supported by Sure Imports people on ground in China and reviewed across multiple data points.',
    icon: Bell,
  },
];

const buyerProblems = [
  'You do not know where to start looking for serious Chinese suppliers.',
  'You are seeing the same recycled supplier lists everywhere.',
  'You are not sure if the company name, contact person, invoice and payment details match.',
  'You have a quote but do not know what questions to ask before paying.',
  'You want supplier leads for product categories that can work for the Nigerian market.',
  'You need more confidence before sending money to a supplier you have never met.',
];

const workflow = [
  {
    title: 'Choose a product category',
    text: 'Start from categories already researched by Sure Imports. Each category is published only when it has enough useful supplier leads.',
    icon: Search,
  },
  {
    title: 'Review supplier leads',
    text: 'Open supplier profiles, product fit, contact routes, location notes, buyer warnings and questions to ask before buying.',
    icon: Factory,
  },
  {
    title: 'Contact suppliers with better questions',
    text: 'Use the notes to ask about MOQ, sample policy, production time, warranty, packaging, invoice details and shipping assumptions.',
    icon: MessageSquareText,
  },
  {
    title: 'Use Pro before payment',
    text: 'If you are on Pro, submit supplier details, quotes, invoices or payment details for Sure Imports review before you send money.',
    icon: FileCheck2,
  },
];

const proReviews = [
  {
    title: 'Supplier review',
    text: 'Submit supplier name, Chinese company name, website, contact details and address before you continue discussions.',
  },
  {
    title: 'Quote review',
    text: 'Check price, MOQ, lead time, packaging, hidden cost questions and whether the quote is clear enough before you pay.',
  },
  {
    title: 'Invoice and payment review',
    text: 'Review invoice name, company name, payment details and order terms so mismatch questions are raised before money leaves your account.',
  },
];

const whoFor = [
  {
    title: 'Mini importers',
    text: 'People starting or growing a China importation business who need supplier direction, not guesswork.',
  },
  {
    title: 'Retailers and resellers',
    text: 'Businesses comparing product categories, suppliers and cost assumptions before committing to stock.',
  },
  {
    title: 'First-time China buyers',
    text: 'Importers who want to reduce obvious mistakes before contacting suppliers or paying invoices.',
  },
  {
    title: 'Busy business owners',
    text: 'Operators who want a researched starting point instead of spending weeks searching random websites.',
  },
];

const faqs = [
  {
    question: 'What is Sure Imports Supplier Intelligence?',
    answer:
      'It is a paid supplier research service for Nigerian importers. Starter gives access to researched China supplier leads by product category plus one monthly supplier search credit. Pro adds review support for supplier details, quotes, invoices and payment details before you pay.',
  },
  {
    question: 'Is this just a supplier list?',
    answer:
      'No. The database includes supplier leads, contact routes, product fit, buyer notes, warnings and questions to ask. Categories are published only when they have enough useful supplier leads.',
  },
  {
    question: 'Does Sure Imports guarantee every supplier?',
    answer:
      'No supplier database can replace your final decision, sampling, inspection and written agreement. The goal is to give you a stronger starting point and help you raise the right questions before payment.',
  },
  {
    question: 'What is the difference between Starter and Pro?',
    answer:
      'Starter is access to the supplier intelligence database plus one monthly supplier search credit. Pro includes the database, more monthly search credits and review support before payment for supplier details, quotes, invoices and payment information.',
  },
  {
    question: 'Can I request a new product category?',
    answer:
      'Yes. Pro members can submit priority category requests so Sure Imports can review whether that product area should be researched next.',
  },
  {
    question: 'Can this help me import from China to Nigeria?',
    answer:
      'Yes. The service is built for Nigerian importers who need a better way to identify supplier options, compare risks and avoid paying blindly.',
  },
];

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'China Supplier Intelligence for Nigerian Importers',
  url: pageUrl,
  provider: {
    '@type': 'Organization',
    name: 'Sure Imports',
    url: baseUrl,
  },
  areaServed: {
    '@type': 'Country',
    name: 'Nigeria',
  },
  serviceType: 'China supplier intelligence database and pre-payment review support',
  description:
    'Supplier intelligence database for Nigerian importers, with Pro support for supplier, quote and invoice review before payment.',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

export default async function SupplierIntelligencePage() {
  const passingNiches = await getPassingNichesWithDb();
  const intelligencePlans = await getIntelligencePlans();

  return (
    <main className="min-h-screen bg-[#fcfcfd] text-slate-950 antialiased selection:bg-brand-orange-500/30">
      <JsonLdScript data={[serviceSchema, faqSchema]} />
      <Navigation />

      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden bg-[#020617] pb-20 pt-36 text-white md:pb-28 md:pt-44">
        {/* Subtle Ambient Glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-brand-orange-500/10 blur-[120px]" />

        <div className="relative mx-auto flex max-w-[1440px] flex-col items-center px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-orange-500/20 bg-brand-orange-500/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-brand-orange-400 backdrop-blur-md">
              <LockKeyhole className="h-3.5 w-3.5" />
              China supplier intelligence for Nigerians
            </div>
            <h1 className="mt-6 text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl lg:text-[64px]">
              Stop guessing where to find{' '}
              <span className="bg-gradient-to-r from-brand-orange-400 to-amber-300 bg-clip-text text-transparent">
                China suppliers.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
              Access researched supplier leads by product category. If you
              choose Pro, Sure Imports can also review supplier details, quotes,
              invoices and payment information before you send money.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm backdrop-blur-md">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <span className="text-gray-300">Supplier database access</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm backdrop-blur-md">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <span className="text-gray-300">Pro pre-payment reviews</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm backdrop-blur-md">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <span className="text-gray-300">Built for Nigerian importers</span>
              </div>
            </div>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="#pricing"
              className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-brand-orange-500 px-8 text-sm font-bold text-white shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-all hover:scale-[1.02] hover:bg-brand-orange-600"
            >
              View Plans
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/dashboard/intelligence"
              className="inline-flex h-14 items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 text-sm font-bold text-white backdrop-blur-md transition-all hover:border-white/30 hover:bg-white/10"
            >
              Member Login
            </Link>
          </div>
          </div>
        </div>
      </section>

      {/* --- STATUS BAR --- */}
      <section className="border-b border-slate-200 bg-white py-8">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
            <p className="text-3xl font-black tracking-tight text-slate-900">
              {passingNiches.length}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              product categories available now
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
            <p className="text-3xl font-black tracking-tight text-slate-900">10</p>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              data points reviewed per supplier
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
            <p className="text-3xl font-black tracking-tight text-slate-900">Pro</p>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              supplier, quote and invoice review support
            </p>
          </div>
        </div>
      </section>

      {/* --- VALUE PROPS --- */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 max-w-3xl">
            <p className="text-xs font-black uppercase tracking-widest text-brand-orange-500">
              Why this matters
            </p>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight text-slate-950 md:text-5xl">
              The wrong supplier decision is expensive.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-600">
              Many Nigerian importers lose money before shipping even begins.
              The problem is usually not only shipping. It is weak supplier
              research, unclear quotes, mismatched invoice details and payment
              decisions made under pressure.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {valueProps.map((item) => (
              <div key={item.title} className="group flex flex-col items-start">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-orange-50 text-brand-orange-500 transition-colors group-hover:bg-brand-orange-100">
                  <item.icon className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-bold tracking-tight text-slate-900">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 text-balance">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PAIN POINTS --- */}
      <section className="border-y border-slate-100 bg-white py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-brand-orange-500">
              Common importer problem
            </p>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight text-slate-950 md:text-5xl">
              Searching online is not the same as knowing who to contact.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-600">
              A supplier website can look fine. A marketplace profile can look
              active. A quote can look cheap. But before payment, you still need
              to understand the company, the contact route, the product fit and
              the questions that protect your order.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {buyerProblems.map((problem) => (
              <div
                key={problem}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <AlertTriangle className="h-5 w-5 text-brand-orange-500" />
                <p className="mt-4 text-sm font-semibold leading-relaxed text-slate-700">
                  {problem}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- WORKFLOW --- */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-widest text-brand-orange-500">
              How it works
            </p>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight text-slate-950 md:text-5xl">
              Start with research. Use Pro before payment.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-600">
              Supplier Intelligence is designed to help you move from confusion
              to a clearer buying decision.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {workflow.map((step, index) => (
              <div
                key={step.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-orange-50 text-brand-orange-500">
                  <step.icon className="h-6 w-6" />
                </div>
                <p className="mt-5 text-xs font-black uppercase tracking-widest text-slate-400">
                  Step {index + 1}
                </p>
                <h3 className="mt-2 text-lg font-black text-slate-950">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PRO REVIEWS --- */}
      <section className="bg-slate-950 py-20 text-white md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-brand-orange-400">
                Pro support before payment
              </p>
              <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight md:text-5xl">
                When money is about to leave your account, get another layer of review.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-300">
                Pro is not just more database access. It is decision support
                before payment. Submit details and let Sure Imports review the
                obvious questions before you continue.
              </p>
              <Link
                href="#pricing"
                className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-orange-500 px-6 text-sm font-bold text-white transition hover:bg-brand-orange-600"
              >
                Compare Starter and Pro
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4">
              {proReviews.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                >
                  <ClipboardCheck className="h-5 w-5 text-brand-orange-400" />
                  <h3 className="mt-4 text-lg font-black text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- NICHE EXAMPLES --- */}
      <section className="border-y border-slate-100 bg-slate-50/50 py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-orange-500">
                Published only when ready
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Product categories available now
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Members see supplier names, contact details, Sure Imports check
                notes, buyer risks, and questions to ask before buying.
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {passingNiches.map((niche) => (
              <div
                key={niche.slug}
                className="group flex items-center justify-between rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition-all hover:border-brand-orange-200 hover:shadow-md"
              >
                <div>
                  <p className="font-bold text-slate-900">{niche.name}</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {niche.suppliers.length} checked supplier contacts
                  </p>
                </div>
                <CheckCircle2 className="h-5 w-5 text-emerald-500/50 transition-colors group-hover:text-emerald-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- WHO IT IS FOR --- */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 max-w-3xl">
            <p className="text-xs font-black uppercase tracking-widest text-brand-orange-500">
              Who should use it
            </p>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight text-slate-950 md:text-5xl">
              Built for people buying from China with real money at risk.
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whoFor.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
              >
                <Users className="h-5 w-5 text-brand-orange-500" />
                <h3 className="mt-4 text-lg font-black text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PRICING --- */}
      <section id="pricing" className="py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-center mx-auto md:text-left md:mx-0">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-orange-500">
              Plans
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl text-balance">
              Start free, unlock the database, or add pre-payment review support.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Free gives you one supplier search credit. Starter gives you the
              supplier intelligence database plus one monthly supplier search
              credit. Pro adds Sure Imports review support for suppliers,
              quotes and invoices before you send money.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            <div className="flex flex-col rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50 sm:p-10">
              <div className="border-b border-slate-100 pb-8">
                <div className="min-h-[58px]">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">
                      Free Search
                    </h3>
                    <p className="mt-2 text-sm font-medium text-slate-500">
                      No monthly fee
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap items-end gap-x-2 gap-y-1">
                  <p className="text-4xl font-black tracking-tight text-slate-900">
                    ₦0
                  </p>
                  <p className="pb-1 text-sm font-bold text-slate-500">
                    one free search
                  </p>
                </div>
              </div>

              <ul className="my-8 flex-1 space-y-4 text-sm leading-relaxed text-slate-700">
                {[
                  'Create a Sure Imports account',
                  'Get 1 free supplier search credit',
                  'Search for one product category',
                  'Receive a result summary when intelligence is available',
                  'Subscribe when you want full supplier details',
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange-500" />
                    <span className="font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto min-h-[316px] pt-4">
                <IntelligenceSignupForm
                  plan="free"
                  note="Includes one free supplier search credit for one product category. Full supplier details are available on the paid plans."
                />
              </div>
            </div>

            {Object.values(intelligencePlans).map((plan) => {
              const isPro = plan.key === 'pro';

              return (
                <div
                  key={plan.key}
                  className={`relative flex flex-col rounded-[2rem] border p-8 shadow-xl sm:p-10 ${
                    isPro
                      ? 'border-brand-orange-300 bg-brand-orange-50/40 shadow-brand-orange-100/70'
                      : 'border-slate-200 bg-white shadow-slate-200/50'
                  }`}
                >
                  <div
                    className={`border-b pb-8 ${
                      isPro ? 'border-brand-orange-200' : 'border-slate-100'
                    }`}
                  >
                    <div className="flex min-h-[58px] items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">
                          {plan.name}
                        </h3>
                        <p className="mt-2 text-sm font-medium text-slate-500">
                          Billed monthly • Cancel anytime
                        </p>
                      </div>

                      {isPro ? (
                        <span className="shrink-0 rounded-full bg-brand-orange-500 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-brand-orange-500/20">
                          Best Value
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-6 flex flex-wrap items-end gap-x-2 gap-y-1">
                      <p className="text-4xl font-black tracking-tight text-slate-900">
                        <span className="mr-1 text-2xl font-bold text-slate-400">
                          ₦
                        </span>
                        {plan.priceNaira.toLocaleString()}
                      </p>
                      <p className="pb-1 text-sm font-bold text-slate-500">
                        / month
                      </p>
                    </div>
                  </div>

                  <ul className="my-8 flex-1 space-y-4 text-sm leading-relaxed text-slate-700">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange-500" />
                        <span className="font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto min-h-[316px] pt-4">
                    <IntelligenceSignupForm plan={plan.key} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- FAQ --- */}
      <section className="border-t border-slate-100 bg-white py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-xs font-black uppercase tracking-widest text-brand-orange-500">
              Questions
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">
              Supplier Intelligence FAQs
            </h2>
          </div>
          <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
            {faqs.map((faq) => (
              <details key={faq.question} className="group p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-black text-slate-950">
                  {faq.question}
                  <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition group-open:rotate-180" />
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
