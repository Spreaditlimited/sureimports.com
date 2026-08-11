'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import type { IntelligencePlanKey } from '@/lib/intelligence/plans';
import {
  getIntelligenceSubscriptionResumePath,
  POST_AUTH_REDIRECT_KEY,
} from '@/lib/auth/loginRedirect';

type IntelligenceSignupFormProps = {
  plan: IntelligencePlanKey | 'free';
  note?: string;
};

export default function IntelligenceSignupForm({
  plan,
  note,
}: IntelligenceSignupFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isFreePlan = plan === 'free';
  const pendingSubscriptionKey = `sureimports:pendingIntelligenceSubscription:${plan}`;

  async function startSubscription(payload: {
    plan: IntelligencePlanKey;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        window.location.href = `/auth/signup?${params.toString()}`;
        return;
      }

      await startSubscription({ plan, firstName, lastName, email, phone });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to start checkout.',
      );
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand-orange-400 focus:ring-2 focus:ring-brand-orange-100"
          placeholder="First name"
          required
        />
        <input
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand-orange-400 focus:ring-2 focus:ring-brand-orange-100"
          placeholder="Last name"
        />
      </div>
      <input
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand-orange-400 focus:ring-2 focus:ring-brand-orange-100"
        placeholder="Email address"
        type="email"
        required
      />
      <input
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand-orange-400 focus:ring-2 focus:ring-brand-orange-100"
        placeholder="Phone or WhatsApp number"
        required
      />
      {error ? (
        <p className="text-sm font-medium text-red-600">{error}</p>
      ) : null}
      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {isFreePlan ? 'Opening signup...' : 'Starting checkout...'}
          </>
        ) : isFreePlan ? (
          'Create free account'
        ) : (
          'Subscribe now'
        )}
      </button>
      <p className="text-xs leading-5 text-slate-500">
        {note ||
          (isFreePlan
            ? 'Create your Sure Imports account to use your free supplier search credit.'
            : 'Payment creates or links your Sure Imports account automatically. After payment, you will be signed in and taken to the supplier research area.')}
      </p>
    </form>
  );
}
