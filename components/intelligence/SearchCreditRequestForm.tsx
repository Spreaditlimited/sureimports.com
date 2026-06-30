'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import {
  Bot,
  Clock3,
  Database,
  Loader2,
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

const initialState: SearchCreditRequestState = {
  success: false,
  message: '',
  existingMatches: [],
};

function statusLabel(status: string) {
  if (status === 'fulfilled_existing') return 'result delivered';
  return status.replace(/_/g, ' ');
}

function statusClass(status: string) {
  if (status === 'approved' || status === 'fulfilled_existing') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  }
  if (status === 'rejected' || status === 'failed')
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

export default function SearchCreditRequestForm({
  account,
  requests,
  proMonthlyCredits,
  extraCreditPriceNaira,
  canOpenCategories,
  compact = false,
}: {
  account: IntelligenceCreditAccount | null;
  requests: IntelligenceSearchRequest[];
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
  const balance = account?.balance || 0;

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm sm:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-orange-200 bg-brand-orange-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-orange-700">
            <Bot className="h-3.5 w-3.5" />
            Search credits
          </div>
          <h2 className="mt-4 text-xl font-extrabold text-slate-900">
            Ask Sure Imports to research a new product category
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            {canOpenCategories
              ? 'Search for a supplier category. If the category already exists, we link you to it without using a credit. If it needs fresh research, one credit is reserved while admin reviews the request.'
              : 'Search for a supplier category. If a result is ready, you will see it immediately. If it needs fresh research, our team reviews the request before results are delivered. Each search uses one credit.'}{' '}
            Pro includes {proMonthlyCredits} credits monthly. Extra credits are
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

      <form ref={formRef} action={formAction} className="mt-6 grid gap-4">
        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Product or category
            </span>
            <input
              name="query"
              required
              placeholder="Example: Gas generators for Nigerian importers"
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

        {state.message ? (
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
                    <span className="text-xs font-bold text-slate-500">
                      Subscribe to unlock details
                    </span>
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
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
