'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  Package, 
  ArrowRight, 
  MapPin, 
  Mail, 
  Clock,
  Home
} from 'lucide-react';

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get('ref');

  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/dashboard/shop');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-slate-950">
      
      {/* Deep Slate Celebratory Hero */}
      <div className="bg-slate-900 pb-40 pt-16 text-center text-white">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/20 ring-4 ring-emerald-500/10">
            <CheckCircle2 className="h-12 w-12 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
            Order Confirmed
          </h1>
          <p className="mt-4 text-lg font-medium text-slate-400">
            Thank you for your purchase. We're getting everything ready.
          </p>
        </div>
      </div>

      <main className="mx-auto -mt-24 max-w-3xl px-4 pb-20">
        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          
          <div className="p-8 sm:p-12">
            
            {/* Order Reference Receipt Block */}
            {reference && (
              <div className="mb-10 flex flex-col items-center border-y border-slate-100 py-8 dark:border-slate-800">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Order Reference
                </span>
                <span className="mt-2 font-mono text-2xl font-black tracking-widest text-slate-900 dark:text-white sm:text-3xl">
                  {reference}
                </span>
              </div>
            )}

            {/* What's Next Grid */}
            <div className="mb-10">
              <h3 className="mb-6 text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">
                What happens next?
              </h3>
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="flex flex-col items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Confirmation</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">A detailed receipt will be sent to your email.</p>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Preparation</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">Your items are being securely packed for dispatch.</p>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Collection</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">Bring your reference number to our office for pickup.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pickup Location Details */}
            <div className="mb-10 rounded-2xl bg-slate-50 p-6 dark:bg-slate-800/50">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <Home className="h-4 w-4 text-slate-400" /> Collection Point
              </h3>
              <div className="grid gap-4 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <p>Sure Imports<br />5 Olutosin Ajayi (Martins Adegboyega) St,<br />Ajao Estate, Lagos</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <p>Mon-Fri: 9am - 5pm</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                      ☎
                    </span>
                    <p>0806 839 7263</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={() => router.push('/dashboard/shop')}
                className="flex-1 rounded-xl bg-blue-600 py-6 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500"
              >
                Continue Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                onClick={() => router.push('/dashboard')} 
                variant="outline"
                className="flex-1 rounded-xl border-slate-200 bg-white py-6 text-sm font-bold text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
              >
                Go to Dashboard
              </Button>
            </div>
            
          </div>

          {/* Minimalist Countdown Footer */}
          <div className="bg-slate-50 px-8 py-4 dark:bg-slate-800/30">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Auto-redirecting
              </p>
              <p className="text-xs font-black text-blue-600 dark:text-blue-400">
                {countdown}s
              </p>
            </div>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div 
                className="h-full bg-blue-600 transition-all duration-1000 ease-linear dark:bg-blue-500" 
                style={{ width: `${(countdown / 10) * 100}%` }}
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default function OrderSuccessPage() {
  return <OrderSuccessContent />;
}