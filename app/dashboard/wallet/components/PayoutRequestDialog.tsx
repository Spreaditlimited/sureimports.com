'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface PayoutRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  walletBalance: number;
  pidUser: string;
  onPayoutRequested: () => void;
}

export default function PayoutRequestDialog({
  isOpen,
  onClose,
  walletBalance,
  pidUser,
  onPayoutRequested,
}: PayoutRequestDialogProps) {
  const router = useRouter();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [payoutRequested, setPayoutRequested] = useState(false);
  const [showNoBankDetails, setShowNoBankDetails] = useState(false);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [payoutData, setPayoutData] = useState<any>(null);

  const formatCurrency = (amount: number): string => {
    return `₦${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  const validateAmount = (): boolean => {
    const payoutAmount = parseFloat(amount);

    if (!amount || isNaN(payoutAmount) || payoutAmount <= 0) {
      setError('Please enter a valid amount');
      return false;
    }

    if (payoutAmount > walletBalance) {
      setError('Amount exceeds available balance');
      return false;
    }

    if (payoutAmount < 1000) {
      setError('Minimum payout amount is ₦1,000');
      return false;
    }

    setError('');
    return true;
  };

  const handleProceedToConfirmation = () => {
    if (!validateAmount()) {
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmPayout = async () => {
    if (!validateAmount()) {
      return;
    }

    setIsLoading(true);

    try {
      const payoutAmount = parseFloat(amount);

      const response = await fetch('/api/payout-request/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pidUser: pidUser,
          amount: payoutAmount,
        }),
      });

      const result = await response.json();

      if (result.statusx === 'SUCCESS') {
        console.log('Payout request created:', result.data);
        setPayoutData(result.data);
        toast.success(result.message);
        setShowConfirmation(false);
        setPayoutRequested(true);

        // Notify parent component to refresh
        onPayoutRequested();

        // Auto close after 5 seconds
        setTimeout(() => {
          handleClose();
        }, 5000);
      } else if (result.statusx === 'NO_BANK_DETAILS') {
        // Handle missing bank details
        console.error('No bank details found:', result.message);
        toast.error(result.message);
        setShowConfirmation(false);
        setShowNoBankDetails(true);
      } else if (result.statusx === 'PAYSTACK_ERROR') {
        // Handle Paystack transfer recipient creation error
        console.error('Paystack error:', result.message);
        toast.error(result.message);
        setShowConfirmation(false);
      } else {
        console.error('Payout request failed:', result.message);
        toast.error(result.message);
        setShowConfirmation(false);
      }
    } catch (error) {
      console.error('Error creating payout request:', error);
      toast.error('Failed to create payout request. Please try again later.');
      setShowConfirmation(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowConfirmation(false);
    setPayoutRequested(false);
    setShowNoBankDetails(false);
    setAmount('');
    setError('');
    setPayoutData(null);
    onClose();
  };

  const handleGoToSettings = () => {
    handleClose();
    router.push('/dashboard/profile');
  };

  // No Bank Details Screen
  if (showNoBankDetails) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              Bank Account Required
            </DialogTitle>
            <DialogDescription>
              You need to add your bank account details before you can request a
              payout.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-600 dark:bg-red-400">
                  <svg
                    className="h-3 w-3 text-white dark:text-red-900"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-red-800 dark:text-red-200">
                    No Bank Account Found
                  </h4>
                  <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                    We couldn't find any bank account details associated with
                    your profile. Please add your bank account information to
                    receive payouts.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <h4 className="mb-3 font-medium text-foreground">
                What you need to do:
              </h4>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      1
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Go to Profile Settings
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Navigate to your profile settings page
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      2
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Add Bank Details
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Enter your bank name, account number, and account name
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      3
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Verify Your Account
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Complete the verification process to confirm your bank
                      account
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                    <svg
                      className="h-3 w-3 text-green-600 dark:text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Request Payout
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Once verified, you can request payouts anytime
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 dark:bg-blue-400">
                  <svg
                    className="h-3 w-3 text-white dark:text-blue-900"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-200">
                    Security Note
                  </h4>
                  <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                    Your bank details are securely encrypted and will only be
                    used for processing your payout requests.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleGoToSettings}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
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
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Go to Profile Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Success Screen
  if (payoutRequested && payoutData) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              Payout Request Submitted
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-600 dark:bg-green-400">
                  <svg
                    className="h-3 w-3 text-white dark:text-green-900"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-200">
                    Request Confirmed
                  </h4>
                  <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                    Your payout request for{' '}
                    <span className="font-semibold">
                      {formatCurrency(payoutData.amount)}
                    </span>{' '}
                    has been submitted successfully.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <h4 className="mb-3 font-medium text-foreground">
                Payout Details:
              </h4>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reference:</span>
                  <span className="font-mono text-foreground">
                    {payoutData.reference}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(payoutData.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                    Pending
                  </span>
                </div>
              </div>
            </div>

            {payoutData.bankDetails && (
              <div className="rounded-lg bg-muted p-4">
                <h4 className="mb-3 font-medium text-foreground">
                  Bank Details:
                </h4>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bank:</span>
                    <span className="text-foreground">
                      {payoutData.bankDetails.bankName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account:</span>
                    <span className="font-mono text-foreground">
                      {payoutData.bankDetails.accountNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="text-foreground">
                      {payoutData.bankDetails.accountName}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-lg bg-muted p-4">
              <h4 className="mb-3 font-medium text-foreground">
                What happens next:
              </h4>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <svg
                      className="h-2.5 w-2.5 text-blue-600 dark:text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-muted-foreground">
                    Our team will process your payout within 24 hours
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                    <svg
                      className="h-2.5 w-2.5 text-purple-600 dark:text-purple-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 9V7C17 5.34315 15.6569 4 14 4H10C8.34315 4 7 5.34315 7 7V9M3 11L21 11M5 21H19C20.1046 21 21 20.1046 21 19V13C21 11.8954 20.1046 11 19 11H5C3.89543 11 3 11.8954 5 13V19C3 20.1046 3.89543 21 5 21Z"
                      />
                    </svg>
                  </div>
                  <span className="text-muted-foreground">
                    Funds will be transferred to your registered bank account
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                    <svg
                      className="h-2.5 w-2.5 text-orange-600 dark:text-orange-400"
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
                  <span className="text-muted-foreground">
                    Funds will be credited within 3 business days
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                This dialog will close automatically in a few seconds...
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Confirmation Screen
  if (showConfirmation) {
    const payoutAmount = parseFloat(amount);

    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                <svg
                  className="h-5 w-5 text-orange-600 dark:text-orange-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              Confirm Payout Request
            </DialogTitle>
            <DialogDescription>
              Please confirm that you want to request a payout of the specified
              amount.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-muted-foreground">
                  Available Balance:
                </span>
                <span className="font-medium text-foreground">
                  {formatCurrency(walletBalance)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Payout Amount:</span>
                <span className="text-lg font-semibold text-foreground">
                  {formatCurrency(payoutAmount)}
                </span>
              </div>
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
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
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-amber-800 dark:text-amber-200">
                    Please Note
                  </h4>
                  <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                    Once submitted, this payout request cannot be cancelled. The
                    funds will be transferred to your registered bank account.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmPayout}
              className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Confirm Payout Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Main Input Screen
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
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
                  d="M17 9V7C17 5.34315 15.6569 4 14 4H10C8.34315 4 7 5.34315 7 7V9M3 11L21 11M5 21H19C20.1046 21 21 20.1046 21 19V13C21 11.8954 20.1046 11 19 11H5C3.89543 11 3 11.8954 5 13V19C3 20.1046 3.89543 21 5 21Z"
                />
              </svg>
            </div>
            Request Payout
          </DialogTitle>
          <DialogDescription>
            Transfer funds from your wallet to your registered bank account.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Balance */}
          <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 dark:border-blue-800 dark:from-blue-900/20 dark:to-indigo-900/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Available Balance:
              </span>
              <span className="text-lg font-bold text-foreground">
                {formatCurrency(walletBalance)}
              </span>
            </div>
          </Card>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="payout-amount" className="text-sm font-medium">
              Payout Amount (₦)
            </Label>
            <Input
              id="payout-amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError('');
              }}
              min="1000"
              max={walletBalance}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <p className="text-xs text-muted-foreground">
              Min: ₦1,000 • Max: {formatCurrency(walletBalance)}
            </p>
          </div>

          {/* Information */}
          <Card className="p-4">
            <h4 className="mb-2 text-sm font-medium text-foreground">
              Important Information:
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <div className="mt-0.5 flex h-3 w-3 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    •
                  </span>
                </div>
                <span className="text-muted-foreground">
                  Funds will be transferred to your registered bank account
                </span>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-0.5 flex h-3 w-3 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    •
                  </span>
                </div>
                <span className="text-muted-foreground">
                  Processed within 24 hours, received in 3 business days
                </span>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-0.5 flex h-3 w-3 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    •
                  </span>
                </div>
                <span className="text-muted-foreground">
                  Funds deposited into this wallet are meant to be used for
                  purchases on the Sure Imports website. However, if you choose
                  to withdraw to your registered bank account, a 2% processing
                  fee applies, capped at ₦2,500.
                </span>
              </div>
            </div>
          </Card>

          {/* Bank Account Notice */}
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/20">
            <div className="flex items-start gap-2">
              <div className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-yellow-600 dark:bg-yellow-400">
                <svg
                  className="h-2.5 w-2.5 text-white dark:text-yellow-900"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-medium text-yellow-800 dark:text-yellow-200">
                  Bank Account Required
                </h4>
                <p className="mt-0.5 text-xs text-yellow-700 dark:text-yellow-300">
                  Ensure your bank details are added in account settings.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleProceedToConfirmation}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
            disabled={!amount || parseFloat(amount) <= 0}
          >
            Proceed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
