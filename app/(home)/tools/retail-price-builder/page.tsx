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

  const canCalc = lc !== null && mPct !== null && mPct < 95;

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
    <main className="min-h-screen bg-[#fcfcfd] text-slate-600 dark:bg-slate-950 dark:text-slate-400 pb-24">
      <div className="max-w-[1440px] mx-auto px-4 pt-48 sm:px-6 lg:px-8">
        
        {/* Header */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:border-indigo-900/30 dark:text-indigo-400 text-xs font-black uppercase tracking-widest mb-6">
            <TrendingUp className="w-3.5 h-3.5" /> Pricing Strategy Tool
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
            Retail Price <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-500">Builder</span>
          </h1>
          <p className="text-lg font-medium text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
            Protect your margins. Turn your landed cost into a strategic selling price that 
            accounts for marketing, payment fees, and promotional safety nets.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Input Panel */}
          <section className="lg:col-span-7 space-y-6">
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 sm:p-10 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              
              {/* Currency & Cost */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                 <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight dark:text-white">Core Unit Costs</h3>
                    <p className="text-xs font-medium text-slate-500 italic">Enter costs per individual item.</p>
                 </div>
                 <div className="flex p-1 bg-slate-50 rounded-xl border border-slate-200 dark:bg-slate-950/50 dark:border-slate-800">
                    <button onClick={() => setCurrency('USD')} className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${currency === 'USD' ? 'bg-indigo-600 text-white shadow-md dark:bg-indigo-500' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}>USD</button>
                    <button onClick={() => setCurrency('NGN')} className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${currency === 'NGN' ? 'bg-indigo-600 text-white shadow-md dark:bg-indigo-500' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}>NGN</button>
                 </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Landed Cost Per Unit</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold dark:text-slate-500">{symbol}</span>
                    <input value={landedCost} onChange={(e) => setLandedCost(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all dark:bg-slate-950/50 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600" placeholder="0.00" inputMode="decimal" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Marketing (CAC) Per Unit</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold dark:text-slate-500">{symbol}</span>
                    <input value={marketingCost} onChange={(e) => setMarketingCost(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all dark:bg-slate-950/50 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600" placeholder="0.00" inputMode="decimal" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 border-t border-slate-100 pt-8 dark:border-slate-800">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Desired Margin (%)</label>
                  <input value={desiredMarginPct} onChange={(e) => setDesiredMarginPct(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all dark:bg-slate-950/50 dark:border-slate-800 dark:text-white" inputMode="decimal" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Payment Fees (%)</label>
                  <input value={paymentFeesPct} onChange={(e) => setPaymentFeesPct(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all dark:bg-slate-950/50 dark:border-slate-800 dark:text-white" inputMode="decimal" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-8 dark:border-slate-800">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Buffer (%)</label>
                  <input value={bufferPct} onChange={(e) => setBufferPct(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all dark:bg-slate-950/50 dark:border-slate-800 dark:text-white" inputMode="decimal" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Promo Disc (%)</label>
                  <input value={discountPct} onChange={(e) => setDiscountPct(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all dark:bg-slate-950/50 dark:border-slate-800 dark:text-white" inputMode="decimal" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Reseller Disc (%)</label>
                  <input value={resellerDiscountPct} onChange={(e) => setResellerDiscountPct(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all dark:bg-slate-950/50 dark:border-slate-800 dark:text-white" inputMode="decimal" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-5 rounded-2xl bg-amber-50 border border-amber-200 text-sm font-medium text-amber-800 dark:bg-amber-900/10 dark:border-amber-900/30 dark:text-amber-200">
               <Info className="w-5 h-5 shrink-0 text-amber-500" />
               Margin is calculated as profit divided by selling price (not cost).
            </div>
          </section>

          {/* Results Side Panel */}
          <section className="lg:col-span-5 lg:sticky lg:top-8">
            {!result ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/50">
                <Calculator className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-600" />
                <p className="font-bold text-slate-600 dark:text-slate-400">Awaiting Data</p>
                <p className="text-sm font-medium mt-2 leading-relaxed text-slate-500">Enter your unit landed cost to <br/> determine your optimal retail price.</p>
              </div>
            ) : 'error' in result ? (
              <div className="p-8 rounded-[32px] border border-rose-200 bg-rose-50 text-center dark:border-rose-900/30 dark:bg-rose-900/10">
                 <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-4" />
                 <p className="text-sm font-bold text-rose-900 uppercase mb-2 tracking-widest dark:text-rose-200">Math Warning</p>
                 <p className="text-sm font-medium text-rose-800 leading-relaxed dark:text-rose-300">{result.error}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-[32px] border border-slate-200 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/40 relative overflow-hidden dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
                  <div className="absolute top-0 right-0 p-6 opacity-10"><Tag className="w-12 h-12 text-slate-900 dark:text-white" /></div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">Pricing Dashboard</h3>
                  
                  <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100 mb-8 dark:bg-indigo-900/10 dark:border-indigo-900/20">
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1 dark:text-indigo-400">Recommended Retail Price</p>
                    <p className="text-4xl font-black text-indigo-950 dark:text-white">{symbol}{nf2.format(result.retailPrice)}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="rounded-2xl border border-slate-100 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Profit Per Unit</p>
                       <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{symbol}{nf2.format(result.profit)}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-100 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Margin</p>
                       <p className="text-xl font-black text-slate-900 dark:text-white">{nf2.format(result.marginAchieved * 100)}%</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center">
                       <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Break-even Price</span>
                       <span className="text-lg font-bold text-slate-900 dark:text-white">{symbol}{nf2.format(result.breakEvenPrice)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Reseller Quote</span>
                       <span className="text-lg font-bold text-slate-900 dark:text-white">{symbol}{nf2.format(result.resellerPrice)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                       <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Promo (Safety) Floor</span>
                       <span className="text-xl font-black text-brand-orange-500">{symbol}{nf2.format(result.recommendedFloor)}</span>
                    </div>
                  </div>
                </div>

                <a href="/tools/landed-cost-estimator" className="group flex items-center justify-between p-6 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-all dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/80 shadow-sm">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Recalculate Landed Cost</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            )}
          </section>
        </div>

        {/* Content Section */}
        <section className="mt-24 border-t border-slate-200 pt-16 dark:border-slate-800">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">How to Price Imported Products</h2>
            
            <div className="space-y-8 text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
              <p>
                Pricing isn't just about covering your costs; it's about building a sustainable business. Many importers fail because 
                they calculate their markup based on the factory price, ignoring the "hidden leaks" like payment transaction fees 
                and marketing acquisition costs.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
                 <div className="space-y-4">
                    <h4 className="text-slate-900 font-bold flex items-center gap-2 dark:text-white"><DollarSign className="w-5 h-5 text-indigo-500" /> Margin vs Markup</h4>
                    <p className="text-sm font-medium">Markup is profit divided by cost. Margin is profit divided by <strong className="text-slate-900 dark:text-white">selling price</strong>. Most successful retailers use margin targets to ensure they have enough cash flow to cover overhead.</p>
                 </div>
                 <div className="space-y-4">
                    <h4 className="text-slate-900 font-bold flex items-center gap-2 dark:text-white"><ShieldAlert className="w-5 h-5 text-brand-orange-500" /> The Buffer Rule</h4>
                    <p className="text-sm font-medium">In logistics, customs rates fluctuate and fuel costs can change overnight. A 3–5% buffer on your base landed cost isn't being pessimistic—it's being professional.</p>
                 </div>
              </div>

              <h3 className="text-2xl font-black text-slate-900 pt-8 mb-6 dark:text-white">Pricing FAQ</h3>
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
                  <div key={i} className="group p-6 rounded-2xl border border-slate-200 bg-white hover:border-indigo-200 hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
                    <div className="flex gap-4">
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-xs font-black text-indigo-600 border border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-900/30">Q</div>
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