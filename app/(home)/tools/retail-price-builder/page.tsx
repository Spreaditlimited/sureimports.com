'use client';

import { useMemo, useState } from 'react';
import { 
  Tag, 
  TrendingUp, 
  Percent, 
  ShieldAlert, 
  DollarSign, 
  ShoppingCart, 
  AlertCircle,
  ChevronRight,
  Calculator,
  ArrowDown,
  Info
} from 'lucide-react';

function toNumber(v: string): number | null {
  const cleaned = v.replace(/,/g, '').trim();
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export default function RetailPriceBuilder() {
  const [currency, setCurrency] = useState<'USD' | 'NGN'>('USD');

  // Inputs
  const [landedCost, setLandedCost] = useState('');
  const [marketingCost, setMarketingCost] = useState('0');
  const [desiredMarginPct, setDesiredMarginPct] = useState('30');
  const [paymentFeesPct, setPaymentFeesPct] = useState('1.5');
  const [bufferPct, setBufferPct] = useState('3');
  const [discountPct, setDiscountPct] = useState('10');
  const [resellerDiscountPct, setResellerDiscountPct] = useState('15');

  const lc = toNumber(landedCost);
  const mk = toNumber(marketingCost);
  const mPct = toNumber(desiredMarginPct);
  const feePct = toNumber(paymentFeesPct);
  const bufPct = toNumber(bufferPct);
  const discPct = toNumber(discountPct);
  const resDiscPct = toNumber(resellerDiscountPct);

  const canCalc = lc !== null && mPct !== null && mPct! < 95;

  const nf2 = useMemo(() => new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }), []);

  const result = useMemo(() => {
    if (!canCalc) return null;

    const baseCost = (lc as number) + (mk || 0);
    const bufferedCost = baseCost * (1 + (bufPct || 0) / 100);
    const fee = (feePct || 0) / 100;
    const targetMargin = (mPct as number) / 100;
    const denom = 1 - fee - targetMargin;

    if (denom <= 0.02) {
      return { error: 'Margin + Fees too high. Reduce targets to get a realistic price.' } as const;
    }

    const retailPrice = bufferedCost / denom;
    const paymentFees = retailPrice * fee;
    const revenueAfterFees = retailPrice - paymentFees;
    const profit = revenueAfterFees - bufferedCost;
    const marginAchieved = profit / retailPrice;
    const promoPrice = retailPrice * (1 - (discPct || 0) / 100);
    const breakEvenPrice = bufferedCost / (1 - fee);
    const resellerPrice = retailPrice * (1 - (resDiscPct || 0) / 100);
    const recommendedFloor = Math.max(breakEvenPrice, promoPrice);

    return { baseCost, bufferedCost, retailPrice, profit, marginAchieved, breakEvenPrice, promoPrice, recommendedFloor, resellerPrice } as const;
  }, [canCalc, lc, mk, mPct, feePct, bufPct, discPct, resDiscPct]);

  const symbol = currency === 'USD' ? '$' : '₦';

  return (
    <main className="min-h-screen bg-[#020617] text-slate-200 pb-24">
      <div className="max-w-6xl mx-auto px-4 pt-12 sm:pt-20">
        
        {/* Header */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
            <TrendingUp className="w-3 h-3" /> Pricing Strategy Tool
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-6">
            Retail Price <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Builder</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-3xl leading-relaxed">
            Protect your margins. Turn your landed cost into a strategic selling price that 
            accounts for marketing, payment fees, and promotional safety nets.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Input Panel */}
          <section className="lg:col-span-7 space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
              
              {/* Currency & Cost */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                 <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white uppercase tracking-tight">Core Unit Costs</h3>
                    <p className="text-xs text-slate-500 italic">Enter costs per individual item.</p>
                 </div>
                 <div className="flex p-1 bg-slate-950 rounded-xl border border-white/5">
                    <button onClick={() => setCurrency('USD')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${currency === 'USD' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>USD</button>
                    <button onClick={() => setCurrency('NGN')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${currency === 'NGN' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>NGN</button>
                 </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Landed Cost Per Unit</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">{symbol}</span>
                    <input value={landedCost} onChange={(e) => setLandedCost(e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-10 pr-4 py-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="0.00" inputMode="decimal" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Marketing (CAC) Per Unit</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">{symbol}</span>
                    <input value={marketingCost} onChange={(e) => setMarketingCost(e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-10 pr-4 py-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="0.00" inputMode="decimal" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Desired Margin (%)</label>
                  <input value={desiredMarginPct} onChange={(e) => setDesiredMarginPct(e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none" inputMode="decimal" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Payment Fees (%)</label>
                  <input value={paymentFeesPct} onChange={(e) => setPaymentFeesPct(e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none" inputMode="decimal" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Buffer (%)</label>
                  <input value={bufferPct} onChange={(e) => setBufferPct(e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none" inputMode="decimal" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Promo Disc (%)</label>
                  <input value={discountPct} onChange={(e) => setDiscountPct(e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none" inputMode="decimal" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Reseller Disc (%)</label>
                  <input value={resellerDiscountPct} onChange={(e) => setResellerDiscountPct(e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none" inputMode="decimal" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-[13px] text-amber-200/70 italic">
               <Info className="w-4 h-4 shrink-0 text-amber-400" />
               Margin is calculated as profit divided by selling price (not cost).
            </div>
          </section>

          {/* Results Side Panel */}
          <section className="lg:col-span-5 lg:sticky lg:top-8">
            {!result ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/10 bg-slate-900/20 p-8 text-center text-slate-500">
                <Calculator className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-bold">Awaiting Data</p>
                <p className="text-xs mt-2">Enter your unit landed cost to <br/> determine your optimal retail price.</p>
              </div>
            ) : 'error' in result ? (
              <div className="p-8 rounded-3xl border border-red-500/20 bg-red-500/5 text-center">
                 <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
                 <p className="text-sm font-bold text-white uppercase mb-2">Math Warning</p>
                 <p className="text-xs text-red-400 leading-relaxed italic">{result.error}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-10 text-white"><Tag className="w-12 h-12" /></div>
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-8">Pricing Dashboard</h3>
                  
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 mb-8">
                    <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1">Recommended Retail Price</p>
                    <p className="text-4xl font-black text-white">{symbol}{nf2.format(result.retailPrice)}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Profit Per Unit</p>
                       <p className="text-xl font-bold text-green-400">{symbol}{nf2.format(result.profit)}</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Target Margin</p>
                       <p className="text-xl font-bold text-white">{nf2.format(result.marginAchieved * 100)}%</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-white/5">
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-slate-400">Break-even Price</span>
                       <span className="font-mono text-slate-200">{symbol}{nf2.format(result.breakEvenPrice)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-slate-400">Reseller Quote</span>
                       <span className="font-mono text-slate-200">{symbol}{nf2.format(result.resellerPrice)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-slate-400">Promo (Safety) Floor</span>
                       <span className="font-mono text-amber-400">{symbol}{nf2.format(result.recommendedFloor)}</span>
                    </div>
                  </div>
                </div>

                <a href="/tools/landed-cost-estimator" className="group flex items-center justify-between p-6 rounded-3xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.07] transition-all">
                  <span className="text-sm font-semibold">Recalculate Landed Cost</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            )}
          </section>
        </div>

        {/* Content Section */}
        <section className="mt-24 border-t border-white/5 pt-16">
          <div className="max-w-4xl">
            <h2 className="text-4xl font-bold text-white mb-8 tracking-tight">How to Price Imported Products</h2>
            
            <div className="space-y-8 text-slate-400 leading-relaxed text-lg">
              <p>
                Pricing isn't just about covering your costs; it's about building a sustainable business. Many importers fail because 
                they calculate their markup based on the factory price, ignoring the "hidden leaks" like payment transaction fees 
                and marketing acquisition costs.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
                 <div className="space-y-4">
                    <h4 className="text-white font-bold flex items-center gap-2 italic underline underline-offset-4 decoration-blue-500/50"><DollarSign className="w-4 h-4" /> Margin vs Markup</h4>
                    <p className="text-sm">Markup is profit divided by cost. Margin is profit divided by <strong>selling price</strong>. Most successful retailers use margin targets to ensure they have enough cash flow to cover overhead.</p>
                 </div>
                 <div className="space-y-4">
                    <h4 className="text-white font-bold flex items-center gap-2 italic underline underline-offset-4 decoration-purple-500/50"><ShieldAlert className="w-4 h-4" /> The Buffer Rule</h4>
                    <p className="text-sm">In Nigeria, customs rates fluctuate and logistics costs can change overnight. A 3–5% buffer on your base landed cost isn't being pessimistic—it's being professional.</p>
                 </div>
              </div>

              <h3 className="text-2xl font-bold text-white pt-8 mb-6">Pricing FAQ</h3>
              <div className="grid grid-cols-1 gap-4">
                {[
                  {
                    q: 'What is a break-even price?',
                    a: 'This is the absolute minimum price required to cover all costs and transaction fees. Selling at this price results in zero profit, but zero loss.',
                  },
                  {
                    q: 'How should I handle reseller discounts?',
                    a: 'Resellers usually expect a 15–30% discount. This tool helps you ensure that even with a reseller discount, you aren’t dipping below your break-even floor.',
                  },
                  {
                    q: 'Why include marketing costs here?',
                    a: 'Acquiring a customer isn’t free. If you don’t build your marketing spend (CAC) into your unit price, your profits will be eaten by your advertising bills.',
                  }
                ].map((item, i) => (
                  <div key={i} className="group p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                    <div className="flex gap-4">
                      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-[10px] font-bold text-blue-400 border border-blue-500/20">Q</div>
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
