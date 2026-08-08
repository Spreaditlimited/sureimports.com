'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import {
  Bot,
  Clock3,
  CreditCard,
  Database,
  Loader2,
  PackageCheck,
  Search,
  ShieldCheck,
} from 'lucide-react';

import {
  createIntelligenceSearchRequest,
  type SearchCreditRequestState,
} from '@/app/dashboard/intelligence/search/actions';
import type {
  IntelligenceCreditAccount,
  IntelligenceSearchRequest,
} from '@/lib/intelligence/credits';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const initialState: SearchCreditRequestState = {
  success: false,
  message: '',
  existingMatches: [],
};

type ResearchProgress = {
  pidSearch: string;
  query: string;
  status: string;
  progressStage: string | null;
  progressPercent: number;
  adminNotes: string | null;
  draft?: {
    nicheName: string;
    summary: string;
    suppliers: Array<{
      supplierName: string;
      productFit: string;
      officialWebsite?: string;
      countryRegion?: string;
      buyerNotes?: string;
    }>;
  } | null;
};

const progressSteps = [
  { percent: 10, label: 'Starting supplier research' },
  { percent: 18, label: 'Preparing the supplier research query' },
  {
    percent: 34,
    label: 'Searching official supplier and manufacturer sources',
  },
  { percent: 62, label: 'Checking contact routes and company evidence' },
  { percent: 82, label: 'Building supplier shortlist and buyer notes' },
  {
    percent: 100,
    label: 'Manual Sure Imports specialist check',
  },
];

function statusLabel(status: string) {
  if (status === 'fulfilled_existing') return 'result delivered';
  return status.replace(/_/g, ' ');
}

function statusClass(status: string) {
  if (status === 'approved' || status === 'fulfilled_existing') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  }
  if (status === 'rejected' || status === 'failed' || status === 'invalid')
    return 'border-red-200 bg-red-50 text-red-700';
  if (status === 'running' || status === 'awaiting_approval') {
    return 'border-blue-200 bg-blue-50 text-blue-700';
  }
  return 'border-amber-200 bg-amber-50 text-amber-700';
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand-orange-500/20 transition hover:bg-brand-orange-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Search className="h-4 w-4" />
      )}
      {pending ? 'Searching...' : 'Search suppliers'}
    </button>
  );
}

function ConfirmSearchButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand-orange-500/20 transition hover:bg-brand-orange-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <PackageCheck className="h-4 w-4" />
      )}
      {pending ? 'Confirming...' : 'Confirm and continue'}
    </button>
  );
}

function BuyCreditsPanel({
  extraCreditPriceNaira,
}: {
  extraCreditPriceNaira: number;
}) {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const total = quantity * extraCreditPriceNaira;

  async function handleCheckout() {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/intelligence/credits/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });

      if (response.status === 401) {
        window.location.href = `/auth/login?next=${encodeURIComponent(
          '/dashboard/intelligence',
        )}`;
        return;
      }

      const data = await response.json();
      if (!response.ok || !data.authorizationUrl) {
        throw new Error(data.message || 'Unable to start credit checkout.');
      }

      window.location.href = data.authorizationUrl;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to start credit checkout.',
      );
      setIsLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Buy extra credits
          </p>
          <p className="mt-1 text-sm font-semibold leading-relaxed text-slate-700">
            ₦{extraCreditPriceNaira.toLocaleString('en-NG')} per supplier search
            credit.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="grid grid-cols-4 gap-2 rounded-xl border border-slate-200 bg-white p-1.5">
            {[1, 3, 5, 10].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setQuantity(count)}
                className={`h-10 rounded-lg px-3 text-sm font-black transition ${
                  quantity === count
                    ? 'bg-brand-orange-500 text-white'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {count}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleCheckout}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CreditCard className="h-4 w-4" />
            )}
            {isLoading
              ? 'Starting checkout...'
              : `Pay ₦${total.toLocaleString('en-NG')}`}
          </button>
        </div>
      </div>

      {error ? (
        <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default function SearchCreditRequestForm({
  account,
  requests,
  starterMonthlyCredits,
  proMonthlyCredits,
  extraCreditPriceNaira,
  canOpenCategories,
  compact = false,
}: {
  account: IntelligenceCreditAccount | null;
  requests: IntelligenceSearchRequest[];
  starterMonthlyCredits: number;
  proMonthlyCredits: number;
  extraCreditPriceNaira: number;
  canOpenCategories: boolean;
  compact?: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(
    createIntelligenceSearchRequest,
    initialState,
  );
  const [activeSearchId, setActiveSearchId] = useState<string | null>(null);
  const [progress, setProgress] = useState<ResearchProgress | null>(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const balance = account?.balance || 0;

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  useEffect(() => {
    if (!state.success || !state.pidSearch) return;
    setActiveSearchId(state.pidSearch);
    setProgress(null);
  }, [state.success, state.pidSearch]);

  useEffect(() => {
    setConfirmationOpen(Boolean(state.confirmation));
  }, [state.confirmation]);

  useEffect(() => {
    if (!activeSearchId) return;
    const searchId = activeSearchId;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    async function poll() {
      try {
        const response = await fetch(
          `/api/intelligence/search/status?pidSearch=${encodeURIComponent(
            searchId,
          )}`,
          { cache: 'no-store' },
        );
        const data = await response.json();

        if (!cancelled && response.ok && data.data) {
          setProgress(data.data);
          if (
            !['awaiting_approval', 'approved', 'rejected', 'failed'].includes(
              data.data.status,
            )
          ) {
            timeoutId = setTimeout(poll, 2500);
          }
        } else if (!cancelled) {
          timeoutId = setTimeout(poll, 3500);
        }
      } catch {
        if (!cancelled) timeoutId = setTimeout(poll, 3500);
      }
    }

    poll();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [activeSearchId]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm sm:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-orange-200 bg-brand-orange-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-orange-700">
            <Bot className="h-3.5 w-3.5" />
            Search credits
          </div>
          <h2 className="mt-4 text-xl font-extrabold text-slate-900">
            Find manufacturers for a specific product
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            {canOpenCategories
              ? 'Enter the physical product you want manufacturers for. Existing categories open without using a credit; fresh research uses one credit only after you confirm the interpreted product.'
              : 'Enter the physical product you want manufacturers for. We show exactly what will be searched before a credit can be used. Fresh research starts only after Sure Imports confirms that the request is in scope.'}{' '}
            Starter includes {starterMonthlyCredits} monthly supplier search{' '}
            {starterMonthlyCredits === 1 ? 'credit' : 'credits'}; Pro includes{' '}
            {proMonthlyCredits} monthly supplier search{' '}
            {proMonthlyCredits === 1 ? 'credit' : 'credits'}. Extra credits are
            priced at ₦{extraCreditPriceNaira.toLocaleString('en-NG')} each.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
          <p className="text-2xl font-black text-slate-900">{balance}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Credits available
          </p>
        </div>
      </div>

      <div className="mt-5">
        <BuyCreditsPanel extraCreditPriceNaira={extraCreditPriceNaira} />
      </div>

      <form ref={formRef} action={formAction} className="mt-6 grid gap-4">
        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              What product do you want manufacturers for?
            </span>
            <input
              name="query"
              required
              placeholder="Example: Commercial supermarket shelves, steel, adjustable"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-brand-orange-300 focus:ring-2 focus:ring-brand-orange-100"
            />
          </label>
          <fieldset className="block">
            <legend className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Suppliers
            </legend>
            <div className="mt-2 grid grid-cols-4 gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2">
              {[3, 5, 8, 10].map((count) => (
                <label key={count} className="group relative cursor-pointer">
                  <input
                    type="radio"
                    name="targetSupplierCount"
                    value={count}
                    defaultChecked={count === 5}
                    className="peer sr-only"
                  />
                  <span className="flex h-11 items-center justify-center rounded-xl border border-transparent bg-white px-3 text-sm font-black text-slate-600 shadow-sm transition group-hover:text-slate-900 peer-checked:border-brand-orange-300 peer-checked:bg-brand-orange-500 peer-checked:text-white peer-checked:group-hover:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-brand-orange-200">
                    {count}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Helpful notes
          </span>
          <textarea
            name="notes"
            rows={compact ? 3 : 4}
            placeholder="Mention exact products, quality level, target budget, or supplier types you want avoided."
            className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium leading-relaxed text-slate-900 outline-none transition focus:border-brand-orange-300 focus:ring-2 focus:ring-brand-orange-100"
          />
        </label>

        <p className="-mt-2 text-xs font-medium leading-relaxed text-slate-500">
          Enter a physical product—not customers, target markets, business
          ideas, locations, or where to sell.
        </p>

        {state.message && !state.confirmation ? (
          <p
            className={`rounded-xl px-4 py-3 text-sm font-semibold ${
              state.success
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {state.message}
          </p>
        ) : null}

        {state.suggestions && state.suggestions.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {state.suggestions.map((suggestion) => (
              <span
                key={suggestion}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600"
              >
                {suggestion}
              </span>
            ))}
          </div>
        ) : null}

        {progress ? <ResearchProgressPanel progress={progress} /> : null}

        {state.existingMatches && state.existingMatches.length > 0 ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-emerald-950">
                  {canOpenCategories
                    ? 'Category already exists'
                    : 'Supplier intelligence result found'}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-emerald-800">
                  {canOpenCategories
                    ? 'No search credit was used. Open the category to view the supplier details.'
                    : 'One credit was used to return this supplier intelligence result.'}
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-2">
              {state.existingMatches.map((match) => (
                <div
                  key={match.slug}
                  className="flex flex-col gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {match.name}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      {match.supplierCount} checked supplier leads available
                    </p>
                  </div>
                  {canOpenCategories ? (
                    <Link
                      href={`/dashboard/intelligence/${match.slug}`}
                      className="text-xs font-bold text-brand-orange-600 hover:text-brand-orange-700"
                    >
                      Open category
                    </Link>
                  ) : (
                    <Link
                      href={`/dashboard/intelligence/${match.slug}`}
                      className="text-xs font-bold text-brand-orange-600 hover:text-brand-orange-700"
                    >
                      Open result
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2 text-xs font-semibold leading-relaxed text-slate-500">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange-500" />
            {canOpenCategories
              ? 'Existing categories do not use credits for subscribed users. New research requests use one credit.'
              : 'Each search uses one credit. If admin rejects a fresh research request, the credit is returned.'}
          </p>
          <SubmitButton disabled={!canOpenCategories && balance < 1} />
        </div>
      </form>

      {requests.length > 0 ? (
        <div className="mt-8 border-t border-slate-100 pt-6">
          <h3 className="text-sm font-extrabold text-slate-900">
            Recent search requests
          </h3>
          <div className="mt-3 grid gap-3">
            {requests.slice(0, compact ? 3 : 6).map((request) => (
              <div
                key={request.pidSearch}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-bold text-slate-900">
                    {request.query}
                  </p>
                  <span
                    className={`w-fit rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${statusClass(
                      request.status,
                    )}`}
                  >
                    {statusLabel(request.status)}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
                  <span>{request.targetSupplierCount} suppliers requested</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="h-3.5 w-3.5" />
                    {new Date(request.createdAt).toLocaleDateString('en-NG')}
                  </span>
                </div>
                {request.adminNotes ? (
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    {request.adminNotes}
                  </p>
                ) : null}
                {request.status === 'approved' && request.resultSlug ? (
                  <div className="mt-3">
                    <Link
                      href={`/dashboard/intelligence/${request.resultSlug}`}
                      className="inline-flex items-center justify-center rounded-lg bg-brand-orange-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-orange-600"
                    >
                      Open approved supplier details
                    </Link>
                  </div>
                ) : null}
                {['awaiting_admin', 'running', 'awaiting_approval'].includes(
                  request.status,
                ) ? (
                  <div className="mt-3">
                    <div className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      <span>
                        {request.progressStage || statusLabel(request.status)}
                      </span>
                      <span>{request.progressPercent || 0}%</span>
                    </div>
                    <div className="mt-2 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-1.5 rounded-full bg-brand-orange-500"
                        style={{
                          width: `${Math.max(
                            0,
                            Math.min(100, request.progressPercent || 0),
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] overflow-hidden rounded-[32px] border-0 bg-white p-0 shadow-2xl sm:max-w-md">
          {state.confirmation ? (
            <>
              <div className="bg-slate-950 p-6 text-white sm:p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-orange-500 shadow-lg shadow-brand-orange-500/25">
                  <PackageCheck className="h-6 w-6" />
                </div>
                <DialogHeader className="mt-5 text-left">
                  <DialogTitle className="text-xl font-extrabold text-white">
                    Confirm the product search
                  </DialogTitle>
                  <DialogDescription className="pt-2 leading-relaxed text-slate-300">
                    Check our interpretation before any search credit can be
                    used.
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="p-6 sm:p-7">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  We will search for manufacturers of
                </p>
                <div className="mt-3 rounded-2xl border border-brand-orange-200 bg-brand-orange-50 p-4">
                  <p className="text-base font-extrabold text-slate-950">
                    {state.confirmation.canonicalQuery}
                  </p>
                </div>
                <p className="mt-4 flex items-start gap-2 text-xs font-semibold leading-relaxed text-slate-600">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange-500" />
                  {state.confirmation.existingCategory
                    ? canOpenCategories
                      ? 'This category already exists and no credit will be used.'
                      : 'This category already exists. One credit will unlock the available supplier intelligence.'
                    : 'One credit will be reserved. External research will begin only after Sure Imports approves the product request.'}
                </p>

                <form action={formAction} className="mt-6">
                  <input
                    type="hidden"
                    name="query"
                    value={state.confirmation.originalQuery}
                  />
                  <input
                    type="hidden"
                    name="confirmedQuery"
                    value={state.confirmation.canonicalQuery}
                  />
                  <input
                    type="hidden"
                    name="notes"
                    value={state.confirmation.notes}
                  />
                  <input
                    type="hidden"
                    name="targetSupplierCount"
                    value={state.confirmation.targetSupplierCount}
                  />
                  <DialogFooter className="gap-3 sm:space-x-0">
                    <DialogClose asChild>
                      <button
                        type="button"
                        className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                      >
                        Edit request
                      </button>
                    </DialogClose>
                    <ConfirmSearchButton />
                  </DialogFooter>
                </form>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}

function ResearchProgressPanel({ progress }: { progress: ResearchProgress }) {
  const percent = Math.max(
    0,
    Math.min(100, Math.round(Number(progress.progressPercent || 0))),
  );
  const isComplete = progress.status === 'awaiting_approval';
  const isFailed = progress.status === 'failed';
  const isPendingApproval = progress.status === 'awaiting_admin';
  const currentStage =
    progress.progressStage ||
    (isPendingApproval
      ? 'Waiting for Sure Imports to confirm that this is a valid physical-product request.'
      : isComplete
        ? 'Research complete. Now being manually checked by Sure Imports specialists.'
        : 'Research in progress');

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 text-white shadow-xl">
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-brand-orange-300">
              {isPendingApproval
                ? 'Product request review'
                : 'Live supplier search'}
            </p>
            <h3 className="mt-2 text-lg font-extrabold">{progress.query}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              {currentStage}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center">
            <p className="text-2xl font-black">{percent}%</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Progress
            </p>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-2 rounded-full bg-brand-orange-500 transition-all duration-700"
            style={{ width: `${percent}%` }}
          />
        </div>

        {isPendingApproval ? (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-brand-orange-400/20 bg-brand-orange-400/10 p-4 text-sm leading-relaxed text-brand-orange-100">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
            No external supplier research has started. If Sure Imports declines
            the request, the reserved credit is returned automatically.
          </div>
        ) : (
          <div className="mt-5 grid gap-2">
            {progressSteps.map((step) => {
              const done = percent >= step.percent;
              const active =
                percent < step.percent &&
                progressSteps.find((item) => percent < item.percent)
                  ?.percent === step.percent;

              return (
                <div
                  key={step.label}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-xs font-semibold ${
                    done
                      ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200'
                      : active
                        ? 'border-brand-orange-400/30 bg-brand-orange-400/10 text-brand-orange-100'
                        : 'border-white/10 bg-white/[0.03] text-slate-400'
                  }`}
                >
                  {done ? (
                    <ShieldCheck className="h-4 w-4 shrink-0" />
                  ) : active ? (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                  ) : (
                    <Clock3 className="h-4 w-4 shrink-0" />
                  )}
                  {step.label}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isComplete && progress.draft ? (
        <div className="relative border-t border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-slate-950/55 px-5 backdrop-blur-[3px]">
            <div className="max-w-md rounded-2xl border border-brand-orange-400/30 bg-slate-950/90 p-5 text-center shadow-2xl">
              <ShieldCheck className="mx-auto h-8 w-8 text-brand-orange-300" />
              <h4 className="mt-3 text-base font-extrabold">
                Now being manually checked by Sure Imports specialists.
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                The first research pass is complete. Our team is checking the
                supplier shortlist before the result is released.
              </p>
            </div>
          </div>

          <div className="blur-[2px]">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Draft result preview
            </p>
            <h4 className="mt-2 text-xl font-black">
              {progress.draft.nicheName}
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              {progress.draft.summary}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {progress.draft.suppliers.slice(0, 4).map((supplier) => (
                <div
                  key={supplier.supplierName}
                  className="rounded-xl border border-white/10 bg-white/[0.04] p-4"
                >
                  <p className="text-sm font-extrabold">
                    {supplier.supplierName}
                  </p>
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-300">
                    {supplier.productFit}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {isFailed ? (
        <div className="border-t border-red-400/20 bg-red-500/10 p-5 text-sm font-semibold text-red-200">
          {progress.adminNotes ||
            'Research failed. The credit will be reviewed by Sure Imports.'}
        </div>
      ) : null}
    </div>
  );
}
