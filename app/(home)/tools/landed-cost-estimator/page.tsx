'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { 
  Globe, 
  Truck, 
  DollarSign, 
  Layers, 
  Clipboard, 
  ChevronDown, 
  Info, 
  Calculator,
  ArrowRight
} from 'lucide-react';
import { convertToTitleCase } from '@/app/utils/stringUtils';

type Destination = string;
type RateBasis = 'perKg' | 'perCbm';

type ShippingOption = {
  key: string;
  label: string;
  basis: RateBasis;
  rateUsd: number;
};

const FALLBACK_DESTINATIONS: { key: Destination; label: string }[] = [
  { key: 'NG', label: 'Nigeria' },
];

const FALLBACK_SHIPPING_OPTIONS: Record<Destination, ShippingOption[]> = {
  NG: [{ key: 'air_cargo', label: 'Air Cargo ($10/kg)', basis: 'perKg', rateUsd: 10 }],
};

type ShippingPlanApi = {
  pidShippingPlan: string;
  shippingPlanName: string;
  shippingPlanRate: string | number | null;
};

type CountryApi = {
  pidCountry: string;
  countryName: string;
  shippingPlans: ShippingPlanApi[];
};

function toRateNumber(v: unknown): number {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string') {
    const cleaned = v.replace(/[^0-9.]/g, '');
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function inferRateBasis(planName: string): RateBasis {
  const n = planName.toLowerCase();
  return n.includes('cbm') || n.includes('sea') ? 'perCbm' : 'perKg';
}

function toNumber(v: string): number | null {
  const cleaned = v.replace(/,/g, '').trim();
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function useOnClickOutside(ref: React.RefObject<HTMLElement>, handler: () => void) {
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [ref, handler]);
}

function Select<T extends string>({
  label,
  value,
  onChange,
  options,
  icon: Icon
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  icon: any;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(wrapRef, () => setOpen(false));

  const selected = options.find((o) => o.value === value);

  return (
    <div className="flex flex-col gap-2 relative" ref={wrapRef}>
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
        <Icon className="w-3 h-3 text-indigo-500" /> {label}
      </label>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-semibold text-sm transition-all focus:ring-2 focus:ring-indigo-500/50 outline-none dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
      >
        <span className="truncate">{selected?.label ?? 'Select'}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 rounded-2xl bg-white border border-slate-200 overflow-hidden z-[9999] shadow-xl dark:border-slate-800 dark:bg-slate-900">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full px-4 py-3 text-left text-sm font-medium transition-all hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-400 ${
                opt.value === value 
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400' 
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function LandedCostEstimatorPage() {
  const [destinations, setDestinations] = useState<
    { key: Destination; label: string }[]
  >(FALLBACK_DESTINATIONS);
  const [shippingOptionsByDestination, setShippingOptionsByDestination] =
    useState<Record<Destination, ShippingOption[]>>(FALLBACK_SHIPPING_OPTIONS);
  const [destination, setDestination] = useState<Destination>(
    FALLBACK_DESTINATIONS[0].key,
  );
  const shippingOptions =
    shippingOptionsByDestination[destination] ||
    FALLBACK_SHIPPING_OPTIONS[FALLBACK_DESTINATIONS[0].key];
  const [shippingKey, setShippingKey] = useState<string>(shippingOptions[0].key);

  useEffect(() => {
    let mounted = true;
    const loadShippingPlans = async () => {
      try {
        const response = await fetch('/api/get-data/countries-shipping-plan', {
          cache: 'no-store',
        });
        if (!response.ok) return;
        const data = (await response.json()) as CountryApi[];
        if (!mounted || !Array.isArray(data) || data.length === 0) return;

        const nextDestinations = data.map((country) => ({
          key: country.pidCountry,
          label: country.countryName,
        }));

        const nextOptions: Record<Destination, ShippingOption[]> = {};
        data.forEach((country) => {
          const plans = (country.shippingPlans || [])
            .filter((p) => p && p.pidShippingPlan && p.shippingPlanName)
            .map((plan) => {
              const rateUsd = toRateNumber(plan.shippingPlanRate);
              const basis = inferRateBasis(plan.shippingPlanName);
              const suffix = basis === 'perKg' ? '/kg' : '/CBM';
              const readableName = convertToTitleCase(plan.shippingPlanName);
              return {
                key: plan.pidShippingPlan,
                label: `${readableName} ($${rateUsd}${suffix})`,
                basis,
                rateUsd,
              } satisfies ShippingOption;
            });
          if (plans.length > 0) {
            nextOptions[country.pidCountry] = plans;
          }
        });

        const filteredDestinations = nextDestinations.filter(
          (d) => nextOptions[d.key]?.length > 0,
        );
        if (filteredDestinations.length === 0) return;

        setDestinations(filteredDestinations);
        setShippingOptionsByDestination(nextOptions);
        setDestination((prev) =>
          nextOptions[prev]?.length > 0 ? prev : filteredDestinations[0].key,
        );
      } catch {
        // Keep fallback dataset on fetch failure.
      }
    };

    loadShippingPlans();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const next = shippingOptionsByDestination[destination] || [];
    if (!next.length) return;
    if (!next.some((o) => o.key === shippingKey)) setShippingKey(next[0].key);
  }, [destination, shippingKey, shippingOptionsByDestination]);

  const selectedShipping = useMemo(() => {
    return shippingOptions.find((o) => o.key === shippingKey) ?? shippingOptions[0];
  }, [shippingOptions, shippingKey]);

  const [unitPrice, setUnitPrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [chargeableKg, setChargeableKg] = useState('');
  const [cbm, setCbm] = useState('');

  const u = toNumber(unitPrice);
  const q = toNumber(quantity);
  const kg = toNumber(chargeableKg);
  const m3 = toNumber(cbm);

  const canCalculate = Boolean(u && q && (selectedShipping.basis === 'perKg' ? kg : m3));
  const nf2 = useMemo(() => new Intl.NumberFormat(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 }), []);

  const result = useMemo(() => {
    if (!canCalculate) return null;
    const productCost = u! * q!;
    const shippingCost = selectedShipping.basis === 'perKg' ? selectedShipping.rateUsd * kg! : selectedShipping.rateUsd * m3!;
    const landed = productCost + shippingCost;
    return { productCost, shippingCost, landed, perUnit: landed / q! };
  }, [canCalculate, selectedShipping, u, q, kg, m3]);

  return (
    <main className="min-h-screen bg-[#fcfcfd] text-slate-600 dark:bg-slate-950 dark:text-slate-400 pb-24">
      <div className="max-w-[1440px] mx-auto px-4 pt-48 sm:px-6 lg:px-8">
        
        {/* Header */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:border-indigo-900/30 dark:text-indigo-400 text-xs font-black uppercase tracking-widest mb-6">
            <Calculator className="w-3.5 h-3.5" /> Profitability Planning
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
            Landed Cost <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-500">Estimator</span>
          </h1>
          <p className="text-lg font-medium text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
            Predict your total import costs including shipping, duties, and taxes. 
            Know your margin before you pay your supplier.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Input Panel */}
          <section className="lg:col-span-7 space-y-6">
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 sm:p-10 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <Select
                  label="Destination"
                  value={destination}
                  icon={Globe}
                  onChange={(v) => setDestination(v)}
                  options={destinations.map((d) => ({ value: d.key, label: d.label }))}
                />
                <Select
                  label="Shipping Method"
                  value={shippingKey}
                  icon={Truck}
                  onChange={(v) => setShippingKey(v)}
                  options={shippingOptions.map((o) => ({ value: o.key, label: o.label }))}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <DollarSign className="w-3 h-3 text-emerald-500" /> Unit Price (USD)
                  </label>
                  <input
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all dark:bg-slate-950/50 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600"
                    placeholder="e.g. 25"
                    inputMode="decimal"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Layers className="w-3 h-3 text-brand-orange-500" /> Quantity
                  </label>
                  <input
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all dark:bg-slate-950/50 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600"
                    placeholder="e.g. 100"
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-8 dark:border-slate-800">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest ml-1 dark:text-slate-300">
                  {selectedShipping.basis === 'perKg' ? 'Total Chargeable Weight (kg)' : 'Total CBM (m³)'}
                </label>
                <input
                  value={selectedShipping.basis === 'perKg' ? chargeableKg : cbm}
                  onChange={(e) => selectedShipping.basis === 'perKg' ? setChargeableKg(e.target.value) : setCbm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all dark:bg-slate-950/50 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600"
                  placeholder={selectedShipping.basis === 'perKg' ? 'e.g. 120' : 'e.g. 1.8'}
                  inputMode="decimal"
                />
                <p className="text-[11px] font-medium text-slate-500 italic mt-2 ml-1">
                  {selectedShipping.basis === 'perKg' 
                    ? 'Note: Chargeable weight is the higher of actual vs volumetric weight.'
                    : 'CBM is based on the total space occupied by your cartons.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-5 rounded-2xl bg-indigo-50 border border-indigo-100 text-sm font-medium text-indigo-900 dark:border-indigo-900/30 dark:bg-indigo-900/10 dark:text-indigo-200">
              <Info className="w-5 h-5 shrink-0 text-indigo-500" />
              <span>Need help with weight or volume? Use the <a href="/tools/cbm-volumetric-weight-calculator" className="underline font-bold hover:text-indigo-700 dark:hover:text-indigo-400">CBM & Volumetric Calculator</a>.</span>
            </div>
          </section>

          {/* Results Side Panel */}
          <section className="lg:col-span-5 lg:sticky lg:top-8">
            {!result ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/50">
                <Calculator className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-600" />
                <p className="font-bold text-slate-600 dark:text-slate-400">Awaiting Inputs</p>
                <p className="text-sm font-medium mt-2 leading-relaxed text-slate-500">Enter your product and shipping details <br/> to generate an all-in estimate.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40 relative overflow-hidden dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
                  <div className="absolute top-0 right-0 p-6 opacity-10"><Calculator className="w-12 h-12 text-slate-900 dark:text-white" /></div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">Landed Estimate</h3>
                  
                  <div className="space-y-6 mb-8">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-bold dark:text-slate-400">Product Cost</span>
                      <span className="text-xl font-bold text-slate-900 dark:text-white">${nf2.format(result.productCost)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-bold dark:text-slate-400">All-in Shipping</span>
                      <span className="text-xl font-bold text-slate-900 dark:text-white">${nf2.format(result.shippingCost)}</span>
                    </div>
                    <div className="pt-6 border-t border-slate-100 flex justify-between items-center dark:border-slate-800">
                      <span className="text-indigo-600 font-black uppercase text-[10px] tracking-widest dark:text-indigo-400">Total Landed Cost</span>
                      <span className="text-indigo-600 font-black text-3xl dark:text-indigo-400">${nf2.format(result.landed)}</span>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-brand-orange-50 border border-brand-orange-200 mb-6 dark:bg-brand-orange-900/10 dark:border-brand-orange-900/30">
                    <p className="text-[10px] font-black text-brand-orange-600 uppercase tracking-widest mb-1 dark:text-brand-orange-500">Estimated Cost Per Unit</p>
                    <p className="text-4xl font-black text-brand-orange-600 dark:text-brand-orange-500">${nf2.format(result.perUnit)}</p>
                  </div>

                  <button 
                    onClick={() => alert("Estimate copied to clipboard")}
                    className="w-full py-4 rounded-xl bg-slate-50 border border-slate-200 font-bold text-sm text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-indigo-400"
                  >
                    <Clipboard className="w-4 h-4" /> Copy Breakdown
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* FAQ Section */}
        <section className="mt-24 border-t border-slate-200 pt-16 dark:border-slate-800">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Understanding Landed Cost</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  id: 'faq-landed-cost',
                  q: 'What is landed cost?',
                  a: 'Landed cost is the total price of a product or shipment once it has arrived at the buyer\'s doorstep. It includes the original price from the supplier, plus all shipping costs, duties, taxes, and any other fees incurred along the way.',
                },
                {
                  id: 'faq-all-in',
                  q: 'Do these rates include duties and taxes?',
                  a: 'Yes. The rates used in this calculator are "all-in" rates, meaning customs duties, taxes, and clearing fees are already built into the per-kg or per-cbm price.',
                }
              ].map((faq) => (
                <div key={faq.id} className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm dark:bg-slate-900 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 text-base mb-3 flex items-start gap-3 dark:text-white">
                    <ArrowRight className="mt-1 w-4 h-4 shrink-0 text-indigo-500" /> {faq.q}
                  </h4>
                  <p className="text-sm font-medium text-slate-500 leading-relaxed dark:text-slate-400">"{faq.a}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
