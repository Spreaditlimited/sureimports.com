"use client";

import { useEffect, useState } from "react";
import ImageWithFallback from "../../favicon.ico";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import TopUpDialog from "./TopUpDialog";
import WithdrawDialog from "./WithdrawDialog";
import { useNavigationWithAlert } from '@/hooks/useNavigationWithAlert';
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import Loading from "../../loading";
import { toast } from "sonner";

interface WalletProps {
  onBackToStore: () => void;
  onBulkBuyer: () => void;
  balance: number;
  pendingWithdrawal: number;
  transactions: Transaction[];
  onWithdrawalConfirmed: (amount: number) => void;
}

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: string;
  description: string;
  date: string;
  orderNumber?: string;
}

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  //return `₦${amount.toLocaleString()}.00`;
  return "0.00"
};

export default function Wallet({ onBackToStore, onBulkBuyer, balance, pendingWithdrawal, transactions, onWithdrawalConfirmed }: WalletProps) {
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [showTopUpDialog, setShowTopUpDialog] = useState(false);

  const handleWithdraw = () => {
    setShowWithdrawDialog(true);
  };







///////////////////////////////////////////////////////
  const navigateWithAlert = useNavigationWithAlert();

  const { user, logout } = useAuth(); //DATA FROM SESSION
  const [pidUser, setPidUser] = useState(user?.pidUser);
  const [email, setEmail] = useState(user?.userEmail);
  const [amount, setAmount] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  const router = useRouter();

  //modal states
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);

  const [customer, setCustomer] = useState<any | null>(null);
  const [transactionsx, setTransaction] = useState<any | null>(null);

  const [loading, setLoading] = useState(true);
  const [statusx, setStatus] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`/api/paystack/get-customer/${email}`);

        // if (!response.ok) {
        //   throw new Error('Failed to fetch customer data');
        // }

        const data: any = await response.json();

        //alert(data.statusx + ' ' + data.message);
        setStatus(data.statusx);
        setMessage(data.message);
        setCustomer(data.customerDetails);
        setTransaction(data.transactionDetails);
      } catch (statusx) {
        //setError(error instanceof Error ? error.message : 'Unknown error');
        //setStatus(statusx as string);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [email]);

  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );

  ////////// NO CUSTOMER PROFILE //////////
  if (statusx == 'NO_CUSTOMER')
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4 dark:from-slate-900 dark:to-slate-800">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-slate-800 dark:shadow-slate-700/20">
          <div className="flex flex-col items-center space-y-6 text-center">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 sm:text-3xl">
              Wallet Activation
            </h1>

            <button
              onClick={() => walletActivation()}
              className="w-full max-w-xs rounded-lg bg-emerald-600 px-6 py-6 text-lg font-medium text-white transition-all hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:focus:ring-emerald-400"
            >
              Initialize Wallet Profile & Activate Wallet Account
            </button>

            <p className="text-center text-slate-600 dark:text-slate-300">
              {message}
            </p>

            <small className="text-orange-400">
              Please ensure you have updated your profile with your{' '}
              <b>Valid Phone Number</b> before you can be allowed to create a
              wallet
            </small>
            <small>
              <a href="/dashboard/profile-update">
                Click <b>here</b> Update Profile & Phone Number
              </a>
            </small>
          </div>
        </div>
      </div>
    );

  ////////// NO ACCOUNT //////////
  if (statusx == 'NO_ACCOUNT')
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4 dark:from-slate-900 dark:to-slate-800">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-slate-800 dark:shadow-slate-700/20">
          <div className="flex flex-col items-center space-y-6 text-center">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 sm:text-3xl">
              Wallet Activation
            </h1>

            <button
              onClick={() => walletActivation()}
              className="w-full max-w-xs rounded-lg bg-emerald-600 px-6 py-6 text-lg font-medium text-white transition-all hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:focus:ring-emerald-400"
            >
              Activate Wallet Account
            </button>

            <p className="text-center text-slate-600 dark:text-slate-300">
              {message}
            </p>

            <small className="text-orange-400">
              Please ensure you have updated your profile with your{' '}
              <b>Valid Phone Number</b> before you can be allowed to create a
              wallet
            </small>
            <small>
              <a href="/dashboard/profile-update">
                Click <b>here</b> Update Profile & Phone Number
              </a>
            </small>
          </div>
        </div>
      </div>
    );

  //////////// WALLET ACTIVATION //////////
  function walletActivation() {
    toast.info('Initializing Profile and Account');

    const activateWallet = async () => {
      try {
        const response = await fetch(
          '/api/paystack/wallet-customer-activation?pidUser=' + user?.pidUser,
        );

        // if (!response.ok) {
        //   throw new Error('Failed to fetch customer data');
        // }

        const data: any = await response.json();

        const customerID = data.customerID;

        if (data.statusx == 'SUCCESS') {
          toast.success(data.message);

          try {
            const response = await fetch(
              '/api/paystack/wallet-bank-activation',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  customer: customerID,
                  preferred_bank: 'wema-bank',
                }),
              },
            );

            const data: any = await response.json();

            if (!data.status) {
              //throw new Error(data.message || 'Failed to create dedicated account');
              toast.warning(
                'Account Activation Failed, please try again or contact support. Error-Msg: ' +
                  data.message,
              );
            } else {
              navigateWithAlert(
                '/dashboard/wallet?id=success',
                'success',
                'Wallet was successfully Activated!',
              );
              router.push('/dashboard/redirect?page=wallet');
            }
          } catch (err) {
            // setError(
            //   err instanceof Error ? err.message : 'An unknown error occurred',
            // );
            toast.warning(
              'Account Activation Failed, please try again or contact support. Error: ' +
                err,
            );
          } finally {
            setLoading(false);
          }
        }
      } catch (statusx) {
        //setError(error instanceof Error ? error.message : 'Unknown error');
        //setStatus(statusx as string);
      } finally {
        setLoading(false);
      }
    };

    activateWallet();
  }
///////////////////////////////////////////////////////





  // Calculate available balance (total minus pending withdrawal)
  // const availableBalance = balance - pendingWithdrawal;
  const availableBalance = transactionsx.totalAmount;
  const availableBalanceText = formatCurrency(availableBalance);
  const pendingBalanceText = formatCurrency(pendingWithdrawal);

const allTransactions: any[] = [
  ...(pendingWithdrawal > 0
    ? [{
        id: "pending",
        type: 'debit' as const,
        amount: pendingBalanceText,
        description: "Pending withdrawal request",
        date: "September 25, 2025"
      }]
    : []),
  ...(transactions ?? [])
];


  const handleTopUp = () => {
    setShowTopUpDialog(true);
  };


//alert(customer.bankName);



  return (
    <div className="bg-background min-h-screen">
      {/* Mobile Header */}
      <div className="md:hidden bg-[#0e0e1f] dark:bg-card w-full pt-12 pb-4">
        <div className="relative h-[42px] flex items-center">
          {/* Back Button */}
          <button
            onClick={onBackToStore}
            className="absolute left-4 w-8 h-8 flex items-center justify-center"
          >
            <svg className="w-6 h-6 text-white dark:text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 18L9 12L15 6" />
            </svg>
          </button>
          
          {/* Title */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h1 className="text-white dark:text-foreground font-medium">My Wallet</h1>
          </div>
          
          {/* Theme Toggle */}
          <div className="absolute right-4">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block bg-background mx-auto max-w-7xl px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBackToStore}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 18L9 12L15 6" />
                </svg>
              </button>
              <h1 className="text-2xl font-semibold text-foreground">My Wallet</h1>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={onBulkBuyer}
                className="bg-purple-600 hover:bg-purple-700 transition-colors flex items-center gap-2 px-4 py-2 rounded-lg"
              >
                <div className="w-5 h-5">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                    <path d="M16 11V7C16 5.89543 15.1046 5 14 5H10C8.89543 5 8 5.89543 8 7V11M5 9H19L18 21H6L5 9Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 12V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 12V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M15 12V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="font-medium text-white text-sm">Bulk Buyer?</span>
              </button>
              <button
                onClick={onBackToStore}
                className="bg-slate-600 hover:bg-slate-700 dark:bg-muted dark:hover:bg-muted/80 transition-colors flex items-center gap-2 px-4 py-2 rounded-lg"
              >
                <div className="w-5 h-5">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                    <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16 5 16H17M17 13V16M9 19.5A1.5 1.5 0 1 1 12 19.5 1.5 1.5 0 0 1 9 19.5ZM20 19.5A1.5 1.5 0 1 1 23 19.5 1.5 1.5 0 0 1 20 19.5Z" stroke="white" className="dark:stroke-foreground" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="font-medium text-white dark:text-foreground text-sm">Back to Store</span>
              </button>
            </div>
          </div>
          <p className="text-base text-muted-foreground mt-2">
            Manage your wallet balance, view transactions, and withdraw funds.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 md:px-8 pb-8 md:max-w-7xl md:mx-auto pt-6 md:pt-0">
        {/* Wallet Balance Card */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 border-none text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <p className="text-white/80 text-sm">Available Balance</p>
              <h2 className="text-3xl font-bold text-white">
                {
              
              ('₦' +
                (availableBalance as number)
                  .toFixed(2)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')) as string
              }
              </h2>
              {pendingWithdrawal > 0 && (
                <div className="mt-2">
                  <p className="text-white/60 text-xs">Pending Withdrawal</p>
                  <p className="text-white/80 text-sm font-medium">{pendingBalanceText}</p>
                </div>
              )}
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10H21M7 15H1M13 15H21M5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 5 3.89543 5 5V19C5 20.1046 3.89543 21 5 21Z" />
              </svg>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={handleTopUp}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white border-white/30"
              variant="outline"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V12M12 12V18M12 12H18M12 12H6" />
              </svg>
              Top Up
            </Button>
            <Button
              onClick={handleWithdraw}
              disabled={availableBalance <= 0 || pendingWithdrawal > 0}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
              variant="outline"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7C17 5.34315 15.6569 4 14 4H10C8.34315 4 7 5.34315 7 7V9M3 11L21 11M5 21H19C20.1046 21 21 20.1046 21 19 11H5C3.89543 11 3 11.8954 3 13V19C3 20.1046 3.89543 21 5 21Z" />
              </svg>
              {pendingWithdrawal > 0 ? 'Withdrawal Pending' : 'Withdraw'}
            </Button>
          </div>
        </Card>

        {/* Pending Withdrawal Notice */}
        {pendingWithdrawal > 0 && (
          <Card className="p-4 mb-6 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-amber-600 dark:bg-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-white dark:text-amber-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8V16M8 12H16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-amber-800 dark:text-amber-200">Withdrawal in Progress</h4>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  You have a pending withdrawal of <span className="font-semibold">{pendingBalanceText}</span>. This amount is being processed and will be credited to your registered bank account within 3 business days.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={onBackToStore}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7C16 5.89543 15.1046 5 14 5H10C8.89543 5 8 5.89543 8 7V11M5 9H19L18 21H6L5 9Z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-foreground">Shop Now</p>
                <p className="text-sm text-muted-foreground">Use wallet balance</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={onBackToStore}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M9 12L11 14L15 10" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-foreground">My Orders</p>
                <p className="text-sm text-muted-foreground">Track purchases</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={handleTopUp}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V12M12 12V18M12 12H18M12 12H6" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-foreground">Add Funds</p>
                <p className="text-sm text-muted-foreground">Top up wallet</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Transaction History */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Transactions</h3>
          
          {allTransactions.length > 0 ? (
            <div className="space-y-4">
              {allTransactions.map((transaction) => (
                <div key={transaction.id} className={`flex items-center justify-between p-4 border rounded-lg ${
                  transaction.id === 'pending' 
                    ? 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20' 
                    : 'border-border'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.id === 'pending'
                        ? 'bg-amber-100 dark:bg-amber-900/30'
                        : transaction.type === 'credit' 
                        ? 'bg-green-100 dark:bg-green-900/30' 
                        : 'bg-red-100 dark:bg-red-900/30'
                    }`}>
                      {transaction.id === 'pending' ? (
                        <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8V16M8 12H16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" />
                        </svg>
                      ) : transaction.type === 'credit' ? (
                        <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16L3 12L7 8M21 12H3" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8L21 12L17 16M3 12H21" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{transaction.description}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{transaction.date}</span>
                        {transaction.orderNumber && (
                          <>
                            <span>•</span>
                            <span>{transaction.orderNumber}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={`font-semibold ${
                    transaction.id === 'pending'
                      ? 'text-amber-600 dark:text-amber-400'
                      : transaction.type === 'credit' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {transaction.id === 'pending' ? 'Pending ' : transaction.type === 'credit' ? '+' : '-'}{transaction.amount}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 opacity-50 text-muted-foreground">
                <svg className="block size-full" fill="none" viewBox="0 0 24 24">
                  <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No transactions yet</h3>
              <p className="text-muted-foreground">Your transaction history will appear here</p>
            </div>
          )}
        </Card>
      </div>

      {/* Top Up Dialog */}
      <TopUpDialog
          bankName={customer.bankName}
          accountName={customer.bankAccountName}
          accountNumber={customer.bankAccountNumber}
          isOpen={showTopUpDialog}
          onClose={() => setShowTopUpDialog(false)}
      />

      {/* Withdraw Dialog */}
      <WithdrawDialog
        isOpen={showWithdrawDialog}
        onClose={() => setShowWithdrawDialog(false)}
        walletBalance={availableBalanceText} // Pass the available balance, not total balance
        onWithdrawalConfirmed={onWithdrawalConfirmed}
      />
    </div>
  );
}