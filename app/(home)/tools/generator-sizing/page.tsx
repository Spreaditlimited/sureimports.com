'use client';

import { useMemo, useState } from 'react';
import { 
  Zap, 
  Settings, 
  ShieldCheck, 
  AlertTriangle, 
  Clipboard, 
  Trash2, 
  Plus, 
  HelpCircle,
  Cpu,
  Activity,
  Maximize2,
  ChevronDown,
  Info
} from 'lucide-react';

function toNumber(v: string): number | null {
  const cleaned = v.replace(/,/g, '').trim();
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function hpToKw(hp: number) {
  return hp * 0.746;
}

function isMotorLike(type: LoadType) {
  return type === 'MOTOR' || type === 'COMPRESSOR';
}

function defaultPf(type: LoadType) {
  if (type === 'MOTOR' || type === 'COMPRESSOR') return 0.8;
  if (type === 'HEATER') return 1.0;
  if (type === 'WELDER') return 0.85;
  if (type === 'LIGHTING') return 0.95;
  return 0.9;
}

type StartMethod = 'DOL' | 'STAR_DELTA' | 'SOFT_STARTER' | 'VFD';
type LoadType = 'MOTOR' | 'COMPRESSOR' | 'HEATER' | 'WELDER' | 'LIGHTING' | 'OTHER';

function startMultiplier(method: StartMethod) {
  if (method === 'DOL') return 3.0;
  if (method === 'STAR_DELTA') return 1.8;
  if (method === 'SOFT_STARTER') return 1.4;
  return 1.2; // VFD
}

export default function GeneratorSizingTool() {
  const [phase, setPhase] = useState<'single' | 'three'>('three');
  const [runningKw, setRunningKw] = useState('');
  const [pf, setPf] = useState('0.80');
  const [motorUnit, setMotorUnit] = useState<'kW' | 'HP'>('kW');
  const [largestMotor, setLargestMotor] = useState('');
  const [startMethod, setStartMethod] = useState<StartMethod>('DOL');
  const [startStyle, setStartStyle] = useState<'sequential' | 'random'>('sequential');
  const [headroomPct, setHeadroomPct] = useState('30');
  const [mode, setMode] = useState<'quick' | 'engineer'>('quick');

  const rKw = toNumber(runningKw);
  const powerFactor = toNumber(pf);
  const lm = toNumber(largestMotor);
  const headroom = toNumber(headroomPct);

  const canCalc = rKw !== null && rKw > 0 && powerFactor !== null && lm !== null;

  const nf2 = useMemo(() => new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), []);

  const result = useMemo(() => {
    if (!canCalc) return null;
    const runningKva = (rKw as number) / (powerFactor as number);
    const motorKw = motorUnit === 'kW' ? (lm as number) : hpToKw(lm as number);
    const motorRunningKva = motorKw / (powerFactor as number);
    const mult = startMultiplier(startMethod);
    const motorStartKva = motorRunningKva * mult;
    const randomnessFactor = startStyle === 'random' ? 1.25 : 1.0;
    const combinedKva = (runningKva + motorStartKva) * randomnessFactor;
    const minRecommendedKva = combinedKva * (1 + (headroom as number) / 100);
    const comfortableKva = minRecommendedKva * 1.15;
    const approxKwAtPf = minRecommendedKva * (powerFactor as number);

    const share = motorRunningKva / runningKva;
    let risk = 'Low';
    if (share >= 0.5) risk = 'High';
    else if (share >= 0.25) risk = 'Medium';

    const warnings = [
      phase === 'single' ? 'Single-phase generators are rarely suitable for industrial motors.' : '3-phase systems require careful load balancing.',
      startMethod === 'DOL' ? 'DOL starting creates maximum surge. Consider VFD for large motors.' : '',
      'Voltage dips in undersized units can reset PLCs and damage motor windings.'
    ].filter(Boolean);

    return { runningKva, motorKw, motorRunningKva, motorStartKva, combinedKva, minRecommendedKva, comfortableKva, approxKwAtPf, risk, warnings };
  }, [canCalc, rKw, powerFactor, lm, motorUnit, startMethod, startStyle, headroom, phase]);

  // --- ENGINEER MODE LOGIC ---
  type LoadRow = { id: string; name: string; type: LoadType; qty: number; unit: 'kW' | 'HP'; kwOrHp: number; pf?: number; startMethod?: StartMethod; includeInStartStack: boolean; };

  function uid() { return Math.random().toString(16).slice(2) + Date.now().toString(16); }
  const [rows, setRows] = useState<LoadRow[]>([{ id: uid(), name: 'Main Extruder', type: 'MOTOR', qty: 1, unit: 'kW', kwOrHp: 15, pf: 0.8, startMethod: 'DOL', includeInStartStack: true }]);
  const [engineerPfFallback, setEngineerPfFallback] = useState('0.80');
  const [engineerHeadroomPct, setEngineerHeadroomPct] = useState('30');
  const [startScenario, setStartScenario] = useState<'largest_plus_base' | 'largest_only'>('largest_plus_base');
  const engPfFallback = toNumber(engineerPfFallback);
  const engHeadroom = toNumber(engineerHeadroomPct);

  const engineerResult = useMemo(() => {
    if (!rows.length) return null;
    if (engPfFallback === null || engPfFallback <= 0 || engPfFallback > 1)
      return null;
    if (engHeadroom === null || engHeadroom < 0 || engHeadroom > 80)
      return null;

    let totalKw = 0;
    let totalKva = 0;
    let largestMotorKva = 0;
    let largestMotorRow: LoadRow | null = null;
    let baseKva = 0;
    
    rows.forEach(r => {
      const qty = Number.isFinite(r.qty) && r.qty > 0 ? r.qty : 0;
      const val = Number.isFinite(r.kwOrHp) && r.kwOrHp > 0 ? r.kwOrHp : 0;
      if (!qty || !val) return;

      const kwEach = r.unit === 'kW' ? r.kwOrHp : hpToKw(r.kwOrHp);
      const kw = kwEach * qty;
      const pfUsed =
        r.pf && r.pf > 0 && r.pf <= 1 ? r.pf : defaultPf(r.type);
      const kva = kw / pfUsed;

      totalKw += kw;
      totalKva += kva;

      if (isMotorLike(r.type) && kva > largestMotorKva) {
        largestMotorKva = kva;
        largestMotorRow = r;
      }

      if (r.includeInStartStack) baseKva += kva;
    });

    if (totalKw <= 0 || totalKva <= 0) return null;

    const surgeMult = startMultiplier(
      (largestMotorRow as LoadRow | null)?.startMethod ?? 'DOL',
    );
    const motorStartKva = largestMotorKva * surgeMult;
    const stackKva = startScenario === 'largest_only' ? motorStartKva : baseKva + motorStartKva;
    const minKva = stackKva * (1 + engHeadroom / 100);

    let risk: 'Low' | 'Medium' | 'High' = 'Low';
    const share = largestMotorKva / totalKva;
    if (share >= 0.5) risk = 'High';
    else if (share >= 0.25) risk = 'Medium';
    
    return { totalKw, totalKva, motorStartKva, stackKva, minKva, risk };
  }, [rows, engPfFallback, engHeadroom, startScenario]);

  return (
    <main className="min-h-screen bg-[#fcfcfd] text-slate-600 dark:bg-slate-950 dark:text-slate-400 pb-24">
      <div className="max-w-7xl mx-auto px-4 pt-48 sm:px-6 lg:px-8">
        
        {/* Header */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:border-indigo-900/30 dark:text-indigo-400 text-xs font-black uppercase tracking-widest mb-6">
            <Zap className="w-3.5 h-3.5" /> Industrial Power Tool
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
            Generator <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-500">Sizing Calculator</span>
          </h1>
          <p className="text-lg font-medium text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
            Ensure your factory line stays stable. Calculate required kVA capacity based on 
            running loads and critical motor startup surges.
          </p>
        </header>

        {/* Mode Toggles */}
        <div className="flex p-1 bg-slate-50 border border-slate-200 rounded-2xl w-fit mb-8 dark:bg-slate-950/50 dark:border-slate-800">
          <button 
            onClick={() => setMode('quick')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${mode === 'quick' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 dark:bg-indigo-500' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
          >
            <Activity className="w-4 h-4" /> Quick Estimate
          </button>
          <button 
            onClick={() => setMode('engineer')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${mode === 'engineer' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 dark:bg-indigo-500' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
          >
            <Cpu className="w-4 h-4" /> Engineer Mode
          </button>
        </div>

        {mode === 'quick' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Input Panel */}
            <section className="lg:col-span-7 space-y-6 min-w-0">
              <div className="rounded-[32px] border border-slate-200 bg-white p-6 sm:p-10 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                
                {/* Phase Selection */}
                <div className="mb-8">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-3 ml-1">Supply Configuration</label>
                  <div className="flex flex-wrap gap-3">
                    {(['three', 'single'] as const).map(p => (
                      <button 
                        key={p} onClick={() => setPhase(p)}
                        className={`flex-1 min-w-[140px] py-4 rounded-xl border text-sm font-bold transition-all ${phase === p ? 'bg-slate-900 border-slate-900 text-white shadow-md dark:bg-slate-800 dark:border-slate-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-950/50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/50'}`}
                      >
                        {p === 'three' ? '3-Phase' : 'Single-Phase'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Running Load Dims */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                  <div className="space-y-2 min-w-0">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Running Load (kW)</label>
                    <input 
                      value={runningKw} 
                      onChange={(e) => setRunningKw(e.target.value)} 
                      className="w-full box-border bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all dark:bg-slate-950/50 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600" 
                      placeholder="e.g. 45" 
                      inputMode="decimal"
                    />
                  </div>
                  <div className="space-y-2 min-w-0">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Power Factor (PF)</label>
                    <input 
                      value={pf} 
                      onChange={(e) => setPf(e.target.value)} 
                      className="w-full box-border bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all dark:bg-slate-950/50 dark:border-slate-800 dark:text-white" 
                      inputMode="decimal"
                    />
                  </div>
                </div>

                {/* Motor Surge Dims */}
                <div className="border-t border-slate-100 pt-8 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2 dark:text-white">
                    <Maximize2 className="w-5 h-5 text-brand-orange-500" /> Startup Surge Component
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2 min-w-0">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Largest Motor Size</label>
                      <div className="flex w-full box-border">
                        <input 
                          value={largestMotor} 
                          onChange={(e) => setLargestMotor(e.target.value)} 
                          className="flex-1 min-w-0 bg-slate-50 border border-slate-200 rounded-l-xl px-4 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all dark:bg-slate-950/50 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600" 
                          placeholder="e.g. 15" 
                          inputMode="decimal"
                        />
                        <button 
                          onClick={() => setMotorUnit(motorUnit === 'kW' ? 'HP' : 'kW')} 
                          className="bg-slate-100 border border-slate-200 border-l-0 rounded-r-xl px-5 text-xs font-bold text-indigo-600 whitespace-nowrap hover:bg-slate-200 transition-colors dark:bg-slate-800 dark:border-slate-800 dark:text-indigo-400 dark:hover:bg-slate-700"
                        >
                          {motorUnit}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2 min-w-0">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Starting Method</label>
                      <div className="relative w-full">
                        <select
                          value={startMethod}
                          onChange={(e) => setStartMethod(e.target.value as StartMethod)}
                          className="block w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 pr-10 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all dark:bg-slate-950/50 dark:border-slate-800 dark:text-white"
                        >
                          <option value="DOL">DOL (Direct-On-Line)</option>
                          <option value="STAR_DELTA">Star-Delta</option>
                          <option value="SOFT_STARTER">Soft Starter</option>
                          <option value="VFD">VFD / Inverter</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Result Panel */}
            <section className="lg:col-span-5 lg:sticky lg:top-8 min-w-0">
              {!result ? (
                <div className="h-full min-h-[300px] flex flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900/50">
                  <Settings className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-600 animate-[spin_4s_linear_infinite]" />
                  <p className="font-bold text-slate-600 dark:text-slate-400">Analysis Pending</p>
                  <p className="text-sm font-medium mt-2 leading-relaxed text-slate-500">Complete the inputs to see <br/> sizing recommendations.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-[32px] border border-slate-200 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/40 relative overflow-hidden dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
                    <div className="absolute top-0 right-0 p-6 opacity-10"><ShieldCheck className="w-12 h-12 text-slate-900 dark:text-white" /></div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">Capacity Analysis</h3>
                    
                    <div className="space-y-5 mb-8">
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-slate-500 font-bold whitespace-nowrap dark:text-slate-400">Running kVA</span>
                        <span className="text-2xl font-black text-slate-900 truncate dark:text-white">{nf2.format(result.runningKva)} kVA</span>
                      </div>
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-brand-orange-600 font-bold whitespace-nowrap dark:text-brand-orange-500">Startup Peak</span>
                        <span className="text-2xl font-black text-brand-orange-500 truncate">{nf2.format(result.motorStartKva)} kVA</span>
                      </div>
                      <div className="pt-6 border-t border-slate-100 flex justify-between items-center gap-4 dark:border-slate-800">
                        <span className="text-slate-400 font-black uppercase text-[10px] tracking-widest whitespace-nowrap">Min Recommended</span>
                        <span className="text-indigo-600 font-black text-3xl truncate dark:text-indigo-400">{nf2.format(result.minRecommendedKva)} kVA</span>
                      </div>
                    </div>

                    <div className={`p-5 rounded-2xl border ${result.risk === 'High' ? 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/10 dark:border-rose-900/30 dark:text-rose-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/10 dark:border-emerald-900/30 dark:text-emerald-400'}`}>
                      <div className="flex gap-3 items-center">
                        <AlertTriangle className="w-5 h-5 shrink-0" />
                        <span className="text-[11px] font-black uppercase tracking-widest">Starting Risk: {result.risk}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => alert("Copied to clipboard")} 
                      className="w-full box-border mt-6 py-4 rounded-xl bg-indigo-600 font-bold text-white hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 border-0 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                    >
                      <Clipboard className="w-4 h-4" /> Copy Recommendation
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        ) : (
          /* --- ENGINEER MODE --- */
          <div className="space-y-6 min-w-0">
             <div className="rounded-[32px] border border-slate-200 bg-white p-6 sm:p-10 shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white whitespace-nowrap flex items-center gap-2">
                   <Settings className="w-5 h-5 text-indigo-500" /> Load Schedule
                 </h3>
                 <button onClick={() => alert("Sample Added")} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
                   Load Sample Factory Template
                 </button>
              </div>
              
              <div className="overflow-x-auto w-full custom-scrollbar pb-4">
                <table className="w-full min-w-[800px] border-collapse">
                  <thead>
                    <tr className="text-[10px] uppercase text-slate-400 tracking-widest border-b border-slate-100 dark:border-slate-800">
                      <th className="pb-4 text-left font-black">Load Name</th>
                      <th className="pb-4 text-left font-black">Type</th>
                      <th className="pb-4 text-left font-black">Rating</th>
                      <th className="pb-4 text-left font-black">Start Type</th>
                      <th className="pb-4 text-center font-black">Qty</th>
                      <th className="pb-4 text-right font-black">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                    {rows.map(row => (
                      <tr key={row.id} className="group">
                        <td className="py-4 pr-4">
                          <input defaultValue={row.name} className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none focus:text-indigo-600 transition-colors dark:text-white dark:focus:text-indigo-400" />
                        </td>
                        <td className="py-4 text-xs font-bold text-slate-500 dark:text-slate-400">{row.type}</td>
                        <td className="py-4 text-sm font-bold text-slate-900 whitespace-nowrap dark:text-white">{row.kwOrHp} {row.unit}</td>
                        <td className="py-4">
                          <span className="text-[10px] bg-slate-100 px-2 py-1 rounded-md uppercase font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {row.startMethod || 'Resistive'}
                          </span>
                        </td>
                        <td className="py-4 text-center text-sm font-bold text-slate-900 dark:text-white">{row.qty}</td>
                        <td className="py-4 text-right">
                          <button className="text-slate-400 hover:text-rose-500 transition-colors dark:text-slate-500 dark:hover:text-rose-400">
                            <Trash2 className="w-4 h-4 ml-auto" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button className="mt-4 w-full py-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all flex items-center justify-center gap-2 text-sm font-bold dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400 dark:hover:border-indigo-800 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-400">
                <Plus className="w-4 h-4" /> Add Load Row
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="p-8 rounded-[32px] bg-indigo-50 border border-indigo-100 dark:bg-indigo-900/10 dark:border-indigo-900/20 shadow-sm">
                <p className="text-[11px] font-black text-indigo-600 uppercase mb-2 tracking-widest dark:text-indigo-400">Total Running</p>
                <p className="text-3xl font-black text-indigo-950 truncate dark:text-white">{nf2.format(engineerResult?.totalKw || 0)} kW</p>
              </div>
              <div className="p-8 rounded-[32px] bg-amber-50 border border-amber-200 dark:bg-amber-900/10 dark:border-amber-900/20 shadow-sm">
                <p className="text-[11px] font-black text-amber-600 uppercase mb-2 tracking-widest dark:text-amber-500">Max Surge</p>
                <p className="text-3xl font-black text-amber-600 truncate dark:text-amber-500">{nf2.format(engineerResult?.motorStartKva || 0)} kVA</p>
              </div>
              <div className="p-8 rounded-[32px] bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                <p className="text-[11px] font-black text-slate-400 uppercase mb-2 tracking-widest">Recommended</p>
                <p className="text-3xl font-black text-slate-900 truncate dark:text-white">{nf2.format(engineerResult?.minKva || 0)} kVA</p>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <section className="mt-24 max-w-4xl border-t border-slate-200 pt-16 dark:border-slate-800">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Industrial Power Considerations</h2>
          <div className="grid grid-cols-1 gap-12">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4 tracking-tight dark:text-white">
                <Zap className="w-5 h-5 text-indigo-500" /> The kVA vs kW Distinction
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm font-medium dark:text-slate-400">
                Generators are rated in kVA (Apparent Power), while industrial machine labels often highlight kW (Real Power). 
                Motors require "Reactive Power" to generate magnetic fields—a component not reflected in kW. 
                Sizing by kW alone leads to alternator strain and unstable voltage regulation.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { 
                  q: "How does 'Inrush Current' impact my setup?", 
                  a: "When a motor starts from a standstill, it draws a massive spike of energy (Inrush) to overcome inertia. This can be up to 600% of its running current." 
                },
                { 
                  q: "Why sequential starting is vital?", 
                  a: "Simultaneous starts compound surges. A sequential logic allows the generator’s governor to stabilize between events, preventing total system collapse." 
                }
              ].map(faq => (
                <div key={faq.q} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 text-base mb-3 dark:text-white">{faq.q}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium dark:text-slate-400">"{faq.a}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}