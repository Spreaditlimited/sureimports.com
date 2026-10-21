import GoogleReviews from '@/components/reviews/GoogleReviews';
import { getDeviceShippingSettings } from '@/lib/procurement/deviceShippingSettings';
import ServiceHero from '@/components/home/ServiceHero';
import pageStyles from '@/components/home/PublicServicePage.module.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Info, PackageCheck, Ship } from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';
import ShippingRatesTable, { type ShippingRateRow } from './ShippingRatesTable';

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

async function getShippingRates(): Promise<ShippingRateRow[]> {
  const [countries, financial] = await Promise.all([
    prisma.country.findMany({
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
    }),
    prisma.exchange_rate.findUnique({
      where: { id: 1 },
      select: { quotationSeaRateNgnPerCbm: true },
    }),
  ]);
  const nigeriaSeaRate = Number(financial?.quotationSeaRateNgnPerCbm || 0);

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
            rate: isNigeriaSeaRate
              ? nigeriaSeaRate
              : Number(plan.shippingPlanRate || 0),
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
  const deviceRates = await getDeviceShippingSettings();
  const totalRateCount = rates.reduce(
    (total, country) => total + country.rates.length,
    0,
  );

  return (
    <>
      <Navbar />
      <main className={pageStyles.page} data-si-page-theme="service">
        <ServiceHero
          eyebrow="Shipping rates"
          title="Plan your shipping with clearer costs."
          description="Compare available routes by country and shipping method. Rates cover freight, customs clearance and taxes; your final shipping cost depends on the goods received at our Guangzhou warehouse."
          summaryTitle="Find the route for your goods."
          primary={{ href: '/ship-with-us', label: 'Arrange shipping' }}
          secondary={{ href: '#shipping-rates', label: 'Compare rates' }}
          steps={[
            {
              title: 'Choose your destination',
              description:
                'See the shipping methods available for that country.',
            },
            {
              title: 'Compare the available rates',
              description: 'Check the rate and unit for each shipping method.',
            },
            {
              title: 'Confirm after warehouse intake',
              description:
                'Actual weight and shipping cost are determined when goods arrive.',
            },
          ]}
        >
          <p>
            {rates.length} countries · {totalRateCount} active rates
          </p>
        </ServiceHero>

        <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-[1440px]">
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
              <div className="rounded-xl border border-slate-200 bg-[var(--si-surface)] p-5 shadow-sm dark:border-slate-800">
                <div className="flex gap-3">
                  <PackageCheck className="mt-1 h-5 w-5 shrink-0 text-emerald-600" />
                  <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                    Consult our{' '}
                    <Link
                      href="/shipping-policy"
                      className="font-medium text-slate-950 underline underline-offset-4 hover:text-orange-600 dark:text-white"
                    >
                      shipping policy
                    </Link>{' '}
                    to learn how we handle and ship your products to you.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6 rounded-xl border border-[var(--si-border)] bg-[var(--si-surface)] p-5"><h2 className="text-lg font-semibold">Phones and laptops to Nigeria</h2><p className="mt-2">₦{deviceRates.phoneNgn.toLocaleString()} per phone · ₦{deviceRates.laptopNgn.toLocaleString()} per laptop.</p><p className="mt-2 text-sm text-[var(--si-muted)]">For safety and speed, these devices use per-device shipping instead of weight-based freight. Other goods in the same order use the rates below. These device rates apply to Nigeria only.</p></div>
            <ShippingRatesTable rates={rates} />

            <GoogleReviews />

            <div className="si-dark-surface mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl bg-[#15171c] p-6 text-white sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-medium">Ready to ship?</h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">
                  Create a shipping-only request and send your goods to our
                  China warehouse for handling and onward delivery.
                </p>
              </div>
              <Link
                href="/ship-with-us"
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-[var(--si-primary)] px-6 text-sm font-medium text-[var(--si-on-primary)] transition hover:brightness-95"
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
