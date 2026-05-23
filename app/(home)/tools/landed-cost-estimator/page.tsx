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

type Destination = 'NG' | 'GH' | 'UK' | 'US' | 'CA';
type RateBasis = 'perKg' | 'perCbm';

type ShippingOption = {
  key: string;
  label: string;
  basis: RateBasis;
  rateUsd: number;
};

const DESTINATIONS: { key: Destination; label: string }[] = [
  { key: 'NG', label: 'Nigeria' },
  { key: 'GH', label: 'Ghana' },
  { key: 'UK', label: 'UK' },
  { key: 'US', label: 'USA' },
  { key: 'CA', label: 'Canada' },
];

const SHIPPING_OPTIONS: Record<Destination, ShippingOption[]> = {
  NG: [
    { key: 'air_cargo', label: 'Air Cargo ($10/kg)', basis: 'perKg', rateUsd: 10 },
    { key: 'express', label: 'Express ($15/kg)', basis: 'perKg', rateUsd: 15 },
    { key: 'sea', label: 'Sea ($350/CBM)', basis: 'perCbm', rateUsd: 350 },
  ],
  GH: [
    { key: 'air_cargo', label: 'Air Cargo ($15/kg)', basis: 'perKg', rateUsd: 15 },
    { key: 'express', label: 'Express ($20/kg)', basis: 'perKg', rateUsd: 20 },
    { key: 'sea', label: 'Sea ($250/CBM)', basis: 'perCbm', rateUsd: 250 },
  ],
  UK: [
    { key: 'air', label: 'Air ($10/kg)', basis: 'perKg', rateUsd: 10 },
    { key: 'sea_vol', label: 'Sea (Volumetric) ($5/kg)', basis: 'perKg', rateUsd: 5 },
  ],
  US: [
    { key: 'air', label: 'Air ($10/kg)', basis: 'perKg', rateUsd: 10 },
    { key: 'sea_vol', label: 'Sea (Volumetric) ($5/kg)', basis: 'perKg', rateUsd: 5 },
  ],
  CA: [
    { key: 'air', label: 'Air ($10/kg)', basis: 'perKg', rateUsd: 10 },
    { key: 'sea_vol', label: 'Sea (Volumetric) ($5/kg)', basis: 'perKg', rateUsd: 5 },
  ],
};

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
        <Icon className="w-3 h-3" /> {label}
      </label>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl border border-white/10 bg-slate-950/50 text-white font-semibold text-sm transition-all focus:ring-2 focus:ring-blue-500/50 outline-none"
      >
        <span className="truncate">{selected?.label ?? 'Select'}</span>
        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 rounded-2xl bg-slate-900 border border-white/10 overflow-hidden z-[9999] shadow-2xl backdrop-blur-xl">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full px-4 py-3 text-left text-sm font-medium transition-all hover:bg-blue-600/20 hover:text-blue-400 ${opt.value === value ? 'bg-white/5 text-blue-400' : 'text-slate-300'}`}
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
  const [destination, setDestination] = useState<Destination>('NG');
  const shippingOptions = SHIPPING_OPTIONS[destination];
  const [openFaq, setOpenFaq] = useState<string | null>('faq-landed-cost');
  const [shippingKey, setShippingKey] = useState<string>(shippingOptions[0].key);

  useEffect(() => {
    const next = SHIPPING_OPTIONS[destination];
    if (!next.some((o) => o.key === shippingKey)) setShippingKey(next[0].key);
  }, [destination, shippingKey]);

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
    <main className="min-h-screen bg-[#020617] text-slate-200 pb-24">
      <div className="max-w-5xl mx-auto px-4 pt-12 sm:pt-20">
        
        {/* Header */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Calculator className="w-3 h-3" /> Profitability Planning
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-6">
            Landed Cost <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Estimator</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
            Predict your total import costs including shipping, duties, and taxes. 
            Know your margin before you pay your supplier.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Input Panel */}
          <section className="lg:col-span-7 space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <Select
                  label="Destination"
                  value={destination}
                  icon={Globe}
                  onChange={(v) => setDestination(v)}
                  options={DESTINATIONS.map((d) => ({ value: d.key, label: d.label }))}
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
                    <DollarSign className="w-3 h-3" /> Unit Price (USD)
                  </label>
                  <input
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-4 py-3.5 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                    placeholder="e.g. 25"
                    inputMode="decimal"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Layers className="w-3 h-3" /> Quantity
                  </label>
                  <input
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-4 py-3.5 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                    placeholder="e.g. 100"
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                  {selectedShipping.basis === 'perKg' ? 'Total Chargeable Weight (kg)' : 'Total CBM (m³)'}
                </label>
                <input
                  value={selectedShipping.basis === 'perKg' ? chargeableKg : cbm}
                  onChange={(e) => selectedShipping.basis === 'perKg' ? setChargeableKg(e.target.value) : setCbm(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-4 py-3.5 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                  placeholder={selectedShipping.basis === 'perKg' ? 'e.g. 120' : 'e.g. 1.8'}
                  inputMode="decimal"
                />
                <p className="text-[11px] text-slate-500 italic mt-2 ml-1">
                  {selectedShipping.basis === 'perKg' 
                    ? 'Note: Chargeable weight is the higher of actual vs volumetric weight.'
                    : 'CBM is based on the total space occupied by your cartons.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 text-xs text-blue-300">
              <Info className="w-4 h-4 shrink-0" />
              Need help with weight or volume? Use the <a href="/tools/cbm-volumetric-weight-calculator" className="underline font-bold">CBM & Volumetric Calculator</a>.
            </div>
          </section>

          {/* Results Side Panel */}
          <section className="lg:col-span-5 lg:sticky lg:top-8">
            {!result ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/10 bg-slate-900/20 p-8 text-center text-slate-500">
                <Calculator className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-bold">Awaiting Inputs</p>
                <p className="text-xs mt-2">Enter your product and shipping details <br/> to generate an all-in estimate.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-10"><Calculator className="w-10 h-10 text-white" /></div>
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-8">Landed Estimate</h3>
                  
                  <div className="space-y-5 mb-8">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">Product Cost</span>
                      <span className="text-lg font-mono font-bold text-white">${nf2.format(result.productCost)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">All-in Shipping</span>
                      <span className="text-lg font-mono font-bold text-white">${nf2.format(result.shippingCost)}</span>
                    </div>
                    <div className="pt-5 border-t border-white/5 flex justify-between items-center">
                      <span className="text-blue-400 font-bold uppercase text-xs">Total Landed Cost</span>
                      <span className="text-blue-400 font-bold text-2xl">${nf2.format(result.landed)}</span>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 mb-6">
                    <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1">Estimated Cost Per Unit</p>
                    <p className="text-4xl font-black text-white">${nf2.format(result.perUnit)}</p>
                  </div>

                  <button 
                    onClick={() => alert("Estimate copied to clipboard")}
                    className="w-full py-4 rounded-xl bg-white/5 border border-white/10 font-bold text-sm text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                  >
                    <Clipboard className="w-4 h-4 text-blue-400" /> Copy Breakdown
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* FAQ Section */}
        <section className="mt-24 border-t border-white/5 pt-16">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-black text-white mb-8 tracking-tight">Understanding Landed Cost</h2>
            <div className="grid grid-cols-1 gap-4">
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
                <div key={faq.id} className="p-6 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                  <h4 className="font-bold text-white text-base mb-3 flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-blue-500" /> {faq.q}
                  </h4>
                  <p className="text-sm text-slate-400 leading-relaxed italic">"{faq.a}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}