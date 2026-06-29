'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';

type CategorySearchGridProps = {
  niches: Array<{
    name: string;
    slug: string;
    suppliers: Array<{
      supplierName: string;
      productFit: string;
      countryRegion?: string;
      productsMade?: string | string[] | null;
    }>;
  }>;
};

function normalize(value: unknown) {
  if (!value) return '';
  if (Array.isArray(value)) return value.join(' ').toLowerCase();
  return String(value).toLowerCase();
}

function searchableText(niche: CategorySearchGridProps['niches'][number]) {
  return [
    niche.name,
    ...niche.suppliers.flatMap((supplier) => [
      supplier.supplierName,
      supplier.productFit,
      supplier.countryRegion,
      normalize(supplier.productsMade),
    ]),
  ]
    .join(' ')
    .toLowerCase();
}

export default function CategorySearchGrid({
  niches,
}: CategorySearchGridProps) {
  const [query, setQuery] = useState('');
  const trimmedQuery = query.trim().toLowerCase();

  const filteredNiches = useMemo(() => {
    if (!trimmedQuery) return niches;

    const terms = trimmedQuery.split(/\s+/).filter(Boolean);
    return niches.filter((niche) => {
      const text = searchableText(niche);
      return terms.every((term) => text.includes(term));
    });
  }, [niches, trimmedQuery]);

  return (
    <div className="mt-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Available Categories
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Search by category, supplier name, product type, or location.
          </p>
        </div>

        <div className="w-full md:max-w-md">
          <label className="sr-only" htmlFor="supplier-category-search">
            Search supplier categories
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="supplier-category-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search categories, suppliers, products..."
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-11 text-sm font-medium text-slate-900 shadow-sm outline-none transition focus:border-brand-orange-400 focus:ring-4 focus:ring-brand-orange-500/10"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
          <p className="mt-2 text-xs font-medium text-slate-500">
            Showing {filteredNiches.length} of {niches.length} categories
          </p>
        </div>
      </div>

      {filteredNiches.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="text-sm font-bold text-slate-900">
            No matching category found.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Try a broader product name, supplier name, or related product term.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredNiches.map((niche) => (
            <Link
              key={niche.slug}
              href={`/dashboard/intelligence/${niche.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-brand-orange-300 hover:shadow-md"
            >
              <div>
                <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-brand-orange-600">
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
      )}
    </div>
  );
}
