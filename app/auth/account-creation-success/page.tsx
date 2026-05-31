'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle2, MailCheck } from 'lucide-react';

export default function AccountCreationSuccessPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen w-full">
      
      {/* LEFT PANEL: Brand & Visuals (Hidden on Mobile) */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-slate-900 p-12 lg:flex xl:p-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-background-1.png" // Replace with your port/logistics background if needed
            alt="Global Logistics Port"
            fill
            className="object-cover opacity-30 mix-blend-luminosity"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
        </div>

        <div className="relative z-10">
          <Link href="/">
            <Image
              src="/images/svg-logo-white.svg"
              alt="Sure Imports"
              width={180}
              height={40}
              className="transition-opacity hover:opacity-80"
            />
          </Link>
        </div>

        <div className="relative z-10 max-w-xl">
          <h1 className="mb-6 text-4xl font-black tracking-tight text-white xl:text-5xl leading-[1.1]">
            GLOBAL LOGISTICS, <span className="text-brand-orange-500">STREAMLINED.</span>
          </h1>
          <p className="text-lg font-medium text-slate-300 leading-relaxed">
            Securely manage your global import network from one centralized platform. Source, track, and trade with absolute confidence.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL: Success Message */}
      <div className="flex w-full items-center justify-center bg-[#fcfcfd] px-4 py-12 dark:bg-slate-950 sm:px-8 lg:w-1/2">
        <div className="w-full max-w-[440px]">
          
          {/* Mobile Logo */}
          <div className="mb-8 flex justify-center lg:hidden">
            <Image src="/images/new/images/logo.png" alt="Sure Imports" width={160} height={36} />
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-2xl shadow-slate-200/40 dark:border dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-12 lg:bg-transparent lg:p-0 lg:shadow-none dark:lg:border-none dark:lg:bg-transparent">
            
            <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
              
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shadow-inner dark:bg-emerald-900/20 dark:text-emerald-400">
                <CheckCircle2 className="h-12 w-12" />
              </div>

              <p className="mb-2 text-sm font-bold uppercase tracking-widest text-brand-orange-500">
                Welcome Aboard
              </p>
              
              <h2 className="mb-4 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Account Created!
              </h2>
              
              <div className="mb-8 rounded-2xl bg-slate-50 p-6 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                <MailCheck className="mx-auto mb-3 h-6 w-6 text-indigo-400" />
                We've sent an activation link to your email address. Please click the link to verify your account. 
                <br /><br />
                <span className="font-semibold text-slate-500">Note: Check your spam folder if it doesn't arrive within a few minutes.</span>
              </div>

              <Button
                onClick={() => router.push('/auth/login')}
                className="h-14 w-full rounded-xl bg-indigo-800 text-base font-bold text-white shadow-xl shadow-indigo-900/20 transition-all hover:bg-indigo-900 active:scale-[0.98] dark:bg-indigo-600 dark:hover:bg-indigo-700 border-0"
              >
                Return to Login
              </Button>
              
            </div>
            
          </div>
        </div>
      </div>
      
    </div>
  );
}