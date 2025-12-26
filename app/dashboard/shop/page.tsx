'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  Shield,
  Package,
} from 'lucide-react';

export default function ShopPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      router.push('/login');
      return;
    }
    setLoading(false);
  }, [user, router]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-black">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-600/10"></div>
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-400/10 blur-3xl dark:bg-indigo-600/10"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          {/* Main Title Section */}
          <div className="mb-8 space-y-4 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 dark:bg-blue-900/30">
              <ShoppingBag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                Official Store
              </span>
            </div>

            <h1 className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-4xl font-bold leading-tight text-transparent dark:from-slate-100 dark:via-blue-100 dark:to-indigo-100 sm:text-5xl lg:text-6xl">
              Sure Imports Shop
            </h1>

            <p className="mx-auto max-w-3xl text-lg font-medium text-slate-600 dark:text-slate-300 sm:text-xl">
              Premium Phones, Laptops, Smart Watches, Tablets & Accessories
            </p>
          </div>

          {/* Product Categories Icons */}
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { icon: Smartphone, label: 'Phones' },
              { icon: Laptop, label: 'Laptops' },
              { icon: Watch, label: 'Watches' },
              { icon: Tablet, label: 'Tablets' },
              { icon: Headphones, label: 'Accessories' },
              { icon: Package, label: 'More' },
            ].map((category, index) => (
              <div
                key={index}
                className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 backdrop-blur-sm transition-all duration-300 hover:border-blue-400 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-blue-500"
              >
                <category.icon className="mb-2 h-8 w-8 text-slate-600 transition-colors group-hover:text-blue-600 dark:text-slate-300 dark:group-hover:text-blue-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {category.label}
                </span>
              </div>
            ))}
          </div>

          {/* Info Cards */}
          <div className="mb-6 grid gap-4 md:grid-cols-2">
            {/* Phones Info Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white shadow-xl">
              <div className="absolute right-0 top-0 -mr-16 -mt-16 h-32 w-32 rounded-full bg-white/10"></div>
              <div className="relative">
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                    <Smartphone className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Brand New Phones</h3>
                </div>
                <p className="leading-relaxed text-blue-50">
                  Every phone comes sealed in its original box, complete with
                  all accessories, and includes a{' '}
                  <span className="font-semibold text-white">
                    one-year warranty
                  </span>{' '}
                  for your peace of mind.
                </p>
              </div>
            </div>

            {/* Laptops Info Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-xl">
              <div className="absolute right-0 top-0 -mr-16 -mt-16 h-32 w-32 rounded-full bg-white/10"></div>
              <div className="relative">
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                    <Laptop className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Quality Laptops</h3>
                </div>
                <p className="leading-relaxed text-indigo-50">
                  Pre-owned laptops in excellent condition, comes with bag and
                  charger, backed by a{' '}
                  <span className="font-semibold text-white">
                    3-month warranty
                  </span>{' '}
                  for quality assurance.
                </p>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 rounded-xl border border-slate-200 bg-white/50 p-4 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/30">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
              <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium">Warranty Included</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
              <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium">Original Packaging</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
              <ShoppingBag className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-medium">Authentic Products</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Component */}
      <ShopComponent />
    </div>
  );
}
