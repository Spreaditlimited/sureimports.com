'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { AlertCircle, Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { getSafeLoginRedirect } from '@/lib/auth/loginRedirect';

interface ApiResponse {
  responsex: {
    status: string;
    message: string;
  };
  successx: boolean;
  userx?: any;
}

export default function AccountNotActivatedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const requestedNext = searchParams.get('next');
  const loginParams = new URLSearchParams();
  if (email) loginParams.set('email', email);
  if (requestedNext) {
    loginParams.set('next', getSafeLoginRedirect(requestedNext));
  }
  const loginHref = loginParams.size
    ? `/auth/login?${loginParams.toString()}`
    : '/auth/login';
  
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleResendActivationEmail = async () => {
    if (!email) {
      toast.error('No email address found. Please try logging in again.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/resend-email-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: email }),
      });

      const data: ApiResponse = await res.json();

      if (data.responsex?.status === 'ALREADY_VERIFIED') {
        toast.info(data.responsex.message || 'Your account is already verified!');
        router.push(loginHref);
      } else if (data.responsex?.status === 'VERIFICATION_EMAIL_SENT') {
        setIsSuccess(true);
        toast.success('A new activation email has been sent.');
      } else {
        toast.error(data.responsex?.message || 'Failed to send activation email.');
      }
    } catch (error: any) {
      toast.error('A network error occurred. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      
      {/* LEFT PANEL: Brand & Visuals (Hidden on Mobile) */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-slate-900 p-12 lg:flex xl:p-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-background-1.png" // Use your port/logistics background
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

      {/* RIGHT PANEL: Activation Form */}
      <div className="flex w-full items-center justify-center bg-[#fcfcfd] px-4 py-12 dark:bg-slate-950 sm:px-8 lg:w-1/2">
        <div className="w-full max-w-[440px]">
          
          {/* Mobile Logo */}
          <div className="mb-8 flex justify-center lg:hidden">
            <Link href="/">
              <Image
                src="/images/svg-logo.svg"
                alt="Sure Imports"
                width={160}
                height={36}
                className="h-10 w-auto dark:hidden"
              />
              <Image
                src="/images/svg-logo-white.svg"
                alt="Sure Imports"
                width={160}
                height={36}
                className="hidden h-10 w-auto dark:block"
              />
            </Link>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-2xl shadow-slate-200/40 dark:border dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-12 lg:bg-transparent lg:p-0 lg:shadow-none dark:lg:border-none dark:lg:bg-transparent">
            
            <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
              
              {isSuccess ? (
                // SUCCESS STATE
                <>
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shadow-inner dark:bg-emerald-900/20 dark:text-emerald-400">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h2 className="mb-4 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    Email Sent!
                  </h2>
                  <div className="mb-8 rounded-2xl bg-slate-50 p-6 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    We've sent a fresh activation link to <strong>{email || 'your email address'}</strong>. Please check your inbox and spam folders.
                  </div>
                  <Button
                    onClick={() => router.push(loginHref)}
                    className="h-14 w-full rounded-xl bg-indigo-800 text-base font-bold text-white shadow-xl shadow-indigo-900/20 transition-all hover:bg-indigo-900 active:scale-[0.98] dark:bg-indigo-600 dark:hover:bg-indigo-700 border-0"
                  >
                    Return to Login
                  </Button>
                </>
              ) : (
                // ACTION REQUIRED STATE
                <>
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-amber-600 shadow-inner dark:bg-amber-900/20 dark:text-amber-400">
                    <AlertCircle className="h-10 w-10" />
                  </div>
                  
                  <p className="mb-2 text-sm font-bold uppercase tracking-widest text-brand-orange-500">
                    Action Required
                  </p>
                  <h2 className="mb-4 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    Account Not Activated
                  </h2>
                  
                  <div className="mb-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    We noticed you haven't verified your email address yet. You need to activate your account before accessing the dashboard.
                    {email && (
                      <div className="mt-4 rounded-xl bg-slate-50 p-4 border border-slate-200 dark:bg-slate-800/50 dark:border-slate-800">
                        Verification email will be sent to:<br/>
                        <span className="font-bold text-slate-900 dark:text-white">{email}</span>
                      </div>
                    )}
                  </div>

                  <div className="w-full space-y-3">
                    <Button
                      onClick={handleResendActivationEmail}
                      disabled={isLoading}
                      className="h-14 w-full rounded-xl bg-brand-orange-500 text-base font-bold text-white shadow-xl shadow-brand-orange-500/20 transition-all hover:bg-brand-orange-600 active:scale-[0.98] disabled:opacity-70 border-0"
                    >
                      {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending...</> : <><Mail className="mr-2 h-5 w-5" /> Resend Activation Email</>}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => router.push(loginHref)}
                      disabled={isLoading}
                      className="h-14 w-full rounded-xl border-slate-200 bg-white text-base font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-transparent dark:text-slate-300 dark:hover:bg-slate-900"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                    </Button>
                  </div>
                </>
              )}
              
            </div>
            
          </div>
        </div>
      </div>
      
    </div>
  );
}
