'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/app/context/AuthContext';
import { useRecaptchaV3 } from '@/lib/security/useRecaptchaV3';

type GoogleCredentialResponse = {
  credential?: string;
};

type GoogleInitializeConfig = {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
};

type GoogleButtonOptions = {
  theme: 'outline' | 'filled_blue' | 'filled_black';
  size: 'large' | 'medium' | 'small';
  width?: number;
  text?: 'signin_with' | 'signup_with' | 'continue_with';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  logo_alignment?: 'left' | 'center';
};

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (...args: [GoogleInitializeConfig]) => void;
          renderButton: (...args: [HTMLElement, GoogleButtonOptions]) => void;
        };
      };
    };
  }
}

export default function LoginForm() {
  const { login, loginWithGoogle } = useAuth();
  const searchParams = useSearchParams();
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const googleButtonRenderedRef = useRef(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const executeRecaptcha = useRecaptchaV3();
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const nextParam = searchParams.get('next');
  const signUpHref = nextParam
    ? `/auth/signup?next=${encodeURIComponent(nextParam)}`
    : '/auth/signup';

  useEffect(() => {
    if (!googleClientId || !googleButtonRef.current) return;

    const renderGoogleButton = () => {
      if (!window.google?.accounts?.id || !googleButtonRef.current) return;
      if (googleButtonRenderedRef.current) return;

      googleButtonRef.current.innerHTML = '';
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          if (!response.credential) {
            toast.error('Google sign-in did not return a credential.');
            return;
          }

          setIsGoogleLoading(true);
          try {
            await loginWithGoogle(response.credential);
          } catch (error) {
            const message =
              error instanceof Error
                ? error.message
                : 'Google sign-in failed. Please try again.';
            toast.error(message);
          } finally {
            setIsGoogleLoading(false);
          }
        },
      });

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        width: 340,
        text: 'continue_with',
        shape: 'rectangular',
        logo_alignment: 'center',
      });
      googleButtonRenderedRef.current = true;
    };

    if (window.google?.accounts?.id) {
      renderGoogleButton();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = renderGoogleButton;
    script.onerror = () => {
      toast.error('Unable to load Google sign-in.');
    };
    document.head.appendChild(script);
  }, [googleClientId, loginWithGoogle]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    try {
      let recaptchaToken: string | undefined;
      try {
        recaptchaToken = await executeRecaptcha('login');
      } catch (error) {
        console.error('reCAPTCHA execution failed:', error);
      }
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
    <div className="flex min-h-screen w-full bg-white dark:bg-slate-950">
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
          <Link
            href="/"
            className="inline-flex items-center transition-opacity hover:opacity-80"
          >
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

      {/* Right Form Panel - Mobile Optimized */}
      <div className="flex w-full items-center justify-center px-4 sm:px-6 lg:w-1/2">
        <div className="w-full max-w-[400px]">
          {/* Mobile Logo */}
          <div className="mb-10 flex justify-center lg:hidden">
            <Link href="/">
              <Image
                src="/images/svg-logo.svg"
                alt="Sure Imports"
                width={140}
                height={32}
                className="h-8 w-auto dark:hidden"
              />
              <Image
                src="/images/svg-logo-white.svg"
                alt="Sure Imports"
                width={140}
                height={32}
                className="hidden h-8 w-auto dark:block"
              />
            </Link>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Please enter your details to sign in.
            </p>
          </div>

          <div className="mt-8">
            {/* Clean, Prominent Google Sign-In */}
            {googleClientId && (
              <div className="mb-6">
                <div
                  ref={googleButtonRef}
                  className={`flex w-full justify-center ${
                    isGoogleLoading ? 'pointer-events-none opacity-50' : ''
                  } min-h-[44px]`}
                />
              </div>
            )}

            <div className="mb-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                or log in with email
              </span>
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 w-full rounded-lg border border-slate-200 bg-white py-2 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 w-full rounded-lg border border-slate-200 bg-white py-2 pl-11 pr-12 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900"
                  />
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Remember me
                  </span>
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 w-full rounded-lg bg-indigo-600 text-base font-semibold text-white transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-70 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </Button>
              </div>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
              Don&apos;t have an account?{' '}
              <Link
                href={signUpHref}
                className="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
