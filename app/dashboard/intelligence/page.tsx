import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  Crown,
  Database,
  Gift,
  LockKeyhole,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react';

import { checkAuth } from '@/lib/auth/checkAuth';
import { getActiveIntelligenceSubscription } from '@/lib/intelligence/access';
import { getCompanyContactSettings } from '@/lib/intelligence/companyContacts';
import {
  getOrCreateIntelligenceCreditAccount,
  getUserIntelligenceSearchRequests,
} from '@/lib/intelligence/credits';
import { getPassingNichesWithDb } from '@/lib/intelligence/data';
import {
  getConfiguredIntelligencePlan,
  getIntelligencePlans,
} from '@/lib/intelligence/plans';
import SubscribeButton from '@/components/intelligence/SubscribeButton';
import CategorySearchGrid from '@/components/intelligence/CategorySearchGrid';
import SearchCreditRequestForm from '@/components/intelligence/SearchCreditRequestForm';

export default async function DashboardIntelligencePage() {
  const user = await checkAuth();
  const subscription = await getActiveIntelligenceSubscription(user?.pidUser);
  const niches = await getPassingNichesWithDb();
  const companyContacts = await getCompanyContactSettings();
  const intelligencePlans = await getIntelligencePlans();
  const currentPlan = subscription
    ? await getConfiguredIntelligencePlan(subscription.plan)
    : null;
  const creditAccount = await getOrCreateIntelligenceCreditAccount(
    user?.pidUser,
  );
  const searchRequests = await getUserIntelligenceSearchRequests(user?.pidUser);
  const isPro = subscription?.plan === 'pro';
  const availableSupplierCount = niches.reduce(
    (total, niche) => total + niche.suppliers.length,
    0,
  );

  // ---------------------------------------------------------------------------
  // STATE 1: FREEMIUM / UNSUBSCRIBED
  // ---------------------------------------------------------------------------
  if (!subscription) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/50 sm:p-10 lg:p-12">
          {/* Subtle Ambient Glow */}
          <div className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-brand-orange-500/10 blur-[100px]" />

          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-orange-200 bg-brand-orange-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-orange-700">
                <Gift className="h-3.5 w-3.5" />
                Free supplier search included
              </div>

              <h1 className="mt-5 max-w-3xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Start with one free supplier search
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
                Use your free credit to ask Sure Imports to research a product
                category. When intelligence is available, you can view a result
                summary and one approved supplier lead before subscribing for
                full supplier details.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  {
                    icon: Search,
                    title: 'Request research',
                    body: 'Tell us the product category you want checked.',
                  },
                  {
                    icon: ShieldCheck,
                    title: 'Result summary',
                    body: 'See the first approved supplier lead when intelligence is available.',
                  },
                  {
                    icon: Database,
                    title: 'Full details',
                    body: 'Subscribe when you want all approved suppliers and the full database.',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <item.icon className="h-5 w-5 text-brand-orange-500" />
                    <h2 className="mt-3 text-sm font-extrabold text-slate-900">
                      {item.title}
                    </h2>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-orange-600">
                Database preview
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
                {niches.length} categories already available
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Subscribe to unlock the approved supplier leads, contact routes
                and buyer notes behind these categories.
              </p>
              <Link
                href="/supplier-intelligence/reports"
                className="mt-4 inline-flex items-center gap-2 text-sm font-black text-brand-orange-600 hover:text-brand-orange-700"
              >
                Prefer a one-time report? Browse reports
              </Link>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  { label: 'Categories', value: niches.length },
                  { label: 'Supplier leads', value: availableSupplierCount },
                  { label: 'Free credit', value: creditAccount?.balance || 1 },
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
          </div>

          {user?.pidUser ? (
            <div className="relative mt-10">
              <SearchCreditRequestForm
                account={creditAccount}
                requests={searchRequests}
                starterMonthlyCredits={
                  intelligencePlans.starter.monthlySearchCredits
                }
                proMonthlyCredits={intelligencePlans.pro.monthlySearchCredits}
                extraCreditPriceNaira={
                  intelligencePlans.pro.extraCreditPriceNaira
                }
                canOpenCategories={false}
                compact
              />
            </div>
          ) : (
            <section className="relative mt-10 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <h2 className="text-lg font-extrabold text-slate-900">
                Create an account to use your free search credit
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
                Free users can search one product category and view a limited
                result when intelligence is available. Subscribe when you want
                full supplier details.
              </p>
              <Link
                href="/auth/login"
                className="mt-5 inline-flex items-center justify-center rounded-xl bg-brand-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-orange-600"
              >
                Log in to continue
              </Link>
            </section>
          )}

          <section className="relative mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-brand-orange-600">
                  Available categories
                </p>
                <h2 className="mt-2 text-xl font-extrabold tracking-tight text-slate-900">
                  Preview what subscribers can unlock
                </h2>
              </div>
              <p className="text-sm font-semibold text-slate-500">
                {availableSupplierCount} checked supplier leads
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
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

          <div className="relative mt-10 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Need full access?
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
              Choose the plan that matches how much support you need
            </h2>
          </div>

          <div className="relative mt-5 text-center">
            <Link
              href="/dashboard/my-reports"
              className="text-sm font-bold text-brand-orange-600 hover:text-brand-orange-700"
            >
              My Supplier Reports
            </Link>
          </div>

          <div className="relative mt-10 grid gap-5 lg:grid-cols-2">
            <LockedPlanCard
              title={intelligencePlans.starter.name}
              price={intelligencePlans.starter.priceNaira}
              description="For importers who want database access plus one monthly supplier search credit."
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
              href="/dashboard/my-reports"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              My Supplier Reports
            </Link>
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

        <div className="mt-8">
          <SearchCreditRequestForm
            account={creditAccount}
            requests={searchRequests}
            starterMonthlyCredits={
              intelligencePlans.starter.monthlySearchCredits
            }
            proMonthlyCredits={intelligencePlans.pro.monthlySearchCredits}
            extraCreditPriceNaira={
              currentPlan?.extraCreditPriceNaira ||
              intelligencePlans.pro.extraCreditPriceNaira
            }
            canOpenCategories={true}
          />
        </div>

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
            {
              label: 'Product categories',
              value: niches.length,
              icon: Database,
            },
            { label: 'Data points reviewed', value: '10', icon: ShieldCheck },
            {
              label: 'Dashboard-only access',
              value: 'No PDFs',
              icon: LockKeyhole,
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-orange-50 text-brand-orange-500">
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs font-medium text-slate-500">
                  {stat.label}
                </p>
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
          <li
            key={feature}
            className="flex gap-3 text-sm leading-relaxed text-slate-700"
          >
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange-500" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6">{action}</div>
    </section>
  );
}
