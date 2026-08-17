// @ts-nocheck
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  ChevronDown,
  Plus,
  CheckCircle,
  X,
  Wallet,
  ArrowUpRight,
  History,
  Banknote,
  Search,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/dialog';

const STATUS_MAP = {
  paid: {
    label: 'Paid',
    color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  },
  refunded: {
    label: 'Refunded',
    color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  },
  pending: {
    label: 'Pending',
    color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  },
  requested: {
    label: 'Requested',
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-slate-500/10 text-slate-600 border-slate-500/20',
  },
  'wallet-transferred': {
    label: 'Moved to wallet',
    color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  },
};

const REFUNDABLE_STATUSES = new Set(['pending', 'requested']);

const isRefundable = (refund: any) =>
  REFUNDABLE_STATUSES.has(String(refund.refundStatus || '').toLowerCase()) &&
  String(refund.currency || '').toUpperCase() === 'NGN' &&
  parseFloat(refund.amount || 0) > 0;

const isPendingRefund = (refund: any) =>
  String(refund.refundStatus || '').toLowerCase() === 'pending' &&
  String(refund.currency || '').toUpperCase() === 'NGN' &&
  parseFloat(refund.amount || 0) > 0;

const formatRefundAmount = (amount: unknown, currency: unknown) => {
  const value = Number(amount || 0);
  const normalizedCurrency = String(currency || '').toUpperCase();
  if (normalizedCurrency !== 'NGN') {
    return `${normalizedCurrency || 'Currency unavailable'} ${value.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(value);
};

function StatusTag({ status }: { status: string }) {
  const config =
    STATUS_MAP[String(status || '').toLowerCase()] || STATUS_MAP.pending;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${config.color}`}
    >
      {config.label}
    </span>
  );
}

export default function RefundsPage({ records }: any) {
  const router = useRouter();
  const [refundData, setRefundData] = useState(records || []);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showRefundDestinationModal, setShowRefundDestinationModal] =
    useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [requestingDestination, setRequestingDestination] = useState<
    'bank' | 'wallet' | null
  >(null);
  const [transferringRefundId, setTransferringRefundId] = useState<
    string | null
  >(null);
  const [walletTransferFeedback, setWalletTransferFeedback] = useState<{
    type: 'success' | 'error';
    title: string;
    message: string;
    actionHref?: string;
    actionLabel?: string;
  } | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const filterOptions = ['All', 'Pending', 'Requested', 'Refunded', 'Paid'];
  const itemsPerPage = 8;

  // Handle outside click for dropdown
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Case-insensitive status filtering to avoid hiding valid records
  // when database values are lowercase (e.g. "pending") but UI filters are title case.
  const filteredData =
    selectedFilter === 'All'
      ? refundData
      : refundData.filter(
          (item: any) =>
            String(item.refundStatus || '').toLowerCase() ===
            selectedFilter.toLowerCase(),
        );

  const transferRefundsToWallet = async (refunds: any[]) => {
    const isBulkTransfer = refunds.length > 1;
    setTransferringRefundId(isBulkTransfer ? 'all' : refunds[0]?.pidRefund);
    try {
      const res = await fetch('/api/refunds/transfer-to-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pidRefunds: refunds.map((refund) => refund.pidRefund),
        }),
      });
      const data = await res.json();
      if (!res.ok || data?.statusx !== 'SUCCESS') {
        setShowRefundDestinationModal(false);
        if (data?.statusx === 'NO_WALLET') {
          setWalletTransferFeedback({
            type: 'error',
            title: data?.actionHref
              ? 'Complete your wallet profile'
              : 'Wallet activation unavailable',
            message: data.message || 'Please activate your wallet first.',
            actionHref: data?.actionHref,
            actionLabel: data?.actionLabel,
          });
          return;
        }
        setWalletTransferFeedback({
          type: 'error',
          title: 'Transfer unsuccessful',
          message:
            data?.message ||
            'Unable to transfer this refund to your wallet right now.',
        });
        return;
      }
      const transferredIds = new Set(
        data?.data?.transferredRefundIds ||
          refunds.map((refund) => refund.pidRefund),
      );
      setRefundData((current: any[]) =>
        current.map((item) =>
          transferredIds.has(item.pidRefund)
            ? { ...item, refundStatus: 'wallet-transferred' }
            : item,
        ),
      );
      const transferredAmount = refunds.reduce(
        (sum, refund) => sum + Number(refund.amount || 0),
        0,
      );
      setShowRefundDestinationModal(false);
      setWalletTransferFeedback({
        type: 'success',
        title: isBulkTransfer ? 'Refunds transferred' : 'Refund transferred',
        message: `${formatRefundAmount(transferredAmount, 'NGN')} has been credited to your Sure Wallet successfully.`,
      });
      router.refresh();
    } catch {
      setShowRefundDestinationModal(false);
      setWalletTransferFeedback({
        type: 'error',
        title: 'Transfer unsuccessful',
        message:
          'We could not transfer the refund to your wallet. Please try again.',
      });
    } finally {
      setTransferringRefundId(null);
    }
  };

  const requestBankRefund = async () => {
    setRequestingDestination('bank');
    try {
      const res = await fetch('/api/refunds/refund-request', {
        method: 'POST',
      });
      const data = await res.json();

      if (!res.ok || data?.statusx !== 'SUCCESS') {
        setShowRefundDestinationModal(false);
        setWalletTransferFeedback({
          type: 'error',
          title:
            data?.statusx === 'PROFILE_REQUIRED'
              ? 'Bank details required'
              : 'Request unsuccessful',
          message:
            data?.message ||
            'We could not submit your bank refund request. Please try again.',
          actionHref: data?.actionHref,
          actionLabel: data?.actionLabel,
        });
        return;
      }

      const requestedIds = new Set(data?.data?.requestedRefundIds || []);
      setRefundData((current: any[]) =>
        current.map((item) =>
          requestedIds.has(item.pidRefund)
            ? { ...item, refundStatus: 'requested' }
            : item,
        ),
      );
      setShowRefundDestinationModal(false);
      setShowRefundModal(true);
      router.refresh();
    } catch {
      setShowRefundDestinationModal(false);
      setWalletTransferFeedback({
        type: 'error',
        title: 'Request unsuccessful',
        message:
          'We could not submit your bank refund request. Please try again.',
      });
    } finally {
      setRequestingDestination(null);
    }
  };

  const totalAmount = refundData.reduce(
    (sum: number, item: any) =>
      isRefundable(item) && String(item.currency || '').toUpperCase() === 'NGN'
        ? sum + parseFloat(item.amount || 0)
        : sum,
    0,
  );
  const hasRefundableAmounts = refundData.some(isPendingRefund);
  const refundableRecords = refundData.filter(isPendingRefund);
  const hasPendingBankRefunds = hasRefundableAmounts;

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentPageData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-slate-950">
      {/* Hero Header */}
      <div className="bg-slate-900 pb-24 pt-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-400">
                  Wallet & Returns
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Refund Management
              </h1>
              <p className="mt-2 text-slate-400">
                View and track your return transactions across all Sure Imports
                services.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total Refundable
                </span>
                <span className="text-3xl font-black text-white">
                  ₦
                  {totalAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <button
                onClick={() => setShowRefundDestinationModal(true)}
                disabled={!hasRefundableAmounts}
                className="ml-4 flex h-12 items-center gap-2 rounded-xl bg-blue-600 px-6 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ArrowUpRight className="h-5 w-5" />
                Request Refund
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto -mt-10 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {/* Table Toolbar */}
          <div className="flex flex-col gap-4 border-b border-slate-100 p-6 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-slate-400" />
              <h2 className="font-bold text-slate-900 dark:text-white">
                Transaction History
              </h2>
            </div>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <Filter className="h-4 w-4 text-slate-400" />
                Filter: <span className="text-blue-600">{selectedFilter}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`}
                />
              </button>

              {showFilterDropdown && (
                <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-1 shadow-xl dark:border-slate-700 dark:bg-slate-800">
                  {filterOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSelectedFilter(option);
                        setShowFilterDropdown(false);
                        setCurrentPage(1);
                      }}
                      className={`w-full rounded-lg px-4 py-2 text-left text-sm font-medium transition ${
                        selectedFilter === option
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'
                          : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:bg-slate-800/50">
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Refund ID</th>
                  <th className="px-6 py-4">Amount (NGN)</th>
                  <th className="px-6 py-4">Service Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {currentPageData.length > 0 ? (
                  currentPageData.map((item: any, idx: number) => (
                    <tr
                      key={item.id}
                      className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-slate-400">
                        {(currentPage - 1) * itemsPerPage + idx + 1}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold uppercase tracking-tight text-slate-900 dark:text-white">
                        {item.pidRefund}
                      </td>
                      <td className="px-6 py-4 text-sm font-black text-slate-900 dark:text-white">
                        {formatRefundAmount(item.amount, item.currency)}
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-500">
                        {item.serviceType}
                      </td>
                      <td className="px-6 py-4">
                        <StatusTag status={item.refundStatus} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isPendingRefund(item) ? (
                          <button
                            onClick={() => transferRefundsToWallet([item])}
                            disabled={transferringRefundId === item.pidRefund}
                            className="text-xs font-bold text-blue-600 hover:underline disabled:cursor-wait disabled:opacity-60"
                          >
                            {transferringRefundId === item.pidRefund
                              ? 'Transferring...'
                              : 'Transfer to Wallet'}
                          </button>
                        ) : (
                          <button className="text-xs font-bold text-blue-600 hover:underline">
                            Details
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center">
                        <div className="rounded-full bg-slate-50 p-4 dark:bg-slate-800">
                          <Search className="h-8 w-8 text-slate-300" />
                        </div>
                        <h3 className="mt-4 font-bold text-slate-900 dark:text-white">
                          No refunds found
                        </h3>
                        <p className="text-sm text-slate-500">
                          Try adjusting your filter to find what you're looking
                          for.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 p-6 dark:border-slate-800">
              <span className="text-sm font-medium text-slate-500">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-30 dark:border-slate-700 dark:text-slate-400"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-30 dark:border-slate-700 dark:text-slate-400"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODALS - Redesigned for consistency */}
      <Dialog
        open={showRefundDestinationModal}
        onOpenChange={setShowRefundDestinationModal}
      >
        <DialogContent className="rounded-[32px] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">
              Withdraw Funds
            </DialogTitle>
            <DialogDescription className="text-center">
              Choose where you want your refund sent.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            <button
              onClick={requestBankRefund}
              disabled={
                !hasPendingBankRefunds || requestingDestination !== null
              }
              className="group flex flex-col items-center gap-2 rounded-2xl border-2 border-slate-100 p-6 transition hover:border-blue-600 hover:bg-blue-50/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:hover:bg-blue-900/10"
            >
              <Banknote className="h-8 w-8 text-slate-400 group-hover:text-blue-600" />
              <span className="font-bold text-slate-900 dark:text-white">
                {requestingDestination === 'bank'
                  ? 'Submitting...'
                  : 'Bank Transfer'}
              </span>
              <span className="text-xs text-slate-500">
                {hasPendingBankRefunds
                  ? 'Submit to admin for manual payment'
                  : 'Your available refunds are already requested'}
              </span>
            </button>
            <button
              onClick={async () => {
                setRequestingDestination('wallet');
                try {
                  await transferRefundsToWallet(refundableRecords);
                } finally {
                  setRequestingDestination(null);
                }
              }}
              disabled={
                refundableRecords.length === 0 || requestingDestination !== null
              }
              className="group flex flex-col items-center gap-2 rounded-2xl border-2 border-slate-100 p-6 transition hover:border-emerald-600 hover:bg-emerald-50/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:hover:bg-emerald-900/10"
            >
              <Wallet className="h-8 w-8 text-slate-400 group-hover:text-emerald-600" />
              <span className="font-bold text-slate-900 dark:text-white">
                {requestingDestination === 'wallet'
                  ? 'Transferring...'
                  : 'Sure Wallet'}
              </span>
              <span className="text-xs text-slate-500">
                Instant credit for future orders
              </span>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Processing Modal */}
      <Dialog open={showRefundModal} onOpenChange={setShowRefundModal}>
        <DialogContent className="rounded-[32px] text-center sm:max-w-md">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20">
            <CheckCircle className="h-10 w-10 text-blue-600" />
          </div>
          <DialogHeader>
            <DialogTitle className="mt-4 text-center text-2xl font-bold">
              Request Submitted
            </DialogTitle>
          </DialogHeader>
          <p className="leading-relaxed text-slate-500">
            Your bank refund will be processed and credited within{' '}
            <span className="font-bold text-slate-900 dark:text-white">
              7 business days
            </span>
            . Ensure your bank details are up to date in your profile.
          </p>
          <button
            onClick={() => setShowRefundModal(false)}
            className="mt-6 w-full rounded-xl bg-slate-900 py-3 font-bold text-white transition hover:bg-slate-800"
          >
            Got it
          </button>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(walletTransferFeedback)}
        onOpenChange={(open) => {
          if (!open) setWalletTransferFeedback(null);
        }}
      >
        <DialogContent className="rounded-[32px] p-8 text-center sm:max-w-md">
          <div
            className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
              walletTransferFeedback?.type === 'success'
                ? 'bg-emerald-100 dark:bg-emerald-900/30'
                : 'bg-rose-100 dark:bg-rose-900/30'
            }`}
          >
            {walletTransferFeedback?.type === 'success' ? (
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            ) : (
              <X className="h-8 w-8 text-rose-600" />
            )}
          </div>
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-slate-900 dark:text-white">
              {walletTransferFeedback?.title}
            </DialogTitle>
            <DialogDescription className="mt-2 text-center leading-relaxed text-slate-500">
              {walletTransferFeedback?.message}
            </DialogDescription>
          </DialogHeader>
          <button
            onClick={() => {
              const actionHref = walletTransferFeedback?.actionHref;
              setWalletTransferFeedback(null);
              if (actionHref) router.push(actionHref);
            }}
            className="mt-6 w-full rounded-xl bg-slate-900 py-3 font-bold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          >
            {walletTransferFeedback?.actionLabel || 'Done'}
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
