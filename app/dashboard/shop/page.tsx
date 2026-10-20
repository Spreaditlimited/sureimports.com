'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import ShopComponent from './components/ShopComponent';
import Loading from '../loading';
import {
  ShoppingBag,
  Smartphone,
  Laptop,
  Watch,
  Tablet,
  Headphones,
  ShieldCheck,
  PackageCheck,
  Award,
} from 'lucide-react';

export default function ShopPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      router.push('/auth/login');
      return;
    }
    setLoading(false);
  }, [user, router]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="si-workspace">

      <div className="si-workspace-header">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div className="mb-4 flex items-center gap-2">
                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-400">
                  Official Store
                </span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Sure Imports Shop
              </h1>
              <p className="mt-4 text-lg text-slate-400">
                Browse products, compare options and add items to your cart.
              </p>

              {/* Trust Indicators - Minimalist Row */}
              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm font-medium text-slate-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  Warranty Included
                </div>
                <div className="flex items-center gap-2">
                  <PackageCheck className="h-4 w-4 text-blue-400" />
                  Sealed Packaging
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-indigo-400" />
                  100% Authentic
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>

      <main className="si-workspace-body">

        {/* Shop Component Wrapper */}
        <div className="rounded-3xl">
          <ShopComponent />
        </div>
        <details className="si-workspace-help">
          <summary>Product condition and warranty</summary>

        <div className="mb-12 grid gap-6 md:grid-cols-2">

          {/* Phones Policy */}
          <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                <Smartphone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Top Quality Phones</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  Every phone comes factory-sealed in its original box, complete with all OEM accessories, and includes a comprehensive <strong className="text-slate-900 dark:text-white">one-year warranty</strong> for your peace of mind.
                </p>
              </div>
            </div>
          </div>

          {/* Laptops Policy */}
          <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
                <Laptop className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Quality Assured Laptops</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  Premium pre-owned laptops in excellent grade-A condition. Delivered with a protective bag and charger, backed by our <strong className="text-slate-900 dark:text-white">3-month warranty</strong> for quality assurance.
                </p>
              </div>
            </div>
          </div>

        </div>

        </details>
      </main>
    </div>
  );
}
