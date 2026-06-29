'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalendarClock, Loader2, Video, XCircle } from 'lucide-react';

type Slot = {
  startIso: string;
  endIso: string;
  label: string;
};

type SlotsResponse = {
  ok: boolean;
  slots: Slot[];
};

export default function ConsultationManageActions({
  manageToken,
  zoomJoinUrl,
  currentSlotIso,
  status,
}: {
  manageToken: string;
  zoomJoinUrl: string | null;
  currentSlotIso: string;
  status: string;
}) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const isActive = ['booked', 'rescheduled'].includes(status);

  useEffect(() => {
    if (!isActive) return;
    let mounted = true;

    async function loadSlots() {
      setIsLoadingSlots(true);
      try {
        const response = await fetch('/api/consultation/slots', { cache: 'no-store' });
        const data = (await response.json()) as SlotsResponse;
        if (!response.ok || !data.ok) throw new Error('Could not load available slots.');
        if (!mounted) return;
        const available = (data.slots || []).filter((slot) => slot.startIso !== currentSlotIso);
        setSlots(available);
        setSelectedSlot(available[0]?.startIso || '');
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
  }, [currentSlotIso, isActive]);

  const selectedSlotLabel = useMemo(
    () => slots.find((slot) => slot.startIso === selectedSlot)?.label || '',
    [selectedSlot, slots],
  );

  async function rescheduleBooking() {
    if (!selectedSlot) return;
    setError('');
    setMessage('');
    setIsRescheduling(true);

    try {
      const response = await fetch('/api/consultation/manage/reschedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ manageToken, slotStartIso: selectedSlot }),
      });
      const data = await response.json();
      if (!response.ok || !data?.ok) {
        throw new Error(data?.message || 'Could not reschedule booking.');
      }
      setMessage(`Your consultation has been rescheduled to ${data.label}.`);
      window.location.reload();
    } catch (rescheduleError) {
      setError(
        rescheduleError instanceof Error
          ? rescheduleError.message
          : 'Could not reschedule booking.',
      );
    } finally {
      setIsRescheduling(false);
    }
  }

  async function cancelBooking() {
    const confirmed = window.confirm(
      'Cancel this consultation booking? This will cancel the Zoom meeting too.',
    );
    if (!confirmed) return;

    setError('');
    setMessage('');
    setIsCancelling(true);

    try {
      const response = await fetch('/api/consultation/manage/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ manageToken }),
      });
      const data = await response.json();
      if (!response.ok || !data?.ok) {
        throw new Error(data?.message || 'Could not cancel booking.');
      }
      setMessage('Your consultation has been cancelled.');
      window.location.reload();
    } catch (cancelError) {
      setError(
        cancelError instanceof Error
          ? cancelError.message
          : 'Could not cancel booking.',
      );
    } finally {
      setIsCancelling(false);
    }
  }

  return (
    <div className="mt-6 space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        {zoomJoinUrl && isActive ? (
          <a
            href={zoomJoinUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-orange-500 px-5 text-sm font-bold text-white transition hover:bg-brand-orange-600"
          >
            <Video className="h-4 w-4" />
            Join Zoom Meeting
          </a>
        ) : null}

        {isActive ? (
          <button
            type="button"
            onClick={cancelBooking}
            disabled={isCancelling || isRescheduling}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 text-sm font-bold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCancelling ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            Cancel Booking
          </button>
        ) : null}
      </div>

      {isActive ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-slate-500" />
            <h2 className="text-sm font-bold text-slate-950">Reschedule booking</h2>
          </div>

          {isLoadingSlots ? (
            <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading available slots...
            </div>
          ) : slots.length ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
              <select
                value={selectedSlot}
                onChange={(event) => setSelectedSlot(event.target.value)}
                className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 outline-none focus:border-brand-orange-500 focus:ring-2 focus:ring-brand-orange-500/20"
              >
                {slots.slice(0, 30).map((slot) => (
                  <option key={slot.startIso} value={slot.startIso}>
                    {slot.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={rescheduleBooking}
                disabled={isRescheduling || isCancelling || !selectedSlot}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isRescheduling ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Reschedule
              </button>
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-600">
              No alternative slots are available right now.
            </p>
          )}

          {selectedSlotLabel ? (
            <p className="mt-3 text-xs font-medium text-slate-500">
              New selected time: {selectedSlotLabel}
            </p>
          ) : null}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
          This booking can no longer be changed.
        </div>
      )}

      {message ? (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
