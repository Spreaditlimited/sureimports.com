'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Check, Handshake, Loader2, Merge, ShieldCheck, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type Draft = {
  pidOrder: string;
  orderName: string | null;
  productCount: number;
  currencyType: string | null;
  shippingPlan: string | null;
};
type Assistance = {
  pidCase: string;
  expiresAt: string;
  assignedAdminName: string | null;
  canCreateOrder: boolean;
  orderIds: string[];
};

export default function ProcurementDraftTools({
  onChanged,
}: {
  onChanged?: () => void;
}) {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [cases, setCases] = useState<Assistance[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [target, setTarget] = useState('');
  const [note, setNote] = useState('');
  const [createNew, setCreateNew] = useState(false);
  const [busy, setBusy] = useState('');
  const [hasWhatsAppNumber, setHasWhatsAppNumber] = useState<boolean | null>(
    null,
  );
  const chosen = useMemo(
    () => drafts.filter((draft) => selected.includes(draft.pidOrder)),
    [drafts, selected],
  );
  const hasSavedOrders = drafts.length > 0;
  const hasActiveRequest = cases.length > 0;
  const heading = hasActiveRequest
    ? 'Admin help is active'
    : !hasSavedOrders
      ? 'Need help creating your order?'
      : drafts.length === 1
        ? 'Need help with your saved order?'
        : 'Need help or have more than one saved order?';
  const description = hasActiveRequest
    ? 'You already have an order help request. Remove access before starting another.'
    : !hasSavedOrders
      ? 'You can ask an admin to create an order for you. You can remove their access at any time.'
      : drafts.length === 1
        ? 'Select the saved order if you want an admin to help you complete it. You can remove their access at any time.'
        : 'Select the saved orders you want an admin to help with. To combine orders, select two or more and choose the order you want to keep. You can remove admin access at any time.';

  const load = async () => {
    const response = await fetch('/api/procurement/drafts', {
      cache: 'no-store',
    });
    if (!response.ok) return;
    const data = await response.json();
    setDrafts(data.orders || []);
    setCases(data.cases || []);
    setHasWhatsAppNumber(data.hasWhatsAppNumber === true);
  };
  useEffect(() => {
    void load();
  }, []);
  const toggle = (id: string) =>
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  const authorize = async () => {
    if (!selected.length && !createNew)
      return toast.warning(
        'Select an order or ask an admin to create one for you.',
      );
    setBusy('authorize');
    const response = await fetch('/api/procurement/assistance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderIds: selected,
        supportNote: note,
        canCreateOrder: createNew,
      }),
    });
    const data = await response.json();
    setBusy('');
    if (!response.ok)
      return toast.error(data.message || 'We could not give the admin access.');
    toast.success('The admin can now help with your order for 7 days.');
    setSelected([]);
    setCreateNew(false);
    setNote('');
    await load();
  };
  const revoke = async (pidCase: string) => {
    setBusy(pidCase);
    const response = await fetch('/api/procurement/assistance', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pidCase }),
    });
    setBusy('');
    if (!response.ok)
      return toast.error('We could not remove the admin’s access.');
    toast.success('The admin no longer has access.');
    await load();
  };
  const merge = async () => {
    if (selected.length < 2 || !target)
      return toast.warning('Select at least two orders and the order to keep.');
    setBusy('merge');
    const response = await fetch('/api/procurement/merge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderIds: selected,
        targetOrderId: target,
        idempotencyKey: `user-${Date.now()}-${selected.slice().sort().join('-')}`,
      }),
    });
    const data = await response.json();
    setBusy('');
    if (!response.ok)
      return toast.error(data.message || 'Unable to merge orders.');
    toast.success('Orders merged successfully.');
    setSelected([]);
    setTarget('');
    await load();
    onChanged?.();
  };

  return (
    <section
      className="mb-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/30 dark:border-slate-800 dark:bg-slate-900 sm:p-7"
      aria-labelledby="draft-tools-title"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-blue-600">
            Order help
          </p>
          <h2
            id="draft-tools-title"
            className="mt-1 text-xl font-black text-slate-900 dark:text-white"
          >
            {heading}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">{description}</p>
        </div>
        <ShieldCheck className="h-7 w-7 shrink-0 text-emerald-500" />
      </div>
      {cases.map((item) => (
        <div
          key={item.pidCase}
          className="mt-4 flex flex-col gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm dark:border-emerald-900 dark:bg-emerald-950/30 sm:flex-row sm:items-center sm:justify-between"
        >
          <span>
            <b>Admin help is on.</b>{' '}
            {item.orderIds.length > 0
              ? `The admin can help with ${item.orderIds.length} saved ${item.orderIds.length === 1 ? 'order' : 'orders'}`
              : item.canCreateOrder
                ? 'The admin can create an order for you'
                : 'The admin can help with your order'}{' '}
            until {new Date(item.expiresAt).toLocaleDateString('en-GB')}
            {item.assignedAdminName
              ? ` · ${item.assignedAdminName} is helping you`
              : ''}
            .
          </span>
          <Button
            variant="outline"
            onClick={() => revoke(item.pidCase)}
            disabled={busy === item.pidCase}
            className="min-h-11 border-rose-200 text-rose-700"
          >
            <X className="mr-2 h-4 w-4" />
            Remove access
          </Button>
        </div>
      ))}
      {!hasActiveRequest && hasWhatsAppNumber === false ? (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
          <p className="font-bold text-amber-950 dark:text-amber-100">
            Add your WhatsApp number first
          </p>
          <p className="mt-1 text-sm leading-6 text-amber-900/80 dark:text-amber-200/80">
            The admin will need to chat with you while helping with your order.
          </p>
          <Button
            asChild
            className="mt-4 min-h-11 bg-amber-600 font-bold text-white hover:bg-amber-700"
          >
            <Link href="/dashboard/profile-update">Add WhatsApp number</Link>
          </Button>
        </div>
      ) : !hasActiveRequest && hasWhatsAppNumber === true ? (
        <>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {drafts.map((draft) => (
              <label
                key={draft.pidOrder}
                className={`flex min-h-20 cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${selected.includes(draft.pidOrder) ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30' : 'border-slate-200 dark:border-slate-700'}`}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(draft.pidOrder)}
                  onChange={() => toggle(draft.pidOrder)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-none border-2 transition peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2 ${selected.includes(draft.pidOrder) ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-400 bg-white dark:border-slate-500 dark:bg-slate-900'}`}
                >
                  {selected.includes(draft.pidOrder) ? (
                    <Check className="h-4 w-4 stroke-[3]" />
                  ) : null}
                </span>
                <span className="min-w-0">
                  <b className="block truncate text-sm text-slate-900 dark:text-white">
                    {draft.orderName || draft.pidOrder}
                  </b>
                  <span className="text-xs text-slate-500">
                    {draft.productCount}{' '}
                    {draft.productCount === 1 ? 'product' : 'products'} ·{' '}
                    {draft.currencyType || 'Currency not set'}
                  </span>
                </span>
              </label>
            ))}
          </div>
          <label className="mt-5 flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 text-sm font-semibold dark:border-slate-700">
            <input
              type="checkbox"
              checked={createNew}
              onChange={(event) => setCreateNew(event.target.checked)}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-none border-2 transition peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2 ${createNew ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-400 bg-white dark:border-slate-500 dark:bg-slate-900'}`}
            >
              {createNew ? <Check className="h-4 w-4 stroke-[3]" /> : null}
            </span>
            <span>
              {hasSavedOrders
                ? 'Allow an admin to create another order for me'
                : 'Allow an admin to create an order for me'}
            </span>
          </label>
          {(!!selected.length || createNew) && (
            <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto]">
              <Textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Tell the admin what you need help with"
                className="min-h-24"
              />
              <div className="flex min-w-52 flex-col gap-3">
                <Button
                  onClick={authorize}
                  disabled={!!busy}
                  className="min-h-12 bg-blue-600 font-bold hover:bg-blue-700"
                >
                  {busy === 'authorize' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Handshake className="mr-2 h-4 w-4" />
                  )}
                  Give admin access
                </Button>
                {chosen.length >= 2 && (
                  <>
                    <select
                      value={target}
                      onChange={(event) => setTarget(event.target.value)}
                      className="min-h-12 rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                    >
                      <option value="">Choose the order to keep</option>
                      {chosen.map((draft) => (
                        <option key={draft.pidOrder} value={draft.pidOrder}>
                          {draft.orderName || draft.pidOrder}
                        </option>
                      ))}
                    </select>
                    <Button
                      variant="outline"
                      onClick={merge}
                      disabled={!!busy}
                      className="min-h-12 font-bold"
                    >
                      <Merge className="mr-2 h-4 w-4" />
                      Combine selected orders
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      ) : null}
      <p className="mt-4 text-xs text-slate-500">
        The admin can only create or update your orders and products. They
        cannot make payments, use your wallet, change your password, or update
        your profile.
      </p>
    </section>
  );
}
