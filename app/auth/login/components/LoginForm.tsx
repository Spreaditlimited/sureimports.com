'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/app/context/AuthContext';

export default function LoginForm() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const siteKey = process.env.GOOGLE_CAPTCHA_SITE_KEY;
  const nextParam = searchParams.get('next');
  const signUpHref = nextParam
    ? `/auth/signup?next=${encodeURIComponent(nextParam)}`
    : '/auth/signup';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }
    if (siteKey && !recaptchaToken) {
      toast.error('Please complete captcha verification.');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password, recaptchaToken || undefined);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Invalid credentials. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
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
          <h1 className="mb-6 text-4xl font-black leading-[1.1] tracking-tight text-white xl:text-5xl">
            GLOBAL LOGISTICS,{' '}
            <span className="text-brand-orange-500">STREAMLINED.</span>
          </h1>
          <p className="text-lg font-medium leading-relaxed text-slate-300">
            Securely manage your global import network from one centralized
            platform. Source, track, and trade with absolute confidence.
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-[#fcfcfd] px-4 dark:bg-slate-950 sm:px-8 lg:w-1/2">
        <div className="w-full max-w-[440px]">
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

          <div className="rounded-[32px] bg-white p-8 shadow-2xl shadow-slate-200/40 dark:border dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-12 lg:bg-transparent lg:p-0 lg:shadow-none dark:lg:border-none dark:lg:bg-transparent">
            <div className="mb-8 text-center lg:text-left">
              <p className="mb-2 text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Welcome Back!
              </p>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Login to your account
              </h2>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                  Email / Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 rounded-xl border-slate-200 bg-slate-50 pl-12 pr-4 text-sm transition-all focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 rounded-xl border-slate-200 bg-slate-50 pl-12 pr-12 text-sm transition-all focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 text-sm">
                <label className="flex cursor-pointer items-center gap-2 font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-0 dark:border-slate-700 dark:bg-slate-900"
                  />
                  <span>Keep me signed in</span>
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="font-bold text-indigo-600 transition-colors hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="pt-4">
                {siteKey ? (
                  <div className="mb-4">
                    <ReCAPTCHA
                      sitekey={siteKey}
                      onChange={(token) => setRecaptchaToken(token)}
                      onExpired={() => setRecaptchaToken(null)}
                    />
                  </div>
                ) : null}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-14 w-full rounded-xl bg-indigo-800 text-base font-bold text-white shadow-xl shadow-indigo-900/20 transition-all hover:bg-indigo-900 active:scale-[0.98] disabled:opacity-70 dark:bg-indigo-600 dark:hover:bg-indigo-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    'Login to Dashboard'
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-8 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
              Don't have an account?{' '}
              <Link
                href={signUpHref}
                className="font-bold text-brand-orange-500 transition-colors hover:text-brand-orange-600"
              >
                Register Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
