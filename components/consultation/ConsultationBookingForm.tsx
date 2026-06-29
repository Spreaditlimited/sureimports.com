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

export default function ConsultationBookingForm({ amountKobo }: { amountKobo: number }) {
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
        const response = await fetch('/api/consultation/slots', { cache: 'no-store' });
        const data = (await response.json()) as SlotsResponse;
        if (!response.ok || !data.ok) throw new Error('Could not load available slots.');
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
    <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-28">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-orange-50 text-brand-orange-600">
            <CalendarClock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Paid consultation
            </p>
            <p className="text-2xl font-black tracking-tight text-slate-950">
              {formatAmount(amountKobo)}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4 text-sm leading-6 text-slate-600">
          <p>
            This is a focused 30-minute call for importers who need clear direction
            before paying a supplier, choosing a buying route, or committing money.
          </p>
          <div className="space-y-3">
            {[
              'We review your import situation before the call.',
              'You receive a Zoom link after successful payment.',
              'Your slot is held only after Paystack confirms payment.',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {selectedSlotLabel ? (
          <div className="mt-6 rounded-xl border border-brand-orange-100 bg-brand-orange-50 p-4 text-sm font-semibold text-slate-900">
            Selected: {selectedSlotLabel}
          </div>
        ) : null}
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
      >
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-brand-orange-500">
            Choose a time
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950">
            Book your consultation
          </h2>
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
                    className={`rounded-xl border p-4 text-left text-sm font-semibold leading-5 transition ${
                      active
                        ? 'border-brand-orange-500 bg-brand-orange-50 text-slate-950 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-brand-orange-200'
                    }`}
                  >
                    {slot.label}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
              No consultation slots are available right now. Please check again later.
            </div>
          )}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <input
            value={form.fullName}
            onChange={(event) => updateField('fullName', event.target.value)}
            className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-brand-orange-500 focus:ring-2 focus:ring-brand-orange-500/20"
            placeholder="Full name"
            required
          />
          <input
            value={form.email}
            onChange={(event) => updateField('email', event.target.value)}
            className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-brand-orange-500 focus:ring-2 focus:ring-brand-orange-500/20"
            placeholder="Email address"
            type="email"
            required
          />
          <input
            value={form.phone}
            onChange={(event) => updateField('phone', event.target.value)}
            className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-brand-orange-500 focus:ring-2 focus:ring-brand-orange-500/20"
            placeholder="Phone / WhatsApp"
            required
          />
          <input
            value={form.businessName}
            onChange={(event) => updateField('businessName', event.target.value)}
            className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-brand-orange-500 focus:ring-2 focus:ring-brand-orange-500/20"
            placeholder="Business name, optional"
          />
        </div>

        <textarea
          value={form.consultationGoal}
          onChange={(event) => updateField('consultationGoal', event.target.value)}
          className="mt-4 min-h-32 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-orange-500 focus:ring-2 focus:ring-brand-orange-500/20"
          placeholder="What do you need help with? Include product, supplier, budget, shipping concern, or decision you want to make."
          required
        />

        {error ? (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting || isLoadingSlots || !slots.length || !selectedSlot}
          className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-orange-500 px-6 text-sm font-bold text-white shadow-lg shadow-brand-orange-500/20 transition hover:bg-brand-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isSubmitting ? 'Redirecting to Paystack...' : 'Pay and book consultation'}
          {!isSubmitting ? <ArrowRight className="h-4 w-4" /> : null}
        </button>

        <p className="mt-3 text-center text-xs font-medium text-slate-500">
          Secure payment is processed by Paystack. The Zoom link is sent after payment is verified.
        </p>
      </form>
    </div>
  );
}
