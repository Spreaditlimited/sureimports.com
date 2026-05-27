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
  Search
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/dialog';

const STATUS_MAP = {
  Paid: { label: 'Paid', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
  Pending: { label: 'Pending', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
  Requested: { label: 'Requested', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  Rejected: { label: 'Rejected', color: 'bg-rose-500/10 text-rose-600 border-rose-500/20' },
  Cancelled: { label: 'Cancelled', color: 'bg-slate-500/10 text-slate-600 border-slate-500/20' },
};

function StatusTag({ status }: { status: string }) {
  const config = STATUS_MAP[status] || STATUS_MAP.Pending;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${config.color}`}>
      {config.label}
    </span>
  );
}

export default function RefundsPage({ records }: any) {
  const router = useRouter();
  const [refundData] = useState(records || []);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showRefundDestinationModal, setShowRefundDestinationModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const filterOptions = ['All', 'Pending', 'Requested', 'Paid'];
  const itemsPerPage = 8;

  // Handle outside click for dropdown
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Case-insensitive status filtering to avoid hiding valid records
  // when database values are lowercase (e.g. "pending") but UI filters are title case.
  const filteredData = selectedFilter === 'All'
    ? refundData
    : refundData.filter(
        (item: any) =>
          String(item.refundStatus || '').toLowerCase() ===
          selectedFilter.toLowerCase(),
      );

  const transferRefundToWallet = async (pidRefund: string) => {
    try {
      const res = await fetch('/api/refunds/transfer-to-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pidRefund }),
      });
      const data = await res.json();
      if (!res.ok || data?.statusx !== 'SUCCESS') {
        if (data?.statusx === 'NO_WALLET') {
          alert(data.message || 'Please activate your wallet first.');
          router.push('/dashboard/wallet');
          return;
        }
        alert(data?.message || 'Unable to transfer refund to wallet');
        return;
      }
      alert(data.message || 'Refund transferred to wallet successfully.');
      router.refresh();
    } catch (error) {
      alert('Failed to transfer refund to wallet');
    }
  };

  const totalAmount = filteredData.reduce((sum: number, item: any) => sum + parseFloat(item.amount || 0), 0);
  const hasRefundableAmounts = refundData.some((item: any) => parseFloat(item.amount) > 0);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentPageData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-slate-950">
      {/* Hero Header */}
      <div className="bg-slate-900 pb-24 pt-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-blue-500/20">
                  Wallet & Returns
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Refund Management</h1>
              <p className="mt-2 text-slate-400">View and track your return transactions across all Sure Imports services.</p>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-6 backdrop-blur-sm border border-white/10 shrink-0">
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Refundable</span>
                <span className="text-3xl font-black text-white">₦{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <button
                onClick={() => setShowRefundDestinationModal(true)}
                disabled={!hasRefundableAmounts}
                className="ml-4 flex h-12 items-center gap-2 rounded-xl bg-blue-600 px-6 font-bold text-white transition hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
              >
                <ArrowUpRight className="h-5 w-5" />
                Request Refund
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto -mt-10 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          {/* Table Toolbar */}
          <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-slate-400" />
              <h2 className="font-bold text-slate-900 dark:text-white">Transaction History</h2>
            </div>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <Filter className="h-4 w-4 text-slate-400" />
                Filter: <span className="text-blue-600">{selectedFilter}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showFilterDropdown && (
                <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-1 shadow-xl dark:border-slate-700 dark:bg-slate-800">
                  {filterOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => { setSelectedFilter(option); setShowFilterDropdown(false); setCurrentPage(1); }}
                      className={`w-full rounded-lg px-4 py-2 text-left text-sm font-medium transition ${
                        selectedFilter === option ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400'
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
                    <tr key={item.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-400 font-medium">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">{item.pidRefund}</td>
                      <td className="px-6 py-4 text-sm font-black text-slate-900 dark:text-white">₦{parseFloat(item.amount).toLocaleString()}</td>
                      <td className="px-6 py-4 text-xs text-slate-500 font-medium">{item.serviceType}</td>
                      <td className="px-6 py-4"><StatusTag status={item.refundStatus} /></td>
                      <td className="px-6 py-4 text-right">
                        {['pending', 'requested'].includes(String(item.refundStatus || '').toLowerCase()) ? (
                          <button
                            onClick={() => transferRefundToWallet(item.pidRefund)}
                            className="text-xs font-bold text-blue-600 hover:underline"
                          >
                            Transfer to Wallet
                          </button>
                        ) : (
                          <button className="text-xs font-bold text-blue-600 hover:underline">Details</button>
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
                        <h3 className="mt-4 font-bold text-slate-900 dark:text-white">No refunds found</h3>
                        <p className="text-sm text-slate-500">Try adjusting your filter to find what you're looking for.</p>
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
              <span className="text-sm font-medium text-slate-500">Page {currentPage} of {totalPages}</span>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-30 dark:border-slate-700 dark:text-slate-400"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
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
      <Dialog open={showRefundDestinationModal} onOpenChange={setShowRefundDestinationModal}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">Withdraw Funds</DialogTitle>
            <DialogDescription className="text-center">Choose where you want your refund sent.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            <button
              onClick={() => { setShowRefundDestinationModal(false); setShowRefundModal(true); }}
              className="group flex flex-col items-center gap-2 rounded-2xl border-2 border-slate-100 p-6 transition hover:border-blue-600 hover:bg-blue-50/50 dark:border-slate-800 dark:hover:bg-blue-900/10"
            >
              <Banknote className="h-8 w-8 text-slate-400 group-hover:text-blue-600" />
              <span className="font-bold text-slate-900 dark:text-white">Bank Transfer</span>
              <span className="text-xs text-slate-500">To your saved settlement account</span>
            </button>
            <button
              onClick={() => { setShowRefundDestinationModal(false); setShowWalletModal(true); }}
              className="group flex flex-col items-center gap-2 rounded-2xl border-2 border-slate-100 p-6 transition hover:border-emerald-600 hover:bg-emerald-50/50 dark:border-slate-800 dark:hover:bg-emerald-900/10"
            >
              <Wallet className="h-8 w-8 text-slate-400 group-hover:text-emerald-600" />
              <span className="font-bold text-slate-900 dark:text-white">Sure Wallet</span>
              <span className="text-xs text-slate-500">Instant credit for future orders</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Processing Modal */}
      <Dialog open={showRefundModal} onOpenChange={setShowRefundModal}>
        <DialogContent className="sm:max-w-md rounded-2xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20">
            <CheckCircle className="h-10 w-10 text-blue-600" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold mt-4">Request Submitted</DialogTitle>
          </DialogHeader>
          <p className="text-slate-500 leading-relaxed">
            Your bank refund will be processed and credited within <span className="font-bold text-slate-900 dark:text-white">7 business days</span>. 
            Ensure your bank details are up to date in your profile.
          </p>
          <button onClick={() => setShowRefundModal(false)} className="mt-6 w-full rounded-xl bg-slate-900 py-3 font-bold text-white transition hover:bg-slate-800">
            Got it
          </button>
        </DialogContent>
      </Dialog>

      {/* Wallet Error Modal */}
      <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
        <DialogContent className="sm:max-w-md rounded-2xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-900/20">
            <X className="h-10 w-10 text-rose-600" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold mt-4">Unavailable</DialogTitle>
          </DialogHeader>
          <p className="text-slate-500 leading-relaxed">
            Wallet refunds are currently disabled for maintenance. Please use the <span className="font-bold">Bank Transfer</span> option instead.
          </p>
          <button onClick={() => setShowWalletModal(false)} className="mt-6 w-full rounded-xl bg-slate-900 py-3 font-bold text-white transition hover:bg-slate-800">
            Close
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
