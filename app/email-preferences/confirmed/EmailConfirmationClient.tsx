'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Loader2,
  Mail,
  MailCheck,
  MailX,
  ShieldCheck,
} from 'lucide-react';

type ConfirmationStatus = 'confirmed' | 'expired' | 'invalid';

const states = {
  confirmed: {
    icon: CheckCircle2,
    eyebrow: 'Confirmation complete',
    title: 'Your email is confirmed',
    message:
      'Thank you. You will receive practical Sure Imports guidance and can unsubscribe whenever you choose.',
    iconClass: 'bg-emerald-50 text-emerald-700',
  },
  expired: {
    icon: Clock3,
    eyebrow: 'Link expired',
    title: 'Send yourself a fresh link',
    message:
      'Confirmation links expire after seven days for your security. Enter your email address and we will send you a new one.',
    iconClass: 'bg-amber-50 text-amber-700',
  },
  invalid: {
    icon: MailX,
    eyebrow: 'Link unavailable',
    title: 'Request a new confirmation link',
    message:
      'This link may be incomplete or no longer available. Enter your email address to receive a fresh one.',
    iconClass: 'bg-rose-50 text-rose-700',
  },
} as const;

export default function EmailConfirmationClient({
  status,
}: {
  status: ConfirmationStatus;
}) {
  const state = states[status];
  const Icon = state.icon;
  const needsNewLink = status !== 'confirmed';
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setMessage('');
    setIsError(false);

    try {
      const response = await fetch('/api/marketing/resend-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const payload = await response.json();
      setMessage(payload?.message || 'We could not complete your request.');
      setIsError(!response.ok);
      setSent(response.ok);
    } catch {
      setMessage(
        'We could not send the confirmation email right now. Please try again shortly.',
      );
      setIsError(true);
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-[75vh] bg-slate-50 px-4 pb-20 pt-32 text-slate-950">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <div
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${state.iconClass}`}
          >
            <Icon className="h-8 w-8" aria-hidden="true" />
          </div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.24em] text-brand-orange-600">
            {state.eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {state.title}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
            {state.message}
          </p>
        </div>

        {needsNewLink ? (
          <section className="mx-auto mt-8 max-w-2xl rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-200/50">
            {sent ? (
              <div
                role="status"
                aria-live="polite"
                className="px-5 py-7 text-center sm:px-8"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                  <MailCheck className="h-6 w-6" aria-hidden="true" />
                </div>
                <h2 className="mt-4 text-lg font-bold text-slate-950">
                  Check your inbox
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                  {message}
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="p-4 sm:p-6">
                <label
                  htmlFor="confirmation-email"
                  className="text-sm font-bold text-slate-900"
                >
                  Email address
                </label>
                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                  <div className="flex min-w-0 flex-1 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-blue-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
                    <Mail
                      className="h-4 w-4 shrink-0 text-slate-400"
                      aria-hidden="true"
                    />
                    <input
                      id="confirmation-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      required
                      aria-invalid={isError}
                      aria-describedby={
                        message ? 'confirmation-form-message' : undefined
                      }
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-slate-400"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {sending ? (
                      <Loader2
                        className="h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />
                    ) : (
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    )}
                    {sending ? 'Sending…' : 'Send new link'}
                  </button>
                </div>
                {message && (
                  <p
                    id="confirmation-form-message"
                    role="alert"
                    className={`mt-3 text-sm ${isError ? 'text-red-700' : 'text-emerald-700'}`}
                  >
                    {message}
                  </p>
                )}
                <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500">
                  <ShieldCheck
                    className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                    aria-hidden="true"
                  />
                  The new link will expire after seven days. We will only add
                  you to our email updates after you confirm.
                </div>
              </form>
            )}
          </section>
        ) : (
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-800"
            >
              Return to Sure Imports
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        )}

        {needsNewLink && (
          <p className="mt-5 text-center text-xs text-slate-500">
            Already confirmed?{' '}
            <Link
              href="/"
              className="font-semibold text-blue-700 hover:text-blue-800"
            >
              Return to Sure Imports
            </Link>
          </p>
        )}
      </div>
    </main>
  );
}
