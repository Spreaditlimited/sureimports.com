'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';

export type ShippingRateRow = {
  countryName: string;
  rates: Array<{
    name: string;
    label: string;
    rate: number;
    currency: 'USD' | 'NGN';
    unit: string;
  }>;
};

const countryColorThemes = [
  {
    row: 'bg-blue-50/45 hover:bg-blue-50 dark:bg-blue-950/20 dark:hover:bg-blue-950/35',
    border: 'border-blue-500',
    badge:
      'bg-blue-100 text-blue-800 ring-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:ring-blue-800/60',
  },
  {
    row: 'bg-brand-orange-50/55 hover:bg-brand-orange-50 dark:bg-brand-orange-950/20 dark:hover:bg-brand-orange-950/35',
    border: 'border-brand-orange-500',
    badge:
      'bg-brand-orange-100 text-brand-orange-800 ring-brand-orange-200 dark:bg-brand-orange-950 dark:text-brand-orange-200 dark:ring-brand-orange-800/60',
  },
  {
    row: 'bg-indigo-50/50 hover:bg-indigo-50 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/35',
    border: 'border-indigo-500',
    badge:
      'bg-indigo-100 text-indigo-800 ring-indigo-200 dark:bg-indigo-950 dark:text-indigo-200 dark:ring-indigo-800/60',
  },
  {
    row: 'bg-slate-50 hover:bg-slate-100/70 dark:bg-slate-900/70 dark:hover:bg-slate-800/80',
    border: 'border-slate-500',
    badge:
      'bg-slate-200 text-slate-800 ring-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700',
  },
];

function formatMoney(value: number, currency: 'USD' | 'NGN') {
  return new Intl.NumberFormat(currency === 'NGN' ? 'en-NG' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'NGN' ? 0 : 2,
  }).format(value);
}

export default function ShippingRatesTable({
  rates,
}: {
  rates: ShippingRateRow[];
}) {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const filteredRates = useMemo(() => {
    const terms = deferredQuery.split(/\s+/).filter(Boolean);

    return rates.flatMap((country, themeIndex) => {
      const matchingRates = terms.length
        ? country.rates.filter((rate) => {
            const searchableText = [
              country.countryName,
              rate.label,
              rate.name,
              rate.currency,
              rate.unit,
            ]
              .join(' ')
              .toLowerCase();
            return terms.every((term) => searchableText.includes(term));
          })
        : country.rates;

      return matchingRates.length
        ? [{ ...country, rates: matchingRates, themeIndex }]
        : [];
    });
  }, [deferredQuery, rates]);

  const visibleRateCount = filteredRates.reduce(
    (total, country) => total + country.rates.length,
    0,
  );

  return (
    <div
      id="shipping-rates"
      className="scroll-mt-28 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
    >
      <div className="grid gap-4 border-b border-slate-100 px-5 py-5 dark:border-slate-800 lg:grid-cols-[1fr_minmax(280px,420px)] lg:items-end">
        <div>
          <h2 className="text-lg font-black text-slate-950 dark:text-white">
            Current Shipping Rates
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Rates are displayed in USD by shipping method and billing unit.
          </p>
        </div>

        <div>
          <label
            htmlFor="shipping-rate-search"
            className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400"
          >
            Search shipping rates
          </label>
          <div className="flex min-h-12 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 transition focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20 dark:border-slate-700 dark:bg-slate-950">
            <Search
              className="h-4 w-4 shrink-0 text-slate-400"
              aria-hidden="true"
            />
            <input
              id="shipping-rate-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search country or shipping method"
              className="min-w-0 flex-1 bg-transparent py-3 text-sm text-slate-950 outline-none placeholder:text-slate-400 dark:text-white"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:hover:bg-slate-800 dark:hover:text-white"
                aria-label="Clear shipping rate search"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : null}
          </div>
          <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            {filteredRates.length}{' '}
            {filteredRates.length === 1 ? 'destination' : 'destinations'} ·{' '}
            {visibleRateCount} {visibleRateCount === 1 ? 'rate' : 'rates'}
          </p>
        </div>
      </div>

      {filteredRates.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <caption className="sr-only">
              Current shipping rates by destination and shipping method
            </caption>
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
                <th className="px-6 py-4">Destination</th>
                <th className="px-6 py-4">Shipping Method</th>
                <th className="px-6 py-4">Estimated Rate</th>
                <th className="px-6 py-4">Billing Unit</th>
              </tr>
            </thead>
            <tbody>
              {filteredRates.map((country) => {
                const theme =
                  countryColorThemes[
                    country.themeIndex % countryColorThemes.length
                  ];

                return country.rates.map((rate, index) => (
                  <tr
                    key={`${country.countryName}-${rate.name}`}
                    className={`border-b border-white/70 transition dark:border-slate-950/40 ${theme.row}`}
                  >
                    {index === 0 ? (
                      <td
                        rowSpan={country.rates.length}
                        className={`border-l-4 px-6 py-5 align-top font-black text-slate-950 dark:text-white ${theme.border}`}
                      >
                        <span
                          className={`inline-flex rounded-full px-3 py-1.5 text-xs font-black ring-1 ${theme.badge}`}
                        >
                          {country.countryName}
                        </span>
                      </td>
                    ) : null}
                    <td className="px-6 py-5 font-semibold text-slate-700 dark:text-slate-200">
                      {rate.label}
                    </td>
                    <td className="px-6 py-5 font-black text-slate-950 dark:text-white">
                      {formatMoney(rate.rate, rate.currency)}
                    </td>
                    <td className="px-6 py-5 text-slate-600 dark:text-slate-300">
                      Per {rate.unit}
                    </td>
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-6 py-16 text-center" aria-live="polite">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            {rates.length
              ? `No shipping rates match “${query.trim()}”.`
              : 'No shipping rates are currently listed.'}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {rates.length
              ? 'Try another country or shipping method.'
              : 'Please chat with us using the WhatsApp button on this page.'}
          </p>
        </div>
      )}
    </div>
  );
}
