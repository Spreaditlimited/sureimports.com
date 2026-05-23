'use client';

import { useMemo, useState } from 'react';
import { 
  Plane, 
  Ship, 
  AlertCircle, 
  ArrowRightLeft, 
  Zap, 
  Clock, 
  Calculator,
  ChevronRight,
  Info,
  CheckCircle2
} from 'lucide-react';

function toNumber(v: string): number | null {
  const cleaned = v.replace(/,/g, '').trim();
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export default function AirVsSeaCalculator() {
  const [kg, setKg] = useState('');
  const [cbm, setCbm] = useState('');
  const [airRate, setAirRate] = useState('10');
  const [seaRate, setSeaRate] = useState('350');
  const [urgent, setUrgent] = useState<'yes' | 'no'>('no');

  const w = toNumber(kg);
  const v = toNumber(cbm);
  const air = toNumber(airRate);
  const sea = toNumber(seaRate);

  const canCalc = Boolean(w !== null && v !== null && air !== null && sea !== null);

  const nf2 = useMemo(
    () => new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    []
  );

  const result = useMemo(() => {
    if (!canCalc) return null;
    const airCost = (air as number) * (w as number);
    const seaCost = (sea as number) * (v as number);
    const diff = Math.abs(airCost - seaCost);
    const cheaper = airCost < seaCost ? 'air' : airCost > seaCost ? 'sea' : 'equal';
    const kgAtGivenCbm = ((sea as number) / (air as number)) * (v as number);
    const cbmAtGivenKg = ((air as number) / (sea as number)) * (w as number);

    let recommendation = '';
    if (cheaper === 'equal') recommendation = 'Air and Sea are identical in cost based on your inputs.';
    if (cheaper === 'air') {
      recommendation = urgent === 'yes' 
        ? 'Air is cheaper and also faster. Air makes sense for this shipment.' 
        : 'Air is cheaper based on cost. If you are not shipping very bulky cartons, air can make sense.';
    }
    if (cheaper === 'sea') {
      recommendation = urgent === 'yes'
        ? 'Sea is cheaper, but you marked this shipment as urgent. If delivery time matters, consider paying extra for air.'
        : 'Sea is cheaper. For bulky shipments, sea usually makes more financial sense.';
    }

    const minCost = Math.min(airCost, seaCost);
    const closeCall = minCost > 0 ? diff / minCost <= 0.1 : false;

    return { airCost, seaCost, diff, cheaper, recommendation, closeCall, kgAtGivenCbm, cbmAtGivenKg };
  }, [canCalc, air, sea, w, v, urgent]);

  return (
    <main className="min-h-screen bg-[#020617] text-slate-200 pb-24">
      <div className="max-w-6xl mx-auto px-4 pt-12 sm:pt-20">
        
        {/* Header Section */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
            <ArrowRightLeft className="w-3 h-3" />
            Logistics Tool
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-6">
            Air vs Sea <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Shipping Calculator</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-3xl leading-relaxed">
            Compare estimated air and sea shipping costs to determine the most cost-effective 
            method for your inventory based on weight, volume, and urgency.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Input Panel */}
          <section className="lg:col-span-7 space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Total Weight (kg)</label>
                  <input
                    value={kg}
                    onChange={(e) => setKg(e.target.value)}
                    inputMode="decimal"
                    placeholder="e.g. 120"
                    className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Total Volume (CBM)</label>
                  <input
                    value={cbm}
                    onChange={(e) => setCbm(e.target.value)}
                    inputMode="decimal"
                    placeholder="e.g. 1.8"
                    className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Air Rate ($/kg)</label>
                  <input
                    value={airRate}
                    onChange={(e) => setAirRate(e.target.value)}
                    inputMode="decimal"
                    className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Sea Rate ($/CBM)</label>
                  <input
                    value={seaRate}
                    onChange={(e) => setSeaRate(e.target.value)}
                    inputMode="decimal"
                    className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Is this shipment urgent?</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setUrgent('no')}
                    className={`flex-1 py-4 rounded-2xl font-bold text-sm transition-all border ${
                      urgent === 'no' ? 'bg-white/10 border-white/20 text-white shadow-lg' : 'bg-transparent border-white/5 text-slate-500 hover:bg-white/5'
                    }`}
                  >
                    <Clock className="w-4 h-4 inline mr-2" /> No, I can wait
                  </button>
                  <button
                    onClick={() => setUrgent('yes')}
                    className={`flex-1 py-4 rounded-2xl font-bold text-sm transition-all border ${
                      urgent === 'yes' ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-600/20' : 'bg-transparent border-white/5 text-slate-500 hover:bg-white/5'
                    }`}
                  >
                    <Zap className="w-4 h-4 inline mr-2" /> Yes, I need it fast
                  </button>
                </div>
              </div>
            </div>

            {/* Intuition Card */}
            <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-6 text-sm leading-relaxed text-slate-400">
              <div className="flex gap-4">
                <Info className="w-5 h-5 text-blue-400 shrink-0" />
                <div>
                  <p className="font-bold text-slate-200 mb-1">Break-even Point</p>
                  <p>At your rates, sea becomes cheaper as CBM grows. For your current CBM ({v || '0'}), air equals sea at about <b>{result ? nf2.format(result.kgAtGivenCbm) : '0'} kg</b>. For your current weight ({w || '0'}), air equals sea at <b>{result ? nf2.format(result.cbmAtGivenKg) : '0'} CBM</b>.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Results Side Panel */}
          <section className="lg:col-span-5 lg:sticky lg:top-8">
            {!result ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/10 text-slate-500 p-8 text-center bg-slate-900/20">
                <Calculator className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-bold text-slate-400">Ready to Compare</p>
                <p className="text-xs mt-2 leading-relaxed">Enter weight, CBM, and both rates to see the <br/> estimated cost difference.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Main Result Card */}
                <div className="rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6">
                    {result.cheaper === 'air' ? <Plane className="w-8 h-8 text-blue-500/20" /> : <Ship className="w-8 h-8 text-indigo-500/20" />}
                  </div>
                  
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em] mb-8">Estimated Costs</h3>
                  
                  <div className="space-y-6 mb-8">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-medium flex items-center gap-2">
                        <Plane className="w-4 h-4" /> Air Cost
                      </span>
                      <span className={`text-2xl font-mono font-bold ${result.cheaper === 'air' ? 'text-green-400 underline underline-offset-8 decoration-green-400/30' : 'text-white'}`}>
                        ${nf2.format(result.airCost)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-medium flex items-center gap-2">
                        <Ship className="w-4 h-4" /> Sea Cost
                      </span>
                      <span className={`text-2xl font-mono font-bold ${result.cheaper === 'sea' ? 'text-green-400 underline underline-offset-8 decoration-green-400/30' : 'text-white'}`}>
                        ${nf2.format(result.seaCost)}
                      </span>
                    </div>
                    <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                      <div>
                         <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Savings Difference</p>
                         <p className="text-blue-400 text-xs font-medium uppercase mt-1">
                           {result.cheaper === 'equal' ? 'Costs are equal' : `${result.cheaper} is cheaper`}
                         </p>
                      </div>
                      <span className="text-blue-400 font-bold text-3xl">${nf2.format(result.diff)}</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 shadow-inner">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-400 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-blue-300 mb-1 uppercase tracking-tighter">Recommendation</p>
                        <p className="text-sm text-slate-200 leading-relaxed italic font-medium">"{result.recommendation}"</p>
                      </div>
                    </div>
                  </div>
                  
                  {result.closeCall && (
                    <div className="mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs leading-relaxed">
                      <b>Close call:</b> Costs are within ~10%. Delivery time, damage risk, and cashflow may matter more than price here.
                    </div>
                  )}
                </div>

                <a 
                  href="/tools/cbm-volumetric-weight-calculator" 
                  className="group flex items-center justify-between p-6 rounded-2xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.07] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/5 text-slate-300 group-hover:text-white group-hover:bg-blue-500 transition-all">
                       <Calculator className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold">CBM & Volumetric Calculator</span>
                  </div>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            )}
          </section>
        </div>

        {/* Educational Content Section */}
        <section className="mt-32 border-t border-white/5 pt-20">
          <div className="max-w-4xl">
            <h2 className="text-4xl font-bold text-white mb-8 tracking-tight">When Should You Ship by Air vs Sea?</h2>
            
            <div className="space-y-8 text-slate-400 leading-relaxed text-lg">
              <p>
                The best shipping method depends on two things: how bulky your cartons are and how fast you need delivery. Air freight is usually priced by <strong>chargeable weight (kg)</strong>, while sea freight is often priced by <strong>volume (CBM)</strong>.
              </p>
              <p>
                That is why a shipment that looks “light” can still be expensive by air if it is bulky, and why a shipment can be affordable by sea once the volume becomes large enough.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
                {[
                  { title: "Urgency", text: "If the shipment is urgent, air may be worth the premium." },
                  { title: "Bulkiness", text: "If the cartons are bulky and you can wait, sea usually wins on cost." },
                  { title: "The 10% Rule", text: "If costs are within 10%, choose based on speed and reliability." }
                ].map(rule => (
                  <div key={rule.title} className="p-6 rounded-2xl bg-slate-900/40 border border-white/5">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 mb-4" />
                    <h4 className="text-white font-bold text-sm mb-2">{rule.title}</h4>
                    <p className="text-sm leading-relaxed">{rule.text}</p>
                  </div>
                ))}
              </div>

              <h3 className="text-2xl font-bold text-white pt-8 mb-6">Air vs Sea FAQ</h3>
              <div className="grid grid-cols-1 gap-4">
                {[
                  {
                    q: 'Why is air shipping more expensive for bulky items?',
                    a: 'Air freight often charges by chargeable weight. If your carton is large, the volumetric weight can be higher than the actual weight, so you pay more even when it feels “light.”',
                  },
                  {
                    q: 'Why is sea shipping often cheaper for large shipments?',
                    a: 'Sea shipping is commonly priced by CBM. Once your total volume increases, sea becomes more cost efficient than paying per kg by air.',
                  },
                  {
                    q: 'What should I use as my inputs?',
                    a: 'Use your total shipment weight in kg and your total volume in CBM. Then enter the current rates you are being quoted (air per kg and sea per CBM).',
                  },
                  {
                    q: 'If the calculator says sea is cheaper, should I always choose sea?',
                    a: 'Not always. If you need the goods urgently or the shipment is small and time sensitive, air may still be the right move.',
                  },
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

              <p className="pt-12 text-sm">
                Need CBM or chargeable weight first? Use our{' '}
                <a href="/tools/cbm-volumetric-weight-calculator" className="text-blue-400 font-bold hover:underline underline-offset-4">
                  CBM & Volumetric Weight Calculator
                </a>.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}