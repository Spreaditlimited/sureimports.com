'use client';

import { useState } from 'react';
import ImageWithFallback from '../../favicon.ico';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';
import { Card } from './ui/card';
import TopUpDialog from './TopUpDialog';
import WithdrawDialog from './WithdrawDialog';

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
  return '0.00';
};

export default function Wallet({
  onBackToStore,
  onBulkBuyer,
  balance,
  pendingWithdrawal,
  transactions,
  onWithdrawalConfirmed,
}: WalletProps) {
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [showTopUpDialog, setShowTopUpDialog] = useState(false);

  const handleWithdraw = () => {
    setShowWithdrawDialog(true);
  };

  // Calculate available balance (total minus pending withdrawal)
  const availableBalance = balance - pendingWithdrawal;
  const availableBalanceText = formatCurrency(availableBalance);
  const pendingBalanceText = formatCurrency(pendingWithdrawal);

  const allTransactions: any[] = [
    ...(pendingWithdrawal > 0
      ? [
          {
            id: 'pending',
            type: 'debit' as const,
            amount: pendingBalanceText,
            description: 'Pending withdrawal request',
            date: 'September 25, 2025',
          },
        ]
      : []),
    ...(transactions ?? []),
  ];

  const handleTopUp = () => {
    setShowTopUpDialog(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="w-full bg-[#0e0e1f] pb-4 pt-12 dark:bg-card md:hidden">
        <div className="relative flex h-[42px] items-center">
          {/* Back Button */}
          <button
            onClick={onBackToStore}
            className="absolute left-4 flex h-8 w-8 items-center justify-center"
          >
            <svg
              className="h-6 w-6 text-white dark:text-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 18L9 12L15 6"
              />
            </svg>
          </button>

          {/* Title */}
          <div className="absolute left-1/2 -translate-x-1/2 transform">
            <h1 className="font-medium text-white dark:text-foreground">
              My Wallet
            </h1>
          </div>

          {/* Theme Toggle */}
          <div className="absolute right-4">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="mx-auto hidden max-w-7xl bg-background px-8 py-12 md:block">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBackToStore}
                className="rounded-lg p-2 transition-colors hover:bg-accent"
              >
                <svg
                  className="h-6 w-6 text-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 18L9 12L15 6"
                  />
                </svg>
              </button>
              <h1 className="text-2xl font-semibold text-foreground">
                My Wallet
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={onBulkBuyer}
                className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 transition-colors hover:bg-purple-700"
              >
                <div className="h-5 w-5">
                  <svg
                    className="block size-full"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M16 11V7C16 5.89543 15.1046 5 14 5H10C8.89543 5 8 5.89543 8 7V11M5 9H19L18 21H6L5 9Z"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 12V16"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 12V16"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15 12V16"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-white">
                  Bulk Buyer?
                </span>
              </button>
              <button
                onClick={onBackToStore}
                className="flex items-center gap-2 rounded-lg bg-slate-600 px-4 py-2 transition-colors hover:bg-slate-700 dark:bg-muted dark:hover:bg-muted/80"
              >
                <div className="h-5 w-5">
                  <svg
                    className="block size-full"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16 5 16H17M17 13V16M9 19.5A1.5 1.5 0 1 1 12 19.5 1.5 1.5 0 0 1 9 19.5ZM20 19.5A1.5 1.5 0 1 1 23 19.5 1.5 1.5 0 0 1 20 19.5Z"
                      stroke="white"
                      className="dark:stroke-foreground"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-white dark:text-foreground">
                  Back to Store
                </span>
              </button>
            </div>
          </div>
          <p className="mt-2 text-base text-muted-foreground">
            Manage your wallet balance, view transactions, and withdraw funds.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-8 pt-6 md:mx-auto md:max-w-7xl md:px-8 md:pt-0">
        {/* Wallet Balance Card */}
        <Card className="mb-6 border-none bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white dark:from-indigo-700 dark:to-purple-700">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-white/80">Available Balance</p>
              <h2 className="text-3xl font-bold text-white">
                {availableBalanceText}
              </h2>
              {pendingWithdrawal > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-white/60">Pending Withdrawal</p>
                  <p className="text-sm font-medium text-white/80">
                    {pendingBalanceText}
                  </p>
                </div>
              )}
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10H21M7 15H1M13 15H21M5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 5 3.89543 5 5V19C5 20.1046 3.89543 21 5 21Z"
                />
              </svg>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleTopUp}
              className="flex-1 border-white/30 bg-white/20 text-white hover:bg-white/30"
              variant="outline"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V12M12 12V18M12 12H18M12 12H6"
                />
              </svg>
              Top Up
            </Button>
            <Button
              onClick={handleWithdraw}
              disabled={availableBalance <= 0 || pendingWithdrawal > 0}
              className="flex-1 border-white/30 bg-white/20 text-white hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-50"
              variant="outline"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 9V7C17 5.34315 15.6569 4 14 4H10C8.34315 4 7 5.34315 7 7V9M3 11L21 11M5 21H19C20.1046 21 21 20.1046 21 19 11H5C3.89543 11 3 11.8954 3 13V19C3 20.1046 3.89543 21 5 21Z"
                />
              </svg>
              {pendingWithdrawal > 0 ? 'Withdrawal Pending' : 'Withdraw'}
            </Button>
          </div>
        </Card>

        {/* Pending Withdrawal Notice */}
        {pendingWithdrawal > 0 && (
          <Card className="mb-6 border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-amber-600 dark:bg-amber-400">
                <svg
                  className="h-3 w-3 text-white dark:text-amber-900"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8V16M8 12H16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-amber-800 dark:text-amber-200">
                  Withdrawal in Progress
                </h4>
                <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                  You have a pending withdrawal of{' '}
                  <span className="font-semibold">{pendingBalanceText}</span>.
                  This amount is being processed and will be credited to your
                  registered bank account within 3 business days.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card
            className="cursor-pointer p-4 transition-shadow hover:shadow-md"
            onClick={onBackToStore}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <svg
                  className="h-5 w-5 text-blue-600 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7C16 5.89543 15.1046 5 14 5H10C8.89543 5 8 5.89543 8 7V11M5 9H19L18 21H6L5 9Z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-foreground">Shop Now</p>
                <p className="text-sm text-muted-foreground">
                  Use wallet balance
                </p>
              </div>
            </div>
          </Card>

          <Card
            className="cursor-pointer p-4 transition-shadow hover:shadow-md"
            onClick={onBackToStore}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                <svg
                  className="h-5 w-5 text-green-600 dark:text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M9 12L11 14L15 10"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-foreground">My Orders</p>
                <p className="text-sm text-muted-foreground">Track purchases</p>
              </div>
            </div>
          </Card>

          <Card
            className="cursor-pointer p-4 transition-shadow hover:shadow-md"
            onClick={handleTopUp}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <svg
                  className="h-5 w-5 text-purple-600 dark:text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V12M12 12V18M12 12H18M12 12H6"
                  />
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
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            Recent Transactions
          </h3>

          {allTransactions.length > 0 ? (
            <div className="space-y-4">
              {allTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className={`flex items-center justify-between rounded-lg border p-4 ${
                    transaction.id === 'pending'
                      ? 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20'
                      : 'border-border'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        transaction.id === 'pending'
                          ? 'bg-amber-100 dark:bg-amber-900/30'
                          : transaction.type === 'credit'
                            ? 'bg-green-100 dark:bg-green-900/30'
                            : 'bg-red-100 dark:bg-red-900/30'
                      }`}
                    >
                      {transaction.id === 'pending' ? (
                        <svg
                          className="h-5 w-5 text-amber-600 dark:text-amber-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8V16M8 12H16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                          />
                        </svg>
                      ) : transaction.type === 'credit' ? (
                        <svg
                          className="h-5 w-5 text-green-600 dark:text-green-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16L3 12L7 8M21 12H3"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5 text-red-600 dark:text-red-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8L21 12L17 16M3 12H21"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {transaction.description}
                      </p>
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
                  <div
                    className={`font-semibold ${
                      transaction.id === 'pending'
                        ? 'text-amber-600 dark:text-amber-400'
                        : transaction.type === 'credit'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {transaction.id === 'pending'
                      ? 'Pending '
                      : transaction.type === 'credit'
                        ? '+'
                        : '-'}
                    {transaction.amount}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 h-16 w-16 text-muted-foreground opacity-50">
                <svg
                  className="block size-full"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-medium text-foreground">
                No transactions yet
              </h3>
              <p className="text-muted-foreground">
                Your transaction history will appear here
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Top Up Dialog */}
      <TopUpDialog
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
