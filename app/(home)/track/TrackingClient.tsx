'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  Circle,
  Clock3,
  PackageSearch,
  Search,
  ShieldCheck,
  XCircle,
} from 'lucide-react';

type PublicStage = {
  key: string;
  label: string;
  state: 'completed' | 'current' | 'upcoming';
};

export default function TrackingClient({
  initialTrackingId = '',
}: {
  initialTrackingId?: string;
}) {
  const router = useRouter();
  const [trackingId, setTrackingId] = useState(initialTrackingId);
  const [shipment, setShipment] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(Boolean(initialTrackingId));

  useEffect(() => {
    if (!initialTrackingId) return;
    setLoading(true);
    fetch(`/api/tracking/${encodeURIComponent(initialTrackingId)}`, {
      cache: 'no-store',
    })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.message || 'Shipment not found');
        }
        setShipment(payload.data);
        setError('');
      })
      .catch((reason) => {
        setShipment(null);
        setError(reason?.message || 'Shipment not found');
      })
      .finally(() => setLoading(false));
  }, [initialTrackingId]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const value = trackingId.trim();
    if (value) router.push(`/track/${encodeURIComponent(value)}`);
  };

  return (
    <main className="min-h-[75vh] bg-slate-50 px-4 pb-20 pt-32 text-slate-950">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
            <PackageSearch className="h-8 w-8" />
          </div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.24em] text-brand-orange-600">
            Ship With Us
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Track your shipment
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
            Enter the unique ID provided for your Sure Imports shipping request.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="mx-auto mt-8 flex max-w-2xl gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-200/50"
        >
          <input
            value={trackingId}
            onChange={(event) => setTrackingId(event.target.value)}
            aria-label="Shipment tracking ID"
            placeholder="Enter your tracking ID"
            className="min-w-0 flex-1 rounded-xl px-4 py-3 font-mono text-sm outline-none"
          />
          <button className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-800">
            <Search className="h-4 w-4" /> Track
          </button>
        </form>

        <p className="mt-3 text-center text-xs text-slate-500">
          Your Ship With Us request ID is your tracking ID.
        </p>

        {loading && (
          <div className="mt-10 text-center text-sm text-slate-500">
            Loading shipment progress…
          </div>
        )}
        {error && (
          <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-red-200 bg-red-50 p-5 text-center text-sm text-red-700">
            {error}
          </div>
        )}

        {shipment && !loading && (
          <section className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/40">
            <header className="border-b border-slate-200 bg-slate-950 p-6 text-white md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Tracking ID
                  </p>
                  <p className="mt-2 font-mono text-xl font-bold">
                    {shipment.pidShippingOnly}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Current status
                  </p>
                  <p
                    className={`mt-2 font-bold ${
                      shipment.cancelled ? 'text-red-400' : 'text-emerald-400'
                    }`}
                  >
                    {shipment.currentStatusLabel}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-slate-300">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                {shipment.originCountry} → {shipment.destinationCountry}
                {shipment.shippingName ? ` · ${shipment.shippingName}` : ''}
              </div>
              {shipment.updatedAt && (
                <p className="mt-3 text-xs text-slate-400">
                  Last updated {new Date(shipment.updatedAt).toLocaleString()}
                </p>
              )}
            </header>

            {shipment.cancelled ? (
              <div className="flex items-center gap-3 p-6 text-red-700 md:p-8">
                <XCircle className="h-6 w-6" />
                <p className="font-semibold">This shipping request was cancelled.</p>
              </div>
            ) : (
              <div className="p-6 md:p-8">
                {shipment.stages.map((stage: PublicStage, index: number) => {
                  const completed = stage.state === 'completed';
                  const current = stage.state === 'current';
                  const isLast = index === shipment.stages.length - 1;
                  return (
                    <div
                      key={stage.key}
                      className="grid grid-cols-[2rem_1fr] gap-4"
                    >
                      <div className="flex flex-col items-center">
                        {completed ? (
                          <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-600" />
                        ) : current ? (
                          <Clock3 className="h-6 w-6 shrink-0 text-blue-700" />
                        ) : (
                          <Circle className="h-6 w-6 shrink-0 text-slate-300" />
                        )}
                        {!isLast && (
                          <div
                            className={`min-h-14 w-0.5 flex-1 ${
                              completed ? 'bg-emerald-300' : 'bg-slate-200'
                            }`}
                          />
                        )}
                      </div>
                      <div className="pb-7">
                        <p
                          className={`font-bold ${
                            current
                              ? 'text-blue-700'
                              : completed
                                ? 'text-slate-950'
                                : 'text-slate-400'
                          }`}
                        >
                          {stage.label}
                        </p>
                        {current && (
                          <p className="mt-1 text-xs text-slate-500">
                            Current shipment stage
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
