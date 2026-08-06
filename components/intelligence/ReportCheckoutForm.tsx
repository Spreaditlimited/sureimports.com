'use client';

import { useEffect, useState } from 'react';
import { Check, ChevronDown, Globe2, Loader2, LockKeyhole } from 'lucide-react';

import { cn } from '@/_lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import countries from '@/lib/data/countries';

export default function ReportCheckoutForm({
  reportSlug,
}: {
  reportSlug: string;
}) {
  const [country, setCountry] = useState('');
  const [countryOpen, setCountryOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const pendingCheckoutKey = `sureimports:pendingReportCheckout:${reportSlug}`;
  const provider =
    country.trim().toLowerCase() === 'nigeria' ? 'Paystack' : 'PayPal';

  async function startCheckout(payload: {
    reportSlug: string;
    firstName: FormDataEntryValue | string | null;
    lastName: FormDataEntryValue | string | null;
    email: FormDataEntryValue | string | null;
    billingCountry: string;
  }) {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/intelligence/reports/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data?.statusx === 'ACCOUNT_EXISTS_LOGIN_REQUIRED') {
        window.localStorage.setItem(
          pendingCheckoutKey,
          JSON.stringify(payload),
        );
        window.location.href =
          data.loginPath ||
          `/auth/login?next=${encodeURIComponent(`/supplier-intelligence/reports/${reportSlug}?resumeCheckout=1`)}`;
        return;
      }
      if (!response.ok || !data.authorizationUrl)
        throw new Error(data.message || 'Unable to start checkout.');
      window.localStorage.removeItem(pendingCheckoutKey);
      window.location.href = data.authorizationUrl;
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : 'Unable to start checkout.',
      );
      setLoading(false);
    }
  }

  useEffect(() => {
    const shouldResume =
      new URLSearchParams(window.location.search).get('resumeCheckout') === '1';
    if (!shouldResume) return;
    const pending = window.localStorage.getItem(pendingCheckoutKey);
    if (!pending) return;
    try {
      const payload = JSON.parse(pending);
      if (payload?.reportSlug === reportSlug) void startCheckout(payload);
    } catch {
      window.localStorage.removeItem(pendingCheckoutKey);
    }
    // This should run once when returning from the login page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingCheckoutKey, reportSlug]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await startCheckout({
      reportSlug,
      firstName: form.get('firstName'),
      lastName: form.get('lastName'),
      email: form.get('email'),
      billingCountry: country,
    });
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
      <Popover open={countryOpen} onOpenChange={setCountryOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={countryOpen}
            aria-label="Select billing country"
            className={cn(
              field,
              'h-auto justify-between font-normal hover:bg-white',
              !country && 'text-slate-400',
            )}
          >
            <span className="flex min-w-0 items-center gap-3">
              <Globe2 className="h-4 w-4 shrink-0 text-slate-400" />
              <span className="truncate">
                {country || 'Select billing country'}
              </span>
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-xl border-slate-200 bg-white p-0 shadow-xl"
        >
          <Command className="bg-white">
            <CommandInput
              placeholder="Search country..."
              className="border-none focus:ring-0"
            />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-y-auto">
                {countries
                  .filter((item) => item.optionValue)
                  .map((item) => (
                    <CommandItem
                      key={item.optionValue}
                      value={item.optionName}
                      onSelect={() => {
                        setCountry(item.optionValue);
                        setCountryOpen(false);
                      }}
                      className="cursor-pointer py-2.5"
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4 text-brand-orange-500',
                          country === item.optionValue
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                      {item.optionName}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
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
        {!country
          ? 'Select country to continue'
          : loading
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
