'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import ShopComponent from './components/ShopComponent';
import Loading from '../loading';
import { ShoppingBag, Smartphone, Laptop, Watch, Tablet, Headphones, Shield, Package } from 'lucide-react';

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
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/10 dark:bg-indigo-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Main Title Section */}
          <div className="text-center space-y-4 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
              <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Official Store</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-slate-100 dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent leading-tight">
              Sure Imports Shop
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-medium">
              Premium Phones, Laptops, Smart Watches, Tablets & Accessories
            </p>
          </div>

          {/* Product Categories Icons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
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
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-slate-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-300 group cursor-pointer"
              >
                <category.icon className="w-8 h-8 text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{category.label}</span>
              </div>
            ))}
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* Phones Info Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold">Brand New Phones</h3>
                </div>
                <p className="text-blue-50 leading-relaxed">
                  Every phone comes sealed in its original box, complete with all accessories, and includes a <span className="font-semibold text-white">one-year warranty</span> for your peace of mind.
                </p>
              </div>
            </div>

            {/* Laptops Info Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Laptop className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold">Quality Laptops</h3>
                </div>
                <p className="text-indigo-50 leading-relaxed">
                  Pre-owned laptops in excellent condition, comes with bag and charger, backed by a <span className="font-semibold text-white">3-month warranty</span> for quality assurance.
                </p>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 p-4 rounded-xl bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm border border-slate-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium">Warranty Included</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
              <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium">Original Packaging</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
              <ShoppingBag className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
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

