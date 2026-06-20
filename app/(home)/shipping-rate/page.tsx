import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  ExternalLink,
  Info,
  PackageCheck,
  Search,
  Ship,
} from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Shipping Rates | Sure Imports',
  description:
    'View estimated Sure Imports shipping rates by country and shipping method, then start a shipping request when you are ready.',
  alternates: {
    canonical: 'https://www.sureimports.com/shipping-rate',
  },
};

const planLabels: Record<string, string> = {
  NORMAL_SHIPPING: 'Normal Shipping',
  EXPRESS_SHIPPING: 'Express Shipping',
  SPECIAL_SHIPPING: 'Special Shipping',
  SEA_SHIPPING: 'Sea Shipping',
};

const planOrder: Record<string, number> = {
  NORMAL_SHIPPING: 1,
  EXPRESS_SHIPPING: 2,
  SPECIAL_SHIPPING: 3,
  SEA_SHIPPING: 4,
};

const countryColorThemes = [
  {
    row: 'bg-blue-50/45 hover:bg-blue-50 dark:bg-blue-950/20 dark:hover:bg-blue-950/35',
    border: 'border-blue-500',
    badge: 'bg-blue-100 text-blue-800 ring-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:ring-blue-800/60',
  },
  {
    row: 'bg-brand-orange-50/55 hover:bg-brand-orange-50 dark:bg-brand-orange-950/20 dark:hover:bg-brand-orange-950/35',
    border: 'border-brand-orange-500',
    badge: 'bg-brand-orange-100 text-brand-orange-800 ring-brand-orange-200 dark:bg-brand-orange-950 dark:text-brand-orange-200 dark:ring-brand-orange-800/60',
  },
  {
    row: 'bg-indigo-50/50 hover:bg-indigo-50 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/35',
    border: 'border-indigo-500',
    badge: 'bg-indigo-100 text-indigo-800 ring-indigo-200 dark:bg-indigo-950 dark:text-indigo-200 dark:ring-indigo-800/60',
  },
  {
    row: 'bg-slate-50 hover:bg-slate-100/70 dark:bg-slate-900/70 dark:hover:bg-slate-800/80',
    border: 'border-slate-500',
    badge: 'bg-slate-200 text-slate-800 ring-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700',
  },
];

type ShippingRateRow = {
  countryName: string;
  rates: Array<{
    name: string;
    label: string;
    rate: number;
    currency: 'USD' | 'NGN';
    unit: string;
  }>;
};

function formatPlanLabel(value: string) {
  return (
    planLabels[value] ||
    value
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  );
}

function formatPlanUnit(value: string | null | undefined) {
  return value?.toUpperCase() === 'CBM' ? 'CBM' : 'kg';
}

function formatMoney(value: number, currency: 'USD' | 'NGN') {
  return new Intl.NumberFormat(currency === 'NGN' ? 'en-NG' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'NGN' ? 0 : 2,
  }).format(value);
}

async function getShippingRates(): Promise<ShippingRateRow[]> {
  const countries = await prisma.country.findMany({
    where: {
      shippingPlans: {
        some: {
          shippingPlanRate: {
            not: null,
          },
        },
      },
    },
    select: {
      countryName: true,
      shippingPlans: {
        select: {
          shippingPlanName: true,
          shippingPlanRate: true,
          shippingPlanUnit: true,
        },
      },
    },
    orderBy: {
      countryName: 'asc',
    },
  });

  return countries
    .map((country) => ({
      countryName: country.countryName || 'Unnamed Country',
      rates: country.shippingPlans
        .filter(
          (plan) =>
            plan.shippingPlanName && typeof plan.shippingPlanRate === 'number',
        )
        .sort((a, b) => {
          const aName = a.shippingPlanName || '';
          const bName = b.shippingPlanName || '';
          return (planOrder[aName] || 99) - (planOrder[bName] || 99);
        })
        .map((plan) => {
          const name = plan.shippingPlanName || '';
          const isNigeriaSeaRate =
            country.countryName === 'Nigeria' && name === 'SEA_SHIPPING';
          const currency: 'USD' | 'NGN' = isNigeriaSeaRate ? 'NGN' : 'USD';

          return {
            name,
            label: formatPlanLabel(name),
            rate: isNigeriaSeaRate ? 470000 : Number(plan.shippingPlanRate || 0),
            currency,
            unit: isNigeriaSeaRate
              ? 'CBM'
              : formatPlanUnit(plan.shippingPlanUnit),
          };
        }),
    }))
    .filter((country) => country.rates.length > 0);
}

export default async function ShippingRatePage() {
  const rates = await getShippingRates();
  const totalRateCount = rates.reduce(
    (total, country) => total + country.rates.length,
    0,
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#fcfcfd] text-slate-950 dark:bg-slate-950 dark:text-white">
        <section className="relative overflow-hidden bg-slate-950 px-4 pb-16 pt-48 text-white sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.18),transparent_30%)]" />
          <div className="relative mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-400/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-orange-300">
                <Ship className="h-3.5 w-3.5" />
                Live Shipping Estimates
              </div>
              <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
                Shipping Rates
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Compare available Sure Imports shipping routes by country and
                method before creating your shipping request.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/ship-with-us"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 text-sm font-black text-white transition hover:bg-orange-600"
                >
                  Ship with us
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/shipping-policy"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-6 text-sm font-black text-white transition hover:bg-white/10"
                >
                  Shipping policy
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                <p className="text-3xl font-black">{rates.length}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">
                  Listed Countries
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                <p className="text-3xl font-black">{totalRateCount}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">
                  Active Rates
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                <p className="text-3xl font-black">Air / Sea</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">
                  Available Methods
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-xl border border-orange-200 bg-orange-50 p-5 text-orange-950 dark:border-orange-900/40 dark:bg-orange-950/30 dark:text-orange-100">
                <div className="flex gap-3">
                  <Info className="mt-1 h-5 w-5 shrink-0 text-orange-600 dark:text-orange-300" />
                  <p className="text-sm leading-7">
                    All rates are estimated based on current rates from Airlines
                    and Shipping lines. If the country you wish to ship to is
                    not listed, please chat with us using the WhatsApp button on
                    this page.
                  </p>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex gap-3">
                  <PackageCheck className="mt-1 h-5 w-5 shrink-0 text-emerald-600" />
                  <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                    Consult our{' '}
                    <Link
                      href="/shipping-policy"
                      className="font-bold text-slate-950 underline underline-offset-4 hover:text-orange-600 dark:text-white"
                    >
                      shipping policy
                    </Link>{' '}
                    to learn how we handle and ship your products to you.
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
              <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-950 dark:text-white">
                    Current Shipping Rates
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Rates are displayed in USD by shipping method and billing
                    unit.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <Search className="h-3.5 w-3.5" />
                  {rates.length} destinations
                </div>
              </div>

              {rates.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
                        <th className="px-6 py-4">Destination</th>
                        <th className="px-6 py-4">Shipping Method</th>
                        <th className="px-6 py-4">Estimated Rate</th>
                        <th className="px-6 py-4">Billing Unit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rates.map((country, countryIndex) => {
                        const theme =
                          countryColorThemes[
                            countryIndex % countryColorThemes.length
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
                <div className="px-6 py-16 text-center">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    No shipping rates are currently listed.
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Please chat with us using the WhatsApp button on this page.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl bg-slate-950 p-6 text-white sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-black">Ready to ship?</h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">
                  Create a shipping-only request and send your goods to our
                  China warehouse for handling and onward delivery.
                </p>
              </div>
              <Link
                href="/ship-with-us"
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 text-sm font-black text-white transition hover:bg-orange-600"
              >
                Ship with us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
