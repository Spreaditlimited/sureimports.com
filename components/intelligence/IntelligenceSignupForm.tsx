'use client';
import countries from '@/lib/data/countries';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import type { IntelligencePlanKey } from '@/lib/intelligence/plans';
import {
  getIntelligenceSubscriptionResumePath,
  POST_AUTH_REDIRECT_KEY,
} from '@/lib/auth/loginRedirect';

type IntelligenceSignupFormProps = {
  plan: IntelligencePlanKey | 'free';
  note?: string;
  usdAvailable?: boolean;
};

export default function IntelligenceSignupForm({
  plan,
  note,
  usdAvailable = true,
}: IntelligenceSignupFormProps) {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [billingCountry, setBillingCountry] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const usdUnavailable = Boolean(
    billingCountry && billingCountry !== 'Nigeria' && !usdAvailable,
  );
  const isFreePlan = plan === 'free';
  const pendingSubscriptionKey = `sureimports:pendingIntelligenceSubscription:${plan}`;

  async function startSubscription(payload: {
    plan: IntelligencePlanKey;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    billingCountry?: string;
  }) {
    const response = await fetch('/api/intelligence/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (data?.statusx === 'ACCOUNT_EXISTS_LOGIN_REQUIRED') {
      const resumePath = getIntelligenceSubscriptionResumePath(plan);
      window.localStorage.setItem(
        pendingSubscriptionKey,
        JSON.stringify(payload),
      );
      window.localStorage.setItem(POST_AUTH_REDIRECT_KEY, resumePath);
      window.location.href =
        data.loginPath || `/auth/login?next=${encodeURIComponent(resumePath)}`;
      return;
    }

    if (!response.ok || !data.authorizationUrl) {
      throw new Error(data.message || 'Unable to start checkout.');
    }

    window.localStorage.removeItem(pendingSubscriptionKey);
    window.location.href = data.authorizationUrl;
  }

  useEffect(() => {
    if (isFreePlan) return;
    const resumePlan = new URLSearchParams(window.location.search).get(
      'resumeSubscription',
    );
    if (resumePlan !== plan) return;
    const pending = window.localStorage.getItem(pendingSubscriptionKey);
    if (!pending) return;
    setIsLoading(true);
    try {
      const payload = JSON.parse(pending);
      void startSubscription(payload).catch((error) => {
        setError(
          error instanceof Error ? error.message : 'Unable to start checkout.',
        );
        setIsLoading(false);
      });
    } catch {
      window.localStorage.removeItem(pendingSubscriptionKey);
      setIsLoading(false);
    }
    // This runs only for the matching plan after returning from login.
  }, [isFreePlan, pendingSubscriptionKey, plan]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isFreePlan) {
        const params = new URLSearchParams({
          next: '/dashboard/intelligence',
          affRef: 'supplier-intelligence-free',
          firstName,
          lastName,
          email,
          phone,
        });
        router.push(`/auth/signup?${params.toString()}`);
        return;
      }

      await startSubscription({
        plan,
        firstName,
        lastName,
        email,
        phone,
        billingCountry,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to start checkout.',
      );
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-3">
      {!isFreePlan && (
        <label className="grid gap-2 text-sm">
          Country of residence
          <select
            required
            value={billingCountry}
            onChange={(event) => setBillingCountry(event.target.value)}
            className="min-h-12 rounded-xl border border-slate-200 bg-transparent px-3 pr-10"
          >
            {countries.map((country) => (
              <option key={country.optionValue} value={country.optionValue}>
                {country.optionValue
                  ? country.optionName
                  : 'Select your country'}
              </option>
            ))}
          </select>
          <span className="text-xs text-slate-500">
            Nigeria: NGN via Paystack. Other countries: USD via PayPal after
            signing in.
          </span>
        </label>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand-orange-400 focus:ring-2 focus:ring-brand-orange-100"
          aria-label="First name"
          placeholder="First name"
          required
        />
        <input
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand-orange-400 focus:ring-2 focus:ring-brand-orange-100"
          aria-label="Last name"
          placeholder="Last name"
        />
      </div>
      <input
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand-orange-400 focus:ring-2 focus:ring-brand-orange-100"
        aria-label="Email address"
        placeholder="Email address"
        type="email"
        required
      />
      <input
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand-orange-400 focus:ring-2 focus:ring-brand-orange-100"
        aria-label="Phone or WhatsApp number"
        placeholder="Phone or WhatsApp number"
        required
      />
      {error ? (
        <p className="text-sm font-medium text-red-600">{error}</p>
      ) : null}
      <button
        type="submit"
        disabled={isLoading || (!isFreePlan && usdUnavailable)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {isFreePlan ? 'Opening signup...' : 'Starting checkout...'}
          </>
        ) : isFreePlan ? (
          'Create free account'
        ) : usdUnavailable ? (
          'USD pricing coming soon'
        ) : (
          'Subscribe now'
        )}
      </button>
      <p className="text-xs leading-5 text-slate-500">
        {note ||
          (isFreePlan
            ? 'Create your Sure Imports account to use your free supplier search credit.'
            : billingCountry && billingCountry !== 'Nigeria'
              ? 'Sign in or create an account before PayPal checkout. Your subscription renews monthly until you cancel renewal in PayPal.'
              : 'Payment creates or links your Sure Imports account. After verification, continue to supplier research. Your subscription renews monthly until you cancel.')}
      </p>
    </form>
  );
}
