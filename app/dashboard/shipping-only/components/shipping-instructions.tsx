'use client';

import React from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { 
  MapPin, 
  Globe2, 
  Phone, 
  User, 
  AlertTriangle, 
  Copy 
} from 'lucide-react';

export default function ShippingInstructions() {
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const instructions = [
    {
      id: 'en-address',
      label: 'China Address in English',
      value: 'Room 323 3/F Mingsheng Business Centre 12-20 Guangyang road, M. Baiyun District, Guangzhou, China.',
      icon: MapPin,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-100 dark:bg-indigo-900/30'
    },
    {
      id: 'cn-address',
      label: 'China Address in Chinese',
      value: '广州市白云区广源中路18号明圣商贸城明圣商贸城323档',
      icon: Globe2,
      color: 'text-brand-orange-600 dark:text-brand-orange-400',
      bg: 'bg-brand-orange-100 dark:bg-brand-orange-900/30'
    },
    {
      id: 'phone',
      label: 'Phone No.',
      value: '+86 195 7683 7849',
      icon: Phone,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-100 dark:bg-emerald-900/30'
    },
    {
      id: 'contact',
      label: 'Contact Name',
      value: 'Emmanuel',
      icon: User,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/30'
    }
  ];

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#161629]">
      
      {/* Optional Top Image Banner - Scaled down for a better dashboard fit */}
      <div className="relative h-40 w-full bg-slate-100 dark:bg-slate-800">
        <Image
          src="/images/special-sourcing.png"
          alt="Warehouse Instructions"
          fill
          className="object-cover opacity-90 mix-blend-multiply dark:opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-6">
          <h2 className="text-lg font-bold text-white shadow-sm">Warehouse Details</h2>
          <p className="text-xs font-medium text-slate-200">Send to this address</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-6">
        
        {/* Instruction Cards */}
        {instructions.map((item) => (
          <div 
            key={item.id} 
            className="group relative flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-slate-200 dark:border-slate-800 dark:bg-[#0f1020] dark:hover:border-slate-700"
          >
            <div className="flex items-start gap-4">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.bg} ${item.color}`}>
                <item.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0 pr-8">
                <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  {item.label}
                </p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 break-words">
                  {item.value}
                </p>
              </div>
            </div>
            
            {/* Quick Copy Button */}
            <button
              onClick={() => handleCopy(item.value, item.label)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 opacity-100 transition-all hover:bg-white hover:text-indigo-600 hover:shadow-sm dark:hover:bg-slate-800 dark:hover:text-indigo-400 lg:opacity-0 lg:group-hover:opacity-100"
              title="Copy to clipboard"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        ))}

        {/* Warning / Disclaimer Note */}
        <div className="mt-2 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/30 dark:bg-amber-900/10">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
          <p className="text-xs font-medium leading-relaxed text-amber-800 dark:text-amber-200/80">
            <strong className="font-bold">Important:</strong> Kindly note that you are responsible for making sure your supplier sends your goods to us and that your goods actually arrive at our warehouse.
          </p>
        </div>

      </div>
    </div>
  );
}