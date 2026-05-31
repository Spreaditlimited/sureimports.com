'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Mail, Loader2, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';

////////////////////// ZOD FORM SCHEMA //////////////////////
const formSchema = z.object({
  email: z.string().min(1, { message: 'Email is required.' }).email('Invalid email address.'),
});

type FormValues = z.infer<typeof formSchema>;

interface ApiResponse {
  responsex: {
    status: string;
    message: string;
  };
  successx: boolean;
}

export default function MigrationPasswordResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Extract email from URL if they were redirected here
  const urlEmail = searchParams.get('email') || '';

  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      email: urlEmail,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/password-reset-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: data.email }),
      });

      const responseData: ApiResponse = await res.json();

      if (responseData.responsex?.status === 'PASSWORD_RESET_LINK_SENT') {
        setIsSuccess(true);
        toast.success('Secure reset link sent to your email.');
      } else if (responseData.responsex?.status === 'INVALID_EMAIL' || responseData.responsex?.status === 'NOT_REGISTERED') {
        toast.error(responseData.responsex.message || 'Email not found in our system.');
      } else {
        toast.error('Something went wrong. Please try again.');
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
            src="/images/hero-background-1.png" // Replace with your port/logistics background
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
            WELCOME TO THE <span className="text-brand-orange-500">NEW ERA.</span>
          </h1>
          <p className="text-lg font-medium text-slate-300 leading-relaxed">
            We've upgraded from Spreadit Global to Sure Imports. Enjoy a faster, more secure, and centralized platform for all your sourcing needs.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL: Migration/Reset Form */}
      <div className="flex w-full items-center justify-center bg-[#fcfcfd] px-4 py-12 dark:bg-slate-950 sm:px-8 lg:w-1/2">
        <div className="w-full max-w-[440px]">
          
          {/* Mobile Logo */}
          <div className="mb-8 flex justify-center lg:hidden">
            <Image src="/images/new/images/logo.png" alt="Sure Imports" width={160} height={36} />
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-2xl shadow-slate-200/40 dark:border dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-12 lg:bg-transparent lg:p-0 lg:shadow-none dark:lg:border-none dark:lg:bg-transparent">
            
            {isSuccess ? (
              // SUCCESS STATE
              <div className="flex flex-col items-center justify-center py-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Check your email</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
                  We've sent a secure password reset link to <br/>
                  <span className="font-semibold text-slate-900 dark:text-white">{form.getValues('email')}</span>
                </p>
                <Button 
                  onClick={() => router.push('/auth/login')}
                  className="h-14 w-full rounded-xl bg-indigo-800 text-base font-bold text-white shadow-xl shadow-indigo-900/20 transition-all hover:bg-indigo-900 active:scale-[0.98] dark:bg-indigo-600 dark:hover:bg-indigo-700 border-0"
                >
                  Return to Login
                </Button>
              </div>
            ) : (
              // ACTION STATE
              <>
                <div className="mb-8 text-center lg:text-left">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:border-indigo-900/30 dark:bg-indigo-900/20 dark:text-indigo-400">
                    <ShieldCheck className="h-3.5 w-3.5" /> Platform Upgrade
                  </div>
                  <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-3">
                    Secure your account
                  </h2>
                  <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    Welcome to the <strong>Sure Imports</strong> dashboard! Because you are migrating from <strong>Spreadit Global</strong>, we require you to set a new, secure password for your first login.
                  </p>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                            Registered Email
                          </label>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                              <Input 
                                type="email" 
                                placeholder="you@example.com" 
                                className="h-14 rounded-xl border-slate-200 bg-slate-50 pl-12 text-sm focus-visible:ring-brand-orange-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-[11px] font-bold text-rose-500" />
                        </FormItem>
                      )}
                    />

                    <div className="pt-2 space-y-4">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="h-14 w-full rounded-xl bg-brand-orange-500 text-base font-bold text-white shadow-xl shadow-brand-orange-500/20 transition-all hover:bg-brand-orange-600 active:scale-[0.98] disabled:opacity-70 border-0"
                      >
                        {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending Link...</> : 'Send Secure Reset Link'}
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/auth/login')}
                        disabled={isLoading}
                        className="h-14 w-full rounded-xl border-slate-200 bg-white text-base font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-transparent dark:text-slate-300 dark:hover:bg-slate-900"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                      </Button>
                    </div>

                  </form>
                </Form>
              </>
            )}
            
          </div>
        </div>
      </div>
      
    </div>
  );
}