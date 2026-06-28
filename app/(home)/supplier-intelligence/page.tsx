import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  Database,
  FileSearch,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

import Footer from '@/app/(home)/components/Footer';
import Navigation from '@/app/(home)/components/Navigation';
import IntelligenceSignupForm from '@/components/intelligence/IntelligenceSignupForm';
import { getPassingNiches } from '@/lib/intelligence/data';
import { intelligencePlans } from '@/lib/intelligence/plans';

const pageUrl = 'https://www.sureimports.com/supplier-intelligence';

export const metadata: Metadata = {
  title: 'Sure Imports Supplier Intelligence',
  description:
    'A paid supplier research service for Nigerian importers who need China supplier leads checked by Sure Imports using multiple data points and China-side support.',
  alternates: { canonical: pageUrl },
};

const valueProps = [
  {
    title: '10-point supplier checks',
    text: 'We review each supplier across multiple data points before adding them to a category.',
    icon: ShieldCheck,
  },
  {
    title: 'More than website links',
    text: 'You see the supplier, product fit, contact details, checks made, and buyer notes in one place.',
    icon: FileSearch,
  },
  {
    title: 'Built for Nigeria',
    text: 'Notes cover landed cost, fake products, warranty issues, shipping concerns, and market fit.',
    icon: Database,
  },
  {
    title: 'China-side support',
    text: 'The research is supported by Sure Imports people on ground in China.',
    icon: Bell,
  },
];

export default function SupplierIntelligencePage() {
  const passingNiches = getPassingNiches();

  return (
    <main className="min-h-screen bg-white text-slate-950 antialiased selection:bg-brand-orange-500/30">
      <Navigation />

      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden bg-[#020617] pb-20 pt-36 text-white md:pb-28 md:pt-44">
        {/* Subtle Ambient Glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-brand-orange-500/10 blur-[120px]" />

        <div className="relative mx-auto grid max-w-[1440px] gap-16 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-orange-500/20 bg-brand-orange-500/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-brand-orange-400 backdrop-blur-md">
              <LockKeyhole className="h-3.5 w-3.5" />
              Supplier Research by Sure Imports
            </div>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-balance sm:text-5xl lg:text-[64px]">
              Find China suppliers with more confidence.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-400">
              Get supplier leads checked across multiple data points by Sure
              Imports, with support from our team on ground in China.
            </p>
          </div>

          {/* Hero Stats Card */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-8 shadow-2xl backdrop-blur-sm lg:p-10">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
            <p className="text-xs font-bold uppercase tracking-widest text-brand-orange-400/80">
              Current Research Status
            </p>
            <div className="mt-8 grid grid-cols-2 gap-8 divide-x divide-white/10">
              <div>
                <p className="text-5xl font-black text-white tracking-tight">
                  {passingNiches.length}
                </p>
                <p className="mt-2 text-sm font-medium text-slate-400">
                  product categories
                </p>
              </div>
              <div className="pl-8">
                <p className="text-5xl font-black text-white tracking-tight">10</p>
                <p className="mt-2 text-sm font-medium text-slate-400">
                  data points reviewed
                </p>
              </div>
            </div>
            <div className="mt-10 rounded-2xl bg-white/[0.03] p-5 text-sm leading-relaxed text-slate-300 ring-1 ring-white/10">
              A category is published only when it has at least 3 supplier
              leads that pass our checks. Weak categories are replaced instead
              of padded with poor leads.
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center lg:col-start-1 lg:row-start-2">
            <Link
              href="#pricing"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-orange-500 px-8 text-sm font-bold text-white shadow-lg shadow-brand-orange-500/20 transition-all hover:bg-brand-orange-600 hover:shadow-brand-orange-500/40"
            >
              View Plans
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/dashboard/intelligence"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-transparent px-8 text-sm font-bold text-white transition-all hover:bg-white/5 hover:text-brand-orange-300"
            >
              Member Login
            </Link>
          </div>
        </div>
      </section>

      {/* --- VALUE PROPS --- */}
      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

      {/* --- PRICING --- */}
      <section id="pricing" className="py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-center mx-auto md:text-left md:mx-0">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-orange-500">
              Subscription
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl text-balance">
              Pay for supplier research you can keep using, not a PDF.
            </h2>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {Object.values(intelligencePlans).map((plan) => (
              <div
                key={plan.key}
                className="flex flex-col rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50 sm:p-10"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 border-b border-slate-100 pb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                    <p className="mt-2 text-sm font-medium text-slate-500">
                      Billed monthly • Cancel anytime
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-4xl font-black tracking-tight text-slate-900">
                      <span className="text-2xl text-slate-400 font-bold mr-1">₦</span>
                      {plan.priceNaira.toLocaleString()}
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

                <div className="mt-auto pt-4">
                  <IntelligenceSignupForm plan={plan.key} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
