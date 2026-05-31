'use client';

import { useMemo, useState } from 'react';
import { 
  Box, 
  Layers, 
  Maximize, 
  Minimize, 
  Calculator, 
  AlertCircle, 
  ChevronRight, 
  TrendingDown,
  Info,
  Package
} from 'lucide-react';

function toNumber(v: string): number | null {
  const cleaned = v.replace(/,/g, '').trim();
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function floorInt(n: number) {
  return Math.floor(n);
}

export default function CartonOptimizationTool() {
  // Product dimensions (cm)
  const [pL, setPL] = useState('');
  const [pW, setPW] = useState('');
  const [pH, setPH] = useState('');

  // Carton inner dimensions (cm)
  const [cL, setCL] = useState('');
  const [cW, setCW] = useState('');
  const [cH, setCH] = useState('');

  // Quantity
  const [qty, setQty] = useState('1');

  // Optional packing efficiency
  const [eff, setEff] = useState('90');

  const productDims = [toNumber(pL), toNumber(pW), toNumber(pH)];
  const cartonDims = [toNumber(cL), toNumber(cW), toNumber(cH)];
  const q = toNumber(qty);
  const e = toNumber(eff);

  const canCalc =
    productDims.every((x) => x !== null) &&
    cartonDims.every((x) => x !== null) &&
    q !== null &&
    e !== null &&
    e > 0 &&
    e <= 100;

  const nf2 = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    [],
  );

  const result = useMemo(() => {
    if (!canCalc) return null;

    const [PL, PW, PH] = productDims as number[];
    const [CL, CW, CH] = cartonDims as number[];
    const Q = q as number;
    const efficiency = (e as number) / 100;

    const orientations: [number, number, number][] = [
      [PL, PW, PH], [PL, PH, PW], [PW, PL, PH],
      [PW, PH, PL], [PH, PL, PW], [PH, PW, PL],
    ];

    let best = {
      perCarton: 0, unitsL: 0, unitsW: 0, unitsH: 0, usedVol: 0, cartonVol: 0,
      wastePct: 100, orientation: orientations[0],
    };

    const cartonVolCm3 = CL * CW * CH;

    for (const [a, b, c] of orientations) {
      const unitsL = floorInt(CL / a);
      const unitsW = floorInt(CW / b);
      const unitsH = floorInt(CH / c);
      const perCartonRaw = unitsL * unitsW * unitsH;

      if (perCartonRaw <= 0) continue;

      const productVolCm3 = a * b * c;
      const usedVol = perCartonRaw * productVolCm3;
      const wastePct = Math.max(0, Math.min(100, ((cartonVolCm3 - usedVol) / cartonVolCm3) * 100));

      if (perCartonRaw > best.perCarton || (perCartonRaw === best.perCarton && wastePct < best.wastePct)) {
        best = {
          perCarton: perCartonRaw, unitsL, unitsW, unitsH, usedVol,
          cartonVol: cartonVolCm3, wastePct, orientation: [a, b, c],
        };
      }
    }

    if (best.perCarton <= 0) return { fits: false as const };

    const cartonsNeeded = Math.ceil(Q / best.perCarton);
    const cartonCbm = (CL / 100) * (CW / 100) * (CH / 100);
    const totalCbm = cartonCbm * cartonsNeeded;
    const packedCapacity = cartonsNeeded * best.perCarton;

    return {
      fits: true as const,
      perCarton: best.perCarton,
      cartonsNeeded,
      packedCapacity,
      cartonCbm,
      totalCbm,
      wastePct: best.wastePct,
      layout: `${best.unitsL} × ${best.unitsW} × ${best.unitsH}`,
      orientation: best.orientation,
    };
  }, [canCalc, productDims, cartonDims, q, e]);

  return (
    <main className="min-h-screen bg-[#fcfcfd] text-slate-600 dark:bg-slate-950 dark:text-slate-400 pb-24">
      <div className="max-w-7xl mx-auto px-4 pt-48 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:border-indigo-900/30 dark:text-indigo-400 text-xs font-black uppercase tracking-widest mb-6">
            <Maximize className="w-3.5 h-3.5" />
            Space Optimization
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
            Carton <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-500">Optimization Tool</span>
          </h1>
          <p className="text-lg font-medium text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
            Maximize your shipping efficiency. Calculate the best stacking orientation to fit more units per box and reduce your total CBM.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Input Panel */}
          <section className="lg:col-span-7 space-y-6">
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 sm:p-10 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              
              {/* Product Dims */}
              <div className="mb-10">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4 text-indigo-500" /> Product Size (cm)
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {[['L', pL, setPL], ['W', pW, setPW], ['H', pH, setPH]].map(([label, val, setter]: any) => (
                    <div key={label} className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">{label}</label>
                      <input
                        value={val}
                        onChange={(e) => setter(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all dark:bg-slate-950/50 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600"
                        placeholder="0"
                        inputMode="decimal"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Carton Dims */}
              <div className="mb-10">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Box className="w-4 h-4 text-brand-orange-500" /> Carton Inner Size (cm)
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {[['L', cL, setCL], ['W', cW, setCW], ['H', cH, setCH]].map(([label, val, setter]: any) => (
                    <div key={label} className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">{label}</label>
                      <input
                        value={val}
                        onChange={(e) => setter(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-orange-500/50 transition-all dark:bg-slate-950/50 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600"
                        placeholder="0"
                        inputMode="decimal"
                      />
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-[11px] font-medium text-slate-500 italic">Inner dimensions provide the most accurate results.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Total Quantity</label>
                  <input
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    inputMode="decimal"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all dark:bg-slate-950/50 dark:border-slate-800 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Efficiency (%)</label>
                  <input
                    value={eff}
                    onChange={(e) => setEff(e.target.value)}
                    inputMode="decimal"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all dark:bg-slate-950/50 dark:border-slate-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Info Insight Card */}
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6 text-sm leading-relaxed text-indigo-900 dark:border-indigo-900/30 dark:bg-indigo-900/10 dark:text-indigo-200">
              <div className="flex gap-4">
                <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <p className="font-medium">85–95% efficiency is realistic for most stacked products to account for padding, human error, and structural integrity.</p>
              </div>
            </div>
          </section>

          {/* Results Panel */}
          <section className="lg:col-span-5 lg:sticky lg:top-8">
            {!result ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/50">
                <Calculator className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-600" />
                <p className="font-bold text-slate-600 dark:text-slate-400">Analysis Pending</p>
                <p className="text-sm font-medium mt-2 leading-relaxed text-slate-500 dark:text-slate-500">Enter your dimensions to find the <br/> most efficient stacking layout.</p>
              </div>
            ) : !result.fits ? (
              <div className="rounded-[32px] border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-900/30 dark:bg-rose-900/10">
                <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-4" />
                <h4 className="text-rose-900 font-bold mb-2 dark:text-rose-200">Item Doesn't Fit</h4>
                <p className="text-sm font-medium text-rose-800 dark:text-rose-300">Your product dimensions exceed the carton size in all orientations.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Result Card */}
                <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40 relative overflow-hidden dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
                  <div className="absolute top-0 right-0 p-6 opacity-10">
                    <Layers className="w-12 h-12 text-slate-900 dark:text-white" />
                  </div>
                  
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">Optimization Result</h3>
                  
                  <div className="space-y-6 mb-8">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-bold dark:text-slate-400">Units Per Carton</span>
                      <span className="text-2xl font-black text-slate-900 dark:text-white">
                        {result.perCarton} <span className="text-xs font-bold text-slate-400 dark:text-slate-500">({result.layout})</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-bold dark:text-slate-400">Cartons Needed</span>
                      <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{result.cartonsNeeded}</span>
                    </div>
                    <div className="pt-6 border-t border-slate-100 flex justify-between items-center dark:border-slate-800">
                      <span className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Total Volume</span>
                      <span className="text-slate-900 font-black text-2xl dark:text-white">{nf2.format(result.totalCbm)} m³</span>
                    </div>
                  </div>

                  <div className={`p-5 rounded-2xl border transition-all ${result.wastePct < 15 ? 'bg-emerald-50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/20' : 'bg-amber-50 border-amber-100 dark:bg-amber-900/10 dark:border-amber-900/20'}`}>
                    <div className="flex gap-3">
                      <TrendingDown className={`w-5 h-5 shrink-0 ${result.wastePct < 15 ? 'text-emerald-500 dark:text-emerald-400' : 'text-amber-500 dark:text-amber-400'}`} />
                      <div>
                        <p className={`text-[11px] font-black uppercase tracking-widest mb-1 ${result.wastePct < 15 ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>Wasted Space Estimate</p>
                        <p className={`text-xl font-black ${result.wastePct < 15 ? 'text-emerald-600 dark:text-emerald-300' : 'text-amber-600 dark:text-amber-300'}`}>
                          {nf2.format(result.wastePct)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {[
                    { label: 'Landed Cost Estimator', href: '/tools/landed-cost-estimator' },
                    { label: 'Air vs Sea Calculator', href: '/tools/air-vs-sea-calculator' }
                  ].map((tool) => (
                    <a 
                      key={tool.label}
                      href={tool.href} 
                      className="group flex items-center justify-between p-5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-all dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/80 shadow-sm"
                    >
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{tool.label}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Educational Content Section */}
        <section className="mt-32 border-t border-slate-200 pt-20 dark:border-slate-800">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Why Carton Optimization Matters</h2>
            
            <div className="space-y-8 text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
              <p>
                Every cubic centimeter of "air" in your shipping container is money wasted. Carton optimization ensures you are utilizing 
                the maximum volume of your shipping boxes, which directly reduces your total CBM (Cubic Meters) and freight costs.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
                <div className="space-y-4">
                  <h4 className="text-slate-900 font-bold flex items-center gap-2 dark:text-white">
                    <TrendingDown className="w-5 h-5 text-indigo-500" /> Lower Shipping Costs
                  </h4>
                  <p className="text-sm font-medium">Small improvements in stacking can reduce the total number of cartons needed by 10-20%, drastically cutting sea freight bills.</p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-slate-900 font-bold flex items-center gap-2 dark:text-white">
                    <Minimize className="w-5 h-5 text-brand-orange-500" /> Reduced Damage
                  </h4>
                  <p className="text-sm font-medium">Properly optimized cartons have less "void space," meaning products are less likely to shift and break during transit.</p>
                </div>
              </div>

              <h3 className="text-2xl font-black text-slate-900 pt-8 mb-6 dark:text-white">Carton Optimization FAQ</h3>
              <div className="grid grid-cols-1 gap-4">
                {[
                  {
                    q: 'Why does wasted space increase shipping cost?',
                    a: 'Freight is priced by volume (CBM). Empty space inside cartons still counts toward your total volume, so you pay for the air inside the box.',
                  },
                  {
                    q: 'Should I use inner or outer carton dimensions?',
                    a: 'Always use Inner dimensions for stacking calculations. Outer dimensions are only needed for the final CBM calculation used by the carrier.',
                  },
                  {
                    q: 'What is packing efficiency?',
                    a: 'This factor accounts for cardboard thickness, bubble wrap, and stacking errors. A value of 90% is a safe industry standard for planning.',
                  }
                ].map((item, i) => (
                  <div key={i} className="group p-6 rounded-2xl border border-slate-200 bg-white hover:border-indigo-200 hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
                    <div className="flex gap-4">
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-xs font-black text-indigo-600 border border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-900/30">
                        Q
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-base mb-2 dark:text-white">{item.q}</p>
                        <p className="text-sm font-medium text-slate-500 leading-relaxed dark:text-slate-400">{item.a}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}