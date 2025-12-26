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

interface WithdrawDialogProps {
  isOpen: boolean;
  onClose: () => void;
  walletBalance: string;
  onWithdrawalConfirmed: (amount: number) => void;
}

export default function WithdrawDialog({
  isOpen,
  onClose,
  walletBalance,
  onWithdrawalConfirmed,
}: WithdrawDialogProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [withdrawalRequested, setWithdrawalRequested] = useState(false);
  const [withdrawalType, setWithdrawalType] = useState<'full' | 'partial'>(
    'full',
  );
  const [partialAmount, setPartialAmount] = useState('');
  const [error, setError] = useState('');

  // Extract numeric value from wallet balance string
  //const availableBalance = parseFloat(walletBalance.replace(/[₦,\s]/g, '').split('.')[0]);

  const availableBalance = parseFloat(walletBalance);

  //alert(availableBalance);
  const formatCurrency = (amount: number): string => {
    return `₦${amount.toLocaleString()}.00`;
  };

  const getWithdrawalAmount = (): number => {
    //return 5;
    if (withdrawalType === 'full') {
      return availableBalance;
    } else {
      const amount = parseFloat(partialAmount);
      return isNaN(amount) ? 0 : amount;
    }
  };

  const validatePartialAmount = (): boolean => {
    if (withdrawalType === 'full') {
      return true; // No validation needed for full withdrawal
    }

    const amount = parseFloat(partialAmount);

    if (!partialAmount || isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return false;
    }

    if (amount > availableBalance) {
      setError('Amount exceeds available balance');
      return false;
    }

    if (amount < 1000) {
      setError('Minimum withdrawal amount is ₦1,000');
      return false;
    }
    setError('');
    return true;
  };

  // Example of how to call this API route from your frontend
  const initiateRefund = async (transactionId: string, amount?: number) => {
    try {
      toast.info('Now Processing...' + amount);

      // Convert amount to kobo (multiply by 100 for Nigerian Naira)
      const amountInKobo = amount ? Math.round(amount * 100) : undefined;

      const response = await fetch('/api/paystack/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transaction: transactionId,
          amount: amountInKobo, // Amount in kobo (subunit of NGN)
          currency: 'NGN', // Nigerian Naira
          customer_note: 'Wallet withdrawal refund processed as requested',
          merchant_note: `Customer service withdrawal refund - Amount: ₦${amount?.toLocaleString()}`,
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log('Refund initiated:', result.data);
        toast.success(
          `Withdrawal of ₦${amount?.toLocaleString()} initiated successfully. You will receive the funds in your bank account within 3 business days.`,
        );
        return result.data;
      } else {
        console.error('Refund failed:', result.error);
        toast.error(`Withdrawal failed: ${result.error}`);
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error initiating refund:', error);
      toast.error('Failed to process withdrawal. Please try again later.');
      throw error;
    }
  };

  const handleProceedToConfirmation = () => {
    const withdrawalAmount = getWithdrawalAmount();

    if (withdrawalAmount <= 0) {
      toast.error('Invalid withdrawal amount');
      return;
    }

    toast.success('Processing withdrawal request...');

    // Call the refund API with the proper amount and currency
    initiateRefund('000015250905062953000000242556', withdrawalAmount)
      .then((data) => {
        console.log('Withdrawal successful:', data);

        // Update UI to show success
        setShowConfirmation(false);
        setWithdrawalRequested(true);

        // Auto close after 5 seconds
        setTimeout(() => {
          setWithdrawalRequested(false);
          setWithdrawalType('full');
          setPartialAmount('');
          setError('');
          onClose();
        }, 5000);
      })
      .catch((error) => {
        console.error('Withdrawal error:', error);
        toast.error('Failed to process withdrawal. Please try again later.');

        // Reset form state on error
        setShowConfirmation(false);
        setError('Withdrawal failed. Please try again.');
      });
  };

  const handleConfirmWithdrawal = () => {
    const withdrawalAmount = getWithdrawalAmount();
    onWithdrawalConfirmed(withdrawalAmount); // Call the callback with withdrawal amount
    setWithdrawalRequested(true);
    setShowConfirmation(false);

    // Auto close after 3 seconds
    setTimeout(() => {
      setWithdrawalRequested(false);
      onClose();
    }, 3000);
  };

  const handleClose = () => {
    setShowConfirmation(false);
    setWithdrawalRequested(false);
    setWithdrawalType('full');
    setPartialAmount('');
    setError('');
    onClose();
  };

  const withdrawalAmountText = formatCurrency(getWithdrawalAmount());

  if (withdrawalRequested) {
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
              Withdrawal Request Received
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
                    Your withdrawal request for{' '}
                    <span className="font-semibold">
                      {withdrawalAmountText}
                    </span>{' '}
                    has been received. This amount is no longer available in
                    your wallet and will be processed by our team.
                  </p>
                </div>
              </div>
            </div>

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
                    Our team will process your withdrawal within 24 hours
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
                    Funds will be credited to your bank account within 3
                    business days
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

  if (showConfirmation) {
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
              Confirm Withdrawal
            </DialogTitle>
            <DialogDescription>
              Please confirm that you want to withdraw{' '}
              {withdrawalType === 'full'
                ? 'your entire wallet balance'
                : 'the specified amount'}
              .
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-muted-foreground">
                  Available Balance:
                </span>
                <span className="font-medium text-foreground">
                  {
                    ('₦' +
                      (availableBalance as number)
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')) as string
                  }
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Withdrawal Amount:
                </span>
                <span className="text-lg font-semibold text-foreground">
                  {withdrawalAmountText}
                </span>
              </div>
              {withdrawalType === 'partial' && (
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Remaining Balance:
                  </span>
                  <span className="font-medium text-foreground">
                    {formatCurrency(availableBalance - getWithdrawalAmount())}
                  </span>
                </div>
              )}
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
                    This action cannot be reversed. The funds will be
                    transferred to your registered bank account in your account
                    settings.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmWithdrawal}
              className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700"
            >
              Confirm Withdrawal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
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
            Withdraw Funds
          </DialogTitle>
          <DialogDescription>
            Transfer your wallet balance to your registered bank account.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {/* Current Balance */}
          <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-3 dark:border-blue-800 dark:from-blue-900/20 dark:to-indigo-900/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Available Balance:
              </span>
              <span className="text-lg font-bold text-foreground">
                {
                  ('₦' +
                    (availableBalance as number)
                      .toFixed(2)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')) as string
                }
              </span>
            </div>
          </Card>

          {/* Withdrawal Type Selection */}
          <Card className="p-3">
            <h4 className="mb-2 text-sm font-medium text-foreground">
              Choose Withdrawal Option:
            </h4>

            <div className="space-y-2">
              {/* Full Withdrawal Option */}
              <div
                className={`cursor-pointer rounded-lg border p-2 transition-all ${
                  withdrawalType === 'full'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-border hover:border-blue-300'
                }`}
                onClick={() => {
                  setWithdrawalType('full');
                  setError('');
                }}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="full"
                    name="withdrawalType"
                    checked={withdrawalType === 'full'}
                    onChange={() => setWithdrawalType('full')}
                    className="h-4 w-4 text-blue-600"
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor="full"
                      className="cursor-pointer text-sm font-medium"
                    >
                      Withdraw Everything
                    </Label>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Withdraw your entire wallet balance ({walletBalance})
                    </p>
                  </div>
                </div>
              </div>

              {/* Partial Withdrawal Option */}
              <div
                className={`cursor-pointer rounded-lg border p-2 transition-all ${
                  withdrawalType === 'partial'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-border hover:border-blue-300'
                }`}
                onClick={() => {
                  setWithdrawalType('partial');
                  setError('');
                }}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="partial"
                    name="withdrawalType"
                    checked={withdrawalType === 'partial'}
                    onChange={() => setWithdrawalType('partial')}
                    className="h-4 w-4 text-blue-600"
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor="partial"
                      className="cursor-pointer text-sm font-medium"
                    >
                      Partial Withdrawal
                    </Label>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Withdraw a specific amount
                    </p>
                  </div>
                </div>
              </div>

              {/* Partial Amount Input */}
              {withdrawalType === 'partial' && (
                <div className="ml-6 space-y-1.5">
                  <Label htmlFor="amount" className="text-xs font-medium">
                    Withdrawal Amount (₦)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={partialAmount}
                    onChange={(e) => {
                      setPartialAmount(e.target.value);
                      setError('');
                    }}
                    min="1000"
                    max={availableBalance}
                    className={`text-sm ${error ? 'border-red-500' : ''}`}
                  />
                  {error && <p className="text-xs text-red-500">{error}</p>}
                  <p className="text-xs text-muted-foreground">
                    Min: ₦1,000 • Max: {walletBalance}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Withdrawal Information - Condensed */}
          <Card className="p-3">
            <h4 className="mb-2 text-sm font-medium text-foreground">
              Important Information:
            </h4>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-start gap-2">
                <div className="mt-0.5 flex h-3 w-3 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    •
                  </span>
                </div>
                <span className="text-muted-foreground">
                  Funds credited to your registered bank account
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

          {/* Bank Account Notice - Compact */}
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-2.5 dark:border-yellow-800 dark:bg-yellow-900/20">
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

        <DialogFooter className="gap-3 pt-2">
          <Button variant="outline" onClick={onClose} className="text-sm">
            Cancel
          </Button>
          <Button
            onClick={handleProceedToConfirmation}
            className="bg-blue-600 text-sm hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
            disabled={
              withdrawalType === 'partial' &&
              (!partialAmount || parseFloat(partialAmount) <= 0)
            }
          >
            Proceed with Withdrawal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
