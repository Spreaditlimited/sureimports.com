'use client';

import HeroPill from '@/components/home/HeroPill';
import styles from '../Tools.module.css';
import { useMemo, useState } from 'react';
import {
  Box,
  Plane,
  Ship,
  RotateCcw,
  Scale,
  Maximize2,
  HelpCircle,
  AlertCircle,
  ArrowDown,
  ChevronRight,
} from 'lucide-react';

type ShippingMode = 'both' | 'sea' | 'air';

function toNumber(value: string): number | null {
  if (!value) return null;
  const cleaned = value.replace(/,/g, '').trim();
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function clampPositive(n: number | null): number | null {
  if (n === null) return null;
  return n > 0 ? n : null;
}

export default function CbmVolumetricWeightCalculatorPage() {
  const [mode, setMode] = useState<ShippingMode>('both');

  const [lengthCm, setLengthCm] = useState('');
  const [widthCm, setWidthCm] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [actualWeightPerCartonKg, setActualWeightPerCartonKg] = useState('');

  const nf2 = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }),
    [],
  );
  const nf4 = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        maximumFractionDigits: 4,
        minimumFractionDigits: 4,
      }),
    [],
  );

  const inputs = useMemo(() => {
    return {
      L: clampPositive(toNumber(lengthCm)),
      W: clampPositive(toNumber(widthCm)),
      H: clampPositive(toNumber(heightCm)),
      Q: clampPositive(toNumber(quantity)),
      actualKg: clampPositive(toNumber(actualWeightPerCartonKg)),
    };
  }, [lengthCm, widthCm, heightCm, quantity, actualWeightPerCartonKg]);

  const canCalculate =
    inputs.L !== null &&
    inputs.W !== null &&
    inputs.H !== null &&
    inputs.Q !== null;

  const calculated = useMemo(() => {
    if (!canCalculate) return null;
    const L = inputs.L!;
    const W = inputs.W!;
    const H = inputs.H!;
    const Q = inputs.Q!;
    const actualKg = inputs.actualKg;

    const cbmPerCarton = (L / 100) * (W / 100) * (H / 100);
    const totalCbm = cbmPerCarton * Q;
    const volumetricKgPerCarton = (L * W * H) / 6000;
    const totalVolumetricKg = volumetricKgPerCarton * Q;
    const totalActualKg = actualKg !== null ? actualKg * Q : null;
    const chargeableKg =
      totalActualKg !== null
        ? Math.max(totalActualKg, totalVolumetricKg)
        : totalVolumetricKg;

    return {
      cbmPerCarton,
      totalCbm,
      volumetricKgPerCarton,
      totalVolumetricKg,
      totalActualKg,
      chargeableKg,
    };
  }, [canCalculate, inputs]);

  function reset() {
    setMode('both');
    setLengthCm('');
    setWidthCm('');
    setHeightCm('');
    setQuantity('1');
    setActualWeightPerCartonKg('');
  }

  return (
    <main className={styles.page} data-si-page-theme="service">
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <HeroPill className="mb-6">
            <Scale className="h-3.5 w-3.5" />
            Freight Estimation
          </HeroPill>
          <h1 className="mb-6 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            CBM & Volumetric{' '}
            <span className="bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
              Weight Calculator
            </span>
          </h1>
          <p className="max-w-3xl text-lg font-medium leading-relaxed text-slate-500 dark:text-slate-400">
            Calculate space and weight metrics before shipping from China.
            Understand your chargeable weight for air freight and total volume
            for sea freight.
          </p>
        </header>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Main Calculator Card */}
          <section className="space-y-6 lg:col-span-7">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-10">
              {/* Tab Selector */}
              <div className="mb-8 flex rounded-2xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-950/50">
                {(['both', 'sea', 'air'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                      mode === m
                        ? 'bg-indigo-600 text-white shadow-indigo-600/20 dark:bg-indigo-500'
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    {m === 'both' && 'Sea + Air'}
                    {m === 'sea' && (
                      <>
                        <Ship className="h-4 w-4" /> Sea Only
                      </>
                    )}
                    {m === 'air' && (
                      <>
                        <Plane className="h-4 w-4" /> Air Only
                      </>
                    )}
                  </button>
                ))}
              </div>

              {/* Input Grid */}
              <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { label: 'Length (cm)', val: lengthCm, set: setLengthCm },
                  { label: 'Width (cm)', val: widthCm, set: setWidthCm },
                  { label: 'Height (cm)', val: heightCm, set: setHeightCm },
                  { label: 'Qty (Cartons)', val: quantity, set: setQuantity },
                ].map((input) => (
                  <div key={input.label} className="space-y-2">
                    <label
                      htmlFor={`cbm-${input.label.replace(/[^a-zA-Z0-9]/g, '')}`}
                      className="ml-1 text-[10px] font-bold uppercase tracking-widest text-slate-500"
                    >
                      {input.label}
                    </label>
                    <input
                      id={`cbm-${input.label.replace(/[^a-zA-Z0-9]/g, '')}`}
                      value={input.val}
                      onChange={(e) => input.set(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white dark:placeholder:text-slate-600"
                      inputMode="decimal"
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>

              {/* Actual Weight Row */}
              {(mode === 'both' || mode === 'air') && (
                <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-800/50">
                  <label
                    htmlFor="cbm-volumetric-weight-calculator-field-2"
                    className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300"
                  >
                    Actual Weight per Carton (kg){' '}
                    <span className="text-[10px] font-medium italic text-slate-400 dark:text-slate-500">
                      Optional
                    </span>
                  </label>
                  <input
                    id="cbm-volumetric-weight-calculator-field-2"
                    value={actualWeightPerCartonKg}
                    onChange={(e) => setActualWeightPerCartonKg(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
                    inputMode="decimal"
                    placeholder="e.g. 18"
                  />
                  <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                    Air freight chargeable weight is the higher of actual weight
                    and volumetric weight.
                  </p>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={reset}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-4 text-sm font-bold text-slate-600 transition-all hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10"
                >
                  <RotateCcw className="h-4 w-4" /> Reset
                </button>
                <button
                  type="button"
                  disabled={!canCalculate}
                  onClick={() =>
                    document
                      .getElementById('results-view')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="flex-[2] rounded-xl border-0 bg-brand-orange-500 py-4 font-bold text-white shadow-brand-orange-500/20 transition-all hover:bg-brand-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Calculate Results
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm font-medium text-amber-800 dark:border-amber-900/30 dark:bg-amber-900/10 dark:text-amber-200">
              <HelpCircle className="h-5 w-5 shrink-0 text-amber-500" />
              Standard formula: (L x W x H) / 6000
            </div>
          </section>

          {/* Results Side Panel */}
          <section
            id="results-view"
            className="scroll-mt-28 lg:sticky lg:top-28 lg:col-span-5"
          >
            {!calculated ? (
              <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/50">
                <Maximize2 className="mb-4 h-12 w-12 text-slate-300 dark:text-slate-600" />
                <p className="font-bold text-slate-600 dark:text-slate-400">
                  Awaiting Data
                </p>
                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">
                  Enter dimensions to calculate CBM <br /> and Volumetric
                  Weight.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {(mode === 'both' || mode === 'sea') && (
                  <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-8">
                    <div className="absolute right-0 top-0 p-4 opacity-10">
                      <Ship className="h-12 w-12 text-slate-900 dark:text-white" />
                    </div>
                    <h3 className="mb-6 text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                      Sea Freight Metrics
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-end justify-between">
                        <span className="font-bold text-slate-500 dark:text-slate-400">
                          CBM per Carton
                        </span>
                        <span className="text-xl font-bold text-slate-900 dark:text-white">
                          {nf4.format(calculated.cbmPerCarton)} m³
                        </span>
                      </div>
                      <div className="flex items-end justify-between border-t border-slate-100 pt-5 dark:border-slate-800">
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                          Total Volume
                        </span>
                        <span className="text-3xl font-semibold text-slate-900 dark:text-white">
                          {nf4.format(calculated.totalCbm)} m³
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {(mode === 'both' || mode === 'air') && (
                  <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-8">
                    <div className="absolute right-0 top-0 p-4 opacity-10">
                      <Plane className="h-12 w-12 text-slate-900 dark:text-white" />
                    </div>
                    <h3 className="mb-6 text-xs font-semibold uppercase tracking-widest text-brand-orange-500">
                      Air Freight Metrics
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-end justify-between">
                        <span className="font-bold text-slate-500 dark:text-slate-400">
                          Volumetric per Carton
                        </span>
                        <span className="text-xl font-bold text-slate-900 dark:text-white">
                          {nf2.format(calculated.volumetricKgPerCarton)} kg
                        </span>
                      </div>
                      <div className="flex items-end justify-between border-t border-slate-100 pt-5 dark:border-slate-800">
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                          Chargeable Weight
                        </span>
                        <span className="text-3xl font-semibold text-brand-orange-500">
                          {nf2.format(calculated.chargeableKg)} kg
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-medium leading-relaxed text-slate-600 dark:border-white/5 dark:bg-white/[0.03] dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-white">
                    Quick meaning:
                  </strong>{' '}
                  Your carton size determines space (CBM). Airlines charge the
                  higher of actual weight and volumetric weight.
                </div>
              </div>
            )}
          </section>
        </div>

        {/* FAQ Section */}
        <section className="mt-24 border-t border-slate-200 pt-16 dark:border-slate-800">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <h2 className="mb-8 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                CBM & Volumetric Weight FAQ
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {[
                  {
                    q: 'Why is my air freight chargeable weight higher than my actual weight?',
                    a: 'Airlines charge the higher of actual weight and volumetric weight. If your carton is large, the volumetric calculation can exceed your actual kg.',
                  },
                  {
                    q: 'Is CBM the same as weight?',
                    a: 'No. CBM is space. Weight is kg. A light but bulky carton can have low kg but high CBM, making it expensive to ship.',
                  },
                  {
                    q: 'Should I use carton dimensions or product dimensions?',
                    a: 'Use carton dimensions (the packaged box). Freight pricing is based on the shipped package, not the bare product.',
                  },
                  {
                    q: 'Can this calculator give me exact shipping cost?',
                    a: 'No. It gives you CBM and chargeable weight, which are the numbers you need before requesting a freight quote.',
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-indigo-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                  >
                    <p className="mb-2 font-bold text-slate-900 dark:text-white">
                      {item.q}
                    </p>
                    <p className="text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="space-y-6 lg:col-span-4">
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-8 dark:border-indigo-900/20 dark:bg-indigo-900/10">
                <AlertCircle className="mb-6 h-8 w-8 text-indigo-500" />
                <h4 className="mb-4 text-lg font-semibold text-indigo-950 dark:text-white">
                  Common Mistakes
                </h4>
                <ul className="space-y-3 text-sm font-medium text-indigo-800 dark:text-indigo-200/70">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />{' '}
                    Using product dims instead of carton dims
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />{' '}
                    Forgetting to multiply by quantity
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />{' '}
                    Mixing inches with centimeters
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                  More Tools
                </p>
                <div className="space-y-2">
                  {[
                    {
                      label: 'Air vs Sea Calculator',
                      href: '/tools/air-vs-sea-calculator',
                    },
                    {
                      label: 'Landed Cost Estimator',
                      href: '/tools/landed-cost-estimator',
                    },
                    {
                      label: 'Carton Optimizer',
                      href: '/tools/carton-optimization',
                    },
                  ].map((tool) => (
                    <a
                      key={tool.label}
                      href={tool.href}
                      className="flex items-center justify-between py-2 text-sm font-bold text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
                    >
                      {tool.label}{' '}
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </a>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
