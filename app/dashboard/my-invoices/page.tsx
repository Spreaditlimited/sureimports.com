'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  Loader2,
  ReceiptText,
  RefreshCcw,
  ExternalLink,
  Wallet,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

type Invoice = {
  pidInvoice: string;
  invoiceNumber?: string | null;
  status?: string | null;
  currency?: string | null;
  grandTotal?: string | number | null;
  amountPaid?: string | number | null;
  balanceDue?: string | number | null;
  customerName?: string | null;
  customerEmail?: string | null;
  issuedAt?: string | null;
  dueDate?: string | null;
  paidAt?: string | null;
  createdAt?: string | null;
  accessToken?: string | null;
  paymentClaimsCount?: number;
  latestPaymentClaimStatus?: string | null;
};

const money = (value: string | number | null | undefined) =>
  Number(value || 0).toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const shortDate = (value: string | null | undefined) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const statusPill = (status: string | null | undefined) => {
  const normalized = String(status || '').toUpperCase();
  if (['PAID', 'SETTLED'].includes(normalized))
    return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30';
  if (['PARTIALLY_PAID', 'PARTIAL'].includes(normalized))
    return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30';
  if (['OVERDUE'].includes(normalized))
    return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-900/30';
  return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
};

export default function MyInvoicesPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const fetchInvoices = async (background = false) => {
    if (background) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch('/api/invoicing/user/invoices', {
        cache: 'no-store',
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || 'Failed to fetch invoices');
      setInvoices(Array.isArray(json?.data) ? json.data : []);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch invoices';
      toast.error(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInvoices(false);
    const timer = setInterval(() => fetchInvoices(true), 30000);
    return () => clearInterval(timer);
  }, []);

  const stats = useMemo(() => {
    return invoices.reduce(
      (acc, invoice) => {
        const total = Number(invoice.grandTotal || 0);
        const due = Number(invoice.balanceDue || 0);
        acc.totalInvoices += 1;
        acc.totalValue += total;
        acc.totalDue += due;
        return acc;
      },
      { totalInvoices: 0, totalValue: 0, totalDue: 0 },
    );
  }, [invoices]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcfcfd] dark:bg-slate-950">
        <div className="h-64 bg-slate-900 pb-32 pt-12 text-white"></div>
        <div className="mx-auto -mt-16 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="flex h-96 items-center justify-center rounded-[32px] border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-slate-950">
      {/* Deep Slate Hero Section */}
      <div className="bg-slate-900 pb-40 pt-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                  Billing & Payments
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                My Invoices
              </h1>
              <p className="mt-3 text-sm font-medium text-slate-400 md:text-base">
                View, track, and pay your administrative invoices.
              </p>
            </div>

            {/* Hero Stats */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
                  <Wallet className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Total Billed
                  </p>
                  <p className="text-lg font-black text-white">
                    ₦{money(stats.totalValue)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/20">
                  <AlertCircle className="h-6 w-6 text-rose-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Outstanding
                  </p>
                  <p className="text-lg font-black text-rose-400">
                    ₦{money(stats.totalDue)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto -mt-24 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        {/* Toolbar */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            Showing {stats.totalInvoices} Invoice
            {stats.totalInvoices !== 1 && 's'}
          </p>
          <Button
            onClick={() => fetchInvoices(true)}
            variant="outline"
            disabled={refreshing}
            className="h-10 rounded-xl border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <RefreshCcw
              className={`mr-2 h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`}
            />
            Refresh List
          </Button>
        </div>

        {/* Invoices Table Container */}
        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl shadow-slate-200/20 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:border-slate-800 dark:bg-slate-800/30">
                  <th className="p-6 pl-8">Invoice Details</th>
                  <th className="p-6">Status</th>
                  <th className="p-6">Total Amount</th>
                  <th className="p-6">Amount Paid</th>
                  <th className="p-6">Balance Due</th>
                  <th className="p-6 pr-8 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <ReceiptText className="mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                          You do not have any invoices yet.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  invoices.map((invoice) => (
                    <tr
                      key={invoice.pidInvoice}
                      className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <td className="p-6 pl-8">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {invoice.invoiceNumber || invoice.pidInvoice}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          Issued:{' '}
                          {shortDate(invoice.issuedAt || invoice.createdAt)}
                          {invoice.dueDate &&
                            ` • Due: ${shortDate(invoice.dueDate)}`}
                        </div>
                      </td>
                      <td className="p-6">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${statusPill(invoice.status)}`}
                        >
                          {invoice.status || 'ISSUED'}
                        </span>
                      </td>
                      <td className="p-6 font-semibold text-slate-700 dark:text-slate-300">
                        {invoice.currency || 'NGN'} {money(invoice.grandTotal)}
                      </td>
                      <td className="p-6 font-semibold text-emerald-600 dark:text-emerald-400">
                        {invoice.currency || 'NGN'} {money(invoice.amountPaid)}
                      </td>
                      <td className="p-6 font-bold text-rose-600 dark:text-rose-400">
                        {invoice.currency || 'NGN'} {money(invoice.balanceDue)}
                      </td>
                      <td className="p-6 pr-8 text-right">
                        {invoice.accessToken ? (
                          <Link
                            href={`/invoice/${invoice.accessToken}`}
                            target="_blank"
                            className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-indigo-50 px-4 text-xs font-bold text-indigo-600 transition-colors hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
                          >
                            View Invoice
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        ) : (
                          <span className="text-xs text-slate-400">
                            Unavailable
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
