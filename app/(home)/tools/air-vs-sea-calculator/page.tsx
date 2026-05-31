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
    <main className="min-h-screen bg-[#fcfcfd] text-slate-600 dark:bg-slate-950 dark:text-slate-400 pb-24">
      <div className="max-w-7xl mx-auto px-4 pt-48 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:border-indigo-900/30 dark:text-indigo-400 text-xs font-black uppercase tracking-widest mb-6">
            <ArrowRightLeft className="w-3.5 h-3.5" />
            Logistics Tool
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
            Air vs Sea <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-500">Shipping Calculator</span>
          </h1>
          <p className="text-lg font-medium text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
            Compare estimated air and sea shipping costs to determine the most cost-effective 
            method for your inventory based on weight, volume, and urgency.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Input Panel */}
          <section className="lg:col-span-7 space-y-6">
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 sm:p-10 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Total Weight (kg)</label>
                  <input
                    value={kg}
                    onChange={(e) => setKg(e.target.value)}
                    inputMode="decimal"
                    placeholder="e.g. 120"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all dark:bg-slate-950/50 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Total Volume (CBM)</label>
                  <input
                    value={cbm}
                    onChange={(e) => setCbm(e.target.value)}
                    inputMode="decimal"
                    placeholder="e.g. 1.8"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all dark:bg-slate-950/50 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Air Rate ($/kg)</label>
                  <input
                    value={airRate}
                    onChange={(e) => setAirRate(e.target.value)}
                    inputMode="decimal"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all dark:bg-slate-950/50 dark:border-slate-800 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Sea Rate ($/CBM)</label>
                  <input
                    value={seaRate}
                    onChange={(e) => setSeaRate(e.target.value)}
                    inputMode="decimal"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all dark:bg-slate-950/50 dark:border-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Is this shipment urgent?</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setUrgent('no')}
                    className={`flex-1 py-4 rounded-xl font-bold text-sm transition-all border ${
                      urgent === 'no' 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-lg dark:bg-slate-800 dark:border-slate-700' 
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 dark:bg-transparent dark:border-slate-800 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <Clock className="w-4 h-4 inline mr-2" /> No, I can wait
                  </button>
                  <button
                    onClick={() => setUrgent('yes')}
                    className={`flex-1 py-4 rounded-xl font-bold text-sm transition-all border ${
                      urgent === 'yes' 
                        ? 'bg-brand-orange-500 border-brand-orange-500 text-white shadow-lg shadow-brand-orange-500/20' 
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 dark:bg-transparent dark:border-slate-800 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <Zap className="w-4 h-4 inline mr-2" /> Yes, I need it fast
                  </button>
                </div>
              </div>
            </div>

            {/* Intuition Card */}
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6 text-sm leading-relaxed text-indigo-900 dark:border-indigo-900/30 dark:bg-indigo-900/10 dark:text-indigo-200">
              <div className="flex gap-4">
                <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-indigo-950 dark:text-indigo-100 mb-1">Break-even Point Insight</p>
                  <p>At your rates, sea becomes cheaper as CBM grows. For your current CBM ({v || '0'}), air equals sea at about <b>{result ? nf2.format(result.kgAtGivenCbm) : '0'} kg</b>. For your current weight ({w || '0'}), air equals sea at <b>{result ? nf2.format(result.cbmAtGivenKg) : '0'} CBM</b>.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Results Side Panel */}
          <section className="lg:col-span-5 lg:sticky lg:top-8">
            {!result ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/50">
                <Calculator className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-600" />
                <p className="font-bold text-slate-600 dark:text-slate-400">Ready to Compare</p>
                <p className="text-sm font-medium mt-2 leading-relaxed text-slate-500 dark:text-slate-500">Enter weight, CBM, and both rates to see the <br/> estimated cost difference.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Main Result Card */}
                <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40 relative overflow-hidden dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
                  <div className="absolute top-0 right-0 p-6">
                    {result.cheaper === 'air' ? <Plane className="w-12 h-12 text-indigo-500/10" /> : <Ship className="w-12 h-12 text-blue-500/10" />}
                  </div>
                  
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">Estimated Costs</h3>
                  
                  <div className="space-y-6 mb-8">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-bold flex items-center gap-2 dark:text-slate-400">
                        <Plane className="w-4 h-4 text-slate-400" /> Air Cost
                      </span>
                      <span className={`text-2xl font-black ${result.cheaper === 'air' ? 'text-emerald-600 underline underline-offset-8 decoration-emerald-200 dark:text-emerald-400 dark:decoration-emerald-400/30' : 'text-slate-900 dark:text-white'}`}>
                        ${nf2.format(result.airCost)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-bold flex items-center gap-2 dark:text-slate-400">
                        <Ship className="w-4 h-4 text-slate-400" /> Sea Cost
                      </span>
                      <span className={`text-2xl font-black ${result.cheaper === 'sea' ? 'text-emerald-600 underline underline-offset-8 decoration-emerald-200 dark:text-emerald-400 dark:decoration-emerald-400/30' : 'text-slate-900 dark:text-white'}`}>
                        ${nf2.format(result.seaCost)}
                      </span>
                    </div>
                    <div className="pt-6 border-t border-slate-100 flex justify-between items-center dark:border-slate-800">
                      <div>
                         <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Savings Difference</p>
                         <p className="text-indigo-600 text-xs font-bold uppercase mt-1 dark:text-indigo-400">
                           {result.cheaper === 'equal' ? 'Costs are equal' : `${result.cheaper} is cheaper`}
                         </p>
                      </div>
                      <span className="text-indigo-600 font-black text-3xl dark:text-indigo-400">${nf2.format(result.diff)}</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100 shadow-inner dark:bg-indigo-900/20 dark:border-indigo-900/30">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-indigo-500 shrink-0" />
                      <div>
                        <p className="text-[11px] font-black text-indigo-600 mb-1 uppercase tracking-widest dark:text-indigo-400">Recommendation</p>
                        <p className="text-sm text-indigo-900 leading-relaxed font-semibold dark:text-indigo-200">"{result.recommendation}"</p>
                      </div>
                    </div>
                  </div>
                  
                  {result.closeCall && (
                    <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs leading-relaxed font-medium dark:bg-amber-900/10 dark:border-amber-900/30 dark:text-amber-200">
                      <b className="font-black">Close call:</b> Costs are within ~10%. Delivery time, damage risk, and cashflow may matter more than price here.
                    </div>
                  )}
                </div>

                <a 
                  href="/tools/cbm-volumetric-weight-calculator" 
                  className="group flex items-center justify-between p-6 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-all dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/80 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-slate-100 text-slate-500 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all dark:bg-slate-800 dark:text-slate-400 dark:group-hover:text-indigo-400 dark:group-hover:bg-indigo-900/30">
                       <Calculator className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">CBM & Volumetric Calculator</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            )}
          </section>
        </div>

        {/* Educational Content Section */}
        <section className="mt-32 border-t border-slate-200 pt-20 dark:border-slate-800">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">When Should You Ship by Air vs Sea?</h2>
            
            <div className="space-y-8 text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
              <p>
                The best shipping method depends on two things: how bulky your cartons are and how fast you need delivery. Air freight is usually priced by <strong className="text-slate-900 dark:text-white">chargeable weight (kg)</strong>, while sea freight is often priced by <strong className="text-slate-900 dark:text-white">volume (CBM)</strong>.
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
                  <div key={rule.title} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                    <CheckCircle2 className="w-6 h-6 text-indigo-500 mb-4" />
                    <h4 className="text-slate-900 font-bold text-base mb-2 dark:text-white">{rule.title}</h4>
                    <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">{rule.text}</p>
                  </div>
                ))}
              </div>

              <h3 className="text-2xl font-black text-slate-900 pt-8 mb-6 dark:text-white">Air vs Sea FAQ</h3>
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

              <p className="pt-12 text-sm font-semibold">
                Need CBM or chargeable weight first? Use our{' '}
                <a href="/tools/cbm-volumetric-weight-calculator" className="text-indigo-600 font-bold hover:underline underline-offset-4 dark:text-indigo-400">
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