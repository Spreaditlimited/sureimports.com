'use client';
import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type Details = {
  orderName: string;
  shippingAddress: string;
  orderCategory: string;
  updatedAt: string;
  status: string;
  mergedIntoOrderId: string | null;
};
export default function DeliveryDetails({
  pidOrder,
  onReady,
}: {
  pidOrder: string;
  onReady: (ready: boolean) => void;
}) {
  const [details, setDetails] = useState<Details | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let cancelled = false;
    void fetch(
      `/api/procurement/delivery?pidOrder=${encodeURIComponent(pidOrder)}`,
    )
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.message);
        return data;
      })
      .then((data) => {
        if (!cancelled) {
          setDetails({ ...data, shippingAddress: data.shippingAddress || '' });
          onReady(
            Boolean(data.shippingAddress?.trim()) || data.status !== 'saved',
          );
        }
      })
      .catch((e) => {
        if (!cancelled)
          setMessage(e.message || 'Unable to load delivery details.');
      });
    return () => {
      cancelled = true;
    };
  }, [pidOrder, onReady]);
  async function save() {
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch('/api/procurement/delivery', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...details, pidOrder }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      window.location.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to save.');
    } finally {
      setBusy(false);
    }
  }
  if (!details)
    return <p role="status">{message || 'Loading delivery details…'}</p>;
  const editable = details.status === 'saved' && !details.mergedIntoOrderId;
  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
      <h1 className="text-xl font-bold">
        {details.shippingAddress
          ? 'Order and delivery details'
          : 'Your order is saved. Where should we deliver it?'}
      </h1>
      <p className="text-sm text-slate-500">
        You can edit the name and delivery address while this order is saved,
        before payment.
      </p>
      <label className="block">
        Order name
        <Input
          className="mt-2"
          disabled={!editable}
          maxLength={150}
          value={details.orderName || ''}
          onChange={(e) =>
            setDetails({ ...details, orderName: e.target.value })
          }
        />
      </label>
      <label className="block">
        Exact delivery address
        <Textarea
          className="mt-2"
          disabled={!editable}
          maxLength={190}
          placeholder="Recipient, street address, city, state/region, postal code and country"
          value={details.shippingAddress}
          onChange={(e) =>
            setDetails({ ...details, shippingAddress: e.target.value })
          }
        />
      </label>
      <label className="block">
        What type of goods are in this order?
        <span className="relative mt-2 block">
          <select
            className="block w-full appearance-none rounded-xl border bg-transparent py-3 pl-3 pr-12"
            disabled={!editable}
            value={details.orderCategory || 'Other Goods'}
            onChange={(e) =>
              setDetails({ ...details, orderCategory: e.target.value })
            }
          >
            {[
              'Other Goods',
              'Goods with Battery',
              'Raw Batteries',
              'Liquids, Gases, Powder',
            ].map((v) => (
              <option key={v} value={v}>
                {v === 'Other Goods' ? 'Non Battery/liquid' : v}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden="true"
            size={18}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400"
          />
        </span>
      </label>
      {editable && (
        <Button disabled={busy} onClick={() => void save()}>
          {busy ? 'Saving…' : 'Save delivery details'}
        </Button>
      )}
      {message && <p role="alert">{message}</p>}
    </section>
  );
}
