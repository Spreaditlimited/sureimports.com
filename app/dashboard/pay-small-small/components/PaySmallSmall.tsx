'use client';

import React, { useState, useEffect } from 'react';
import { 
  Wallet, Building2, User, Hash, Coins, 
  Package, Clock, CheckCircle2, XCircle, ArrowRight 
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { useAuth } from '@/app/context/AuthContext';
import { useNavigationWithAlert } from '@/hooks/useNavigationWithAlert';
import Loading from '../../loading';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { resolveMediaUrl } from '@/lib/cloudinary/url';

type Status = 'SAVED' | 'STARTED' | 'COMPLETED' | 'CANCELLED';

const CheckboxIcon = React.memo(({ checked }: { checked: boolean }) => (
  <div className="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border-2 transition-colors duration-200 cursor-pointer">
    <div className={`absolute inset-0 rounded-[4px] transition-colors ${checked ? 'bg-blue-600 border-blue-600' : 'bg-transparent border-slate-300 dark:border-slate-600'}`} />
    {checked && (
      <svg className="relative z-10 h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    )}
  </div>
));

function WalletPaymentDialog({
  isOpen, onClose, walletBalance, totalAmount, productName, onPaymentConfirmed, isProcessing,
}: any) {
  const formatAmount = (amount: number) => amount.toLocaleString(undefined, { minimumFractionDigits: 2 });
  const hasInsufficientFunds = walletBalance < totalAmount;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-0 bg-white shadow-2xl dark:bg-slate-900 sm:max-w-md rounded-2xl overflow-hidden p-0">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
            <div className="h-8 w-8 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
              <Wallet className="h-4 w-4 text-emerald-600" />
            </div>
            Claim Product
          </DialogTitle>
        </div>

        <div className="p-6 space-y-6">
          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Product</p>
            <p className="mt-1 font-bold text-slate-900 dark:text-white">{productName}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3 dark:border-slate-800">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Wallet Balance</span>
              <span className="font-bold text-slate-900 dark:text-white">₦{formatAmount(walletBalance)}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-blue-50 p-3 dark:bg-blue-900/20">
              <span className="text-sm font-bold text-blue-900 dark:text-blue-100">Amount to Pay</span>
              <span className="font-black text-blue-600">₦{formatAmount(totalAmount)}</span>
            </div>
            <div className={`flex items-center justify-between rounded-xl p-3 ${hasInsufficientFunds ? 'bg-rose-50 dark:bg-rose-900/20' : 'bg-slate-50 dark:bg-slate-800/50'}`}>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Remaining Balance</span>
              <span className={`font-bold ${hasInsufficientFunds ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>
                ₦{formatAmount(walletBalance - totalAmount)}
              </span>
            </div>
          </div>

          {hasInsufficientFunds && (
            <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900/30 dark:bg-rose-900/10">
              <XCircle className="h-5 w-5 text-rose-600 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">Insufficient Funds</h4>
                <p className="mt-1 text-xs text-rose-700 dark:text-rose-300">
                  You need an additional ₦{formatAmount(totalAmount - walletBalance)} to claim this product.
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} disabled={isProcessing} className="flex-1 rounded-xl">Cancel</Button>
            <Button
              onClick={onPaymentConfirmed}
              disabled={hasInsufficientFunds || isProcessing}
              className="flex-1 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/20"
            >
              {isProcessing ? 'Processing...' : 'Pay & Claim'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function App({ productx, status }: { productx: any; status: string; }) {
  const router = useRouter();
  const { user } = useAuth();
  const navigateWithAlert = useNavigationWithAlert();

  const [products, setProducts] = useState<any[]>(productx);
  const [selectedStatus, setSelectedStatus] = useState<Status>('SAVED');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [cancellingProductId, setCancellingProductId] = useState<any[] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [pidUser] = useState(user?.pidUser);
  const [email] = useState(user?.userEmail);

  const [customer, setCustomer] = useState<any | null>(null);
  const [transactions, setTransaction] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusx, setStatus] = useState<string | null>(null);

  const [showWalletDialog, setShowWalletDialog] = useState(false);
  const [isWalletPaymentProcessing, setIsWalletPaymentProcessing] = useState(false);
  const [claimingProduct, setClaimingProduct] = useState<any>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const fetchCustomer = async () => {
      if (!email) { setLoading(false); return; }
      try {
        const response = await fetch(`/api/paystack/get-customer/${email}`);
        if (!response.ok) throw new Error('Failed to fetch customer data');
        const data: any = await response.json();
        setStatus(data.statusx);
        setCustomer(data.customerDetails);
        setTransaction(data.transactionDetails);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [email]);

  if (!mounted) return null;
  if (loading || !products) return <Loading />;

  // Existing logic wrappers (unchanged)
  const startPaySmallSmall = async (pidUser: any, pidPaySmallSmall: any, pidProduct: any, amount: any) => {
    if (statusx == 'NO_ACCOUNT' || statusx == 'NO_CUSTOMER') {
      toast.warning('Please activate your wallet to start paying small small.'); return;
    }
    if (transactions.totalAmount < 5000) {
      toast.warning('Minimum wallet balance of N5,000 required to activate.'); return;
    }
    try {
      setLoading(true);
      const res = await fetch(`/api/pay-small-small/start?pidUser=${pidUser}&pidPaySmallSmall=${pidPaySmallSmall}&pidProduct=${pidProduct}`);
      const data = await res.json();
      if (data.statusx == 'SUCCESS') { toast.success(data.message); router.push('/dashboard/pay-small-small?status=STARTED'); }
      else { toast.warning(data.message); }
    } catch (err) { toast.warning('Action failed!'); } finally { setLoading(false); }
  };

  const cancelPaySmallSmall = async (productId: any, pidUser: any, pidPaySmallSmall: any, pidProduct: any, amount: any) => {
    try {
      const res = await fetch(`/api/pay-small-small/cancel?pidUser=${pidUser}&pidPaySmallSmall=${pidPaySmallSmall}&pidProduct=${pidProduct}`);
      const data = await res.json();
      if (data.statusx == 'SUCCESS') {
        toast.success(data.message);
        window.location.reload();
      } else { toast.warning(data.message); }
    } catch (err) { toast.warning('Action failed!'); }
  };

  const handleWalletPaymentConfirmed = async () => {
    if (!claimingProduct) return;
    setIsWalletPaymentProcessing(true);
    try {
      const { pidUser, pidPaySmallSmall, pidProduct, amount } = claimingProduct;
      const apiUrl = new URL('/api/pay-from-wallet-pss', window.location.origin);
      apiUrl.searchParams.append('pidUser', pidUser);
      apiUrl.searchParams.append('pidPaySmallSmall', pidPaySmallSmall);
      apiUrl.searchParams.append('pidProduct', pidProduct);
      apiUrl.searchParams.append('amount', amount.toString());

      const response = await fetch(apiUrl.toString());
      const data = await response.json();
      
      setIsWalletPaymentProcessing(false); setShowWalletDialog(false); setClaimingProduct(null);

      if (data.statusx === 'SUCCESS') {
        toast.success(data.message);
        setTimeout(() => router.push('/dashboard/pay-small-small?status=COMPLETED'), 1500);
      } else { toast.warning(data.message || 'Claim failed.'); }
    } catch (error) {
      setIsWalletPaymentProcessing(false); setShowWalletDialog(false); setClaimingProduct(null);
      toast.error('Action failed!');
    }
  };

  const handleProductCheck = (productId: number) => {
    setProducts(products.map(p => p.id === productId ? { ...p, checked: !p.checked } : p));
  };

  const handleCancelConfirm = async () => {
    if (!cancellingProductId) return;
    setIsProcessing(true);
    await cancelPaySmallSmall(cancellingProductId[0], cancellingProductId[2], cancellingProductId[1], cancellingProductId[3], cancellingProductId[4]);
    setProducts(products.map(p => p.id === cancellingProductId[0] ? { ...p, status: 'CANCELLED', checked: false } : p));
    setIsProcessing(false); setShowSuccessDialog(true); setCancellingProductId(null); setShowCancelDialog(false);
  };

  const filteredProducts = products.filter((p) => p.status === selectedStatus);

  const TABS: { id: Status; label: string; icon: any }[] = [
    { id: 'SAVED', label: 'Saved', icon: Package },
    { id: 'STARTED', label: 'Started', icon: Clock },
    { id: 'COMPLETED', label: 'Completed', icon: CheckCircle2 },
    { id: 'CANCELLED', label: 'Cancelled', icon: XCircle },
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-slate-950">
      {/* Hero Header */}
      <div className="bg-slate-900 pb-32 pt-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-blue-500/20">
              Installments
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Pay Small Small</h1>
          <p className="mt-2 text-slate-400">Lock down your favorite products and pay at your own pace.</p>
        </div>
      </div>

      <main className="mx-auto -mt-16 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        
        {/* Account & Wallet Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Virtual Account Card */}
          <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-6 flex items-center gap-2">
              <Building2 className="h-4 w-4" /> Virtual Funding Account
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50">
                <div className="flex items-center gap-2 text-slate-400 mb-1"><Building2 className="h-3 w-3" /><span className="text-[10px] font-bold uppercase tracking-wider">Bank Name</span></div>
                <p className="font-bold text-slate-900 dark:text-white">{customer?.bankName || 'Not Assigned'}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50">
                <div className="flex items-center gap-2 text-slate-400 mb-1"><Hash className="h-3 w-3" /><span className="text-[10px] font-bold uppercase tracking-wider">Account Number</span></div>
                <p className="font-mono font-bold text-slate-900 dark:text-white text-lg tracking-wider">{customer?.bankAccountNumber || '----'}</p>
              </div>
              <div className="sm:col-span-2 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50">
                <div className="flex items-center gap-2 text-slate-400 mb-1"><User className="h-3 w-3" /><span className="text-[10px] font-bold uppercase tracking-wider">Account Name</span></div>
                <p className="font-bold text-slate-900 dark:text-white">{customer?.bankAccountName || '----'}</p>
              </div>
            </div>
          </div>

          {/* Wallet Balance Card */}
          <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-20"><Wallet className="h-24 w-24" /></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-blue-200 mb-1 flex items-center gap-2"><Coins className="h-4 w-4" /> Available Balance</p>
                <h3 className="text-4xl font-black mt-2">
                  ₦{Number(transactions?.totalAmount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h3>
              </div>
              <div className="mt-8 flex items-center gap-2">
                <span className={`flex h-2 w-2 rounded-full ${statusx === 'WALLET_READY' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
                  {statusx === 'WALLET_READY' ? 'Wallet Active' : 'Activation Required'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 flex items-center gap-2 overflow-x-auto no-scrollbar rounded-2xl bg-white p-2 shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`flex flex-1 min-w-[120px] items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                selectedStatus === tab.id
                  ? 'bg-slate-900 text-white shadow-md dark:bg-blue-600'
                  : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              <span className={`ml-1 rounded-full px-2 py-0.5 text-[10px] ${selectedStatus === tab.id ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                {products.filter(p => p.status === tab.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product: any) => {
            const canClaim = transactions?.totalAmount >= parseFloat(product.amount);
            const showCheck = product.status === 'SAVED' || product.status === 'STARTED';

            return (
              <div key={product.id} className="flex flex-col rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm transition hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
                {/* Image Section */}
                <div className="relative aspect-square w-full bg-slate-50 dark:bg-slate-800/50 p-6 flex items-center justify-center">
                  <img 
                    src={resolveMediaUrl(product?.store?.productImage ?? product?.productImage) || '/placeholder.png'} 
                    alt={product.productName} 
                    className="max-h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                    onError={(e) => e.currentTarget.style.display = 'none'}
                  />
                  {product.status === 'COMPLETED' && (
                    <div className="absolute top-4 right-4 rounded-full bg-emerald-500 text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-md">Paid Off</div>
                  )}
                </div>

                {/* Content Section */}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2">{product.productName}</h3>
                  <div className="mt-2 flex items-end gap-1">
                    <span className="text-2xl font-black text-blue-600">₦{parseFloat(product.amount).toLocaleString()}</span>
                  </div>
                  
                  <div className="mt-4 flex-1">
                    {product.status === 'STARTED' && product.createdAt && (
                      <CountdownTimer startDate={String(product.createdAt)} />
                    )}

                    {showCheck && (
                      <label
                        htmlFor={`pss-select-${product.id}`}
                        className="mt-4 flex items-start gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50 cursor-pointer"
                      >
                        <input
                          id={`pss-select-${product.id}`}
                          type="checkbox"
                          checked={Boolean(product.checked)}
                          onChange={() => handleProductCheck(product.id)}
                          className="sr-only"
                          aria-label={`Select ${product.productName}`}
                        />
                        <CheckboxIcon checked={product.checked} />
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                          {product.status === 'SAVED' ? 'Select to lock this price and start installment plan.' : 'Select to cancel your installment plan for this item.'}
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 space-y-3">
                    {product.status === 'SAVED' && (
                      <Button
                        onClick={() => startPaySmallSmall(product.pidUser, product.pidPaySmallSmall, product.pidProduct, product.amount)}
                        disabled={!product.checked}
                        className="w-full rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 h-12 font-bold"
                      >
                        Activate Plan
                      </Button>
                    )}

                    {product.status === 'STARTED' && (
                      <>
                        <Button
                          onClick={() => { setClaimingProduct(product); setShowWalletDialog(true); }}
                          disabled={!canClaim}
                          className="w-full rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 h-12 font-bold"
                        >
                          {canClaim ? 'Claim Product Now' : 'Insufficient Wallet Funds'}
                        </Button>
                        <Button
                          onClick={() => { setCancellingProductId([product.id, product.pidPaySmallSmall, product.pidUser, product.pidProduct, product.amount]); setShowCancelDialog(true); }}
                          variant="outline"
                          disabled={!product.checked}
                          className="w-full rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 h-12 font-bold dark:border-rose-900/50 dark:hover:bg-rose-900/20"
                        >
                          Cancel Plan
                        </Button>
                      </>
                    )}

                    {product.status === 'COMPLETED' && (
                      <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 py-3 text-sm font-bold text-emerald-600 dark:bg-emerald-900/20">
                        <CheckCircle2 className="h-5 w-5" /> Product Claimed
                      </div>
                    )}

                    {product.status === 'CANCELLED' && (
                      <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 py-3 text-sm font-bold text-rose-600 dark:bg-rose-900/20">
                        <XCircle className="h-5 w-5" /> Plan Cancelled
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white py-24 text-center dark:border-slate-700 dark:bg-slate-900 mt-6">
            <div className="rounded-full bg-slate-50 p-6 dark:bg-slate-800">
              <Package className="h-12 w-12 text-slate-300" />
            </div>
            <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">No {selectedStatus.toLowerCase()} items</h3>
            <p className="mt-2 text-slate-500 max-w-sm mx-auto">You don't have any products in this category yet. Browse the store to find items you love.</p>
            {selectedStatus === 'SAVED' && (
               <button onClick={() => router.push('/shop')} className="mt-8 flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 font-bold text-white shadow-lg transition hover:bg-blue-500">
                 Browse Store <ArrowRight className="h-4 w-4" />
               </button>
            )}
          </div>
        )}
      </main>

      {/* Dialogs */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <XCircle className="h-5 w-5 text-rose-500" /> Cancel Plan?
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Discontinuing this plan will automatically deduct a <span className="font-bold text-slate-900 dark:text-white">2.5% administrative fee</span> from the amount you've paid so far. The remaining balance will be returned to your wallet.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowCancelDialog(false)} className="flex-1 rounded-xl">Keep Plan</Button>
            <Button variant="destructive" onClick={handleCancelConfirm} disabled={isProcessing} className="flex-1 rounded-xl bg-rose-600">
              {isProcessing ? 'Processing...' : 'Confirm Cancel'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md rounded-2xl text-center p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">Successfully Cancelled</DialogTitle>
          <DialogDescription className="mt-2 text-slate-500">Your funds have been returned to your wallet.</DialogDescription>
          <Button onClick={() => setShowSuccessDialog(false)} className="mt-6 w-full rounded-xl bg-slate-900 text-white hover:bg-slate-800">Done</Button>
        </DialogContent>
      </Dialog>

      {claimingProduct && (
        <WalletPaymentDialog
          isOpen={showWalletDialog}
          onClose={() => { setShowWalletDialog(false); setClaimingProduct(null); }}
          walletBalance={transactions?.totalAmount || 0}
          totalAmount={parseFloat(claimingProduct.amount)}
          productName={products.find((p) => p.id === claimingProduct.productId)?.productName || 'Product'}
          onPaymentConfirmed={handleWalletPaymentConfirmed}
          isProcessing={isWalletPaymentProcessing}
        />
      )}
    </div>
  );
}

// Fixed Countdown Timer Component
const CountdownTimer = React.memo(({ startDate }: { startDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({ months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const start = new Date(startDate);
      const sixMonthsLater = new Date(start);
      sixMonthsLater.setMonth(start.getMonth() + 6);
      const difference = sixMonthsLater.getTime() - new Date().getTime();

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft({ months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        months: Math.floor(difference / (1000 * 60 * 60 * 24 * 30)),
        days: Math.floor((difference % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [startDate]);

  if (isExpired) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-center dark:border-rose-900/30 dark:bg-rose-900/10">
        <p className="text-xs font-bold text-rose-600 flex items-center justify-center gap-2"><XCircle className="h-4 w-4" /> Plan Expired</p>
      </div>
    );
  }

  const formatNum = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3 dark:border-blue-900/30 dark:bg-blue-900/10">
      <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-2 flex items-center gap-1"><Clock className="h-3 w-3" /> Time Remaining</p>
      <div className="flex items-center justify-between gap-1">
        {[
          { label: 'MO', val: timeLeft.months },
          { label: 'D', val: timeLeft.days },
          { label: 'H', val: timeLeft.hours },
          { label: 'M', val: timeLeft.minutes },
          { label: 'S', val: timeLeft.seconds }
        ].map((time, idx) => (
          <div key={idx} className="flex flex-col items-center justify-center rounded-lg bg-white p-2 shadow-sm dark:bg-slate-800 flex-1 border border-slate-100 dark:border-slate-700">
            <span className="text-xs font-black text-slate-900 dark:text-white">{formatNum(time.val)}</span>
            <span className="text-[8px] font-bold text-slate-400">{time.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
});
