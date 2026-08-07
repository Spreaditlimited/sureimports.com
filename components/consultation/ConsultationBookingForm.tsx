'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CalendarClock, CheckCircle2, Loader2 } from 'lucide-react';

type Slot = {
  startIso: string;
  endIso: string;
  label: string;
};

type SlotsResponse = {
  ok: boolean;
  timezone: string;
  durationMinutes: number;
  slots: Slot[];
};

function formatAmount(kobo: number) {
  return `₦${Math.round(kobo / 100).toLocaleString()}`;
}

export default function ConsultationBookingForm({
  amountKobo,
}: {
  amountKobo: number;
}) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [isLoadingSlots, setIsLoadingSlots] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    businessName: '',
    consultationGoal: '',
  });

  useEffect(() => {
    let mounted = true;

    async function loadSlots() {
      setIsLoadingSlots(true);
      setError('');
      try {
        const response = await fetch('/api/consultation/slots', {
          cache: 'no-store',
        });
        const data = (await response.json()) as SlotsResponse;
        if (!response.ok || !data.ok)
          throw new Error('Could not load available slots.');
        if (!mounted) return;
        setSlots(data.slots || []);
        setSelectedSlot(data.slots?.[0]?.startIso || '');
      } catch (slotError) {
        if (!mounted) return;
        setError(
          slotError instanceof Error
            ? slotError.message
            : 'Could not load available slots.',
        );
      } finally {
        if (mounted) setIsLoadingSlots(false);
      }
    }

    loadSlots();
    return () => {
      mounted = false;
    };
  }, []);

  const selectedSlotLabel = useMemo(
    () => slots.find((slot) => slot.startIso === selectedSlot)?.label || '',
    [selectedSlot, slots],
  );

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/consultation/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, slotStartIso: selectedSlot }),
      });
      const data = await response.json();
      if (!response.ok || !data?.authorizationUrl) {
        throw new Error(data?.message || 'Could not start payment.');
      }
      window.location.href = data.authorizationUrl;
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Could not start payment.',
      );
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_28px_80px_-35px_rgba(15,23,42,0.28)] sm:rounded-[2rem] lg:grid-cols-[0.72fr_1.28fr]">
      <aside className="relative overflow-hidden bg-slate-950 p-6 text-white sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-brand-orange-500/10 blur-3xl" />
        <div className="absolute inset-y-0 left-0 w-1 bg-brand-orange-500" />

        <div className="relative">
          <div className="flex items-center justify-between gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-brand-orange-400">
              <CalendarClock className="h-4 w-4" />
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-300">
              30 minutes
            </span>
          </div>

          <div className="mt-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange-400">
              Your consultation
            </p>
            <h3 className="mt-3 text-2xl font-black leading-tight tracking-tight">
              Clear answers for your next import decision.
            </h3>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              This is a focused 30-minute call for importers who need clear
              direction before paying a supplier, choosing a buying route, or
              committing money.
            </p>
          </div>

          <div className="my-7 h-px bg-white/10" />

          <div>
            <p className="text-xs font-semibold text-slate-400">Session fee</p>
            <p className="mt-1 text-4xl font-black tracking-tight text-white">
              {formatAmount(amountKobo)}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              One-time secure payment
            </p>
          </div>

          <div className="mt-8 space-y-3 text-sm leading-6 text-slate-300">
            {[
              'Your situation reviewed before the call',
              'Private Zoom meeting link by email',
              'Confirmed slot after secure payment',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {selectedSlotLabel ? (
            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Selected session
              </p>
              <p className="mt-1.5 text-sm font-semibold leading-relaxed text-white">
                {selectedSlotLabel}
              </p>
            </div>
          ) : null}
        </div>
      </aside>

      <form onSubmit={handleSubmit} className="p-5 sm:p-8 lg:p-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange-600">
            01 / Select a time
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
            When would you like to talk?
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            All times are shown in West Africa Time (WAT).
          </p>
        </div>

        <div className="mt-6">
          {isLoadingSlots ? (
            <div className="flex min-h-28 items-center justify-center rounded-xl border border-dashed border-slate-300 text-sm font-semibold text-slate-500">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading available slots...
            </div>
          ) : slots.length ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {slots.slice(0, 12).map((slot) => {
                const active = selectedSlot === slot.startIso;
                return (
                  <button
                    key={slot.startIso}
                    type="button"
                    onClick={() => setSelectedSlot(slot.startIso)}
                    aria-pressed={active}
                    className={`rounded-xl border p-4 text-left text-sm font-semibold leading-5 transition-all ${
                      active
                        ? 'border-brand-orange-500 bg-brand-orange-50 text-slate-950 shadow-sm ring-2 ring-brand-orange-500/10'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {slot.label}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
              No consultation slots are available right now. Please check again
              later.
            </div>
          )}
        </div>

        <div className="mt-9 border-t border-slate-100 pt-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange-600">
            02 / Your details
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
            Help us prepare for your call
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            We’ll use these details for your confirmation and meeting invite.
          </p>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-xs font-bold text-slate-700">
            Full name
            <input
              value={form.fullName}
              onChange={(event) => updateField('fullName', event.target.value)}
              className="block h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-sm font-normal text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-orange-500 focus:bg-white focus:ring-2 focus:ring-brand-orange-500/20"
              placeholder="Your full name"
              required
            />
          </label>
          <label className="space-y-2 text-xs font-bold text-slate-700">
            Email address
            <input
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              className="block h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-sm font-normal text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-orange-500 focus:bg-white focus:ring-2 focus:ring-brand-orange-500/20"
              placeholder="you@example.com"
              type="email"
              required
            />
          </label>
          <label className="space-y-2 text-xs font-bold text-slate-700">
            Phone / WhatsApp
            <input
              value={form.phone}
              onChange={(event) => updateField('phone', event.target.value)}
              className="block h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-sm font-normal text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-orange-500 focus:bg-white focus:ring-2 focus:ring-brand-orange-500/20"
              placeholder="Your phone number"
              required
            />
          </label>
          <label className="space-y-2 text-xs font-bold text-slate-700">
            Business name{' '}
            <span className="font-normal text-slate-400">(optional)</span>
            <input
              value={form.businessName}
              onChange={(event) =>
                updateField('businessName', event.target.value)
              }
              className="block h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-sm font-normal text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-orange-500 focus:bg-white focus:ring-2 focus:ring-brand-orange-500/20"
              placeholder="Your business name"
            />
          </label>
        </div>

        <label className="mt-4 block space-y-2 text-xs font-bold text-slate-700">
          What do you need help with?
          <textarea
            value={form.consultationGoal}
            onChange={(event) =>
              updateField('consultationGoal', event.target.value)
            }
            className="block min-h-32 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm font-normal text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-orange-500 focus:bg-white focus:ring-2 focus:ring-brand-orange-500/20"
            placeholder="Tell us about the product, supplier, budget, or decision you want to make."
            required
          />
        </label>

        {error ? (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={
            isSubmitting || isLoadingSlots || !slots.length || !selectedSlot
          }
          className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-brand-orange-500 px-6 text-sm font-bold text-white shadow-lg shadow-brand-orange-500/25 transition-all hover:-translate-y-0.5 hover:bg-brand-orange-600 hover:shadow-xl hover:shadow-brand-orange-500/25 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isSubmitting
            ? 'Redirecting to Paystack...'
            : 'Pay and book consultation'}
          {!isSubmitting ? <ArrowRight className="h-4 w-4" /> : null}
        </button>

        <p className="mt-3 text-center text-xs font-medium text-slate-500">
          Secure payment is processed by Paystack. The Zoom link is sent after
          payment is verified.
        </p>
      </form>
    </div>
  );
}
