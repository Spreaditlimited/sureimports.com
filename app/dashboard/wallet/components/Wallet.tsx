'use client';

import { useEffect, useState } from 'react';
import { 
  Wallet as WalletIcon, 
  ArrowUpRight, 
  Plus, 
  History, 
  AlertCircle, 
  ArrowDownLeft, 
  ArrowUpRight as CreditIcon,
  ChevronRight,
  ShoppingBag,
  CreditCard,
  Banknote,
  Clock
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';
import { Card } from './ui/card';
import TopUpDialog from './TopUpDialog';
import PayoutRequestDialog from './PayoutRequestDialog';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Loading from '../../loading';
import { toast } from 'sonner';

export default function Wallet() {
  const { user } = useAuth();
  const router = useRouter();
  const [showTopUpDialog, setShowTopUpDialog] = useState(false);
  const [showPayoutRequestDialog, setShowPayoutRequestDialog] = useState(false);
  const [pendingPayout, setPendingPayout] = useState<any>(null);
  const [hasBankDetails, setHasBankDetails] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);
  const [statusx, setStatus] = useState<string | null>(null);
  const [customer, setCustomer] = useState<any | null>(null);
  const [transactionsx, setTransaction] = useState<any | null>(null);
  const [debitsData, setDebitsData] = useState<any>({ debits: [], totalDebited: 0, count: 0 });

  // Logic: Keep all your existing fetch functions as they are
  const pidUser = user?.pidUser;
  const email = user?.userEmail;

  useEffect(() => {
    const fetchData = async () => {
      if (!email) return;
      try {
        const [custRes, payoutRes, bankRes, debitRes] = await Promise.all([
          fetch(`/api/paystack/get-customer/${email}`).then(r => r.json()),
          fetch(`/api/payout-request/get-pending?pidUser=${pidUser}`).then(r => r.json()),
          fetch(`/api/user/check-bank-details?pidUser=${pidUser}`).then(r => r.json()),
          fetch(`/api/wallet-debits?pidUser=${pidUser}`).then(r => r.json())
        ]);

        setStatus(custRes.statusx);
        setCustomer(custRes.customerDetails);
        setTransaction(custRes.transactionDetails);
        if (payoutRes.statusx === 'SUCCESS') setPendingPayout(payoutRes.data);
        if (bankRes.statusx === 'SUCCESS') setHasBankDetails(bankRes.hasBankDetails);
        if (debitRes.statusx === 'SUCCESS') setDebitsData(debitRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [email, pidUser]);

  const availableBalance = transactionsx?.totalAmount ?? 0;

  const mergedTransactions = [
    ...(transactionsx?.transactions || []).map((tx: any) => ({
      id: `c-${tx.reference}`,
      type: 'credit',
      title: tx.gateway_response || 'Wallet Top-up',
      amount: Number(tx.amount || 0) / 100,
      createdAt: tx.paid_at || tx.created_at,
    })),
    ...(debitsData?.debits || []).map((db: any) => ({
      id: `d-${db.txRef || db.id}`,
      type: 'debit',
      title: db.serviceDescription || 'Service Payment',
      amount: Number(db.amount || 0),
      createdAt: db.createdAt,
    })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (loading) return <Loading />;

  // Activation Screen Redesign
  if (statusx === 'NO_CUSTOMER' || statusx === 'NO_ACCOUNT') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#fcfcfd] p-6 dark:bg-slate-950">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-2xl dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30">
            <WalletIcon className="h-10 w-10" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Activate Wallet</h1>
          <p className="mt-4 text-slate-500">Initialize your secure payment profile to start shopping and managing funds.</p>
          <button 
             onClick={() => {/* Your existing walletActivation logic */}}
             className="mt-8 w-full rounded-2xl bg-blue-600 py-4 text-lg font-bold text-white shadow-xl transition hover:bg-blue-500"
          >
            Activate Now
          </button>
          <div className="mt-6 flex items-start gap-2 rounded-xl bg-amber-50 p-4 text-left text-xs text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>Ensure your phone number is verified in your <button onClick={() => router.push('/dashboard/profile-update')} className="font-bold underline">profile settings</button> before activation.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-slate-950">
      {/* Header Section */}
      <div className="bg-slate-900 pb-32 pt-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-blue-500/20">
                  Financial Hub
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">My Wallet</h1>
              <p className="mt-2 text-slate-400">Securely manage your balance, top-ups, and payout requests.</p>
            </div>

            {/* Main Balance Display */}
            <div className="flex items-center gap-6 rounded-3xl bg-white/5 p-6 backdrop-blur-md border border-white/10 shrink-0">
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Available Balance</span>
                <span className="text-4xl font-black text-white">
                  ₦{availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="h-12 w-px bg-white/10 hidden sm:block"></div>
              <button
                onClick={() => setShowTopUpDialog(true)}
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
              >
                <Plus className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto -mt-12 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        {/* Quick Actions Row */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <button 
            onClick={() => router.push('/dashboard/store?id=laptop')}
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/20"><ShoppingBag className="h-5 w-5" /></div>
              <div className="text-left"><p className="font-bold text-slate-900 dark:text-white">Shop Now</p><p className="text-xs text-slate-500">Spend wallet balance</p></div>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-300" />
          </button>

          <button 
            onClick={() => setShowPayoutRequestDialog(true)}
            disabled={availableBalance <= 0 || !!pendingPayout}
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-md disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-900/20"><Banknote className="h-5 w-5" /></div>
              <div className="text-left"><p className="font-bold text-slate-900 dark:text-white">{pendingPayout ? 'Payout Pending' : 'Withdraw'}</p><p className="text-xs text-slate-500">Transfer to bank</p></div>
            </div>
            <ArrowUpRight className="h-5 w-5 text-slate-300" />
          </button>

          <button 
            onClick={() => setShowTopUpDialog(true)}
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-purple-50 p-3 text-purple-600 dark:bg-purple-900/20"><CreditCard className="h-5 w-5" /></div>
              <div className="text-left"><p className="font-bold text-slate-900 dark:text-white">Top Up</p><p className="text-xs text-slate-500">Fund your account</p></div>
            </div>
            <Plus className="h-5 w-5 text-slate-300" />
          </button>
        </div>

        {/* Status Alerts Container */}
        <div className="space-y-4 mb-8">
          {!hasBankDetails && (
            <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/30 dark:bg-amber-900/10">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Bank account details are missing for payouts.</p>
              </div>
              <Button onClick={() => router.push('/dashboard/profile-update')} variant="outline" size="sm" className="border-amber-200 text-amber-700 bg-white">Add Bank Details</Button>
            </div>
          )}

          {pendingPayout && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900/30 dark:bg-blue-900/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <h3 className="font-bold text-blue-900 dark:text-blue-100">Pending Payout</h3>
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-blue-600">{pendingPayout.reference}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div><p className="text-[10px] font-bold uppercase text-slate-400">Amount</p><p className="text-sm font-bold">₦{pendingPayout.amount.toLocaleString()}</p></div>
                <div><p className="text-[10px] font-bold uppercase text-slate-400">Date</p><p className="text-sm font-bold">{new Date(pendingPayout.createdAt).toLocaleDateString()}</p></div>
                <div className="col-span-2"><p className="text-[10px] font-bold uppercase text-slate-400">Status</p><p className="text-sm font-bold text-blue-600 flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span> Processing</p></div>
              </div>
            </div>
          )}
        </div>

        {/* Transactions Section */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <History className="h-5 w-5 text-slate-400" />
              <h2 className="font-bold text-slate-900 dark:text-white">Transaction History</h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:bg-slate-800/50">
                  <th className="px-6 py-4">Transaction</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {mergedTransactions.length > 0 ? (
                  mergedTransactions.map((tx) => (
                    <tr key={tx.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`rounded-xl p-2 ${tx.type === 'credit' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' : 'bg-rose-50 text-rose-600 dark:bg-rose-900/20'}`}>
                            {tx.type === 'credit' ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{tx.title}</p>
                            <p className="text-[10px] font-mono text-slate-400">ID: {tx.id.split('-').pop()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400 uppercase">Successful</span>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-500">
                        {new Date(tx.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className={`px-6 py-4 text-right text-sm font-black ${tx.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {tx.type === 'credit' ? '+' : '-'}₦{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center">
                        <div className="rounded-full bg-slate-50 p-4 dark:bg-slate-800">
                          <History className="h-8 w-8 text-slate-300" />
                        </div>
                        <h3 className="mt-4 font-bold text-slate-900 dark:text-white">No transactions yet</h3>
                        <p className="text-sm text-slate-500">Your wallet activity will appear here.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Keep Dialogs as they were */}
      <TopUpDialog 
        bankName={customer?.bankName ?? ''}
        accountName={customer?.bankAccountName ?? ''}
        accountNumber={customer?.bankAccountNumber ?? ''}
        isOpen={showTopUpDialog} onClose={() => setShowTopUpDialog(false)} 
      />
      <PayoutRequestDialog 
        isOpen={showPayoutRequestDialog} 
        onClose={() => setShowPayoutRequestDialog(false)}
        walletBalance={availableBalance} pidUser={pidUser as string}
        onPayoutRequested={() => {/* refetch pending logic */}}
      />
    </div>
  );
}