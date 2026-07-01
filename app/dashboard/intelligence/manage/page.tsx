import Link from 'next/link';
import { 
  Activity,
  ArrowRight, 
  Calendar,
  CheckCircle2, 
  ChevronLeft, 
  CreditCard, 
  Crown, 
  Hash, 
  LockKeyhole, 
  Sparkles, 
  Zap
} from 'lucide-react';

import { checkAuth } from '@/lib/auth/checkAuth';
import { getActiveIntelligenceSubscription } from '@/lib/intelligence/access';
import { getConfiguredIntelligencePlan, getIntelligencePlans } from '@/lib/intelligence/plans';
import SubscribeButton from '@/components/intelligence/SubscribeButton';
import ManagePaystackButton from '@/components/intelligence/ManagePaystackButton';

function formatNaira(amount: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date?: Date | null) {
  if (!date) return 'Not available';
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export default async function ManageIntelligencePlanPage() {
  const user = await checkAuth();
  const subscription = await getActiveIntelligenceSubscription(user?.pidUser);
  const intelligencePlans = await getIntelligencePlans();

  // ---------------------------------------------------------------------------
  // STATE 1: NO ACTIVE SUBSCRIPTION
  // ---------------------------------------------------------------------------
  if (!subscription) {
    return (
      <main className="flex min-h-screen flex-col bg-slate-50/50 text-slate-950 antialiased selection:bg-brand-orange-500/30">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/dashboard/intelligence"
            className="group inline-flex items-center gap-3 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition-colors group-hover:bg-slate-50">
              <ChevronLeft className="h-4 w-4" />
            </span>
            Back to Directory
          </Link>

          <section className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-brand-orange-600">
                  Choose Your Access
                </p>
                <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                  Upgrade your Supplier Intelligence plan
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600">
                  Pick the plan that matches how you buy from China. Starter gives you the supplier database. Pro adds review support before you pay any supplier.
                </p>
              </div>
              <div className="rounded-2xl border border-brand-orange-100 bg-brand-orange-50 p-5">
                <div className="flex items-start gap-3">
                  <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange-600" />
                  <p className="text-sm font-medium leading-relaxed text-slate-700">
                    You do not currently have an active paid plan. Select Starter or Pro below to continue.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {(['starter', 'pro'] as const).map((planKey) => {
                const plan = intelligencePlans[planKey];
                const isPro = planKey === 'pro';

                return (
                  <article
                    key={plan.key}
                    className={`relative flex h-full flex-col rounded-[2rem] border p-6 shadow-sm sm:p-8 ${
                      isPro
                        ? 'border-brand-orange-300 bg-slate-950 text-white shadow-brand-orange-500/10'
                        : 'border-slate-200 bg-white text-slate-950'
                    }`}
                  >
                    {isPro ? (
                      <div className="absolute right-6 top-6 rounded-full bg-brand-orange-500 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white">
                        Best Value
                      </div>
                    ) : null}

                    <div className="pr-28">
                      <p
                        className={`text-xs font-bold uppercase tracking-widest ${
                          isPro ? 'text-brand-orange-300' : 'text-brand-orange-600'
                        }`}
                      >
                        {planKey === 'starter' ? 'Database Access' : 'Database + Review'}
                      </p>
                      <h2 className="mt-3 text-2xl font-extrabold tracking-tight">
                        {plan.name}
                      </h2>
                    </div>

                    <div className="mt-6 flex items-end gap-2">
                      <p className="text-4xl font-black tracking-tight">
                        {formatNaira(plan.priceNaira)}
                      </p>
                      <p
                        className={`pb-1 text-sm font-semibold ${
                          isPro ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        / month
                      </p>
                    </div>

                    <p
                      className={`mt-5 text-sm leading-relaxed ${
                        isPro ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {planKey === 'starter'
                        ? 'Best for importers who want access to the researched supplier database and buyer notes.'
                        : 'Best for importers who want supplier data plus quote, invoice, and supplier review support before payment.'}
                    </p>

                    <ul className="mt-7 grid flex-1 gap-4">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className={`flex items-start gap-3 text-sm ${
                            isPro ? 'text-slate-300' : 'text-slate-600'
                          }`}
                        >
                          <CheckCircle2
                            className={`mt-0.5 h-4 w-4 shrink-0 ${
                              isPro ? 'text-brand-orange-400' : 'text-brand-orange-500'
                            }`}
                          />
                          <span className="leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8">
                      <SubscribeButton
                        plan={plan.key}
                        className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-sm font-bold transition-all ${
                          isPro
                            ? 'bg-brand-orange-500 text-white shadow-lg shadow-brand-orange-500/20 hover:bg-brand-orange-600'
                            : 'border border-slate-200 bg-slate-950 text-white hover:bg-slate-800'
                        }`}
                      >
                        {isPro ? 'Upgrade to Pro' : 'Subscribe to Starter'}
                        <ArrowRight className="h-4 w-4" />
                      </SubscribeButton>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // STATE 2: ACTIVE SUBSCRIPTION
  // ---------------------------------------------------------------------------
  const currentPlan = await getConfiguredIntelligencePlan(subscription.plan);
  const proPlan = intelligencePlans.pro;
  const canUpgrade = subscription.plan !== 'pro';
  const isNonRenewing = subscription.status === 'non_renewing' || Boolean(subscription.cancelledAt);

  return (
    <main className="min-h-screen bg-slate-50/50 px-4 py-8 text-slate-950 antialiased selection:bg-brand-orange-500/30 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        
        {/* --- Top Navigation --- */}
        <div className="mb-8">
          <Link
            href="/dashboard/intelligence"
            className="group inline-flex items-center gap-3 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition-colors group-hover:bg-slate-50">
              <ChevronLeft className="h-4 w-4" />
            </span>
            Back to Directory
          </Link>
        </div>

        {/* --- Header --- */}
        <div className="flex flex-col gap-6 border-b border-slate-200 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-orange-600">
              Billing & Subscription
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl text-balance">
              Manage Plan
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
              Review your current access, manage your Paystack billing details, or upgrade your plan to unlock more capabilities.
            </p>
          </div>
          <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold capitalize text-emerald-800 shadow-sm">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            {isNonRenewing ? 'Cancels' : 'Active'} {currentPlan.name}
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-10">
          
          {/* --- LEFT COLUMN: Current Plan Details --- */}
          <section className="flex flex-col rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-slate-100 pb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Current Plan</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {currentPlan.name}
                </h2>
                <p className="mt-2 font-medium text-slate-500">
                  {formatNaira(currentPlan.priceNaira)} / month
                </p>
              </div>
              <div className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-orange-50 text-brand-orange-500">
                <CreditCard className="h-6 w-6" />
              </div>
            </div>

            {/* Plan Metrics */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <div className="mb-3 text-slate-400"><Activity className="h-4 w-4" /></div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</p>
                <p className="mt-1 text-sm font-bold capitalize text-slate-900">
                  {subscription.status.replace(/_/g, ' ')}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <div className="mb-3 text-slate-400"><Calendar className="h-4 w-4" /></div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {isNonRenewing ? 'Access Ends On' : 'Renews On'}
                </p>
                <p className="mt-1 text-sm font-bold text-slate-900">
                  {formatDate(subscription.currentPeriodEnd)}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <div className="mb-3 text-slate-400"><Hash className="h-4 w-4" /></div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Reference</p>
                <p className="mt-1 break-all text-sm font-bold text-slate-900" title={subscription.paystackReference || subscription.pidSubscription}>
                  {subscription.paystackReference || subscription.pidSubscription.split('-')[0]}
                </p>
              </div>
            </div>

            {/* Features */}
            {isNonRenewing ? (
              <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                  <div>
                    <h3 className="text-sm font-extrabold text-amber-950">
                      Your subscription has been cancelled
                    </h3>
                    <p className="mt-1 text-sm font-medium leading-relaxed text-amber-900">
                      You still have Supplier Intelligence access until{' '}
                      <strong>{formatDate(subscription.currentPeriodEnd)}</strong>.
                      After this date, access will stop unless you subscribe again.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Features */}
            <div className="mt-10">
              <h3 className="text-sm font-bold text-slate-900">Included Features</h3>
              <ul className="mt-5 grid gap-4">
                {currentPlan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange-500/80" />
                    <span className="leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Billing Action Area */}
            <div className="mt-10 pt-8 border-t border-slate-100">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm text-brand-orange-600">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900">
                      Paystack billing
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
                      Update your card, cancel renewal, or manage billing details.
                    </p>
                  </div>
                </div>
                <div className="mt-5">
                  <ManagePaystackButton
                    className="inline-flex w-full min-w-[170px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-100 hover:text-slate-900 sm:w-auto"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* --- RIGHT COLUMN: Upgrade / Highest Plan --- */}
          <aside className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950 p-8 text-white shadow-2xl sm:p-10 h-fit">
            {canUpgrade ? (
              <>
                {/* Accent glow */}
                <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 -translate-y-12 translate-x-12 rounded-full bg-brand-orange-500/20 blur-[60px]" />
                
                <div className="relative">
                  <div className="inline-flex items-center gap-2 rounded-full border border-brand-orange-500/30 bg-brand-orange-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-orange-300">
                    Upgrade Available
                  </div>
                  <h2 className="mt-6 text-3xl font-bold tracking-tight">
                    Move to {proPlan.name}
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-slate-400">
                    Upgrade for priority category requests, watchlist support, and unlimited deep-dive supplier research.
                  </p>
                  
                  <div className="mt-8 border-t border-white/10 pt-8">
                    <p className="text-4xl font-black tracking-tight">
                      <span className="mr-1 text-2xl font-bold text-slate-500">₦</span>
                      {proPlan.priceNaira.toLocaleString()}
                      <span className="ml-2 text-sm font-medium text-slate-500">/ month</span>
                    </p>
                  </div>

                  <ul className="mt-8 grid gap-4">
                    {proPlan.features.slice(1).map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-slate-300">
                        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange-400" />
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-10">
                    <SubscribeButton
                      plan="pro"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-orange-500 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-brand-orange-500/20 transition-all hover:bg-brand-orange-600 hover:shadow-brand-orange-500/40"
                    >
                      Upgrade to Pro <ArrowRight className="h-4 w-4" />
                    </SubscribeButton>
                  </div>
                  
                  <p className="mt-5 text-center text-[11px] leading-relaxed text-slate-500">
                    Your access upgrades immediately. Any older recurring subscriptions will be managed and prorated during verification.
                  </p>
                </div>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center py-6">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                  <Crown className="h-8 w-8" />
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-300">
                  Highest Tier
                </div>
                <h2 className="mt-6 text-2xl font-bold tracking-tight">
                  You are on {proPlan.name}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-slate-400">
                  You currently hold the highest Supplier Intelligence plan available. You have full priority access to all features.
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
