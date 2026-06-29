import Link from 'next/link';
import type { ReactNode } from 'react';
import { 
  Crown, 
  Database, 
  LockKeyhole, 
  MapPin,
  ShieldCheck, 
  Sparkles,
  Star,
} from 'lucide-react';

import { checkAuth } from '@/lib/auth/checkAuth';
import { getActiveIntelligenceSubscription } from '@/lib/intelligence/access';
import { getCompanyContactSettings } from '@/lib/intelligence/companyContacts';
import { getPassingNichesWithDb } from '@/lib/intelligence/data';
import { getConfiguredIntelligencePlan, getIntelligencePlans } from '@/lib/intelligence/plans';
import SubscribeButton from '@/components/intelligence/SubscribeButton';
import CategorySearchGrid from '@/components/intelligence/CategorySearchGrid';

export default async function DashboardIntelligencePage() {
  const user = await checkAuth();
  const subscription = await getActiveIntelligenceSubscription(user?.pidUser);
  const niches = await getPassingNichesWithDb();
  const companyContacts = await getCompanyContactSettings();
  const intelligencePlans = await getIntelligencePlans();
  const currentPlan = subscription ? await getConfiguredIntelligencePlan(subscription.plan) : null;
  const isPro = subscription?.plan === 'pro';
  const availableSupplierCount = niches.reduce(
    (total, niche) => total + niche.suppliers.length,
    0,
  );

  // ---------------------------------------------------------------------------
  // STATE 1: LOCKED / UNSUBSCRIBED
  // ---------------------------------------------------------------------------
  if (!subscription) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-200/50 sm:p-12">
          {/* Subtle Ambient Glow */}
          <div className="absolute left-1/2 top-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-brand-orange-500/10 blur-[100px] pointer-events-none" />
          
          <div className="relative flex flex-col items-center text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-50 border border-slate-100 shadow-sm text-brand-orange-500">
              <LockKeyhole className="h-8 w-8" />
            </div>
            
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Supplier Intelligence is locked
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-600">
              Subscribe to access a growing database of verified suppliers in
              China checked by Sure Imports across multiple data points, with
              buyer notes and support from our team on ground in China.
            </p>
          </div>

          <section className="relative mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-brand-orange-600">
                  What is inside today
                </p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
                  {niches.length} product categories with{' '}
                  {availableSupplierCount} checked supplier leads
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
                  Every visible category has at least 3 checked supplier leads,
                  buyer notes and contact routes reviewed by Sure Imports
                  before it is shown in the dashboard.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:w-[360px]">
                {[
                  { label: 'Categories', value: niches.length },
                  { label: 'Supplier leads', value: availableSupplierCount },
                  { label: 'Minimum per category', value: '3' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-white bg-white px-3 py-4 text-center shadow-sm"
                  >
                    <p className="text-xl font-black text-slate-900">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-[10px] font-bold uppercase leading-tight tracking-widest text-slate-500">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {niches.map((niche) => (
                <span
                  key={niche.slug}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm"
                >
                  {niche.name}
                </span>
              ))}
            </div>
          </section>

          <div className="relative mt-10 grid gap-5 lg:grid-cols-2">
            <LockedPlanCard
              title={intelligencePlans.starter.name}
              price={intelligencePlans.starter.priceNaira}
              description="For importers who want access to the supplier intelligence database."
              features={intelligencePlans.starter.features}
              action={
                <SubscribeButton
                  plan="starter"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 hover:text-slate-900"
                >
                  Subscribe to Starter
                </SubscribeButton>
              }
            />

            <LockedPlanCard
              title={intelligencePlans.pro.name}
              price={intelligencePlans.pro.priceNaira}
              description="For importers who want Sure Imports to review suppliers, quotes and payment details before they pay."
              features={intelligencePlans.pro.features}
              highlighted
              action={
                <SubscribeButton
                  plan="pro"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-orange-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-orange-500/20 transition-all hover:bg-brand-orange-600"
                >
                  Subscribe to Pro <Sparkles className="h-4 w-4" />
                </SubscribeButton>
              }
            />
          </div>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // STATE 2: ACTIVE / SUBSCRIBED
  // ---------------------------------------------------------------------------
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col gap-6 border-b border-slate-200 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-orange-600">
              Sure Imports Supplier Research
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
              Supplier Intelligence
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
              Explore product categories backed by Sure Imports checks. We only
              show categories with at least 3 supplier leads reviewed across our
              10-point supplier check.
            </p>
          </div>
          
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-bold capitalize text-amber-800 shadow-sm">
              <Crown className="h-4 w-4 text-amber-500" />
              Active {currentPlan?.name || subscription.plan} Plan
            </div>
            <Link
              href="/dashboard/intelligence/manage"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Manage plan
            </Link>
          </div>
        </div>

        {isPro ? (
          <section className="mt-8 overflow-hidden rounded-2xl border border-slate-900 bg-slate-950 p-6 text-white shadow-xl sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-brand-orange-500/30 bg-brand-orange-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-orange-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  Pro review support
                </div>
                <h2 className="mt-5 text-2xl font-extrabold">
                  Your Pro plan is active
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
                  Use the supplier intelligence database plus Sure Imports
                  review support for supplier details, quotes and invoice or
                  payment details before you pay.
                </p>
              </div>
              <Link
                href="/dashboard/intelligence/reviews"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand-orange-500/20 transition hover:bg-brand-orange-600"
              >
                <Sparkles className="h-4 w-4" />
                Submit review request
              </Link>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                {
                  title: 'Supplier review before payment',
                  body: 'Submit supplier links, company details and contact paths before sending money.',
                },
                {
                  title: 'Quote review before payment',
                  body: 'Check price, MOQ, lead time, hidden cost questions and supplier terms.',
                },
                {
                  title: 'Invoice and payment review',
                  body: 'Review invoice and payment details for mismatch risks before you commit.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
                >
                  <Star className="h-4 w-4 text-brand-orange-400" />
                  <h3 className="mt-4 text-sm font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="mt-8 rounded-2xl border border-brand-orange-200 bg-brand-orange-50 p-6 sm:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Upgrade for Pro importer tools
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-700">
                  Pro adds priority category requests, supplier outreach
                  templates, and quote comparison support.
                </p>
              </div>
              <SubscribeButton
                plan="pro"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand-orange-500/20 transition hover:bg-brand-orange-600"
              >
                Upgrade to Pro <Sparkles className="h-4 w-4" />
              </SubscribeButton>
            </div>
          </section>
        )}

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-orange-50 text-brand-orange-600">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Sure Imports Guangzhou Warehouse
                </p>
                <h2 className="mt-2 text-lg font-extrabold text-slate-900">
                  Use this when a supplier asks for your China delivery address
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
                  Tell the supplier you already have a freight forwarder in
                  Guangzhou. This helps them quote FOB price, domestic delivery
                  cost, packing details, CBM and weight more seriously.
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:w-[440px] lg:grid-cols-1">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  China Address
                </p>
                <p className="mt-1 text-sm font-bold leading-relaxed text-slate-900">
                  {companyContacts.chinaAddress}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  China Contact
                </p>
                <p className="mt-1 text-sm font-bold leading-relaxed text-slate-900">
                  {companyContacts.chinaContact}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Lagos Address
                </p>
                <p className="mt-1 text-sm font-bold leading-relaxed text-slate-900">
                  {companyContacts.lagosAddress}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Lagos Contact
                </p>
                <p className="mt-1 text-sm font-bold leading-relaxed text-slate-900">
                  {companyContacts.lagosContact}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- METRICS --- */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Product categories', value: niches.length, icon: Database },
            { label: 'Data points reviewed', value: '10', icon: ShieldCheck },
            { label: 'Dashboard-only access', value: 'No PDFs', icon: LockKeyhole },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-orange-50 text-brand-orange-500">
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs font-medium text-slate-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* --- NICHE DIRECTORY --- */}
        <CategorySearchGrid niches={niches} />

      </div>
    </main>
  );
}

function LockedPlanCard({
  title,
  price,
  description,
  features,
  action,
  highlighted = false,
}: {
  title: string;
  price: number;
  description: string;
  features: string[];
  action: ReactNode;
  highlighted?: boolean;
}) {
  return (
    <section
      className={`flex h-full flex-col rounded-2xl border p-6 text-left shadow-sm ${
        highlighted
          ? 'border-brand-orange-300 bg-brand-orange-50'
          : 'border-slate-200 bg-slate-50'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {description}
            </p>
          </div>
          {highlighted ? (
            <span className="shrink-0 rounded-full bg-brand-orange-500 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
              Most support
            </span>
          ) : null}
        </div>
        <p className="mt-6 text-3xl font-black text-slate-900">
          ₦{price.toLocaleString('en-NG')}
          <span className="text-sm font-bold text-slate-500"> / month</span>
        </p>
      </div>

      <ul className="mt-6 grid gap-3">
        {features.map((feature) => (
          <li key={feature} className="flex gap-3 text-sm leading-relaxed text-slate-700">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange-500" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6">{action}</div>
    </section>
  );
}
