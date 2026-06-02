'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { z } from 'zod';
import Image from 'next/image';
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
import { User, Mail, Phone, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

import { useAuth } from '@/app/context/AuthContext';
import { getAffiliateReference } from '@/utils/affiliateUtils';
import { useRecaptchaV3 } from '@/lib/security/useRecaptchaV3';

////////////////////// ZOD FORM SCHEMA //////////////////////
const formSchema = z
  .object({
    userAffiliateRef: z.string(),
    userFirstname: z.string().min(1, { message: 'First name is required.' }),
    userLastname: z.string().min(1, { message: 'Last name is required.' }),
    email: z.string().email({ message: 'Invalid email address.' }),
    phone: z.string().min(5, { message: 'Invalid phone number.' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
    confirmPassword: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof formSchema>;

interface ApiResponse {
  messagex: any;
  statusx: string;
  successx: boolean;
  userx: any;
}

export default function SignUpFormContainer() {
  const { user, checkAuth } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [authChecked, setAuthChecked] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);
  const executeRecaptcha = useRecaptchaV3();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const nextParam = searchParams.get('next');
  const loginHref =
    nextParam && nextParam.startsWith('/')
      ? `/auth/login?next=${encodeURIComponent(nextParam)}`
      : '/auth/login';

  // Affiliate Logic
  const getAffiliateRef = React.useCallback(() => {
    const urlAffRef = new URLSearchParams(searchParams).get('affRef');
    if (urlAffRef) return urlAffRef;
    const storedAffRef = getAffiliateReference();
    if (storedAffRef) return storedAffRef;
    return 'NO_REF';
  }, [searchParams]);

  const userAffiliateRefx = getAffiliateRef();

  React.useEffect(() => {
    let mounted = true;
    const verifyAuth = async () => {
      const isAuthenticated = await checkAuth();
      if (!mounted) return;
      if (isAuthenticated) {
        if (nextParam && nextParam.startsWith('/')) {
          router.push(nextParam);
        } else {
          router.push('/dashboard');
        }
      } else {
        setAuthChecked(true);
      }
    };
    verifyAuth();
    return () => {
      mounted = false;
    };
  }, [checkAuth, router, nextParam]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      userFirstname: '',
      userLastname: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      userAffiliateRef: userAffiliateRefx,
    },
  });

  React.useEffect(() => {
    const currentAffRef = getAffiliateRef();
    if (currentAffRef && currentAffRef !== form.getValues('userAffiliateRef')) {
      form.setValue('userAffiliateRef', currentAffRef);
    }
  }, [searchParams, form, getAffiliateRef]);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const recaptchaToken = await executeRecaptcha('register');
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, recaptchaToken }),
      });
      const responseData: ApiResponse = await res.json();
      
      if (responseData.successx) {
        toast.success('Account created successfully!');
        if (nextParam && nextParam.startsWith('/')) {
          router.push(loginHref);
        } else {
          router.push('/auth/account-creation-success');
        }
      } else {
        toast.error(responseData.messagex?.message1 || 'Failed to create account.');
      }
    } catch (error: any) {
      toast.error('A network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Wait for a real auth check before rendering form to avoid stale-state redirect loops.
  if (!authChecked && !user?.userEmail) return null;

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
          <Link href="/" className="inline-flex items-center transition-opacity hover:opacity-80">
            <Image
              src="/images/svg-logo-white.svg"
              alt="Sure Imports"
              width={180}
              height={40}
              className="h-8 w-auto"
            />
          </Link>
        </div>

        <div className="relative z-10 mb-10 max-w-xl">
          <h1 className="mb-6 text-4xl font-black tracking-tight text-white xl:text-5xl leading-[1.1]">
            GLOBAL LOGISTICS, <span className="text-brand-orange-500">STREAMLINED.</span>
          </h1>
          <p className="text-lg font-medium text-slate-300 leading-relaxed">
            Securely manage your global import network from one centralized platform. Source, track, and trade with absolute confidence.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL: Registration Form */}
      <div className="flex w-full items-center justify-center bg-[#fcfcfd] px-4 py-12 dark:bg-slate-950 sm:px-8 lg:w-1/2">
        <div className="w-full max-w-[480px]">
          
          {/* Mobile Logo */}
          <div className="mb-8 flex justify-center lg:hidden">
            <Link href="/">
              <Image
                src="/images/svg-logo.svg"
                alt="Sure Imports"
                width={160}
                height={36}
                className="h-10 w-auto"
              />
            </Link>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-2xl shadow-slate-200/40 dark:border dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-10 lg:bg-transparent lg:p-0 lg:shadow-none dark:lg:border-none dark:lg:bg-transparent">
            
            <div className="mb-8 text-center lg:text-left">
              <p className="mb-2 text-sm font-bold uppercase tracking-widest text-brand-orange-500">
                Join 40,000+ Customers
              </p>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Create a Free Account
              </h2>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                
                {/* Name Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="userFirstname"
                    render={({ field }) => (
                      <FormItem>
                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">First Name</label>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                            <Input placeholder="John" className="h-14 rounded-xl border-slate-200 bg-slate-50 pl-12 text-sm focus-visible:ring-brand-orange-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[11px] font-bold text-rose-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="userLastname"
                    render={({ field }) => (
                      <FormItem>
                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Last Name</label>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                            <Input placeholder="Doe" className="h-14 rounded-xl border-slate-200 bg-slate-50 pl-12 text-sm focus-visible:ring-brand-orange-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[11px] font-bold text-rose-500" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Email Address</label>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                          <Input type="email" placeholder="you@example.com" className="h-14 rounded-xl border-slate-200 bg-slate-50 pl-12 text-sm focus-visible:ring-brand-orange-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[11px] font-bold text-rose-500" />
                    </FormItem>
                  )}
                />

                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Phone Number</label>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                          <Input type="tel" placeholder="+234 800 000 0000" className="h-14 rounded-xl border-slate-200 bg-slate-50 pl-12 text-sm focus-visible:ring-brand-orange-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[11px] font-bold text-rose-500" />
                    </FormItem>
                  )}
                />

                {/* Passwords */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Password</label>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                          <Input type={showPassword ? 'text' : 'password'} placeholder="Create a secure password" className="h-14 rounded-xl border-slate-200 bg-slate-50 pl-12 pr-12 text-sm focus-visible:ring-brand-orange-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white" {...field} />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-[11px] font-bold text-rose-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Confirm Password</label>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                          <Input type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm your password" className="h-14 rounded-xl border-slate-200 bg-slate-50 pl-12 pr-12 text-sm focus-visible:ring-brand-orange-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white" {...field} />
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
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-14 w-full rounded-xl bg-brand-orange-500 text-base font-bold text-white shadow-xl shadow-brand-orange-500/20 transition-all hover:bg-brand-orange-600 active:scale-[0.98] disabled:opacity-70 border-0"
                  >
                    {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Creating Account...</> : 'Create Free Account'}
                  </Button>
                </div>
              </form>
            </Form>

            <div className="mt-8 space-y-4 text-center">
              <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Already have an account?{' '}
                <Link href={loginHref} className="font-bold text-indigo-600 transition-colors hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                  Login here
                </Link>
              </div>

              <div className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-500">
                By signing up, you agree to our <Link href="/terms-and-conditions" className="text-indigo-600 hover:underline dark:text-indigo-400">Terms of Service</Link> and <Link href="/privacy-policy" className="text-indigo-600 hover:underline dark:text-indigo-400">Privacy Policy</Link>. This site is protected by reCAPTCHA.
              </div>
            </div>
            
          </div>
        </div>
      </div>
      
    </div>
  );
}
