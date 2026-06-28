import Link from 'next/link';
import { 
  ArrowRight, 
  Crown, 
  Database, 
  LockKeyhole, 
  ShieldCheck, 
  Sparkles,
  Star,
} from 'lucide-react';

import { checkAuth } from '@/lib/auth/checkAuth';
import { getActiveIntelligenceSubscription } from '@/lib/intelligence/access';
import { getPassingNiches } from '@/lib/intelligence/data';
import { getIntelligencePlan } from '@/lib/intelligence/plans';
import SubscribeButton from '@/components/intelligence/SubscribeButton';

export default async function DashboardIntelligencePage() {
  const user = await checkAuth();
  const subscription = await getActiveIntelligenceSubscription(user?.pidUser);
  const niches = getPassingNiches();
  const currentPlan = subscription ? getIntelligencePlan(subscription.plan) : null;
  const isPro = subscription?.plan === 'pro';

  // ---------------------------------------------------------------------------
  // STATE 1: LOCKED / UNSUBSCRIBED
  // ---------------------------------------------------------------------------
  if (!subscription) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-200/50 sm:p-16 text-center">
          {/* Subtle Ambient Glow */}
          <div className="absolute left-1/2 top-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-brand-orange-500/10 blur-[100px] pointer-events-none" />
          
          <div className="relative flex flex-col items-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-50 border border-slate-100 shadow-sm text-brand-orange-500">
              <LockKeyhole className="h-8 w-8" />
            </div>
            
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Supplier Intelligence is locked
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-600">
              Subscribe to access China supplier leads checked by Sure Imports
              across multiple data points, with buyer notes and support from our
              team on ground in China.
            </p>
            
            <div className="mt-10 flex w-full max-w-md flex-col gap-4 sm:flex-row">
              <SubscribeButton
                plan="starter"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 hover:text-slate-900"
              >
                Subscribe to Starter
              </SubscribeButton>
              <SubscribeButton
                plan="pro"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-orange-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-orange-500/20 transition-all hover:bg-brand-orange-600"
              >
                Subscribe to Pro <Sparkles className="h-4 w-4" />
              </SubscribeButton>
            </div>
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
                  Pro Importer tools
                </div>
                <h2 className="mt-5 text-2xl font-extrabold">
                  Your Pro plan is active
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
                  Use the supplier directory with stronger buying support:
                  priority category requests, supplier outreach templates, and
                  quote comparison guidance before you pay any supplier.
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
                  title: 'Supplier and quote review',
                  body: 'Submit supplier links, quotes, invoice details or product decisions before you pay.',
                },
                {
                  title: 'Priority research requests',
                  body: 'Ask Sure Imports to prioritize a product category you want to investigate next.',
                },
                {
                  title: 'Quote comparison guidance',
                  body: 'Compare supplier responses using landed cost, payment terms and risk signals.',
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
        <div className="mt-12">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Available Categories</h2>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {niches.map((niche) => (
              <Link
                key={niche.slug}
                href={`/dashboard/intelligence/${niche.slug}`}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-brand-orange-300 hover:shadow-md"
              >
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-orange-600 transition-colors">
                    {niche.name}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    {niche.suppliers.length} checked supplier contacts
                  </p>
                </div>
                
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-sm font-bold text-brand-orange-600">
                    View suppliers
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-colors group-hover:bg-brand-orange-50 group-hover:text-brand-orange-600">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
