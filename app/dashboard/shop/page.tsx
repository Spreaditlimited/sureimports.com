'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import ShopComponent from './components/ShopComponent';
import Loading from '../loading';

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
    <div className="min-h-screen bg-slate-100 dark:bg-black">
      {/* Header Section */}
      <div className="p-4 dark:bg-black">
        
        <div className="flex justify-between max-sm:flex-col">
          <div className="text-[28px] font-bold text-slate-800 dark:text-slate-200 max-sm:pb-4">
            SureImport Shop <br />
            <small>Buy Phones, Laptops, Smart Watches, Tablets, & Accessories</small>
          </div>
        </div>

        <div className="mt-[7px] items-start justify-center gap-2 rounded-xl bg-white p-2 py-[10px] text-base font-normal text-slate-600 dark:bg-black dark:text-white max-sm:pl-4 md:flex-row">
          Every phone from Sure Imports comes sealed in its original box, complete with all accessories, and includes a one-year warranty for your peace of mind. Laptops are pre-owned and come with a bag and charger and a 3-month warranty
        </div>
      </div>

      {/* Shop Component */}
      <ShopComponent />
    </div>
  );
}

