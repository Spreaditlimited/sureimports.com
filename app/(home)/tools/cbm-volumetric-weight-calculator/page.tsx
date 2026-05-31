'use client';

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
  ChevronRight
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
    () => new Intl.NumberFormat(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 }),
    [],
  );
  const nf4 = useMemo(
    () => new Intl.NumberFormat(undefined, { maximumFractionDigits: 4, minimumFractionDigits: 4 }),
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

  const canCalculate = inputs.L !== null && inputs.W !== null && inputs.H !== null && inputs.Q !== null;

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
    const chargeableKg = totalActualKg !== null ? Math.max(totalActualKg, totalVolumetricKg) : totalVolumetricKg;

    return { cbmPerCarton, totalCbm, volumetricKgPerCarton, totalVolumetricKg, totalActualKg, chargeableKg };
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
    <main className="min-h-screen bg-[#fcfcfd] text-slate-600 dark:bg-slate-950 dark:text-slate-400 pb-24">
      <div className="max-w-7xl mx-auto px-4 pt-48 sm:px-6 lg:px-8">
        
        {/* Header */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:border-indigo-900/30 dark:text-indigo-400 text-xs font-black uppercase tracking-widest mb-6">
            <Scale className="w-3.5 h-3.5" />
            Freight Estimation
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
            CBM & Volumetric <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-500">Weight Calculator</span>
          </h1>
          <p className="text-lg font-medium text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
            Calculate space and weight metrics before shipping from China. Understand your 
            chargeable weight for air freight and total volume for sea freight.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Calculator Card */}
          <section className="lg:col-span-7 space-y-6">
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 sm:p-10 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              
              {/* Tab Selector */}
              <div className="flex p-1 bg-slate-50 rounded-2xl border border-slate-200 mb-8 dark:bg-slate-950/50 dark:border-slate-800">
                {(['both', 'sea', 'air'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                      mode === m 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 dark:bg-indigo-500' 
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    {m === 'both' && 'Sea + Air'}
                    {m === 'sea' && <><Ship className="w-4 h-4" /> Sea Only</>}
                    {m === 'air' && <><Plane className="w-4 h-4" /> Air Only</>}
                  </button>
                ))}
              </div>

              {/* Input Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Length (cm)', val: lengthCm, set: setLengthCm },
                  { label: 'Width (cm)', val: widthCm, set: setWidthCm },
                  { label: 'Height (cm)', val: heightCm, set: setHeightCm },
                  { label: 'Qty (Cartons)', val: quantity, set: setQuantity }
                ].map((input) => (
                  <div key={input.label} className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">{input.label}</label>
                    <input
                      value={input.val}
                      onChange={(e) => input.set(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all dark:bg-slate-950/50 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600"
                      inputMode="decimal"
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>

              {/* Actual Weight Row */}
              {(mode === 'both' || mode === 'air') && (
                <div className="mb-8 p-6 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-slate-800/50 dark:border-slate-800">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest mb-2 flex items-center gap-2 dark:text-slate-300">
                    Actual Weight per Carton (kg) <span className="text-[10px] text-slate-400 font-medium italic dark:text-slate-500">Optional</span>
                  </label>
                  <input
                    value={actualWeightPerCartonKg}
                    onChange={(e) => setActualWeightPerCartonKg(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all dark:bg-slate-950/50 dark:border-slate-800 dark:text-white"
                    inputMode="decimal"
                    placeholder="e.g. 18"
                  />
                  <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">Air freight chargeable weight is the higher of actual weight and volumetric weight.</p>
                </div>
              )}

              <div className="flex gap-4">
                <button type="button" onClick={reset} className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-slate-50 border border-slate-200 font-bold text-sm text-slate-600 hover:bg-slate-100 transition-all dark:bg-white/5 dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/10">
                  <RotateCcw className="w-4 h-4" /> Reset
                </button>
                <button 
                  type="button"
                  disabled={!canCalculate}
                  onClick={() => document.getElementById('results-view')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex-[2] py-4 rounded-xl bg-brand-orange-500 font-bold text-white hover:bg-brand-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-brand-orange-500/20 border-0"
                >
                  Calculate Results
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-5 rounded-2xl bg-amber-50 border border-amber-200 text-sm font-medium text-amber-800 dark:bg-amber-900/10 dark:border-amber-900/30 dark:text-amber-200">
               <HelpCircle className="w-5 h-5 shrink-0 text-amber-500" />
               Standard formula: (L x W x H) / 6000
            </div>
          </section>

          {/* Results Side Panel */}
          <section id="results-view" className="lg:col-span-5 lg:sticky lg:top-8">
            {!calculated ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/50">
                <Maximize2 className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-600" />
                <p className="font-bold text-slate-600 dark:text-slate-400">Awaiting Data</p>
                <p className="text-sm font-medium mt-2 leading-relaxed text-slate-500">Enter dimensions to calculate CBM <br/> and Volumetric Weight.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {(mode === 'both' || mode === 'sea') && (
                  <div className="rounded-[32px] border border-slate-200 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/40 relative overflow-hidden dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Ship className="w-12 h-12 text-slate-900 dark:text-white" /></div>
                    <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-6 dark:text-indigo-400">Sea Freight Metrics</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <span className="text-slate-500 font-bold dark:text-slate-400">CBM per Carton</span>
                        <span className="text-xl font-bold text-slate-900 dark:text-white">{nf4.format(calculated.cbmPerCarton)} m³</span>
                      </div>
                      <div className="flex justify-between items-end pt-5 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-slate-700 font-black dark:text-slate-200">Total Volume</span>
                        <span className="text-3xl font-black text-slate-900 dark:text-white">{nf4.format(calculated.totalCbm)} m³</span>
                      </div>
                    </div>
                  </div>
                )}

                {(mode === 'both' || mode === 'air') && (
                  <div className="rounded-[32px] border border-slate-200 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/40 relative overflow-hidden dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Plane className="w-12 h-12 text-slate-900 dark:text-white" /></div>
                    <h3 className="text-xs font-black text-brand-orange-500 uppercase tracking-widest mb-6">Air Freight Metrics</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <span className="text-slate-500 font-bold dark:text-slate-400">Volumetric per Carton</span>
                        <span className="text-xl font-bold text-slate-900 dark:text-white">{nf2.format(calculated.volumetricKgPerCarton)} kg</span>
                      </div>
                      <div className="flex justify-between items-end pt-5 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-slate-700 font-black dark:text-slate-200">Chargeable Weight</span>
                        <span className="text-3xl font-black text-brand-orange-500">{nf2.format(calculated.chargeableKg)} kg</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-600 leading-relaxed dark:bg-white/[0.03] dark:border-white/5 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-white">Quick meaning:</strong> Your carton size determines space (CBM). Airlines charge the higher of actual weight and volumetric weight.
                </div>
              </div>
            )}
          </section>
        </div>

        {/* FAQ Section */}
        <section className="mt-24 border-t border-slate-200 pt-16 dark:border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">CBM & Volumetric Weight FAQ</h2>
              <div className="grid grid-cols-1 gap-4">
                {[
                  {
                    q: "Why is my air freight chargeable weight higher than my actual weight?",
                    a: "Airlines charge the higher of actual weight and volumetric weight. If your carton is large, the volumetric calculation can exceed your actual kg."
                  },
                  {
                    q: "Is CBM the same as weight?",
                    a: "No. CBM is space. Weight is kg. A light but bulky carton can have low kg but high CBM, making it expensive to ship."
                  },
                  {
                    q: "Should I use carton dimensions or product dimensions?",
                    a: "Use carton dimensions (the packaged box). Freight pricing is based on the shipped package, not the bare product."
                  },
                  {
                    q: "Can this calculator give me exact shipping cost?",
                    a: "No. It gives you CBM and chargeable weight, which are the numbers you need before requesting a freight quote."
                  }
                ].map((item, i) => (
                  <div key={i} className="group p-6 rounded-2xl border border-slate-200 bg-white hover:border-indigo-200 hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
                    <p className="font-bold text-slate-900 mb-2 dark:text-white">{item.q}</p>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed dark:text-slate-400">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="lg:col-span-4 space-y-6">
              <div className="p-8 rounded-[32px] bg-indigo-50 border border-indigo-100 shadow-sm dark:bg-indigo-900/10 dark:border-indigo-900/20">
                <AlertCircle className="w-8 h-8 text-indigo-500 mb-6" />
                <h4 className="text-lg font-black text-indigo-950 mb-4 dark:text-white">Common Mistakes</h4>
                <ul className="text-sm font-medium text-indigo-800 space-y-3 dark:text-indigo-200/70">
                  <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-indigo-400" /> Using product dims instead of carton dims</li>
                  <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-indigo-400" /> Forgetting to multiply by quantity</li>
                  <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-indigo-400" /> Mixing inches with centimeters</li>
                </ul>
              </div>
              
              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">More Tools</p>
                <div className="space-y-2">
                  {[
                    { label: "Air vs Sea Calculator", href: "/tools/air-vs-sea-calculator" },
                    { label: "Landed Cost Estimator", href: "/tools/landed-cost-estimator" },
                    { label: "Carton Optimizer", href: "/tools/carton-optimization-tool" }
                  ].map(tool => (
                    <a key={tool.label} href={tool.href} className="flex justify-between items-center text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors py-2 dark:text-slate-300 dark:hover:text-indigo-400">
                      {tool.label} <ChevronRight className="w-4 h-4 text-slate-400" />
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