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
    <main className="min-h-screen bg-[#020617] text-slate-200 pb-24">
      <div className="max-w-5xl mx-auto px-4 pt-12 sm:pt-20">
        
        {/* Header */}
        <header className="mb-12 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Scale className="w-3 h-3" />
            Freight Estimation
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-6">
            CBM & Volumetric <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Weight Calculator</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-3xl leading-relaxed">
            Calculate space and weight metrics before shipping from China. Understand your 
            chargeable weight for air freight and total volume for sea freight.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Calculator Card */}
          <section className="lg:col-span-7 space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
              
              {/* Tab Selector */}
              <div className="flex p-1 bg-slate-950/50 rounded-2xl border border-white/5 mb-8">
                {(['both', 'sea', 'air'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                      mode === m ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {m === 'both' && 'Sea + Air'}
                    {m === 'sea' && <><Ship className="w-3 h-3" /> Sea Only</>}
                    {m === 'air' && <><Plane className="w-3 h-3" /> Air Only</>}
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
                      className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-700"
                      inputMode="decimal"
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>

              {/* Actual Weight Row */}
              {(mode === 'both' || mode === 'air') && (
                <div className="mb-8 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
                    Actual Weight per Carton (kg) <span className="text-[10px] text-slate-500 font-normal italic">Optional</span>
                  </label>
                  <input
                    value={actualWeightPerCartonKg}
                    onChange={(e) => setActualWeightPerCartonKg(e.target.value)}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    inputMode="decimal"
                    placeholder="e.g. 18"
                  />
                  <p className="mt-2 text-[11px] text-slate-500">Air freight chargeable weight is the higher of actual weight and volumetric weight.</p>
                </div>
              )}

              <div className="flex gap-4">
                <button type="button" onClick={reset} className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-white/5 border border-white/10 font-bold text-sm text-slate-400 hover:bg-white/10 transition-all">
                  <RotateCcw className="w-4 h-4" /> Reset
                </button>
                <button 
                  type="button"
                  disabled={!canCalculate}
                  onClick={() => document.getElementById('results-view')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex-[2] py-4 rounded-xl bg-blue-600 font-black text-white hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/20"
                >
                  View Results
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[13px] text-amber-200/80 italic">
               <HelpCircle className="w-4 h-4 shrink-0 text-amber-400" />
               Standard formula: (L x W x H) / 6000
            </div>
          </section>

          {/* Results Side Panel */}
          <section id="results-view" className="lg:col-span-5 lg:sticky lg:top-8">
            {!calculated ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/10 bg-slate-900/20 p-8 text-center text-slate-500">
                <Maximize2 className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-bold">Awaiting Data</p>
                <p className="text-xs mt-2 leading-relaxed">Enter dimensions to calculate CBM <br/> and Volumetric Weight.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {(mode === 'both' || mode === 'sea') && (
                  <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Ship className="w-10 h-10 text-white" /></div>
                    <h3 className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-6">Sea Freight Metrics</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <span className="text-slate-400 text-sm">CBM per Carton</span>
                        <span className="text-xl font-mono text-white">{nf4.format(calculated.cbmPerCarton)} m³</span>
                      </div>
                      <div className="flex justify-between items-end pt-4 border-t border-white/5">
                        <span className="text-slate-100 font-bold">Total Volume</span>
                        <span className="text-2xl font-mono font-bold text-white">{nf4.format(calculated.totalCbm)} m³</span>
                      </div>
                    </div>
                  </div>
                )}

                {(mode === 'both' || mode === 'air') && (
                  <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Plane className="w-10 h-10 text-white" /></div>
                    <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] mb-6">Air Freight Metrics</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <span className="text-slate-400 text-sm">Volumetric per Carton</span>
                        <span className="text-xl font-mono text-white">{nf2.format(calculated.volumetricKgPerCarton)} kg</span>
                      </div>
                      <div className="flex justify-between items-end pt-4 border-t border-white/5">
                        <span className="text-slate-100 font-bold">Chargeable Weight</span>
                        <span className="text-3xl font-mono font-bold text-indigo-400">{nf2.format(calculated.chargeableKg)} kg</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-xs text-slate-400 leading-relaxed italic">
                  <b>Quick meaning:</b> Your carton size determines space (CBM). Airlines charge the higher of actual weight and volumetric weight.
                </div>
              </div>
            )}
          </section>
        </div>

        {/* FAQ Section */}
        <section className="mt-24 border-t border-white/5 pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <h2 className="text-3xl font-bold text-white mb-8 tracking-tight">CBM & Volumetric Weight FAQ</h2>
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
                  <div key={i} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                    <p className="font-bold text-slate-200 mb-2">{item.q}</p>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="lg:col-span-4 space-y-6">
              <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 shadow-xl">
                <AlertCircle className="w-8 h-8 text-blue-400 mb-6" />
                <h4 className="text-lg font-bold text-white mb-4">Common Mistakes</h4>
                <ul className="text-sm text-slate-400 space-y-3">
                  <li>• Using product dims instead of carton dims</li>
                  <li>• Forgetting to multiply by quantity</li>
                  <li>• Mixing inches with centimeters</li>
                </ul>
              </div>
              
              <div className="rounded-3xl border border-white/5 bg-slate-900/40 p-6 space-y-4">
                <p className="text-xs font-bold text-slate-500 uppercase">Tools</p>
                {[
                  { label: "Air vs Sea Calculator", href: "/tools/air-vs-sea-calculator" },
                  { label: "Landed Cost Estimator", href: "/tools/landed-cost-estimator" },
                  { label: "Carton Optimizer", href: "/tools/carton-optimization-tool" }
                ].map(tool => (
                  <a key={tool.label} href={tool.href} className="flex justify-between items-center text-sm font-medium hover:text-blue-400 transition-colors">
                    {tool.label} <ChevronRight className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}