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
import { Lock, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';

////////////////////// ZOD FORM SCHEMA //////////////////////
const formSchema = z
  .object({
    password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
    confirmPassword: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof formSchema>;

interface ApiResponse {
  responsex: {
    status: string;
    message: string;
  };
  successx: boolean;
}

export default function PasswordResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const pidUser = searchParams.get('pidUser');
  const resetCode = searchParams.get('resetCode');

  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!pidUser || !resetCode) {
      toast.error('Invalid or missing reset token. Please request a new link.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/password-reset-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          password: data.password, 
          confirmPassword: data.confirmPassword, 
          pidUser, 
          resetCode 
        }),
      });

      const responseData: ApiResponse = await res.json();

      if (responseData.responsex?.status === 'PASSWORD_RESET_SUCCESSFUL') {
        setIsSuccess(true);
        toast.success(responseData.responsex.message || 'Password reset successfully!');
        
        // Wait a few seconds so the user can see the success state, then redirect
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      } else {
        toast.error(responseData.responsex?.message || 'Failed to reset password. The link may have expired.');
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
            src="/images/hero-background-1.png"
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

      {/* RIGHT PANEL: Reset Form */}
      <div className="flex w-full items-center justify-center bg-[#fcfcfd] px-4 py-12 dark:bg-slate-950 sm:px-8 lg:w-1/2">
        <div className="w-full max-w-[440px]">
          
          {/* Mobile Logo */}
          <div className="mb-8 flex justify-center lg:hidden">
            <Image src="/images/new/images/logo.png" alt="Sure Imports" width={160} height={36} />
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-2xl shadow-slate-200/40 dark:border dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-12 lg:bg-transparent lg:p-0 lg:shadow-none dark:lg:border-none dark:lg:bg-transparent">
            
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Set New Password
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Please enter a secure, unique password for your Sure Imports account.
              </p>
            </div>

            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Password Reset Complete!</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
                  Your password has been successfully updated. Redirecting you to login...
                </p>
                <Button 
                  onClick={() => router.push('/auth/login')}
                  className="h-14 w-full rounded-xl bg-indigo-800 text-base font-bold text-white shadow-xl shadow-indigo-900/20 transition-all hover:bg-indigo-900 active:scale-[0.98] dark:bg-indigo-600 dark:hover:bg-indigo-700"
                >
                  Click here if not redirected
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  {/* New Password */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                          New Password
                        </label>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                            <Input 
                              type={showPassword ? 'text' : 'password'} 
                              placeholder="Create a new password" 
                              className="h-14 rounded-xl border-slate-200 bg-slate-50 pl-12 pr-12 text-sm focus-visible:ring-brand-orange-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white" 
                              {...field} 
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-[11px] font-bold text-rose-500" />
                      </FormItem>
                    )}
                  />

                  {/* Confirm Password */}
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                          Confirm New Password
                        </label>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                            <Input 
                              type={showConfirmPassword ? 'text' : 'password'} 
                              placeholder="Type your new password again" 
                              className="h-14 rounded-xl border-slate-200 bg-slate-50 pl-12 pr-12 text-sm focus-visible:ring-brand-orange-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white" 
                              {...field} 
                            />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-[11px] font-bold text-rose-500" />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="h-14 w-full rounded-xl bg-brand-orange-500 text-base font-bold text-white shadow-xl shadow-brand-orange-500/20 transition-all hover:bg-brand-orange-600 active:scale-[0.98] disabled:opacity-70 border-0"
                    >
                      {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving Password...</> : 'Reset Password'}
                    </Button>
                  </div>

                </form>
              </Form>
            )}
            
          </div>
        </div>
      </div>
      
    </div>
  );
}