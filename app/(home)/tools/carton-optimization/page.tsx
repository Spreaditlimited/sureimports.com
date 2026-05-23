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
    e! > 0 &&
    e! <= 100;

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

    const cartonsNeeded = Math.ceil((q as number) / best.perCarton);
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
    <main className="min-h-screen bg-[#020617] text-slate-200 pb-24">
      <div className="max-w-6xl mx-auto px-4 pt-12 sm:pt-20">
        
        {/* Header Section */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Maximize className="w-3 h-3" />
            Space Optimization
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-6">
            Carton <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Optimization Tool</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-3xl leading-relaxed">
            Maximize your shipping efficiency. Calculate the best stacking orientation to fit more units per box and reduce your total CBM.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Input Panel */}
          <section className="lg:col-span-7 space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
              
              {/* Product Dims */}
              <div className="mb-10">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-400" /> Product Size (cm)
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {[['L', pL, setPL], ['W', pW, setPW], ['H', pH, setPH]].map(([label, val, setter]: any) => (
                    <div key={label} className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">{label}</label>
                      <input
                        value={val}
                        onChange={(e) => setter(e.target.value)}
                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Carton Dims */}
              <div className="mb-10">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Box className="w-4 h-4 text-purple-400" /> Carton Inner Size (cm)
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {[['L', cL, setCL], ['W', cW, setCW], ['H', cH, setCH]].map(([label, val, setter]: any) => (
                    <div key={label} className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">{label}</label>
                      <input
                        value={val}
                        onChange={(e) => setter(e.target.value)}
                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-[11px] text-slate-500 italic">Inner dimensions provide the most accurate results.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Total Quantity</label>
                  <input
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Efficiency (%)</label>
                  <input
                    value={eff}
                    onChange={(e) => setEff(e.target.value)}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-6 text-sm leading-relaxed text-slate-400">
              <div className="flex gap-4">
                <Info className="w-5 h-5 text-blue-400 shrink-0" />
                <p>85–95% efficiency is realistic for most stacked products to account for padding and structural integrity.</p>
              </div>
            </div>
          </section>

          {/* Results Panel */}
          <section className="lg:col-span-5 lg:sticky lg:top-8">
            {!result ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/10 text-slate-500 p-8 text-center bg-slate-900/20">
                <Calculator className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-bold text-slate-400">Analysis Pending</p>
                <p className="text-xs mt-2 leading-relaxed">Enter your dimensions to find the <br/> most efficient stacking layout.</p>
              </div>
            ) : !result.fits ? (
              <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center">
                <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
                <h4 className="text-white font-bold mb-2">Item Doesn't Fit</h4>
                <p className="text-sm text-slate-400">Your product dimensions exceed the carton size in all orientations.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-10">
                    <Layers className="w-12 h-12 text-white" />
                  </div>
                  
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em] mb-8">Optimization Result</h3>
                  
                  <div className="space-y-6 mb-8">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-medium">Units Per Carton</span>
                      <span className="text-2xl font-mono font-bold text-white">
                        {result.perCarton} <span className="text-xs text-slate-500">({result.layout})</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-medium">Cartons Needed</span>
                      <span className="text-2xl font-mono font-bold text-blue-400">{result.cartonsNeeded}</span>
                    </div>
                    <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                      <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Total Volume</span>
                      <span className="text-white font-bold text-2xl">{nf2.format(result.totalCbm)} m³</span>
                    </div>
                  </div>

                  <div className={`p-5 rounded-2xl border transition-all ${result.wastePct < 15 ? 'bg-green-500/10 border-green-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
                    <div className="flex gap-3">
                      <TrendingDown className={`w-5 h-5 shrink-0 ${result.wastePct < 15 ? 'text-green-400' : 'text-amber-400'}`} />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-tighter text-white">Wasted Space Estimate</p>
                        <p className={`text-xl font-mono font-bold ${result.wastePct < 15 ? 'text-green-400' : 'text-amber-400'}`}>
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
                      className="group flex items-center justify-between p-5 rounded-2xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.07] transition-all"
                    >
                      <span className="text-sm font-semibold">{tool.label}</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Content Section */}
        <section className="mt-32 border-t border-white/5 pt-20">
          <div className="max-w-4xl">
            <h2 className="text-4xl font-bold text-white mb-8 tracking-tight">Why Carton Optimization Matters</h2>
            
            <div className="space-y-8 text-slate-400 leading-relaxed text-lg">
              <p>
                Every cubic centimeter of "air" in your shipping container is money wasted. Carton optimization ensures you are utilizing 
                the maximum volume of your shipping boxes, which directly reduces your total CBM (Cubic Meters) and freight costs.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
                <div className="space-y-4">
                  <h4 className="text-white font-bold flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-blue-400" /> Lower Shipping Costs
                  </h4>
                  <p className="text-sm">Small improvements in stacking can reduce the total number of cartons needed by 10-20%, drastically cutting sea freight bills.</p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-white font-bold flex items-center gap-2">
                    <Minimize className="w-5 h-5 text-purple-400" /> Reduced Damage
                  </h4>
                  <p className="text-sm">Properly optimized cartons have less "void space," meaning products are less likely to shift and break during transit.</p>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white pt-8 mb-6">Carton Optimization FAQ</h3>
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
                  <div key={i} className="group p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                    <div className="flex gap-4">
                      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-[10px] font-bold text-blue-400 border border-blue-500/20">
                        Q
                      </div>
                      <div>
                        <p className="font-bold text-slate-200 text-base mb-2 group-hover:text-white transition-colors">{item.q}</p>
                        <p className="text-sm text-slate-500 leading-relaxed italic">{item.a}</p>
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