'use client';

import { useState } from 'react';
import { Loader2, LockKeyhole } from 'lucide-react';

import countries from '@/lib/data/countries';

export default function ReportCheckoutForm({
  reportSlug,
}: {
  reportSlug: string;
}) {
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const provider =
    country.trim().toLowerCase() === 'nigeria' ? 'Paystack' : 'PayPal';

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/intelligence/reports/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportSlug,
          firstName: form.get('firstName'),
          lastName: form.get('lastName'),
          email: form.get('email'),
          billingCountry: country,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.authorizationUrl)
        throw new Error(data.message || 'Unable to start checkout.');
      window.location.href = data.authorizationUrl;
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : 'Unable to start checkout.',
      );
      setLoading(false);
    }
  }

  const field =
    'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-orange-400 focus:ring-2 focus:ring-brand-orange-100';
  return (
    <form
      onSubmit={submit}
      className="mt-7 space-y-3 border-t border-slate-100 pt-6"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          name="firstName"
          className={field}
          placeholder="First name"
          required
        />
        <input name="lastName" className={field} placeholder="Last name" />
      </div>
      <input
        name="email"
        type="email"
        className={field}
        placeholder="Email address"
        required
      />
      <select
        className={field}
        value={country}
        onChange={(event) => setCountry(event.target.value)}
        required
      >
        {countries.map((item) => (
          <option key={item.optionValue} value={item.optionValue}>
            {item.optionName}
          </option>
        ))}
      </select>
      {error ? (
        <p className="text-sm font-semibold text-red-600">{error}</p>
      ) : null}
      <button
        disabled={loading || !country}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-orange-500 px-5 py-4 text-sm font-black text-white shadow-lg shadow-brand-orange-500/20 transition hover:bg-brand-orange-600 disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LockKeyhole className="h-4 w-4" />
        )}
        {loading
          ? 'Preparing secure checkout…'
          : `Buy securely with ${provider}`}
      </button>
      <p className="text-center text-xs leading-relaxed text-slate-500">
        Your purchased edition will be emailed to you and added to your Sure
        Imports account.
      </p>
    </form>
  );
}
