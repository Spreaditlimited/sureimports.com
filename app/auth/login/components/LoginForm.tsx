'use client';
import AuthFrame from '@/components/auth-ui/AuthFrame';
import AuthSignIn from '@/components/auth-ui/AuthSignIn';
import {
  readShopCheckoutDraft,
  SHOP_CHECKOUT_RESUME,
} from '@/lib/shop/checkoutDraft';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/app/context/AuthContext';
import { useRecaptchaV3 } from '@/lib/security/useRecaptchaV3';

export default function LoginForm() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(() => searchParams.get('email') || '');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const executeRecaptcha = useRecaptchaV3();
  const nextParam = searchParams.get('next');
  useEffect(() => {
    if (nextParam !== SHOP_CHECKOUT_RESUME) return;
    const draft = readShopCheckoutDraft();
    if (draft) setEmail((current) => current || draft.email);
  }, [nextParam]);
  const signUpHref = nextParam
    ? `/auth/signup?next=${encodeURIComponent(nextParam)}`
    : '/auth/signup';

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError('');
    const rememberMe = new FormData(e.currentTarget).get('rememberMe') === 'on';

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
      await login(email, password, recaptchaToken || undefined, rememberMe);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Invalid credentials. Please try again.';
      setLoginError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthFrame>
      <AuthSignIn
        description="Please enter your details to sign in."
        onSubmit={handleLogin}
        email={email}
        password={password}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        busy={isLoading}
        error={loginError}
        forgotHref="/auth/forgot-password"
        signupHref={signUpHref}
      />
    </AuthFrame>
  );
}
