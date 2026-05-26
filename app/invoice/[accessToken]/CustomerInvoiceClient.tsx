'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

export default function CustomerInvoiceClient({ accessToken }: { accessToken: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [claimedAmount, setClaimedAmount] = useState('');
  const [selectedBankAccountId, setSelectedBankAccountId] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchInvoice = async (background = false) => {
    if (background) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');
    try {
      const res = await fetch(`/api/invoicing/public/invoice/${accessToken}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || 'Failed to load invoice');
      setData(json.data);
    } catch (e: any) {
      setError(e.message || 'Failed to load invoice');
    } finally {
      if (background) {
        setIsRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchInvoice(false);
    const id = setInterval(() => {
      fetchInvoice(true);
    }, 20000);
    return () => clearInterval(id);
  }, [accessToken]);

  const invoice = data?.invoice;
  const accounts = data?.bankAccounts || [];
  const pendingClaims = useMemo(
    () => (invoice?.paymentClaims || []).filter((c: any) => c.status === 'PENDING_CONFIRMATION'),
    [invoice],
  );

  const submitClaim = async () => {
    const amount = Number(claimedAmount || 0);
    if (!Number.isFinite(amount) || amount <= 0) {
      setError('Enter a valid amount paid.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`/api/invoicing/public/invoice/${accessToken}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          claimedAmount: amount,
          selectedBankAccountId: selectedBankAccountId || null,
          paymentReference: paymentReference || null,
          note: note || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || 'Failed to submit payment claim');
      setClaimedAmount('');
      setPaymentReference('');
      setNote('');
      await fetchInvoice(true);
    } catch (e: any) {
      setError(e.message || 'Failed to submit payment claim');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          <p className="font-medium text-slate-600">Loading secure invoice...</p>
        </div>
      </div>
    );

  if (error && !invoice)
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-xl">
          <div className="mb-4 text-4xl text-red-500">⚠️</div>
          <h2 className="text-xl font-bold text-slate-900">Unable to load invoice</h2>
          <p className="mt-2 text-slate-600">{error}</p>
        </div>
      </div>
    );

  if (!invoice) return <div className="p-8 text-slate-900">Invoice not found.</div>;

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PAID':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'PARTIAL':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans text-slate-900">
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="Sure Imports" width={140} height={36} className="h-8 w-auto" priority />
            {isRefreshing ? (
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Updating...
              </span>
            ) : null}
          </div>
          <div className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusColor(invoice.status)}`}>
            {invoice.status}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-5xl space-y-8 px-4 pt-8">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-6 p-6 md:flex-row md:items-end md:p-8">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">Invoice {invoice.invoiceNumber}</h1>
              <p className="mt-1 text-slate-500">
                Issued to{' '}
                <span className="font-medium text-slate-900">{invoice.customerName || invoice.customerEmail}</span>
              </p>
              {invoice.customerEmail ? (
                <p className="mt-1 text-sm text-slate-500">{invoice.customerEmail}</p>
              ) : null}
            </div>
            <div className="text-left md:text-right">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Balance Due</p>
              <p className="text-4xl font-black text-[#0b3b88]">
                <span className="mr-1 text-xl">{invoice.currency}</span>
                {Number(invoice.balanceDue).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 border-t border-slate-100 bg-slate-50/50 md:grid-cols-4">
            <div className="border-r border-slate-100 p-6">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Currency</p>
              <p className="font-semibold">{invoice.currency}</p>
            </div>
            <div className="border-slate-100 p-6 md:border-r">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Amount</p>
              <p className="font-semibold">{Number(invoice.grandTotal).toLocaleString()}</p>
            </div>
            <div className="border-r border-slate-100 p-6">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Paid</p>
              <p className="font-semibold text-emerald-600">{Number(invoice.amountPaid).toLocaleString()}</p>
            </div>
            <div className="p-6">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Items</p>
              <p className="font-semibold">{invoice.items.length} Lines</p>
            </div>
          </div>
        </section>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-white px-6 py-4">
            <h2 className="font-bold text-slate-800">Itemized Breakdown</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-slate-50/50 text-slate-500">
              <tr>
                <th className="px-6 py-4 text-left font-bold uppercase tracking-tighter">Description</th>
                <th className="px-6 py-4 text-right font-bold uppercase tracking-tighter">Qty</th>
                <th className="px-6 py-4 text-right font-bold uppercase tracking-tighter">Unit Price</th>
                <th className="px-6 py-4 text-right font-bold uppercase tracking-tighter text-slate-900">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.items.map((it: any) => (
                <tr key={it.pidInvoiceItem} className="transition-colors hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-medium text-slate-900">{it.description}</td>
                  <td className="px-6 py-4 text-right text-slate-600">{Number(it.quantity).toLocaleString()}</td>
                  <td className="px-6 py-4 text-right text-slate-600">
                    {invoice.currency} {Number(it.unitPrice).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900">
                    {invoice.currency} {Number(it.lineTotal).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid gap-8 md:grid-cols-5">
          <div className="space-y-6 md:col-span-3">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-2 text-lg font-bold text-slate-900">1. Payment Instructions</h2>
              <p className="mb-6 text-sm text-slate-500">
                Please transfer the amount to one of the following accounts:
              </p>

              <div className="space-y-3">
                {accounts.map((acc: any) => (
                  <label
                    key={acc.pidBankAccount}
                    className={`relative block cursor-pointer rounded-xl border-2 p-4 transition-all ${
                      selectedBankAccountId === acc.pidBankAccount
                        ? 'border-[#0b3b88] bg-blue-50/50 ring-4 ring-blue-50'
                        : 'border-slate-100 bg-white hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="bankAccount"
                            className="h-4 w-4 text-[#0b3b88] focus:ring-[#0b3b88]"
                            checked={selectedBankAccountId === acc.pidBankAccount}
                            onChange={() => setSelectedBankAccountId(acc.pidBankAccount)}
                          />
                          <p className="font-bold text-slate-900">{acc.accountName}</p>
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-500">
                            {acc.currency}
                          </span>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-y-1 pl-6 text-sm">
                          <span className="text-xs text-slate-400">Bank:</span>
                          <span className="font-medium text-slate-700">{acc.bankName}</span>
                          <span className="text-xs text-slate-400">Acc Number:</span>
                          <span className="select-all font-medium text-slate-700">{acc.accountNumber}</span>
                          {acc.sortCode ? (
                            <>
                              <span className="text-xs text-slate-400">Sort Code:</span>
                              <span className="font-medium text-slate-700">{acc.sortCode}</span>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            {pendingClaims.length > 0 ? (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
                  Pending Confirmations
                </h3>
                <div className="space-y-3">
                  {pendingClaims.map((c: any) => (
                    <div
                      key={c.pidClaim}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-sm"
                    >
                      <div>
                        <p className="font-bold text-slate-900">
                          {invoice.currency} {Number(c.claimedAmount).toLocaleString()}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(c.claimedAt).toLocaleDateString()} at{' '}
                          {new Date(c.claimedAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <span className="rounded bg-amber-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-600">
                        Awaiting Review
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <div className="md:col-span-2">
            <div className="sticky top-24 rounded-2xl bg-slate-900 p-6 shadow-xl">
              <h2 className="mb-2 text-lg font-bold text-white">2. Confirm Payment</h2>
              <p className="mb-6 text-sm text-blue-100">Notify us once you've made the transfer.</p>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase text-blue-100">
                    Amount Paid ({invoice.currency})
                  </label>
                  <input
                    value={claimedAmount}
                    onChange={(e) => setClaimedAmount(e.target.value)}
                    type="number"
                    placeholder="0.00"
                    className="w-full rounded-xl border border-white/30 bg-white/20 px-4 py-3 text-white placeholder:text-white/60 transition-all focus:bg-white/30 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase text-blue-100">
                    Payment Reference
                  </label>
                  <input
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    placeholder="Transaction ID or Name"
                    className="w-full rounded-xl border border-white/30 bg-white/20 px-4 py-3 text-white placeholder:text-white/60 transition-all focus:bg-white/30 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase text-blue-100">
                    Additional Note
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    placeholder="Optional message..."
                    className="w-full resize-none rounded-xl border border-white/30 bg-white/20 px-4 py-3 text-white placeholder:text-white/60 transition-all focus:bg-white/30 focus:outline-none"
                  />
                </div>

                {error ? (
                  <div className="rounded-lg border border-red-500/50 bg-red-500/20 p-3 text-xs text-red-200">
                    {error}
                  </div>
                ) : null}

                <button
                  disabled={submitting}
                  onClick={submitClaim}
                  className="w-full rounded-xl bg-blue-600 px-4 py-4 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Processing...
                    </span>
                  ) : (
                    'Confirm My Payment'
                  )}
                </button>
                <p className="text-center text-[10px] text-blue-100/80">
                  Secure transmission to Sure Imports Admin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
